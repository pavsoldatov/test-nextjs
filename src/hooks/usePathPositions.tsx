import { useMemo } from "react";
import { MpSdk, Vector3 } from "../../public/bundle/sdk";

/**
 * Calculate distance between two 3D points
 */
function calculateDistance(p1: Vector3, p2: Vector3): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Linear interpolation between two points
 */
function lerpPoints(p1: Vector3, p2: Vector3, t: number): Vector3 {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
    z: p1.z + (p2.z - p1.z) * t,
  };
}

/**
 * Hook to generate positions along a path with specified spacing between them
 *
 * @param path Array of vertices containing position data
 * @param spacing Distance between points (in the same units as positions)
 * @param height Optional vertical positional offset for the path points
 * @param includeEndpoints Whether to always include the start and end points (default: true)
 * @returns Array of Vector3 positions with the specified spacing
 */
export function usePathPositions(
  path:
    | MpSdk.Graph.Vertex<MpSdk.Sweep.ObservableSweepData>[]
    | null
    | undefined,
  spacing: number = 1.0,
  heightOffset: number = 0,
  includeEndpoints: boolean = true
): Vector3[] {
  return useMemo(() => {
    // Handle empty path cases
    if (!path || path.length === 0) return [];
    if (path.length === 1) {
      const pos = path[0].data.position;
      return [{ x: pos.x, y: pos.y + heightOffset, z: pos.z }];
    }

    // Extract positions from the path
    const positions: Vector3[] = path.map((point) => {
      const pos = point.data.position;
      return {
        x: pos.x,
        y: pos.y + heightOffset,
        z: pos.z,
      };
    });

    // Calculate the total length of the path and segment distances
    let totalDistance = 0;
    const segmentDistances: number[] = [];

    for (let i = 0; i < positions.length - 1; i++) {
      const distance = calculateDistance(positions[i], positions[i + 1]);
      segmentDistances.push(distance);
      totalDistance += distance;
    }

    // If path has no significant length, return first position
    if (totalDistance < 0.0001) return [positions[0]];

    // Ensure spacing is positive
    const effectiveSpacing = Math.max(0.0001, spacing);

    // Generate points at specified spacing
    const result: Vector3[] = [];

    // Always include the first point if includeEndpoints is true
    if (includeEndpoints) {
      result.push({ ...positions[0] });
    }

    // Step along the path at regular intervals defined by spacing
    let accumulatedDistance = 0;
    let currentSegment = 0;
    let currentDistance = effectiveSpacing; // Start at first spacing interval

    while (currentDistance < totalDistance - 0.0001) {
      // Small epsilon to avoid precision issues
      // Find the segment where this point should be
      while (
        currentSegment < segmentDistances.length &&
        accumulatedDistance + segmentDistances[currentSegment] < currentDistance
      ) {
        accumulatedDistance += segmentDistances[currentSegment];
        currentSegment++;
      }

      // If we've gone beyond the path, stop
      if (currentSegment >= segmentDistances.length) break;

      // Calculate the interpolation factor within the current segment
      const segmentProgress =
        (currentDistance - accumulatedDistance) /
        segmentDistances[currentSegment];

      // Interpolate between the two points of the segment
      const p1 = positions[currentSegment];
      const p2 = positions[currentSegment + 1];
      const interpolatedPoint = lerpPoints(p1, p2, segmentProgress);

      result.push(interpolatedPoint);

      // Move to the next position at specified spacing
      currentDistance += effectiveSpacing;
    }

    // Include the end point if requested and not too close to the last added point
    if (includeEndpoints && positions.length > 1) {
      const lastPoint = positions[positions.length - 1];

      if (
        result.length === 0 ||
        calculateDistance(result[result.length - 1], lastPoint) >
          effectiveSpacing * 0.5
      ) {
        result.push({ ...lastPoint });
      }
    }

    // Edge case: ensure we have at least one point
    if (result.length === 0) {
      // Add a midpoint as fallback
      result.push({ ...positions[Math.floor(positions.length / 2)] });
    }

    return [...result];
  }, [path, spacing, includeEndpoints, heightOffset]);
}
