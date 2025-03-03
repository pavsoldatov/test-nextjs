"use client";

import { FC, ReactNode, useRef } from "react";
import { MatterportProvider } from "@/context/MatterportContext";
import { Helmet } from "./models/Helmet";
import { DirectionalLight, PointLight } from "./lights";
import { SceneStarter } from "./SceneStarter";
import { OfficeTag } from "./tags/OfficeTag";
import { NavigationMenu } from "./NavigationMenu";

interface MatterportViewProps {
  sdkKey: string;
  modelId: string;
  children?: ReactNode;
}

const MatterportView: FC<MatterportViewProps> = ({ sdkKey, modelId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <>
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        allow="xr-spatial-tracking"
        allowFullScreen
        src={`/bundle/showcase.html?m=${modelId}&applicationKey=${sdkKey}&play=1`}
      />

      <MatterportProvider iframeRef={iframeRef}>
        <NavigationMenu />
        <DirectionalLight
          position={{ x: 59.69252, y: 1.682085, z: -19.35396 }}
          target={{ x: 62.572, y: 1.6, z: -15.61 }}
          intensity={2}
        />
        <PointLight
          position={{ x: 64.17074, y: 1.690114, z: -11.91831 }}
          intensity={3}
          color={{ r: 1.0, g: 0.9, b: 0.8 }}
          distance={10}
        />
        <Helmet
          position={{ x: 62.572, y: 1.6, z: -15.61 }}
          lookAt={{ x: 57.89955, y: 1.65994, z: -13.69026 }}
          scale={0.5}
        />
        <OfficeTag
          label="Office"
          description="This is an important tag representing an office room."
          anchorPosition={{ x: 58.9179, y: 0, z: -16.05324 }}
          stemVector={{ x: 0, y: 1.5, z: 0 }}
          color={{ r: 1, g: 0, b: 0 }}
        />

        {/* needs to be called AFTER all the models */}
        <SceneStarter />
      </MatterportProvider>
    </>
  );
};

export default MatterportView;
