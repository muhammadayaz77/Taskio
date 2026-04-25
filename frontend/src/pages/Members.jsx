import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useGetWorkspacesById from "../hooks/workspace/useGetWorkspacesById";
import { Users } from "lucide-react";

function Members() {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isLoading } = useGetWorkspacesById(workspaceId);

  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");

  const members = data?.workspace?.members || [];

  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.user.name.toLowerCase().includes(search.toLowerCase()) ||
      m.user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-6">
        {data?.workspace?.name} Members
      </h1>

      {/* Search */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Search members..."
          className="w-[400px] px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-300 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* View Toggle BELOW input */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-1.5 rounded-lg border transition ${
              view === "list"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-1.5 rounded-lg border transition ${
              view === "grid"
                ? "bg-black text-white"
                : "bg-white hover:bg-"
            }`}
          >
            Grid
          </button>
        </div>
      </div>
      {filteredMembers.length === 0 && (
  <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl">
    <Users size={40} className="text-gray-400 mb-3" />
    
    <p className="text-lg font-medium text-gray-700">
      No members found
    </p>
    
    <p className="text-sm text-gray-500">
      Try adjusting your search or invite new members
    </p>
  </div>
)}
      {/* LIST VIEW */}
      {view === "list" && (
        <div className="space-y-3">
          {filteredMembers.map((m) => (
            <div
              key={m._id}
              className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                {/* Avatar (first character) */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 font-semibold">
                  {m.user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-medium">{m.user.name}</p>
                  <p className="text-sm text-gray-500">{m.user.email}</p>
                </div>
              </div>

              {/* Role */}
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  m.role === "owner"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-12 gap-4">
          {filteredMembers.map((m) => (
            <div
              key={m._id}
              className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 px-6 py-12  border shadow-sm text-center transition hover:shadow-md"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center bg-gray-200 font-semibold">
                {m.user.name.charAt(0).toUpperCase()}
              </div>

              <p className="font-medium">{m.user.name}</p>
              <p className="text-xs text-gray-500 mb-2">
                {m.user.email}
              </p>

              <span
                className={`px-2 py-1 text-xs ${
                  m.role === "owner"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Members;