import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

const COLUMN_STYLES = {
  "To Do": {
    dot: "bg-slate-400",
    accent: "bg-slate-100 text-slate-700 ring-slate-200",
    headerBar: "bg-slate-300",
  },
  "In Progress": {
    dot: "bg-amber-500",
    accent: "bg-amber-50 text-amber-800 ring-amber-200",
    headerBar: "bg-amber-400",
  },
  Done: {
    dot: "bg-emerald-500",
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    headerBar: "bg-emerald-500",
  },
};

export default function TaskColumn({
  status,
  tasks,
  onOpenTask,
  onAddTask,
}) {
  const style = COLUMN_STYLES[status] || COLUMN_STYLES["To Do"];

  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: { type: "column", status },
  });

  const ids = tasks.map((t) => t._id);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`size-2 rounded-full ${style.dot}`} />
          <h3 className="truncate text-sm font-semibold text-slate-800">
            {status}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${style.accent}`}
          >
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask?.(status)}
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
          title="Add task"
        >
          <Plus size={14} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border bg-slate-50/70 p-3 transition-colors ${
          isOver
            ? "border-violet-400 bg-violet-50/80 ring-2 ring-violet-200"
            : "border-slate-200/80"
        }`}
        style={{ minHeight: "120px" }}
      >
        <div className={`-mt-1 mb-1 h-0.5 w-full rounded-full ${style.headerBar} opacity-60`} />

        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onOpen={onOpenTask} />
            ))
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 py-10 text-center text-xs text-slate-400">
              {isOver ? "Release to drop here" : "Drop tasks here"}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
