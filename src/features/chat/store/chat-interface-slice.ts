import { EMPTY_STRING, ROLES } from "@/shared/constants/constants";
import {
  AIModel,
  Message,
  ModelProvider,
  RouteSel,
} from "@/features/chat/types/models";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultProviders: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "Gpt-5", icon: "/icons/openai-64x64.png" },
      { id: "gpt-5-nano", name: "Gpt-5 Nano", icon: "/icons/openai-64x64.png" },
      { id: "gpt-5-mini", name: "Gpt-5 Mini", icon: "/icons/openai-64x64.png" },
      { id: "gpt-4.1", name: "GPT-4.1", icon: "/icons/openai-64x64.png" },
      {
        id: "gpt-4.1-mini",
        name: "GPT-4.1 mini",
        icon: "/icons/openai-64x64.png",
      },
      {
        id: "gpt-4.1-nano",
        name: "GPT-4.1 Nano",
        icon: "/icons/openai-64x64.png",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        icon: "/icons/openai-64x64.png",
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
        icon: "/icons/anthropic-64x64.png",
      },
      {
        id: "claude-3-7-sonnet-latest",
        name: "Claude Sonnet 3.7",
        icon: "/icons/anthropic-64x64.png",
      },
      {
        id: "claude-sonnet-4-20250514",
        name: "Claude Sonnet 4",
        icon: "/icons/anthropic-64x64.png",
      },
      {
        id: "claude-sonnet-4-5-20250929",
        name: "Claude Sonnet 4.5",
        icon: "/icons/anthropic-64x64.png",
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
        icon: "/icons/gemini-64x64.png",
      },
      {
        id: "gemini-2.5-flash-lite",
        name: "Gemini 2.5 Flash Lite",
        icon: "/icons/gemini-64x64.png",
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        icon: "/icons/gemini-64x64.png",
      },
      {
        id: "consensus",
        name: "Consensus",
        icon: "/icons/consensus-64x64.png",
      },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      {
        id: "deepseek-chat",
        name: "DeepSeek Chat",
        icon: "/icons/deepseek-64x64.png",
      },
      {
        id: "deepseek-reasoner",
        name: "DeepSeek Reasoner",
        icon: "/icons/deepseek-64x64.png",
      },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    models: [
      { id: "sonar", name: "Sonar", icon: "/icons/perplexity-64x64.png" },
      {
        id: "sonar-pro",
        name: "Sonar Pro",
        icon: "/icons/perplexity-64x64.png",
      },
      {
        id: "sonar-reasoning",
        name: "Sonar Reasoning",
        icon: "/icons/perplexity-64x64.png",
      },
      {
        id: "sonar-reasoning-pro",
        name: "Sonar Reasoning Pro",
        icon: "/icons/perplexity-64x64.png",
      },
    ],
  },
  {
    id: "grok",
    name: "Grok",
    models: [
      { id: "grok-3-mini", name: "Grok-3 Mini", icon: "/icons/grok-64x64.png" },
      {
        id: "grok-code-fast-1",
        name: "Grok-Code Fast",
        icon: "/icons/grok-64x64.png",
      },
      {
        id: "grok-4-fast-reasoning",
        name: "Grok-4 Fast Reasoning",
        icon: "/icons/grok-64x64.png",
      },
      {
        id: "grok-4-fast-non-reasoning",
        name: "Grok-4 Fast Non Reasoning",
        icon: "/icons/grok-64x64.png",
      },
    ],
  },
  {
    id: "ollama",
    name: "Meta",
    models: [
      { id: "llama2", name: "Llama 2", icon: "/icons/ollama-64x64.png" },
      { id: "llama3", name: "Llama 3", icon: "/icons/ollama-64x64.png" },
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
  editedMessageId: number | null;
  isStreaming: boolean;
  isSent: boolean;
  triggerSend: boolean;
  uploadingFiles: boolean;
  showRecorder: boolean;
  currentMessageVersion: number;
}

export const initialSelectedModels: RouteSel[] = [
  { provider: "openai", model: "gpt-5-nano" },
  { provider: "gemini", model: "gemini-2.5-flash-lite" },
];

const initialState: ChatInterfaceState = {
  providers: [...defaultProviders],
  showModelSelector: false,
  selectedModels: initialSelectedModels,
  inputMessage: "",
  messages: {},
  modelResponses: {},
  editedMessageId: null,
  isStreaming: false,
  isSent: false,
  triggerSend: false,
  uploadingFiles: false,
  showRecorder: false,
  currentMessageVersion: 0,
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

    setSelectedModels(state, action : PayloadAction<RouteSel[]>) {
      state.selectedModels = action.payload;
    },

    setInitialSelectedModels(state) {
      state.selectedModels = initialSelectedModels;
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
          { role: ROLES.USER, content: action.payload },
          {
            role: ROLES.ASSISTANT,
            content: EMPTY_STRING,
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
        if (lastMessage.role !== ROLES.ASSISTANT) return; // No change if last message is not from assistant
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
          state.modelResponses[modelId] = EMPTY_STRING;
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

    setEditMessageId(state, action) {
      state.editedMessageId = action.payload;
    },
    triggerParentSend: (state) => {
      state.triggerSend = !state.triggerSend; // toggle to force update
    },
    triggerFileUploading: (state, action) => {
      state.uploadingFiles = action.payload;
    },
    startRecorder: (state) => {
      state.showRecorder = true;
    },
    stopRecorder: (state) => {
      state.showRecorder = false;
    },
    setCurrentMessageVersion(state, action) {
      state.currentMessageVersion = action.payload;
    },
    clearChatState(state) {
      state.messages = {};
      state.inputMessage = "";
      state.modelResponses = {};
      state.editedMessageId = null;
    },
    resetAllStates(state) {
      state.messages = {};
      state.inputMessage = "";
      state.modelResponses = {};
      state.editedMessageId = null;
      state.showModelSelector = false;
      state.selectedModels = initialSelectedModels;
      state.isStreaming = false;
      state.isSent = false;
      state.triggerSend = false;
      state.uploadingFiles = false;
      state.showRecorder = false;
      state.currentMessageVersion = 0;
    },
  },
});

export const {
  toggleModelSelector,
  addModel,
  removeModel,
  setSelectedModels,
  setInitialSelectedModels,
  updateInputMessage,
  addMessages,
  concateDelta,
  concatenateDelta,
  startStreaming,
  endStreaming,
  clearModelResponses,
  setEditMessageId,
  triggerParentSend,
  triggerFileUploading,
  startRecorder,
  stopRecorder,
  setCurrentMessageVersion,
  clearChatState,
  resetAllStates,
} = chatInterfaceSlice.actions;
export default chatInterfaceSlice.reducer;
