import google.generativeai as genai

from openai import OpenAI
from sqlalchemy.orm import Session

from app.models.workflow import Workflow
from app.services.credential_service import get_credential


def build_execution_order(nodes, edges):
    start_node = None

    for node in nodes:
        if node.get("type") == "start":
            start_node = node
            break

    if start_node is None:
        raise ValueError("Start node not found")

    node_map = {
        node["id"]: node
        for node in nodes
    }

    next_node_map = {}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source and target:
            next_node_map[source] = target

    execution_order = []
    current_node = start_node

    while current_node:
        execution_order.append(current_node)

        next_node_id = next_node_map.get(
            current_node["id"]
        )

        if not next_node_id:
            break

        current_node = node_map.get(
            next_node_id
        )

    return execution_order


def call_openai(
    api_key: str,
    model: str,
    prompt: str,
    temperature: float
):
    client = OpenAI(
        api_key=api_key
    )

    response = client.chat.completions.create(
        model=model,
        temperature=temperature,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


def call_gemini(
    api_key: str,
    model: str,
    prompt: str
):
    genai.configure(
        api_key=api_key
    )

    gemini_model = genai.GenerativeModel(
        model
    )

    response = gemini_model.generate_content(
        prompt
    )

    return response.text


def run_llm_node(
    db: Session,
    node_data: dict,
    previous_output
):
    provider = str(
        node_data.get("provider", "")
    ).strip().lower()

    credential_id = node_data.get(
        "credential_id"
    )

    model = str(
        node_data.get("model", "")
    ).strip()

    prompt = str(
        node_data.get("prompt", "")
    ).strip()

    temperature = node_data.get(
        "temperature",
        0.7
    )

    if not provider:
        raise ValueError(
            "Provider is required for LLM node"
        )

    if not credential_id:
        raise ValueError(
            "Credential is required for LLM node"
        )

    if not model:
        raise ValueError(
            "Model is required for LLM node"
        )

    if not prompt:
        raise ValueError(
            "Prompt is required for LLM node"
        )

    credential = get_credential(
        db=db,
        credential_id=int(credential_id),
        user_id=1
    )

    if credential is None:
        raise ValueError(
            "Selected credential not found"
        )

    credential_provider = (
        credential.provider
        .strip()
        .lower()
    )

    if credential_provider != provider:
        raise ValueError(
            "Credential provider does not match selected LLM provider"
        )

    api_key = credential.secret
    input_text = previous_output or ""

    full_prompt = f"""
{prompt}

Input:
{input_text}
"""

    if provider == "openai":
        return call_openai(
            api_key=api_key,
            model=model,
            prompt=full_prompt,
            temperature=temperature
        )

    if provider == "gemini":
        return call_gemini(
            api_key=api_key,
            model=model,
            prompt=full_prompt
        )

    raise ValueError(
        f"Unsupported provider: {provider}"
    )


def execute_node(
    db: Session,
    node,
    previous_output
):
    node_type = node.get("type")
    node_data = node.get("data", {})

    if node_type == "start":
        return None

    if node_type == "text_input":
        return node_data.get("text", "")

    if node_type == "llm":
        return run_llm_node(
            db=db,
            node_data=node_data,
            previous_output=previous_output
        )

    if node_type == "output":
        return previous_output

    return previous_output


def execute_workflow(
    db: Session,
    workflow: Workflow
):
    workflow_json = workflow.workflow_json or {}

    nodes = workflow_json.get("nodes", [])
    edges = workflow_json.get("edges", [])

    execution_order = build_execution_order(
        nodes,
        edges
    )

    node_outputs = {}
    previous_output = None

    for node in execution_order:
        output = execute_node(
            db=db,
            node=node,
            previous_output=previous_output
        )

        node_outputs[node["id"]] = {
            "type": node.get("type"),
            "output": output
        }

        previous_output = output

    return {
        "workflow_id": workflow.id,
        "status": "success",
        "final_output": previous_output,
        "node_outputs": node_outputs,
    }