"use client";

import {
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Button } from "~/app/_components/button";
import { programmingLanguages } from "~/utils/constants/languages";
import { sortByOptions } from "~/utils/constants/filters";
import { SearchableDropdown } from "~/app/_components/searchable-dropdown";
import { MultiSearchableDropdown } from "~/app/_components/multi-searchable-dropdown";
import { projectCategories } from "~/utils/constants/tags";
import { formatSortByOptions } from "~/utils/constants/filters";
import { useState } from "react";
import { arraysEqual } from "~/utils/arrays";
export interface Filter {
  searchText: string;
  categories: string[];
  languages: string[];
  sortBy: (typeof sortByOptions)[number];
  order: "asc" | "desc";
  tags: string[];
}

const filterModified = ({
  filter,
  searchText,
  categories,
  languages,
  sortBy,
  order,
  tags,
}: {
  filter: Filter;
  searchText: string;
  categories: string[];
  languages: string[];
  sortBy: (typeof sortByOptions)[number];
  order: "asc" | "desc";
  tags: string[];
}) => {
  return (
    !arraysEqual(filter.categories, categories) ||
    !arraysEqual(filter.languages, languages) ||
    filter.searchText !== searchText ||
    filter.sortBy !== sortBy ||
    filter.order !== order ||
    !arraysEqual(filter.tags, tags)
  );
};

export function FilterBar({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] =
    useState<(typeof sortByOptions)[number]>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [tags, setTags] = useState<string[]>([]);
  return (
    <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-[#E0E0E0]">
        Filter & Search
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-[#A0A0A0]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-lg border border-gray-700 bg-[#121212] py-2 pr-4 pl-10 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Language Filter */}
        <MultiSearchableDropdown
          options={programmingLanguages}
          value={languages}
          onChange={setLanguages}
          placeholder="Search languages..."
          label="Language"
        />

        {/* Categories Filter */}
        <MultiSearchableDropdown
          options={projectCategories}
          value={categories}
          onChange={setCategories}
          placeholder="Search categories..."
          label="Categories"
        />

        {/* Sort Filter */}
        <SearchableDropdown
          formatOptions={formatSortByOptions}
          options={sortByOptions}
          value={sortBy}
          onChange={(option) =>
            setSortBy(
              sortByOptions.find((target) => option === target) ?? "createdAt",
            )
          }
          placeholder="Search sort options..."
          label={
            <div className="flex flex-row items-center gap-x-2">
              <p>Sort by</p>
              {/* Order Filter */}
              <div
                className="rounded-lg p-1 hover:cursor-pointer hover:bg-[#2A2A2A]"
                onClick={() => {
                  setOrder(order === "asc" ? "desc" : "asc");
                }}
              >
                {order === "asc" ? (
                  <ArrowUpIcon className="h-4 w-4 font-bold text-[#A0A0A0]" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 font-bold text-[#A0A0A0]" />
                )}
              </div>
            </div>
          }
        />

        {filterModified({
          filter,
          categories,
          languages,
          searchText,
          sortBy,
          order,
          tags,
        }) && (
          <div className="mt-4">
            <Button
              className="px-3 py-2 text-sm"
              onClick={() => {
                setFilter({
                  searchText,
                  categories,
                  languages,
                  sortBy,
                  order,
                  tags,
                });
              }}
            >
              Apply Filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-[#A0A0A0]">
            <span>1,234 repositories found</span>
          </div>
        </div>
      </div>
    </div>
  );
}
