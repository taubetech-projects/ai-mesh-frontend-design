export const UPDATE_SYSTEM_PROMPT = "UPDATE_SYSTEM_PROMPT";
export const UPDATE_TEMPERATURE = "UPDATE_TEMPERATURE";
export const UPDATE_MAX_TOKENS = "UPDATE_MAX_TOKENS";
export const UPDATE_INPUT_FORMAT = "UPDATE_INPUT_FORMAT";
export const UPDATE_OUTPUT_FORMAT = "UPDATE_OUTPUT_FORMAT";
export const UPDATE_REASONING_EFFORT = "UPDATE_REASONING_EFFORT";
export const IS_STREAMING = "IS_STREAMING";
export const UPDATE_PROVIDER_SPECIFIC = "UPDATE_PROVIDER_SPECIFIC";


export const initialPlaygroundState = {
    systemPrompt: "You are a helpful assistant.",
    temperature: "0.7",
    maxTokens: "4096",
    inputFormat: "text",
    outputFormat: "text",
    reasoningEffort: "auto",
    isStreaming: false,
    providerSpecific: false,
};

export function playgroundReducer(state: typeof initialPlaygroundState, action: any) {
    switch (action.type) {
        case UPDATE_SYSTEM_PROMPT:
            return { ...state, systemPrompt: action.payload };
        case UPDATE_TEMPERATURE:
            return { ...state, temperature: action.payload };
        case UPDATE_MAX_TOKENS:
            return { ...state, maxTokens: action.payload };
        case UPDATE_INPUT_FORMAT:
            return { ...state, inputFormat: action.payload };
        case UPDATE_OUTPUT_FORMAT:
            return { ...state, outputFormat: action.payload };
        case UPDATE_REASONING_EFFORT:
            return { ...state, reasoningEffort: action.payload };
        case IS_STREAMING:
            return { ...state, isStreaming: action.payload };
        case UPDATE_PROVIDER_SPECIFIC:
            return { ...state, providerSpecific: action.payload };
        default:
            return state;
    }
}