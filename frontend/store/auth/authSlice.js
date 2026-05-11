import { createSlice } from "@reduxjs/toolkit";
import { queryClient } from '../../src/main.jsx';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // ✅ start as true to prevent early navigation
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
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

    updateUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginSuccess, logout, restoreAuth, setIsLoading, setIsAuthenticated, updateUser } = authSlice.actions;
export default authSlice.reducer;
