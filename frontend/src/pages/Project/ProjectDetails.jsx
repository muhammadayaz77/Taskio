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
// import CreateTaskDialog
const tasks = [
  { id: 1, title: "Design landing page", status: "Todo" },
  { id: 2, title: "Setup backend API", status: "In Progress" },
  { id: 3, title: "Implement authentication", status: "Done" },
];

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
  const [isCreateTask,setIsCreateTask] = useState(false)
  const progress = 60;
  const {projectId} = useParams()
  const navigate = useNavigate();
  const {data,isLoading} = useGetProject(projectId)

  if(isLoading){
    return <Loader />
  }

  const {project,tasks} = data;

  return (
    <div className="p-4 space-y-4">
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
            onClick={() => setIsCreateTask}
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
