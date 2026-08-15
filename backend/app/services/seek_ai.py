"""
SeekAI & Multi-Provider LLM Integration Service for AUREX.
Supports:
  1. Groq Cloud (Ultra-fast inference: llama-3.3-70b, mixtral-8x7b, gemma2)
  2. OpenAI (GPT-4o, GPT-4o-mini, o1)
  3. Anthropic Claude & SeekAI.cc (Claude 3.5 Sonnet, Claude Opus)
  4. Google Gemini (Gemini 1.5 Pro / Flash via OpenAI-compatible endpoint or Gemini API)
  5. Local LM Studio (http://localhost:1234/v1)
  6. Local Ollama (http://localhost:11434/v1)
  7. Custom OpenAI-compatible endpoints
"""

import logging
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger("aurex.seek_ai")


class SeekAIService:
    """
    Unified multi-provider LLM querying and connection diagnostic service.
    """

    @classmethod
    def query(
        cls,
        prompt: str,
        system_instruction: str = "",
        provider: str = "cloud",
        model_name: str = "",
        custom_url: str = "",
        custom_api_key: str = "",
    ) -> str:
        """
        Route query to the appropriate provider based on provider name or API key format.
        """
        api_key = (custom_api_key or "").strip()
        url = (custom_url or "").strip()
        model = (model_name or "").strip()

        # Auto-detect provider if custom API key is supplied without explicit provider
        if api_key.startswith("gsk_") or provider == "groq":
            return cls._query_groq(prompt, system_instruction, model, api_key)
        elif api_key.startswith("sk-ant-") or (provider == "anthropic" and api_key):
            return cls._query_anthropic(prompt, system_instruction, model, api_key)
        elif api_key.startswith("AIza") or provider == "gemini":
            return cls._query_gemini(prompt, system_instruction, model, api_key)
        elif (api_key.startswith("sk-") and not api_key.startswith("sk-ant-")) or provider == "openai":
            return cls._query_openai(prompt, system_instruction, model, api_key, url)
        elif provider in ["local", "lmstudio", "ollama"]:
            return cls._query_local(prompt, system_instruction, model, url, provider)
        elif provider == "custom" or url:
            return cls._query_custom(prompt, system_instruction, model, url, api_key)
        else:
            # Default cloud provider (SeekAI / Anthropic-compatible or configured cloud key)
            if settings.SEEK_AI_KEY:
                return cls._query_seekai_cloud(prompt, system_instruction, model)
            elif api_key:
                return cls._query_openai_compatible(prompt, system_instruction, model, url or "https://api.openai.com/v1", api_key)
            return ""

    @classmethod
    def _query_groq(cls, prompt: str, system_instruction: str, model: str, api_key: str) -> str:
        """Query Groq ultra-fast API."""
        endpoint = "https://api.groq.com/openai/v1/chat/completions"
        target_model = model or "llama-3.3-70b-versatile"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": target_model,
            "messages": messages,
            "temperature": 0.5,
            "max_tokens": 2048
        }
        try:
            with httpx.Client(timeout=45.0) as client:
                res = client.post(endpoint, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
                logger.warning(f"[Groq] HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.warning(f"[Groq] Query failed: {e}")
        return ""

    @classmethod
    def _query_openai(cls, prompt: str, system_instruction: str, model: str, api_key: str, custom_url: str = "") -> str:
        """Query OpenAI API or custom OpenAI-compatible host."""
        endpoint = (custom_url.rstrip("/") + "/chat/completions") if custom_url else "https://api.openai.com/v1/chat/completions"
        target_model = model or "gpt-4o-mini"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": target_model,
            "messages": messages,
            "temperature": 0.5,
            "max_tokens": 2048
        }
        try:
            with httpx.Client(timeout=45.0) as client:
                res = client.post(endpoint, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
                logger.warning(f"[OpenAI] HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.warning(f"[OpenAI] Query failed: {e}")
        return ""

    @classmethod
    def _query_anthropic(cls, prompt: str, system_instruction: str, model: str, api_key: str) -> str:
        """Query official Anthropic API."""
        endpoint = "https://api.anthropic.com/v1/messages"
        target_model = model or "claude-3-5-sonnet-20241022"
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        payload = {
            "model": target_model,
            "max_tokens": 2048,
            "messages": [{"role": "user", "content": prompt}]
        }
        if system_instruction:
            payload["system"] = system_instruction

        try:
            with httpx.Client(timeout=45.0) as client:
                res = client.post(endpoint, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data.get("content", [{}])
                    if content and isinstance(content, list):
                        return content[0].get("text", "")
                logger.warning(f"[Anthropic] HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.warning(f"[Anthropic] Query failed: {e}")
        return ""

    @classmethod
    def _query_gemini(cls, prompt: str, system_instruction: str, model: str, api_key: str) -> str:
        """Query Google Gemini API via OpenAI compatibility layer."""
        target_model = model or "gemini-1.5-flash"
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": target_model,
            "messages": messages,
            "temperature": 0.5,
            "max_tokens": 2048
        }
        try:
            with httpx.Client(timeout=45.0) as client:
                res = client.post(endpoint, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
                logger.warning(f"[Gemini] HTTP {res.status_code}: {res.text[:200]}")
        except Exception as e:
            logger.warning(f"[Gemini] Query failed: {e}")
        return ""

    @classmethod
    def _query_seekai_cloud(cls, prompt: str, system_instruction: str = "", model_override: str = "") -> str:
        """Query SeekAI cloud proxy."""
        api_key = settings.SEEK_AI_KEY
        if not api_key:
            return ""

        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_override or settings.SEEK_AI_MODEL,
            "max_tokens": 2048,
            "messages": [{"role": "user", "content": prompt}]
        }
        if system_instruction:
            payload["system"] = system_instruction

        models_to_try = [
            model_override or settings.SEEK_AI_MODEL,
            "claude-opus-4-8",
            "claude-3-5-sonnet-20241022"
        ]
        for m in dict.fromkeys([m for m in models_to_try if m]):
            payload["model"] = m
            try:
                with httpx.Client(timeout=25.0) as client:
                    res = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        text = data.get("content", [{}])[0].get("text", "")
                        if text:
                            return text
            except Exception as e:
                logger.warning(f"[SeekAI {m}] failed: {e}")
        return ""

    @classmethod
    def _query_local(cls, prompt: str, system_instruction: str = "", model_name: str = "", custom_url: str = "", provider: str = "local") -> str:
        """Query LM Studio or Ollama local endpoint."""
        default_url = "http://localhost:11434/v1" if provider == "ollama" else settings.LM_STUDIO_URL
        base = (custom_url or default_url).rstrip("/")
        if not base.endswith("/v1") and not base.endswith("/chat/completions"):
            endpoint = f"{base}/v1/chat/completions"
        elif base.endswith("/v1"):
            endpoint = f"{base}/chat/completions"
        else:
            endpoint = base

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model_name or settings.LM_STUDIO_MODEL or "default",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2048
        }
        try:
            with httpx.Client(timeout=60.0) as client:
                res = client.post(endpoint, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
        except Exception as e:
            logger.warning(f"[Local AI {endpoint}] failed: {e}")
        return ""

    @classmethod
    def _query_custom(cls, prompt: str, system_instruction: str = "", model_name: str = "", custom_url: str = "", custom_api_key: str = "") -> str:
        """Query any custom OpenAI-compatible endpoint."""
        if not custom_url:
            return ""
        return cls._query_openai(prompt, system_instruction, model_name, custom_api_key, custom_url)

    @classmethod
    def _query_openai_compatible(cls, prompt: str, system_instruction: str, model: str, base_url: str, api_key: str) -> str:
        return cls._query_openai(prompt, system_instruction, model, api_key, base_url)

    @classmethod
    def test_ai_connection(cls, provider: str, api_key: str = "", url: str = "", model: str = "") -> Dict[str, Any]:
        """
        Live diagnostic test for any LLM provider.
        """
        import time
        t0 = time.perf_counter()
        test_prompt = "Respond with exactly: 'AUREX_AI_ACTIVE'"
        response_text = cls.query(
            prompt=test_prompt,
            provider=provider,
            model_name=model,
            custom_url=url,
            custom_api_key=api_key
        )
        latency_ms = round((time.perf_counter() - t0) * 1000, 1)

        if response_text:
            return {
                "connected": True,
                "provider": provider,
                "model": model or "auto-detected",
                "latency_ms": latency_ms,
                "message": f"Successfully connected to {provider.upper()} ({latency_ms}ms)",
                "sample_response": response_text[:120].strip()
            }
        else:
            return {
                "connected": False,
                "provider": provider,
                "latency_ms": latency_ms,
                "error": f"Connection test failed for provider '{provider}'. Check your API Key or local server status."
            }

    @classmethod
    def test_lm_studio_connection(cls, url: str = "") -> dict:
        """Test connection to LM Studio instance at /v1/models."""
        base_url = (url or settings.LM_STUDIO_URL).rstrip("/")
        models_endpoint = f"{base_url}/models" if base_url.endswith("/v1") else f"{base_url}/v1/models"
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.get(models_endpoint)
                if res.status_code == 200:
                    data = res.json()
                    models_list = [m.get("id", "") for m in data.get("data", [])]
                    return {
                        "connected": True,
                        "url": base_url,
                        "available_models": models_list,
                        "message": f"LM Studio connected! {len(models_list)} model(s) loaded."
                    }
                return {"connected": False, "error": f"HTTP {res.status_code}: {res.text[:100]}"}
        except Exception as e:
            return {"connected": False, "error": str(e)}

    @classmethod
    def query_claude(cls, prompt: str, system_instruction: str = "") -> str:
        """Legacy alias."""
        return cls.query(prompt, system_instruction=system_instruction)
