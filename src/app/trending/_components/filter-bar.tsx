"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export function FilterBar() {
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [selectedSort, setSelectedSort] = useState("Stars");
  const [searchQuery, setSearchQuery] = useState("");

  const languages = [
    "All Languages",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "PHP",
    "Ruby",
    "Swift",
  ];

  const periods = ["Today", "This Week", "This Month"];
  const sortOptions = ["Stars", "Forks", "Issues", "Updated"];

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full rounded-lg border border-gray-700 bg-[#121212] py-2 pr-4 pl-10 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Language Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
            Language
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {languages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  className="bg-[#121212] text-[#E0E0E0]"
                >
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0]" />
          </div>
        </div>

        {/* Time Period Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
            Period
          </label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {periods.map((period) => (
                <option
                  key={period}
                  value={period}
                  className="bg-[#121212] text-[#E0E0E0]"
                >
                  {period}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0]" />
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
            Sort by
          </label>
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
            >
              {sortOptions.map((sort) => (
                <option
                  key={sort}
                  value={sort}
                  className="bg-[#121212] text-[#E0E0E0]"
                >
                  {sort}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0]" />
          </div>
        </div>

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
