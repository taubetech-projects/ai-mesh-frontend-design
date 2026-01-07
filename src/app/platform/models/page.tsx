"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, SearchInput } from "@/features/platform/components/platform";
import { cn } from "@/features/platform/lib/utils";
import { useModels } from "@/features/platform/models/hooks/useModelQueries";
import { ModelView } from "@/features/platform/models/types/modelTypes";


export default function Models() {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const {data : models, isLoading: isModelsLoading } = useModels();
    const providers = [...new Set(models?.map((m: ModelView) => m.providerDisplayName))];


  const filteredModels = models?.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.description?.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = !selectedProvider || model.providerDisplayName === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Models"
          description="Browse and compare available AI models"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search models..."
            className="sm:w-80"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedProvider(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                !selectedProvider
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  selectedProvider === provider
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredModels?.map((model) => (
            <div
              key={model.id}
              className="card-interactive p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{model.displayName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.providerDisplayName}</p>
                </div>
                <span className="text-xs badge-warning  px-2 py-1 rounded ">
                  {model.contextWindowTokens} context
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(model.inputModalities?.length > 0 || model.outputModalities?.length > 0) && (
                  <div className="flex items-center gap-1.5 text-xs bg-secondary text-foreground px-2 py-1 rounded">
                    <div className="flex items-center gap-1">
                      {model.inputModalities?.map((m: string) =>
                        m.includes("IMAGE") ? (
                          <ImageIcon key={m} className="w-3 h-3" />
                        ) : (
                          <span key={m} className="font-bold">
                            T
                          </span>
                        )
                      )}
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-1">
                      {model.outputModalities?.map((m: string) =>
                        m.includes("IMAGE") ? (
                          <ImageIcon key={m} className="w-3 h-3" />
                        ) : (
                          <span key={m} className="font-bold">
                            T
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
                {model.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-xs bg-secondary text-foreground px-2 py-1 rounded"
                  >
                    {cap}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Input: </span>
                  <span className="text-foreground font-mono">${model.inputPpmCents != null ? (model.inputPpmCents / 100).toFixed(2) : "—"}/1M</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Output: </span>
                  <span className="text-foreground font-mono">${model.outputPpmCents != null ? (model.outputPpmCents / 100).toFixed(2) : "—"}/1M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
