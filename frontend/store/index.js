import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import workspaceReducer from './auth/workspaceSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace : workspaceReducer
  },
});

export default store;
