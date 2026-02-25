import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

 const useUpdateSubTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId,subTaskId, completed }) =>
      updateData(`/tasks/${taskId}/update-subtask/${subTaskId}`, { completed }),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

      window.toastify(
        response?.message || "Sub task updated successfully",
        "success"
      );
    },

    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Sub task update failed",
        "error"
      );
    },
  });
};


export default useUpdateSubTask