"use client";

import ThreeContext from "@/context/ThreeContext";
import { useEffect, useRef, useState } from "react";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

export default function SceneView({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Create scene, camera, and renderer as in your original code.
    const scene = new Scene();
    setScene(scene);

    const camera = new PerspectiveCamera(75, 16 / 9, 0.1, 100);
    camera.position.z = 3;
    camera.position.y = 0.5;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.borderRadius = "12px";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // Lighting setup
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new AmbientLight(0x404040));

    // Resizing logic
    const resizeCanvasToDisplaySize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const domElWidth = renderer.domElement.width;
      const domElHeight = renderer.domElement.height;
      if (domElWidth !== width || domElHeight !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      resizeCanvasToDisplaySize();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {scene && (
        <ThreeContext.Provider value={scene}>{children}</ThreeContext.Provider>
      )}
    </div>
  );
}
