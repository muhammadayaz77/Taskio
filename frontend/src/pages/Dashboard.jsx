import React from "react";
import { useSelector } from "react-redux";
import { LayoutDashboard, Layers, Lock, Sparkles } from "lucide-react";
import useGetWorkspaceStats from "../hooks/workspace/useGetWorkspaceStats";
import { useActiveWorkspaceId } from "../hooks/useActiveWorkspaceId";
import { useWorkspaceMembership } from "../hooks/useWorkspaceMembership";
import Loader from "../components/common/Loader";
import StatsCard from "../components/dashboard/StatsCard";
import StatisticsCharts from "../components/dashboard/StatisticsCharts";
import RecentProjects from "../components/workspace/RecentProjects";
import UpcomingTasks from "../components/workspace/UpcomingTasks";

function Dashboard() {
  const workspaceId = useActiveWorkspaceId();
  const { workspaces } = useSelector((s) => s.workspace);
  const { memberOf, denyClient } = useWorkspaceMembership(workspaceId);
  const { data, isPending } = useGetWorkspaceStats(workspaceId, {
    enabled: memberOf,
  });

  const activeWs = workspaces?.find(
    (w) => String(w._id) === String(workspaceId)
  );
  const workspaceColor = activeWs?.color || "#6366f1";
  const workspaceName = activeWs?.name ?? "Workspace";

  if (!workspaceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Layers className="mx-auto mb-4 size-12 text-slate-300" />
        <p className="text-slate-600">
          Choose a workspace from the header to see dashboard stats.
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
        <p className="font-semibold text-slate-900">No access</p>
        <p className="mt-2 text-sm text-slate-600">
          Pick a workspace you are a member of in the header.
        </p>
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

  return (
    <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{
              backgroundColor: workspaceColor,
              boxShadow: `0 10px 40px -10px ${workspaceColor}66`,
            }}
          >
            <LayoutDashboard className="size-7" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Overview
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl truncate max-w-full" title={workspaceName}>
              {workspaceName}
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Projects, tasks, and activity for this workspace at a glance.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <StatsCard data={data?.stats} />
        <StatisticsCharts
          stata={data.stats}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          taskTrendsData={data.taskTrendsData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
        <div className="grid grid-cols-12 gap-6">
          <RecentProjects data={data.recentProjects} />
          <UpcomingTasks data={data.upcomingTasks} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
