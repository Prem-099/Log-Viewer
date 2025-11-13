import hashlib, secrets

def generate_api_key() -> str:
    return secrets.token_urlsafe(32)

def hash_api_key(api_key: str) -> str:
    return hashlib.sha256(api_key.encode()).hexdigest()

def verify_api_key(api_key: str, hashed_key: str) -> bool:
    return hashlib.sha256(api_key.encode()).hexdigest() == hashed_key
