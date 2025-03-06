import { create } from "zustand";
import { Graph, Sweep } from "../../../../public/bundle/sdk";

interface PathState {
  currentPath: Graph.Vertex<Sweep.ObservableSweepData>[];
  isNavigating: boolean;
  setPath: (path: Graph.Vertex<Sweep.ObservableSweepData>[]) => void;
  setNavigating: (isNavigating: boolean) => void;
}

export const usePathStore = create<PathState>((set) => ({
  currentPath: [],
  isNavigating: false,
  setPath: (path) => set({ currentPath: path }),
  setNavigating: (isNavigating) => set({ isNavigating }),
}));
