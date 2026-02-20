import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useCreateSubTask } from "../../hooks/task/useCreateSubTask";

function TaskSubTasks({ taskId, subTasks = [] }) {
  const [tasks, setTasks] = useState(subTasks); // existing subtasks
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { mutate: updateSubTasks, isPending } = useCreateSubTask();

  // Toggle completion
  const handleToggle = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);

    console.log("Updated SubTasks:", updated);
    // 🔥 Optionally call API to update completion status
    // updateSubTasks(taskId, updated[index].title)
  };

  // Add new subtask
  const handleAdd = () => {
    const title = newTaskTitle.trim();
    if (!title) return;

    // Call the mutate function with title only
    updateSubTasks({ taskId, title });

    // Optionally update local UI instantly
    const newTask = {
      title,
      completed: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");

    console.log("New SubTask Added:", newTask);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Sub-Tasks</p>

      {/* Existing SubTasks */}
      <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
        {tasks.length > 0 ? (
          tasks.map((sub, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                checked={sub.completed}
                onCheckedChange={() => handleToggle(index)}
              />
              <span
                className={`${
                  sub.completed ? "line-through text-muted-foreground" : ""
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

      {/* Add new SubTask */}
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
          disabled={!newTaskTitle.trim() || isPending} // disabled if input empty or API pending
        >
          {isPending ? "Adding..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}

export default TaskSubTasks;
