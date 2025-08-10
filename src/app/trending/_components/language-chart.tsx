"use client";

export function LanguageChart() {
  const languageData = [
    { name: "JavaScript", percentage: 28, color: "#F7DF1E" },
    { name: "Python", percentage: 22, color: "#3776AB" },
    { name: "TypeScript", percentage: 18, color: "#3178C6" },
    { name: "Java", percentage: 12, color: "#ED8B00" },
    { name: "Go", percentage: 8, color: "#00ADD8" },
    { name: "Rust", percentage: 6, color: "#CE422B" },
    { name: "Other", percentage: 6, color: "#A0A0A0" },
  ];

  // Calculate cumulative percentages for the conic gradient
  let cumulative = 0;
  const gradientStops = languageData
    .map((lang) => {
      const start = cumulative;
      cumulative += lang.percentage;
      return `${lang.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
        Language Distribution
      </h2>

      <div className="flex flex-col items-center">
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
              <div className="text-2xl font-bold text-[#E0E0E0]">1,234</div>
              <div className="text-sm text-[#A0A0A0]">Repositories</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {languageData.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm font-medium text-[#E0E0E0]">
                  {lang.name}
                </span>
              </div>
              <span className="text-sm text-[#A0A0A0]">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Languages Badge */}
      <div className="mt-6 rounded-lg border border-gray-700 bg-[#121212] p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A0A0A0]">Trending this week</span>
          <span className="inline-flex items-center rounded-full bg-[#F59E0B]/20 px-2 py-1 text-xs font-medium text-[#F59E0B]">
            Rust +12%
          </span>
        </div>
      </div>
    </div>
  );
}
