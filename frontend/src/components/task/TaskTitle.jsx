import { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";
import useUpdateTask from "../../hooks/task/useUpdateTittleName";

function TaskTitle({ taskId, initialTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");

  const { mutate: updateTask, isPending } = useUpdateTask();

  useEffect(() => {
    setTitle(initialTitle || "");
  }, [initialTitle]);

  const handleSave = () => {
    if (title.trim() === "") return;

    updateTask(
      { taskId, title },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setTitle(initialTitle || "");
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={title}
            autoFocus
            disabled={isPending}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
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
