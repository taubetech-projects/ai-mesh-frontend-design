import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "info" | "destructive" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "badge-success",
  warning: "badge-warning",
  info: "badge-info",
  destructive: "badge-destructive",
  default: "bg-secondary text-foreground px-2.5 py-0.5 rounded-full text-xs font-medium",
};

export function StatusBadge({
  status,
  variant = "default",
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(variantStyles[variant], className)}>
      {status}
    </span>
  );
}
