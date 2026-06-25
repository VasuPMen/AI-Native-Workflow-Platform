def execute_llm_node(node_data: dict, input_data: dict | None = None):
    config = node_data.get("data", {})
    prompt = config.get("prompt", "")

    return {
        "response": f"Mock LLM response for prompt: {prompt}"
    }