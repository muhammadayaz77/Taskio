import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../api/axios";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskData }) =>
      postData(`/tasks/${projectId}/create-task`, taskData),

    // Optimistic Update: Immediately insert new task into local cache for 0ms UI latency
    onMutate: async ({ projectId, taskData }) => {
      if (!projectId) return { previousData: null };

      const queryKey = ["project", projectId];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);

      if (previousData) {
        const tempTask = {
          _id: `temp-${Date.now()}`,
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status || "To Do",
          priority: taskData.priority || "Medium",
          dueDate: taskData.dueDate || null,
          assignees: taskData.assignees || [],
          project: projectId,
          isArchived: false,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueryData(queryKey, {
          ...previousData,
          tasks: [tempTask, ...(previousData.tasks || [])],
        });
      }

      return { previousData, queryKey };
    },

    // Rollback optimistic state if server returns error
    onError: (err, _variables, context) => {
      if (context?.queryKey && context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      window.toastify?.(
        err?.response?.data?.message || "Task creation failed",
        "error"
      );
    },

    // Replace optimistic task with actual backend task & invalidate queries
    onSuccess: (data, variables) => {
      const targetProjectId = variables?.projectId || data?.newTask?.project;

      if (targetProjectId) {
        const queryKey = ["project", targetProjectId];
        const currentData = queryClient.getQueryData(queryKey);

        if (currentData && data?.newTask) {
          const updatedTasks = (currentData.tasks || []).map((t) =>
            typeof t._id === "string" && t._id.startsWith("temp-") ? data.newTask : t
          );
          const exists = updatedTasks.some((t) => t._id === data.newTask._id);
          const finalTasks = exists ? updatedTasks : [data.newTask, ...(currentData.tasks || [])];

          queryClient.setQueryData(queryKey, {
            ...currentData,
            tasks: finalTasks,
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["project", targetProjectId],
          refetchType: "all",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-stats"] });

      window.toastify?.(
        data?.message || "Task created successfully",
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