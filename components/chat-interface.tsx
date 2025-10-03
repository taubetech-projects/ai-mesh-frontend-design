"use client";

import type React from "react";

import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelColumns } from "@/components/model-columns";
import { ModelSelector } from "@/components/model-selector";
import type { ModelProvider } from "@/types/models";
import { Send, Mic, Paperclip, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { RouteSel, streamChat } from "@/lib/chatApi";
import { chatInterfaceReducer } from "@/reducer/chat-interface-reducer";
import {
  ADD_MESSAGES,
  CONCAT_DELTA,
  TOGGLE_MODEL_SELECTOR,
  UPDATE_INPUT,
} from "@/reducer/constants";
import { Route } from "next";

const defaultProviders: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "Gpt-5", icon: "🤖" },
      { id: "gpt-5-nano", name: "Gpt-5 Nano", icon: "🤖" },
      { id: "gpt-5-mini", name: "Gpt-5 Mini", icon: "🤖" },
      { id: "gpt-4.1", name: "GPT-4.1", icon: "⚡" },
      { id: "gpt-4.1-mini", name: "GPT-4.1 mini", icon: "⚡" },
      { id: "gpt-4.1-nano", name: "GPT-4.1 Nano", icon: "⚡" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", icon: "⚡" },

    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3-5-haiku-latest", name: "Claude 3.5 haiku", icon: "🧠" },
      { id: "claude-3-7-sonnet-latest", name: "Claude Sonnet 3.7", icon: "💭" },
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", icon: "💭" },
      { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5", icon: "💭" },

    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", icon: "💎" },
      {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        icon: "💎",
      },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", icon: "💎" },
      { id: "consensus", name: "Consensus", icon: "💎" },

    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      { id: "deepseek-chat", name: "DeepSeek Chat", icon: "🔍" },
      { id: "deepseek-reasoner", name: "DeepSeek Reasoner", icon: "💻" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    models: [{ id: "sonar", name: "Sonar", icon: "🔍" },
    { id: "sonar-pro", name: "Sonar Pro", icon: "🔍" },
    { id: "sonar-reasoning", name: "Sonar Reasoning", icon: "🔍" },
    { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro", icon: "🔍" },


    ],
  },
  {
    id: "grok",
    name: "Grok",
    models: [{ id: "grok-3-mini", name: "Grok-3 Mini", icon: "🔍" },
    { id: "grok-code-fast-1", name: "Grok-Code Fast", icon: "🔍" },
    { id: "grok-4-fast-reasoning", name: "Grok-4 Fast Reasoning", icon: "🔍" },
    { id: "grok-4-fast-non-reasoning", name: "Grok-4 Fast Non Reasoning", icon: "🔍" },
    ],
  },
];

var count = 0;

interface ChatInterfaceProps {
  providers: ModelProvider[];
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
}

type AssistantMsg = {
  role: "assistant";
  content: string;
  meta?: {
    provider: string;
    model: string;
    label?: string;
    latency_ms?: number;
  };
};

type UserMsg = { role: "user"; content: string };
type Message = UserMsg | AssistantMsg;

const initialSelectedModels: RouteSel[] = [
  { provider: "Google", model: "gemini-2.5-flash-lite" },
  { provider: "DeepSeek", model: "deepseek-chat" },
];
const initialState: {
  showModelSelector: boolean;
  selectedModels: RouteSel[];
  inputMessage: string;
  messages: Record<string, Message[]>;
  isStreaming: boolean;
} = {
  showModelSelector: false,
  selectedModels: initialSelectedModels,
  inputMessage: "",
  messages: {},
  isStreaming: false,
};
export function ChatInterface() {
  const [state, dispatch] = useReducer(chatInterfaceReducer, initialState);
  const { showModelSelector, selectedModels, inputMessage, messages, isStreaming } = state;

  const { t } = useLanguage();

  function modeSelection(){
    const model = selectedModels.find((model: RouteSel) => model.model === "consensus");
    return model? "consensus":"multi";
  }

  // ---- Send / Stream ----
  const onSend = async (userMessage: string) => {
    if (selectedModels.length === 0) return;
    // Initialize messages state for each selected model if not already present
    dispatch({
      type: ADD_MESSAGES,
      payload: { inputMessage: userMessage },
    });
    // console.log("Messages", messages);
    const bodyRoutes = selectedModels
      .filter((model: RouteSel) => model.model !== "consensus")
      .map((model:RouteSel) => ({ provider: model.provider, model: model.model }));
    console.log("Body Routes: ",bodyRoutes);
    const ac = new AbortController();
    console.log("Selected mode: ",modeSelection());

    const body = {
      mode: modeSelection(),
      routes: bodyRoutes.length > 0 ? bodyRoutes : null,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      stream: true,
      provider_response: false,
    };

    await streamChat(
      body,
      (evt) => {
        const e = evt.event;
        const d = evt.data || {};
        if (e === "chat.response.created") {
          dispatch({
            type: "START_STREAM",
            payload: { isStreaming: true },
          });
        }
        // console.log(e, d); // You can uncomment this for debugging
        if (e === "chat.response.delta") {
          const modelId = d.model;
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;
          dispatch({
            type: CONCAT_DELTA,
            payload: { modelId: modelId, content: contentChunk },
          });
        }
        if (e === "chat.response.completed") {
          count++;
          if (count === bodyRoutes.length) {
            dispatch({
              type: "END_STREAM",
              payload: { isStreaming: false },
            });
          }

        }
        if (e === "consensus") {
          console.log("This is a consensus event", d.delta.text);
          const modelId = "consensus";
          const contentChunk = d.delta.text || "";

          if (!modelId || !contentChunk) return;
          dispatch({
            type: CONCAT_DELTA,
            payload: { modelId: modelId, content: contentChunk },
          });
          dispatch({
            type: "END_STREAM",
            payload: { isStreaming: false },
          })
        }
        // console.log("Messages", messages);
      },
      ac.signal
    ).catch((err) => {
      console.error("SSE error", err);
    });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Handle message sending logic here
      onSend(inputMessage);
      console.log(
        "Sending message:",
        inputMessage,
        "to models:",
        selectedModels
      );
      // setInputMessage("");
      dispatch({ type: UPDATE_INPUT, payload: { inputMessage: "" } });
      dispatch({ type: TOGGLE_MODEL_SELECTOR, payload: {showModelSelector: false}}); 
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="flex-1 relative h-full" style={{ minHeight: 0 }}>
        <ModelColumns
          providers={defaultProviders}
          selectedModels={selectedModels}
          dispatch={dispatch}
          messages={messages}
        />
      </div>

      <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Model Selector */}
          {showModelSelector && (
            <div className="mb-4">
              <ModelSelector
                providers={defaultProviders}
                selectedModels={selectedModels}
                dispatch={dispatch}
              />
            </div>
          )}

          {/* Input Field */}
          <div className="relative">
            <Input
              value={inputMessage}
              // onChange={(e) => setInputMessage(e.target.value)}
              onChange={(e) =>
                dispatch({
                  type: UPDATE_INPUT,
                  payload: { inputMessage: e.target.value },
                })
              }
              onKeyPress={handleKeyPress}
              placeholder={t.chat.askAnything}
              className="pr-32 py-3 text-base bg-muted border-border text-white placeholder:text-muted-foreground"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dispatch({ type: TOGGLE_MODEL_SELECTOR, payload: {showModelSelector: !showModelSelector}})}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-8 w-8 bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!inputMessage.trim() || isStreaming}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
