"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

interface StartNodeProps {
  data: {
    name?: string;
  };

  selected?: boolean;
}

export default function StartNode({
  data,
  selected,
}: StartNodeProps) {
  return (
    <div
      className={`
      px-4
      py-2
      rounded-md
      shadow
      text-white
      bg-green-500
      ${
        selected
          ? "ring-4 ring-yellow-400"
          : ""
      }
      `}
    >
      {data?.name || "Start"}

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}