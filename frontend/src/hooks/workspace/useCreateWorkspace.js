// useCreateWorkspace.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { setWorkspaces } from "../../../store/auth/workspaceSlice";

export const useCreateWorkspace = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => postData("/workspaces", data),
    onSuccess: (data) => {
      // Option 1: Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // Option 2: Optimistically update cache (faster UI update)
      queryClient.setQueryData(["workspaces"], (old) => {
        const newWorkspaces = [...(old || []), data.workspace];
        dispatch(setWorkspaces(newWorkspaces)); // Keep Redux in sync
        return newWorkspaces;
      });

      window.toastify(
        data?.message || "Workspace created successfully",
        "success"
      );
      // navigate(`/workspaces/${data.workspace._id}`)
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Workspace create failed",
        "error"
      );
    },
  });
};