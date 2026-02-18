import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { Calendar, Activity } from "lucide-react";

import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";

function TaskInfoCard({ task }) {
  const priorityColor = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-orange-500",
    LOW: "bg-slate-500",
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-6">

        <Badge
          className={`text-white ${
            priorityColor[task?.priority] || "bg-orange-500"
          }`}
        >
          {task?.priority || "Medium"} Priority
        </Badge>

        <TaskTitle
          taskId={task._id}
          initialTitle={task.title}
        />

        <Separator />

        <TaskDescription
          taskId={task._id}
          initialDescription={task.description}
        />

        <Separator />

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

        <div>
          <p className="text-sm font-medium mb-2">Progress</p>
          <Progress value={task?.progress || 60} />
        </div>

      </CardContent>
    </Card>
  );
}

export default TaskInfoCard;
