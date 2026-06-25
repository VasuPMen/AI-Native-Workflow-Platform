"use client";

import { useRef, useState } from "react";

import { useWorkflowStore } from "../../store/workflowStore";

import { validateWorkflow } from "../../lib/workflowValidation";

import {
  saveCurrentWorkflowId,
  clearCurrentWorkflowId,
} from "../../lib/localStorage";

import RunWorkflowModal from "../modals/RunWorkflowModal";
import JsonPreviewModal from "../modals/JsonPreviewModal";
import UnsavedChangesModal from "../modals/UnsavedChangesModal";

import {
  createWorkflow,
  updateWorkflow,
  executeWorkflow,
} from "../../services/workflowService";

export default function TopBar() {
  const nodes = useWorkflowStore(
    (state) => state.nodes
  );

  const edges = useWorkflowStore(
    (state) => state.edges
  );

  const setWorkflow = useWorkflowStore(
    (state) => state.setWorkflow
  );

  const mergeWorkflow =
    useWorkflowStore(
      (state) => state.mergeWorkflow
    );

  const currentWorkflowId =
    useWorkflowStore(
      (state) => state.currentWorkflowId
    );

  const currentWorkflowName =
    useWorkflowStore(
      (state) => state.currentWorkflowName
    );

  const setCurrentWorkflow =
    useWorkflowStore(
      (state) => state.setCurrentWorkflow
    );

  const setCurrentWorkflowName =
    useWorkflowStore(
      (state) => state.setCurrentWorkflowName
    );

  const triggerWorkflowListRefresh =
    useWorkflowStore(
      (state) =>
        state.triggerWorkflowListRefresh
    );

  const setWorkflowExecutionResult =
    useWorkflowStore(
      (state) =>
        state.setWorkflowExecutionResult
    );

  const clearWorkflowExecutionResult =
    useWorkflowStore(
      (state) =>
        state.clearWorkflowExecutionResult
    );

  const isWorkflowDirty =
    useWorkflowStore(
      (state) => state.isWorkflowDirty
    );

  const setWorkflowDirty =
    useWorkflowStore(
      (state) => state.setWorkflowDirty
    );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showJson, setShowJson] =
    useState(false);

  const [showRunResult, setShowRunResult] =
    useState(false);

  const [runResult, setRunResult] =
    useState<any>(null);

  const [
    showUnsavedNewModal,
    setShowUnsavedNewModal,
  ] = useState(false);

  const workflowJson = JSON.stringify(
    {
      nodes,
      edges,
    },
    null,
    2
  );

  const resetCanvasToNewWorkflow = () => {
    setWorkflow(
      [
        {
          id: "1",
          type: "start",
          position: {
            x: 100,
            y: 100,
          },
          data: {
            name: "Start Node",
          },
        },
      ],
      []
    );

    setCurrentWorkflow(
      null,
      "Untitled Workflow"
    );

    clearCurrentWorkflowId();
    clearWorkflowExecutionResult();
    setWorkflowDirty(false);
  };

  const saveWorkflow = async () => {
    try {
      const payload = {
        name: currentWorkflowName,
        description:
          "Created from React Flow",
        workflow_json: {
          nodes,
          edges,
        },
      };

      if (currentWorkflowId) {
        const updatedWorkflow =
          await updateWorkflow(
            currentWorkflowId,
            payload
          );

        setCurrentWorkflow(
          updatedWorkflow.id,
          updatedWorkflow.name
        );

        saveCurrentWorkflowId(
          updatedWorkflow.id
        );

        setWorkflowDirty(false);
        triggerWorkflowListRefresh();

        alert("Workflow updated");
      } else {
        const workflow =
          await createWorkflow(
            payload
          );

        setCurrentWorkflow(
          workflow.id,
          workflow.name
        );

        saveCurrentWorkflowId(
          workflow.id
        );

        setWorkflowDirty(false);
        triggerWorkflowListRefresh();

        alert("Workflow saved");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save workflow"
      );
      throw error;
    }
  };

  const createNewWorkflow = () => {
    if (isWorkflowDirty) {
      setShowUnsavedNewModal(true);
      return;
    }

    resetCanvasToNewWorkflow();
  };

  const handleSaveAndNew =
    async () => {
      try {
        await saveWorkflow();
        setShowUnsavedNewModal(false);
        resetCanvasToNewWorkflow();
      } catch {
        // saveWorkflow already alerts
      }
    };

  const handleNewWithoutSaving =
    () => {
      setShowUnsavedNewModal(false);
      resetCanvasToNewWorkflow();
    };

