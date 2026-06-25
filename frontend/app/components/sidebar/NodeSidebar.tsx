"use client";

import { useEffect } from "react";

import { useWorkflowStore } from "../../store/workflowStore";
import { useNodeDefinitionsStore } from "../../store/nodeDefinitionsStore";
import { NodeDefinition } from "../../types/nodeDefinition";

interface NodeSidebarProps {
  nodeDefinitions: NodeDefinition[];
}

export default function NodeSidebar({
  nodeDefinitions,
}: NodeSidebarProps) {
  const addNode = useWorkflowStore(
    (state) => state.addNode
  );

  const setNodeDefinitions =
    useNodeDefinitionsStore(
      (state) => state.setNodeDefinitions
    );

  useEffect(() => {
    setNodeDefinitions(nodeDefinitions);
  }, [nodeDefinitions, setNodeDefinitions]);

  const buildInitialNodeData = (
    node: NodeDefinition
  ) => {
    const data: Record<string, any> = {
      name: node.label,
    };

    node.config_fields.forEach(
      (field) => {
        data[field.key] =
          field.default ?? "";
      }
    );

    return data;
  };

  return (
    <div
      className="
      w-64
      h-full
      bg-zinc-950
      border-r
      border-zinc-800
      p-4
      "
    >
      <h2 className="text-white text-lg font-semibold mb-4">
        Nodes
      </h2>

      <div className="space-y-3">
        {nodeDefinitions.map((node) => (
          <button
            key={node.type}
            onClick={() =>
              addNode(
                node.type,
                buildInitialNodeData(node)
              )
            }
            className="
            w-full
            bg-zinc-800
            hover:bg-zinc-700
            text-white
            px-4
            py-2
            rounded
            text-left
            "
          >
            Add {node.label} Node
          </button>
        ))}
      </div>
    </div>
  );
}