import { configureStore } from "@reduxjs/toolkit";
import FileContentReducer from "./slices/fileSlice";
import CurrentFileReducer from "./slices/currentFileSlice";
import FileStructureReducer from "./slices/structureSlice";
import ProjectNameReducer from "./slices/projectname";

export const makeStore = () => {
  return configureStore({
    reducer: {
      fileContent: FileContentReducer,
      currentFile: CurrentFileReducer,
      fileStructure: FileStructureReducer,
      projectName: ProjectNameReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
