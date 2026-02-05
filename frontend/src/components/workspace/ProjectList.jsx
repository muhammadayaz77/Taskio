import React from "react";
import { Button } from "@/components/ui/button";
import NoDataFound from "../common/NoDataFound";

function ProjectList({
  workspaceId,
  onCreateProject,
  projects,
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      {/* Project List */}
      <div className="space-y-2">
        {projects?.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
            key={project._id}
            project={project}
            progress={projectProgress}
            workspaceId={workspaceId}
            />
          ))
        ) : (
          <NoDataFound
          title="Not projects found"
          description="Create a project to get started"
          buttonText="Create Project"
          buttonAction={onCreateProject}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectList;
