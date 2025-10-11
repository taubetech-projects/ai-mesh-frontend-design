"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  initialPlaygroundState,
  playgroundReducer,
  UPDATE_INPUT_FORMAT,
  UPDATE_MAX_TOKENS,
  UPDATE_OUTPUT_FORMAT,
  UPDATE_REASONING_EFFORT,
  UPDATE_SYSTEM_PROMPT,
  UPDATE_TEMPERATURE,
  PLAYGROUND_IS_STREAMING,
  UPDATE_PROVIDER_SPECIFIC,
} from "@/redux/playground-reducer";
import { ModelProvider } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addModel,
  removeModel,
  togglePlaygroundSettings,
} from "@/redux/playground-interface-slice";

export function PlaygroundSettings({
  settingsDispatch,
  settingsState,
}: {
  settingsDispatch: React.Dispatch<any>;
  settingsState: any;
}) {
  const { selectedModels, providers } = useSelector(
    (store: any) => store.playgroundInterface
  );

  const dispatch = useDispatch();
  const handleModelToggle = (
    provider: string,
    modelId: string,
    checked: boolean
  ) => {
    if (checked) {
      dispatch(addModel(provider, modelId));
    } else {
      dispatch(removeModel(modelId));
    }
  };

  return (
    <div className="p-4 bg-muted rounded-lg border border-border relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-foreground">
          Playground Settings
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
          onClick={() => dispatch(togglePlaygroundSettings(false))}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close playground settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="md:col-span-1 space-y-2">
          <Label htmlFor="system-prompt" className="text-xs font-medium">
            System Prompt
          </Label>
          <Textarea
            id="system-prompt"
            placeholder="You are a helpful assistant."
            value={settingsState.systemPrompt}
            onChange={(e) =>
              settingsDispatch({
                type: UPDATE_SYSTEM_PROMPT,
                payload: e.target.value,
              })
            }
            className="h-48 resize-none bg-background border border-text-area"
          />
        </div>

        {/* Right side */}
        <div className="md:col-span-2 grid grid-cols-2 gap-x-4 gap-y-4">
          {/* Select Models */}
          <div className="space-y-2 col-span-2">
            <Label className="text-xs font-medium">Select Models</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal bg-background border-border"
                >
                  <span className="truncate">
                    {selectedModels.length > 0
                      ? selectedModels.map((sm) => sm.model).join(", ")
                      : "Select models..."}
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
                          (sm) => sm.model === model.id
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
          <div className="space-y-2">
            <Label htmlFor="temperature" className="text-xs font-medium">
              Temperature
            </Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={settingsState.temperature}
              onChange={(e) =>
                settingsDispatch({
                  type: UPDATE_TEMPERATURE,
                  payload: e.target.value,
                })
              }
              className="bg-background border-border"
              placeholder="0.7"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-format" className="text-xs font-medium">
              Input Format
            </Label>
            <Select
              value={settingsState.inputFormat}
              onValueChange={(value) =>
                settingsDispatch({ type: UPDATE_INPUT_FORMAT, payload: value })
              }
            >
              <SelectTrigger
                id="input-format"
                className="bg-background border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-format" className="text-xs font-medium">
              Output Format
            </Label>
            <Select
              value={settingsState.outputFormat}
              onValueChange={(value) =>
                settingsDispatch({ type: UPDATE_OUTPUT_FORMAT, payload: value })
              }
            >
              <SelectTrigger
                id="output-format"
                className="bg-background border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reasoning-effort" className="text-xs font-medium">
              Reasoning Effort
            </Label>
            <Select
              value={settingsState.reasoningEffort}
              onValueChange={(value) =>
                settingsDispatch({
                  type: UPDATE_REASONING_EFFORT,
                  payload: value,
                })
              }
            >
              <SelectTrigger
                id="reasoning-effort"
                className="bg-background border-border"
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
          <div className="space-y-2">
            <Label htmlFor="max-tokens" className="text-xs font-medium">
              Max Tokens
            </Label>
            <Input
              id="max-tokens"
              type="number"
              value={settingsState.maxTokens}
              onChange={(e) =>
                settingsDispatch({
                  type: UPDATE_MAX_TOKENS,
                  payload: e.target.value,
                })
              }
              className="bg-background border-border"
              placeholder="4096"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="is-streaming" className="text-xs font-medium">
              Streaming
            </Label>
            <Select
              value={String(settingsState.playgroundIsStreaming)}
              onValueChange={(value) =>
                settingsDispatch({
                  type: PLAYGROUND_IS_STREAMING,
                  payload: value === "true",
                })
              }
            >
              <SelectTrigger
                id="is-streaming"
                className="bg-background border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">On</SelectItem>
                <SelectItem value="false">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider-specific" className="text-xs font-medium">
              Provider Specific
            </Label>
            <Select
              value={String(settingsState.providerSpecific)}
              onValueChange={(value) =>
                settingsDispatch({
                  type: UPDATE_PROVIDER_SPECIFIC,
                  payload: value === "true",
                })
              }
            >
              <SelectTrigger
                id="provider-specific"
                className="bg-background border-border"
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
