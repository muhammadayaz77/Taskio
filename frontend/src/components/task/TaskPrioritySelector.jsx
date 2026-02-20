import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useUpdateTaskStatus from "../../hooks/task/useUpdateTaskStatus";
import useUpdateTaskPriority from "../../hooks/task/useUpdateTaskPriority";

function TaskPrioritySelector({ taskId, priority }) {
  const { mutate: updateStatus, isPending } = useUpdateTaskPriority();

  const handleChange = (value) => {
    console.log(value)
    updateStatus({
      taskId,
      priority: value,
    });
  };

  return (
    <Select
      defaultValue={priority}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Change Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Low">Low</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="High">High</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default TaskPrioritySelector;
