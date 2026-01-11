import { configureStore } from "@reduxjs/toolkit";
import chatInterfaceReducer from "@/features/chat/store/chat-interface-slice";
import conversationSliceReducer from "@/features/chat/conversation/store/conversation-slice";
import uiReducer from "@/features/chat/store/ui-slice"; // Import the new reducer
import imageGenerationReducer from "@/features/chat/store/image-generation-slice"; // Import the image generation reducer
import toastSlice from "@/shared/hooks/toast-slice";
import teamReducer from "@/features/platform/lib/teamSlice";

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceReducer,
    conversationSlice: conversationSliceReducer,
    ui: uiReducer, // Add the new reducer
    imageGeneration: imageGenerationReducer, // Add the image generation reducer
    toast: toastSlice,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
