from app.nodes.base import NodeDefinition, NodeFieldDefinition
from app.nodes.registry import node_registry


llm_node_definition = NodeDefinition(
    type="llm",
    label="LLM",
    category="ai",
    description="Runs a language model with a prompt.",
    icon="brain",
    config_fields=[
        NodeFieldDefinition(
            key="provider",
            label="Provider",
            field_type="select",
            required=True,
            default="openai",
            options=["openai", "gemini"],
            description="LLM provider name"
        ),
        NodeFieldDefinition(
            key="credential_id",
            label="Credential",
            field_type="credential_select",
            required=True,
            default="",
            description="Credential to use for this provider"
        ),
        NodeFieldDefinition(
            key="model",
            label="Model",
            field_type="text",
            required=True,
            default="gpt-4o-mini",
            placeholder="Enter model name",
            description="Model name to use"
        ),
        NodeFieldDefinition(
            key="prompt",
            label="Prompt",
            field_type="textarea",
            required=True,
            default="",
            placeholder="Enter prompt here",
            description="Prompt sent to the model"
        ),
        NodeFieldDefinition(
            key="temperature",
            label="Temperature",
            field_type="number",
            required=False,
            default=0.7,
            description="Sampling temperature"
        ),
    ],
    input_schema={
        "type": "object",
        "properties": {
            "input": {"type": "string"}
        }
    },
    output_schema={
        "type": "object",
        "properties": {
            "response": {"type": "string"}
        }
    }
)

node_registry.register(llm_node_definition)