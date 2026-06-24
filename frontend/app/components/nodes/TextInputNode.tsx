"use client";

import { Handle, Position } from "@xyflow/react";

export default function TextInputNode({
  data,
}: {
  data: {
    name?: string;
    text?: string;
  };
}) {
  const previewText = data.text
    ? data.text.length > 60
      ? data.text.slice(0, 60) + "..."
      : data.text
    : "No input text added";

  return (
    <div
      className="
      bg-zinc-900
      border
      border-blue-500
      rounded-xl
      px-4
      py-3
      min-w-[220px]
      max-w-[260px]
      shadow-lg
      "
    >
      <div className="text-white font-semibold">
        {data.name || "Text Input"}
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