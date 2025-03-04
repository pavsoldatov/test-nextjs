"use client";

import { FC, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { MenuItem, useMenuItems } from "@/hooks/useMenuItems";
import { useMatterport } from "@/context/MatterportContext";
import { MenuButton } from "./buttons/MenuButton";
import { LocationsList } from "./LocationsList";
import { useSweepNavigation } from "@/hooks/useSweepNavigation";
import { StopButton } from "./buttons/StopButton";

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu: FC<NavigationMenuProps> = ({ className = "" }) => {
  const { sdk, isConnected } = useMatterport();
  const { menuItems, isLoading, error } = useMenuItems();
  const { navigating, currentPath, navigateToSweep, stopNavigation } =
    useSweepNavigation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("path", currentPath);
  }, [currentPath]);

  const handleMenuItemClick = async (item: MenuItem) => {
    setOpen(false);

    if (!sdk) {
      console.error("SDK not available");
      return;
    }

    try {
      if (item.action === "teleport") {
        await sdk.Sweep.moveTo(item.sweepId, {
          rotation: item.cameraRotation,
          transition: sdk.Sweep.Transition.FADEOUT,
        });
      }
      if (item.action === "navigate") {
        await navigateToSweep(item.sweepId, {
          transitionType: sdk.Sweep.Transition.FLY,
          transitionTime: 1000,
          stepDelay: 800,
          rotationOffset: 172.48,
          pathWeightExponent: 3,
          finalRotation: item.cameraRotation,
        });
      }
    } catch (error) {
      console.error(
        `Error: action "${item.action}" at target ${item.target}. Message: `,
        error
      );
    }
  };

  const handleStopNavigation = () => {
    stopNavigation();
    setOpen(false);
  };

  return (
    <div className={`absolute top-4 right-4 ${className}`}>
      {navigating ? (
        <StopButton onClick={handleStopNavigation} />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <MenuButton />
          </PopoverTrigger>
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
      )}
    </div>
  );
};
