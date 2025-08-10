"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function TrendingHeader() {
  const [activeTab, setActiveTab] = useState<
    "projects" | "developers" | "organizations"
  >("projects");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-[#1E1E1E]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <h1 className="text-xl font-bold text-white">TecDev</h1>
          </div>

          {/* Search Bar */}
          <div className="mx-auto max-w-md flex-1 lg:mx-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-[#A0A0A0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-lg border border-gray-700 bg-[#121212] py-2 pr-4 pl-10 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex rounded-lg bg-[#121212] p-1">
            <button
              onClick={() => setActiveTab("projects")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "projects"
                  ? "bg-[#8B5CF6] text-white shadow-lg"
                  : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("developers")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "developers"
                  ? "bg-[#8B5CF6] text-white shadow-lg"
                  : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
              }`}
            >
              Developers
            </button>
            <button
              onClick={() => setActiveTab("organizations")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "organizations"
                  ? "bg-[#8B5CF6] text-white shadow-lg"
                  : "text-[#A0A0A0] hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
              }`}
            >
              Organizations
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
