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
        <button
          onClick={() => addNode("start")}
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
          Add Start Node
        </button>

        <button
          onClick={() => addNode("llm")}
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
          Add LLM Node
        </button>

        <button
          onClick={() =>
            addNode("text_input")
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
          Add Text Input Node
        </button>

        <button
          onClick={() => addNode("output")}
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
          Add Output Node
        </button>
      </div>
    </div>
  );
}