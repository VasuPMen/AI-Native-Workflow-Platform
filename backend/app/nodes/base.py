from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class NodeFieldDefinition(BaseModel):
    key: str
    label: str
    field_type: str
    required: bool = False
    default: Any = None
    placeholder: Optional[str] = None
    options: Optional[List[str]] = None
    description: Optional[str] = None


class NodeDefinition(BaseModel):
    type: str
    label: str
    category: str
    description: str
    icon: Optional[str] = None
    config_fields: List[NodeFieldDefinition] = Field(default_factory=list)
    input_schema: Dict[str, Any] = Field(default_factory=dict)
    output_schema: Dict[str, Any] = Field(default_factory=dict)