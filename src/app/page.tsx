"use client";
import { FilterBar, type Filter } from "./trending/_components/filter-bar";
import { LanguageChart } from "./trending/_components/language-chart";
import { ProjectGrid } from "./trending/_components/project-grid";
import { ProjectIcon } from "./_components/icons/project-icon";
import { useSession } from "next-auth/react";
import { Button } from "~/app/_components/button";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsPage() {
  const session = useSession();

  const [filter, setFilter] = useState<Filter>({
    searchText: "",
    categories: [],
    languages: [],
    sortBy: "updatedAt",
    order: "desc",
    tags: [],
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {session.data && (
            <Link href="/projects/editor">
              <Button className="mb-6 w-full">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <ProjectIcon className="h-5 w-5" />
                  <span>New Project</span>
                </div>
              </Button>
            </Link>
          )}
          <FilterBar setFilter={setFilter} filter={filter} />
          <div className="mt-6">
            <LanguageChart />
          </div>
        </div>

        {/* Repository Grid */}
        <div className="lg:col-span-2">
          <ProjectGrid
            searchText={filter.searchText}
            categories={filter.categories}
            languages={filter.languages}
            sortBy={filter.sortBy}
            order={filter.order}
            tags={filter.tags}
          />
        </div>
      </div>
    </main>
  );
}
