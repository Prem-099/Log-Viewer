import json
import time
import aiohttp
import asyncio
import websockets
from websockets.exceptions import ConnectionClosedError, InvalidStatus
from websockets.protocol import State


class DistributedLogger:
    """
    A lightweight, async-capable SDK to send logs securely to the distributed log viewer backend.

    Features:
    - Auto fetches SDK token using API key
    - Auto reconnects on connection loss
    - Thread-safe logging (async lock)
    - Sync-friendly API (usable in normal Python apps)
    """

    def __init__(self, api_key: str, source_name: str, base_url: str = "http://127.0.0.1:8000"):
        self.api_key = api_key
        self.source_name = source_name
        self.base_url = base_url
        self.ws_url_base = base_url.replace("http", "ws") + "/logs/ws"
        self.websocket = None
        self.sdk_token = None
        self.expiry = None
        self.lock = asyncio.Lock()
        self._closed = False  # prevent background reconnects after close

    # -------------------- INTERNAL HELPERS -------------------- #

    async def _get_sdk_token(self):
        """Fetch a short-lived SDK JWT token using the permanent API key."""
        if not self.api_key:
            print("❌ Missing API key. Cannot fetch SDK token.")
            return None

        async with aiohttp.ClientSession() as session:
            payload = {"api_key": self.api_key}
            async with session.post(f"{self.base_url}/sdk/auth", json=payload) as res:
                data = await res.json()
                if res.status == 200:
                    self.sdk_token = data["sdk_token"]
                    self.expiry = data.get("exp", time.time() + 3600)
                    print("🔑 SDK token fetched successfully.")
                    return self.sdk_token
                else:
                    print(f"❌ Failed to get SDK token: {data}")
                    return None

    async def _refresh_sdk_token(self):
        """Refresh SDK token automatically if it's near expiry."""
        if not self.expiry or time.time() > self.expiry - 180:
            print("♻️ SDK token is expired or expiring soon — refreshing...")
            await self._get_sdk_token()

    async def _connect(self):
        """Connect to WebSocket endpoint with retry and auto-refresh."""
        if self._closed:
            return

        await self._refresh_sdk_token()  # Always refresh before initial connection
        if not self.sdk_token:
            print("❌ Cannot connect without valid SDK token.")
            return

        ws_url = f"{self.ws_url_base}?token={self.sdk_token}"

        try:
            self.websocket = await websockets.connect(ws_url)
            print(f"✅ Connected to WebSocket ({ws_url})")

        except InvalidStatus as e:
            if "403" in str(e):
                print("⚠️ Token invalid or expired. Refreshing...")
                await self._get_sdk_token()
                await self._connect()
            else:
                print(f"❌ WebSocket connection failed: {e}")

        except Exception as e:
            print(f"❌ Failed to connect WebSocket: {e}")
            await asyncio.sleep(2)
            await self._connect()

    async def _send(self, level: str, message: str, retries: int = 3):
        """Send a log to the WebSocket connection, with retry and locking."""
        if self._closed:
            return

        async with self.lock:
            await self._connect()

            if not self.websocket or self.websocket.state != State.OPEN:
                print("⚠️ WebSocket not connected. Skipping log.")
                return

            payload = json.dumps({
                "source": self.source_name,
                "level": level,
                "message": message
            })

            try:
                await self.websocket.send(payload)
                print(f"📤 Log sent: {payload}")

            except ConnectionClosedError:
                print("⚠️ WebSocket closed. Retrying...")
                self.websocket = None
                if retries > 0:
                    await asyncio.sleep(1)
                    await self._send(level, message, retries - 1)
                else:
                    print("❌ Max retries reached. Log not sent.")

            except Exception as e:
                print(f"❌ Error sending log: {e}")

    def _run_async(self, coro):
        """Allow sync code to call async methods safely."""
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(coro)
        except RuntimeError:
            asyncio.run(coro)

    # -------------------- PUBLIC METHODS --------------------

    def info(self, message: str):
        self._run_async(self._send("info", message))

    def warning(self, message: str):
        self._run_async(self._send("warning", message))

    def error(self, message: str):
        self._run_async(self._send("error", message))

    def debug(self, message: str):
        self._run_async(self._send("debug", message))

    async def close(self):
        """Close the WebSocket connection."""
        self._closed = True
        if self.websocket and self.websocket.state == State.OPEN:
            await self.websocket.close()
            print("🔒 WebSocket connection closed.")
        self.websocket = None
