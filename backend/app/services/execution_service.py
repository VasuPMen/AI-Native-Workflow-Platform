import os

import google.generativeai as genai

from dotenv import load_dotenv

from app.models.workflow import Workflow

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


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


def call_gemini(prompt: str):
    model = genai.GenerativeModel(
        "models/gemini-2.5-flash"
    )

    response = model.generate_content(
        prompt
    )

    return response.text


def execute_node(node, previous_output):
    node_type = node.get("type")
    node_data = node.get("data", {})

    if node_type == "start":
        return None

    if node_type == "text_input":
        return node_data.get("text", "")

    if node_type == "llm":
        prompt = node_data.get("prompt", "")
        input_text = previous_output or ""

        full_prompt = f"""
{prompt}

Input:
{input_text}
"""

        return call_gemini(full_prompt)

    if node_type == "output":
        return previous_output

    return previous_output


def execute_workflow(workflow: Workflow):
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
            node,
            previous_output
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