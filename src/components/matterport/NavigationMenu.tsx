"use client";

import { FC, useState } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Loader2 } from "lucide-react";

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu: FC<NavigationMenuProps> = ({ className = "" }) => {
  const { menuItems, isLoading, error } = useMenuItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuItemClick = (item: (typeof menuItems)[0]) => {
    console.log(`Action: ${item.action}, Target: ${item.target}`);
    setIsOpen(false);
  };

  return (
    <div className={`absolute top-4 right-4 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-background border-border hover:bg-accent"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-popover text-popover-foreground border-border"
        >
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />

          {menuItems.length > 0 && (
            <>
              <div className="px-2 py-1.5">
                <div className="flex items-center px-2 py-1 border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring">
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
            </>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading menu...
              </span>
            </div>
          )}

          {error && (
            <div className="px-2 py-4 text-center text-sm text-destructive">
              Failed to load menu items
            </div>
          )}

          {!isLoading && !error && (
            <>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
