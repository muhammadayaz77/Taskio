import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft } from "lucide-react";
import useGetProject from "../../hooks/project/useGetProject";
import {useNavigate, useParams} from 'react-router-dom';
import Loader from '../../components/common/Loader'
import CreateTaskDialog from "../../components/task/CreateTaskDialog";




import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
function getStatusVariant(status) {
  switch (status) {
    case "Todo":
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
  const [isCreateTask,setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState("All");

  const [counts,setCounte] = useState({
    todo : 1,
    inProgress : 2,
    done : 5,
    
  })
  const progress = 60;
  const {projectId} = useParams()
  const navigate = useNavigate();
  const {data,isLoading} = useGetProject(projectId) 
  if(isLoading){
    return <Loader />
  }
  
  const {project,tasks} = data;
  
  
  const leftTabs = [
{ label: "All", value: "All" },
{ label: "To Do", value: "To Do" },
{ label: "In Progress", value: "In Progress" },
{ label: "Done", value: "Done" },
];


const rightTabs = [
{ label: `To Do: ${counts.todo}` },
{ label: `In Progress: ${counts.inProgress}` },
{ label: `Done: ${counts.done}` },
];
  

  return (
    <div className="p-3">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          {/* Back Button */}
          <Button
            variant="outline"
            size="sm"
            className="bg-white flex items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={14} />
            Back
          </Button>

          {/* Project Title */}
          <div>
            <h1 className="text-xl font-semibold">{project.title || "No title"}</h1>
              {project?.description && 
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              {project.description || "Not description"}
            </p>
              }
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="w-32 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="rounded-xl shadow-sm">
            <CardContent className="flex justify-between items-center py-3 px-4">
              <span className="text-sm font-medium">{task.title}</span>
              <Badge
                variant={getStatusVariant(task.status)}
                className="text-xs"
              >
                {task.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="flex items-center justify-between w-full gap-4">
{/* Left Clickable Filter Tabs */}
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

{/* Right Non-Clickable Status Summary */}
<div className="flex items-center gap-2 mt-10">
  <span className="text-xs font-medium text-gray-500">
    Status:
  </span>

  <Card className="flex flex-row gap-1 bg-gray-100 p-1 rounded-2xl shadow-none">
    {rightTabs.map((tab, index) => (
      <div
        key={index}
        className="rounded-xl bg-white px-2 py-1 text-xs text-gray-700"
      >
        {tab.label}
      </div>
    ))}
  </Card>
</div>


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
