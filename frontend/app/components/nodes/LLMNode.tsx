"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

interface LLMNodeProps {
  data: {
    name?: string;
    model?: string;
    prompt?: string;
  };

  selected?: boolean;
}

export default function LLMNode({
  data,
  selected,
}: LLMNodeProps) {
  const promptPreview = data?.prompt
    ? data.prompt.length > 50
      ? data.prompt.slice(0, 50) + "..."
      : data.prompt
    : "No prompt added";

  return (
    <div
      className={`
      bg-blue-500
      text-white
      rounded-xl
      px-4
      py-3
      min-w-[220px]
      max-w-[260px]
      shadow-lg
      ${
        selected
          ? "ring-4 ring-yellow-400"
          : ""
      }
      `}
    >
      <div className="font-semibold">
        {data?.name || "LLM Node"}
      </div>

      <div className="text-blue-100 text-xs mt-1">
        Model: {data?.model || "gpt-4o"}
      </div>

      <div className="mt-3 text-sm text-blue-50 break-words">
        {promptPreview}
      </div>

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