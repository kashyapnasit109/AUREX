import asyncio
import json
import logging
import time
from typing import Dict, Any, List, Callable

logger = logging.getLogger("aurex.event_bus")

class AurexEventBus:
    """
    In-memory Pub/Sub event bus connecting DataMart, Aiden AI, and Quant Studio.
    Enables real-time cross-module event propagation (DATA -> ANALYSIS -> INTELLIGENCE -> ACTION).
    """
    _subscribers: List[Callable[[Dict[str, Any]], None]] = []
    _event_history: List[Dict[str, Any]] = []
    
    @classmethod
    def subscribe(cls, callback: Callable[[Dict[str, Any]], None]):
        cls._subscribers.append(callback)
    
    @classmethod
    def publish(cls, topic: str, payload: Dict[str, Any]):
        event = {
            "topic": topic,
            "timestamp": time.time(),
            "iso_time": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "data": payload
        }
        cls._event_history.append(event)
        if len(cls._event_history) > 100:
            cls._event_history.pop(0)
            
        logger.info(f"[AUREX EVENT BUS] Published to {topic}: {payload.get('title', 'Event')}")
        
        for sub in cls._subscribers:
            try:
                sub(event)
            except Exception as e:
                logger.error(f"Error in event subscriber: {e}")
                
        return event

    @classmethod
    def get_recent_events(cls, limit: int = 10) -> List[Dict[str, Any]]:
        return cls._event_history[-limit:]
