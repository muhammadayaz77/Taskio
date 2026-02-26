import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { Calendar, Activity } from "lucide-react";

import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";
import TaskDeleteButton from "./TaskDeleteButton";
import TaskStatusSelect from "./TaskStatusSelect";
import TaskAssignees from "./TaskAssignees";
import TaskPrioritySelector from "./TaskPrioritySelector";
import TaskSubTasks from "./TaskSubTasks";
import CommentSection from "./CommentSection";

function TaskInfoCard({ task,projectMembers }) {
  const priorityColor = {
    High: "bg-red-500",
    Medium: "bg-orange-500",
    Low: "bg-slate-500",
  };
  console.log("task ",task);
  return (
    <Card>
      <CardContent className="p-5 space-y-6">

     {/* TOP SECTION */}
<div className="flex items-center justify-between">

  {/* LEFT: Priority */}
  <Badge
    className={`text-white ${
      priorityColor[task?.priority] || "bg-orange-500"
    }`}
  >
    {task?.priority || "Medium"} Priority
  </Badge>

  {/* RIGHT: Status + Delete */}
  <div className="flex items-center gap-3">
    <TaskStatusSelect
      taskId={task._id}
      currentStatus={task.status}
    />

    <TaskDeleteButton
      taskId={task._id}
    />
  </div>

</div>


        <TaskTitle
          taskId={task._id}
          initialTitle={task.title}
        />


        <TaskDescription
          taskId={task._id}
          initialDescription={task.description}
        />



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

<TaskAssignees
  taskId={task._id}
  assignees={task.assignees || []}
  members={projectMembers || []}
/>

<TaskPrioritySelector
      taskId={task._id}
      priority={task?.priority}
    />
    <TaskSubTasks
  taskId={task._id}
  subTasks={task.subTasks || []}
/>
    <Separator />
    <CommentSection taskId={task._id} members={projectMembers} />
        <div>
          <p className="text-sm font-medium mb-2">Progress</p>
          <Progress value={task?.progress || 60} />
        </div>

      </CardContent>
    </Card>
  );
}

export default TaskInfoCard;
