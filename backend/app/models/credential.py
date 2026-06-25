from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    provider = Column(
        String,
        nullable=False,
        index=True
    )

    credential_type = Column(
        String,
        nullable=False,
        default="api_key"
    )

    secret = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )