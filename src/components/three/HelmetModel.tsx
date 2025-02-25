"use client";

import { useEffect } from "react";
import { useAssets } from "@/context/AssetsContext";
import { useThreeScene } from "@/context/ThreeContext";

export default function HelmetModel() {
  const scene = useThreeScene();
  const { assets } = useAssets();
  const helmetModel = assets.get("helmet");

  useEffect(() => {
    if (!helmetModel) return;

    scene.add(helmetModel.scene);

    helmetModel.scene.position.set(
      62.57204055786133,
      1.6807150840759277,
      -15.610681533813477
    );

    let frameId: number;
    const animateHelmet = () => {
      helmetModel.scene.rotation.y += 0.005;
      frameId = requestAnimationFrame(animateHelmet);
    };
    animateHelmet();

    return () => {
      cancelAnimationFrame(frameId);
      scene.remove(helmetModel.scene);
    };
  }, [helmetModel, scene]);

  return null;
}
