// useCreateSubTask.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../api/axios";

export const useCreateSubTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn accepts an object: { taskId, title }
    mutationFn: ({ taskId, text }) =>
      postData(`/tasks/${taskId}/add-comment`, { text }),

    onSuccess: (response, variables) => {
      // Invalidate query for this task to refetch updated subtasks
      
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.task],
      });
        queryClient.invalidateQueries({
          queryKey: ["task-activity", variables.task],
        });
      window.toastify(
        response?.message || "Comment added successfully",
        "success"
      );
    },

    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Sub Task creation failed",
        "error"
      );
    },
  });
};
