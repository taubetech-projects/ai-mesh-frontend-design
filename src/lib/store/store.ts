import { configureStore } from "@reduxjs/toolkit";
import chatInterfaceReducer from "@/features/chat/store/chat-interface-slice";
import conversationSliceReducer from "@/features/conversation/store/conversation-slice";
import uiReducer from "@/features/chat/store/ui-slice"; // Import the new reducer
import imageGenerationReducer from "@/features/chat/store/image-generation-slice"; // Import the image generation reducer
import toastSlice from "@/shared/hooks/toast-slice";

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceReducer,
    conversationSlice: conversationSliceReducer,
    ui: uiReducer, // Add the new reducer
    imageGeneration: imageGenerationReducer, // Add the image generation reducer
    toast: toastSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
