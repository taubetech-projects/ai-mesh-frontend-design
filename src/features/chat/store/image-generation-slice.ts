import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelProvider, RouteSel } from "@/features/chat/types/models";
import { ImageInput } from "@/features/chat/types/imageModels";

const defaultProviders: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      {
        id: "gpt-image-1-mini",
        name: "GPT-Image-1 mini",
        icon: "icons/openai-64x64.png",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      {
        id: "gemini-2.5-flash-image",
        name: "Gemini 2.5 Flash Image",
        icon: "icons/gemini-64x64.png",
      },
    ],
  },
  {
    id: "bytedance",
    name: "ByteDance",
    models: [
      {
        id: "seedream-4-0-250828",
        name: "Seedream-4.0",
        icon: "icons/ollama-64x64.png",
      },
    ],
  },
];

interface ImageGenerationState {
  providers: ModelProvider[];
  prompt: string;
  showModelSelector: boolean;
  selectedModels: RouteSel[];
  uploadedImages: ImageInput[]; // Array to store base64 image URLs
  isGenerating: boolean;
}

const initialSelectedModels: RouteSel[] = [
  { provider: "openai", model: "gpt-image-1-mini" },
  { provider: "bytedance", model: "seedream-4-0-250828" },
];
const initialState: ImageGenerationState = {
  providers: [...defaultProviders],
  prompt: "",
  showModelSelector: false,
  selectedModels: initialSelectedModels,
  uploadedImages: [],
  isGenerating: false,
};

const imageGenerationSlice = createSlice({
  name: "imageGeneration",
  initialState,
  reducers: {
    toggleModelSelector(state, action: PayloadAction<boolean>) {
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
    setSelectedModels(state, action: PayloadAction<RouteSel[]>) {
      state.selectedModels = action.payload;
    },

    removeModel(state, action) {
      const modelId = action.payload;
      state.selectedModels = state.selectedModels.filter(
        (selectedModel: RouteSel) => selectedModel.model !== modelId
      );
    },

    updatePrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
    addUploadedImage(state, action: PayloadAction<ImageInput>) {
      state.uploadedImages.push(action.payload);
    },
    removeUploadedImage(state, action: PayloadAction<number>) {
      state.uploadedImages.splice(action.payload, 1);
    },
    clearUploadedImages(state) {
      state.uploadedImages = [];
    },
    setIsGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
    },
  },
});

export const {
  toggleModelSelector,
  addModel,
  removeModel,
  setSelectedModels,
  updatePrompt,
  addUploadedImage,
  removeUploadedImage,
  clearUploadedImages,
  setIsGenerating,
} = imageGenerationSlice.actions;
export default imageGenerationSlice.reducer;
