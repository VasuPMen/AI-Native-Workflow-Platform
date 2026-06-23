import { Node, Edge } from "@xyflow/react";

export function saveWorkflow(
  nodes: Node[],
  edges: Edge[]
) {
  localStorage.setItem(
    "workflow",
    JSON.stringify({
      nodes,
      edges,
    })
  );
}

export function loadWorkflow() {
  const workflow =
    localStorage.getItem(
      "workflow"
    );

  if (!workflow) {
    return null;
  }

  return JSON.parse(workflow);
}