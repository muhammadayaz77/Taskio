import { useState } from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

function TaskSubTasks({ taskId, subTasks = [] }) {
  const [tasks, setTasks] = useState(subTasks); // existing subtasks
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Toggle completion
  const handleToggle = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);

    console.log("Updated SubTasks:", updated);
    // 🔥 Call API to update task.subTasks completion status
    // updateSubTasks(taskId, updated)
  };

  // Add new subtask
  const handleAdd = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");

    console.log("New SubTask Added:", newTask);
    // 🔥 Call API to add new subtask
    // addSubTask(taskId, newTask)
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
          className="flex-1 h-10" // full width and fixed height
        />
        <Button
          onClick={handleAdd}
          className="h-10 bg-blue-500 text-white hover:bg-blue-600"
          disabled={!newTaskTitle.trim()} // disabled if input empty
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default TaskSubTasks;
