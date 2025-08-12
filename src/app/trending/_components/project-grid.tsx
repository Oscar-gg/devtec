"use client";

import { api } from "~/trpc/react";

import { Button } from "~/app/_components/button";
import { ProjectCard } from "~/app/_components/ProjectCard";

export function ProjectGrid() {
  const {
    data: projectIds,
    isLoading,
    fetchNextPage,
  } = api.projects.getProjectIds.useInfiniteQuery(
    {
      limit: 5,
      text: "",
      category: undefined,
      programmingLanguage: undefined,
      sortBy: "updatedAt",
      order: "desc",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const allProjects = projectIds?.pages.flatMap((page) => page.projects) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {allProjects.map((project) => (
          <ProjectCard key={project.id} projectId={project.id} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={async () => {
            await fetchNextPage();
          }}
        >
          Load More Repositories
        </Button>
      </div>
    </div>
  );
}
