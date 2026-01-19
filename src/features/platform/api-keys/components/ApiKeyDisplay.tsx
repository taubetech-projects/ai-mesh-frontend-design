"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/hooks/use-toast";
import { cn } from "@/features/platform/lib/utils";

interface ApiKeyDisplayProps {
  apiKey: string;
  label?: string;
  className?: string;
  showWarning?: boolean;
}

export function ApiKeyDisplay({
  apiKey,
  label = "Your API Key",
  className,
  showWarning = true,
}: ApiKeyDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);

      toast({
        title: "Copied",
        description: "API key copied to clipboard!",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy API key",
        variant: "destructive",
      });
    }
  }, [apiKey]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>

      <div className="flex items-center gap-2">
        <code className="flex-1 break-all rounded-md bg-muted p-3 font-mono text-sm">
          {apiKey}
        </code>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCopy}
          aria-label="Copy API key"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showWarning && (
        <p className="text-xs text-muted-foreground">
          ⚠️ Make sure to copy your API key now. You won&apos;t be able to see it
          again!
        </p>
      )}
    </div>
  );
}
