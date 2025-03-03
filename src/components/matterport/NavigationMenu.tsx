"use client";

import { FC, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui";
import { MenuItem, useMenuItems } from "@/hooks/useMenuItems";
import { useMatterport } from "@/context/MatterportContext";
import { MenuButton } from "./MenuButton";
import { LocationsList } from "./LocationsList";

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu: FC<NavigationMenuProps> = ({ className = "" }) => {
  const { sdk, isConnected } = useMatterport();
  const { menuItems, isLoading, error } = useMenuItems();
  const [open, setOpen] = useState(false);

  const handleMenuItemClick = async (item: MenuItem) => {
    if (!sdk) {
      console.error("SDK not available");
      setOpen(false);
      return;
    }

    try {
      if (item.action === "teleport") {
        await sdk.Sweep.moveTo(item.sweepId, {
          rotation: item.cameraRotation,
          transition: sdk.Sweep.Transition.FADEOUT,
        });
      }
    } catch (error) {
      console.error(`Error ${item.action}ing to ${item.target}:`, error);
    }

    setOpen(false);
  };

  return (
    <div className={`absolute top-4 right-4 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <MenuButton />
        <PopoverContent
          align="end"
          className="w-56 p-0 bg-popover text-popover-foreground border-border"
          sideOffset={5}
        >
          <LocationsList
            menuItems={menuItems}
            isLoading={isLoading}
            error={error}
            isConnected={isConnected}
            onItemSelect={handleMenuItemClick}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
