import { createSlice } from "@reduxjs/toolkit";

const currentFileSlice = createSlice({
  name: "current_file",
  initialState: { value: "" },
  reducers: {
    setCurrentFile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentFile } = currentFileSlice.actions;
export default currentFileSlice.reducer;
