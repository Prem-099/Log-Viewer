import asyncio
import json
import aiohttp
import websockets

BASE_URL = "http://127.0.0.1:8000"
WS_URL = "ws://127.0.0.1:8000/logs/ws"


async def register_user(session, username, email, password):
    payload = {"username": username, "email": email, "password": password}
    async with session.post(f"{BASE_URL}/auth/user/register", json=payload) as res:
        if res.status == 200:
            print("✅ User registered successfully")
        elif res.status == 400:
            print("⚠️ User might already exist")
        else:
            print(f"❌ Registration failed: {await res.text()}")


async def login_user(session, username, password):
    payload = {"username": username, "password": password}
    async with session.post(f"{BASE_URL}/auth/user/login", json=payload) as res:
        data = await res.json()
        if res.status == 200:
            print("✅ Logged in successfully")
            return data["access_token"]
        else:
            print(f"❌ Login failed: {data}")
            return None


async def register_source(session, token, source_name):
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"name": source_name,"token": token}
    async with session.post(f"{BASE_URL}/sources/register", json=payload, headers=headers) as res:
        data = await res.json()
        if res.status == 200:
            print(f"✅ Source '{source_name}' registered")
            return data["api_key"]
        else:
            print(f"❌ Source registration failed: {data}")
            return None

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
    username = "sdk_test_user"
    email = "sdk_test@example.com"
    password = "password123"
    source_name = "TestApp"

    async with aiohttp.ClientSession() as session:
        
        await register_user(session, username, email, password)
        
        token = await login_user(session, username, password)
        if not token:
            return

        api_key = await register_source(session, token, source_name)
        if not api_key:
            return

        sdk_token = await get_sdk_token(session, api_key)
        if not sdk_token:
            return
        
        await send_log_via_ws(sdk_token)


if __name__ == "__main__":
    asyncio.run(main())
