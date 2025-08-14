"use client";
import { api } from "~/trpc/react";
import { getColorByLanguage } from "~/utils/constants/colors";

export function LanguageChart() {
  const { data: languageStats, isLoading } = api.projects.getStats.useQuery();

  // Calculate cumulative percentages for the conic gradient
  let cumulative = 0;
  const gradientStops = languageStats?.languages
    .map((lang, index) => {
      const start = cumulative;
      cumulative += languageStats?.percentages[index] ?? 0;
      return `${getColorByLanguage(lang)} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
        Language Distribution
      </h2>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="w-full animate-pulse">
            <div className="mx-auto mb-6 h-48 w-48 rounded-full bg-[#121212]"></div>
            <div className="mb-3 h-7 w-full rounded bg-[#121212]"></div>
            <div className="mb-3 h-7 w-full rounded bg-[#121212]"></div>
            <div className="mb-3 h-7 w-full rounded bg-[#121212]"></div>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            <div className="relative mb-6 h-48 w-48">
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(${gradientStops})`,
                }}
              />
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-[#1E1E1E]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E0E0E0]">
                    {languageStats?.totalProjects}
                  </div>
                  <div className="text-sm text-[#A0A0A0]">
                    Project{languageStats?.totalProjects !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-3">
              {languageStats?.languages.map((lang, index) => (
                <div key={lang} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getColorByLanguage(lang) }}
                    />
                    <span className="text-sm font-medium text-[#E0E0E0]">
                      {lang}
                    </span>
                  </div>
                  <span className="text-sm text-[#A0A0A0]">
                    {languageStats?.percentages[index]}%
                  </span>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-6 w-full border-t border-gray-700 pt-2">
              <div className="text-sm text-[#A0A0A0]">
                <span>
                  Last updated: {languageStats?.createdAt.toUTCString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
