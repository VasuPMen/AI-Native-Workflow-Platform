from datetime import datetime
from pydantic import BaseModel


class CredentialCreate(BaseModel):
    name: str
    provider: str
    credential_type: str = "api_key"
    secret: str


class CredentialResponse(BaseModel):
    id: int
    user_id: int
    name: str
    provider: str
    credential_type: str
    created_at: datetime

    class Config:
        from_attributes = True