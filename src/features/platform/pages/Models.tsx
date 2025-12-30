import { useState } from "react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, SearchInput } from "@/features/platform/components/platform";
import { cn } from "@/features/platform/lib/utils";

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: string;
  inputPrice: string;
  outputPrice: string;
  status: "available" | "beta" | "deprecated";
  capabilities: string[];
}

const models: Model[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Most capable GPT-4 model, optimized for speed and cost efficiency.",
    contextWindow: "128K",
    inputPrice: "$0.01",
    outputPrice: "$0.03",
    status: "available",
    capabilities: ["Text", "Vision", "Function Calling"],
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "Advanced reasoning and complex task handling.",
    contextWindow: "8K",
    inputPrice: "$0.03",
    outputPrice: "$0.06",
    status: "available",
    capabilities: ["Text", "Function Calling"],
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Most powerful Claude model for complex tasks.",
    contextWindow: "200K",
    inputPrice: "$0.015",
    outputPrice: "$0.075",
    status: "available",
    capabilities: ["Text", "Vision", "Analysis"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and speed for most tasks.",
    contextWindow: "200K",
    inputPrice: "$0.003",
    outputPrice: "$0.015",
    status: "available",
    capabilities: ["Text", "Vision"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Versatile model for text and multimodal tasks.",
    contextWindow: "32K",
    inputPrice: "$0.00025",
    outputPrice: "$0.0005",
    status: "available",
    capabilities: ["Text", "Vision", "Code"],
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    description: "Open-source large language model.",
    contextWindow: "8K",
    inputPrice: "$0.0008",
    outputPrice: "$0.0008",
    status: "beta",
    capabilities: ["Text", "Code"],
  },
];

export default function Models() {
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = [...new Set(models.map((m) => m.provider))];

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.description.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = !selectedProvider || model.provider === selectedProvider;
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
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="card-interactive p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{model.name}</h3>
                    {model.status === "beta" && (
                      <span className="badge-warning">Beta</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{model.provider}</p>
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {model.contextWindow} context
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
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
                  <span className="text-foreground font-mono">{model.inputPrice}/1K</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Output: </span>
                  <span className="text-foreground font-mono">{model.outputPrice}/1K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
