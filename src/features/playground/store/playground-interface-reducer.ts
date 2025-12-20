import {
  AIModel,
  Message,
  ModelProvider,
  RouteSel,
} from "@/features/chat/types/models";
import {
  ADD_MESSAGES,
  ADD_MODEL,
  CONCAT_TEXT_DELTA,
  END_STREAM,
  REMOVE_MODEL,
  START_STREAM,
  TOGGLE_MODEL_SELECTOR,
  TOGGLE_PLAYGROUND_SETTINGS,
  UPDATE_INPUT,
  CONCAT_JSON,
  CONCAT_JSON2,
} from "../../../shared/constants/store-constants";

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
};

export function playgroundInterfaceReducer(
  state: ChatInterfaceState = initialState,
  action: any
) {
  switch (action.type) {
    case TOGGLE_MODEL_SELECTOR:
      const { showModelSelector } = action.payload;
      return { ...state, showModelSelector: showModelSelector };
    case ADD_MODEL: {
      const { provider, model } = action.payload;
      // Prevent duplicates based on model id
      if (state.selectedModels.some((sel: any) => sel.model === model)) {
        return state; // No change
      }
      return {
        ...state,
        selectedModels: [...state.selectedModels, { provider, model }],
      };
    }
    case REMOVE_MODEL: {
      const { modelId } = action.payload;
      return {
        ...state,
        selectedModels: state.selectedModels.filter(
          (sel: any) => sel.model !== modelId
        ),
      };
    }
    case UPDATE_INPUT: {
      const { inputMessage } = action.payload;
      return { ...state, inputMessage: inputMessage };
    }
    case ADD_MESSAGES: {
      const { inputMessage } = action.payload;
      const newMessages = { ...state.messages };
      for (const selectedModel of state.selectedModels) {
        const modelId = selectedModel.model;
        const existingMessages = newMessages[modelId] || [];
        newMessages[modelId] = [
          ...existingMessages,
          { role: "user", content: inputMessage },
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
      return { ...state, messages: newMessages };
    }
    case CONCAT_JSON: {
      const { modelId, content } = action.payload;
      // console.log("CONCAT_JSON", modelId, content);
      // console.log("JSON Message State", content);
      const newMessages = { ...state.jsonMessages };
      const modelMessages = newMessages[modelId] || [];
      newMessages[modelId] = [
        ...modelMessages,
        { role: "assistant", content: content },
      ];
      console.log("newMessages json", newMessages);
      return { ...state, jsonMessages: newMessages };
    }

    case CONCAT_JSON2: {
      const { content } = action.payload;
      // console.log("CONCAT_JSON", modelId, content);
      // console.log("JSON Message State", content);
      const newMessages = { ...state.jsonMessages };

      for (const selectedModel of state.selectedModels) {
        const modelId = selectedModel.model;
        // const modelMessages = newMessages[modelId] || [];
        // newMessages[modelId] = [
        //   ...modelMessages,
        //   { content: content },
        // ];
        const existingMessages = newMessages[modelId] || [];
        // const newMessages = { ...state.jsonMessages };
        newMessages[modelId] = [
          ...existingMessages,
          { role: "user", content: content },
        ];
      }
      // console.log("newMessages json", newMessages);
      return { ...state, jsonMessages: newMessages };
    }
    case CONCAT_TEXT_DELTA: {
      const { modelId, content } = action.payload;
      const newMessages = { ...state.messages };
      const modelMessages = newMessages[modelId] || [];
      if (modelMessages.length === 0) return state; // Should not happen

      const updatedMessages = [...modelMessages];
      const lastMessage = updatedMessages[updatedMessages.length - 1];

      // Append the new content chunk to the last message
      lastMessage.content += content;
      // console.log("lastMessage", lastMessage.content, contentChunk);

      if (lastMessage.role !== "assistant") return state; // No change if last message is not from assistant
      newMessages[modelId] = updatedMessages;
      return { ...state, messages: newMessages };
    }
    case START_STREAM: {
      const { isStreaming } = action.payload;
      return { ...state, isStreaming: isStreaming };
    }
    case END_STREAM: {
      const { isStreaming } = action.payload;
      return { ...state, isStreaming: isStreaming };
    }
    case TOGGLE_PLAYGROUND_SETTINGS: {
      const { showPlaygroundSettings } = action.payload;
      return { ...state, showPlaygroundSettings: showPlaygroundSettings };
    }
    default:
      return state;
  }
}

export function updateInputMessage(inputMessage: string) {
  return { type: UPDATE_INPUT, payload: { inputMessage: inputMessage } };
}

export function toggleModelSelector(show: boolean) {
  return { type: TOGGLE_MODEL_SELECTOR, payload: { showModelSelector: show } };
}

export function addMessages(inputMessage: string) {
  return { type: ADD_MESSAGES, payload: { inputMessage: inputMessage } };
}

export function startStreaming() {
  return { type: START_STREAM, payload: { isStreaming: true } };
}

export function endStreaming() {
  return { type: END_STREAM, payload: { isStreaming: false } };
}

export function concateDelta(modelId: string, content: string) {
  return {
    type: CONCAT_TEXT_DELTA,
    payload: { modelId: modelId, content: content },
  };
}

export function addModel(provider: string, model: string) {
  return { type: ADD_MODEL, payload: { provider: provider, model: model } };
}

export function removeModel(modelId: string) {
  return { type: REMOVE_MODEL, payload: { modelId: modelId } };
}
