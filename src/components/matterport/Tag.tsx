"use client";

import { FC, useEffect } from "react";
import { useMatterport } from "@/context/MatterportContext";
import { Color, Vector3 } from "../../../public/bundle/sdk";

type TagProps = {
  label: string;
  description?: string;
  anchorPosition: Vector3;
  stemVector: Vector3;
  color?: Color;
  stemVisible?: boolean;
};

export const Tag: FC<TagProps> = ({
  label,
  description = "",
  anchorPosition,
  stemVector,
  color = { r: 0, g: 0, b: 1 },
  stemVisible = true,
}) => {
  const { sdk } = useMatterport();

  useEffect(() => {
    if (!sdk?.Tag) return;

    const tagDescriptor = {
      anchorPosition,
      stemVector,
      label,
      description,
      color,
      stemVisible,
    };

    let tagId: string;

    const addTag = async () => {
      try {
        const [id] = await sdk.Tag.add(tagDescriptor);
        tagId = id;
        console.log("Tag added with ID:", id);
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    };

    addTag();

    return () => {
      if (tagId && sdk?.Tag) {
        sdk.Tag.remove(tagId).catch(console.error);
      }
    };
  }, [sdk, label, description, anchorPosition, stemVector, color, stemVisible]);

  return null;
};
