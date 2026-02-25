import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

 const useUpdateTaskDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, description }) =>
      updateData(`/tasks/${taskId}/description`, { description }),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

      window.toastify(
        response?.message || "Title updated successfully",
        "success"
      );
    },

    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Title update failed",
        "error"
      );
    },
  });
};


export default useUpdateTaskDescription