import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import TaskStatusProgressBar from "../common/TaskStatusProgressBar";
import { getProjectStatusBreakdown } from "../../utils/progress";

const statusColors = {
  Planning: "bg-blue-100 text-blue-700",
  "In Progress": "bg-green-100 text-green-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

function shortDate(value) {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export default function ProjectCard({ project, progress, workspaceId, accentColor }) {
  const accent = accentColor || "#6366f1";
  const start = shortDate(project?.startDate);
  const due = shortDate(project?.dueDate);
  const members = Array.isArray(project?.members) ? project.members.length : 0;
  const breakdown = getProjectStatusBreakdown(project);

  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="block h-full focus-visible:outline-none"
    >
      <Card
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-[color:var(--project-accent)] hover:shadow-lg"
        style={{ "--project-accent": accent }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(to bottom right, ${accent}2a, transparent)`,
          }}
        />

        <CardHeader className="relative pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle
              className="line-clamp-2 min-w-0 flex-1 break-words text-base font-semibold text-slate-900 transition-colors group-hover:[color:var(--project-accent)] sm:text-lg"
              title={project?.title}
            >
              {project?.title}
            </CardTitle>
            {project?.status && (
              <Badge
                className={`shrink-0 whitespace-nowrap text-[10px] sm:text-xs ${
                  statusColors[project.status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {project.status}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative flex flex-1 flex-col gap-4">
          <p className="line-clamp-2 break-words text-sm text-muted-foreground">
            {project?.description || "No description"}
          </p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-semibold tabular-nums" style={{ color: accent }}>
                {Number.isFinite(progress) ? progress : 0}%
              </span>
            </div>
            <TaskStatusProgressBar breakdown={breakdown} compact />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1">
              <Users size={12} className="shrink-0" style={{ color: accent }} />
              <span className="truncate">
                {members} member{members === 1 ? "" : "s"}
              </span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <CalendarDays size={12} className="shrink-0" />
              <span className="truncate">{due}</span>
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-muted-foreground">
            <span className="truncate">Start {start}</span>
            <span className="inline-flex shrink-0 items-center gap-1 font-semibold transition group-hover:gap-2 group-hover:[color:var(--project-accent)]">
              Open
              <ArrowUpRight size={14} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
