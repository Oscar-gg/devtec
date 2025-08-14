import { type RouterOutputs } from "~/trpc/react";
import { profilePicture } from "~/utils/frontend/defaultProfilePicture";

interface ProfileCardProps {
  profile:
    | RouterOutputs["user"]["getPublicProfile"]
    | RouterOutputs["user"]["getUserOverview"];
  isOwnProfile: boolean;
  projectCount?: number;
  hideOrganizations?: boolean;
}

export function ProfileCard({
  profile,
  isOwnProfile,
  projectCount,
  hideOrganizations = false,
}: ProfileCardProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      {/* Profile Image */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#8B5CF6]">
          <img
            src={profilePicture({
              image: profile?.image,
              name: profile?.name,
            })}
            alt={profile?.name ?? "Profile"}
            className="object-cover"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">
          {profile?.name ?? "Anonymous User"}
        </h2>

        {profile?.email && (
          <p className="mb-2 text-gray-400">{profile.email}</p>
        )}

        {profile?.schoolEmail && (
          <p className="mb-2 text-gray-400">{profile.schoolEmail}</p>
        )}

        <p className="text-sm text-gray-500">
          Member since {profile?.createdAt?.toDateString()}
        </p>
      </div>

      {!hideOrganizations && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {typeof projectCount === "number" ? projectCount : "loading..."}
            </p>
            <p className="text-sm text-gray-400">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#8B5CF6]">
              {profile?.organizations?.length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Organizations</p>
          </div>
        </div>
      )}

      {isOwnProfile && (
        <div className="mt-6 rounded-lg bg-[#2A2A2A] p-4">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-[#8B5CF6]">Privacy:</span> You
            can control what information is visible to others by editing your
            profile settings.
          </p>
        </div>
      )}
    </div>
  );
}

export function ProfileCardSkeleton({
  hideOrganizations = false,
  hideEmails = false,
}: {
  hideEmails?: boolean;
  hideOrganizations?: boolean;
}) {
  return (
    <div className="animate-pulse rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      {/* Profile Image Skeleton */}
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-700">
          <div className="h-full w-full bg-gray-700"></div>
        </div>
      </div>

      {/* Basic Info Skeleton */}
      <div className="text-center">
        <div className="mb-2 flex justify-center">
          <div className="h-7 w-48 rounded bg-gray-700"></div>
        </div>
        {!hideEmails && (
          <>
            <div className="mb-2 flex justify-center">
              <div className="h-4 w-40 rounded bg-gray-700"></div>
            </div>

            <div className="mb-2 flex justify-center">
              <div className="h-4 w-32 rounded bg-gray-700"></div>
            </div>
          </>
        )}

        <div className="flex justify-center">
          <div className="h-4 w-36 rounded bg-gray-700"></div>
        </div>
      </div>

      {!hideOrganizations && (
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
