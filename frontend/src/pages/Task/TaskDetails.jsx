import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetTask from "../../hooks/task/useGetTask";

import Loader from "../../components/common/Loader";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";

import {
  ArrowLeft,
  Eye,
  Archive,
  Flag,
  Calendar,
  User,
  Activity,
} from "lucide-react";

function TaskDetails() {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetTask(taskId);

  if (isLoading) {
    return <Loader />;
  }

  const task = data?.task;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* 🔥 Top Header */}
      <div className="flex items-center justify-between mb-6">
        
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </Button>

          <h1 className="text-2xl font-semibold">
            {task?.title || "Task Title"}
          </h1>
        </div>

        {/* Right Side Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex gap-2">
            <Eye size={16} />
            Watch
          </Button>

          <Button variant="outline" className="flex gap-2">
            <Archive size={16} />
            Archived
          </Button>
        </div>
      </div>

      {/* 🔥 Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= LEFT SECTION ================= */}
        <div className="md:col-span-2 space-y-6">

          {/* Task Main Info */}
          <Card>
            <CardContent className="p-5 space-y-5">

              {/* Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Flag size={16} />
                  Priority
                </div>

                <Badge variant="secondary">
                  {task?.priority || "Medium"}
                </Badge>
              </div>

              <Separator />

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Activity size={16} />
                  Status
                </div>

                <Badge>
                  {task?.status || "In Progress"}
                </Badge>
              </div>

              <Separator />

              {/* Assignee */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <User size={16} />
                  Assignee
                </div>

                <span className="text-sm text-muted-foreground">
                  {task?.assignee?.name || "Not Assigned"}
                </span>
              </div>

              <Separator />

              {/* Due Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar size={16} />
                  Due Date
                </div>

                <span className="text-sm text-muted-foreground">
                  {task?.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </span>
              </div>

              <Separator />

              {/* Progress */}
              <div>
                <p className="text-sm font-medium mb-2">Progress</p>
                <Progress value={task?.progress || 60} />
              </div>

              <Separator />

              {/* Description */}
              <div>
                <p className="text-sm font-medium mb-2">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {task?.description || "No description provided."}
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="space-y-6">

          <Card>
            <CardContent className="p-5">
              <h2 className="text-lg font-semibold mb-4">
                Activity
              </h2>

              <div className="space-y-4 text-sm">

                {/* Example Activity Item */}
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">
                      John changed status to In Progress
                    </p>
                    <p className="text-muted-foreground text-xs">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">
                      Sarah commented on this task
                    </p>
                    <p className="text-muted-foreground text-xs">
                      1 day ago
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}

export default TaskDetails;
