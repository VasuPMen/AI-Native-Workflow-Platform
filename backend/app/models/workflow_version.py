from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    JSON
)
from sqlalchemy.sql import func

from app.db.database import Base


class WorkflowVersion(Base):
    __tablename__ = "workflow_versions"

    id = Column(Integer, primary_key=True)

    workflow_id = Column(
        Integer,
        ForeignKey("workflows.id"),
        nullable=False
    )

    version = Column(
        Integer,
        nullable=False
    )

    workflow_json = Column(
        JSON,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )