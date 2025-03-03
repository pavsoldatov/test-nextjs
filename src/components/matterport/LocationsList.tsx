"use client";

import { FC } from "react";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui";
import { MenuItem } from "@/hooks/useMenuItems";

interface LocationsListProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  onItemSelect: (item: MenuItem) => void;
}

export const LocationsList: FC<LocationsListProps> = ({
  menuItems,
  isLoading,
  error,
  isConnected,
  onItemSelect,
}) => {
  return (
    <Command className="rounded-lg overflow-hidden">
      <CommandInput
        placeholder="Search locations..."
        className="h-4 py-5 text-base"
      />
      <CommandList>
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading menu...</span>
          </div>
        )}

        {error && (
          <div className="px-2 py-4 text-center text-sm text-destructive">
            Failed to load menu items
          </div>
        )}

        {!isLoading && !error && (
          <>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Navigation">
              {menuItems.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => onItemSelect(item)}
                  disabled={!isConnected}
                  className="cursor-pointer"
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
};
