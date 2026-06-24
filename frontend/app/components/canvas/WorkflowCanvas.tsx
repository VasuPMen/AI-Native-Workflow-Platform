"use client";

import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";

import { useEffect } from "react";

import WorkflowListPanel from "../sidebar/WorkflowListPanel";

import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "../../store/workflowStore";

import { getWorkflow } from "../../services/workflowService";

import { loadCurrentWorkflowId } from "../../lib/localStorage";

import TopBar from "../topbar/TopBar";

import StartNode from "../nodes/StartNode";
import LLMNode from "../nodes/LLMNode";

import TextInputNode from "../nodes/TextInputNode";
import OutputNode from "../nodes/OutputNode";

import NodeSidebar from "../sidebar/NodeSidebar";

import NodePropertiesPanel from "../panels/NodePropertiesPanel";

const nodeTypes = {
  start: StartNode,
  llm: LLMNode,
  text_input: TextInputNode,
  output: OutputNode,
};

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore(
    (state) => state.nodes
  );

  const edges = useWorkflowStore(
    (state) => state.edges
  );

  const onNodesChange = useWorkflowStore(
    (state) => state.onNodesChange
  );

  const onEdgesChange = useWorkflowStore(
    (state) => state.onEdgesChange
  );

  const onConnect = useWorkflowStore(
    (state) => state.onConnect
  );

  const setSelectedNodeId =
    useWorkflowStore(
      (state) =>
        state.setSelectedNodeId
    );

  const setSelectedEdgeId =
    useWorkflowStore(
      (state) =>
        state.setSelectedEdgeId
    );

  const setWorkflow = useWorkflowStore(
    (state) => state.setWorkflow
  );

  const setCurrentWorkflow =
    useWorkflowStore(
      (state) => state.setCurrentWorkflow
    );

  useEffect(() => {
    const restoreWorkflow = async () => {
      try {
        const workflowId =
          loadCurrentWorkflowId();

        if (!workflowId) return;

        const workflow =
          await getWorkflow(
            workflowId
          );

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
      } catch (error) {
        console.error(
          "Failed to restore workflow",
          error
        );
      }
    };

    restoreWorkflow();
  }, [setWorkflow, setCurrentWorkflow]);

  return (
    <div className="flex">
      <WorkflowListPanel />
      <NodeSidebar />

      <div
        className="flex-1"
        style={{
          height: "100vh",
        }}
      >
        <TopBar />

        <div
          style={{
            height:
              "calc(100vh - 56px)",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={({
              nodes,
              edges,
            }) => {
              if (nodes.length > 0) {
                setSelectedNodeId(
                  nodes[0].id
                );
              } else if (
                edges.length > 0
              ) {
                setSelectedEdgeId(
                  edges[0].id
                );
              }
            }}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <NodePropertiesPanel />
    </div>
  );
}