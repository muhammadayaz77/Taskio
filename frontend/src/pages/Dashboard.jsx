import React from 'react'
import { Button } from '../components/ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/auth/authSlice'
import useGetWorkspaceStats from '../hooks/workspace/useGetWorkspaceStats'
import { useSearchParams } from 'react-router-dom'
import Loader from '../components/common/Loader'
import StatsCard from '../components/dashboard/StatsCard'
import StatisticsCharts from '../components/dashboard/StatisticsCharts'
import RecentProjects from '../components/workspace/RecentProjects'

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
      <h1>Dashboard</h1>
      <StatsCard data={data.stats} />
      <StatisticsCharts 
      stata={data.stats}
      projectStatusData={data.projectStatusData}
      taskPriorityData={data.taskPriorityData}
      taskTrendsData={data.taskTrendsData}
      workspaceProductivityData={data.workspaceProductivityData}
      />
      <div className="grid grid-cols-12 gap-6">
  <RecentProjects data={data.recentProjects} />
  {/* <StatisticsCharts ... /> */}
</div>
    </div>
  )
}

export default Dashboard