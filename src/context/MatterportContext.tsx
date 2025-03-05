"use client";

import {
  createContext,
  FC,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import { MpSdk, ShowcaseBundleWindow } from "../../public/bundle/sdk";

type MatterportContextType = {
  sdk: MpSdk | null;
  isConnected: boolean;
};

const MatterportContext = createContext<MatterportContextType>({
  sdk: null,
  isConnected: false,
});

export const useMatterport = () => useContext(MatterportContext);

export const MatterportProvider: FC<{
  children: ReactNode;
  iframeRef: RefObject<HTMLIFrameElement>;
}> = ({ children, iframeRef }) => {
  const [sdk, setSdk] = useState<MpSdk | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sdk && iframeRef.current) {
      const embeddingWindow = iframeRef.current
        .contentWindow as ShowcaseBundleWindow;

      if (!embeddingWindow?.MP_SDK) return;

      embeddingWindow.MP_SDK.connect(embeddingWindow)
        .then(async (connectedSdk) => {
          console.log("SDK Connected!");
          setSdk(connectedSdk);

          connectedSdk.Sweep.current.subscribe((sweep) => {
            if (sweep.id) {
              console.log("Moved to sweep:", {
                id: sweep.id,
                position: sweep.position,
                floorInfo: sweep.floorInfo,
              });
            }
          });

          connectedSdk.on(
            connectedSdk.Sweep.Event.EXIT,
            (oldSweepId, newSweepId) => {
              //TODO Maybe loop over an array of sweep ids to find the position immediately on click
              console.log(
                "Moving from sweep:",
                oldSweepId,
                "to sweep:",
                newSweepId
              );
            }
          );

          setIsConnected(true);
        })
        .catch((error) => console.error("SDK Connection error:", error));
    }
  }, [iframeRef, sdk]);

  return (
    <MatterportContext.Provider value={{ sdk, isConnected }}>
      {children}
    </MatterportContext.Provider>
  );
};
