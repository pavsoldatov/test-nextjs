"use client";

import { FC, useEffect, useRef, useCallback, memo } from "react";
import { MpSdk, ShowcaseBundleWindow } from "../../../public/sdk/sdk";

interface MatterportViewProps {
  sdkKey: string;
  modelId: string;
}

const MatterportView: FC<MatterportViewProps> = memo(({ sdkKey, modelId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const showcaseRef = useRef<MpSdk | null>(null);
  const subscriptionRef = useRef<MpSdk.ISubscription | null>(null);

  const handleCameraUpdate = useCallback((pose: MpSdk.Camera.Pose) => {
    console.log("Camera Position:", pose.position);
    console.log("Camera Rotation:", pose.rotation);
  }, []);

  const handleSDKConnect = useCallback(
    (sdk: MpSdk) => {
      console.log("SDK Connected!");
      showcaseRef.current = sdk;
      // Store the subscription reference for cleanup
      subscriptionRef.current = sdk.Camera.pose.subscribe(handleCameraUpdate);
    },
    [handleCameraUpdate]
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
    iframe.src = `/sdk/showcase.html?m=${modelId}&applicationKey=${sdkKey}&play=1`;

    return () => {
      iframe.removeEventListener("load", handleLoad);

      // SDK subscription ref seems to be an empty object
      // and doesn't seem to need cancellation, but will leave it here in case 
      // it still contains a reference to some map of observers
      if (subscriptionRef.current) {
        subscriptionRef.current.cancel();
        subscriptionRef.current = null;
      }
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
