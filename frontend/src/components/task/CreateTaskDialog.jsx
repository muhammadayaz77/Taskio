import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "../../lib/schema";
import { useCreateTask } from "../../hooks/task/useCreateTask";

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

function CreateTaskDialog({ isOpen, onOpenChange, projectId, projectMembers }) {
  const { mutate, isPending } = useCreateTask();


  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  /* ---------------- Assignee UI State ---------------- */

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const formatted = selectedUsers.map((id) => ({
      user: id,
    }));
    setValue("assignees", formatted, { shouldValidate: true });
  }, [selectedUsers, setValue]);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  /* ---------------- Submit ---------------- */

  const onSubmit = (data) => {
    console.log("submit : ",data)
    const payload = {
      taskData : data,
      projectId,
    };

    mutate(payload, {
      onSuccess: () => {
        reset();
        setSelectedUsers([]);
        onOpenChange(false);
      },
    });
  };

  return (
   <Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[420px] p-4 rounded-xl max-h-[90vh] overflow-y-auto">
    
    <DialogHeader className="pb-1">
      <DialogTitle className="text-sm font-semibold">
        Create Task
      </DialogTitle>
    </DialogHeader>

    <div className="flex flex-col gap-2">

      {/* Title */}
      <div>
        <label className="text-xs font-medium">Task Title</label>
        <Input
          {...register("title")}
          className="h-8 mt-1"
        />
        {errors.title && (
          <p className="text-[10px] text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-medium">Description</label>
        <Textarea
          {...register("description")}
          className="min-h-[60px] mt-1"
        />
        {errors.description && (
          <p className="text-[10px] text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status & Priority */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full h-8 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="text-xs font-medium">Due Date</label>
        <Input
          type="date"
          {...register("dueDate")}
          className="h-8 mt-1"
        />
        {errors.dueDate && (
          <p className="text-[10px] text-red-500">
            {errors.dueDate.message}
          </p>
        )}
      </div>

      {/* Assignees */}
      <div ref={dropdownRef} className="relative">
        <label className="text-xs font-medium">Assignees</label>

        <div
          onClick={() => setOpen(!open)}
          className="border rounded-md h-8 px-2 mt-1 flex items-center justify-between text-xs cursor-pointer"
        >
          {selectedUsers.length
            ? `${selectedUsers.length} selected`
            : "Select assignees"}
          <span>▾</span>
        </div>

        {open && (
          <div className="absolute w-full bg-white border rounded shadow mt-1 max-h-36 overflow-y-auto z-10">
            {projectMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 text-xs cursor-pointer"
                onClick={() => toggleUser(m._id)}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(m._id)}
                  readOnly
                />
                <span>{m.user.name}</span>
              </div>
            ))}
          </div>
        )}

        {errors.assignees && (
          <p className="text-[10px] text-red-500 mt-1">
            {errors.assignees.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </div>

    </div>
  </DialogContent>
</Dialog>

  );
}

export default CreateTaskDialog;
