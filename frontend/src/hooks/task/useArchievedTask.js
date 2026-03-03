import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "../../api/axios";

 const useArchievedTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }) =>
      postData(`/tasks/${taskId}/archive`, {}),

    onSuccess: (response, variables) => {
      // ✅ invalidate correct task
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

    },

    onError: (err) => {
      console.log("task id : ",taskId)

      window.toastify(
        err?.response?.data?.message || "Archive update failed",   
        "error"
      );
    },
  });
};


export default useArchievedTask