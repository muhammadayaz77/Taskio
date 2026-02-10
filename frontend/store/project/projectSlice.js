import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  selectedProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = action.payload;
    },

    addProject(state, action) {
      state.projects.push(action.payload);
    },

    updateProject(state, action) {
      state.projects = state.projects.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );
    },

    deleteProject(state, action) {
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload
      );
    },

    selectProject(state, action) {
      state.selectedProject = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  selectProject,
} = projectSlice.actions;

export default projectSlice.reducer;
