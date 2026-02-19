import { Button } from "../../components/ui/button";
import useDeleteTask from "../../hooks/task/useDeleteTask";

function TaskDeleteButton({ taskId }) {
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDelete = () => {
    deleteTask(taskId);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export default TaskDeleteButton;
