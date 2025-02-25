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
  const { sdk, sceneObject } = useMatterport();
  const nodeRef = useRef<MpSdk.Scene.INode | null>(null);

  useEffect(() => {
    if (!sdk?.Scene || !sceneObject) return;

    const lightNode = sceneObject.addNode();
    nodeRef.current = lightNode;

    lightNode?.addComponent(sdk.Scene.Component.DIRECTIONAL_LIGHT, {
      enabled,
      color,
      position,
      target,
      intensity,
      debug,
    });
  }, [sdk, sceneObject, position, target, color, intensity, debug, enabled]);

  return null;
};
