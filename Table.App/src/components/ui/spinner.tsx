import { cn } from "@/lib/utils"; // assuming you use ShadCN's cn utility

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-transparent",
        sizeMap[size],
        className
      )}
      role="status"
    />
  );
}
