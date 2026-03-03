import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "../../api/axios";

 const useWatchTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }) =>
      postData(`/tasks/${taskId}/watch`, {}),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

      window.toastify(
        response?.message || "Watchers updated successfully",
        "success"
      );
    },

    onError: (err) => {
      console.log("task id : ",taskId)
      window.toastify(
        err?.response?.data?.message || "Watchers update failed",
        "error"
      );
    },
  });
};


export default useWatchTask