import { type RouterOutputs } from "~/trpc/react";
import { profilePicture } from "~/utils/frontend/defaultProfilePicture";

interface OrganizationCardProps {
  organization:
    | RouterOutputs["organizations"]["getOrganizationById"]
    | RouterOutputs["organizations"]["getOrganizationOverview"];
  projectCount?: number;
  userCount?: number;
  disableCounts?: boolean;
  disableLink?: boolean;
}

export function OrganizationCard({
  organization,
  projectCount,
  userCount,
  disableCounts = false,
  disableLink = false,
}: OrganizationCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      {/* Organization Image */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32 overflow-hidden border-1 border-gray-700">
          <img
            src={profilePicture({
              image: organization?.logo,
              name: organization?.name,
            })}
            alt={organization?.name ?? "Organization"}
            className="object-cover"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">
          {organization?.name ?? "Loading..."}
        </h2>

        {!disableLink && organization?.url && (
          <p className="mb-2 text-gray-400">{organization.url}</p>
        )}

        <p className="text-sm text-gray-500">
          Added since {organization?.createdAt?.toDateString()}
        </p>
      </div>

      {!disableCounts && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {typeof projectCount === "number" ? projectCount : "loading..."}
            </p>
            <p className="text-sm text-gray-400">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {typeof userCount === "number" ? userCount : "loading..."}
            </p>
            <p className="text-sm text-gray-400">Users</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrganizationCardSkeleton({
  hideCounts = false,
}: {
  hideCounts?: boolean;
}) {
  return (
    <div className="animate-pulse rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      {/* Organization Image Skeleton */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32 overflow-hidden border-4 border-gray-700">
          <div className="h-full w-full bg-gray-700"></div>
        </div>
      </div>

      {/* Basic Info Skeleton */}
      <div className="text-center">
        <div className="mb-2 flex justify-center">
          <div className="h-7 w-48 rounded bg-gray-700"></div>
        </div>

        <div className="flex justify-center">
          <div className="h-4 w-36 rounded bg-gray-700"></div>
        </div>
      </div>

      {!hideCounts && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="mb-1 flex justify-center">
              <div className="h-8 w-12 rounded bg-gray-700"></div>
            </div>
            <div className="flex justify-center">
              <div className="h-4 w-16 rounded bg-gray-700"></div>
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex justify-center">
              <div className="h-8 w-8 rounded bg-gray-700"></div>
            </div>
            <div className="flex justify-center">
              <div className="h-4 w-20 rounded bg-gray-700"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
