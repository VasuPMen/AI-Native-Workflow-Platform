from pydantic import BaseModel
from typing import Optional, Any


class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_json: dict[str, Any] | None = None


class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    workflow_json: dict[str, Any] | None = None


class WorkflowResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    workflow_json: dict[str, Any] | None = None

    model_config = {
        "from_attributes": True
    }