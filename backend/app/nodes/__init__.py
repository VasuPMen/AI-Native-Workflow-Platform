from app.nodes.registry import node_registry

from app.nodes.definitions.start_node import start_node_definition
from app.nodes.definitions.llm_node import llm_node_definition
from app.nodes.definitions.text_input_node import text_input_node
from app.nodes.definitions.output_node import output_node

node_registry.register(start_node_definition)
node_registry.register(llm_node_definition)
node_registry.register(text_input_node)
node_registry.register(output_node)