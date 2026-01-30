import { createSlice } from "@reduxjs/toolkit";
import { queryClient } from '../../src/main.jsx';

const initialState = {
  workSpaces: null,
  isLoading: true, // ✅ start as true to prevent early navigation
};

const authSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    getWorkSpaces: (state, action) => {
      state.workSpaces = action.payload.workSpaces;
      state.isLoading = false;
    },

    getWorkSpaces: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },

    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

// export const { loginSuccess, logout, restoreAuth, setIsLoading, setIsAuthenticated } = authSlice.actions;
// export default authSlice.reducer;
