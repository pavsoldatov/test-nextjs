"use client";

import { FC, useEffect, useState, useRef } from "react";
import { Vector3 } from "../../public/bundle/sdk";
import { BlueSphere } from "./matterport/BlueSphere";

type SphereData = {
  id: string;
  position: Vector3;
  color: { r: number; g: number; b: number };
  scale: number;
  visible: boolean;
};

interface DynamicBlueSpheresProps {
  basePosition: Vector3;
  count?: number;
  updateInterval?: number;
}

export const DynamicBlueSpheres: FC<DynamicBlueSpheresProps> = ({
  basePosition,
  count = 3,
  updateInterval = 2000,
}) => {
  const [spherePool, setSpherePool] = useState<SphereData[]>([]);
  const isInitializedRef = useRef(false);

  // Initialize sphere pool once
  useEffect(() => {
    if (isInitializedRef.current) return;

    console.log(`Initializing sphere pool with capacity: ${count}`);

    const pool: SphereData[] = [];
    for (let i = 0; i < count; i++) {
      pool.push({
        id: `fixed-sphere-${i}`,
        position: { ...basePosition },
        color: { r: 0.2, g: 0.5, b: 1.0 },
        scale: 0.2,
        visible: true,
      });
    }

    setSpherePool(pool);
    isInitializedRef.current = true;

    return () => {
      console.log("DynamicBlueSpheres unmounted - clearing sphere pool");
      isInitializedRef.current = false;
    };
  }, [count, basePosition]);

  // Update sphere positions and properties on interval
  useEffect(() => {
    if (spherePool.length === 0) return;

    console.log("Starting sphere update interval");

    // Initial update
    updateSpheres();

    // Set interval for updates
    const intervalId = setInterval(updateSpheres, updateInterval);

    function updateSpheres() {
      console.log("Updating sphere positions and visibility");

      setSpherePool((prevPool) => {
        return prevPool.map((sphere) => {
          // Generate new random properties
          const heightOffset = Math.random() * 1.5;
          return {
            ...sphere,
            position: {
              x: basePosition.x + (Math.random() - 0.5) * 0.5,
              y: basePosition.y + heightOffset,
              z: basePosition.z,
            },
            color: { r: 0.2, g: 0.5, b: 1.0 },
            scale: 0.3,
            visible: true,
          };
        });
      });
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [spherePool.length, basePosition, count, updateInterval]);

  return (
    <>
      {spherePool.map((sphere) => (
        <BlueSphere
          key={sphere.id}
          position={sphere.position}
          color={sphere.color}
          scale={sphere.scale}
          visible={sphere.visible}
        />
      ))}
    </>
  );
};
