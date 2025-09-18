"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import type { ModelProvider } from "@/types/models"

interface ModelTabsProps {
  providers: ModelProvider[]
  selectedModels: string[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ModelTabs({ providers, selectedModels, activeTab, setActiveTab }: ModelTabsProps) {
  // Get model details for selected models
  const getModelDetails = (modelId: string) => {
    for (const provider of providers) {
      const model = provider.models.find((m) => m.id === modelId)
      if (model) return { model, provider }
    }
    return null
  }

  const activeModels = selectedModels.map((id) => getModelDetails(id)).filter(Boolean)

  return (
    <div className="flex items-center gap-1 p-2 overflow-x-auto">
      {activeModels.map(({ model, provider }) => (
        <div
          key={model.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
            activeTab === model.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted hover:bg-muted/80 border-border"
          }`}
          onClick={() => setActiveTab(model.id)}
        >
          <span className="text-sm">{model.icon}</span>
          <span className="text-sm font-medium whitespace-nowrap">{model.name}</span>
          <div className="flex items-center gap-1">
            <Switch checked={true} size="sm" className="scale-75" />
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation()
                // Handle tab close
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
