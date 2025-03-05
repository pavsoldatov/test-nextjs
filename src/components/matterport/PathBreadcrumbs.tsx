import { usePathPoints } from "@/hooks/usePathPoints";
import { BlueSphere } from "./BlueSphere";
import { FC } from "react";
import { MpSdk } from "../../../public/bundle/sdk";

interface PathBreadcrumbsProps {
  path: MpSdk.Graph.Vertex<MpSdk.Sweep.ObservableSweepData>[];
  spacing?: number; // Distance between points in world units
  scale?: number;
  color?: { r: number; g: number; b: number };
  heightOffset?: number;
  includeEndpoints?: boolean;
}

export const PathBreadcrumbs: FC<PathBreadcrumbsProps> = ({
  path,
  spacing = 1.0, // 1 meter spacing by default
  scale = 0.15,
  color = { r: 0.2, g: 0.5, b: 1.0 },
  heightOffset = 0.1,
  includeEndpoints = true,
}) => {
  const positions = usePathPoints(
    path,
    spacing,
    heightOffset,
    includeEndpoints
  );

  return (
    <>
      {positions.map((position, index) => (
        <BlueSphere
          key={`path-sphere-${index}`}
          position={position}
          color={color}
          scale={
            includeEndpoints && (index === 0 || index === positions.length - 1)
              ? scale * 1.5
              : scale
          }
          visible={true}
        />
      ))}
    </>
  );
};
