"use client";

import {
  StarIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface Repository {
  id: number;
  name: string;
  owner: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  todayStars: number;
  url: string;
  homepage?: string;
}

import { Button } from "~/app/_components/button";

export function RepositoryGrid() {
  const repositories: Repository[] = [
    {
      id: 1,
      name: "awesome-ai-tools",
      owner: "microsoft",
      description:
        "A curated list of AI tools and libraries for developers. Features the latest in machine learning, natural language processing, and computer vision.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 45632,
      forks: 8921,
      todayStars: 234,
      url: "https://github.com/microsoft/awesome-ai-tools",
      homepage: "https://ai-tools.dev",
    },
    {
      id: 2,
      name: "next-gen-framework",
      owner: "vercel",
      description:
        "Revolutionary React framework with built-in AI capabilities and edge-first architecture for modern web applications.",
      language: "TypeScript",
      languageColor: "#3178C6",
      stars: 32145,
      forks: 5672,
      todayStars: 189,
      url: "https://github.com/vercel/next-gen-framework",
    },
    {
      id: 3,
      name: "rust-web-server",
      owner: "tokio-rs",
      description:
        "Ultra-fast, memory-safe web server built with Rust. Outperforms traditional solutions with zero-cost abstractions.",
      language: "Rust",
      languageColor: "#CE422B",
      stars: 28934,
      forks: 3456,
      todayStars: 156,
      url: "https://github.com/tokio-rs/rust-web-server",
      homepage: "https://rust-server.io",
    },
    {
      id: 4,
      name: "dev-productivity-suite",
      owner: "google",
      description:
        "Complete productivity suite for developers including code analysis, automated testing, and performance optimization tools.",
      language: "Go",
      languageColor: "#00ADD8",
      stars: 19876,
      forks: 2890,
      todayStars: 98,
      url: "https://github.com/google/dev-productivity-suite",
    },
    {
      id: 5,
      name: "quantum-simulator",
      owner: "ibm",
      description:
        "Advanced quantum computing simulator with support for multiple qubit architectures and quantum algorithm development.",
      language: "Python",
      languageColor: "#3776AB",
      stars: 15432,
      forks: 2134,
      todayStars: 87,
      url: "https://github.com/ibm/quantum-simulator",
      homepage: "https://quantum.ibm.com",
    },
    {
      id: 6,
      name: "blockchain-toolkit",
      owner: "ethereum",
      description:
        "Comprehensive toolkit for blockchain development with smart contract templates and testing frameworks.",
      language: "JavaScript",
      languageColor: "#F7DF1E",
      stars: 12765,
      forks: 1876,
      todayStars: 76,
      url: "https://github.com/ethereum/blockchain-toolkit",
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="group cursor-pointer rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200 hover:border-[#8B5CF6]/50 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
          >
            {/* Repository Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-[#E0E0E0] transition-colors duration-200 group-hover:text-[#3B82F6]">
                    {repo.owner}/{repo.name}
                  </h3>
                  <span className="inline-flex items-center rounded-full bg-[#10B981]/20 px-2 py-1 text-xs font-medium text-[#10B981]">
                    +{repo.todayStars} today
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#A0A0A0]">
                  {repo.description}
                </p>
              </div>
            </div>

            {/* Repository Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Language */}
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span className="text-sm text-[#E0E0E0]">
                    {repo.language}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                  <StarIcon className="h-4 w-4" />
                  <span className="text-sm">{formatNumber(repo.stars)}</span>
                </div>

                {/* Forks */}
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{formatNumber(repo.forks)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-[#3B82F6]/20 px-3 py-1 text-sm font-medium text-[#3B82F6] transition-all duration-200 hover:bg-[#3B82F6]/30 hover:shadow-lg hover:shadow-[#3B82F6]/20"
                  >
                    <ArrowTopRightOnSquareIcon className="mr-1 h-4 w-4" />
                    Website
                  </a>
                )}
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-[#10B981]/20 px-3 py-1 text-sm font-medium text-[#10B981] transition-all duration-200 hover:bg-[#10B981]/30 hover:shadow-lg hover:shadow-[#10B981]/20"
                >
                  <EyeIcon className="mr-1 h-4 w-4" />
                  Visit GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <Button>Load More Repositories</Button>
      </div>
    </div>
  );
}
