import React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

function WorkspaceHeader({ workspace, members, onCreateProject, onInviteMember }) {
  const firstLetter = workspace?.name?.charAt(0).toUpperCase()
  console.log("members : ",members)

  return (
    <div className="flex items-center justify-between bg-white">
      
      {/* LEFT SIDE */}
      <div className="flex items-start gap-4">
        
        {/* Workspace Icon */}
        <div
          className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
          style={{ backgroundColor: workspace?.color }}
        >
          {firstLetter}
        </div>

        {/* Workspace Info */}
        <div>
          <h2 className="text-lg font-semibold">{workspace?.name}</h2>
          <p className="text-sm text-gray-500">{workspace?.description}</p>
         <div className="flex items-center gap-2 mt-2">
  <p className="text-sm text-gray-500">Members</p>

  <div className="flex items-center -space-x-2">
    {members.map((member, index) => (
      <Avatar
        key={index}
        className="h-8 w-8 border-2 border-white"
      >
        <AvatarFallback className="text-xs font-medium">
          {member?.user?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    ))}
  </div>
</div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        
        {/* Invite Button */}
        <Button
          variant="outline"
          onClick={onInviteMember}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Invite
        </Button>

        {/* Create Project Button */}
        <Button
          onClick={onCreateProject}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Create Project
        </Button>
      </div>
    </div>
  )
}

export default WorkspaceHeader
