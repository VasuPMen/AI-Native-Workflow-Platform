from typing import Dict, List, Optional
from app.nodes.base import NodeDefinition


class NodeRegistry:
    def __init__(self):
        self._nodes: Dict[str, NodeDefinition] = {}

    def register(self, node_definition: NodeDefinition):
        self._nodes[node_definition.type] = node_definition

    def get(self, node_type: str) -> Optional[NodeDefinition]:
        return self._nodes.get(node_type)

    def list_all(self) -> List[NodeDefinition]:
        return list(self._nodes.values())


node_registry = NodeRegistry()