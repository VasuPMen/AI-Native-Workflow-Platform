"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

interface LLMNodeProps {
  data: {
    name?: string;
    provider?: string;
    model?: string;
    prompt?: string;
    temperature?: number;
  };
  selected?: boolean;
}

export default function LLMNode({
  data,
  selected,
}: LLMNodeProps) {
  const nodeName =
    data?.name || "LLM";

  const provider =
    data?.provider || "openai";

  const model =
    data?.model || "Not set";

  const prompt =
    data?.prompt?.trim() || "";

  const promptPreview = prompt
    ? prompt.length > 60
      ? prompt.slice(0, 60) + "..."
      : prompt
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
        {nodeName}
      </div>

      <div className="text-blue-100 text-xs mt-1">
        Provider: {provider}
      </div>

      <div className="text-blue-100 text-xs mt-1">
        Model: {model}
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