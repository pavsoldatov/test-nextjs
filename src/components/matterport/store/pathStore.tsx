import { create } from "zustand";
import { MpSdk } from "../../../../public/bundle/sdk";

interface PathState {
  currentPath: MpSdk.Graph.Vertex<MpSdk.Sweep.ObservableSweepData>[];
  isNavigating: boolean;
  setPath: (
    path: MpSdk.Graph.Vertex<MpSdk.Sweep.ObservableSweepData>[]
  ) => void;
  setNavigating: (isNavigating: boolean) => void;
}

export const usePathStore = create<PathState>((set) => ({
  currentPath: [],
  isNavigating: false,
  setPath: (path) => set({ currentPath: path }),
  setNavigating: (isNavigating) => set({ isNavigating }),
}));
