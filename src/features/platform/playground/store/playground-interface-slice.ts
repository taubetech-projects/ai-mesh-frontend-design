import { EMPTY_STRING, ROLES } from "@/shared/constants/constants";
import {
  AIModel,
  Message,
  ModelProvider,
  RouteSel,
} from "@/features/chat/types/models";

import { createSlice } from "@reduxjs/toolkit";

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
  isStreaming: boolean;
  isSent: boolean;
  showPlaygroundSettings: boolean;
  jsonMessages: Record<string, any[]>;
  systemPrompt: string;
  temperature: string;
  maxTokens: string;
  inputFormat: string;
  outputFormat: string;
  reasoningEffort: string;
  playgroundIsStreaming: boolean;
  providerSpecific: boolean;
  textMessagesWithMsgId: Record<string, Record<string, any[]>>; // LinkedHashMap-like { modelName: { convId: [messages] } }
  jsonMessagesWithMsgId: Record<string, Record<string, any[]>>; // LinkedHashMap-like { modelName: { convId: [messages] } }
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
  isStreaming: false,
  isSent: false,
  showPlaygroundSettings: false,
  jsonMessages: {},
  systemPrompt: "You are a helpful assistant.",
  temperature: "0.7",
  maxTokens: "4096",
  inputFormat: "text",
  outputFormat: "text",
  reasoningEffort: "auto",
  playgroundIsStreaming: true,
  providerSpecific: false,
  textMessagesWithMsgId: {},
  jsonMessagesWithMsgId: {},
};

const playgroundInterfaceSlice = createSlice({
  name: "playgroundInterface",
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
    startStreaming(state) {
      state.isStreaming = true;
    },
    endStreaming(state) {
      state.isStreaming = false;
    },
    togglePlaygroundSettings(state, action) {
      state.showPlaygroundSettings = action.payload;
    },
    addJsonUserMessages(state, action) {
      const newMessages = { ...state.jsonMessages };
      for (const selectedModel of state.selectedModels) {
        const modelId = selectedModel.model;
        const existingMessages = newMessages[modelId] || [];
        newMessages[modelId] = [
          ...existingMessages,
          { role: ROLES.USER, content: action.payload },
        ];
      }
      state.jsonMessages = newMessages;
    },
    addJsonAssistantMessage: {
      prepare(modelId, content) {
        return {
          payload: { modelId: modelId, content: content },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { modelId, content } = action.payload;
        const newMessages = { ...state.jsonMessages };
        const modelMessages = newMessages[modelId] || [];
        newMessages[modelId] = [
          ...modelMessages,
          { role: ROLES.ASSISTANT, content: content },
        ];
        console.log("newMessages json", newMessages);
        state.jsonMessages = newMessages;
      },
    },
    updateSystemPrompt(state, action) {
      state.systemPrompt = action.payload;
    },
    updateTemperature(state, action) {
      state.temperature = action.payload;
    },
    updateMaxTokens(state, action) {
      state.maxTokens = action.payload;
    },
    updateInputFormat(state, action) {
      state.inputFormat = action.payload;
    },
    updateOutputFormat(state, action) {
      state.outputFormat = action.payload;
    },
    updateReasoningEffort(state, action) {
      state.reasoningEffort = action.payload;
    },
    updatePlaygroundIsStreaming(state, action) {
      state.playgroundIsStreaming = action.payload;
    },
    updateProviderSpecific(state, action) {
      state.providerSpecific = action.payload;
    },

    addUserMessagesWithMessageId: {
      prepare(messageId, userMessage) {
        return {
          payload: { messageId: messageId, content: userMessage },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { messageId, content } = action.payload;
        for (const selectedModel of state.selectedModels) {
          const modelId = selectedModel.model;
          // Initialize model map if missing
          if (!state.textMessagesWithMsgId[modelId]) {
            state.textMessagesWithMsgId[modelId] = {};
          }
          // Initialize message if missing
          if (!state.textMessagesWithMsgId[modelId][messageId]) {
            state.textMessagesWithMsgId[modelId][messageId] = [];
          }
          // Append message (maintaining order)
          state.textMessagesWithMsgId[modelId][messageId].push({
            messageId: messageId,
            role: ROLES.USER,
            content: content,
          });
          state.textMessagesWithMsgId[modelId][messageId].push({
            messageId: messageId,
            role: ROLES.ASSISTANT,
            content: EMPTY_STRING,
            meta: {
              provider: selectedModel.provider,
              model: selectedModel.model,
            },
          });
        }
      },
    },
    concateDeltaWithMessageId: {
      prepare(modelId, messageId, contentChunk) {
        return {
          payload: {
            modelId: modelId,
            messageId: messageId,
            content: contentChunk,
          },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { modelId, messageId, content } = action.payload;
        const modelMessages =
          state.textMessagesWithMsgId[modelId][messageId] || [];
        if (modelMessages.length === 0) return; // Should not happen
        const updatedMessages = [...modelMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        // Append the new content chunk to the last message
        lastMessage.content += content;
        if (lastMessage.role !== ROLES.ASSISTANT) return; // No change if last message is not from assistant
        state.textMessagesWithMsgId[modelId][messageId] = updatedMessages;
      },
    },
    addJsonUserMessagesWithMessageId: {
      prepare(messageId, userMessage) {
        return {
          payload: { messageId: messageId, content: userMessage },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { messageId, content } = action.payload;
        for (const selectedModel of state.selectedModels) {
          const modelId = selectedModel.model;
          // Initialize model map if missing
          if (!state.jsonMessagesWithMsgId[modelId]) {
            state.jsonMessagesWithMsgId[modelId] = {};
          }
          // Initialize message if missing
          if (!state.jsonMessagesWithMsgId[modelId][messageId]) {
            state.jsonMessagesWithMsgId[modelId][messageId] = [];
          }
          // Append message (maintaining order)
          state.jsonMessagesWithMsgId[modelId][messageId].push({
            messageId: messageId,
            role: ROLES.USER,
            content: content,
          });
        }
      },
    },
    addJsonAssistantMessageWithMessageId: {
      prepare(modelId, messageId, content) {
        return {
          payload: {
            modelId: modelId,
            messageId: messageId,
            content: content,
          },
          meta: undefined,
          error: undefined,
        };
      },
      reducer(state, action) {
        const { modelId, messageId, content } = action.payload;
        const modelMessages =
          state.jsonMessagesWithMsgId[modelId][messageId] || [];
        if (modelMessages.length === 0) return; // Should not happen
        // Append message (maintaining order)
        state.jsonMessagesWithMsgId[modelId][messageId].push({
          messageId: messageId,
          role: ROLES.ASSISTANT,
          content: content,
        });
      },
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
  startStreaming,
  endStreaming,
  togglePlaygroundSettings,
  addJsonUserMessages,
  addJsonAssistantMessage,
  updateSystemPrompt,
  updateTemperature,
  updateMaxTokens,
  updateInputFormat,
  updateOutputFormat,
  updateReasoningEffort,
  updatePlaygroundIsStreaming,
  updateProviderSpecific,
  addUserMessagesWithMessageId,
  concateDeltaWithMessageId,
  addJsonUserMessagesWithMessageId,
  addJsonAssistantMessageWithMessageId,
} = playgroundInterfaceSlice.actions;
export default playgroundInterfaceSlice.reducer;
