import {
  ArrowUpRight,
  CheckSquare,
  FolderKanban,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useGetMyTask from "../../hooks/task/useGetMyTask";
import Loader from "../../components/common/Loader";
import { Input } from "../../components/ui/input";

const STATUS_FILTERS = ["all", "To Do", "In Progress", "Done", "Archived"];
const PRIORITY_FILTERS = ["High", "Medium", "Low"];

const STATUS_STYLES = {
  "To Do": "bg-sky-50 text-sky-700 ring-sky-100",
  "In Progress": "bg-amber-50 text-amber-800 ring-amber-100",
  Done: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

const PRIORITY_STYLES = {
  High: "bg-rose-50 text-rose-700 ring-rose-100",
  Medium: "bg-orange-50 text-orange-800 ring-orange-100",
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatDate(iso) {
  if (!iso) return "No date";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDueDateClass(iso) {
  if (!iso) return "text-slate-400";
  const diff = (new Date(iso) - new Date()) / 86400000;
  if (diff < 0) return "text-rose-600";
  if (diff < 3) return "text-amber-600";
  return "text-slate-500";
}

function taskLink(task) {
  const proj = task.project;
  if (!proj) return null;
  const wsRaw = proj.workspace;
  const wsId =
    typeof wsRaw === "object" && wsRaw !== null && wsRaw._id
      ? wsRaw._id
      : wsRaw;
  const pid = proj._id ?? task.project;
  if (!wsId || !pid || !task._id) return null;
  return `/workspaces/${String(wsId)}/projects/${String(pid)}/tasks/${String(task._id)}`;
}

export default function MyTasks() {
  const { data, isLoading } = useGetMyTask();

  const tasks = Array.isArray(data)
    ? data
    : Array.isArray(data?.tasks)
      ? data.tasks
      : [];

  const [searchParams, setSearchParams] = useSearchParams();

  const filter = searchParams.get("filter") || "all";
  const sort = searchParams.get("sort") || "new";
  const search = searchParams.get("search") || "";

  function update(key, value) {
    const p = new URLSearchParams(searchParams);
    if (!value || value === "all" || value === "new") p.delete(key);
    else p.set(key, value);
    setSearchParams(p, { replace: true });
  }

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (filter === "Archived") list = list.filter((t) => t.archieved);
    else if (["High", "Medium", "Low"].includes(filter))
      list = list.filter((t) => t.priority === filter);
    else if (filter !== "all")
      list = list.filter((t) => t.status === filter);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.project?.title?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) =>
      sort === "old"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

    return list;
  }, [tasks, filter, sort, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Assigned to you
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
                <CheckSquare className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  My tasks
                </h1>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Everything you are assigned to across workspaces. Filter by
                  status, priority, or archive.
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {tasks.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm ring-1 ring-violet-100 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Showing
              </p>
              <p className="text-2xl font-bold tabular-nums text-violet-700">
                {filtered.length}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Search by task or project…"
              className="h-11 w-full rounded-2xl border-slate-200 bg-white/95 pl-11 pr-4 text-sm shadow-inner focus-visible:ring-violet-500/30"
            />
          </label>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => update("filter", f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === f
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-slate-500">Priority</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => update("filter", "all")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  !["High", "Medium", "Low"].includes(filter)
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                Any
              </button>
              {PRIORITY_FILTERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update("filter", p)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === p
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => update("sort", sort === "new" ? "old" : "new")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {sort === "new" ? "Newest first" : "Oldest first"}
            </button>
            {(search ||
              filter !== "all" ||
              sort !== "new") && (
              <button
                type="button"
                onClick={() => {
                  setSearchParams({}, { replace: true });
                }}
                className="text-sm font-medium text-violet-700 hover:text-violet-800"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <CheckSquare className="size-8 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-800">No tasks found</p>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Try changing filters or search. New assignments will appear here
              automatically.
            </p>
          </div>
        ) : (
          filtered.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const dueCls = getDueDateClass(task.dueDate);
  const href = taskLink(task);

  const inner = (
    <article className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-semibold text-slate-900 transition group-hover:text-violet-700">
            {task.title}
          </h2>
          {href && (
            <ArrowUpRight
              size={16}
              className="shrink-0 text-slate-400 transition group-hover:text-violet-600"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset ${STATUS_STYLES[task.status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
          >
            {task.status}
          </span>
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset ${PRIORITY_STYLES[task.priority] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
          >
            {task.priority}
          </span>
          {task.archieved && (
            <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 font-medium text-slate-700 ring-1 ring-slate-300/80">
              Archived
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <FolderKanban size={14} className="shrink-0 text-violet-500" />
          <span className="truncate">
            {task.project?.title || "Project"}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-xs font-medium ${dueCls}`}>{formatDate(task.dueDate)}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">Due</p>
      </div>
    </article>
  );

  if (!href) {
    return <div className="opacity-90">{inner}</div>;
  }

  return (
    <Link to={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-2xl">
      {inner}
    </Link>
  );
}
