import { configureStore } from "@reduxjs/toolkit";
import chatInterfaceSlice from "./chat-interface-slice";
import playgroundInterfaceSlice from "./playground-interface-slice";

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceSlice,
    playgroundInterface: playgroundInterfaceSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
