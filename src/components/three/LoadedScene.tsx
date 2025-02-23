"use client";

import dynamic from "next/dynamic";
import { useAssets } from "@/context/AssetsContext";
import ProgressLoader from "./ProgressLoader";
import HelmetModel from "./HelmetModel";

const SceneView = dynamic(() => import("./SceneView"), {
  ssr: false,
});

export function LoadedScene() {
  const { isLoading, progress } = useAssets();

  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLoading ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <ProgressLoader progress={progress} />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isLoading ? "opacity-0 invisible" : "opacity-100 visible"
        }`}
      >
        <SceneView>
          <HelmetModel />
        </SceneView>
      </div>
    </div>
  );
}
