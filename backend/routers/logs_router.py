import csv
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from io import BytesIO, StringIO
from db.database import get_db
from models.log_model import Log
from middleware.verify_jwtToken import verify_jwt

router = APIRouter(prefix="/logs")

@router.get("/export")
async def export_logs(
    source_id : int,
    format: str = "csv",
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_jwt)
):
    """
    Docstring for export_logs
    
    :param source_id: Description
    :type source_id: int
    :param format: Description
    :type format: str
    :param db: Description
    :type db: AsyncSession
    :param payload: Description
    :type payload: dict

    Exporting logs in csv and excel sheet
    """
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await db.execute(
        select(Log).where(Log.user_id == user_id, Log.source_id == source_id).order_by(Log.timestamp.asc())
    )
    logs = result.scalars().all()

    if not logs:
        raise HTTPException(status_code=404, detail="No logs found")
    
    data = [
        {
            "timestamp": log.timestamp,
            "source": log.source,
            "level": log.level,
            "message": log.message,
        }
        for log in logs
    ]

    if format == "csv":
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)

        return StreamingResponse(
            output, 
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=logs.csv"
            }, 
        )
    
    elif format == "xlsx":
        df = pd.DataFrame(data)
        output = BytesIO()
        df.to_excel(output, index=False)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": "attachment; filename=logs.xlsx"
            },
        )
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
    
