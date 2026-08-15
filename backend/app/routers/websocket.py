import asyncio
import json
import random
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.event_bus import AurexEventBus

router = APIRouter(tags=["WebSocket Telemetry"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Initial handshake message
        await websocket.send_json({
            "type": "SYSTEM_INIT",
            "message": "Connected to AUREX Distributed Telemetry Engine (Real-Time)",
            "timestamp": time.time()
        })

        
        while True:
            # Stream simulated telemetry ticks & broadcast cross-module events
            await asyncio.sleep(2.0)
            
            # Orderbook tick payload
            btc_price = round(65000.0 + random.uniform(-150.0, 150.0), 2)
            eth_price = round(3450.0 + random.uniform(-15.0, 15.0), 2)
            
            telemetry_data = {
                "type": "TELEMETRY_TICK",
                "timestamp": time.strftime("%H:%M:%S UTC", time.gmtime()),
                "btc_price": btc_price,
                "eth_price": eth_price,
                "latency_ms": round(random.uniform(0.35, 0.48), 2),
                "processed_tx_rate": random.randint(41500, 42800)
            }
            
            await websocket.send_json(telemetry_data)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
