import { FC, useEffect, useRef } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { Color, IDisposable, MpSdk, Vector3 } from "../../../public/bundle/sdk";
import { createBlueSphereComponent } from "./factory/createBlueSphere";

export type BreadcrumbItemProps = {
  id: string;
  position: Vector3;
  color?: Color;
  scale?: number;
  visible?: boolean;
};

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  id,
  position,
  color = { r: 0.2, g: 0.5, b: 1.0 },
  scale = 0.2,
  visible = true,
}) => {
  const { sdk } = useMatterport();
  const componentName = `custom.blueSphere-${id}`;
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

        nodeRef.current = sceneObjectRef.current.addNode();
        nodeRef.current.position.set(position.x, position.y, position.z);
        nodeRef.current.addComponent(componentName, { color, scale, visible });
        nodeRef.current.start();
        sceneObjectRef.current.start();
      } catch (error) {
        console.error("Error with BlueSphere:", error);
      }
    };

    setupBlueSphere();

    return () => {
      try {
        if (nodeRef.current) {
          nodeRef.current.stop();
          nodeRef.current = null;
        }

        if (sceneObjectRef.current) {
          sceneObjectRef.current.stop();
          sceneObjectRef.current = null;
        }

        if (disposableRef.current) {
          disposableRef.current.dispose();
          disposableRef.current = null;
        }
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    };
  }, [sdk, position, color, scale, visible, componentName]);

  return null;
};
