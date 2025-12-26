import { Button } from "@/shared/components/ui/button";
import { Image as ImageIcon, Globe } from "lucide-react";

interface ChatActionChipsProps {
  isImageGenSelected: boolean;
  onToggleImageGen: () => void;
  isWebSearchSelected: boolean;
  onToggleWebSearch: () => void;
  className?: string;
  disableWebSearch?: boolean;
}

export function ChatActionChips({
  isImageGenSelected,
  onToggleImageGen,
  isWebSearchSelected,
  onToggleWebSearch,
  className = "",
  disableWebSearch = false,
}: ChatActionChipsProps) {
  return (
    <div className={`flex items-center gap-2 px-1 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleImageGen}
        className={`rounded-full gap-2 h-8 transition-colors ${
          isImageGenSelected
            ? "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20"
            : "bg-background/50 text-muted-foreground hover:text-foreground border-border/50"
        }`}
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-xs font-medium">Generate image</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleWebSearch}
        className={`rounded-full gap-2 h-8 transition-colors ${
          isWebSearchSelected
            ? "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20"
            : "bg-background/50 text-muted-foreground hover:text-foreground border-border/50"
        }`}
        title="Enables real-time internet access"
        disabled={disableWebSearch}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium">Web Search</span>
      </Button>
    </div>
  );
}