const runWorkflow = async () => {
  try {
    let workflowId = currentWorkflowId;

    if (isWorkflowDirty || !workflowId) {
      if (workflowId) {
        const updatedWorkflow =
          await updateWorkflow(workflowId, {
            name: currentWorkflowName,
            description: "",
            workflow_json: {
              nodes,
              edges,
            },
          });

        workflowId = updatedWorkflow.id;

        setCurrentWorkflow(
          updatedWorkflow.id,
          updatedWorkflow.name
        );

        saveCurrentWorkflowId(
          updatedWorkflow.id
        );
      } else {
        const createdWorkflow =
          await createWorkflow({
            name: currentWorkflowName,
            description: "",
            workflow_json: {
              nodes,
              edges,
            },
          });

        workflowId = createdWorkflow.id;

        setCurrentWorkflow(
          createdWorkflow.id,
          createdWorkflow.name
        );

        saveCurrentWorkflowId(
          createdWorkflow.id
        );
      }

      setWorkflowDirty(false);
      triggerWorkflowListRefresh();
    }

    if (!workflowId) {
      alert(
        "Failed to prepare workflow for execution"
      );
      return;
    }

    clearWorkflowExecutionResult();

    const result =
      await executeWorkflow(workflowId);

    setRunResult(result);

    setWorkflowExecutionResult(
      result?.final_output || ""
    );

    setShowRunResult(true);
  } catch (error: any) {
    console.error(error);

    const backendMessage =
      error?.response?.data?.detail;

    if (backendMessage) {
      alert(backendMessage);
      return;
    }

    alert("Failed to run workflow");
  }
};


  const exportWorkflow = () => {
    const result =
      validateWorkflow(
        nodes,
        edges
      );

    if (!result.valid) {
      alert(
        result.errors.join("\n")
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
            e.target
              ?.result as string
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

          setWorkflowDirty(true);

          alert(
            "Workflow added to current canvas"
          );
        } else {
          setWorkflow(
            workflow.nodes || [],
            workflow.edges || []
          );

          setCurrentWorkflow(
            null,
            "Imported Workflow"
          );

          clearCurrentWorkflowId();
          clearWorkflowExecutionResult();
          setWorkflowDirty(true);

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
      alert("Workflow Valid");
    } else {
      alert(
        result.errors.join("\n")
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
        justify-between
        gap-2
        px-4
        "
      >
        <input
          type="text"
          value={currentWorkflowName}
          onChange={(e) => {
            setCurrentWorkflowName(
              e.target.value
            );
          }}
          placeholder="Workflow Name"
          className="
          bg-zinc-800
          border
          border-zinc-600
          text-white
          px-3
          py-2
          rounded
          w-64
          "
        />

        <div className="flex items-center gap-2">
          <button
            onClick={createNewWorkflow}
            className="
            bg-zinc-700
            hover:bg-zinc-600
            text-white
            px-4
            py-2
            rounded
            "
          >
            New
          </button>

          <button
            onClick={runWorkflow}
            className="
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-4
            py-2
            rounded
            "
          >
            {isWorkflowDirty || !currentWorkflowId
              ? "Save & Run"
              : "Run"}
          </button>

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
            onClick={saveWorkflow}
            className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-4
            py-2
            rounded
            "
          >
            {currentWorkflowId
              ? "Update"
              : "Save"}
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
        </div>

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

      <RunWorkflowModal
        open={showRunResult}
        onClose={() =>
          setShowRunResult(false)
        }
        result={runResult}
      />

      <UnsavedChangesModal
        open={showUnsavedNewModal}
        title="Unsaved changes"
        message="You have unsaved changes in the current workflow. What would you like to do before creating a new workflow?"
        primaryActionText="Save & New"
        secondaryActionText="New Without Saving"
        onPrimaryAction={
          handleSaveAndNew
        }
        onSecondaryAction={
          handleNewWithoutSaving
        }
        onClose={() =>
          setShowUnsavedNewModal(false)
        }
      />
    </>
  );
}