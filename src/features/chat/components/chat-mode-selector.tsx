import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { MessageSquare, Users, Scale } from "lucide-react";

export type ChatMode = "single" | "multi" | "consensus";

interface ChatModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  className?: string;
}

export function ChatModeSelector({
  mode,
  onModeChange,
  className,
}: ChatModeSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 p-1 rounded-full",
        className
      )}
    >
      {/* Single Chat - Blue Neon */}
      <Button
        variant="ghost"
        onClick={() => onModeChange("single")}
        className={cn(
          "relative transition-all duration-300 rounded-full px-6 py-2 border gap-2",
          mode === "single"
            ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] bg-cyan-950/30"
            : "border-transparent text-muted-foreground hover:text-cyan-400 hover:bg-cyan-950/10"
        )}
      >
        <MessageSquare className="w-4 h-4" />
        <span className="font-medium tracking-wide">Single Chat</span>
      </Button>

      {/* Multi Chat - Purple Neon */}
      <Button
        variant="ghost"
        onClick={() => onModeChange("multi")}
        className={cn(
          "relative transition-all duration-300 rounded-full px-6 py-2 border gap-2",
          mode === "multi"
            ? "border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] bg-purple-950/30"
            : "border-transparent text-muted-foreground hover:text-purple-400 hover:bg-purple-950/10"
        )}
      >
        <Users className="w-4 h-4" />
        <span className="font-medium tracking-wide">Multi Chat</span>
      </Button>

      {/* Consensus - Amber/Gold Neon */}
      <Button
        variant="ghost"
        onClick={() => onModeChange("consensus")}
        className={cn(
          "relative transition-all duration-300 rounded-full px-6 py-2 border gap-2",
          mode === "consensus"
            ? "border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-amber-950/30"
            : "border-transparent text-muted-foreground hover:text-amber-400 hover:bg-amber-950/10"
        )}
      >
        <Scale className="w-4 h-4" />
        <span className="font-medium tracking-wide">Consensus</span>
      </Button>
    </div>
  );
}
