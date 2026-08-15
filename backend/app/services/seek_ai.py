"""
SeekAI Service — Multi-provider LLM integration for AUREX.
Supports:
  1. Cloud: SeekAI.cc API (Anthropic-compatible, models like claude-opus-4-8)
  2. Local: LM Studio API (local models via http://localhost:1234/v1)
  3. Custom: User-defined OpenAI-compatible API endpoints
"""

import logging
import httpx
from app.config import settings

logger = logging.getLogger("aurex.seek_ai")


class SeekAIService:
    """
    Multi-provider LLM query service supporting Cloud Claude and Local LM Studio.
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
        Route query to the appropriate provider.
        """
        if provider == "local" or provider == "lmstudio":
            return cls._query_lm_studio(prompt, system_instruction, model_name, custom_url)
        elif provider == "custom":
            return cls._query_custom(prompt, system_instruction, model_name, custom_url, custom_api_key)
        else:
            return cls._query_cloud(prompt, system_instruction, model_name)

    @classmethod
    def _query_cloud(cls, prompt: str, system_instruction: str = "", model_override: str = "") -> str:
        """
        Query SeekAI.cc (Anthropic-compatible API) with proper system parameter.
        """
        api_key = settings.SEEK_AI_KEY
        if not api_key:
            logger.warning("[SeekAI] NEW_API_KEY is missing in .env file.")
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
            "claude-opus-4-8"
        ]
        seen = set()
        unique_models = []
        for m in models_to_try:
            if m and m not in seen:
                seen.add(m)
                unique_models.append(m)

        for model_name in unique_models:
            payload["model"] = model_name
            try:
                with httpx.Client(timeout=4.0) as client:
                    response = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        text_content = data.get("content", [{}])[0].get("text", "")
                        if text_content:
                            logger.info(f"[SeekAI {model_name}] Response received ({len(text_content)} chars)")
                            return text_content
                    else:
                        logger.warning(f"[SeekAI {model_name}] HTTP {response.status_code}: {response.text[:200]}")
            except Exception as e:
                logger.warning(f"[SeekAI {model_name}] attempt failed: {str(e)}")


        return ""

    @classmethod
    def _query_lm_studio(cls, prompt: str, system_instruction: str = "", model_name: str = "", custom_url: str = "") -> str:
        """
        Query a local LM Studio server (OpenAI-compatible API at http://localhost:1234/v1/chat/completions).
        """
        base_url = (custom_url or settings.LM_STUDIO_URL).rstrip("/")
        if not base_url.endswith("/v1") and not base_url.endswith("/chat/completions"):
            endpoint = f"{base_url}/v1/chat/completions"
        elif base_url.endswith("/v1"):
            endpoint = f"{base_url}/chat/completions"
        else:
            endpoint = base_url

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model_name or settings.LM_STUDIO_MODEL or "default",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2048,
            "stream": False
        }

        try:
            with httpx.Client(timeout=60.0) as client:
                response = client.post(endpoint, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        text = choices[0].get("message", {}).get("content", "")
                        if text:
                            logger.info(f"[LM Studio] Response received ({len(text)} chars)")
                            return text
                else:
                    logger.warning(f"[LM Studio] HTTP {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.warning(f"[LM Studio] Connection failed: {str(e)}")

        return ""

    @classmethod
    def _query_custom(
        cls, prompt: str, system_instruction: str = "",
        model_name: str = "", custom_url: str = "", custom_api_key: str = ""
    ) -> str:
        """
        Query a custom OpenAI-compatible API endpoint.
        """
        if not custom_url:
            logger.warning("[Custom AI] No custom URL provided")
            return ""

        headers = {"Content-Type": "application/json"}
        if custom_api_key:
            headers["Authorization"] = f"Bearer {custom_api_key}"

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model_name or "default",
            "messages": messages,
            "max_tokens": 2048,
            "temperature": 0.7
        }

        try:
            with httpx.Client(timeout=45.0) as client:
                response = client.post(custom_url, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        text = choices[0].get("message", {}).get("content", "")
                        if text:
                            logger.info(f"[Custom {model_name}] Response received ({len(text)} chars)")
                            return text
                    content = data.get("content", [])
                    if content:
                        text = content[0].get("text", "")
                        if text:
                            return text
                else:
                    logger.warning(f"[Custom] HTTP {response.status_code}: {response.text[:200]}")
        except Exception as e:
            logger.warning(f"[Custom AI] Connection failed: {str(e)}")

        return ""

    @classmethod
    def test_lm_studio_connection(cls, url: str = "") -> dict:
        """Test connection to LM Studio instance at /v1/models."""
        base_url = (url or settings.LM_STUDIO_URL).rstrip("/")
        if not base_url.endswith("/v1"):
            models_endpoint = f"{base_url}/v1/models"
        else:
            models_endpoint = f"{base_url}/models"

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
        """Legacy method — routes to cloud provider."""
        return cls._query_cloud(prompt, system_instruction)
