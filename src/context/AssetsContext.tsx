"use client";
import { createContext, useContext, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const ASSETS = {
  helmet:
    "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
  fox: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf",
  duck: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
  box: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf",
} as const;

type AssetName = keyof typeof ASSETS;
type AssetMap = Map<AssetName, GLTF>;

interface AssetsContextType {
  assets: AssetMap;
  progress: number;
  isLoading: boolean;
}

const AssetsContext = createContext<AssetsContextType | null>(null);

export function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<AssetMap>(new Map<AssetName, GLTF>());
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const manager = new THREE.LoadingManager(
      // all assets loaded
      () => setIsLoading(false),
      // update progress only if higher than before
      (url, itemsLoaded, itemsTotal) => {
        const computedProgress = (itemsLoaded / itemsTotal) * 100;
        setProgress((prev) => Math.max(prev, Math.round(computedProgress)));
      },
      (url) => console.error("Error loading asset: " + url)
    );

    const loader = new GLTFLoader(manager);

    (Object.entries(ASSETS) as [AssetName, string][]).forEach(([key, url]) => {
      loader.load(url, (gltf: GLTF) => {
        setAssets((prev) => new Map(prev).set(key, gltf));
      });
    });
  }, []);

  return (
    <AssetsContext.Provider value={{ assets, progress, isLoading }}>
      {children}
    </AssetsContext.Provider>
  );
}

export function useAssets() {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetsProvider");
  }
  return context;
}
