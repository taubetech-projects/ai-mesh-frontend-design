import { configureStore } from '@reduxjs/toolkit';
import chatInterfaceReducer from './chat-interface-slice';
import conversationSliceReducer from './conversation-slice';
import uiReducer from './ui-slice'; // Import the new reducer
import imageGenerationReducer from './image-generation-slice'; // Import the image generation reducer

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceReducer,
    conversationSlice: conversationSliceReducer,
    ui: uiReducer, // Add the new reducer
    imageGeneration: imageGenerationReducer, // Add the image generation reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;