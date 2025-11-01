import { configureStore } from "@reduxjs/toolkit";
import chatInterfaceSlice from "./chat-interface-slice";
import playgroundInterfaceSlice from "./playground-interface-slice";
import conversationSlice from "./conversation-slice";

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceSlice,
    playgroundInterface: playgroundInterfaceSlice,
    conversationSlice: conversationSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
