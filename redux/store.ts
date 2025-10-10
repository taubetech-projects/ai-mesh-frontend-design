import { configureStore } from "@reduxjs/toolkit";
import chatInterfaceSlice from "./chat-interface-slice";

const store = configureStore({
  reducer: {
    chatInterface: chatInterfaceSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
