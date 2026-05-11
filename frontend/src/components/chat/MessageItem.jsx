import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

function timeFor(iso) {
  if (!iso) return "";
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

export default function MessageItem({
  message,
  isOwn,
  canModerate,
  onEdit,
  onDelete,
  pendingEdit,
  pendingDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);
  const textareaRef = useRef(null);

  useEffect(() => {
    setDraft(message.body);
  }, [message.body]);

  useEffect(() => {
    if (!editing) return;
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [editing]);

  const sender = message.sender || {};
  const canEdit = isOwn && !message.isDeleted;
  const canDelete = (isOwn || canModerate) && !message.isDeleted;

  async function commitEdit() {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === message.body) {
      setEditing(false);
      return;
    }
    await onEdit?.(trimmed);
    setEditing(false);
  }

  return (
    <div
      className={`group flex gap-3 px-4 py-2 ${
        isOwn ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar className="size-9 shrink-0 border border-white shadow-sm">
        {sender.profilePicture ? (
          <AvatarImage src={sender.profilePicture} alt="" />
        ) : null}
        <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-700">
          {sender.name?.charAt(0)?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex max-w-[78%] flex-col gap-1 ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex items-center gap-2 text-xs text-slate-500 ${
            isOwn ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-semibold text-slate-700">
            {isOwn ? "You" : sender.name}
          </span>
          <span>{timeFor(message.createdAt)}</span>
          {message.editedAt && !message.isDeleted ? (
            <span className="italic">edited</span>
          ) : null}
        </div>

        <div className={`relative flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              message.isDeleted
                ? "bg-slate-100 italic text-slate-400"
                : isOwn
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-800 ring-1 ring-slate-100"
            }`}
          >
            {message.isDeleted ? (
              "This message was deleted"
            ) : editing ? (
              <div className="flex w-full flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    const ta = textareaRef.current;
                    if (ta) {
                      ta.style.height = "0px";
                      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      commitEdit();
                    }
                    if (e.key === "Escape") {
                      setEditing(false);
                      setDraft(message.body);
                    }
                  }}
                  className="min-h-[40px] w-full resize-none rounded-xl border border-violet-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-200"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing(false);
                      setDraft(message.body);
                    }}
                    className="rounded-xl"
                  >
                    <X className="mr-1 size-3.5" /> Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={pendingEdit || !draft.trim()}
                    onClick={commitEdit}
                    className="rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    <Check className="mr-1 size-3.5" />
                    {pendingEdit ? "Saving…" : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">
                {message.body}
              </p>
            )}
          </div>

          {!editing && !message.isDeleted && (canEdit || canDelete) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="invisible inline-flex size-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 group-hover:visible focus:visible focus:outline-none"
                  aria-label="Message actions"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isOwn ? "end" : "start"}
                className="w-40 rounded-xl"
              >
                {canEdit ? (
                  <DropdownMenuItem
                    onClick={() => setEditing(true)}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </DropdownMenuItem>
                ) : null}
                {canDelete ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer text-red-600 focus:text-red-700"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete message?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the message as deleted for everyone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-xl bg-red-600 hover:bg-red-700"
                          onClick={onDelete}
                          disabled={pendingDelete}
                        >
                          {pendingDelete ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  );
}
