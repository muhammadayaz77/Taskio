import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api, { deleteData, patchData, postData } from "../../api/axios";

export function useConversations(workspaceId) {
  return useQuery({
    queryKey: ["chat", workspaceId, "conversations"],
    queryFn: async () => {
      const res = await api.get(
        `/workspaces/${workspaceId}/chat/conversations`
      );
      return res.data.conversations;
    },
    enabled: Boolean(workspaceId),
    staleTime: 30 * 1000,
  });
}

export function useMessages(workspaceId, conversationId) {
  return useInfiniteQuery({
    queryKey: ["chat", workspaceId, "messages", conversationId],
    enabled: Boolean(workspaceId && conversationId),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const res = await api.get(
        `/workspaces/${workspaceId}/chat/messages`,
        {
          params: {
            conversationId,
            ...(pageParam ? { before: pageParam } : {}),
            limit: 30,
          },
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasMore) return undefined;
      const first = lastPage.messages?.[0];
      return first?.createdAt;
    },
  });
}

export function useSendMessage(workspaceId) {
  return useMutation({
    mutationFn: ({ conversationId, body }) =>
      postData(`/workspaces/${workspaceId}/chat/messages`, {
        conversationId,
        body,
      }),
  });
}

export function useEditMessage(workspaceId) {
  return useMutation({
    mutationFn: ({ messageId, body }) =>
      patchData(`/workspaces/${workspaceId}/chat/messages/${messageId}`, {
        body,
      }),
  });
}

export function useDeleteMessage(workspaceId) {
  return useMutation({
    mutationFn: ({ messageId }) =>
      deleteData(`/workspaces/${workspaceId}/chat/messages/${messageId}`),
  });
}

export function useCreateConversation(workspaceId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      postData(`/workspaces/${workspaceId}/chat/conversations`, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["chat", workspaceId, "conversations"],
      });
    },
  });
}
