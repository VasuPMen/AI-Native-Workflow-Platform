import { Node, Edge } from "@xyflow/react";

export const saveWorkflow = (
  nodes: any[],
  edges: any[]
) => {
  localStorage.setItem(
    "workflow",
    JSON.stringify({
      nodes,
      edges,
    })
  );
};

export const loadWorkflow = () => {
  const raw =
    localStorage.getItem("workflow");

  return raw
    ? JSON.parse(raw)
    : null;
};

export const saveCurrentWorkflowId = (
  workflowId: number
) => {
  localStorage.setItem(
    "currentWorkflowId",
    String(workflowId)
  );
};

export const clearCurrentWorkflowId =
  () => {
    localStorage.removeItem(
      "currentWorkflowId"
    );
  };

export const loadCurrentWorkflowId =
  () => {
    const raw =
      localStorage.getItem(
        "currentWorkflowId"
      );

    return raw
      ? Number(raw)
      : null;
  };