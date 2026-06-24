"use client";

import { Handle, Position } from "@xyflow/react";
import { useWorkflowStore } from "../../store/workflowStore";

export default function OutputNode({
  data,
}: {
  data: {
    name?: string;
  };
}) {
  const workflowExecutionResult =
    useWorkflowStore(
      (state) =>
        state.workflowExecutionResult
    );

  const hasOutput =
    workflowExecutionResult.trim() !== "";

  return (
    <div
      className="
      bg-zinc-900
      border
      border-emerald-500
      rounded-xl
      px-4
      py-3
      min-w-[220px]
      shadow-lg
      "
    >
      <div className="text-white font-semibold">
        {data.name || "Output Node"}
      </div>

      <div className="text-zinc-400 text-xs mt-1">
        Final Output
      </div>

      <div className="mt-3">
        <div
          className={`text-sm font-medium ${
            hasOutput
              ? "text-emerald-400"
              : "text-zinc-400"
          }`}
        >
          {hasOutput
            ? "Output ready"
            : "No output yet"}
        </div>

        <div className="text-xs text-zinc-500 mt-1">
          Click node to view result
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
      />
    </div>
  );
}