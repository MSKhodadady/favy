import { createSlice } from "@reduxjs/toolkit";

export type AlertType = "info" | "success" | "warning" | "error";

interface AlertState {
  text: string;
  show: boolean;
  type: AlertType;
}

const init: AlertState = {
  show: false,
  text: "",
  type: "error",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState: init,
  reducers: {
    hideAlert(s) {
      return {
        ...s,
        show: false,
      };
    },

    showAlert(
      _,
      action: { type: string; payload: { text: string; type?: AlertType } }
    ) {
      return {
        show: true,
        text: action.payload.text,
        type: action.payload.type ?? "error",
      };
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
