"use client";

import { useWorkflowStore } from "../../store/workflowStore";

export default function NodeSidebar() {
  const addNode = useWorkflowStore(
    (state) => state.addNode
  );

  return (
    <div
      className="
      w-64
      min-w-64
      h-screen
      bg-zinc-900
      text-white
      p-4
      "
    >
      <h2 className="text-xl font-bold mb-6">
        Nodes
      </h2>

      <button
        onClick={() => addNode("start")}
        className="
        w-full
        bg-green-500
        hover:bg-green-600
        p-2
        rounded
        mb-3
        "
      >
        Start Node
      </button>

      <button
        onClick={() => addNode("llm")}
        className="
        w-full
        bg-blue-500
        hover:bg-blue-600
        p-2
        rounded
        "
      >
        LLM Node
      </button>
    </div>
  );
}