"use client";

import { FC, useEffect, useRef } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { MpSdk, Vector3, Color } from "../../../../public/bundle/sdk";

type DirectionalLightProps = {
  position: Vector3;
  target: Vector3;
  color?: Color;
  intensity?: number;
  debug?: boolean;
  enabled?: boolean;
};

export const DirectionalLight: FC<DirectionalLightProps> = ({
  position,
  target,
  color = { r: 1.0, g: 1.0, b: 1.0 },
  intensity = 2,
  debug = false,
  enabled = true,
}) => {
  const { sdk } = useMatterport();
  const nodeRef = useRef<MpSdk.Scene.INode | null>(null);
  const sceneObjectRef = useRef<MpSdk.Scene.IObject | null>(null);

  useEffect(() => {
    if (!sdk?.Scene) return;

    const setupDirectionalLight = async () => {
      try {
        const [sceneObject] = await sdk.Scene.createObjects(1);
        sceneObjectRef.current = sceneObject;

        const lightNode = sceneObject.addNode();
        nodeRef.current = lightNode;

        lightNode.addComponent(sdk.Scene.Component.DIRECTIONAL_LIGHT, {
          enabled,
          color,
          position,
          target,
          intensity,
          debug,
        });

        lightNode.start();
        sceneObject.start();

        console.log(
          "DirectionalLight created successfully from",
          position,
          "pointing to",
          target
        );
      } catch (error) {
        console.error("Error setting up directional light:", error);
      }
    };

    setupDirectionalLight();

    return () => {
      try {
        nodeRef.current?.stop();
        nodeRef.current = null;

        sceneObjectRef.current?.stop();
        sceneObjectRef.current = null;
      } catch (e) {
        console.error("Error during directional light cleanup:", e);
      }
    };
  }, [sdk, position, target, color, intensity, debug, enabled]);

  return null;
};
