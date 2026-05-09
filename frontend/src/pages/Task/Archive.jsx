import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Archive as ArchiveIcon,
  ArrowUpRight,
  Calendar,
  FolderKanban,
  Layers,
  Lock,
  Search,
  Sparkles,
} from "lucide-react";
import { useActiveWorkspaceId } from "../../hooks/useActiveWorkspaceId";
import { useWorkspaceMembership } from "../../hooks/useWorkspaceMembership";
import useGetWorkspaceArchivedTasks from "../../hooks/workspace/useGetWorkspaceArchivedTasks";
import Loader from "../../components/common/Loader";

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
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArchivedTaskCard({ task, workspaceId, accentColor }) {
  const project = task.project;
  const accent = accentColor || "#6366f1";
  const projectId = project?._id;
  const ws =
    project?.workspace?.toString?.() ??
    (typeof project?.workspace === "string" ? project.workspace : workspaceId);

  const href =
    projectId && ws
      ? `/workspaces/${ws}/projects/${projectId}/tasks/${task._id}`
      : null;

  const inner = (
    <article
      className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[color:var(--archive-accent)] hover:shadow-lg"
      style={{ "--archive-accent": accent }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom right, ${accent}33, transparent)`,
        }}
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 ring-1 ring-slate-200/80">
                <ArchiveIcon className="size-3" style={{ color: accent }} />
                Archived
              </span>
            </div>
            <h2 className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:[color:var(--archive-accent)]">
              {task.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset ${STATUS_STYLES[task.status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
              >
                {task.status || "—"}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 font-medium ring-1 ring-inset ${PRIORITY_STYLES[task.priority] || "bg-slate-100 text-slate-600 ring-slate-200"}`}
              >
                {task.priority || "—"}
              </span>
            </div>
          </div>
          {href && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition group-hover:border-[color:var(--archive-accent)] group-hover:bg-[color-mix(in_srgb,var(--archive-accent)_12%,white)] group-hover:text-[color:var(--archive-accent)]">
              <ArrowUpRight className="size-4" />
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
            <FolderKanban className="size-3.5 shrink-0" style={{ color: accent }} />
            {project?.title || "Project"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-400" />
            Updated {formatDate(task.updatedAt)}
          </span>
        </div>

        {Array.isArray(task.assignees) && task.assignees.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="font-medium text-slate-500">Assignees</span>
            <span className="truncate">
              {task.assignees
                .map((a) => a?.name || a?.email || "—")
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
      </div>
    </article>
  );

  if (!href) return inner;

  return (
    <Link to={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 rounded-2xl">
      {inner}
    </Link>
  );
}

export default function Archive() {
  const workspaceId = useActiveWorkspaceId();
  const { workspaces } = useSelector((s) => s.workspace);
  const { memberOf, denyClient } = useWorkspaceMembership(workspaceId);
  const [query, setQuery] = useState("");

  const { data, isPending, isError, error } = useGetWorkspaceArchivedTasks(
    workspaceId,
    { enabled: memberOf }
  );

  const workspaceColor = useMemo(() => {
    const fromApi = data?.workspace?.color;
    const fromStore = workspaces.find(
      (w) => String(w._id) === String(workspaceId)
    )?.color;
    return fromApi || fromStore || "#6366f1";
  }, [data?.workspace?.color, workspaces, workspaceId]);

  const tasks = useMemo(() => {
    const list = Array.isArray(data?.tasks) ? data.tasks : [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.project?.title?.toLowerCase().includes(q)
    );
  }, [data?.tasks, query]);

  if (!workspaceId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Layers className="mx-auto mb-4 size-12 text-slate-300" />
        <p className="text-slate-600">
          Pick a workspace in the header to view archived tasks for that workspace.
        </p>
      </div>
    );
  }

  if (denyClient) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Lock className="size-7" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">No access</h2>
        <p className="mt-2 text-sm text-slate-600">
          Archived tasks are only visible to members of that workspace. Choose a workspace you belong to in the header.
        </p>
      </div>
    );
  }

  if (isError) {
    const status = error?.response?.status;
    const msg =
      status === 404
        ? "Workspace not found or you are not a member."
        : error?.response?.data?.message ||
          "Could not load archive. Try again later.";
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm font-medium text-red-700">{msg}</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const workspaceName = data?.workspace?.name || "Workspace";
  const total = Array.isArray(data?.tasks) ? data.tasks.length : 0;
  const accent = workspaceColor;

  return (
    <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-6 py-10 shadow-sm sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Workspace archive
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 10px 40px -10px ${accent}66`,
                }}
              >
                <ArchiveIcon className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Archive
                </h1>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Quiet shelf for tasks archived in{" "}
                  <span className="font-semibold text-slate-800">{workspaceName}</span>.
                  Restore anytime from the task page.
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Archived
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{total}</p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm ring-1 ring-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Showing
              </p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: accent }}
              >
                {tasks.length}
              </p>  
            </div>
          </div>
        </div>

        <div className="relative mt-8">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by task or project name…"
              className="w-full rounded-2xl border border-slate-200 bg-white/95 py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-inner outline-none ring-violet-500/20 placeholder:text-slate-400 focus:border-violet-300 focus:ring-4"
            />
          </label>
        </div>
      </section>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-20 text-center">
          <div
            className="mb-4 flex size-16 items-center justify-center rounded-2xl text-white shadow-md"
            style={{
              backgroundColor: accent,
              boxShadow: `0 12px 40px -12px ${accent}55`,
            }}
          >
            <ArchiveIcon className="size-8 text-white opacity-95" />
          </div>
          <p className="text-lg font-medium text-slate-700">
            {total === 0 ? "No archived tasks yet" : "No matches"}
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            {total === 0
              ? "When you archive tasks from this workspace, they will appear here in one calm place."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <li key={task._id}>
              <ArchivedTaskCard
                task={task}
                workspaceId={workspaceId}
                accentColor={accent}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
