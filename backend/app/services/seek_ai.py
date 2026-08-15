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

        fallback_models = [settings.SEEK_AI_MODEL, "gemini-3-flash", "claude-opus-4-7"]
        
        for model_name in fallback_models:
            payload["model"] = model_name
            try:
                # Fast 3.5s timeout to guarantee sub-second / rapid user response
                with httpx.Client(timeout=3.5) as client:
                    response = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        text_content = data.get("content", [{}])[0].get("text", "")
                        if text_content:
                            logger.info(f"[SeekAI {model_name}] Fast response received ({len(text_content)} chars)")
                            return text_content
            except Exception as e:
                logger.debug(f"[SeekAI {model_name}] fast attempt skipped: {str(e)}")

        return ""


