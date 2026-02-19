import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

 const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }) =>
      updateData(`/tasks/${taskId}/status`, { status }),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
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


export default useUpdateTaskStatus