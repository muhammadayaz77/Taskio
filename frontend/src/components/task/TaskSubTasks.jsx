import { useState, useEffect } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useCreateSubTask } from "../../hooks/task/useCreateSubTask";
import useUpdateSubTask from "../../hooks/task/useUpdateSubTask";

function TaskSubTasks({ taskId, subTasks = [] }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { mutate: createSubTask, isPending } = useCreateSubTask();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateSubTask();

  // ✅ Sync tasks with backend data
  useEffect(() => {
    setTasks(subTasks);
  }, [subTasks]);

  // ✅ Handle checkbox change properly
  const handleToggle = (subTaskId, index, value) => {
    const updatedTasks = [...tasks];

    // Make sure value is strictly boolean
    const newCompleted = value === true;

    updatedTasks[index].completed = newCompleted;

    // Update UI instantly
    setTasks(updatedTasks);

    console.log({
      taskId,
      subTaskId,
      completed: newCompleted,
    });

    // Send to backend
    updateStatus({
      taskId,
      subTaskId,
      completed: newCompleted,
    });
  };
  console.log("tasks : ",tasks)

  // ✅ Add new subtask
  const handleAdd = () => {
    const title = newTaskTitle.trim();
    if (!title) return;

    createSubTask({ taskId, title });

    const newTask = {
      _id: Date.now().toString(), // temporary ID
      title,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Sub-Tasks</p>

      {/* SubTask List */}
      <div className="space-y-2 max-h-48 overflow-y-auto p-3 border rounded-xl bg-gray-50">
        {tasks.length > 0 ? (
          tasks.map((sub, index) => (
            <div key={sub._id} className="flex items-center gap-3">
              <Checkbox
                checked={Boolean(sub.completed)}
                disabled={isUpdating}
                onCheckedChange={(value) =>
                  handleToggle(sub._id, index, value)
                }
              />

              <span
                className={`text-sm ${
                  sub.completed
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {sub.title}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-400 italic">
            No sub-task available
          </p>
        )}
      </div>

      {/* Add SubTask */}
      <div className="flex gap-2">
        <Input
          placeholder="New Sub-Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 h-10"
        />
        <Button
          onClick={handleAdd}
          className="h-10 bg-blue-500 text-white hover:bg-blue-600"
          disabled={!newTaskTitle.trim() || isPending}
        >
          {isPending ? "Adding..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}

export default TaskSubTasks;  