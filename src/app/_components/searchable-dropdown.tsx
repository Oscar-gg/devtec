"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface SearchableDropdownProps {
  options: string[] | readonly string[];
  value: string;
  onChange: (value: string) => void;
  formatOptions?: (value: string) => string;
  placeholder?: string;
  label?: string | React.ReactNode;
  className?: string;
}

export function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  className = "",
  formatOptions,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchQuery("");
  };

  return (
    <div className={className}>
      {typeof label === "string" ? (
        <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
          {label}
        </label>
      ) : (
        label
      )}
      <div ref={dropdownRef} className="relative">
        {/* Dropdown trigger */}
        <button
          type="button"
          onClick={handleToggle}
          className="w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-left text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
        >
          <span className="block truncate">
            {formatOptions ? formatOptions(value) : value}
          </span>
          <ChevronDownIcon
            className={`pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-700 bg-[#121212] shadow-lg">
            {/* Search input */}
            <div className="p-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-md border border-gray-600 bg-[#1E1E1E] py-2 pr-3 pl-9 text-sm text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] focus:outline-none ${
                      option === value
                        ? "bg-[#8B5CF6] text-white"
                        : "text-[#E0E0E0]"
                    }`}
                  >
                    {formatOptions ? formatOptions(option) : option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-[#A0A0A0]">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
