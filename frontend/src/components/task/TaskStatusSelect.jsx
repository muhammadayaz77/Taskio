import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import useUpdateTaskStatus from "../../hooks/task/useUpdateTaskStatus";

function TaskStatusSelect({ taskId, currentStatus }) {
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();

  const handleChange = (value) => {
    console.log(value)
    updateStatus({
      taskId,
      status: value,
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Change Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default TaskStatusSelect;
