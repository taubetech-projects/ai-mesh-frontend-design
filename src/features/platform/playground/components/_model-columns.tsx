"use client";

import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { X, ExternalLink } from "lucide-react";
import type { ModelProvider, RouteSel } from "@/features/chat/types/models";
import { ChatArea } from "./_chat-area";
import { useDispatch, useSelector } from "react-redux";
import { removeModel } from "@/features/platform/playground/store/playground-interface-slice";

interface ModelColumnsProps {
  // setSelectedModels: (models: RouteSel[]) => void;
}

export function ModelColumns({ outputFormat }: { outputFormat: string }) {
  const { selectedModels, providers } = useSelector(
    (store: any) => store.playgroundInterface
  );

  const dispatch = useDispatch();
  // Get model details for selected models
  const getModelDetails = (modelId: string) => {
    for (const provider of providers) {
      const model = provider.models.find(
        (m: ModelProvider) => m.id === modelId
      );
      if (model) return { model, provider };
    }
    return null;
  };

  const activeModels = selectedModels
    .map((routeSel: RouteSel) => getModelDetails(routeSel.model))
    .filter(
      (item: any): item is { model: any; provider: ModelProvider } =>
        item !== null
    );

  const handleRemoveModel = (modelId: string) => {
    dispatch(removeModel(modelId));
  };

  const handleToggleModel = (modelId: string, enabled: boolean) => {
    // For now, just remove the model if disabled
    if (!enabled) {
      handleRemoveModel(modelId);
    }
  };

  // Replace your getColumnStyles with this:
  const getColumnStyles = () => {
    const count = activeModels.length;
    const pct = count === 1 ? "80%" : "50%"; // your rule in percentages
    return {
      flex: `0 0 ${pct}`, // no grow, no shrink, fixed basis in %
      width: pct,
      maxWidth: pct, // never exceed the % width
      minWidth: 0, // allow column to be narrower than its content
    } as const;
  };

  const getContainerClass = () => {
    const count = activeModels.length;
    if (count >= 3) {
      return "overflow-x-auto gpt-scrollbar";
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
        // was: className={`flex-1 flex ${getContainerClass()}`} ...
        className={`flex-1 grid overflow-x-auto ${getContainerClass()}`}
        style={{
          minHeight: 0,
          gridAutoFlow: "column",
          gridAutoColumns: activeModels.length === 1 ? "80%" : "50%", // fixed %
        }}
      >
        {activeModels.map(
          ({ model, provider }: { model: any; provider: ModelProvider }) => (
            <div
              key={model.id}
              // fixed-size flex item + allow shrinking + clip overflow at column level
              className="flex flex-col flex-none min-w-0 overflow-hidden border-r border-border last:border-r-0"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  {/*<span className="text-sm text-foreground">{model.icon}</span> */}
                  <img
                    src={model.icon}
                    alt={`${provider.name} icon`}
                    className="w-5 h-5"
                  />
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

              {/* content: scroll inside the column horizontally & vertically */}
              <div
                id="div123"
                className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-auto"
              >
                <ChatArea activeModel={model.id} outputFormat={outputFormat} />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
