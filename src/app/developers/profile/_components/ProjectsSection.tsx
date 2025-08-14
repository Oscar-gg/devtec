import { type RouterOutputs } from "~/trpc/react";
import { ProjectCard } from "~/app/_components/ProjectCard";
type UserProjects = RouterOutputs["user"]["getPublicProfile"]["UserProject"];

interface ProjectsSectionProps {
  userProjects: UserProjects;
}

export function ProjectsSection({ userProjects }: ProjectsSectionProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Related Projects
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {userProjects.map(({ project }) => (
          <ProjectCard key={project.id} projectId={project.id} diableLinks />
        ))}
      </div>
    </div>
  );
}
