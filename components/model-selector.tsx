"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ModelProvider } from "@/types/models";
import { useLanguage } from "@/contexts/language-context";
import { RouteSel } from "@/lib/chatApi";
import {
  ADD_MODEL,
  REMOVE_MODEL,
  TOGGLE_MODEL_SELECTOR,
} from "@/reducer/constants";
import { X } from "lucide-react";

interface ModelSelectorProps {
  providers: ModelProvider[];
  selectedModels: RouteSel[];
  // setSelectedModels: (models: RouteSel[]) => void;
  dispatch: React.Dispatch<any>;
}

export function ModelSelector({
  providers,
  selectedModels,
  dispatch,
}: ModelSelectorProps) {
  const { t } = useLanguage();

  const handleModelToggle = (modelId: string, checked: boolean) => {
    if (checked) {
      const providerName = getProviderNameByModelId(modelId);
      if (providerName) {
        dispatch({
          type: ADD_MODEL,
          payload: { provider: providerName, model: modelId },
        });
      }
    } else {
      dispatch({ type: REMOVE_MODEL, payload: { modelId: modelId } });
    }
  };

  // Function to find provider name from a model id
  function getProviderNameByModelId(modelId: string): string | undefined {
    for (const provider of providers) {
      if (provider.models.some((model) => model.id === modelId)) {
        return provider.name;
      }
    }
    return undefined; // if not found
  }

  const getProviderIcon = (providerId: string) => {
    const icons: Record<string, string> = {
      // openai: "🤖",
      openai: "icons/openai-64x64.png",
      anthropic: "icons/anthropic-64x64.png",
      google: "icons/gemini-64x64.png",
      deepseek: "icons/deepseek-64x64.png",
      grok: "icons/grok-64x64.png",
      perplexity: "icons/perplexity-64x64.png",
    };
    return icons[providerId] || "🤖";
  };

  return (
    <Card className="p-4 bg-muted relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">{t.models.selectModels}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
          onClick={() =>
            dispatch({
              type: TOGGLE_MODEL_SELECTOR,
              payload: { showModelSelector: false },
            })
          }
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close model selector</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div key={provider.id} className="space-y-2">
            <h4 className="text-xl font-medium text-muted-foreground flex items-center gap-1">
              {/*<span className="text-lg">{getProviderIcon(provider.id)}</span> */}
              <img
                src={getProviderIcon(provider.id)}
                alt={`${provider.name} icon`}
                className="w-5 h-5"
              />
              {provider.name}
            </h4>
            <div className="space-y-2">
              {provider.models.map((model) => (
                <div key={model.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={model.id}
                    checked={selectedModels.some(
                      (routeSel) => routeSel.model === model.id
                    )}
                    onCheckedChange={(checked) =>
                      handleModelToggle(model.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={model.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    {/*<span>{model.icon}</span> */}
                    {model.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
