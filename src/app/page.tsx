"use client";
import { FilterBar } from "./trending/_components/filter-bar";
import { LanguageChart } from "./trending/_components/language-chart";
import { ProjectGrid } from "./trending/_components/project-grid";
import { ProjectIcon } from "./_components/icons/project-icon";
import { useSession } from "next-auth/react";
import { Button } from "~/app/_components/button";
import Link from "next/link";
import { useState } from "react";
import type { sortByOptions } from "~/utils/constants/filters";

export default function ProjectsPage() {
  const session = useSession();

  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] =
    useState<(typeof sortByOptions)[number]>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [tags, setTags] = useState<string[]>([]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {session.data && (
            <Link href="/projects/create">
              <Button className="mb-6 w-full">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <ProjectIcon className="h-5 w-5" />
                  <span>New Project</span>
                </div>
              </Button>
            </Link>
          )}
          <FilterBar
            languages={languages}
            searchText={searchText}
            categories={categories}
            sortBy={sortBy}
            order={order}
            tags={tags}
            setSearchText={setSearchText}
            setCategories={setCategories}
            setLanguages={setLanguages}
            setSortBy={setSortBy}
            setOrder={setOrder}
            setTags={setTags}
          />
          <div className="mt-6">
            <LanguageChart />
          </div>
        </div>

        {/* Repository Grid */}
        <div className="lg:col-span-2">
          <ProjectGrid
            searchText={searchText}
            categories={categories}
            languages={languages}
            sortBy={sortBy}
            order={order}
            tags={tags}
          />
        </div>
      </div>
    </main>
  );
}
