import { LucideIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: ActionCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "card-interactive p-5 block group animate-fade-in",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-2.5 rounded-lg bg-secondary w-fit mb-4">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex justify-end mt-4">
          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
