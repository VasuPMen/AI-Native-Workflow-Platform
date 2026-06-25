"use client";

import { useEffect, useMemo, useState } from "react";

import { useWorkflowStore } from "../../store/workflowStore";
import { useNodeDefinitionsStore } from "../../store/nodeDefinitionsStore";
import { useCredentialStore } from "../../store/credentialStore";

const getDefaultModelForProvider = (
  provider: string
) => {
  if (provider === "gemini") {
    return "gemini-2.5-flash";
  }

  if (provider === "openai") {
    return "gpt-4o-mini";
  }

  return "";
};

export default function NodePropertiesPanel() {
  const {
    selectedNodeId,
    selectedEdgeId,
    nodes,
    edges,
    deleteNode,
    deleteEdge,
    updateNodeData,
    workflowExecutionResult,
  } = useWorkflowStore();

  const nodeDefinitions =
    useNodeDefinitionsStore(
      (state) => state.nodeDefinitions
    );

  const credentials = useCredentialStore(
    (state) => state.credentials
  );

  const selectedNode = nodes.find(
    (node) =>
      node.id === selectedNodeId
  );

  const selectedEdge = edges.find(
    (edge) =>
      edge.id === selectedEdgeId
  );

  const selectedNodeDefinition =
    useMemo(() => {
      if (!selectedNode) return null;

      return nodeDefinitions.find(
        (definition) =>
          definition.type ===
          selectedNode.type
      );
    }, [
      selectedNode,
      nodeDefinitions,
    ]);

  const [nodeName, setNodeName] =
    useState("");

  const [formValues, setFormValues] =
    useState<Record<string, any>>({});

  useEffect(() => {
    if (!selectedNode) return;

    const nodeData =
      (selectedNode.data as Record<
        string,
        any
      >) || {};

    setNodeName(
      nodeData.name || ""
    );

    const nextFormValues: Record<
      string,
      any
    > = {};

    selectedNodeDefinition?.config_fields?.forEach(
      (field) => {
        if (field.key === "label") {
          return;
        }

        if (
          nodeData[field.key] !==
          undefined
        ) {
          nextFormValues[field.key] =
            nodeData[field.key];
        } else {
          nextFormValues[field.key] =
            field.default ?? "";
        }
      }
    );

    setFormValues(nextFormValues);
  }, [
    selectedNode,
    selectedNodeDefinition,
  ]);

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

  const handleFieldChange = (
    key: string,
    value: any
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProviderChange = (
    provider: string
  ) => {
    setFormValues((prev) => {
      const nextValues: Record<
        string,
        any
      > = {
        ...prev,
        provider,
        credential_id: "",
      };

      const currentModel =
        String(prev.model || "").trim();

      const openaiModels = [
        "gpt-4o",
        "gpt-4o-mini",
        "gpt-4.1",
        "gpt-4.1-mini",
      ];

      const geminiModels = [
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ];

      const currentLooksOpenAI =
        openaiModels.includes(
          currentModel
        );

      const currentLooksGemini =
        geminiModels.includes(
          currentModel
        );

      if (provider === "gemini") {
        if (
          !currentModel ||
          currentLooksOpenAI
        ) {
          nextValues.model =
            getDefaultModelForProvider(
              "gemini"
            );
        }
      }

      if (provider === "openai") {
        if (
          !currentModel ||
          currentLooksGemini
        ) {
          nextValues.model =
            getDefaultModelForProvider(
              "openai"
            );
        }
      }

      return nextValues;
    });
  };

  const handleUpdateNode = () => {
    updateNodeData(
      selectedNode.id,
      {
        name: nodeName,
        ...formValues,
      }
    );
  };

  const renderField = (
    field: any
  ) => {
    if (field.key === "label") {
      return null;
    }

    const value =
      formValues[field.key] ?? "";

    const selectedProvider =
      formValues.provider || "";

    if (
      field.key === "credential_id"
    ) {
      const filteredCredentials =
        credentials.filter(
          (credential) =>
            credential.provider ===
            selectedProvider
        );

      return (
        <div
          key={field.key}
          className="mb-4"
        >
          <label className="block mb-2">
            {field.label}
          </label>

          <select
            value={value}
            onChange={(e) =>
              handleFieldChange(
                field.key,
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
            "
          >
            <option value="">
              Select credential
            </option>

            {filteredCredentials.map(
              (credential) => (
                <option
                  key={credential.id}
                  value={credential.id}
                >
                  {credential.name}
                </option>
              )
            )}
          </select>
        </div>
      );
    }

    if (
      field.field_type ===
      "textarea"
    ) {
      return (
        <div  
          key={field.key}
          className="mb-4"
        >
          <label className="block mb-2">
            {field.label}
          </label>

          <textarea
            rows={field.key === "prompt" ? 5 : 8}
            value={value}
            onChange={(e) =>
              handleFieldChange(
                field.key,
                e.target.value
              )
            }
            placeholder={
              field.placeholder || ""
            }
            className="
            w-full
            p-2
            rounded
            border
            border-zinc-700
            bg-white
            text-black
            "
          />
        </div>
      );
    }

    if (
      field.field_type ===
      "number"
    ) {
      return (
        <div
          key={field.key}
          className="mb-4"
        >
          <label className="block mb-2">
            {field.label}
          </label>

          <input
            type="number"
            step="0.1"
            value={value}
            onChange={(e) =>
              handleFieldChange(
                field.key,
                Number(
                  e.target.value
                )
              )
            }
            placeholder={
              field.placeholder || ""
            }
            className="
            w-full
            p-2
            rounded
            border
            border-zinc-700
            bg-white
            text-black
            "
          />
        </div>
      );
    }

    if (
      field.field_type ===
      "select"
    ) {
      return (
        <div
          key={field.key}
          className="mb-4"
        >
          <label className="block mb-2">
            {field.label}
          </label>

          <select
            value={value}
            onChange={(e) => {
              const nextValue =
                e.target.value;

              if (field.key === "provider") {
                handleProviderChange(
                  nextValue
                );
                return;
              }

              handleFieldChange(
                field.key,
                nextValue
              );
            }}
            className="
            w-full
            p-2
            rounded
            border
            border-zinc-700
            bg-white
            text-black
            "
          >
            {(field.options || []).map(
              (
                option: string
              ) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
          </select>
        </div>
      );
    }

    return (
      <div
        key={field.key}
        className="mb-4"
      >
        <label className="block mb-2">
          {field.label}
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) =>
            handleFieldChange(
              field.key,
              e.target.value
            )
          }
          placeholder={
            field.placeholder || ""
          }
          className="
          w-full
          p-2
          rounded
          border
          border-zinc-700
          bg-white
          text-black
          "
        />
      </div>
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

      {selectedNodeDefinition?.config_fields?.map(
        renderField
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