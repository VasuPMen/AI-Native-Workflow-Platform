"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

interface TextInputNodeProps {
  data: {
    name?: string;
    text?: string;
  };
  selected?: boolean;
}

export default function TextInputNode({
  data,
  selected,
}: TextInputNodeProps) {
  const nodeName =
    data?.name || "Text Input";

  const text =
    data?.text?.trim() || "";

  const previewText = text
    ? text.length > 60
      ? text.slice(0, 60) + "..."
      : text
    : "No input text added";

  return (
    <div
      className={`
      bg-zinc-900
      border
      border-blue-500
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
      <div className="text-white font-semibold">
        {nodeName}
      </div>

      <div className="text-zinc-400 text-xs mt-1">
        Input Node
      </div>

      <div
        className="
        mt-3
        text-zinc-300
        text-sm
        break-words
        "
      >
        {previewText}
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