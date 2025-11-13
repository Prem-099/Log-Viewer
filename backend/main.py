from fastapi import FastAPI
from db.database import init_db
from routers.home_router import router as home
from routers.auth_router import router as authentication_routes
from routers.websocket_router import router as websocket_routes
from routers.source_router import router as source_routes
from routers.sdk_auth import router as sdk_routes 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Distributed Log Viewer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home)
app.include_router(websocket_routes)
app.include_router(authentication_routes)
app.include_router(source_routes)
app.include_router(sdk_routes)

@app.on_event("startup")
async def on_startup():
    await init_db()

"""@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created!")
"""