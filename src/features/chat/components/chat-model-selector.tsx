"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ModelProvider, RouteSel } from "@/features/chat/types/models";
import { useLanguage } from "@/shared/contexts/language-context";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addModel,
  removeModel,
  toggleModelSelector,
  setSelectedModels,
} from "@/features/chat/store/chat-interface-slice";
import { cn } from "@/lib/utils/utils";

interface ModelSelectorProps {
  isSingleMode?: boolean;
}

export function ModelSelector({ isSingleMode = false }: ModelSelectorProps) {
  const { providers, selectedModels } = useSelector(
    (store: any) => store.chatInterface
  );
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const handleModelToggle = (modelId: string, checked: boolean) => {
    if (checked) {
      const provider = getProviderByModelId(modelId);
      if (provider) {
        if (isSingleMode) {
          // In single mode, replace the selection
          dispatch(
            setSelectedModels([{ provider: provider.id, model: modelId }])
          );
        } else {
          dispatch(addModel(provider, modelId));
        }
      }
    } else {
      // In single mode, prevent deselecting the last model if it's the only one?
      // Or just allow empty. Use case: "always can chat with one model only".
      // Usually radio behavior doesn't allow deselecting.
      if (isSingleMode && selectedModels.length === 1) {
          return; // Prevent deselecting the only model in single mode to avoid empty state
      }
      dispatch(removeModel(modelId));
    }
  };

  // Function to find provider from a model id
  function getProviderByModelId(modelId: string): ModelProvider | undefined {
    for (const provider of providers) {
      if (
        provider.models.some((model: ModelProvider) => model.id === modelId)
      ) {
        return provider;
      }
    }
    return undefined; // if not found
  }

  const getProviderIcon = (providerId: string) => {
    const icons: Record<string, string> = {
      // openai: "🤖",
      openai: "/icons/openai-64x64.png",
      anthropic: "/icons/anthropic-64x64.png",
      google: "/icons/gemini-64x64.png",
      deepseek: "/icons/deepseek-64x64.png",
      grok: "/icons/grok-64x64.png",
      perplexity: "/icons/perplexity-64x64.png",
      ollama: "/icons/ollama-64x64.png",
    };
    return icons[providerId] || "🤖";
  };

  return (
    <Card className="p-3 bg-background/95 backdrop-blur-sm border shadow-xl relative max-w-2xl mx-auto max-h-[300px] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-1 flex-shrink-0">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">{t.models.selectModels}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
          onClick={() => dispatch(toggleModelSelector(false))}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close model selector</span>
        </Button>
      </div>

      {/* Content - Scrollable if too tall */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 gpt-scrollbar pb-2">
        {providers.map((provider: ModelProvider) => (
          <div key={provider.id} className="space-y-2">
            {/* Provider Header */}
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 relative rounded-md overflow-hidden flex-shrink-0 bg-muted/20">
                 <img
                    src={getProviderIcon(provider.id)}
                    alt={`${provider.name} icon`}
                    className="w-full h-full object-contain"
                  />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {provider.name}
              </h4>
            </div>

            {/* Models - Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              {provider.models.map((model) => {
                const isSelected = selectedModels.some(
                  (routeSel: RouteSel) => routeSel.model === model.id
                );
                return (
                  <button
                    key={model.id}
                    onClick={() => handleModelToggle(model.id, !isSelected)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {/* Optional: Model Icon if different from provider, but usually redundant here */}
                    {/* <img src={model.icon} className="w-3 h-3" /> */}
                    <span>{model.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
