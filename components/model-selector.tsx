"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { ModelProvider } from "@/types/models";
import { useLanguage } from "@/contexts/language-context";
import { RouteSel } from "@/lib/chatApi";
import { ADD_MODEL, REMOVE_MODEL } from "@/reducer/constants";

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
      openai: "🤖",
      anthropic: "🧠",
      google: "🔍",
      deepseek: "🔬",
    };
    return icons[providerId] || "🤖";
  };

  return (
    <Card className="p-4 bg-muted/50">
      <h3 className="text-sm font-medium mb-3">{t.models.selectModels}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div key={provider.id} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-lg">{getProviderIcon(provider.id)}</span>
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
                    <span>{model.icon}</span>
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
