import { createSlice } from "@reduxjs/toolkit";
import { FileItem } from "../types";

const initialState: FileItem[] = [];

const structureSlice = createSlice({
  name: "file_structure",
  initialState,
  reducers: {
    setStructure: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setStructure } = structureSlice.actions;
export default structureSlice.reducer;
