import React, { useState } from "react";
import { Plus, Users, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateWorkspace from "../../components/workspace/CreateWorkspace";
import { useNavigate } from "react-router-dom";

const Workspaces = () => {
  const navigate = useNavigate();
  const { workspaces } = useSelector((store) => store.workspace);
  console.log("workspaces : s ",workspaces)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
    } catch (error) {
      return "N/A";
    }
  };

  const handleViewWorkspace = (workspaceId) => {
    // Navigate to workspace details
    navigate(`/workspaces/${workspaceId}`)
    console.log("View workspace:", workspaceId);
  };

  return (
    <div className="w-full min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
        <button
          onClick={() => setIsCreatingWorkspace(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span className="font-medium">Create Workspace</span>
        </button>
      </div>

      {/* Workspace Cards Grid */}
      {workspaces && workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace._id}
              workspace={workspace}
              formatDate={formatDate}
              onViewWorkspace={handleViewWorkspace}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <div className="text-7xl mb-4">📁</div>
          <p className="text-xl font-semibold mb-2 text-gray-700">
            No workspaces yet
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Create your first workspace to get started
          </p>
          <button
            onClick={() => setIsCreatingWorkspace(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Create Workspace</span>
          </button>
        </div>
      )}

      {/* Create Workspace Dialog */}
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

const WorkspaceCard = ({ workspace, formatDate, onViewWorkspace }) => {
  return (
    <div
      onClick={() => onViewWorkspace(workspace._id)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Workspace Header with Logo and Name */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg text-white text-lg font-bold flex-shrink-0"
          style={{ backgroundColor: workspace.color || "#6366f1" }}
        >
          {workspace.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {workspace.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <Calendar size={13} />
            <span>Created {formatDate(workspace.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Members Count */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Users size={16} className="text-gray-400" />
        <span className="font-medium">
          {workspace.members?.length || 0} member
          {workspace.members?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
        {workspace.description || "No description provided"}
      </p>

      {/* View Details Link */}
      <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium group-hover:gap-2.5 transition-all">
        <span>View workspace details and projects</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default Workspaces;