import time
from datetime import datetime,timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from db.database import get_db
from models.user_model import User
from models.source import Source
from models.apikey_log import APIKeyLog
from schemas.Api_key import LoginToken, JWTtoken
from schemas.Api_key import APIKeyRequest
from middleware.verify_jwtToken import verify_jwt, verify
from utils.api_key import generate_api_key, hash_api_key
from utils.create_jwtToken import create_sdk_token

router = APIRouter(prefix="/sdk",tags=["SDK Authentication"])

@router.post("/auth")
async def sdk_auth(payload: APIKeyRequest, db:AsyncSession = Depends(get_db)):

    """
    SDK sends its API key to this endpoint.
    If valid -> returns a short lived JWT token.
    """
    in_hashed_api_key = hash_api_key(payload.api_key)

    result = await db.execute(select(Source).where(Source.api_key_hash == in_hashed_api_key))
    source = result.scalars().first()

    if source:
        token = create_sdk_token(source_name=source.name,source_id=source.id, user_id=source.user_id)
        return {"sdk_token" : token,"exp": time.time()}
    
        
    raise HTTPException(status_code=401, detail="Invalid API Key")

@router.post("/revoke")
async def revoke_api_key(token: dict = Depends(verify_jwt),db:AsyncSession = Depends(get_db)):

    """
    Revoking the api_key incase if mismatched or compromised.
    """

    source_id = token["source_id"]
    result = await db.execute(select(Source).where(Source.id == source_id))
    source = result.scalar_one_or_none()
    if source:
        try:
            new_api_key = generate_api_key()
            hashed = hash_api_key(new_api_key)
            source.api_key_hash = hashed
            await db.commit()
            return {
                "message": f"SDK Token revoked for {source.name} successfully.",
                "api_key" : new_api_key
            }
        
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Failed to generate api key: {e}")
    else:
        raise HTTPException(status_code=401, detail="Invalid token or Unauthorized access")

@router.post("/regenerate-api-key")
async def regenerate_api_key(
    token : JWTtoken,
    db: AsyncSession = Depends(get_db)
):
    payload = await verify(token.token)
    
    
    # --- Rate Limiting ---  
    
    """today = datetime.now(timezone.utc).date()
    result = await db.execute(
        select(func.count()).select_from(APIKeyLog).where(
            APIKeyLog.user_id == token.id,
            APIKeyLog.timestamp >= datetime(today.year, today.month, today.day, tzinfo=timezone.utc)
        )
    )
    recent_regens = result.scalar()

    if recent_regens >= 3:
        raise HTTPException(status_code=429, detail="API key regeneration limit reached for today.") """
    # -- Generation and saving to the db --- 

    try:
        
        sources = await db.execute(select(Source).where(Source.user_id == payload["user_id"]))
        source = sources.scalars().first()
        if not source:
            raise HTTPException(status_code=404, detail="Source does not exist!")

        raw_key = generate_api_key()
        hashed_key = hash_api_key(raw_key)

        source.api_key_hash = hashed_key
        # db.add(APIKeyLog(user_id=source.user_id, timestamp=datetime.now(timezone.utc)))

        await db.commit()

        return {"api_key": raw_key,"message": f"API Key regeneareted successfully for {source.name}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regeneration failed..: {e}")
    