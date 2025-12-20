import asyncio
import json 
import aiohttp
import websockets

BASE_URL = "http://127.0.0.1:8000"
WS_URL = "ws://127.0.0.1:8000/logs/ws"

async def get_sdk_token(session,api_key):
    payload = {"api_key": api_key}
    async with session.post(f"{BASE_URL}/sdk/auth", json=payload) as res:
        data = await res.json()
        if res.status == 200:
            print(f"✅ SDK Token generated successfully")
            return data["sdk_token"]
        else:
            print(f"Failed to generate sdk token")
            return None

async def send_log_via_ws(sdk_token):
    ws_url = f"{WS_URL}?token={sdk_token}"
    try:
        async with websockets.connect(ws_url) as websocket:
            print("✅ Connected to WebSocket")

            test_log = {
                "level": "info",
                "message": "Test log message2 from SDK!"
            }

            await websocket.send(json.dumps(test_log))
            print("📤 Log sent to WebSocket")

            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=3)
                print(f"📥 Server response: {response}")
            except asyncio.TimeoutError:
                print("⚠️ No server response ")

    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")


async def main():
    api_key = "3bOba_KB98rfbwBKalvBx4s17Ww3Y1u7rXMDYuj7NfI"

    async with aiohttp.ClientSession() as session:
        sdk_token = await get_sdk_token(session, api_key)
        if not sdk_token:
            return
        await send_log_via_ws(sdk_token)


if __name__ == "__main__":
    asyncio.run(main())