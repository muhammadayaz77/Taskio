import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft } from "lucide-react";
import useGetProject from "../../hooks/project/useGetProject";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import CreateTaskDialog from "../../components/task/CreateTaskDialog";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

function getStatusVariant(status) {
  switch (status) { 
    case "To Do":
      return "secondary";
    case "In Progress":
      return "default";
    case "Done":
      return "outline";
    default:
      return "secondary";
  }
}

function ProjectDetails() {
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState("All");

  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProject(projectId);
  // console.log("tasks : ",data.tasks)

  if (isLoading) return <Loader />;

  const { project, tasks } = data;

  // Left filter tabs
  const leftTabs = [
    { label: "All", value: "All" },
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Done", value: "Done" },
  ];

  // Group tasks by status
  const tasksByStatus = {
    "To Do": tasks.filter((t) => t.status === "To Do"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "Done": tasks.filter((t) => t.status === "Done"),
  };

  // Right summary counts
  const rightTabs = [
    { label: `To Do: ${tasksByStatus["To Do"].length}` },
    { label: `In Progress: ${tasksByStatus["In Progress"].length}` },
    { label: `Done: ${tasksByStatus["Done"].length}` },
  ];

  // Determine which statuses to show
  const visibleStatuses =
    taskFilter === "All" ? ["To Do", "In Progress", "Done"] : [taskFilter];

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className=""> 
        <Button
          variant="outline"
          size="sm"
          className="bg-white flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <div className="mt-5">
          <h1 className="text-xl font-semibold">{project.title}</h1>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 max-w-md">{project.description}</p>
          )}
        </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-32 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsCreateTask(true)}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <Tabs value={taskFilter} onValueChange={setTaskFilter}>
          <TabsList className="bg-gray-100 p-1 rounded-2xl">
            {leftTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`rounded-xl px-4 py-2 text-sm transition-all ${
                  taskFilter === tab.value
                    ? "bg-white shadow-sm text-red-600"
                    : "bg-transparent text-gray-500"
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Right non-clickable summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Status:</span>
          <Card className="flex flex-row gap-1 bg-gray-100 p-1 rounded-2xl shadow-none">
            {rightTabs.map((tab, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white px-2 py-1 text-xs text-gray-700"
              >
                {tab.label}
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Task Sections */}
      <div
        className={`grid gap-4 ${
          visibleStatuses.length === 1
            ? "grid-cols-1 justify-items-center"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {visibleStatuses.map((status) => (
          <div
            key={status}
            className={`w-full ${
              visibleStatuses.length === 1 ? "max-w-md" : "w-full"
            }`}
          >

            <h2 className="text-sm font-medium mb-2">{status}</h2>
            <Card className="p-4 bg-gray-50">
              {tasksByStatus[status].length > 0 ? (
  tasksByStatus[status].map((task) => (
    <Card
      key={task._id}
      className="mb-3 p-3 bg-white cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{task.title}</h3>
        <Badge variant={getStatusVariant(task.status)}>
          {task.status}
        </Badge>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
        <span>Priority: {task.priority}</span>
        <span>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
    </Card>
  ))
) : (
  <p className="text-gray-400 text-xs">No tasks</p>
)}

            </Card>
          </div>
        ))}
      </div>

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
