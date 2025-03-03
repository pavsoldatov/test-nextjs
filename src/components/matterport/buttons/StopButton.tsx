import { Button } from "@/components/ui";
import { Square } from "lucide-react";
import { forwardRef } from "react";

interface StopButtonProps {
  className?: string;
  onClick?: () => void;
}

export const StopButton = forwardRef<HTMLButtonElement, StopButtonProps>(
  ({ className = "", onClick }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={`relative h-10 w-10 rounded-full bg-background ${className}`}
        onClick={onClick}
      >
        <Square className="h-4 w-4 fill-foreground" />
      </Button>
    );
  }
);

StopButton.displayName = "StopButton";
