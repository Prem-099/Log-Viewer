from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self,user_id:int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"✅ User {user_id} connected. Total clients: {sum(len(v) for v in self.active_connections.values())}")

    def disconnect(self,user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        print(f"⚠️ User {user_id} disconnected. Remaining clients: {sum(len(v) for v in self.active_connections.values())}")

    async def send_personal_message(self, user_id: int, data: dict):
        """Send a message to all of this user's connections."""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(data)

    async def broadcast_all(self, data: dict):
        """Broadcast to all connected clients (if ever needed)."""
        for user_conns in self.active_connections.values():
            for connection in user_conns:
                await connection.send_json(data)