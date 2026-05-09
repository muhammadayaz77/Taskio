import React, { useMemo, useState, useCallback } from "react";
import { useActiveWorkspaceId } from "../hooks/useActiveWorkspaceId";
import { useWorkspaceMembership } from "../hooks/useWorkspaceMembership";
import useGetWorkspacesById from "../hooks/workspace/useGetWorkspacesById";
import Loader from "../components/common/Loader";
import {
  Users,
  Lock,
  Layers,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Copy,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const ROLE_FILTER = [
  { id: "all", label: "All" },
  { id: "owner", label: "Owners" },
  { id: "member", label: "Members" },
];

const SORT_OPTIONS = [
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "role", label: "Role" },
];

function roleBadgeClass(role) {
  const r = String(role || "").toLowerCase();
  if (r === "owner")
    return "bg-rose-50 text-rose-700 ring-rose-100 ring-1 ring-inset";
  if (r === "member")
    return "bg-slate-100 text-slate-700 ring-slate-200/80 ring-1 ring-inset";
  return "bg-violet-50 text-violet-700 ring-violet-100 ring-1 ring-inset";
}

function formatJoined(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function Members() {
  const workspaceId = useActiveWorkspaceId();
  const { memberOf, denyClient } = useWorkspaceMembership(workspaceId);

  const { data, isLoading } = useGetWorkspacesById(workspaceId, {
    enabled: memberOf,
  });

  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [copiedId, setCopiedId] = useState(null);

  const workspace = data?.workspace;
  const members = workspace?.members || [];

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = members.filter((m) => {
      const name = m.user?.name ?? "";
      const email = m.user?.email ?? "";
      const matchSearch =
        !q ||
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q);
      const r = String(m.role || "").toLowerCase();
      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "owner" && r === "owner") ||
        (roleFilter === "member" && r === "member");
      return matchSearch && matchRole;
    });

    list = [...list].sort((a, b) => {
      const nameA = (a.user?.name || "").toLowerCase();
      const nameB = (b.user?.name || "").toLowerCase();
      const roleA = String(a.role || "").toLowerCase();
      const roleB = String(b.role || "").toLowerCase();

      if (sortBy === "name-asc") return nameA.localeCompare(nameB);
      if (sortBy === "name-desc") return nameB.localeCompare(nameA);
      if (sortBy === "role") {
        if (roleA !== roleB) return roleA.localeCompare(roleB);
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

    return list;
  }, [members, search, roleFilter, sortBy]);

  const copyEmail = useCallback(async (email, memberKey) => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(memberKey);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }, []);

  if (!workspaceId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Layers className="mx-auto mb-4 size-12 text-slate-300" />
        <p className="text-slate-600">
          Choose a workspace from the header to view members.
        </p>
      </div>
    );
  }

  if (denyClient) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Lock className="size-7" />
        </div>
        <p className="font-semibold text-slate-900">No access</p>
        <p className="mt-2 text-sm text-slate-600">
          Member lists are only available for workspaces you belong to. Select a
          workspace in the header.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const workspaceColor = workspace?.color || "#6366f1";
  const totalMembers = members.length;

  return (
    <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-200/25 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-violet-700 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="size-3.5" />
              People and roles
            </div>
            <div className="flex items-start gap-4">
              <div
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-violet-600/20"
                style={{ backgroundColor: workspaceColor }}
              >
                <Users className="size-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {workspace?.name ?? "Workspace"} members
                </h1>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Everyone with access to this workspace. Search, filter by role,
                  or switch layout.
                </p>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {totalMembers}
              </p>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-3 shadow-sm ring-1 ring-violet-100 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Showing
              </p>
              <p className="text-2xl font-bold tabular-nums text-violet-700">
                {filteredMembers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="h-11 w-full rounded-2xl border-slate-200 bg-white/95 pl-11 pr-4 text-sm shadow-inner focus-visible:ring-violet-500/30"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                <SlidersHorizontal className="size-3.5" />
                Role
              </span>
              {ROLE_FILTER.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRoleFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    roleFilter === f.id
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/25"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-500/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>

              <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  title="List view"
                  className={`flex size-8 items-center justify-center rounded-lg transition ${
                    view === "list"
                      ? "bg-violet-100 text-violet-800"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <List className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  title="Grid view"
                  className={`flex size-8 items-center justify-center rounded-lg transition ${
                    view === "grid"
                      ? "bg-violet-100 text-violet-800"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-20 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <Users className="size-8 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-800">
            {members.length === 0 ? "No members yet" : "No matches"}
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            {members.length === 0
              ? "When people join this workspace, they will show up here."
              : "Try a different search or change the role filter."}
          </p>
          {members.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-6 rounded-xl"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : view === "list" ? (
        <ul className="space-y-3">
          {filteredMembers.map((m) => {
            const key = m.user?._id || m._id;
            const name = m.user?.name || "Unknown";
            const email = m.user?.email || "";
            const initial = name.charAt(0).toUpperCase();
            const joined =
              formatJoined(m.jointAt) || formatJoined(m.joinedAt);

            return (
              <li key={key}>
                <div className="group flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner ring-2 ring-white"
                      style={{ backgroundColor: workspaceColor }}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="truncate">{email || "—"}</span>
                        {joined && (
                          <span className="text-slate-400">Joined {joined}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-16 sm:pl-0">
                    {email ? (
                      <button
                        type="button"
                        onClick={() => copyEmail(email, key)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        {copiedId === key ? (
                          <>
                            <Check className="size-3.5 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            Copy email
                          </>
                        )}
                      </button>
                    ) : null}
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadgeClass(m.role)}`}
                    >
                      {m.role || "member"}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((m) => {
            const key = m.user?._id || m._id;
            const name = m.user?.name || "Unknown";
            const email = m.user?.email || "";
            const initial = name.charAt(0).toUpperCase();
            const joined =
              formatJoined(m.jointAt) || formatJoined(m.joinedAt);

            return (
              <li key={key}>
                <div className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10">
                  <div
                    className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
                    style={{ backgroundColor: workspaceColor }}
                  >
                    {initial}
                  </div>
                  <p className="truncate font-semibold text-slate-900">{name}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{email}</p>
                  {joined && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      Joined {joined}
                    </p>
                  )}
                  <span
                    className={`mx-auto mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadgeClass(m.role)}`}
                  >
                    {m.role || "member"}
                  </span>
                  {email ? (
                    <button
                      type="button"
                      onClick={() => copyEmail(email, key)}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      {copiedId === key ? (
                        <>
                          <Check className="size-3.5 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          Copy email
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Members;
