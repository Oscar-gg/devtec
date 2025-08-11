import { FilterBar } from "./trending/_components/filter-bar";
import { LanguageChart } from "./trending/_components/language-chart";
import { RepositoryGrid } from "./trending/_components/repository-grid";

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Language Distribution Chart */}
          <div className="lg:col-span-1">
            <FilterBar />
            <div className="mt-6">
              <LanguageChart />
            </div>
          </div>

          {/* Repository Grid */}
          <div className="lg:col-span-2">
            <RepositoryGrid />
          </div>
        </div>
      </main>
    </div>
  );
}
