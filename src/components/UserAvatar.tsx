import { initials } from "@/data/mock";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  colorHsl?: string; // e.g. "217 91% 60%"
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function UserAvatar({ name, colorHsl = "217 71% 35%", size = "md", className }: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: `hsl(${colorHsl})` }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
