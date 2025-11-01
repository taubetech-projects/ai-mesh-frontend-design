import { AIModel, Message, ModelProvider, RouteSel } from "@/types/models";

import { createSlice } from "@reduxjs/toolkit";
import { clear } from "console";

const defaultProviders: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "Gpt-5", icon: "icons/openai-64x64.png" },
      { id: "gpt-5-nano", name: "Gpt-5 Nano", icon: "icons/openai-64x64.png" },
      { id: "gpt-5-mini", name: "Gpt-5 Mini", icon: "icons/openai-64x64.png" },
      { id: "gpt-4.1", name: "GPT-4.1", icon: "icons/openai-64x64.png" },
      {
        id: "gpt-4.1-mini",
        name: "GPT-4.1 mini",
        icon: "icons/openai-64x64.png",
      },
      {
        id: "gpt-4.1-nano",
        name: "GPT-4.1 Nano",
        icon: "icons/openai-64x64.png",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        icon: "icons/openai-64x64.png",
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      {
        id: "claude-3-5-haiku-latest",
        name: "Claude 3.5 Haiku",
        icon: "icons/anthropic-64x64.png",
      },
      {
        id: "claude-3-7-sonnet-latest",
        name: "Claude Sonnet 3.7",
        icon: "icons/anthropic-64x64.png",
      },
      {
        id: "claude-sonnet-4-20250514",
        name: "Claude Sonnet 4",
        icon: "icons/anthropic-64x64.png",
      },
      {
        id: "claude-sonnet-4-5-20250929",
        name: "Claude Sonnet 4.5",
        icon: "icons/anthropic-64x64.png",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        icon: "icons/gemini-64x64.png",
      },
      {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        icon: "icons/gemini-64x64.png",
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        icon: "icons/gemini-64x64.png",
      },
      { id: "consensus", name: "Consensus", icon: "icons/consensus-64x64.png" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        icon: "icons/deepseek-64x64.png",
      },
      {
        id: "deepseek-reasoner",
        name: "DeepSeek Reasoner",
        icon: "icons/deepseek-64x64.png",
      },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    models: [
      { id: "sonar", name: "Sonar", icon: "icons/perplexity-64x64.png" },
      {
        id: "sonar-pro",
        name: "Sonar Pro",
        icon: "icons/perplexity-64x64.png",
      },
      {
        id: "sonar-reasoning",
        name: "Sonar Reasoning",
        icon: "icons/perplexity-64x64.png",
      },
      {
        id: "sonar-reasoning-pro",
        name: "Sonar Reasoning Pro",
        icon: "icons/perplexity-64x64.png",
      },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    models: [
      { id: "grok-3-mini", name: "Grok-3 Mini", icon: "icons/grok-64x64.png" },
      {
        id: "grok-code-fast-1",
        name: "Grok-Code Fast",
        icon: "icons/grok-64x64.png",
      },
      {
        id: "grok-4-fast-reasoning",
        name: "Grok-4 Fast Reasoning",
        icon: "icons/grok-64x64.png",
      },
      {
        id: "grok-4-fast-non-reasoning",
        name: "Grok-4 Fast Non Reasoning",
        icon: "icons/grok-64x64.png",
      },
    ],
  },
  {
    id: "ollama",
    name: "Meta",
    models: [
      { id: "llama2", name: "Llama 2", icon: "icons/ollama-64x64.png" },
      { id: "llama3", name: "Llama 3", icon: "icons/ollama-64x64.png" },
    ],
  },
];

interface ChatInterfaceState {
  providers: ModelProvider[];
  showModelSelector: boolean;
  selectedModels: RouteSel[];
  inputMessage: string;
  messages: Record<string, Message[]>;
  modelResponses: Record<string, string>;
  isStreaming: boolean;
  isSent: boolean;
}

const initialSelectedModels: RouteSel[] = [
  { provider: "gemini", model: "gemini-2.5-flash-lite" },
  { provider: "deepseek", model: "deepseek-chat" },
];

const initialState: ChatInterfaceState = {
  providers: [...defaultProviders],
  showModelSelector: false,
  selectedModels: initialSelectedModels,
  inputMessage: "",
  messages: {},
  modelResponses: {},
  isStreaming: false,
  isSent: false,
};

const chatInterfaceSlice = createSlice({
  name: "chatInterface",
  initialState: initialState,
  reducers: {
    toggleModelSelector(state, action) {
      state.showModelSelector = action.payload;
    },

    addModel: {
      prepare(provider, modelId) {
        return {
          payload: { provider: provider, modelId: modelId },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { provider, modelId } = action.payload;
        // Prevent duplicates based on model id
        if (
          state.selectedModels.some(
            (selectedModel: RouteSel) => selectedModel.model === modelId
          )
        ) {
          return; // No change
        }
        state.selectedModels.push({ provider: provider.id, model: modelId });
      },
    },

    removeModel(state, action) {
      const modelId = action.payload;
      state.selectedModels = state.selectedModels.filter(
        (selectedModel: RouteSel) => selectedModel.model !== modelId
      );
    },

    updateInputMessage(state, action) {
      state.inputMessage = action.payload;
    },

    addMessages(state, action) {
      const newMessages = { ...state.messages };
      for (const selectedModel of state.selectedModels) {
        const modelId = selectedModel.model;
        const existingMessages = newMessages[modelId] || [];
        newMessages[modelId] = [
          ...existingMessages,
          { role: "user", content: action.payload },
          {
            role: "assistant",
            content: "",
            meta: {
              provider: selectedModel.provider,
              model: selectedModel.model,
            },
          },
        ];
      }
      state.messages = newMessages;
    },

    concateDelta: {
      prepare(modelId, contentChunk) {
        return {
          payload: { modelId: modelId, content: contentChunk },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { modelId, content } = action.payload;
        const newMessages = { ...state.messages };
        const modelMessages = newMessages[modelId] || [];
        if (modelMessages.length === 0) return; // Should not happen
        const updatedMessages = [...modelMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        // Append the new content chunk to the last message
        lastMessage.content += content;
        // console.log("lastMessage", lastMessage.content, contentChunk);
        if (lastMessage.role !== "assistant") return; // No change if last message is not from assistant
        newMessages[modelId] = updatedMessages;
        state.messages = newMessages;
      },
    },

    concatenateDelta: {
      prepare(modelId, contentChunk) {
        return {
          payload: { modelId: modelId, content: contentChunk },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { modelId, content } = action.payload;

        // ✅ Safely initialize key if missing
        if (!state.modelResponses[modelId]) {
          state.modelResponses[modelId] = "";
        }
        console.log("modelId", modelId, "content", content);
        // ✅ Append new content to existing text
        state.modelResponses[modelId] += content;
      },
    },

    clearModelResponses(state) {
      state.modelResponses = {};
    },

    startStreaming(state) {
      state.isStreaming = true;
    },

    endStreaming(state) {
      state.isStreaming = false;
    },
  },
});

export const {
  toggleModelSelector,
  addModel,
  removeModel,
  updateInputMessage,
  addMessages,
  concateDelta,
  concatenateDelta,
  startStreaming,
  endStreaming,
  clearModelResponses,
} = chatInterfaceSlice.actions;
export default chatInterfaceSlice.reducer;
