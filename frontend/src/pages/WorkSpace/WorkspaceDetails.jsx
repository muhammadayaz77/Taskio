import React from 'react'
import { useParams } from 'react-router-dom'

function WorkspaceDetails() {
  const {workspaceId} = useParams()
  if(!workspaceId){
    return <div>No Workspace found</div>
  }
  return (
    <div>WorkspaceDetails {workspaceId}</div>
  )
}

export default WorkspaceDetails