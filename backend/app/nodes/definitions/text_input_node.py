from app.nodes.base import (
    NodeDefinition,
    NodeFieldDefinition
)

text_input_node = NodeDefinition(
    type="text_input",
    label="Text Input",
    category="input",
    description="Provides text input into the workflow.",
    icon="text",
    config_fields=[
        NodeFieldDefinition(
            key="label",
            label="Label",
            field_type="text",
            required=True,
            default="Input",
            placeholder="Enter input label",
            options=None,
            description="Label shown for this input"
        ),
        NodeFieldDefinition(
            key="text",
            label="Default Value",
            field_type="textarea",
            required=False,
            default="",
            placeholder="Enter default text",
            options=None,
            description="Default text input value"
        ),
    ],
    input_schema={
        "type": "object",
        "properties": {}
    },
    output_schema={
        "type": "object",
        "properties": {
            "text": {
                "type": "string"
            }
        }
    }
)