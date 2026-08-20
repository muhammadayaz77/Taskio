import React from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles, UserPlus } from "lucide-react"

function WorkspaceHeader({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
  canInvite = true,
}) {
  const firstLetter = workspace?.name?.charAt(0).toUpperCase()
  const memberList = Array.isArray(members) ? members : []

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
            style={{
              backgroundColor: workspace?.color || "#6366f1",
              boxShadow: `0 12px 40px -12px ${workspace?.color || "#6366f1"}66`,
            }}
          >
            {firstLetter}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              Workspace home
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 truncate max-w-full" title={workspace?.name}>
              {workspace?.name}
            </h2>
            <p className="text-sm text-slate-600">
              {workspace?.description || "Add a description in workspace settings."}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500">Members</span>
              <div className="flex -space-x-2">
                {memberList.map((member, index) => (
                  <Avatar
                    key={member?.user?._id || index}
                    className="h-9 w-9 border-2 border-white shadow-sm"
                  >
                    <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-800">
                      {member?.user?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-slate-200"
          >
            <Link to={`/workspaces/${workspace?._id}/chat`}>
              <MessageSquare size={16} className="mr-2" />
              Team chat
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={onInviteMember}
            disabled={!canInvite}
            title={
              !canInvite
                ? "Only workspace owners and admins can invite people."
                : undefined
            }
            className="rounded-xl border-slate-200 disabled:opacity-60"
          >
            <UserPlus size={16} className="mr-2" />
            Invite
          </Button>
          <Button
            onClick={onCreateProject}
            className="rounded-xl bg-violet-600 px-4 text-white shadow-md shadow-violet-600/25 hover:bg-violet-700"
          >
            Create project
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WorkspaceHeader
