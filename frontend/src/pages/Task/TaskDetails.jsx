import useGetTask from "../../hooks/task/useGetTask";
import TaskInfoCard from "../../components/task/TaskInfoCard";
import TaskLogs from "../../components/task/TaskLogs";
import TaskDetailsHeader from "../../components/task/TaskDetailsHeader"; // 👈 new
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";

function TaskDetails() {
  const { taskId } = useParams();
  const { data, isLoading } = useGetTask(taskId);

  if (isLoading) return <Loader />;

  const { task, project } = data;
  console.log("task : ",task)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <TaskDetailsHeader
        title={task.title}
        isWatching={task.isWatching}
        isArchived={task.isArchived}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <TaskInfoCard task={task} projectMembers={project.members} />
        </div>

        <div className="rounded-xl">
          <TaskLogs taskId={taskId} />
        </div>

      </div>
    </div>
  );
}

export default TaskDetails;