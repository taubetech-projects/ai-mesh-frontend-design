"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  SearchInput,
} from "@/features/platform/components/platform";
import { cn } from "@/features/platform/lib/utils";
import { useModels } from "@/features/platform/models/hooks/useModelQueries";
import { ModelView } from "@/features/platform/models/types/modelTypes";
import { ModelCard } from "@/features/platform/models/components/ModelCard";
import { useRouter } from "next/navigation";
import { PLATFORM_ROUTES } from "@/shared/constants/routingConstants";

export default function Models() {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const router = useRouter();
  const { data: models, isLoading: isModelsLoading } = useModels();
  const providers = [
    ...new Set(models?.map((m: ModelView) => m.providerDisplayName)),
  ];

  const filteredModels = models?.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.description?.toLowerCase().includes(search.toLowerCase());
    const matchesProvider =
      !selectedProvider || model.providerDisplayName === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const onModelClick = (id: string) => {
    router.push(`${PLATFORM_ROUTES.MODELS}/${id}`);
  };

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
            <ModelCard
              key={model.id}
              model={model}
              onModelClick={() => onModelClick(model.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
