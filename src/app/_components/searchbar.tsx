import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "~/utils/frontend/classnames";
export const SearchBar = ({
  searchText,
  setSearchText,
  placeholder = "Search...",
  className = "",
  props,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className={cn("relative", className)}>
      <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-[#A0A0A0]" />
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-700 bg-[#121212] py-2 pr-4 pl-10 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
        {...props}
      />
    </div>
  );
};
