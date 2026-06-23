"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

interface LLMNodeProps {
  data: {
    name?: string;
  };

  selected?: boolean;
}

export default function LLMNode({
  data,
  selected,
}: LLMNodeProps) {
  return (
    <div
      className={`
      px-4
      py-2
      rounded-md
      shadow
      text-white
      bg-blue-500
      ${
        selected
          ? "ring-4 ring-yellow-400"
          : ""
      }
      `}
    >
      {data?.name ||
        "LLM Node"}

      <Handle
        type="target"
        position={Position.Left}
      />

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
} 