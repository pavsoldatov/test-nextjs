"use client";

import { FC, useEffect, useRef } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { Color, MpSdk, Vector3 } from "../../../../public/bundle/sdk";

type PointLightProps = {
  position: Vector3;
  color?: Color;
  intensity?: number;
  distance?: number;
  decay?: number;
  debug?: boolean;
  enabled?: boolean;
};

export const PointLight: FC<PointLightProps> = ({
  position,
  color = { r: 1.0, g: 1.0, b: 1.0 },
  intensity = 2,
  distance = 0, // (0 = infinite distance)
  decay = 1, // (1 = linear falloff by default)
  debug = false,
  enabled = true,
}) => {
  const { sdk } = useMatterport();
  const nodeRef = useRef<MpSdk.Scene.INode | null>(null);
  const sceneObjectRef = useRef<MpSdk.Scene.IObject | null>(null);

  useEffect(() => {
    if (!sdk?.Scene) return;

    const setupPointLight = async () => {
      try {
        const [sceneObject] = await sdk.Scene.createObjects(1);
        sceneObjectRef.current = sceneObject;

        const lightNode = sceneObject.addNode();
        nodeRef.current = lightNode;

        lightNode.addComponent(sdk.Scene.Component.POINT_LIGHT, {
          enabled,
          color,
          position,
          intensity,
          distance,
          decay,
          debug,
        });

        lightNode.start();
        sceneObject.start();
      } catch (error) {
        console.error("Error setting up point light:", error);
      }
    };

    setupPointLight();

    return () => {
      try {
        nodeRef.current?.stop();
        nodeRef.current = null;

        sceneObjectRef.current?.stop();
        sceneObjectRef.current = null;
      } catch (e) {
        console.error("Error during point light cleanup:", e);
      }
    };
  }, [sdk, position, color, intensity, distance, decay, debug, enabled]);

  return null;
};
