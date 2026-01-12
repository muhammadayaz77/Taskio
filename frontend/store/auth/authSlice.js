import { createSlice } from "@reduxjs/toolkit";
import queryClient from '../../src/main.jsx'

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
      queryClient.clear()
    },

    restoreAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setIsLoading : (state,action) => {
      console.log('action setisloading',action.payload)
      state.isLoading = action.payload;
    },
    setIsAuthenticated : (state,action) => {
      console.log('action setisloading',action.payload)
      state.isAuthenticated = action.payload;
    },
  },
});

export const { loginSuccess, logout, restoreAuth,setIsLoading,setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
