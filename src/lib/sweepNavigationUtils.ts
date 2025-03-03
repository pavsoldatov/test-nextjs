import { MpSdk, Rotation, Sweep } from "../../public/bundle/sdk";

/**
 * Retrieves the current sweep using the SDK's observable.
 */
export async function getCurrentSweep(
  sdk: MpSdk
): Promise<Sweep.ObservableSweepData> {
  return new Promise<Sweep.ObservableSweepData>((resolve) => {
    const subscription = sdk.Sweep.current.subscribe((sweep) => {
      if (sweep.id && sweep.id !== "") {
        resolve(sweep);
        subscription.cancel();
      }
    });
  });
}

/**
 * Computes the camera rotation for a given node in the path.
 * - For intermediate sweeps, it calculates the angle so that the camera faces every next sweep.
 * - For the final sweep, it returns the provided finalRotation (if any).
 */
export function computeRotation(
  index: number,
  path: MpSdk.Graph.Vertex<MpSdk.Sweep.ObservableSweepData>[],
  rotationOffset: number,
  finalRotation?: Rotation
): Rotation | undefined {
  const isLastSweep = index === path.length - 1;
  if (!isLastSweep) {
    const currentPos = path[index].data.position;
    const nextPos = path[index + 1].data.position;
    const dx = nextPos.x - currentPos.x;
    const dz = nextPos.z - currentPos.z;

    // compute the angle in degrees such that the camera faces the next sweep.
    const angle = Math.atan2(dx, dz) * (180 / Math.PI) - rotationOffset;
    return { x: 0, y: angle };
  }
  if (finalRotation) {
    return finalRotation;
  }
  return undefined;
}

/**
 * Creates the sweep graph and adjusts edge weights.
 */
export async function buildGraph(
  sdk: MpSdk,
  pathWeightExponent: number
): Promise<MpSdk.Graph.IDirectedGraph<MpSdk.Sweep.ObservableSweepData>> {
  const graph = await sdk.Sweep.createGraph();
  const edgesArray = Array.from(graph.edges);
  for (const edge of edgesArray) {
    graph.setEdge({
      src: edge.src,
      dst: edge.dst,
      weight: Math.pow(edge.weight, pathWeightExponent),
    });
  }
  return graph;
}
