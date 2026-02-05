import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea"; // for description
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";

function CreateProjectDialog({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState(
    workspaceMembers?.map((m) => ({ user: m.user._id, role: "member", selected: false })) || []
  );

  const handleMemberToggle = (userId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.user === userId ? { ...m, selected: !m.selected } : m
      )
    );
  };

  const handleCreate = () => {
    const selectedMembers = members.filter((m) => m.selected);

    // Basic validation
    if (!title.trim()) return alert("Title is required");
    if (!startDate || !dueDate) return alert("Start and due dates are required");
    if (new Date(startDate) > new Date(dueDate))
      return alert("Start date cannot be after due date");
    if (selectedMembers.length === 0) return alert("Select at least one member");

    const payload = {
      title,
      description,
      status,
      startDate,
      dueDate,
      members: selectedMembers.map(({ user, role }) => ({ user, role })),
      workspaceId,
    };

    console.log("Project payload:", payload);

    // TODO: call mutation here

    // Reset form
    setTitle("");
    setDescription("");
    setStatus("todo");
    setStartDate("");
    setDueDate("");
    setMembers(workspaceMembers?.map((m) => ({ user: m.user._id, role: "member", selected: false })) || []);

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Members */}
        <div className="">
          <p className="text-sm font-medium mb-2">Members</p>
          <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
            {members.map((member) => (
              <div key={member.user} className="flex items-center justify-between">
                <Checkbox
                  checked={member.selected}
                  onCheckedChange={() => handleMemberToggle(member.user)}
                />
                <span className="ml-2">{workspaceMembers.find(m => m.user._id === member.user)?.user.name}</span>
                <Select
                  value={member.role}
                  onValueChange={(val) =>
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.user === member.user ? { ...m, role: val } : m
                      )
                    )
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectDialog;
