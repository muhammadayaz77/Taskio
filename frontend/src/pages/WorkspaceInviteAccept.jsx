import React, { useMemo } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, LogIn, Shield, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import useWorkspaceInvitePreview from "../hooks/workspace/useWorkspaceInvitePreview";
import useAcceptWorkspaceInvite from "../hooks/workspace/useAcceptWorkspaceInvite";

const ROLE_DESCRIPTION = {
  admin: "You will be added as an admin.",
  member: "You will be added as a full member.",
  viewer: "You will get read-only access.",
};

export default function WorkspaceInviteAccept() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const { data, isLoading, isError, error } = useWorkspaceInvitePreview(token);
  const { mutateAsync, isPending: isAccepting } = useAcceptWorkspaceInvite();

  const inviteReturnState = useMemo(
    () => ({
      pathname: "/workspace-invite",
      search: token ? `?token=${encodeURIComponent(token)}` : "",
    }),
    [token]
  );

  const handleAccept = async () => {
    if (!token) return;
    try {
      const res = await mutateAsync({ token });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", res.workspaceId],
      });
      window.toastify?.(res.message || "You're in!", "success");
      if (res.workspaceId) {
        navigate(`/workspaces/${res.workspaceId}`, { replace: true });
      }
    } catch (err) {
      window.toastify?.(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          "Couldn't accept invitation",
        "error"
      );
    }
  };

  const noToken = !token;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-200/50 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            <Building2 className="size-4" />
            Taskio
          </Link>
        </div>

        {noToken ? (
          <Card className="rounded-3xl border-slate-200/80 shadow-lg shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="text-xl">Missing invitation</CardTitle>
              <CardDescription>
                Open the link from your email — it contains a secure token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link to="/sign-in">Go to sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card className="rounded-3xl border-slate-200/80 shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <Loader2 className="size-10 animate-spin text-violet-600" />
              <p className="text-sm text-slate-600">Loading your invitation…</p>
            </CardContent>
          </Card>
        ) : isError ? (
          <Card className="rounded-3xl border-red-100 bg-white shadow-lg shadow-red-100/40">
            <CardHeader>
              <CardTitle className="text-xl text-red-800">
                Invite unavailable
              </CardTitle>
              <CardDescription className="text-red-900/70">
                {error?.response?.data?.message ||
                  "This link may have expired. Ask your teammate to send a new invite."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild className="rounded-xl bg-violet-600 hover:bg-violet-700">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/sign-in">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-3xl border-slate-200/80 shadow-xl shadow-violet-200/30 ring-1 ring-violet-100/60">
            <CardHeader className="space-y-4 pb-2">
              <div className="flex items-start gap-4">
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                  style={{
                    backgroundColor: data.workspace?.color || "#6366f1",
                  }}
                >
                  {data.workspace?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-violet-100 text-violet-800"
                  >
                    <Shield className="size-3" aria-hidden />
                    Workspace invite
                  </Badge>
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                    Join {data.workspace?.name}
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600">
                    {data.workspace?.description ||
                      "Collaborate with your team on Taskio."}
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700">
                <div className="flex min-w-[140px] flex-1 flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Role offered
                  </span>
                  <span className="font-semibold capitalize">{data.role}</span>
                  <span className="text-xs text-slate-500">
                    {ROLE_DESCRIPTION[data.role] ||
                      ROLE_DESCRIPTION.member}
                  </span>
                </div>
                <Separator orientation="vertical" className="hidden h-auto sm:block" />
                <div className="flex min-w-[140px] flex-1 flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Invite for
                  </span>
                  <span className="font-mono text-sm">{data.invitedEmailMasked}</span>
                  <span className="text-xs text-slate-500">
                    Sign in with this exact email to accept.
                  </span>
                </div>
              </div>

              {data.inviter?.name ? (
                <p className="text-sm text-slate-600">
                  Invited by{" "}
                  <span className="font-medium text-slate-900">
                    {data.inviter.name}
                  </span>
                </p>
              ) : null}
            </CardHeader>

            <CardContent className="space-y-3 pt-2">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-slate-600">
                    Signed in as{" "}
                    <span className="font-medium text-slate-900">
                      {user?.email}
                    </span>
                  </p>
                  <Button
                    size="lg"
                    className="w-full rounded-xl bg-violet-600 text-base hover:bg-violet-700"
                    disabled={isAccepting}
                    onClick={handleAccept}
                  >
                    {isAccepting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Joining…
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 size-5" />
                        Accept &amp; join workspace
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-600">
                    Sign in (or create an account with the invited email),
                    then you can accept this invite in one click.
                  </p>
                  <Button
                    size="lg"
                    asChild
                    className="w-full rounded-xl bg-violet-600 text-base hover:bg-violet-700"
                  >
                    <Link to="/sign-in" state={{ from: inviteReturnState }}>
                      <LogIn className="mr-2 size-5" />
                      Sign in to accept
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-xl border-slate-200"
                  >
                    <Link to="/sign-up" state={{ from: inviteReturnState }}>
                      Create an account
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          Invitations expire after 7 days for your security.
        </p>
      </div>
    </div>
  );
}
