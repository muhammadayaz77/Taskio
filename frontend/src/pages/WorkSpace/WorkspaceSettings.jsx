import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Building2,
  Loader2,
  ShieldAlert,
  Trash2,
  UserMinus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "../../components/common/Loader";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { workspaceSettingsFormSchema } from "../../lib/schema";
import { useWorkspaceForSettings } from "../../hooks/workspace/useWorkspaceForSettings";
import {
  useUpdateWorkspace,
  useDeleteWorkspace,
  useRemoveWorkspaceMember,
  useUpdateMemberRole,
} from "../../hooks/workspace/useWorkspaceSettingsMutations";

const ROLE_LABEL = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

export default function WorkspaceSettings() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const currentUserId = useSelector((s) => s.auth.user?._id);
  const { data: workspace, isLoading, isError } = useWorkspaceForSettings(
    workspaceId
  );
  const { mutateAsync: patchWorkspace, isPending: saving } =
    useUpdateWorkspace(workspaceId);
  const { mutateAsync: destroyWorkspace, isPending: deletingWs } =
    useDeleteWorkspace(workspaceId);
  const { mutateAsync: removeMember, isPending: removing } =
    useRemoveWorkspaceMember(workspaceId);
  const { mutateAsync: patchRole, isPending: roleSaving } =
    useUpdateMemberRole(workspaceId);

  const [removeTarget, setRemoveTarget] = useState(null);

  const myMembership = useMemo(() => {
    if (!workspace?.members || !currentUserId) return null;
    return workspace.members.find(
      (m) => String(m.user?._id) === String(currentUserId)
    );
  }, [workspace, currentUserId]);

  const canManage =
    myMembership &&
    (myMembership.role === "owner" || myMembership.role === "admin");
  const isOwner = myMembership?.role === "owner";

  const form = useForm({
    resolver: zodResolver(workspaceSettingsFormSchema),
    defaultValues: { name: "", description: "", color: "#6366f1" },
  });

  useEffect(() => {
    if (!workspace) return;
    form.reset({
      name: workspace.name || "",
      description: workspace.description || "",
      color: workspace.color || "#6366f1",
    });
  }, [workspace, form]);

  if (!workspaceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-600">
        No workspace selected.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-700">Workspace not found or no access.</p>
        <Button asChild className="mt-4 rounded-xl" variant="outline">
          <Link to="/workspaces">All workspaces</Link>
        </Button>
      </div>
    );
  }

  const onSaveWorkspace = async (values) => {
    if (!canManage) return;
    try {
      await patchWorkspace({
        name: values.name,
        description: values.description,
        color: values.color,
      });
      window.toastify?.("Workspace saved", "success");
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not save workspace",
        "error"
      );
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      await destroyWorkspace();
      window.toastify?.("Workspace deleted", "success");
      navigate("/workspaces", { replace: true });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not delete workspace",
        "error"
      );
    }
  };

  const handleRemoveOrLeave = async (userId) => {
    try {
      await removeMember(userId);
      window.toastify?.("Updated membership", "success");
      setRemoveTarget(null);
      const isSelf = String(userId) === String(currentUserId);
      if (isSelf) navigate("/workspaces", { replace: true });
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Action failed",
        "error"
      );
    }
  };

  const handleRoleChange = async (memberUserId, role) => {
    try {
      await patchRole({ memberUserId, role });
      window.toastify?.("Role updated", "success");
    } catch (e) {
      window.toastify?.(
        e?.response?.data?.message || "Could not change role",
        "error"
      );
    }
  };

  const memberPending = removing || roleSaving;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-indigo-50/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-200/25 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          to={`/workspaces/${workspaceId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeft className="size-4" />
          Back to workspace
        </Link>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-xl"
              style={{
                backgroundColor: workspace.color || "#6366f1",
              }}
            >
              {workspace.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Workspace settings
                </h1>
                <Badge variant="secondary" className="rounded-full">
                  <Building2 className="mr-1 size-3" />
                  {workspace.name}
                </Badge>
              </div>
              <p className="text-slate-600">
                Manage how this workspace looks and who belongs to it.
              </p>
            </div>
          </div>

          {!canManage ? (
            <div className="flex max-w-sm items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" />
              <p>
                <span className="font-semibold">View-only here.</span> Only
                owners and admins can change workspace details or membership.
              </p>
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl border-slate-200/90 shadow-lg shadow-indigo-100/50">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Name, accent color, and description shown on the workspace home.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSaveWorkspace)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!canManage}
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={!canManage}
                            className="min-h-[100px] rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent color</FormLabel>
                        <FormControl>
                          <Input
                            type="color"
                            disabled={!canManage}
                            className="h-12 w-full max-w-[140px] cursor-pointer rounded-xl border p-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={!canManage || saving}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200/90 shadow-lg">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Admins sit next to owners for management; viewers stay
                read-only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y rounded-2xl border border-slate-100 bg-slate-50/50">
                {workspace.members?.map((m, mi) => {
                  const uid = m.user?._id;
                  const isRowOwner = m.role === "owner";
                  const isSelf = String(uid) === String(currentUserId);
                  const showRoleSelect =
                    canManage &&
                    !isRowOwner &&
                    String(workspace.owner) !== String(uid);

                  return (
                    <div
                      key={uid ? String(uid) : `m-${mi}`}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-11 border border-white shadow">
                          {m.user?.profilePicture ? (
                            <AvatarImage
                              src={m.user.profilePicture}
                              alt=""
                            />
                          ) : null}
                          <AvatarFallback>
                            {m.user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {m.user?.name}{" "}
                            {isSelf ? (
                              <span className="text-slate-400">(you)</span>
                            ) : null}
                          </p>
                          <p className="truncate text-sm text-slate-500">
                            {m.user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isRowOwner ? (
                          <Badge className="rounded-full bg-violet-600 hover:bg-violet-600">
                            {ROLE_LABEL.owner}
                          </Badge>
                        ) : showRoleSelect ? (
                          <Select
                            disabled={memberPending}
                            value={m.role}
                            onValueChange={(v) => handleRoleChange(uid, v)}
                          >
                            <SelectTrigger className="w-[140px] rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="rounded-full">
                            {ROLE_LABEL[m.role] || m.role}
                          </Badge>
                        )}

                        {!isRowOwner && (canManage || isSelf) ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={memberPending}
                              className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => setRemoveTarget(String(uid))}
                            >
                              {isSelf ? (
                                <>
                                  <UserMinus className="mr-1 size-4" />
                                  Leave
                                </>
                              ) : (
                                <>
                                  <UserMinus className="mr-1 size-4" />
                                  Remove
                                </>
                              )}
                            </Button>
                            <AlertDialog
                              open={removeTarget === String(uid)}
                              onOpenChange={(open) => {
                                if (!open) setRemoveTarget(null);
                              }}
                            >
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {isSelf
                                    ? "Leave this workspace?"
                                    : "Remove member?"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isSelf
                                    ? "You will lose access until someone invites you again."
                                    : `${m.user?.name} will lose access immediately.`}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="rounded-xl bg-red-600 hover:bg-red-700"
                                  onClick={() => handleRemoveOrLeave(uid)}
                                >
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {isOwner ? (
            <Card className="rounded-3xl border-red-200/80 bg-red-50/30 shadow-md">
              <CardHeader>
                <CardTitle className="text-red-900">Danger zone</CardTitle>
                <CardDescription className="text-red-900/80">
                  Deleting removes all projects and tasks in this workspace.
                  This cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      disabled={deletingWs}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Delete workspace
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete {workspace.name}?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        All projects and tasks under this workspace will be
                        permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteWorkspace}
                      >
                        {deletingWs ? "Deleting…" : "Delete forever"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
