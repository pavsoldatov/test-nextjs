"use client";

import { FC } from "react";
import { Menu } from "lucide-react";
import { Button, PopoverTrigger } from "@/components/ui";

interface MenuButtonProps {
  className?: string;
}

export const MenuButton: FC<MenuButtonProps> = ({ className = "" }) => {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className={`h-10 w-10 rounded-full bg-background border-border hover:bg-accent ${className}`}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </Button>
    </PopoverTrigger>
  );
};
