from fastapi import APIRouter
import app.nodes
from app.nodes.registry import node_registry

router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("/")
def list_nodes():
    return {
        "success": True,
        "data": [node.model_dump() for node in node_registry.list_all()]
    }