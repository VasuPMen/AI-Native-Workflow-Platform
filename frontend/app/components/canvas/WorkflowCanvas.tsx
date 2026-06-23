"use client";

import {
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";

import { useEffect } from "react";

import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "../../store/workflowStore";

import {
  saveWorkflow,
  loadWorkflow,
} from "../../lib/localStorage";

import TopBar from "../topbar/TopBar";

import StartNode from "../nodes/StartNode";
import LLMNode from "../nodes/LLMNode";

import NodeSidebar from "../sidebar/NodeSidebar";

import NodePropertiesPanel from "../panels/NodePropertiesPanel";

const nodeTypes = {
  start: StartNode,
  llm: LLMNode,
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


  const setWorkflow =
    useWorkflowStore(
      (state) =>
        state.setWorkflow
    );

  useEffect(() => {
    const workflow =
      loadWorkflow();

    if (workflow) {
      setWorkflow(
        workflow.nodes || [],
        workflow.edges || []
      );
    }
  }, [setWorkflow]);

  useEffect(() => {
    saveWorkflow(
      nodes,
      edges
    );
  }, [nodes, edges]);

  return (
    <div className="flex">
      <NodeSidebar />

      <div
        style={{
          width: "calc(100vw - 544px)",
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
            onSelectionChange={({ nodes, edges }) => {
              console.log(
                "SELECTION",
                nodes,
                edges
              );

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