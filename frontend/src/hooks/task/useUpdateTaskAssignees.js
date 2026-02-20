import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

 const useUpdateTaskAssignees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, assignees }) =>
      updateData(`/tasks/${taskId}/assignees`, { assignees }),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });

      window.toastify(
        response?.message || "Assignees updated successfully",
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


export default useUpdateTaskAssignees