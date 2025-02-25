"use client";

import { useMatterport } from "@/context/MatterportContext";
import { useEffect } from "react";

export const SceneStarter = () => {
  const { isConnected, sceneObject } = useMatterport();

  useEffect(() => {
    if (isConnected && sceneObject) {
      sceneObject.start();
      return () => sceneObject.stop();
    }
  }, [isConnected, sceneObject]);

  if (!isConnected) return null;
};
