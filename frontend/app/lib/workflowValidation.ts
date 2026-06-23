import { Node, Edge } from "@xyflow/react";

export function validateWorkflow(
  nodes: Node[],
  edges: Edge[]
) {
  const errors: string[] = [];

  const startNodes =
    nodes.filter(
      (node) =>
        node.type === "start"
    );

  if (startNodes.length !== 1) {
    errors.push(
      "Workflow must contain exactly one Start Node"
    );
  }

  if (edges.length === 0) {
    errors.push(
      "Workflow must contain connections"
    );
  }

  const names = nodes.map(
  (node) =>
    (
      node.data as {
        name?: string;
      }
    )?.name?.trim()
);

const duplicateNames =
  names.filter(
    (name, index) =>
      name &&
      names.indexOf(name) !== index
  );

if (
  duplicateNames.length > 0
) {
  errors.push(
    "Duplicate node names found"
  );
}

  nodes.forEach((node) => {
    const connected =
      edges.some(
        (edge) =>
          edge.source === node.id ||
          edge.target === node.id
      );

    if (
      node.type !== "start" &&
      !connected
    ) {
      errors.push(
        `Node ${
          (node.data as any)?.name ||
          node.id
        } is not connected`
      );
    }

    if (node.type === "llm") {
      const data =
        node.data as {
          name?: string;
          model?: string;
          prompt?: string;
          temperature?: number;
        };

      if (
        !data?.name?.trim()
      ) {
        errors.push(
          `LLM node ${node.id} has empty name`
        );
      }

      if (
        !data?.model?.trim()
      ) {
        errors.push(
          `LLM node ${
            data?.name || node.id
          } has empty model`
        );
      }

      if (
        !data?.prompt?.trim()
      ) {
        errors.push(
          `LLM node ${
            data?.name || node.id
          } has empty prompt`
        );
      }

      if (
        data.temperature !==
          undefined &&
        (data.temperature < 0 ||
          data.temperature > 2)
      ) {
        errors.push(
          `LLM node ${
            data?.name || node.id
          } temperature must be between 0 and 2`
        );
      }
    }
  });

  return {
    valid:
      errors.length === 0,
    errors,
  };
}