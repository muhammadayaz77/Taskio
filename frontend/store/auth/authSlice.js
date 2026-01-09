import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    
  },
});

export const { loginSuccess, logout, restoreAuth,setIsLoading,setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
