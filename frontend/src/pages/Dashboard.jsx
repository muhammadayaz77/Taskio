import React from 'react'
import { Button } from '../components/ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/auth/authSlice'
import useGetWorkspaceStats from '../hooks/workspace/useGetWorkspaceStats'
import { useSearchParams } from 'react-router-dom'
import Loader from '../components/common/Loader'

function Dashboard() {
  const [searchParams] = useSearchParams();
 const workspaceId = searchParams.get("workspaceId");
  const {data,isPending} = useGetWorkspaceStats(workspaceId);
  if(isPending){  
    return <Loader />
  }
  console.log('data : dashboards : ',data)
  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard