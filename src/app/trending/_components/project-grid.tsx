"use client";

import { api } from "~/trpc/react";
import type { z } from "zod";

import {
  ProjectCard,
  ProjectCardSkeleton,
} from "~/app/_components/ProjectCard";
import type { sortBySchema } from "~/utils/schemas/filters";
import { useRef, useCallback } from "react";

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
    hasNextPage,
    isFetchingNextPage,
  } = api.projects.getProjectIds.useInfiniteQuery(
    {
      limit: 3,
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

  const maxVisibleProject = useRef<number>(0);

  if (isLoading) {
    maxVisibleProject.current = 0;
  }

  const allProjects = projectIds?.pages.flatMap((page) => page.projects) ?? [];

  const setMaxVisibleProject = useCallback(
    (num: number) => {
      if (num > maxVisibleProject.current) {
        maxVisibleProject.current = num;
      }

      if (maxVisibleProject.current > allProjects.length) {
        maxVisibleProject.current = allProjects.length;
      }

      const isNearEnd = num >= allProjects.length - 2;
      if (isNearEnd && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [allProjects.length, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {allProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            position={index}
            setMaxVisibleProject={setMaxVisibleProject}
          />
        ))}
      </div>
      {(isLoading || isFetchingNextPage) && <ProjectCardSkeleton />}
      {!isLoading && (
        <div className="group rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200">
          {allProjects.length === 0 && (
            <p className="text-center text-gray-400">No projects found.</p>
          )}
          {!hasNextPage && allProjects.length !== 0 && (
            <p className="text-center text-gray-400">
              No additional projects found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
