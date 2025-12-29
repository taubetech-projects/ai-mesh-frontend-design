import { createSlice } from "@reduxjs/toolkit";

interface ConversationState {
  selectedConvId: number | null;
}

const initialState: ConversationState = {
  selectedConvId: null,
};

const conversationSlice = createSlice({
  name: "conversationSlice",
  initialState: initialState,
  reducers: {
    setSelectedConvId(state, action) {
      state.selectedConvId = action.payload;
    },
  },
});

export const { setSelectedConvId } = conversationSlice.actions;
export default conversationSlice.reducer;
