import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
}

const initialState: ToastState = {
  message: "",
  type: "info",
  isVisible: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: ToastState["type"] }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = "";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
