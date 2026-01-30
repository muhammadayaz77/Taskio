import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaces: [],
    active: null,
  },
  reducers: {
    setWorkspaces(state, action) {
      state.workspaces = action.payload;
    },
    setActiveWorkspace(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setWorkspaces, setActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
