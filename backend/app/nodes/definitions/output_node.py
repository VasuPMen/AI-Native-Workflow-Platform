from app.nodes.base import (
    NodeDefinition,
    NodeFieldDefinition
)

output_node = NodeDefinition(
    type="output",
    label="Output",
    category="output",
    description="Displays the final output of the workflow.",
    icon="output",
    config_fields=[
        NodeFieldDefinition(
            key="label",
            label="Label",
            field_type="text",
            required=True,
            default="Output",
            placeholder="Enter output label",
            options=None,
            description="Label shown for this output"
        ),
    ],
    input_schema={
        "type": "object",
        "properties": {
            "input": {
                "type": "string"
            }
        }
    },
    output_schema={
        "type": "object",
        "properties": {}
    }
)