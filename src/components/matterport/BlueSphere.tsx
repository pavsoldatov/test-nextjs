import { FC, useEffect, useRef } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { Color, IDisposable, MpSdk, Vector3 } from "../../../public/bundle/sdk";
import { createBlueSphereComponent } from "./factory/createBlueSphere";

type BlueSphereProps = {
  position: Vector3;
  color?: Color;
  scale?: number;
  visible?: boolean;
};

export const BlueSphere: FC<BlueSphereProps> = ({
  position,
  color = { r: 0.2, g: 0.5, b: 1.0 },
  scale = 0.2,
  visible = true,
}) => {
  const { sdk } = useMatterport();
  const componentName = "custom.blueSphere";
  const nodeRef = useRef<MpSdk.Scene.INode | null>(null);
  const disposableRef = useRef<IDisposable | null>(null);
  const sceneObjectRef = useRef<MpSdk.Scene.IObject | null>(null);

  useEffect(() => {
    if (!sdk?.Scene) return;

    const setupBlueSphere = async () => {
      try {
        disposableRef.current = await sdk.Scene.register(
          componentName,
          createBlueSphereComponent
        );

        const [sceneObject] = await sdk.Scene.createObjects(1);
        sceneObjectRef.current = sceneObject;

        const node = sceneObject.addNode();
        nodeRef.current = node;

        node.position.set(position.x, position.y, position.z);

        node.addComponent(componentName, { color, scale, visible });

        node.start();
        sceneObject.start();
      } catch (error) {
        console.error("Error with BlueSphere:", error);
      }
    };

    setupBlueSphere();

    return () => {
      try {
        nodeRef.current?.stop();
        nodeRef.current = null;

        sceneObjectRef.current?.stop();
        sceneObjectRef.current = null;

        disposableRef?.current?.dispose();
        disposableRef.current = null;
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    };
  }, [sdk, position, color, scale, visible]);

  return null;
};
