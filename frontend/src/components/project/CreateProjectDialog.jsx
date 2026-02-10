import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateProject from "../../hooks/project/useCreateProject";

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

import { projectSchema } from "../../lib/schema"; // adjust path if needed

function CreateProjectDialog({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}) {
  const { mutate, isPending } = useCreateProject();

  /* ---------------- RHF ---------------- */
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Planning",
      startDate: "",
      dueDate: "",
      members: [],
    },
  });

  /* ---------------- Members UI State ---------------- */
  const [members, setMembers] = useState(
    workspaceMembers?.map((m) => ({
      userId: m.user._id,
      selected: false,
      role: "member",
    })) || [],
  );

  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* -------- Sync selected members → RHF -------- */
  useEffect(() => {
    const selectedMembers = members
      .filter((m) => m.selected)
      .map((m) => ({
        user: m.userId,
        role: m.role,
      }));

    setValue("members", selectedMembers, { shouldValidate: true });
  }, [members, setValue]);

  /* -------- Close dropdown on outside click -------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMembersDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Submit ---------------- */
  const onSubmit = (data) => {
    const payload = {
      ...data,
      workspaceId,
    };

    console.log("FINAL PROJECT PAYLOAD:", payload);

    mutate(payload, {
      onSuccess: () => {
        reset();
        setMembers(
          workspaceMembers?.map((m) => ({
            userId: m.user._id,
            selected: false,
            role: "member",
          })) || [],
        );
        setMembersDropdownOpen(false);
        onOpenChange(false);
      },
    });
  };

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId ? { ...m, selected: !m.selected } : m,
      ),
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
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter project description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="text-sm font-medium">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">
              {errors.status.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              {...register("startDate")}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              {...register("dueDate")}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="mb-3 relative" ref={dropdownRef}>
          <p className="text-sm font-medium mb-1">Members</p>

          <div
            onClick={() => setMembersDropdownOpen(!membersDropdownOpen)}
            className={`border rounded px-3 py-2 cursor-pointer flex justify-between items-center ${
              errors.members ? "border-red-500" : "border-gray-300"
            }`}
          >
            <span>
              {members.filter((m) => m.selected).length
                ? `${members.filter((m) => m.selected).length} member(s) selected`
                : "Select members"}
            </span>
            <span>▾</span>
          </div>

          {membersDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
              {workspaceMembers.map((wm) => {
                const memberState = members.find(
                  (m) => m.userId === wm.user._id,
                );
                const isSelected = memberState?.selected;

                return (
                  <div
                    key={wm.user._id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-100"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleMember(wm.user._id)}
                    >
                      <input type="checkbox" checked={isSelected} readOnly />
                      <span>{wm.user.name}</span>
                    </div>

                    {isSelected && (
                      <Select
                        value={memberState.role}
                        onValueChange={(val) =>
                          setMembers((prev) =>
                            prev.map((m) =>
                              m.userId === wm.user._id
                                ? { ...m, role: val }
                                : m,
                            ),
                          )
                        }
                      >
                        <SelectTrigger
                          className="w-28"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="contributor">Contributor</SelectItem>
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
            <p className="text-xs text-red-500 mt-1">
              {errors.members.message}
            </p>
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
          <Button size="sm" onClick={handleSubmit(onSubmit)}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectDialog;
