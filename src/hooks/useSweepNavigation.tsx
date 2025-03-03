import { useCallback, useRef, useState } from "react";
import { MpSdk, Rotation } from "../../public/bundle/sdk";
import { useMatterport } from "@/context/MatterportContext";
import {
  buildGraph,
  computeRotation,
  getCurrentSweep,
} from "@/lib/sweepNavigationUtils";

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
  const [navigating, setNavigating] = useState(false);
  const navigationAbortRef = useRef(false);

  /**
   * Stops any active navigation between sweeps.
   */
  const stopNavigation = useCallback(() => {
    if (navigating) {
      navigationAbortRef.current = true;
    }
  }, [navigating]);

  /**
   * Navigates sweep by sweep from the current position to a target sweep.
   */
  const navigateToSweep = useCallback(
    async (targetSweepId: string, options: SweepNavigationOptions = {}) => {
      if (!sdk) {
        throw new Error("SDK not available");
      }

      navigationAbortRef.current = false;
      setNavigating(true);

      try {
        const {
          transitionType = sdk.Sweep.Transition.FLY,
          transitionTime = 1000,
          stepDelay = 800,
          rotationOffset = 172.48,
          pathWeightExponent = 3,
          finalRotation,
        } = options;

        const currentSweep = await getCurrentSweep(sdk);
        const sweepGraph = await buildGraph(sdk, pathWeightExponent);

        try {
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
          const visitedSweeps: string[] = [];

          for (let i = 0; i < path.length; i++) {
            if (navigationAbortRef.current) return visitedSweeps;
            visitedSweeps.push(path[i].data.id);

            const rotation = computeRotation(
              i,
              path,
              rotationOffset,
              finalRotation
            );
            await sdk.Sweep.moveTo(path[i].data.id, {
              rotation,
              transition: transitionType,
              transitionTime,
            });

            // Delay between sweeps (skip delay for the final one)
            if (i !== path.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, stepDelay));
            }
          }

          return visitedSweeps;
        } finally {
          sweepGraph.dispose();
        }
      } finally {
        setNavigating(false);
        navigationAbortRef.current = false;
      }
    },
    [sdk]
  );

  return { navigateToSweep, navigating, stopNavigation };
}
