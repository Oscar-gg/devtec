"use client";
import { DeveloperGrid } from "../_components/grid/developer-grid";
import { useState } from "react";
import { SearchBar } from "~/app/_components/searchbar";
import { OrderButton } from "~/app/_components/order";
import { Button } from "../_components/button";

interface Filter {
  searchText: string;
  order: "asc" | "desc";
}

export default function DevelopersPage() {
  const [filter, setFilter] = useState<Filter>({
    searchText: "",
    order: "desc",
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <DevelopersFilterBar filter={filter} setFilter={setFilter} />
        {/* Developer Grid */}
        <div className="lg:col-span-2">
          <DeveloperGrid searchText={filter.searchText} order={filter.order} />
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

const DevelopersFilterBar = ({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}) => {
  const [searchText, setSearchText] = useState(filter.searchText);
  const [order, setOrder] = useState(filter.order);

  return (
    <div className="mb-4 flex flex-row items-center">
      <SearchBar
        className="w-80"
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
