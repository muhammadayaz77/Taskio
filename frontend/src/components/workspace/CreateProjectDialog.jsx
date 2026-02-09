import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

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

  // Members state: userId, selected, role
  const [members, setMembers] = useState(
    workspaceMembers?.map((m) => ({
      userId: m.user._id,
      selected: false,
      role: "contributor", // default role
    })) || []
  );

  const [errors, setErrors] = useState({});
  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close members dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMembersDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (startDate && dueDate && new Date(startDate) > new Date(dueDate))
      newErrors.dueDate = "Due date must be after start date";
    if (!members.some((m) => m.selected))
      newErrors.members = "Select at least one member";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const payload = {
  title,
  description,
  status,
  startDate,
  dueDate,
  workspaceId,
  members: members
    .filter((m) => m.selected)
    .map((m) => ({
      user: m.userId,
      role: m.role,
    })),
};

console.log("FINAL PROJECT PAYLOAD:", payload);


    // Reset form
    setTitle("");
    setDescription("");
    setStatus("todo");
    setStartDate("");
    setDueDate("");
    setMembers(
      workspaceMembers?.map((m) => ({
        userId: m.user._id,
        selected: false,
        role: "contributor",
      })) || []
    );
    setErrors({});
    setMembersDropdownOpen(false);
    onOpenChange(false);
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, selected: !m.selected } : m
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-base">Create Project</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div className="mb-3">
          <label className="text-sm font-medium">Project Name</label>
          <Input
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="mb-3">
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
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="mb-3 relative" ref={dropdownRef}>
          <p className="text-sm font-medium mb-1">Members</p>

          {/* Trigger */}
          <div
            onClick={() => setMembersDropdownOpen(!membersDropdownOpen)}
            className={`border rounded px-3 py-2 cursor-pointer flex justify-between items-center ${
              errors.members ? "border-red-500" : "border-gray-300"
            }`}
          >
            <span>
              {members.filter((m) => m.selected).length > 0
                ? `${members.filter((m) => m.selected).length} member${
                    members.filter((m) => m.selected).length > 1 ? "s" : ""
                  } selected`
                : "Select members"}
            </span>
            <span className="ml-2">▾</span>
          </div>

          {/* Dropdown panel */}
          {membersDropdownOpen && (
            <div   className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto" >
              {workspaceMembers.map((wm) => {
                const memberState = members.find(
                  (m) => m.userId === wm.user._id
                );
                const isSelected = memberState?.selected || false;

                return (
                  <div
  key={wm.user._id}
  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
>
  {/* LEFT: checkbox + name */}
  <div
    className="flex items-center gap-2 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      toggleMember(wm.user._id);
    }}
  >
    <input
      type="checkbox"
      checked={isSelected}
      readOnly
      className="pointer-events-none"
    />
    <span>{wm.user.name}</span>
  </div>

  {/* RIGHT: role select */}
  {isSelected && (
    <Select
      value={memberState.role}
      onValueChange={(val) => {
        setMembers((prev) =>
          prev.map((m) =>
            m.userId === wm.user._id ? { ...m, role: val } : m
          )
        );
      }}
    >
      <SelectTrigger
        className="w-28"
        onMouseDown={(e) => e.stopPropagation()} // ⭐ VERY IMPORTANT
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent onMouseDown={(e) => e.stopPropagation()}>
        <SelectItem value="contributor">Contributor</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>

                );
              })}
            </div>
          )}

          {errors.members && (
            <p className="text-xs text-red-500 mt-1">{errors.members}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
          
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectDialog;
