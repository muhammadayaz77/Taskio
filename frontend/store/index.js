import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import workspaceReducer from './auth/workspaceSlice.js'
import projectReducer from './project/projectSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace : workspaceReducer,
    project : projectReducer
  },
});

export default store;
