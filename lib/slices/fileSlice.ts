import { createSlice } from "@reduxjs/toolkit";
import { File } from "../types";

const initialState: File[] = [];

const fileContentSlice = createSlice({
  name: "file_content",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newFile = action.payload as File;
      state.push(newFile);
    },
    removeItem: (state, action) => {
      const index = action.payload as number;
      state.splice(index, 1);
    },
    updateItem: (state, action) => {
      const { index, updatedItem } = action.payload as {
        index: number;
        updatedItem: File;
      };
      state[index] = updatedItem;
    },
  },
});

export const { addItem, removeItem, updateItem } = fileContentSlice.actions;
export default fileContentSlice.reducer;
