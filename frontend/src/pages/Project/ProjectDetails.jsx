import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import useGetProject from "../../hooks/project/useGetProject";
import Loader from "../../components/common/Loader";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import CreateTaskDialog from "../../components/task/CreateTaskDialog";
import TaskBoard from "../../components/task/TaskBoard";
import TaskStatusProgressBar from "../../components/common/TaskStatusProgressBar";
import {
  calculateTaskProgress,
  getTaskStatusBreakdown,
} from "../../utils/progress";

function ProjectDetails() {
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState("All");

  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProject(projectId);

  const tasks = data?.tasks ?? [];
  const progressData = useMemo(() => calculateTaskProgress(tasks), [tasks]);
  const statusBreakdown = useMemo(() => getTaskStatusBreakdown(tasks), [tasks]);
  const progress = progressData.value;

  if (!workspaceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        No workspace selected.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data?.project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        Project not found.
      </div>
    );
  }

  const { project } = data;

  const leftTabs = [
    { label: "All", value: "All" },
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Done", value: "Done" },
  ];

  const visibleStatuses =
    taskFilter === "All" ? ["To Do", "In Progress", "Done"] : [taskFilter];

  const handleOpenTask = (taskId) => {
    navigate(`tasks/${taskId}`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 pb-16 sm:px-4">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 bg-white"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={14} className="mr-1" />
                Back
              </Button>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
                <Sparkles className="size-3.5" />
                Project board
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {project.title}
              </h1>
              {project.description && (
                <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-slate-600">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-end lg:w-auto">
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm sm:min-w-[260px]">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="font-semibold text-violet-700 tabular-nums">
                  {progress}%
                </span>
              </div>
              <TaskStatusProgressBar breakdown={statusBreakdown} compact />
            </div>
            <Button
              className="h-auto rounded-xl bg-violet-600 px-5 text-white shadow-md shadow-violet-600/25 hover:bg-violet-700"
              onClick={() => setIsCreateTask(true)}
            >
              <Plus size={16} className="mr-1" />
              Add task
            </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={taskFilter} onValueChange={setTaskFilter}>
          <TabsList className="rounded-2xl bg-slate-100 p-1">
            {leftTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  taskFilter === tab.value
                    ? "bg-white text-violet-700 shadow-sm"
                    : "bg-transparent text-slate-500"
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <p className="text-xs text-slate-500">
          Tip: drag tasks between columns to update status.
        </p>
      </div>

      <TaskBoard
        tasks={tasks}
        projectId={projectId}
        onOpenTask={handleOpenTask}
        onAddTask={() => setIsCreateTask(true)}
        visibleStatuses={visibleStatuses}
      />

      <CreateTaskDialog
        isOpen={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={project.members}
      />
    </div>
  );
}

export default ProjectDetails;
