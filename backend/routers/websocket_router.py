import io,json,csv
from sqlalchemy import select
from models.log_model import Log
from models.source import Source
from websocket.ws_manager import ConnectionManager
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db, AsyncSessionLocal
from middleware.verify_jwtToken import verify_jwt
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Response

router = APIRouter(prefix="/logs", tags=["Logs"])
manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle real-time log streaming for authenticated SDK sources."""
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    try:
        payload = await verify_jwt(token)
    except HTTPException:
        await websocket.close(code=1008)
        return

    # Validate SDK token type
    if payload.get("type") != "sdk":
        await websocket.close(code=1008)
        return

    user_id = payload.get("user_id")
    source_id = payload.get("source_id")
    source_name = payload.get("sub")

    await manager.connect(user_id, websocket)

    async with AsyncSessionLocal() as db:
        try:
            while True:
                try:
                    data = await websocket.receive_json()
                except ValueError:
                    await websocket.send_json({"error": "Invalid JSON format"})
                    continue

                    # Create and store log
                log = Log(
                    source=source_name,
                    level=data.get("level", "info"),
                    message=data.get("message", ""),
                    user_id=user_id,
                    source_id=source_id,
                )

                db.add(log)
                await db.commit()
                await db.refresh(log)

                await manager.send_personal_message(
                    user_id,
                    {
                        "id": log.id,
                        "source": log.source,
                        "level": log.level,
                        "message": log.message,
                        "timestamp": str(log.timestamp),
                    },
                )

        except WebSocketDisconnect:
            manager.disconnect(user_id, websocket)
            


@router.get("/history")
async def get_log_history(
    source_id: int = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_jwt),
):
    """Fetch recent logs for this user, optionally filtered by source."""
    user_id = payload.get("user_id")

    query = select(Log).where(Log.user_id == user_id)
    if source_id:
        query = query.where(Log.source_id == source_id)

    query = query.order_by(Log.timestamp.desc()).limit(limit)
    result = await db.execute(query)
    logs = result.scalars().all()

    return [
        {
            "id": log.id,
            "timestamp": log.timestamp,
            "source": log.source,
            "level": log.level,
            "message": log.message,
        }
        for log in logs
    ]

@router.get("/history/export")
async def export_logs(
    source_id: int = None,
    format: str = "csv",
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_jwt),
):
    user_id = payload.get("user_id")
    query = select(Log).where(Log.user_id == user_id)
    if source_id:
        query = query.where(Log.source_id == source_id)
    query = query.order_by(Log.timestamp.desc())
    result = await db.execute(query)
    logs = result.scalars().all()

    if format == "json":
        content = json.dumps([log.to_dict() for log in logs])
        media_type = "application/json"
        filename = "logs.json"
    else:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["id", "timestamp", "source", "level", "message"])
        for log in logs:
            writer.writerow([log.id, log.timestamp, log.source, log.level, log.message])
        content = output.getvalue()
        media_type = "text/csv"
        filename = "logs.csv"

    return Response(content, media_type=media_type, headers={"Content-Disposition": f"attachment; filename={filename}"})


@router.post("/send")
async def send_log(
    log_data: dict,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_jwt),
):
    """SDK sends logs via HTTP using a JWT token."""
    try:
        source_id = payload.get("source_id")
        user_id = payload.get("user_id")

        if not source_id or not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        res = await db.execute(
            select(Source).where(Source.id == source_id, Source.user_id == user_id)
        )
        source = res.scalars().first()
        if not source:
            raise HTTPException(status_code=403, detail="Source not linked to user")

        new_log = Log(
            source=source.name,
            level=log_data.get("level", "info"),
            message=log_data.get("message", ""),
            user_id=user_id,
            source_id=source_id,
        )

        db.add(new_log)
        await db.commit()
        await db.refresh(new_log)

        await manager.send_personal_message(
            user_id,
            {
                "id": new_log.id,
                "source": new_log.source,
                "level": new_log.level,
                "message": new_log.message,
                "timestamp": str(new_log.timestamp),
            },
        )

        return {"message": "Log stored successfully", "log_id": new_log.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving log: {str(e)}")
