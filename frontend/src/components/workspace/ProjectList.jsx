import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ProjectList({
  workspaceId,
  isOpen,
  onOpenChange,
  workspaceMembers,
}) {
  console.log("members : ", workspaceMembers);

  return (
    <div>
      {/* Trigger button */}
      <Button onClick={() => onOpenChange(true)}>
        Create Project
      </Button>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Workspace ID: {workspaceId}
          </p>

          {/* Members */}
          <div className="mt-4">
            <p className="font-medium mb-2">Members:</p>
            <div className="space-y-1">
              {workspaceMembers?.map((member) => (
                <p key={member._id} className="text-sm">
                  {member.user.name}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProjectList;
