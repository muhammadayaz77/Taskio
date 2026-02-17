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
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { CalendarDays, ArrowUp, ArrowDown } from "lucide-react";

function getPriorityColor(priority) {
  switch (priority) {
    case "High":
      return "bg-red-500";
    case "Medium":
      return "bg-orange-500";
    case "Low":
      return "bg-slate-400";
    default:
      return "bg-gray-300";
  }
}
function getPriorityBadgeStyle(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-orange-100 text-orange-600";
    case "Low":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}



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

  const { projectId,workspaceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProject(projectId);
  console.log("tasks : ",data?.tasks)

    if(!workspaceId){
    return <div>No Workspace found</div>
  }

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

    const handleTasks = (taskId) => {
      console.log("task id : ",taskId)
      navigate(`tasks/${taskId}`)  
    }

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
  className="relative mb-3 bg-white hover:shadow-md transition cursor-pointer overflow-hidden"
  onClick={() => handleTasks(task._id)}
>
  {/* Left Priority Bar */}
  <div
    className={`absolute left-0 top-0 h-full w-1 ${getPriorityColor(
      task.priority
    )}`}
  />

  <div className="p-4 ml-2">
    {/* Priority Controls */}
   <div className="flex justify-between items-start">
  <Badge
    className={`${getPriorityBadgeStyle(
      task.priority
    )} border-none text-xs px-2 py-1`}
  >
    {task.priority}
  </Badge>

  <div
    className="flex gap-2 text-gray-400"
    onClick={(e) => e.stopPropagation()}
  >
    <ArrowUp size={16} className="cursor-pointer hover:text-red-500" />
    <ArrowDown size={16} className="cursor-pointer hover:text-blue-500" />
  </div>
</div>
 


    {/* Title */}
    <h3 className="text-sm font-semibold mt-2">
      {task.title}
    </h3>

    {/* Description */}
    {task.description && (
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {task.description}
      </p>
    )}

    {/* Bottom Section */}
    <div className="flex justify-between items-center mt-4">
      
      {/* Assignee Avatars */}
      <div className="flex -space-x-2">
        {task.assignees?.length > 0 ? (
          task.assignees.map((user) => (
            <Avatar
              key={user._id}
              className="h-7 w-7 border-2 border-white"
            >
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))
        ) : (
          <span className="text-xs text-gray-400">
            No Members
          </span>
        )}
      </div>

      {/* Due Date */}
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <CalendarDays size={14} />
        {task.dueDate &&
          new Date(task.dueDate).toLocaleDateString()}
      </div>
    </div>
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
