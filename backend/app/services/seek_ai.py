import logging
import httpx
from app.config import settings

logger = logging.getLogger("aurex.seek_ai")

class SeekAIService:
    """
    Integration client for seekai.cc API using model claude-opus-5.
    Queries https://seekai.cc/v1/messages with fallback support.
    """
    
    @classmethod
    def query_claude(cls, prompt: str, system_instruction: str = "") -> str:
        api_key = settings.SEEK_AI_KEY
        if not api_key:
            logger.info("[SeekAI] NEW_API_KEY not set. Using compute-then-narrate engine fallback.")
            return ""

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

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    text_content = data.get("content", [{}])[0].get("text", "")
                    logger.info(f"[SeekAI claude-opus-5] Response received ({len(text_content)} chars)")
                    return text_content
                else:
                    logger.warning(f"[SeekAI] API HTTP {response.status_code}: {response.text}")
                    return ""
        except Exception as e:
            logger.error(f"[SeekAI] Request exception: {e}")
            return ""
