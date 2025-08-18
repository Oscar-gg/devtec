"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../../_components/button";
import { Suspense } from "react";

import { ProfileEditModal } from "./_components/ProfileEditModal";
import { ProfileCard } from "~/app/_components/card/ProfileCard";
import { WorkExperienceSection } from "./_components/WorkExperienceSection";
import { OrganizationsSection } from "./_components/OrganizationsSection";
import { ProjectsSection } from "./_components/ProjectsSection";
import { LinksSection } from "./_components/LinksSection";

function ProfilePage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userId = searchParams.get("id") ?? session?.user?.id;

  const isOwnProfile = !userId || userId === session?.user?.id;

  const {
    data: publicProfileQuery,
    isLoading,
    error,
  } = api.user.getPublicProfile.useQuery(
    { userId: userId ?? "" },
    {
      enabled: !!userId,
    },
  );
  const { data: projectCount } = api.user.getProjectCount.useQuery(
    { userId: userId ?? "" },
    {
      enabled: !!userId,
    },
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-[#8B5CF6]">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading profile: {error.message}</p>
        </div>
      </div>
    );
  }

  // Show login required message
  if (!session && !userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Login Required</h1>
          <p className="text-gray-400">
            Please log in to view your profile or provide a user ID to view a
            public profile.
          </p>
        </div>
      </div>
    );
  }

  // Show user not found
  if (!publicProfileQuery) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">User Not Found</h1>
          <p className="text-gray-400">
            The user profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header with Edit Button */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {isOwnProfile
              ? "My Profile"
              : `${publicProfileQuery.name ?? "User"}'s Profile`}
          </h1>
          {isOwnProfile && (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              profile={publicProfileQuery}
              isOwnProfile={isOwnProfile}
              projectCount={projectCount}
            />
          </div>

          {/* Right Column - Detailed Information */}
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                About
              </h2>
              <p className="leading-relaxed text-[#A0A0A0]">
                {(publicProfileQuery.userPreferences?.about?.length ?? 0) > 0
                  ? publicProfileQuery.userPreferences?.about
                  : "No information provided."}
              </p>
            </div>
            {/* Links */}
            {publicProfileQuery.UserLink &&
              publicProfileQuery.UserLink.length > 0 && (
                <LinksSection links={publicProfileQuery.UserLink} />
              )}

            {/* Work Experience */}
            {publicProfileQuery.workExperience &&
              publicProfileQuery.workExperience.length > 0 && (
                <WorkExperienceSection
                  workExperience={publicProfileQuery.workExperience}
                />
              )}

            {/* Organizations */}
            {publicProfileQuery.organizations &&
              publicProfileQuery.organizations.length > 0 && (
                <OrganizationsSection
                  organizations={publicProfileQuery.organizations}
                />
              )}

            {/* Related Projects */}
            {publicProfileQuery.UserProject &&
              publicProfileQuery.UserProject.length > 0 && (
                <ProjectsSection
                  projects={publicProfileQuery.UserProject.map(
                    ({ project }) => ({ id: project.id }),
                  )}
                />
              )}

            {/* Empty State */}
            {(!publicProfileQuery.UserLink ||
              publicProfileQuery.UserLink.length === 0) &&
              (!publicProfileQuery.workExperience ||
                publicProfileQuery.workExperience.length === 0) &&
              (!publicProfileQuery.organizations ||
                publicProfileQuery.organizations.length === 0) &&
              (!publicProfileQuery.UserProject ||
                publicProfileQuery.UserProject.length === 0) && (
                <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-8 text-center">
                  <p className="text-gray-400">
                    No additional information to show.
                    {isOwnProfile
                      ? ""
                      : "This user hasn't added any additional information yet."}
                  </p>
                  {isOwnProfile && (
                    <p className="mt-4 text-gray-400">
                      Consider editing your profile to add more details about
                      yourself!
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <ProfileEditModal
            profile={publicProfileQuery}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function ProfilePageWrapper() {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  );
}
