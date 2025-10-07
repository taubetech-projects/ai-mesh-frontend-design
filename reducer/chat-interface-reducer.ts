import {
  ADD_MESSAGES,
  ADD_MODEL,
  CONCAT_DELTA,
  REMOVE_MODEL,
  TOGGLE_MODEL_SELECTOR,
  UPDATE_INPUT,
  TOGGLE_PLAYGROUND_SETTINGS,
} from "./constants";

export function chatInterfaceReducer(state: any, action: any) {
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
    case CONCAT_DELTA: {
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
    case "START_STREAM": {
      const { isStreaming } = action.payload;
      return { ...state, isStreaming: isStreaming };
    }
    case "END_STREAM": {
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
