"use client";

import { api } from "~/trpc/react";

import { useRef } from "react";
import {
  ProfileCard,
  ProfileCardSkeleton,
} from "~/app/developers/profile/_components";

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
      limit: 3,
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
      <div className="grid gap-6">
        {allUsers.map((user) => (
          <ProfileWrapper key={user.id} userId={user.id} />
        ))}
      </div>
      {(isLoading || isFetchingNextPage) && (
        <ProfileCardSkeleton hideOrganizations hideEmails />
      )}
      {!isLoading && (
        <div className="group rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200">
          {allUsers.length === 0 && (
            <p className="text-center text-gray-400">No users found.</p>
          )}
          {!hasNextPage && allUsers.length !== 0 && (
            <p className="text-center text-gray-400">
              No additional users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const ProfileWrapper = ({ userId }: { userId: string }) => {
  const { data: profile, isLoading } = api.user.getUserOverview.useQuery({
    userId,
  });

  if (!profile || isLoading) {
    return <ProfileCardSkeleton hideOrganizations hideEmails />;
  }

  return (
    <ProfileCard profile={profile} hideOrganizations isOwnProfile={false} />
  );
};
