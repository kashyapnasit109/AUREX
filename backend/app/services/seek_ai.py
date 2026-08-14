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

        try:
            # 90-second timeout for large model generation
            with httpx.Client(timeout=90.0) as client:
                response = client.post(settings.SEEK_AI_URL, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    text_content = data.get("content", [{}])[0].get("text", "")
                    logger.info(f"[SeekAI {settings.SEEK_AI_MODEL}] Response received ({len(text_content)} chars)")
                    return text_content
                else:
                    error_msg = f"SeekAI API Error (HTTP {response.status_code}): {response.text}"
                    logger.error(error_msg)
                    raise HTTPException(status_code=response.status_code, detail=error_msg)
        except httpx.TimeoutException:
            error_msg = "SeekAI Timeout Error: Request to seekai.cc timed out after 90 seconds."
            logger.error(error_msg)
            raise HTTPException(status_code=504, detail=error_msg)
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            error_msg = f"SeekAI Request Error: {str(e)}"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
