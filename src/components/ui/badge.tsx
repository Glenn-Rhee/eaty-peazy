import { cn } from "@/lib/utils";

type BadgeVariant =
  | "brand"
  | "warning"
  | "info"
  | "default"
  | "error"
  | "helper";

const variants: Record<BadgeVariant, string> = {
  brand: "bg-brand-200 text-white",
  warning: "bg-badge-orange text-white",
  info: "bg-badge-blue text-white",
  default: "bg-badge-gray text-white",
  error: "bg-badge-red text-white",
  helper: "bg-badge-purple text-white",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-1.5 text-xs",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
