import { useState, useEffect } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Pencil } from "lucide-react";
import useUpdateTask from "../../hooks/task/useUpdateTittleName.js";

function TaskDescription({ taskId, initialDescription }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || "");

  // const { mutate: updateTask, isPending } = useUpdateTask();

  useEffect(() => {
    setDescription(initialDescription || "");
  }, [initialDescription]);

  const handleSave = () => {
    setIsEditing(false);

    if (description !== initialDescription) {
      updateTask({
        taskId,
        data: { description }
      });
    }
  };

  return (
    <div>
      <p className="text-sm font-medium mb-2">Description</p>

      {isEditing ? (
        <Textarea
          value={description}
          autoFocus
          disabled={isPending}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSave}
        />
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
