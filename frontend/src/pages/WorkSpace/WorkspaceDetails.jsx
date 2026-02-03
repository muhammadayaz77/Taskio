import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import useGetWorkspacesById from '../../hooks/workspace/useGetWorkspacesById'
import Loader from '../../components/common/Loader'
import WorkspaceHeader from '../../components/workspace/WorkspaceHeader';

function WorkspaceDetails() {
  const [isCreateProject,setIsCreateProject] = useState(false);
  const [isInviteMember,setIsInviteMember] = useState(false);
  const {workspaceId} = useParams()
  if(!workspaceId){
    return <div>No Workspace found</div>
  }
  if(isLoading){
    return <Loader />
  }
  const {data,isLoading} = useGetWorkspacesById(workspaceId);
  return (
    <div
    className='space-y-8'
    >
      <WorkspaceHeader
      workspace={data.workspace}
      members={data.workspace.members}
      onCreateProject={()=>setIsCreateProject(true)}
      onInviteMember={() => setIsInviteMember(true)}
      />
    </div>
  )
}

export default WorkspaceDetails