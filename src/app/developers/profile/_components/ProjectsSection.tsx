import { ProjectCard } from "~/app/_components/card/ProjectCard";

export interface ArrayId {
  id: string;
}

export function ProjectsSection({ projects }: { projects: ArrayId[] }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">
        Related Projects
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map(({ id }) => (
          <ProjectCard key={id} projectId={id} diableLinks />
        ))}
      </div>
    </div>
  );
}
