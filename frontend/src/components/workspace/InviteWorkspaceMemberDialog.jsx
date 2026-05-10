import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { inviteWorkspaceMemberSchema } from "../../lib/schema";
import { useInviteWorkspaceMember } from "../../hooks/workspace/useInviteWorkspaceMember";
import { useQueryClient } from "@tanstack/react-query";

export default function InviteWorkspaceMemberDialog({
  open,
  onOpenChange,
  workspaceId,
}) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useInviteWorkspaceMember(workspaceId);

  const form = useForm({
    resolver: zodResolver(inviteWorkspaceMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  useEffect(() => {
    if (!open) form.reset({ email: "", role: "member" });
  }, [open, form]);

  const onSubmit = async (values) => {
    try {
      await mutateAsync(values);
      window.toastify?.("Invitation email sent.", "success");
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      onOpenChange(false);
      form.reset({ email: "", role: "member" });
    } catch (err) {
      window.toastify?.(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Could not send invite",
        "error"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-slate-200">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Invite people
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            They will receive an email with a secure link. The link matches
            this address so they must sign in with the same account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="teammate@example.com"
                      className="rounded-xl"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Admin can invite others. Viewer is read-only.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-violet-600 hover:bg-violet-700"
              >
                {isPending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
