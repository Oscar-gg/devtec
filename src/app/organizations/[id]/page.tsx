"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/app/_components/button";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { SummarizedCard } from "~/app/_components/card/SummarizedCard";
import { OrganizationCard } from "~/app/_components/card/OrganizationCard";
import { ProjectsSection } from "~/app/developers/profile/_components/ProjectsSection";

function OrganizationPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { data: session } = useSession();
  const router = useRouter();

  const {
    data: organizationData,
    isLoading,
    error,
  } = api.organizations.getOrganizationById.useQuery(
    { id: organizationId ?? "" },
    {
      enabled: !!organizationId,
    },
  );
  const { data: organizationCount } =
    api.organizations.getOrganizationStats.useQuery(
      { id: organizationId ?? "" },
      {
        enabled: !!organizationId,
      },
    );

  const { data: canEdit } = api.organizations.canEditOrganization.useQuery(
    { id: organizationId ?? "" },
    {
      enabled: !!organizationId && !!session?.user,
    },
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-[#8B5CF6]">Loading organization...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">
            Error loading organization: {error.message}
          </p>
        </div>
      </div>
    );
  }

  // Show organization not found
  if (!organizationData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Organization Not Found
          </h1>
          <p className="text-gray-400">
            The organization you&apos;re looking for doesn&apos;t exist.
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
            {organizationData.name}
          </h1>
          {canEdit && (
            <Button
              onClick={() =>
                router.push(`/organizations/editor?id=${organizationId}`)
              }
              className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
            >
              Edit Organization
            </Button>
          )}
        </div>

        {/* Profile Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <OrganizationCard
              organization={organizationData}
              projectCount={organizationCount?._count.Project}
              userCount={organizationCount?._count.user}
            />
          </div>

          {/* Right Column - Detailed Information */}
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                About
              </h2>
              <p className="leading-relaxed text-[#A0A0A0]">
                {(organizationData.description?.length ?? 0) > 0
                  ? organizationData.description
                  : "No information provided."}
              </p>
            </div>

            {/* Users in Organization */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                Members
              </h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {organizationData.user.length > 0 &&
                  organizationData.user.map((user) => (
                    <SummarizedCard
                      key={user.id}
                      image={user.image}
                      name={user.name}
                      url={`/developers/profile?id=${user.id}`}
                      className="rounded-lg border border-gray-600 bg-[#2A2A2A] p-3 transition-colors hover:bg-[#333333]"
                    />
                  ))}
              </div>
            </div>
            {/* Related Projects */}
            {organizationData.Project &&
              organizationData.Project.length > 0 && (
                <ProjectsSection
                  projects={organizationData.Project.map(({ id }) => ({ id }))}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrganizationPageWrapper() {
  return (
    <Suspense>
      <OrganizationPage />
    </Suspense>
  );
}
