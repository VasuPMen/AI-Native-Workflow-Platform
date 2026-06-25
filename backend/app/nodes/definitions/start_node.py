from app.nodes.base import NodeDefinition
from app.nodes.registry import node_registry


start_node_definition = NodeDefinition(
    type="start",
    label="Start",
    category="core",
    description="Entry point of the workflow.",
    icon="play",
    config_fields=[],
    input_schema={},
    output_schema={
        "type": "object",
        "properties": {}
    }
)

node_registry.register(start_node_definition)