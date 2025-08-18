"use client";
import { OrganizationGrid } from "../_components/grid/organization-grid";
import { useState } from "react";
import { SearchBar } from "~/app/_components/searchbar";
import { OrderButton } from "~/app/_components/order";
import { Button } from "../_components/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ProjectIcon } from "../_components/icons/project-icon";
import { cn } from "~/utils/frontend/classnames";

interface Filter {
  searchText: string;
  order: "asc" | "desc";
}

export default function DevelopersPage() {
  const [filter, setFilter] = useState<Filter>({
    searchText: "",
    order: "desc",
  });
  const session = useSession();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className="mb-6 flex flex-row flex-wrap gap-x-4 gap-y-4">
          {session.data && (
            <Link href="/organizations/editor">
              <Button className="h-10 w-full py-2">
                <div className="flex flex-row items-center justify-center space-x-2">
                  <ProjectIcon className="h-5 w-5" />
                  <span>New Organization</span>
                </div>
              </Button>
            </Link>
          )}
          <OrganizationsFilterBar filter={filter} setFilter={setFilter} />
        </div>
        {/* Organizations Grid */}
        <div className="lg:col-span-2">
          <OrganizationGrid
            searchText={filter.searchText}
            order={filter.order}
          />
        </div>
      </div>
    </main>
  );
}

const filterModified = ({
  filter,
  searchText,
  order,
}: {
  filter: Filter;
  searchText: string;
  order: "asc" | "desc";
}) => {
  return filter.searchText !== searchText || filter.order !== order;
};

const OrganizationsFilterBar = ({
  filter,
  setFilter,
  className = "",
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  className?: string;
}) => {
  const [searchText, setSearchText] = useState(filter.searchText);
  const [order, setOrder] = useState(filter.order);

  return (
    <div className={cn("flex flex-row items-center", className)}>
      <SearchBar
        className="h-10 w-80"
        searchText={searchText}
        setSearchText={(text) => {
          setSearchText(text);
        }}
      />
      <OrderButton
        className="ml-2"
        arrowClassName="h-5 w-5"
        order={order}
        setOrder={(order) => {
          setOrder(order);
        }}
      />
      {filterModified({ filter, searchText, order }) && (
        <Button
          className="ml-2 px-3 py-2 text-sm"
          onClick={() => {
            setFilter({
              searchText,

              order,
            });
          }}
        >
          Apply Filters
        </Button>
      )}
    </div>
  );
};
