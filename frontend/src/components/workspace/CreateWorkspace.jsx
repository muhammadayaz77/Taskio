import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useCreateWorkspace} from '../../hooks/workspace/useCreateWorkspace'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { workspaceSchema } from "../../lib/schema";

/* ------------------ Color Options ------------------ */
const colorOptions = [
  "#3B82F6", // Blue
  "#14B8A6", // Teal
  "#6366F1", // Indigo
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#8B5CF6", // Violet
];



function CreateWorkspace({ isCreatingWorkspace, setIsCreatingWorkspace }) {

  const {mutate,isPending} = useCreateWorkspace()
  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: colorOptions[0],
      description: "",
    },
  });

  const selectedColor = form.watch("color");

  const onSubmit = (data) => {
    console.log("Workspace Data:", data);
    mutate(
      data,{
        onSuccess :() => {
          form.reset();
          setIsCreatingWorkspace(false)
        },
        onError : (err) => {
          console.log('Error : ',err)
        }
      }
    )
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Workspace Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Workspace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Workspace Color */}
            <FormField
              control={form.control}
              name="color"
              render={() => (
                <FormItem>
                  <FormLabel>Workspace Color</FormLabel>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => form.setValue("color", color)}
                        className={`h-7 w-7 rounded-full border-2 transition cursor-pointer ${
                          selectedColor === color
                            ? "border-black scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What is this workspace for?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreatingWorkspace(false)}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button type="submit"
              className='cursor-pointer'
              >Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspace;
