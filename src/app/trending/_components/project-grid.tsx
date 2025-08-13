"use client";

import { api } from "~/trpc/react";
import { z } from "zod";

import { Button } from "~/app/_components/button";
import { ProjectCard } from "~/app/_components/ProjectCard";
import type { sortBySchema } from "~/utils/schemas/filters";

export function ProjectGrid({
  searchText,
  categories,
  languages,
  sortBy,
  order,
  tags,
}: {
  searchText?: string;
  categories?: string[];
  languages?: string[];
  sortBy?: z.infer<typeof sortBySchema>;
  order?: "asc" | "desc";
  tags?: string[];
}) {
  const {
    data: projectIds,
    isLoading,
    fetchNextPage,
  } = api.projects.getProjectIds.useInfiniteQuery(
    {
      limit: 5,
      text: searchText,
      category: categories,
      programmingLanguage: languages,
      sortBy: sortBy,
      order: order,
      tags: tags,
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
