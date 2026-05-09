import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  CalendarDays,
  GripVertical,
  MessageSquare,
  Paperclip,
  ListChecks,
} from "lucide-react";

const PRIORITY_BAR = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-400",
};

const PRIORITY_BADGE = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-800 ring-amber-200",
  Low: "bg-slate-50 text-slate-700 ring-slate-200",
};

function shortKey(id) {
  if (!id) return "";
  return `T-${String(id).slice(-4).toUpperCase()}`;
}

function formatDue(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function getDueState(iso) {
  if (!iso) return "none";
  const diff = (new Date(iso) - new Date()) / 86400000;
  if (diff < 0) return "overdue";
  if (diff < 3) return "soon";
  return "ok";
}

const DUE_STATE = {
  overdue: "bg-rose-50 text-rose-700 ring-rose-200",
  soon: "bg-amber-50 text-amber-800 ring-amber-200",
  ok: "bg-slate-50 text-slate-600 ring-slate-200",
};

export default function TaskCard({ task, onOpen, isOverlay = false }) {
  const sortable = useSortable({
    id: task._id,
    data: { type: "task", task },
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityBar = PRIORITY_BAR[task.priority] || "bg-slate-300";
  const priorityBadge =
    PRIORITY_BADGE[task.priority] || "bg-slate-50 text-slate-700 ring-slate-200";

  const dueState = getDueState(task.dueDate);
  const dueLabel = formatDue(task.dueDate);

  const subTasksTotal = Array.isArray(task.subTasks) ? task.subTasks.length : 0;
  const subTasksDone = Array.isArray(task.subTasks)
    ? task.subTasks.filter((s) => s?.completed).length
    : 0;
  const commentsCount = Array.isArray(task.comments) ? task.comments.length : 0;
  const attachmentsCount = Array.isArray(task.attachments)
    ? task.attachments.length
    : 0;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 ${
        isDragging
          ? "scale-[1.02] opacity-60 shadow-xl ring-2 ring-violet-300"
          : "hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/10"
      } ${isOverlay ? "ring-2 ring-violet-400 shadow-2xl" : ""}`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${priorityBar}`} />

      <div className="pl-3 pr-3 pt-3 pb-3 sm:pl-4 sm:pr-4 sm:pt-3.5 sm:pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-slate-500">
              {shortKey(task._id)}
            </span>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${priorityBadge}`}
            >
              {task.priority || "—"}
            </span>
          </div>

          <button
            type="button"
            aria-label="Drag task"
            className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(task._id);
          }}
          className="mt-2 block w-full text-left"
        >
          <h3 className="line-clamp-2 break-words text-sm font-semibold text-slate-900 transition-colors group-hover:text-violet-700">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 break-words text-xs text-slate-500">
              {task.description}
            </p>
          )}
        </button>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          {dueLabel && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${DUE_STATE[dueState]}`}
            >
              <CalendarDays size={11} />
              {dueLabel}
            </span>
          )}

          {subTasksTotal > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-inset ring-slate-200">
              <ListChecks size={11} />
              {subTasksDone}/{subTasksTotal}
            </span>
          )}

          {commentsCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-inset ring-slate-200">
              <MessageSquare size={11} />
              {commentsCount}
            </span>
          )}

          {attachmentsCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 ring-1 ring-inset ring-slate-200">
              <Paperclip size={11} />
              {attachmentsCount}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex -space-x-1.5">
            {Array.isArray(task.assignees) && task.assignees.length > 0 ? (
              task.assignees.slice(0, 4).map((user, idx) => (
                <Avatar
                  key={user?._id || idx}
                  className="size-6 border-2 border-white shadow-sm"
                >
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-violet-100 text-[10px] font-semibold text-violet-700">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">Unassigned</span>
            )}
            {Array.isArray(task.assignees) && task.assignees.length > 4 && (
              <span className="ml-1 inline-flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-600 shadow-sm">
                +{task.assignees.length - 4}
              </span>
            )}
          </div>

          {task.archieved && (
            <span className="inline-flex shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
              Archived
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
