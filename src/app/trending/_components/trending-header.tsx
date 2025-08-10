"use client";

import { useState } from "react";

export function TrendingHeader() {
  const [activeTab, setActiveTab] = useState<
    "projects" | "developers" | "organizations"
  >("projects");

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

          <div className="flex items-center gap-4">
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

            {/* GitHub Login Button */}
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-[#121212] px-4 py-2 text-sm font-medium text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#1E1E1E] hover:shadow-lg hover:shadow-[#8B5CF6]/20">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Log in with GitHub
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
