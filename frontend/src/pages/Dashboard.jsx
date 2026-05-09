import React from 'react'
import useGetWorkspaceStats from '../hooks/workspace/useGetWorkspaceStats'
import { useActiveWorkspaceId } from '../hooks/useActiveWorkspaceId'
import { useWorkspaceMembership } from '../hooks/useWorkspaceMembership'
import Loader from '../components/common/Loader'
import StatsCard from '../components/dashboard/StatsCard'
import StatisticsCharts from '../components/dashboard/StatisticsCharts'
import RecentProjects from '../components/workspace/RecentProjects'
import UpcomingTasks from '../components/workspace/UpcomingTasks'


function Dashboard() {
  const workspaceId = useActiveWorkspaceId();
  const { memberOf, denyClient } = useWorkspaceMembership(workspaceId);
  const { data, isPending } = useGetWorkspaceStats(workspaceId, {
    enabled: memberOf,
  });

  if (!workspaceId) {
    return (
      <p className="text-gray-600">
        Choose a workspace from the header to see dashboard stats.
      </p>
    );
  }
  if (denyClient) {
    return (
      <p className="text-gray-600">
        You do not have access to this workspace. Choose one you are a member of in the header.
      </p>
    );
  }
  if (isPending) {
    return <Loader />;
  }
  // console.log('data : dashboards : ',data)
  return (
    <div>
      <StatsCard data={data?.stats} />
      <StatisticsCharts 
      stata={data.stats}
      projectStatusData={data.projectStatusData}
      taskPriorityData={data.taskPriorityData}
      taskTrendsData={data.taskTrendsData}
      workspaceProductivityData={data.workspaceProductivityData}
      />
      <div className="grid grid-cols-12 gap-6">
  <RecentProjects data={data.recentProjects} />
  <UpcomingTasks data={data.upcomingTasks} />
</div>
    </div>
  )
}

export default Dashboard