"use client";

import { useRef, useState } from "react";

import { useWorkflowStore } from "../../store/workflowStore";

import { validateWorkflow } from "../../lib/workflowValidation";

import JsonPreviewModal from "../modals/JsonPreviewModal";

export default function TopBar() {
  const nodes = useWorkflowStore(
    (state) => state.nodes
  );

  const edges = useWorkflowStore(
    (state) => state.edges
  );

  const setWorkflow =
    useWorkflowStore(
      (state) => state.setWorkflow
    );

  const mergeWorkflow =
    useWorkflowStore(
      (state) => state.mergeWorkflow
    );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showJson, setShowJson] =
    useState(false);

  const workflowJson =
    JSON.stringify(
      {
        nodes,
        edges,
      },
      null,
      2
    );

  const exportWorkflow = () => {
    const result =
      validateWorkflow(
        nodes,
        edges
      );

    if (!result.valid) {
      alert(
        result.errors.join(
          "\n"
        )
      );

      return;
    }

    const workflow = {
      nodes,
      edges,
    };

    const json = JSON.stringify(
      workflow,
      null,
      2
    );

    const blob = new Blob(
      [json],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "workflow.json";

    link.click();

    URL.revokeObjectURL(url);
  };

  const importWorkflow = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (e) => {
      try {
        const workflow =
          JSON.parse(
            e.target?.result as string
          );

        const addToCurrent =
          confirm(
            "Press OK to ADD this workflow to the current canvas.\n\nPress Cancel to REPLACE the current workflow."
          );

        if (addToCurrent) {
          mergeWorkflow(
            workflow.nodes || [],
            workflow.edges || []
          );

          alert(
            "Workflow added to current canvas"
          );
        } else {
          setWorkflow(
            workflow.nodes || [],
            workflow.edges || []
          );

          alert(
            "Workflow replaced"
          );
        }
      } catch {
        alert(
          "Invalid workflow file"
        );
      }
    };

    reader.readAsText(file);
  };

  const validate = () => {
    const result =
      validateWorkflow(
        nodes,
        edges
      );

    if (result.valid) {
      alert(
        "Workflow Valid"
      );
    } else {
      alert(
        result.errors.join(
          "\n"
        )
      );
    }
  };

  return (
    <>
      <div
        className="
        h-14
        bg-zinc-900
        border-b
        border-zinc-700
        flex
        items-center
        justify-end
        gap-2
        px-4
        "
      >
        <button
          onClick={validate}
          className="
          bg-yellow-500
          hover:bg-yellow-600
          text-white
          px-4
          py-2
          rounded
          "
        >
          Validate
        </button>

        <button
          onClick={() =>
            setShowJson(true)
          }
          className="
          bg-purple-600
          hover:bg-purple-700
          text-white
          px-4
          py-2
          rounded
          "
        >
          JSON
        </button>

        <button
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-4
          py-2
          rounded
          "
        >
          Import
        </button>

        <button
          onClick={exportWorkflow}
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-4
          py-2
          rounded
          "
        >
          Export
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          hidden
          onChange={importWorkflow}
        />
      </div>

      <JsonPreviewModal
        open={showJson}
        onClose={() =>
          setShowJson(false)
        }
        json={workflowJson}
      />
    </>
  );
}