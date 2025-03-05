"use client";

import { FC, useEffect, useState, useRef } from "react";
import { Color, Vector3 } from "../../public/bundle/sdk";
import { BlueSphere } from "./matterport/BlueSphere";

type SphereData = {
  id: string;
  position: Vector3;
  color: Color;
  scale: number;
  visible: boolean;
};

interface DynamicBlueSpheresProps {
  basePosition: Vector3;
  count?: number;
  updateInterval?: number;
  color?: Color;
  scale?: number;
}

export const DynamicBlueSpheres: FC<DynamicBlueSpheresProps> = ({
  basePosition,
  count = 3,
  updateInterval = 2000,
  color = { r: 0.2, g: 0.5, b: 1.0 },
  scale = 0.2,
}) => {
  const [spheres, setSpheres] = useState<SphereData[]>([]);
  const initializedRef = useRef(false);
  //TODO create blue spheres out of navpath

  const propsRef = useRef({
    basePosition,
    count,
    updateInterval,
    color,
    scale,
  });

  useEffect(() => {
    propsRef.current = { basePosition, count, updateInterval, color, scale };
  }, [basePosition, count, updateInterval, color, scale]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log(`Initializing sphere pool with capacity: ${count}`);

    const initialSpheres: SphereData[] = [];
    for (let i = 0; i < count; i++) {
      initialSpheres.push({
        id: `fixed-sphere-${i}`,
        position: { ...basePosition },
        color: { ...color },
        scale,
        visible: true,
      });
    }

    setSpheres(initialSpheres);
  }, []);

  useEffect(() => {
    console.log("Setting up update interval");

    const updateSpheres = () => {
      const { basePosition, color, scale } = propsRef.current;

      setSpheres((prevSpheres) =>
        prevSpheres.map((sphere) => {
          const heightOffset = Math.random() * 1.5;
          return {
            ...sphere,
            position: {
              x: basePosition.x + (Math.random() - 0.5) * 0.5,
              y: basePosition.y + heightOffset,
              z: basePosition.z + (Math.random() - 0.5) * 0.5,
            },
            color: { ...color },
            scale,
            visible: true,
          };
        })
      );
    };

    updateSpheres();

    const intervalId = setInterval(updateSpheres, updateInterval);

    return () => {
      clearInterval(intervalId);
      console.log("Cleared update interval");
    };
  }, [updateInterval]);

  return (
    <>
      {spheres.map((sphere) => (
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
