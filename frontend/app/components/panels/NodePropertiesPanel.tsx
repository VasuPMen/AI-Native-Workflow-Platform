"use client";

import { useState, useEffect } from "react";

import { useWorkflowStore } from "../../store/workflowStore";

export default function NodePropertiesPanel() {
  const store = useWorkflowStore();

  useEffect(() => {
    console.log(
      "FULL STORE LIVE",
      useWorkflowStore.getState()
    );
  }, [store]);

const {
  selectedNodeId,
  selectedEdgeId,
  nodes,
  edges,
  deleteNode,
  deleteEdge,
  updateNodeData,
  workflowExecutionResult,
} = store;

  useEffect(() => {
    console.log(
      "LIVE IDS",
      selectedNodeId,
      selectedEdgeId
    );
  }, [
    selectedNodeId,
    selectedEdgeId,
  ]);

  const selectedNode = nodes.find(
    (node) =>
      node.id === selectedNodeId
  );

  const selectedEdge = edges.find(
    (edge) =>
      edge.id === selectedEdgeId
  );

  const [nodeName, setNodeName] =
    useState("");

  const [model, setModel] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [
    temperature,
    setTemperature,
  ] = useState(0.7);

  const [text, setText] =
    useState("");

  useEffect(() => {
    if (!selectedNode) return;

    const data =
      selectedNode.data as {
        name?: string;
        model?: string;
        prompt?: string;
        temperature?: number;
        text?: string;
      };

    setNodeName(
      data.name || ""
    );

    setModel(
      data.model || "gpt-4o"
    );

    setPrompt(
      data.prompt || ""
    );

    setTemperature(
      data.temperature ?? 0.7
    );

    setText(
      data.text || ""
    );
  }, [selectedNode]);

  if (selectedEdge) {
    return (
      <div
        className="
        w-72
        min-w-72
        h-screen
        bg-zinc-900
        text-white
        p-4
        "
      >
        <h2 className="text-xl font-bold mb-4">
          Edge Properties
        </h2>

        <p className="mb-4">
          Source:
        </p>

        <p className="mb-4">
          {selectedEdge.source}
        </p>

        <p className="mb-4">
          Target:
        </p>

        <p className="mb-6">
          {selectedEdge.target}
        </p>

        <button
          onClick={() => {
            const confirmed =
              confirm(
                "Delete this edge?"
              );

            if (confirmed) {
              deleteEdge(
                selectedEdge.id
              );
            }
          }}
          className="
          w-full
          bg-red-500
          hover:bg-red-600
          p-2
          rounded
          "
        >
          Delete Edge
        </button>
      </div>
    );
  }

  if (!selectedNode) {
    return (
      <div
        className="
        w-72
        min-w-72
        h-screen
        bg-zinc-900
        text-white
        p-4
        "
      >
        <h2 className="text-xl font-bold">
          Properties
        </h2>

        <p className="mt-4">
          No node selected
        </p>
      </div>
    );
  }

  const handleUpdateNode = () => {
    if (selectedNode.type === "llm") {
      updateNodeData(
        selectedNode.id,
        {
          name: nodeName,
          model,
          prompt,
          temperature,
        }
      );
      return;
    }

    if (
      selectedNode.type ===
      "text_input"
    ) {
      updateNodeData(
        selectedNode.id,
        {
          name: nodeName,
          text,
        }
      );
      return;
    }

    if (
      selectedNode.type ===
      "output"
    ) {
      updateNodeData(
        selectedNode.id,
        {
          name: nodeName,
        }
      );
      return;
    }

    updateNodeData(
      selectedNode.id,
      {
        name: nodeName,
      }
    );
  };

  return (
    <div
      className="
      w-72
      min-w-72
      h-screen
      bg-zinc-900
      text-white
      p-4
      overflow-y-auto
      "
    >
      <h2 className="text-xl font-bold mb-4">
        Properties
      </h2>

      <label className="block mb-2">
        Node Name
      </label>

      <input
        value={nodeName}
        onChange={(e) =>
          setNodeName(
            e.target.value
          )
        }
        className="
        w-full
        p-2
        rounded
        border
        border-zinc-700
        bg-white
        text-black
        mb-4
        "
      />

      <p className="mb-2">
        <strong>Type:</strong>
      </p>

      <p className="mb-6">
        {selectedNode.type}
      </p>

      {selectedNode.type ===
        "llm" && (
          <>
            <label className="block mb-2">
              Model
            </label>

            <input
              value={model}
              onChange={(e) =>
                setModel(
                  e.target.value
                )
              }
              className="
              w-full
              p-2
              rounded
              border
              border-zinc-700
              bg-white
              text-black
              mb-4
              "
            />

            <label className="block mb-2">
              Prompt
            </label>

            <textarea
              rows={5}
              value={prompt}
              onChange={(e) =>
                setPrompt(
                  e.target.value
                )
              }
              className="
              w-full
              p-2
              rounded
              border
              border-zinc-700
              bg-white
              text-black
              mb-4
              "
            />

            <label className="block mb-2">
              Temperature
            </label>

            <input
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={temperature}
              onChange={(e) =>
                setTemperature(
                  Number(
                    e.target.value
                  )
                )
              }
              className="
              w-full
              p-2
              rounded
              border
              border-zinc-700
              bg-white
              text-black
              mb-4
              "
            />
          </>
        )}

      {selectedNode.type ===
        "text_input" && (
          <>
            <label className="block mb-2">
              Input Text
            </label>

            <textarea
              rows={8}
              value={text}
              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
              className="
              w-full
              p-2
              rounded
              border
              border-zinc-700
              bg-white
              text-black
              mb-4
              "
            />
          </>
        )}

        {selectedNode.type ===
  "output" && (
    <>
      <label className="block mb-2">
        Workflow Output
      </label>

      <div
        className="
        w-full
        min-h-[180px]
        max-h-[320px]
        overflow-y-auto
        rounded
        border
        border-zinc-700
        bg-zinc-950
        text-zinc-200
        p-3
        mb-4
        whitespace-pre-wrap
        break-words
        "
      >
        {workflowExecutionResult
          ? workflowExecutionResult
          : "No output yet. Run the workflow to see the result here."}
      </div>
    </>
  )}

      <button
        onClick={handleUpdateNode}
        className="
        w-full
        bg-blue-500
        hover:bg-blue-600
        p-2
        rounded
        mb-4
        "
      >
        Update Node
      </button>

      {selectedNode.type !==
        "start" && (
          <button
            onClick={() => {
              const confirmed =
                confirm(
                  "Delete this node?"
                );

              if (confirmed) {
                deleteNode(
                  selectedNode.id
                );
              }
            }}
            className="
            w-full
            bg-red-500
            hover:bg-red-600
            p-2
            rounded
            "
          >
            Delete Node
          </button>
        )}
    </div>
  );
}