import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Hash,
  Loader2,
  MessageSquarePlus,
  Plus,
  Search,
  Users2,
  Wifi,
  WifiOff,
} from "lucide-react";
import Loader from "../../components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import useGetWorkspacesById from "../../hooks/workspace/useGetWorkspacesById";
import {
  useConversations,
  useCreateConversation,
  useDeleteMessage,
  useEditMessage,
  useMessages,
  useSendMessage,
} from "../../hooks/chat/useChatApi";
import { useChatSocket } from "../../hooks/chat/useChatSocket";
import { useSocket } from "../../providers/SocketProvider";
import ChatComposer from "../../components/chat/ChatComposer";
import MessageItem from "../../components/chat/MessageItem";

function conversationLabel(c, currentUserId) {
  if (c.type === "channel") return `# ${c.name || "channel"}`;
  const other = c.members?.find(
    (m) => String(m._id) !== String(currentUserId)
  );
  return other?.name || "Direct message";
}

function conversationAvatar(c, currentUserId) {
  if (c.type === "channel") {
    return (
      <Avatar className="size-9 bg-violet-100">
        <AvatarFallback className="bg-violet-100 text-violet-700">
          <Hash className="size-4" />
        </AvatarFallback>
      </Avatar>
    );
  }
  const other = c.members?.find(
    (m) => String(m._id) !== String(currentUserId)
  );
  return (
    <Avatar className="size-9 border border-white shadow">
      {other?.profilePicture ? (
        <AvatarImage src={other.profilePicture} alt="" />
      ) : null}
      <AvatarFallback>
        {other?.name?.charAt(0)?.toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

export default function WorkspaceChat() {
  const { workspaceId } = useParams();
  const currentUser = useSelector((s) => s.auth.user);
  const currentUserId = currentUser?._id;
  const { socket, connected, onlineUserIds, hydrateOnline } = useSocket();

  const { data: workspaceData, isLoading: workspaceLoading } =
    useGetWorkspacesById(workspaceId);

  const myMembership = useMemo(() => {
    const members = workspaceData?.workspace?.members;
    if (!Array.isArray(members) || !currentUserId) return null;
    return members.find(
      (m) => String(m?.user?._id) === String(currentUserId)
    );
  }, [workspaceData, currentUserId]);

  const canChat =
    myMembership &&
    ["owner", "admin", "member"].includes(myMembership.role);
  const canModerate =
    myMembership && ["owner", "admin"].includes(myMembership.role);
  const canCreateChannel = canModerate;

  const { data: conversations = [], isLoading: convLoading } =
    useConversations(workspaceId);

  const [activeConvId, setActiveConvId] = useState(null);
  useEffect(() => {
    if (!activeConvId && conversations.length) {
      setActiveConvId(conversations[0]._id);
    }
  }, [conversations, activeConvId]);

  const activeConv = useMemo(
    () => conversations.find((c) => c._id === activeConvId) || null,
    [conversations, activeConvId]
  );

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: messagesLoading,
  } = useMessages(workspaceId, activeConvId);

  const flatMessages = useMemo(() => {
    if (!messagesData) return [];
    return messagesData.pages.flatMap((p) => p.messages || []);
  }, [messagesData]);

  const { mutateAsync: sendMessage } = useSendMessage(workspaceId);
  const { mutateAsync: editMessage, isPending: editing } =
    useEditMessage(workspaceId);
  const { mutateAsync: deleteMessage, isPending: deleting } =
    useDeleteMessage(workspaceId);
  const { mutateAsync: createConversation, isPending: creatingConv } =
    useCreateConversation(workspaceId);

  const [typingByConv, setTypingByConv] = useState({});
  const handleTypingStart = useCallback((p) => {
    setTypingByConv((prev) => ({
      ...prev,
      [p.conversationId]: { userId: p.userId, name: p.name, at: Date.now() },
    }));
  }, []);
  const handleTypingStop = useCallback((p) => {
    setTypingByConv((prev) => {
      const cur = prev[p.conversationId];
      if (!cur || String(cur.userId) !== String(p.userId)) return prev;
      const next = { ...prev };
      delete next[p.conversationId];
      return next;
    });
  }, []);

  useChatSocket({
    workspaceId,
    onTypingStart: handleTypingStart,
    onTypingStop: handleTypingStop,
    hydrateOnline,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTypingByConv((prev) => {
        const now = Date.now();
        const next = {};
        Object.entries(prev).forEach(([k, v]) => {
          if (now - v.at < 4000) next[k] = v;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const previousLastIdRef = useRef(null);
  useEffect(() => {
    if (!flatMessages.length) return;
    const last = flatMessages[flatMessages.length - 1];
    if (previousLastIdRef.current !== last._id) {
      previousLastIdRef.current = last._id;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [flatMessages]);

  useEffect(() => {
    previousLastIdRef.current = null;
    bottomRef.current?.scrollIntoView();
  }, [activeConvId]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollTop < 80 && hasNextPage && !isFetchingNextPage) {
      const prevHeight = el.scrollHeight;
      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          if (!el) return;
          el.scrollTop = el.scrollHeight - prevHeight;
        });
      });
    }
  }

  function emitTyping(active) {
    if (!socket || !activeConvId) return;
    socket.emit(active ? "typing:start" : "typing:stop", {
      workspaceId,
      conversationId: activeConvId,
    });
  }

  async function handleSend(body) {
    if (!activeConvId) return;
    try {
      await sendMessage({ conversationId: activeConvId, body });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not send message",
        "error"
      );
    }
  }

  async function handleEdit(messageId, body) {
    try {
      await editMessage({ messageId, body });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not edit message",
        "error"
      );
    }
  }

  async function handleDelete(messageId) {
    try {
      await deleteMessage({ messageId });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not delete message",
        "error"
      );
    }
  }

  const [newChannelOpen, setNewChannelOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const [newDmOpen, setNewDmOpen] = useState(false);
  const [newDmTarget, setNewDmTarget] = useState("");
  const dmCandidates = useMemo(() => {
    const members = workspaceData?.workspace?.members || [];
    return members
      .map((m) => m.user)
      .filter((u) => u && String(u._id) !== String(currentUserId));
  }, [workspaceData, currentUserId]);

  async function handleCreateChannel() {
    const name = newChannelName.trim();
    if (!name) return;
    try {
      const res = await createConversation({ type: "channel", name });
      setNewChannelName("");
      setNewChannelOpen(false);
      if (res?.conversation?._id) setActiveConvId(res.conversation._id);
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not create channel",
        "error"
      );
    }
  }

  async function handleStartDm() {
    if (!newDmTarget) return;
    try {
      const res = await createConversation({
        type: "dm",
        memberId: newDmTarget,
      });
      setNewDmTarget("");
      setNewDmOpen(false);
      if (res?.conversation?._id) setActiveConvId(res.conversation._id);
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not start DM",
        "error"
      );
    }
  }

  if (workspaceLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!myMembership) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        You need to be a member of this workspace to chat.
      </div>
    );
  }

  const activeTyping = activeConv ? typingByConv[activeConv._id] : null;

  return (
    <div className="mx-auto -mt-6 flex h-[calc(100vh-5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-violet-200/20 sm:my-0 lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-slate-50/60 lg:w-72 lg:border-b-0 lg:border-r">
        <header className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace chat
            </p>
            <h2 className="truncate text-lg font-bold text-slate-900">
              {workspaceData?.workspace?.name}
            </h2>
          </div>
          <Badge
            variant={connected ? "secondary" : "outline"}
            className={`gap-1 rounded-full ${
              connected
                ? "bg-emerald-100 text-emerald-700"
                : "border-amber-300 text-amber-700"
            }`}
          >
            {connected ? (
              <Wifi className="size-3" />
            ) : (
              <WifiOff className="size-3" />
            )}
            {connected ? "Live" : "Offline"}
          </Badge>
        </header>

        <div className="space-y-1 px-3">
          <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Channels
            {canCreateChannel ? (
              <Dialog open={newChannelOpen} onOpenChange={setNewChannelOpen}>
                <DialogTrigger asChild>
                  <button
                    aria-label="New channel"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <Plus className="size-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create channel</DialogTitle>
                    <DialogDescription>
                      Everyone in the workspace can read and write here.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    autoFocus
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="e.g. design-reviews"
                    className="rounded-xl"
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setNewChannelOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!newChannelName.trim() || creatingConv}
                      onClick={handleCreateChannel}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700"
                    >
                      {creatingConv ? "Creating…" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>

          {convLoading ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
              <Loader2 className="size-3 animate-spin" />
              Loading…
            </div>
          ) : null}

          <ul className="space-y-0.5">
            {conversations
              .filter((c) => c.type === "channel")
              .map((c) => {
                const isActive = c._id === activeConvId;
                return (
                  <li key={c._id}>
                    <button
                      type="button"
                      onClick={() => setActiveConvId(c._id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-violet-100 text-violet-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Hash
                        className={`size-4 ${
                          isActive ? "text-violet-700" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate font-medium">
                        {c.name || "channel"}
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>

          <div className="mt-4 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Direct messages
            <Dialog open={newDmOpen} onOpenChange={setNewDmOpen}>
              <DialogTrigger asChild>
                <button
                  aria-label="New direct message"
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <MessageSquarePlus className="size-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Start a direct message</DialogTitle>
                  <DialogDescription>
                    Pick a teammate to message privately.
                  </DialogDescription>
                </DialogHeader>
                <Select
                  value={newDmTarget}
                  onValueChange={setNewDmTarget}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose a teammate" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {dmCandidates.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-500">
                        No other members yet
                      </div>
                    ) : null}
                    {dmCandidates.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}{" "}
                        <span className="text-xs text-slate-500">
                          ({u.email})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setNewDmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!newDmTarget || creatingConv}
                    onClick={handleStartDm}
                    className="rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    {creatingConv ? "Opening…" : "Start chat"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ul className="space-y-0.5 pb-4">
            {conversations
              .filter((c) => c.type === "dm")
              .map((c) => {
                const other = c.members?.find(
                  (m) => String(m._id) !== String(currentUserId)
                );
                const isActive = c._id === activeConvId;
                const online =
                  other && onlineUserIds?.has?.(String(other._id));
                return (
                  <li key={c._id}>
                    <button
                      type="button"
                      onClick={() => setActiveConvId(c._id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-violet-100 text-violet-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="relative">
                        <Avatar className="size-7">
                          {other?.profilePicture ? (
                            <AvatarImage src={other.profilePicture} alt="" />
                          ) : null}
                          <AvatarFallback className="text-[10px]">
                            {other?.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 inline-block size-2.5 rounded-full ring-2 ring-white ${
                            online ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                      </span>
                      <span className="truncate font-medium">
                        {other?.name || "Direct message"}
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {activeConv?.type === "channel" ? (
                <Hash className="size-4" />
              ) : (
                <Users2 className="size-4" />
              )}
              <span className="font-medium capitalize">
                {activeConv?.type || "channel"}
              </span>
            </div>
            <h3 className="truncate text-lg font-bold text-slate-900">
              {activeConv
                ? conversationLabel(activeConv, currentUserId)
                : "Select a conversation"}
            </h3>
          </div>
          {activeConv ? (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {activeConv.type === "channel"
                ? `${workspaceData?.workspace?.members?.length || 0} members`
                : null}
            </div>
          ) : null}
        </header>

        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white py-4"
        >
          {!activeConvId ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Pick a channel or DM to start chatting.
            </div>
          ) : messagesLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-violet-600" />
            </div>
          ) : flatMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
              <Search className="size-6 text-slate-300" />
              No messages yet — say hi to your team.
            </div>
          ) : (
            <>
              {hasNextPage ? (
                <div className="flex justify-center py-2 text-xs text-slate-400">
                  {isFetchingNextPage ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-3 animate-spin" />
                      Loading older…
                    </span>
                  ) : (
                    "Scroll up for older messages"
                  )}
                </div>
              ) : null}
              {flatMessages.map((m) => (
                <MessageItem
                  key={m._id}
                  message={m}
                  isOwn={String(m.sender?._id) === String(currentUserId)}
                  canModerate={canModerate}
                  onEdit={(body) => handleEdit(m._id, body)}
                  onDelete={() => handleDelete(m._id)}
                  pendingEdit={editing}
                  pendingDelete={deleting}
                />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="px-4 py-1 text-xs text-slate-500">
          {activeTyping &&
          String(activeTyping.userId) !== String(currentUserId) ? (
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 animate-pulse rounded-full bg-violet-500" />
              {activeTyping.name} is typing…
            </span>
          ) : (
            "\u00A0"
          )}
        </div>

        {activeConvId ? (
          <ChatComposer
            disabled={!canChat}
            onSend={handleSend}
            onTyping={emitTyping}
            placeholder={
              !canChat
                ? "Viewers cannot send messages"
                : `Message ${
                    activeConv
                      ? conversationLabel(activeConv, currentUserId)
                      : ""
                  }`
            }
          />
        ) : null}
      </section>
    </div>
  );
}
