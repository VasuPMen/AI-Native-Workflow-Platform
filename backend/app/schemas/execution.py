from pydantic import BaseModel
from typing import Any, Dict, Optional


class WorkflowExecutionResponse(BaseModel):
    workflow_id: int
    status: str
    final_output: Optional[Any] = None
    node_outputs: Dict[str, Any]