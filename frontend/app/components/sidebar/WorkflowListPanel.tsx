"use client";

import { useEffect, useState } from "react";

import {
  clearCurrentWorkflowId,
  saveCurrentWorkflowId,
} from "../../lib/localStorage";

import {
  getWorkflow,
  getWorkflows,
  deleteWorkflow,
  createWorkflow,
  updateWorkflow,
} from "../../services/workflowService";

import { useWorkflowStore } from "../../store/workflowStore";
import UnsavedChangesModal from "../modals/UnsavedChangesModal";

interface WorkflowItem {
  id: number;
  name: string;
  description?: string;
  workflow_json?: {
    nodes?: any[];
    edges?: any[];
  };
}

export default function WorkflowListPanel() {
  const [workflows, setWorkflows] =
    useState<WorkflowItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    showUnsavedOpenModal,
    setShowUnsavedOpenModal,
  ] = useState(false);

  const [
    pendingWorkflowId,
    setPendingWorkflowId,
  ] = useState<number | null>(null);

  const nodes = useWorkflowStore(
    (state) => state.nodes
  );

  const edges = useWorkflowStore(
    (state) => state.edges
  );

  const currentWorkflowName =
    useWorkflowStore(
      (state) => state.currentWorkflowName
    );

  const currentWorkflowId =
    useWorkflowStore(
      (state) => state.currentWorkflowId
    );

  const isWorkflowDirty =
    useWorkflowStore(
      (state) => state.isWorkflowDirty
    );

  const setWorkflow =
    useWorkflowStore(
      (state) => state.setWorkflow
    );

  const setCurrentWorkflow =
    useWorkflowStore(
      (state) => state.setCurrentWorkflow
    );

  const clearCurrentWorkflow =
    useWorkflowStore(
      (state) => state.clearCurrentWorkflow
    );

  const workflowListRefreshKey =
    useWorkflowStore(
      (state) =>
        state.workflowListRefreshKey
    );

  const triggerWorkflowListRefresh =
    useWorkflowStore(
      (state) =>
        state.triggerWorkflowListRefresh
    );

  const clearWorkflowExecutionResult =
    useWorkflowStore(
      (state) =>
        state.clearWorkflowExecutionResult
    );

  const setWorkflowDirty =
    useWorkflowStore(
      (state) => state.setWorkflowDirty
    );

  const fetchWorkflows = async () => {
    setLoading(true);

    try {
      const data =
        await getWorkflows();

      setWorkflows(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load workflows list");
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowIntoCanvas =
    async (workflowId: number) => {
      try {
        const workflow =
          await getWorkflow(workflowId);

        setWorkflow(
          workflow.workflow_json?.nodes ||
            [],
          workflow.workflow_json?.edges ||
            []
        );

        setCurrentWorkflow(
          workflow.id,
          workflow.name
        );

        saveCurrentWorkflowId(
          workflow.id
        );

        clearWorkflowExecutionResult();
        setWorkflowDirty(false);
      } catch (error) {
        console.error(error);
        alert("Failed to open workflow");
      }
    };

  const openWorkflow = async (
    workflowId: number
  ) => {
    if (
      currentWorkflowId === workflowId &&
      !isWorkflowDirty
    ) {
      return;
    }

    if (isWorkflowDirty) {
      setPendingWorkflowId(workflowId);
      setShowUnsavedOpenModal(true);
      return;
    }

    await loadWorkflowIntoCanvas(
      workflowId
    );
  };

  const saveCurrentWorkflow =
    async () => {
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
      }

      setWorkflowDirty(false);
      triggerWorkflowListRefresh();
    };

  const handleSaveAndOpen =
    async () => {
      if (!pendingWorkflowId) return;

      try {
        await saveCurrentWorkflow();

        const workflowIdToOpen =
          pendingWorkflowId;

        setShowUnsavedOpenModal(false);
        setPendingWorkflowId(null);

        await loadWorkflowIntoCanvas(
          workflowIdToOpen
        );
      } catch (error) {
        console.error(error);
        alert(
          "Failed to save current workflow"
        );
      }
    };

  const handleOpenWithoutSaving =
    async () => {
      if (!pendingWorkflowId) return;

      const workflowIdToOpen =
        pendingWorkflowId;

      setShowUnsavedOpenModal(false);
      setPendingWorkflowId(null);

      await loadWorkflowIntoCanvas(
        workflowIdToOpen
      );
    };

  const handleDeleteWorkflow = async (
    workflowId: number
  ) => {
    const confirmed = confirm(
      "Delete this workflow?"
    );

    if (!confirmed) return;

    try {
      await deleteWorkflow(workflowId);

      if (
        currentWorkflowId === workflowId
      ) {
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

        clearCurrentWorkflow();
        clearCurrentWorkflowId();
        clearWorkflowExecutionResult();
        setWorkflowDirty(false);
      }

      triggerWorkflowListRefresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete workflow");
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [workflowListRefreshKey]);

  return (
    <>
      <div
        className="
        w-64
        h-full
        bg-zinc-950
        border-r
        border-zinc-800
        p-4
        overflow-y-auto
        "
      >
        <h2
          className="
          text-white
          text-lg
          font-semibold
          mb-4
          "
        >
          My Workflows
        </h2>

        {loading ? (
          <p className="text-zinc-400 text-sm">
            Loading workflows...
          </p>
        ) : workflows.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            No workflows found
          </p>
        ) : (
          <div className="space-y-3">
            {workflows.map(
              (workflow) => (
                <div
                  key={workflow.id}
                  className="
                  bg-zinc-900
                  border
                  border-zinc-700
                  rounded
                  p-3
                  "
                >
                  <div
                    onClick={() =>
                      openWorkflow(
                        workflow.id
                      )
                    }
                    className="cursor-pointer"
                  >
                    <div className="text-white font-medium">
                      {workflow.name}
                    </div>

                    <div className="text-zinc-400 text-xs mt-1">
                      ID: {workflow.id}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteWorkflow(
                        workflow.id
                      )
                    }
                    className="
                    w-full
                    mt-3
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    text-sm
                    px-3
                    py-2
                    rounded
                    "
                  >
                    Delete Workflow
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <UnsavedChangesModal
        open={showUnsavedOpenModal}
        title="Unsaved changes"
        message="You have unsaved changes in the current workflow. What would you like to do before opening another workflow?"
        primaryActionText="Save & Open"
        secondaryActionText="Open Without Saving"
        onPrimaryAction={
          handleSaveAndOpen
        }
        onSecondaryAction={
          handleOpenWithoutSaving
        }
        onClose={() => {
          setShowUnsavedOpenModal(false);
          setPendingWorkflowId(null);
        }}
      />
    </>
  );
}