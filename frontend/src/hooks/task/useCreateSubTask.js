// useCreateSubTask.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../api/axios";

export const useCreateSubTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn accepts an object: { taskId, title }
    mutationFn: ({ taskId, title }) =>
      postData(`/tasks/${taskId}/add-subtask`, { title }),

    onSuccess: (response, variables) => {
      // Invalidate query for this task to refetch updated subtasks
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });

      window.toastify(
        response?.message || "Sub Task created successfully",
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
