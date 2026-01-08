"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ImageIcon,
  Zap,
  Box,
  DollarSign,
  Cpu,
  Layers,
  CheckCircle2,
  Bot,
  Scale,
  Terminal,
  Code2,
  Fingerprint,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { useModels } from "@/features/platform/models/hooks/useModelQueries";

export default function ModelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params?.modelId as string;

  const { data: models, isLoading } = useModels();
  const model = models?.find((m) => m.id === modelId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse text-muted-foreground">
            Loading model details...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!model) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <h2 className="text-xl font-semibold">Model not found</h2>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Static data enrichment based on model properties
  const getUseCases = () => {
    const caps = model.capabilities.join(" ").toLowerCase();
    const cases = [
      "General Purpose Assistants",
      "Content Generation & Summarization",
    ];
    if (caps.includes("code")) cases.push("Code Generation & Refactoring");
    if (caps.includes("image") || caps.includes("vision"))
      cases.push("Visual Analysis & OCR");
    if (caps.includes("chat")) cases.push("Conversational Agents");
    return [...new Set(cases)].slice(0, 4);
  };

  const integrationCode = `import { AiMesh } from '@ai-mesh/sdk';

const client = new AiMesh({ apiKey: process.env.API_KEY });

const response = await client.chat.completions.create({
  model: '${model.id}',
  messages: [{ role: 'user', content: 'Hello world!' }],
});

console.log(response.choices[0].message.content);`;

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-7xl mx-auto pb-10">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <div className="p-1.5 rounded-full bg-secondary group-hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Models</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8 border-b border-border pb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {model.displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  {model.providerDisplayName}
                </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {model.description}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Deploy Model
              </button>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors border border-border">
                Test in Playground
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Content) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Box className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Context
                  </span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {model.contextWindowTokens?.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Input / 1M
                  </span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  $
                  {model.inputPpmCents != null
                    ? (model.inputPpmCents / 100).toFixed(2)
                    : "—"}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Output / 1M
                  </span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  $
                  {model.outputPpmCents != null
                    ? (model.outputPpmCents / 100).toFixed(2)
                    : "—"}
                </div>
              </div>
            </div>

            {/* Capabilities & Use Cases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((cap) => (
                    <div
                      key={cap}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground border border-border/50"
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium">{cap}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  Recommended For
                </h3>
                <ul className="space-y-2">
                  {getUseCases().map((useCase, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-muted-foreground">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Integration Code */}
            <section className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Integration
                </h3>
                <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="relative group">
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-mono border border-zinc-700">
                  TypeScript
                </div>
                <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 overflow-x-auto">
                  <code className="text-sm font-mono text-zinc-300">
                    {integrationCode}
                  </code>
                </pre>
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Model Details */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Model Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">
                    Provider
                  </span>
                  <span className="text-sm font-medium">
                    {model.providerDisplayName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">Foundation Model</span>
                </div>
                <div className="py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground block mb-1">
                    Technical ID
                  </span>
                  <code className="text-xs bg-secondary px-1.5 py-0.5 rounded font-mono break-all">
                    {model.name}
                  </code>
                </div>
              </div>
            </div>

            {/* Modalities */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Modalities
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Input
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {model.inputModalities?.length > 0 ? (
                      model.inputModalities.map((m) => (
                        <Badge key={m} text={m} />
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Text
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                    Output
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {model.outputModalities?.length > 0 ? (
                      model.outputModalities.map((m) => (
                        <Badge key={m} text={m} />
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Text
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety (Static) */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Safety & Alignment
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>Standard Content Filters</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>Zero-Data Retention</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span>Enterprise Grade Security</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Badge({ text }: { text: string }) {
  const isImage = text.includes("IMAGE");
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-xs font-medium">
      {isImage ? (
        <ImageIcon className="w-3 h-3" />
      ) : (
        <span className="font-bold">T</span>
      )}
      {text}
    </span>
  );
}
