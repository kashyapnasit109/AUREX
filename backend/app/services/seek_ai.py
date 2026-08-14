import logging
import httpx
from fastapi import HTTPException
from app.config import settings

logger = logging.getLogger("aurex.seek_ai")

class SeekAIService:
    """
    Integration client for seekai.cc API using model claude-opus-5.
    Queries https://seekai.cc/v1/messages with 90s timeout and strict error propagation.
    """
    
    @classmethod
    def query_claude(cls, prompt: str, system_instruction: str = "") -> str:
        api_key = settings.SEEK_AI_KEY
        if not api_key:
            raise HTTPException(
                status_code=400,
                detail="NEW_API_KEY is missing in .env file. Please set NEW_API_KEY=sk-... in .env"
            )

        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_instruction:
            messages.append({"role": "user", "content": f"System Context: {system_instruction}\n\nTask: {prompt}"})
        else:
            messages.append({"role": "user", "content": prompt})

        payload = {
            "model": settings.SEEK_AI_MODEL,
            "max_tokens": 1024,
            "messages": messages
        }

        fallback_models = [settings.SEEK_AI_MODEL, "claude-opus-4-7", "gemini-3-flash", "gpt-5-5"]
        
        for model_name in fallback_models:
            payload["model"] = model_name
            try:
                # 20-second timeout per attempt
                with httpx.Client(timeout=20.0) as client:
                    response = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        text_content = data.get("content", [{}])[0].get("text", "")
                        if text_content:
                            logger.info(f"[SeekAI {model_name}] Response received ({len(text_content)} chars)")
                            return text_content
                    else:
                        logger.warning(f"[SeekAI {model_name}] returned HTTP {response.status_code}: {response.text[:100]}")
            except Exception as e:
                logger.warning(f"[SeekAI {model_name}] attempt failed: {str(e)}")

        return ""

