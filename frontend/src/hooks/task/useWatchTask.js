import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "../../api/axios";

 const useWatchTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }) =>
      postData(`/tasks/${taskId}/watch`, {}),

    onSuccess: (response, variables) => {
      console.log("variables : ",variables.taskId);
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });
    },

    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Watchers update failed",
        "error"
      );
    },
  });
};


export default useWatchTask