import { BreadcrumbItem, BreadcrumbItemProps } from "./BreadcrumbItem";
import { FC, useCallback, useEffect, useState } from "react";
import { usePathStore } from "./store/pathStore";
import { Color } from "../../../public/bundle/sdk";
import { usePathPositions } from "@/hooks/usePathPositions";

interface BreadcrumbsProps {
  spacing?: number; // Distance between points in world units
  scale?: number;
  heightOffset?: number;
  color?: Color;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  spacing = 1,
  scale = 0.1,
  color = { r: 0.2, g: 0.5, b: 1.0 },
  heightOffset = 0,
}) => {
  const { currentPath } = usePathStore();
  const positions = usePathPositions(currentPath, spacing, -heightOffset, true);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemProps[]>([]);

  const initializebreadcrumbs = useCallback(() => {
    const initBreadcrumbs: BreadcrumbItemProps[] = [];

    for (let i = 0; i < positions.length; i++) {
      initBreadcrumbs.push({
        id: `breadcrumb-${i}`,
        position: { x: 0, y: 0, z: 0 },
        color: { ...color },
        scale,
      });
    }

    setBreadcrumbs([...initBreadcrumbs]);
  }, [color, positions, scale]);

  const updateSpherePositions = useCallback(() => {
    const breadcrumbs: BreadcrumbItemProps[] = [];

    for (let i = 0; i < positions.length; i++) {
      breadcrumbs.push({
        id: `breadcrumb-${i}`,
        position: positions[i],
        color: { ...color },
        scale,
      });
    }

    setBreadcrumbs([...breadcrumbs]);
  }, [color, positions, scale]);

  useEffect(() => {
    if (breadcrumbs.length === 0) {
      initializebreadcrumbs();
    }
  }, [breadcrumbs.length, initializebreadcrumbs]);

  useEffect(() => {
    if (breadcrumbs.length > 0) {
      updateSpherePositions();
    }
  }, [breadcrumbs.length, updateSpherePositions]);

  return (
    <>
      {breadcrumbs.map((bc) => (
        <BreadcrumbItem
          key={bc.id}
          id={bc.id}
          position={bc.position}
          color={bc.color}
          scale={bc.scale}
        />
      ))}
    </>
  );
};
