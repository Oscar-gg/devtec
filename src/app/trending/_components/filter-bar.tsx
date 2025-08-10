"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function FilterBar() {
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [selectedSort, setSelectedSort] = useState("Stars");

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
    <div className="border-b border-gray-800 bg-[#1E1E1E] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Language Filter */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="min-w-[150px] cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
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

          {/* Time Period Filter */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="min-w-[120px] cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
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

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="min-w-[100px] cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
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

          {/* Results Count */}
          <div className="ml-auto flex items-center text-sm text-[#A0A0A0]">
            <span>Showing 1-25 of 1,234 repositories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
