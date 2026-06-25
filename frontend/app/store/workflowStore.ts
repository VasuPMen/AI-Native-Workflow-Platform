import { create } from "zustand";

import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];

  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  currentWorkflowId: number | null;
  currentWorkflowName: string;
  workflowListRefreshKey: number;

  workflowExecutionResult: string;

  isWorkflowDirty: boolean;

  setWorkflowDirty: (
    value: boolean
  ) => void;

  setWorkflowExecutionResult: (
    result: string
  ) => void;

  clearWorkflowExecutionResult: () => void;

  onNodesChange: (
    changes: NodeChange[]
  ) => void;

  onEdgesChange: (
    changes: EdgeChange[]
  ) => void;

  onConnect: (
    connection: Connection
  ) => void;

addNode: (
  type: string,
  initialData?: Record<string, any>
) => void;

  setSelectedNodeId: (
    nodeId: string | null
  ) => void;

  setSelectedEdgeId: (
    edgeId: string | null
  ) => void;

  deleteNode: (
    nodeId: string
  ) => void;

  deleteEdge: (
    edgeId: string
  ) => void;

  updateNodeData: (
    nodeId: string,
    data: Record<string, any>
  ) => void;

  setWorkflow: (
    nodes: Node[],
    edges: Edge[]
  ) => void;

  mergeWorkflow: (
    nodes: Node[],
    edges: Edge[]
  ) => void;

  setCurrentWorkflow: (
    id: number | null,
    name: string
  ) => void;

  setCurrentWorkflowName: (
    name: string
  ) => void;

  clearCurrentWorkflow: () => void;

  triggerWorkflowListRefresh: () => void;
}

export const useWorkflowStore =
  create<WorkflowStore>((set) => ({
    nodes: [
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

    edges: [],

    selectedNodeId: null,
    selectedEdgeId: null,

    currentWorkflowId: null,
    currentWorkflowName:
      "Untitled Workflow",
    workflowListRefreshKey: 0,

    workflowExecutionResult: "",

    isWorkflowDirty: false,

    onNodesChange: (changes) =>
      set((state) => ({
        ...state,
        nodes: applyNodeChanges(
          changes,
          state.nodes
        ),
        isWorkflowDirty: true,
      })),

    onEdgesChange: (changes) =>
      set((state) => ({
        ...state,
        edges: applyEdgeChanges(
          changes,
          state.edges
        ),
        isWorkflowDirty: true,
      })),

    onConnect: (connection) =>
      set((state) => {
        const alreadyExists =
          state.edges.some(
            (edge) =>
              edge.source ===
                connection.source &&
              edge.target ===
                connection.target
          );

        if (alreadyExists) {
          alert(
            "Connection already exists"
          );
          return state;
        }

        return {
          ...state,
          edges: addEdge(
            connection,
            state.edges
          ),
          isWorkflowDirty: true,
        };
      }),

addNode: (
  type,
  initialData = {}
) =>
  set((state) => {
    if (
      type === "start" &&
      state.nodes.some(
        (node) =>
          node.type === "start"
      )
    ) {
      alert(
        "Only one Start Node is allowed"
      );
      return state;
    }

    const defaultName =
      initialData.name ||
      (type === "start"
        ? "Start Node"
        : "Untitled Node");

    return {
      ...state,
      nodes: [
        ...state.nodes,
        {
          id: crypto.randomUUID(),
          type,
          position: {
            x:
              200 +
              state.nodes.length * 50,
            y:
              200 +
              state.nodes.length * 50,
          },
          data: {
            name: defaultName,
            ...initialData,
          },
        },
      ],
      isWorkflowDirty: true,
    };
  }),

    setSelectedNodeId: (
      nodeId
    ) => {
      set({
        selectedNodeId: nodeId,
        selectedEdgeId: null,
      });
    },

    setSelectedEdgeId: (
      edgeId
    ) => {
      set({
        selectedEdgeId: edgeId,
        selectedNodeId: null,
      });
    },

    deleteNode: (nodeId) =>
      set((state) => {
        const node =
          state.nodes.find(
            (n) => n.id === nodeId
          );

        if (
          node?.type === "start"
        ) {
          alert(
            "Start Node cannot be deleted"
          );
          return state;
        }

        return {
          ...state,
          nodes:
            state.nodes.filter(
              (node) =>
                node.id !== nodeId
            ),
          edges:
            state.edges.filter(
              (edge) =>
                edge.source !== nodeId &&
                edge.target !== nodeId
            ),
          selectedNodeId: null,
          selectedEdgeId: null,
          isWorkflowDirty: true,
        };
      }),

    deleteEdge: (edgeId) =>
      set((state) => ({
        ...state,
        edges:
          state.edges.filter(
            (edge) =>
              edge.id !== edgeId
          ),
        selectedEdgeId: null,
        isWorkflowDirty: true,
      })),

    updateNodeData: (
      nodeId,
      data
    ) =>
      set((state) => ({
        ...state,
        nodes:
          state.nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    ...data,
                  },
                }
              : node
          ),
        isWorkflowDirty: true,
      })),

    setWorkflow: (
      nodes,
      edges
    ) =>
      set((state) => ({
        ...state,
        nodes,
        edges,
        selectedNodeId: null,
        selectedEdgeId: null,
        isWorkflowDirty: false,
      })),

    mergeWorkflow: (
      importedNodes,
      importedEdges
    ) =>
      set((state) => {
        const idMap =
          new Map<string, string>();

        const remappedNodes =
          importedNodes
            .filter(
              (node) =>
                node.type !== "start"
            )
            .map((node) => {
              const newId =
                crypto.randomUUID();

              idMap.set(
                node.id,
                newId
              );

              return {
                ...node,
                id: newId,
                position: {
                  x:
                    node.position.x + 100,
                  y:
                    node.position.y + 100,
                },
              };
            });

        const remappedEdges =
          importedEdges
            .filter(
              (edge) =>
                idMap.has(
                  edge.source
                ) &&
                idMap.has(
                  edge.target
                )
            )
            .map((edge) => ({
              ...edge,
              id: crypto.randomUUID(),
              source: idMap.get(
                edge.source
              )!,
              target: idMap.get(
                edge.target
              )!,
            }));

        return {
          ...state,
          nodes: [
            ...state.nodes,
            ...remappedNodes,
          ],
          edges: [
            ...state.edges,
            ...remappedEdges,
          ],
          isWorkflowDirty: true,
        };
      }),

    setCurrentWorkflow: (
      id,
      name
    ) =>
      set((state) => ({
        ...state,
        currentWorkflowId: id,
        currentWorkflowName: name,
      })),

    setCurrentWorkflowName: (
      name
    ) =>
      set((state) => ({
        ...state,
        currentWorkflowName: name,
        isWorkflowDirty: true,
      })),

    clearCurrentWorkflow: () =>
      set((state) => ({
        ...state,
        currentWorkflowId: null,
        currentWorkflowName:
          "Untitled Workflow",
        isWorkflowDirty: false,
      })),

    setWorkflowExecutionResult: (
      result
    ) =>
      set({
        workflowExecutionResult:
          result,
      }),

    clearWorkflowExecutionResult: () =>
      set({
        workflowExecutionResult: "",
      }),

    setWorkflowDirty: (value) =>
      set({
        isWorkflowDirty: value,
      }),

    triggerWorkflowListRefresh: () =>
      set((state) => ({
        ...state,
        workflowListRefreshKey:
          state.workflowListRefreshKey + 1,
      })),
  }));