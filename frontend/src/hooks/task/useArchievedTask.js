import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

 const useArchievedTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }) =>
      updateData(`/tasks/${taskId}/title`, {}),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

      window.toastify(
        response?.message || "Task updated successfully",
        "success"
      );
    },

    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Task update failed",
        "error"
      );
    },
  });
};


export default useArchievedTask