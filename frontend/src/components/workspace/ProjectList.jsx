import React from "react";
import { Button } from "../../components/ui/button";
import NoDataFound from "../common/NoDataFound";
import ProjectCard from "../project/ProjectCard";
import { getProjectProgress } from "../../utils/progress";

function ProjectList({ workspaceId, onCreateProject, projects, workspaceColor }) {

  return (
    <div className="space-y-4">
      {/* Project List */}
      {projects?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              progress={getProjectProgress(project)}
              workspaceId={workspaceId}
              accentColor={workspaceColor}
            />
          ))}
        </div>
      ) : (
        <NoDataFound
          title="No projects found"
          description="Create a project to get started"
          buttonText="Create Project"
          buttonAction={onCreateProject}
        />
      )}
    </div>
  );
}

export default ProjectList;
