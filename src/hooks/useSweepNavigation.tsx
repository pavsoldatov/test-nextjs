import { useCallback } from "react";
import { MpSdk, Rotation, Sweep } from "../../public/bundle/sdk";
import { useMatterport } from "@/context/MatterportContext";

export interface SweepNavigationOptions {
  transitionType?: MpSdk.Sweep.Transition;
  // Time for transitions in milliseconds
  transitionTime?: number;
  // Delay between sweep movements in milliseconds
  stepDelay?: number;
  // Rotation offset to compensate for initial camera rotation (at the first sweep on initial page load)
  rotationOffset?: number;
  // Weight exponent for path calculation (higher = more natural path with more intermediate sweeps)
  pathWeightExponent?: number;
  // Final rotation to apply at the target sweep
  finalRotation?: Rotation;
}

export function useSweepNavigation() {
  const { sdk } = useMatterport();

  /**
   * Navigates sweep by sweep from the current position to a target sweep
   */
  const navigateToSweep = useCallback(
    async (targetSweepId: string, options: SweepNavigationOptions = {}) => {
      if (!sdk) {
        throw new Error("SDK not available");
      }

      const {
        transitionType = sdk.Sweep.Transition.FLY,
        transitionTime = 1000,
        stepDelay = 800,
        rotationOffset = 172.48,
        pathWeightExponent = 3,
        finalRotation,
      } = options;

      const currentSweep = await new Promise<Sweep.ObservableSweepData>(
        (resolve) => {
          const subscription = sdk.Sweep.current.subscribe((sweep) => {
            if (sweep.id && sweep.id !== "") {
              resolve(sweep);
              subscription.cancel();
            }
          });
        }
      );

      const sweepGraph = await sdk.Sweep.createGraph();

      try {
        const edgesArray = Array.from(sweepGraph.edges);
        for (const edge of edgesArray) {
          sweepGraph.setEdge({
            src: edge.src,
            dst: edge.dst,
            weight: Math.pow(edge.weight, pathWeightExponent),
          });
        }

        const startSweep = sweepGraph.vertex(currentSweep.id);
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

        for (let i = 0; i < path.length; i++) {
          const sweepVertex = path[i];
          const isLastSweep = i === path.length - 1;

          // calculate the rotation for the camera to face every next sweep
          let rotation;

          if (!isLastSweep) {
            const currentPos = sweepVertex.data.position;
            const nextPos = path[i + 1].data.position;

            // coords to determine camera facing angle
            const dx = nextPos.x - currentPos.x;
            const dz = nextPos.z - currentPos.z;

            // 1. Reset the camera y-rotation to 0
            // 2. Calculate angle using the offset to always face the next sweep position
            const angle = Math.atan2(dx, dz) * (180 / Math.PI) - rotationOffset;

            rotation = { x: 0, y: angle };
          } else if (finalRotation) {
            // use the specified final rotation if provided at the final sweep
            rotation = finalRotation;
          }

          await sdk.Sweep.moveTo(sweepVertex.data.id, {
            rotation,
            transition: transitionType,
            transitionTime,
          });

          // delay between sweeps
          if (!isLastSweep) {
            await new Promise((resolve) => setTimeout(resolve, stepDelay));
          }
        }

        return path.map((vertex) => vertex.data.id);
      } finally {
        sweepGraph.dispose();
      }
    },
    [sdk]
  );

  return { navigateToSweep };
}
