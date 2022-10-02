import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: "" };

export const selectedTodaySlice = createSlice({
  name: "selectedToday",
  initialState,
  reducers: {
    setDateToday(state) {
      state.value = new Date();
    },
  },
});

export const { setDateToday } = selectedTodaySlice.actions;

export default selectedTodaySlice.reducer;
