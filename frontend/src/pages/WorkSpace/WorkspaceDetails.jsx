import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetWorkspacesById from '../../hooks/workspace/useGetWorkspacesById'
import Loader from '../../components/common/Loader'
import WorkspaceHeader from '../../components/workspace/WorkspaceHeader';
import ProjectList from '../../components/workspace/ProjectList';
import CreateProjectDialog from '../../components/project/CreateProjectDialog';
import InviteWorkspaceMemberDialog from '../../components/workspace/InviteWorkspaceMemberDialog'

function WorkspaceDetails() {
  const [isCreateProject,setIsCreateProject] = useState(false);
  const [isInviteMember,setIsInviteMember] = useState(false);
  const {workspaceId} = useParams();
  const {data,isLoading} = useGetWorkspacesById(workspaceId);
  const currentUserId = useSelector((s) => s.auth.user?._id)

  const canInvite = useMemo(() => {
    const members = data?.workspace?.members
    if (!Array.isArray(members) || !currentUserId) return false
    const mine = members.find(
      (m) => String(m?.user?._id) === String(currentUserId)
    )
    return mine && ["owner", "admin"].includes(mine.role)
  }, [currentUserId, data?.workspace?.members])
  
  if(!workspaceId){
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        No workspace selected.
      </div>
    )
  }
  if(isLoading){
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-2 pb-16 sm:px-4">
      <WorkspaceHeader
      workspace={data.workspace}
      members={data?.workspace?.members}
      onCreateProject={()=>setIsCreateProject(true)}
      onInviteMember={() => setIsInviteMember(true)}
      canInvite={canInvite}
      />
      <ProjectList
      workspaceId={workspaceId}
      onCreateProject={() => setIsCreateProject(true)}
      projects={data?.project}
      workspaceColor={data?.workspace?.color}
      />
        <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data?.workspace?.members}
      />
      <InviteWorkspaceMemberDialog
        open={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
      />
    </div>
  )
}

export default WorkspaceDetails