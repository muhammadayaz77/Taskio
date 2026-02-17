import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function TaskDetails() {
  const {workspaceId,projectId,taskId} = useParams();
  const navigate = useNavigate();

  const {data,isLoading} = useGetTask()
  return (
    <div>TaskDetails</div>
  )
}

export default TaskDetails