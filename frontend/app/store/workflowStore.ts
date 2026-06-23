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
    type: string
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

      {
        id: "2",

        type: "llm",

        position: {
          x: 450,
          y: 100,
        },

        data: {
          name: "LLM Node",
          model: "gpt-4o",
          prompt: "",
          temperature: 0.7,
        },
      },
    ],

    edges: [],

    selectedNodeId: null,

    selectedEdgeId: null,

onNodesChange: (changes) =>
  set((state) => ({
    ...state,

    nodes: applyNodeChanges(
      changes,
      state.nodes
    ),
  })),

onEdgesChange: (changes) =>
  set((state) => ({
    ...state,

    edges: applyEdgeChanges(
      changes,
      state.edges
    ),
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
    };
  }),

    addNode: (type) =>
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

          return {};
        }

        return {
          nodes: [
            ...state.nodes,
            {
              id: crypto.randomUUID(),

              type,

              position: {
                x:
                  200 +
                  state.nodes.length *
                  50,

                y:
                  200 +
                  state.nodes.length *
                  50,
              },

              data:
                type === "llm"
                  ? {
                    name:
                      "LLM Node",

                    model:
                      "gpt-4o",

                    prompt: "",

                    temperature:
                      0.7,
                  }
                  : {
                    name:
                      "Start Node",
                  },
            },
          ],
        };
      }),

setSelectedNodeId: (
  nodeId
) => {
  console.log(
    "BEFORE",
    useWorkflowStore.getState()
      .selectedNodeId
  );

  set({
    selectedNodeId: nodeId,
    selectedEdgeId: null,
  });

  console.log(
    "AFTER",
    useWorkflowStore.getState()
      .selectedNodeId
  );
},

setSelectedEdgeId: (
  edgeId
) => {
  console.log(
    "BEFORE EDGE",
    useWorkflowStore.getState()
      .selectedEdgeId
  );

  set({
    selectedEdgeId: edgeId,
    selectedNodeId: null,
  });

  console.log(
    "AFTER EDGE",
    useWorkflowStore.getState()
      .selectedEdgeId
  );
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
      nodes:
        state.nodes.filter(
          (node) =>
            node.id !== nodeId
        ),

      edges:
        state.edges.filter(
          (edge) =>
            edge.source !==
              nodeId &&
            edge.target !==
              nodeId
        ),

      selectedNodeId:
        null,

      selectedEdgeId:
        null,
    };
  }),
    deleteEdge: (edgeId) =>
      set((state) => ({
        edges:
          state.edges.filter(
            (edge) =>
              edge.id !== edgeId
          ),

        selectedEdgeId:
          null,
      })),

    updateNodeData: (
      nodeId,
      data
    ) =>
      set((state) => ({
        nodes:
          state.nodes.map(
            (node) =>
              node.id ===
                nodeId
                ? {
                  ...node,

                  data: {
                    ...node.data,
                    ...data,
                  },
                }
                : node
          ),
      })),

    setWorkflow: (
      nodes,
      edges
    ) => {
      console.log(
        "SET WORKFLOW CALLED"
      );

      set({
        nodes,
        edges,

        selectedNodeId: null,
        selectedEdgeId: null,
      });
    },

    mergeWorkflow: (
      importedNodes,
      importedEdges
    ) =>
      set((state) => {
        const idMap =
          new Map<
            string,
            string
          >();

        const remappedNodes =
          importedNodes
            .filter(
              (node) =>
                node.type !==
                "start"
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
                    node.position.x +
                    100,

                  y:
                    node.position.y +
                    100,
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

              id:
                crypto.randomUUID(),

              source:
                idMap.get(
                  edge.source
                )!,

              target:
                idMap.get(
                  edge.target
                )!,
            }));

        return {
          nodes: [
            ...state.nodes,
            ...remappedNodes,
          ],

          edges: [
            ...state.edges,
            ...remappedEdges,
          ],
        };
      }),
  }));