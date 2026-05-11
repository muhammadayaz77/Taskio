import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../providers/SocketProvider";

/**
 * Subscribes to chat-related socket events for a workspace.
 * - Joins/leaves `workspace:<id>` room when the page mounts/unmounts.
 * - Merges incoming messages into the React Query infinite cache.
 * - Triggers the `onTyping` callback for typing indicators.
 *
 * @param {{
 *   workspaceId: string,
 *   onTypingStart?: (p: { conversationId: string, userId: string, name: string }) => void,
 *   onTypingStop?:  (p: { conversationId: string, userId: string }) => void,
 *   hydrateOnline?: (ids: string[]) => void,
 * }} opts
 */
export function useChatSocket({
  workspaceId,
  onTypingStart,
  onTypingStop,
  hydrateOnline,
}) {
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();
  const onTypingStartRef = useRef(onTypingStart);
  const onTypingStopRef = useRef(onTypingStop);
  const hydrateOnlineRef = useRef(hydrateOnline);

  useEffect(() => {
    onTypingStartRef.current = onTypingStart;
    onTypingStopRef.current = onTypingStop;
    hydrateOnlineRef.current = hydrateOnline;
  }, [onTypingStart, onTypingStop, hydrateOnline]);

  useEffect(() => {
    if (!socket || !connected || !workspaceId) return;

    socket.emit("workspace:join", workspaceId, (ack) => {
      if (ack?.ok && Array.isArray(ack.onlineUserIds)) {
        hydrateOnlineRef.current?.(ack.onlineUserIds);
      }
    });

    const handleNew = (message) => {
      const key = [
        "chat",
        workspaceId,
        "messages",
        message.conversation,
      ];
      queryClient.setQueryData(key, (data) => {
        if (!data) return data;
        const pages = [...data.pages];
        if (pages.length === 0) return data;
        // pages[0] holds the newest batch — append new live messages there.
        const head = pages[0];
        const exists = pages.some((p) =>
          p.messages?.some((m) => m._id === message._id)
        );
        if (exists) return data;
        pages[0] = {
          ...head,
          messages: [...(head.messages || []), message],
        };
        return { ...data, pages };
      });

      queryClient.setQueryData(
        ["chat", workspaceId, "conversations"],
        (list) => {
          if (!Array.isArray(list)) return list;
          return list
            .map((c) =>
              c._id === message.conversation
                ? {
                    ...c,
                    lastMessageAt: message.createdAt,
                    lastMessagePreview:
                      message.body?.slice(0, 140) || "",
                  }
                : c
            )
            .sort((a, b) => {
              if (a.isDefault && !b.isDefault) return -1;
              if (!a.isDefault && b.isDefault) return 1;
              return (
                new Date(b.lastMessageAt).valueOf() -
                new Date(a.lastMessageAt).valueOf()
              );
            });
        }
      );
    };

    const handleUpdated = (message) => {
      queryClient.setQueryData(
        ["chat", workspaceId, "messages", message.conversation],
        (data) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m._id === message._id ? message : m
              ),
            })),
          };
        }
      );
    };

    const handleConversationNew = () => {
      queryClient.invalidateQueries({
        queryKey: ["chat", workspaceId, "conversations"],
      });
    };

    const handleTypingStart = (payload) =>
      onTypingStartRef.current?.(payload);
    const handleTypingStop = (payload) =>
      onTypingStopRef.current?.(payload);

    socket.on("message:new", handleNew);
    socket.on("message:updated", handleUpdated);
    socket.on("conversation:new", handleConversationNew);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.emit("workspace:leave", workspaceId);
      socket.off("message:new", handleNew);
      socket.off("message:updated", handleUpdated);
      socket.off("conversation:new", handleConversationNew);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, connected, workspaceId, queryClient]);
}
