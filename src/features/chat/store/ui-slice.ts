import { CONVERSATION_TYPES } from "@/shared/constants/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InterfaceType = CONVERSATION_TYPES.CHAT | CONVERSATION_TYPES.IMAGE;

interface UiState {
  activeInterface: InterfaceType;
}

const initialState: UiState = {
  activeInterface: CONVERSATION_TYPES.CHAT,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveInterface: (state, action: PayloadAction<InterfaceType>) => {
      state.activeInterface = action.payload;
      console.log("Active interface set to:", action.payload);
    },
  },
});

export const { setActiveInterface } = uiSlice.actions;
export default uiSlice.reducer;
