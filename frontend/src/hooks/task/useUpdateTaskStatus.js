import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateData } from "../../api/axios";

/**
 * Optimistic task status update.
 * Pass `projectId` so the project cache is patched immediately,
 * then rolled back on error and refetched on settle.
 */
const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }) =>
      updateData(`/tasks/${taskId}/status`, { status }),

    onMutate: async ({ taskId, status, projectId }) => {
      if (!projectId) return { previous: null };

      const queryKey = ["project", projectId];
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData(queryKey);

      if (previous?.tasks) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          tasks: previous.tasks.map((t) =>
            t._id === taskId ? { ...t, status } : t
          ),
        });
      }

      return { previous, queryKey };
    },

    onError: (err, _variables, context) => {
      if (context?.previous && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
      window.toastify?.(
        err?.response?.data?.message || "Status update failed",
        "error"
      );
    },

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });
      window.toastify?.(
        response?.message || "Status updated",
        "success"
      );
    },

    onSettled: (_data, _err, variables) => {
      if (variables?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project", variables.projectId],
        });
      }
    },
  });
};

export default useUpdateTaskStatus;
