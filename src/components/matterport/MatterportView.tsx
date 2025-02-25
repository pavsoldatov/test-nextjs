"use client";

import { FC, useEffect, useRef, useCallback, memo } from "react";
import { MpSdk, ShowcaseBundleWindow } from "../../../public/sdk/sdk";

interface MatterportViewProps {
  sdkKey: string;
  modelId: string;
}

const HELMET_MODEL_URL =
  "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";

const MatterportView: FC<MatterportViewProps> = memo(({ sdkKey, modelId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const showcaseRef = useRef<MpSdk | null>(null);

  const addHelmetModel = useCallback(async (sdk: MpSdk) => {
    try {
      if (!sdk.Scene) {
        console.error("Scene API not available - Bundle SDK required");
        return;
      }

      const [sceneObject] = await sdk.Scene.createObjects(1);
      const lightsNode = sceneObject.addNode();

      lightsNode.addComponent(sdk.Scene.Component.DIRECTIONAL_LIGHT, {
        enabled: true,
        color: { r: 1.0, g: 1.0, b: 1.0 },
        position: {
          x: 59.69252395629883,
          y: 1.6820850372314453,
          z: -19.353961944580078,
        },
        target: { x: 62.572, y: 1.6, z: -15.61 },
        intensity: 2,
        debug: false,
      });

      const helmetNode = sceneObject.addNode();

      const helmetComponent = helmetNode.addComponent(
        sdk.Scene.Component.GLTF_LOADER,
        {
          url: HELMET_MODEL_URL,
          visible: true,
        }
      );

      // @ts-expect-error: ignoring `obj3D` type warnings,
      // because it DOES exist on the node but the SDK type declarations do not reflect that
      helmetNode.obj3D.scale.set(0.5, 0.5, 0.5);
      // @ts-expect-error: ignoring `obj3D` type warnings,
      // because it DOES exist on the node but the SDK type declarations do not reflect that
      helmetNode.obj3D.position.set(62.572, 1.6, -15.61);
      // @ts-expect-error: ignoring `obj3D` type warnings,
      // because it DOES exist on the node but the SDK type declarations do not reflect that
      helmetNode.obj3D.lookAt(57.8995, 1.6599, -13.6902);

      console.log("node", helmetNode);
      console.log("component", helmetComponent);

      lightsNode.start();
      helmetNode.start();
    } catch (error) {
      console.error("Error adding helmet model:", error);
    }
  }, []);

  const handleSDKConnect = useCallback(
    (sdk: MpSdk) => {
      console.log("SDK Connected!");
      showcaseRef.current = sdk;

      sdk.Sweep.current.subscribe((sweep) => {
        if (sweep.id) {
          console.log("Moved to sweep:", {
            id: sweep.id,
            position: sweep.position,
            floorInfo: sweep.floorInfo,
          });
        }
      });

      // React to sweep change as soon as a new sweep is clicked on
      sdk.on(sdk.Sweep.Event.EXIT, (oldSweepId, newSweepId) => {
        console.log("Moving from sweep:", oldSweepId, "to sweep:", newSweepId);
      });

      addHelmetModel(sdk);
    },
    [addHelmetModel]
  );

  const handleLoad = useCallback(() => {
    console.log("Iframe loaded");
    const iframe = iframeRef.current;
    if (!iframe) return;

    const embeddingWindow = iframe.contentWindow as ShowcaseBundleWindow;
    console.log("Embedding window:", embeddingWindow);

    if (embeddingWindow.MP_SDK) {
      embeddingWindow.MP_SDK.connect(embeddingWindow)
        .then(handleSDKConnect)
        .catch((error) => console.error("SDK Connection error:", error));
    } else {
      console.error("MP_SDK is not available on the iframe's contentWindow");
    }
  }, [handleSDKConnect]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.addEventListener("load", handleLoad);

    // Ensure the event listener is attached before setting src
    // so as not to miss the load event (otherswise can cause a race condition).
    iframe.src = `/sdk/showcase.html?m=${modelId}&applicationKey=${sdkKey}&play=1`;

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [sdkKey, modelId, handleLoad]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      allow="xr-spatial-tracking"
      allowFullScreen
    />
  );
});

MatterportView.displayName = "MatterportView";

export default MatterportView;
