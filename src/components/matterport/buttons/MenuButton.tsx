"use client";

import { forwardRef } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui";

interface MenuButtonProps {
  className?: string;
  onClick?: () => void;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ className = "", onClick }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={`h-10 w-10 rounded-full bg-background border-border hover:bg-accent ${className}`}
        onClick={onClick}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </Button>
    );
  }
);

MenuButton.displayName = "MenuButton";
