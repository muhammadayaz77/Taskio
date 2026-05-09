import React, { useState } from "react";
import {
  Plus,
  Users,
  Calendar,
  ArrowRight,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateWorkspace from "../../components/workspace/CreateWorkspace";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces } = useSelector((store) => store.workspace);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return "N/A";
    }
  };

  const handleViewWorkspace = (workspaceId) => {
    navigate(`/workspaces/${workspaceId}`);
  };

  const count = workspaces?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Your workspaces
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/25">
                <FolderKanban className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Workspaces
                </h1>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Organize projects and teams in one place. Open a workspace to
                  see projects and tasks.
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {count}
              </p>
            </div>
            <Button
              onClick={() => setIsCreatingWorkspace(true)}
              className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white shadow-md shadow-violet-600/25 hover:bg-violet-700"
            >
              <Plus className="mr-2 size-4" />
              Create workspace
            </Button>
          </div>
        </div>
      </section>

      {workspaces && workspaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              formatDate={formatDate}
              onViewWorkspace={handleViewWorkspace}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <FolderKanban className="size-8 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-800">
            No workspaces yet
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Create your first workspace to invite teammates and spin up
            projects.
          </p>
          <Button
            onClick={() => setIsCreatingWorkspace(true)}
            className="mt-6 rounded-xl bg-violet-600 px-6 text-white shadow-md shadow-violet-600/25 hover:bg-violet-700"
          >
            <Plus className="mr-2 size-4" />
            Create workspace
          </Button>
        </div>
      )}

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

const WorkspaceCard = ({ workspace, formatDate, onViewWorkspace }) => {
  const color = workspace.color || "#6366f1";
  const accentLight = `${color}22`;

  return (
    <button
      type="button"
      onClick={() => onViewWorkspace(workspace._id)}
      className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:border-[color:var(--ws-accent)] hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      style={{
        "--ws-accent": color,
        borderColor: "rgb(226 232 240 / 0.9)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to bottom right, ${accentLight}, transparent)`,
        }}
      />

      <div className="mb-4 flex items-start gap-4">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-inner"
          style={{ backgroundColor: color }}
        >
          {workspace.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900 transition group-hover:[color:var(--ws-accent)]">
            {workspace.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="size-3.5 shrink-0" />
            <span>Created {formatDate(workspace.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <Users className="size-4" style={{ color }} />
        <span className="font-medium">
          {workspace.members?.length || 0} member
          {workspace.members?.length !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-600">
        {workspace.description || "No description yet"}
      </p>

      <div className="flex items-center gap-1.5 text-sm font-semibold transition group-hover:gap-2" style={{ color }}>
        <span>Open workspace</span>
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </div>
    </button>
  );
};

export default Workspaces;
