import React from 'react'
import useGetMyTask from '../../hooks/task/useGetMyTask'

function MyTasks() {
    const {data,isLoading} = useGetMyTask();
    console.log("data : ",isLoading,data) 
  return (
    <div>
      tasks
    </div>
  )
}

export default MyTasks
