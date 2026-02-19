import { useState, useEffect } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Pencil } from "lucide-react";
import useUpdateTaskDescription from "../../hooks/task/useUpdateTaskDescription.js";

function TaskDescription({ taskId, initialDescription }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || "");

  const { mutate: updateTask, isPending } = useUpdateTaskDescription();

  useEffect(() => {
    setDescription(initialDescription || "");
  }, [initialDescription]);

  const handleSave = () => {
    updateTask(
      {
        taskId,
        description
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleCancel = () => {
    setDescription(initialDescription || "");
    setIsEditing(false);
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Description</p>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={description}
            autoFocus
            disabled={isPending}
            onChange={(e) => setDescription(e.target.value)}
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
        <div className="flex items-start gap-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description || "No description provided."}
          </p>
          <Pencil
            size={16}
            className="cursor-pointer mt-1 text-muted-foreground"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
}

export default TaskDescription;
