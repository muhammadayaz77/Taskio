import React from "react";
import { Button } from "../../components/ui/button";
import NoDataFound from "../common/NoDataFound";
import ProjectCard from "../project/ProjectCard";

function ProjectList({ workspaceId, onCreateProject, projects }) {
  const projectProgress = 25;

  return (
    <div className="space-y-4">
      {/* Project List */}
      {projects?.length > 0 ? (
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          gap-4
        ">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              progress={projectProgress}
              workspaceId={workspaceId}
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
