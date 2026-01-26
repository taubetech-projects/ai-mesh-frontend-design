"use client";

import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ModelProvider } from "@/features/chat/types/models";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { X, Settings2, Sliders, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addModel,
  removeModel,
  togglePlaygroundSettings,
  updateSystemPrompt,
  updateTemperature,
  updateMaxTokens,
  updateInputFormat,
  updateOutputFormat,
  updateReasoningEffort,
  updatePlaygroundIsStreaming,
  updateProviderSpecific,
} from "@/features/platform/playground/store/playground-interface-slice";
import { RootState } from "@/lib/store/store";

export function PlaygroundSettings() {
  const {
    selectedModels,
    providers,
    systemPrompt,
    showPlaygroundSettings,
    providerSpecific,
    playgroundIsStreaming,
    temperature,
    maxTokens,
    inputFormat,
    outputFormat,
    reasoningEffort,
  } = useSelector((store: RootState) => store.playgroundSlice);

  const dispatch = useDispatch();
  const handleModelToggle = (
    provider: string,
    modelId: string,
    checked: boolean,
  ) => {
    if (checked) {
      dispatch(addModel(provider, modelId));
    } else {
      dispatch(removeModel(modelId));
    }
  };

  return (
    <div className="w-full p-6 bg-background/95 backdrop-blur-md rounded-xl border border-border shadow-2xl relative animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-foreground">
          <Settings2 className="w-4 h-4" />
          <h3 className="text-sm font-semibold tracking-tight">
            Configuration
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => dispatch(togglePlaygroundSettings(false))}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side: System Prompt */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <Label
            htmlFor="system-prompt"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            System Prompt
          </Label>
          <Textarea
            id="system-prompt"
            placeholder="You are a helpful AI assistant..."
            value={systemPrompt}
            onChange={(e) => dispatch(updateSystemPrompt(e.target.value))}
            className="flex-1 min-h-[240px] resize-none bg-muted/30 border-border focus:border-primary/50 focus:ring-primary/20 transition-all font-mono text-sm"
          />
        </div>

        {/* Right side: Parameters */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 content-start">
          {/* Select Models */}
          <div className="col-span-full space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Models
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal bg-muted/30 border-border hover:bg-muted/50"
                >
                  <span className="truncate flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                    {selectedModels.length > 0
                      ? selectedModels.map((sm) => sm.model).join(", ")
                      : "Select models..."}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 bg-background px-2 py-0.5 rounded-md border border-border">
                    {selectedModels.length} selected
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
                {providers.map((provider: ModelProvider, index: number) => (
                  <div key={provider.id}>
                    <DropdownMenuLabel className="text-muted-foreground">
                      {provider.name}
                    </DropdownMenuLabel>
                    {provider.models.map((model) => (
                      <DropdownMenuCheckboxItem
                        key={model.id}
                        checked={selectedModels.some(
                          (sm) => sm.model === model.id,
                        )}
                        onCheckedChange={(checked) =>
                          handleModelToggle(provider.name, model.id, checked)
                        }
                        onSelect={(e) => e.preventDefault()}
                      >
                        {model.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                    {index < providers.length - 1 && <DropdownMenuSeparator />}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Other Dropdowns */}
          <div className="space-y-2.5">
            <Label
              htmlFor="temperature"
              className="text-xs font-medium text-muted-foreground"
            >
              Temperature
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => dispatch(updateTemperature(e.target.value))}
              className="bg-muted/30 border-border"
              placeholder="0.7"
            />
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="input-format"
              className="text-xs font-medium text-muted-foreground"
            >
              Input Format
            </Label>
            <Select
              value={inputFormat}
              onValueChange={(value) => dispatch(updateInputFormat(value))}
            >
              <SelectTrigger
                id="input-format"
                className="bg-muted/30 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="output-format"
              className="text-xs font-medium text-muted-foreground"
            >
              Output Format
            </Label>
            <Select
              value={outputFormat}
              onValueChange={(value) => dispatch(updateOutputFormat(value))}
            >
              <SelectTrigger
                id="output-format"
                className="bg-muted/30 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Label
                htmlFor="reasoning-effort"
                className="text-xs font-medium text-muted-foreground"
              >
                Reasoning Effort
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/70 hover:text-foreground transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-xs">
                    <p>
                      Controls the depth of reasoning the model employs before
                      generating a response.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={reasoningEffort}
              onValueChange={(value) => dispatch(updateReasoningEffort(value))}
            >
              <SelectTrigger
                id="reasoning-effort"
                className="bg-muted/30 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="max-tokens"
              className="text-xs font-medium text-muted-foreground"
            >
              Max Tokens
            </Label>
            <Input
              id="max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => dispatch(updateMaxTokens(e.target.value))}
              className="bg-muted/30 border-border"
              placeholder="4096"
            />
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="is-streaming"
              className="text-xs font-medium text-muted-foreground"
            >
              Streaming
            </Label>
            <Select
              value={String(playgroundIsStreaming)}
              onValueChange={(value) =>
                dispatch(updatePlaygroundIsStreaming(value === "true"))
              }
            >
              <SelectTrigger
                id="is-streaming"
                className="bg-muted/30 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">On</SelectItem>
                <SelectItem value="false">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label
              htmlFor="provider-specific"
              className="text-xs font-medium text-muted-foreground"
            >
              Provider Specific
            </Label>
            <Select
              value={String(providerSpecific)}
              onValueChange={(value) =>
                dispatch(updateProviderSpecific(value === "true"))
              }
            >
              <SelectTrigger
                id="provider-specific"
                className="bg-muted/30 border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
