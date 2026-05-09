import React from "react";

/**
 * Segmented progress bar based on To Do / In Progress / Done.
 * - Each segment width is proportional to its count.
 * - Segments with > 0 count get a tiny min width so they stay visible.
 * - Legend wraps on small screens.
 */
export default function TaskStatusProgressBar({ breakdown, compact = false }) {
  const data = breakdown || {};
  const total = data.total ?? 0;
  const todo = data.todo ?? 0;
  const inProgress = data.inProgress ?? 0;
  const done = data.done ?? 0;

  const todoPct = total ? (todo / total) * 100 : 0;
  const inProgressPct = total ? (inProgress / total) * 100 : 0;
  const donePct = total ? (done / total) * 100 : 0;

  const segments = [
    { key: "todo", count: todo, pct: todoPct, color: "bg-slate-300", label: "To Do", dot: "bg-slate-400" },
    { key: "in", count: inProgress, pct: inProgressPct, color: "bg-amber-400", label: "In Progress", dot: "bg-amber-500" },
    { key: "done", count: done, pct: donePct, color: "bg-emerald-500", label: "Done", dot: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-2">
      <div
        className={`${compact ? "h-2" : "h-2.5"} w-full overflow-hidden rounded-full bg-slate-100`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total || 1}
        aria-valuenow={done}
        title={
          total
            ? `Done ${done} of ${total} (${Math.round((done / total) * 100)}%)`
            : "No tasks"
        }
      >
        <div className="flex h-full w-full">
          {segments.map((s) =>
            s.count > 0 ? (
              <div
                key={s.key}
                className={`${s.color} h-full transition-all`}
                style={{
                  width: `${s.pct}%`,
                  minWidth: "6px",
                }}
                title={`${s.label}: ${s.count}`}
              />
            ) : null
          )}
        </div>
      </div>

      <div
        className={`flex flex-wrap gap-x-3 gap-y-1 ${
          compact ? "text-[10px]" : "text-xs"
        } text-slate-500`}
      >
        {segments.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1">
            <span className={`size-1.5 rounded-full ${s.dot}`} />
            <span>
              {s.label} <span className="font-semibold text-slate-700">{s.count}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
