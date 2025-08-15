"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface MultiSearchableDropdownProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  formatOptions?: (value: string) => string;

  placeholder?: string;
  label?: string;
  className?: string;
  maxDisplayItems?: number;
}

export function MultiSearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  className = "",
  maxDisplayItems = 3,
  formatOptions,
}: MultiSearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) => {
    if (!formatOptions)
      return option.toLowerCase().includes(searchQuery.toLowerCase());
    return formatOptions(option)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

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
    const isSelected = value.includes(option);
    if (isSelected) {
      // Remove option if already selected
      onChange(value.filter((item) => item !== option));
    } else {
      // Add option if not selected
      onChange([...value, option]);
    }
  };

  const handleRemoveItem = (item: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(value.filter((selectedItem) => selectedItem !== item));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchQuery("");
  };

  const displayValue = () => {
    if (value.length === 0) {
      return <span className="text-[#A0A0A0]">Select options...</span>;
    }

    const displayItems = value.slice(0, maxDisplayItems);
    const remainingCount = value.length - maxDisplayItems;

    return (
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-md bg-[#8B5CF6] px-2 py-1 text-xs text-white"
          >
            {formatOptions ? formatOptions(item) : item}
            <button
              type="button"
              onClick={(e) => handleRemoveItem(item, e)}
              className="rounded-full p-0.5 transition-colors hover:bg-[#7C3AED]"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="inline-flex items-center rounded-md bg-[#4A4A4A] px-2 py-1 text-xs text-[#E0E0E0]">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        {/* Dropdown trigger */}
        <div
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          className="min-h-[40px] w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-2 pr-8 text-left text-sm text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
        >
          <div className="block">{displayValue()}</div>
          <ChevronDownIcon
            className={`pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-[#A0A0A0] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

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

            {/* Selected items count */}
            {value.length > 0 && (
              <div className="border-b border-gray-700 px-4 py-2">
                <div className="text-xs text-[#A0A0A0]">
                  {value.length} item{value.length !== 1 ? "s" : ""} selected
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option);
                  return (
                    <div
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] focus:outline-none ${
                        isSelected
                          ? "bg-[#8B5CF6] text-white"
                          : "text-[#E0E0E0]"
                      }`}
                    >
                      <span>
                        {formatOptions ? formatOptions(option) : option}
                      </span>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionSelect(option);
                          }}
                          className="rounded-full p-0.5 transition-colors hover:bg-[#7C3AED]"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-2 text-sm text-[#A0A0A0]">
                  No options found
                </div>
              )}
            </div>

            {/* Clear all button */}
            {value.length > 0 && (
              <div className="border-t border-gray-700 p-2">
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="w-full rounded-md bg-[#DC2626] px-3 py-2 text-sm text-white transition-colors hover:bg-[#B91C1C] focus:ring-2 focus:ring-[#DC2626] focus:outline-none"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
