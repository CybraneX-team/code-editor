import { createSlice } from "@reduxjs/toolkit";

const projectNameSlice = createSlice({
  name: "project name",
  initialState: {
    value: "",
  },
  reducers: {
    setName: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setName } = projectNameSlice.actions;
export default projectNameSlice.reducer;
