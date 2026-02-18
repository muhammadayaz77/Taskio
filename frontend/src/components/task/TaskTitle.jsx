import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Pencil } from "lucide-react";

// 🔥 You will create this hook
import useUpdateTask from "../../hooks/task/useUpdateTittleName";

function TaskTitle({ taskId, initialTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");

  const { mutate: updateTask, isPending } = useUpdateTask();

  useEffect(() => {
    setTitle(initialTitle || "");
  }, [initialTitle]);

  const handleSave = () => {
    setIsEditing(false);

    if (title !== initialTitle) {
      updateTask({
        taskId,
        data: { title }
      });
    }
  };

  return (
    <div>
      {isEditing ? (
        <Input
          value={title}
          autoFocus
          disabled={isPending}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {title || "Task Title"}
          </h2>
          <Pencil
            size={16}
            className="cursor-pointer text-muted-foreground"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
}

export default TaskTitle;
