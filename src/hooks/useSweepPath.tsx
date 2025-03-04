import { useMatterport } from "@/context/MatterportContext";
import { useCallback, useState } from "react";
import { Graph, Sweep } from "../../public/bundle/sdk";
import { buildGraph } from "@/lib/sweepNavigationUtils";

export function useSweepPath() {
  const { sdk } = useMatterport();
  const [currentPath, setCurrentPath] = useState<
    Graph.Vertex<Sweep.ObservableSweepData>[]
  >([]);

  const clearPath = useCallback(() => {
    setCurrentPath([]);
  }, []);

  const generatePath = useCallback(
    async (
      startSweepId: string,
      targetSweepId: string,
      pathWeightExponent = 3
    ) => {
      if (!sdk) {
        throw new Error("SDK not available");
      }

      try {
        const sweepGraph = await buildGraph(sdk, pathWeightExponent);

        try {
          const startSweep = sweepGraph.vertex(startSweepId);
          const endSweep = sweepGraph.vertex(targetSweepId);

          if (!startSweep || !endSweep) {
            throw new Error("Start or end sweep not found in graph");
          }

          const aStarResult = sdk.Graph.createAStarRunner(
            sweepGraph,
            startSweep,
            endSweep
          ).exec();

          if (aStarResult.status !== sdk.Graph.AStarStatus.SUCCESS) {
            throw new Error(`Path finding failed: ${aStarResult.status}`);
          }

          const path = aStarResult.path;
          setCurrentPath(path);
          return path;
        } finally {
          sweepGraph.dispose();
        }
      } catch (error) {
        console.error("Error generating path:", error);
        setCurrentPath([]);
        throw error;
      }
    },
    [sdk]
  );

  return {
    currentPath,
    generatePath,
    clearPath,
  };
}
