"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, ExternalLink } from "lucide-react";
import type { ModelProvider } from "@/types/models";
import { ChatArea } from "@/components/chat-area";
import { RouteSel } from "@/lib/chatApi";
import { REMOVE_MODEL } from "@/reducer/constants";

interface ModelColumnsProps {
  providers: ModelProvider[];
  selectedModels: RouteSel[];
  // setSelectedModels: (models: RouteSel[]) => void;
  dispatch: React.Dispatch<any>;
  messages: Record<string, any>;
}

export function ModelColumns({
  providers,
  selectedModels,
  dispatch,
  messages,
}: ModelColumnsProps) {
  // Get model details for selected models
  const getModelDetails = (modelId: string) => {
    for (const provider of providers) {
      const model = provider.models.find((m) => m.id === modelId);
      if (model) return { model, provider };
    }
    return null;
  };

  const activeModels = selectedModels
    .map((routeSel) => getModelDetails(routeSel.model))
    .filter(
      (item): item is { model: any; provider: ModelProvider } => item !== null
    );

  const handleRemoveModel = (modelId: string) => {
    dispatch({ type: REMOVE_MODEL, payload: { modelId: modelId } });
    // setSelectedModels(selectedModels.filter((sel) => sel.model !== modelId));
  };

  const handleToggleModel = (modelId: string, enabled: boolean) => {
    // For now, just remove the model if disabled
    if (!enabled) {
      handleRemoveModel(modelId);
    }
  };

  const getColumnStyles = () => {
    const count = activeModels.length;
    if (count === 1) return { width: "100%", minWidth: "100%", flexShrink: 0 };
    if (count === 2) return { width: "50%", minWidth: "50%", flexShrink: 0 };
    // For 3+ models, always use 33.333% width with fixed minimum width for horizontal scrolling
    return { width: "33.333%", minWidth: "33.333%", flexShrink: 0 };
  };

  const getContainerClass = () => {
    const count = activeModels.length;
    if (count >= 4) {
      return "overflow-x-auto scrollbar-hide";
    }
    return "";
  };

  if (activeModels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Select AI models to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        className={`flex-1 flex ${getContainerClass()}`}
        style={{ minHeight: 0 }}
      >
        {activeModels.map(({ model, provider }, index) => (
          <div
            key={model.id}
            className="flex flex-col border-r border-border last:border-r-0"
            style={getColumnStyles()}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-foreground">{model.icon}</span>
                <span className="text-sm font-medium truncate text-foreground">
                  {model.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 opacity-60 hover:opacity-100 text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Switch
                  checked={true}
                  size="sm"
                  className="scale-75"
                  onCheckedChange={(checked) =>
                    handleToggleModel(model.id, checked)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
                  onClick={() => handleRemoveModel(model.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

            <div className="flex-1 min-h-0">
              <ChatArea activeModel={model.id} messages={messages} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
