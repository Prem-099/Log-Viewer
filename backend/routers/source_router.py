from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.source import Source
from db.database import get_db
from utils.api_key import generate_api_key, hash_api_key
from middleware.verify_jwtToken import verify_jwt
from schemas.source import SourceCreate, SourceOut
from utils.create_jwtToken import create_sdk_token

router = APIRouter(prefix="/sources", tags=["Sources"])

@router.post("/register")
async def register_source(
    payload: SourceCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new log source for the authenticated user.
    Returns the API key (plain text).
    """
    user = await verify_jwt(payload.token)

    res = await db.execute(select(Source).where(Source.name == payload.name))
    exists = res.scalars().first()

    if exists:
        raise HTTPException(status_code=409, detail="Source name already exists.Try different name.Like adding some random characters")

    try:
        
        user_id = user["user_id"]
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user token")

        # Generate and hash API key
        api_key = generate_api_key()
        hashed_key = hash_api_key(api_key)

        # Create source record
        new_source = Source(
            name=payload.name,
            api_key_hash=hashed_key,
            user_id=user_id
        )
        db.add(new_source)
        await db.commit()
        await db.refresh(new_source)

        return {
            "message": "Source registered successfully",
            "source_id": new_source.id,
            "api_key": api_key      # show once only
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering source: {str(e)}")


@router.get("/list", response_model=list[SourceOut])
async def list_sources(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(verify_jwt)
):
    """
    List all sources registered by the authenticated user.
    """
    try:
        user_id = user.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user token")

        result = await db.execute(select(Source).where(Source.user_id == user_id))
        sources = result.scalars().all()
        return sources

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sources: {str(e)}")

