import { useCallback, useRef, useState } from "react";
import { Graph, MpSdk, Rotation, Sweep } from "../../public/bundle/sdk";
import { useMatterport } from "@/context/MatterportContext";
import { computeRotation, getCurrentSweep } from "@/lib/sweepNavigationUtils";

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

interface UseSweepPathNavigationProps {
  generatePath: (
    startSweepId: string,
    targetSweepId: string,
    pathWeightExponent?: number
  ) => Promise<Graph.Vertex<Sweep.ObservableSweepData>[]>;
}

export function useSweepPathNavigation({
  generatePath,
}: UseSweepPathNavigationProps) {
  const { sdk } = useMatterport();
  const [navigating, setNavigating] = useState(false);
  const navigationAbortRef = useRef(false);

  const stopNavigation = useCallback(() => {
    if (navigating) {
      navigationAbortRef.current = true;
    }
  }, [navigating]);

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

        // Use the path generator
        const path = await generatePath(
          currentSweep.id,
          targetSweepId,
          pathWeightExponent
        );
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

          if (i !== path.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, stepDelay));
          }
        }

        return visitedSweeps;
      } finally {
        setNavigating(false);
        navigationAbortRef.current = false;
      }
    },
    [sdk, generatePath]
  );

  return {
    navigateToSweep,
    navigating,
    stopNavigation,
  };
}
