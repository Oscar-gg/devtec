"use client";

import { api } from "~/trpc/react";

import { Button } from "../button";
import Link from "next/link";
import {
  OrganizationCard,
  OrganizationCardSkeleton,
} from "../card/OrganizationCard";

export function OrganizationGrid({
  searchText,
  order,
}: {
  searchText?: string;
  order?: "asc" | "desc";
}) {
  const {
    data: organizationIds,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.organizations.getOrganizationIds.useInfiniteQuery(
    {
      limit: 5,
      text: searchText,
      order: order,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const allOrganizations =
    organizationIds?.pages.flatMap((page) => page.organizations) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allOrganizations.map((organization) => (
          <OrganizationWrapper
            key={organization.id}
            organizationId={organization.id}
          />
        ))}
        {(isLoading || isFetchingNextPage) && (
          <OrganizationCardSkeleton hideCounts />
        )}
      </div>
      {!isLoading && (
        <div className="group flex flex-col justify-center rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200">
          {allOrganizations.length === 0 && (
            <p className="text-center text-gray-400">No organizations found.</p>
          )}
          {!hasNextPage && allOrganizations.length !== 0 && (
            <p className="text-center text-gray-400">
              No additional organizations found.
            </p>
          )}
          {hasNextPage && (
            <Button
              className="mx-auto"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load More Organizations
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

const OrganizationWrapper = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const { data: organization, isLoading } =
    api.organizations.getOrganizationOverview.useQuery({
      id: organizationId,
    });

  if (!organization || isLoading) {
    return <OrganizationCardSkeleton hideCounts />;
  }

  return (
    <Link href={`/organizations/${organization.id}`}>
      <OrganizationCard organization={organization} disableCounts disableLink />
    </Link>
  );
};
