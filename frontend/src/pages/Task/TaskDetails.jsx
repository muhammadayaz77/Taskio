import useGetTask from "../../hooks/task/useGetTask";
import TaskInfoCard from "../../components/task/TaskInfoCard";
import {useParams} from 'react-router-dom'
import Loader from '../../components/common/Loader'

function TaskDetails() {
  const { taskId } = useParams();
  const { data, isLoading } = useGetTask(taskId);
  console.log("data : ",data)

  if (isLoading) return <Loader />;

  const task = data?.task;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TaskInfoCard task={task} />
    </div>
  );
}

export default TaskDetails