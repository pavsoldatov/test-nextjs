"use client";

import { FC, useEffect, useRef } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { MpSdk, Vector3 } from "../../../../public/bundle/sdk";

type HelmetProps = {
  url?: string;
  position: Vector3;
  lookAt?: Vector3;
  scale?: number | Vector3;
  visible?: boolean;
};

const DEFAULT_HELMET_URL =
  "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf";

export const Helmet: FC<HelmetProps> = ({
  url = DEFAULT_HELMET_URL,
  position,
  lookAt,
  scale = 0.5,
  visible = true,
}) => {
  const { sdk, sceneObject } = useMatterport();
  const nodeRef = useRef<MpSdk.Scene.INode | null>(null);

  useEffect(() => {
    if (!sdk?.Scene || !sceneObject) return;

    const helmetNode = sceneObject.addNode();
    nodeRef.current = helmetNode;

    helmetNode?.addComponent(sdk.Scene.Component.GLTF_LOADER, {
      url,
      visible,
    });

    // @ts-expect-error: ignoring `obj3D` type warnings,
    // because it DOES exist on the node but the [MpSdk.Scene.INode]
    // type declarations do not reflect that
    helmetNode?.obj3D.position.set(position.x, position.y, position.z);

    // Set scale
    if (typeof scale === "number") {
      // @ts-expect-error: ignoring `obj3D` type warnings
      helmetNode?.obj3D.scale.set(scale, scale, scale);
    } else {
      // @ts-expect-error: ignoring `obj3D` type warnings
      helmetNode?.obj3D.scale.set(scale.x, scale.y, scale.z);
    }

    if (lookAt) {
      // @ts-expect-error: ignoring `obj3D` type warnings
      helmetNode?.obj3D.lookAt(lookAt.x, lookAt.y, lookAt.z);
    }
  }, [sdk, sceneObject, url, position, lookAt, scale, visible]);

  return null;
};
