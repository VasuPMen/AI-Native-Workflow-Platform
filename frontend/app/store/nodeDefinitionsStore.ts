import { create } from "zustand";
import { NodeDefinition } from "../types/nodeDefinition";

interface NodeDefinitionsStore {
  nodeDefinitions: NodeDefinition[];
  setNodeDefinitions: (
    definitions: NodeDefinition[]
  ) => void;
}

export const useNodeDefinitionsStore =
  create<NodeDefinitionsStore>((set) => ({
    nodeDefinitions: [],
    setNodeDefinitions: (
      definitions
    ) =>
      set({
        nodeDefinitions: definitions,
      }),
  }));