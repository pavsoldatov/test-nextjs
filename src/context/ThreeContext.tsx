"use client";

import { createContext, useContext } from "react";
import { Scene } from "three";

const ThreeContext = createContext<Scene | null>(null);

export function useThreeScene() {
  const scene = useContext(ThreeContext);
  if (!scene) {
    throw new Error("useThreeScene must be used within SceneView");
  }
  return scene;
}

export default ThreeContext;
