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
} from "@/features/chat/store/image-generation-slice";
import { RootState } from "@/lib/store/store";

interface ModelSelectorProps {}

export function ImageModelSelector({}: ModelSelectorProps) {
  const { providers, selectedModels } = useSelector(
    (store: RootState) => store.imageGeneration
  );
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const handleModelToggle = (modelId: string, checked: boolean) => {
    if (checked) {
      const provider = getProviderByModelId(modelId);
      if (provider) {
        dispatch(addModel(provider, modelId));
      }
    } else {
      dispatch(removeModel(modelId));
    }
  };

  // Function to find provider name from a model id
  function getProviderByModelId(modelId: string): ModelProvider | undefined {
    for (const provider of providers) {
      if (provider.models.some((model) => model.id === modelId)) {
        return provider; // Return the whole provider object
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
    <Card className="p-4 bg-muted relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">{t.models.selectModels}</h3>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider: ModelProvider) => (
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
                      (routeSel: RouteSel) => routeSel.model === model.id
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
