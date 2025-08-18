"use client";

import { api } from "~/trpc/react";

import { useRef } from "react";
import {
  ProfileCard,
  ProfileCardSkeleton,
} from "~/app/_components/card/ProfileCard";

import { Button } from "../button";
import Link from "next/link";

export function DeveloperGrid({
  searchText,
  order,
}: {
  searchText?: string;
  order?: "asc" | "desc";
}) {
  const {
    data: userIds,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.user.getUserIds.useInfiniteQuery(
    {
      limit: 5,
      text: searchText,
      order: order,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const maxVisibleProject = useRef<number>(0);

  if (isLoading) {
    maxVisibleProject.current = 0;
  }

  const allUsers = userIds?.pages.flatMap((page) => page.users) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allUsers.map((user) => (
          <ProfileWrapper key={user.id} userId={user.id} />
        ))}
        {(isLoading || isFetchingNextPage) && (
          <ProfileCardSkeleton hideOrganizations hideEmails />
        )}
      </div>
      {!isLoading && (
        <div className="flex flex-col justify-center rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200">
          {allUsers.length === 0 && (
            <p className="text-center text-gray-400">No users found.</p>
          )}
          {!hasNextPage && allUsers.length !== 0 && (
            <p className="text-center text-gray-400">
              No additional users found.
            </p>
          )}
          {hasNextPage && (
            <Button
              className="mx-auto"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load More Developers
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const ProfileWrapper = ({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) => {
  const { data: profile, isLoading } = api.user.getUserOverview.useQuery({
    userId,
  });

  if (!profile || isLoading) {
    return <ProfileCardSkeleton hideOrganizations hideEmails />;
  }

  return (
    <Link href={`/developers/profile?id=${userId}`}>
      <ProfileCard
        className={className}
        profile={profile}
        hideOrganizations
        isOwnProfile={false}
      />
    </Link>
  );
};
