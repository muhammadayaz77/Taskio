// useCreateWorkspace.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useCreateTask = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data) => postData(`/task/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data) => {
      // Option 1: Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project",data.project] });

      window.toastify(
        data?.message || "Task created successfully",
        "success"
      );
      // navigate(`/workspaces/${data.workspace._id}`)
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Task create failed",
        "error"
      );
    },
  });
};