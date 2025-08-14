"use client";

import { Button } from "~/app/_components/button";
import { programmingLanguages } from "~/utils/constants/languages";
import { sortByOptions } from "~/utils/constants/filters";
import { SearchableDropdown } from "~/app/_components/searchable-dropdown";
import { MultiSearchableDropdown } from "~/app/_components/multi-searchable-dropdown";
import { projectCategories, tagNames } from "~/utils/constants/tags";
import { formatSortByOptions } from "~/utils/constants/filters";
import { useState } from "react";
import { arraysEqual } from "~/utils/arrays";
import { SearchBar } from "~/app/_components/searchbar";
import { OrderButton } from "~/app/_components/order";

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
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search repositories..."
        />
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

        {/* Tag Filter */}
        <MultiSearchableDropdown
          options={tagNames}
          value={tags}
          onChange={setTags}
          placeholder="Search tags..."
          label="Tags"
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
              <OrderButton order={order} setOrder={setOrder} />
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
      </div>
    </div>
  );
}
