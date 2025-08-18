"use client";

import { useEffect, useState } from "react";
import { Button } from "~/app/_components/button";
import { ProjectIcon } from "~/app/_components/icons/project-icon";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { MultiSearchableDropdown } from "~/app/_components/multi-searchable-dropdown";

interface FormData {
  name: string;
  description: string;
  url: string;
  userOwners: string[];
}

const formatUserName = ({
  userId,
  userMap,
}: {
  userId: string;
  userMap: Record<string, string> | undefined | null;
}) => {
  return userMap?.[userId] ?? userId;
};

function CreateOrganizationPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: existingOrganization,
    isLoading: isLoadingExistingOrganization,
  } = api.organizations.getOrganizationById.useQuery(
    { id: id ?? "" },
    { enabled: !!id },
  );

  const { data: userNames, isLoading: loadingUserNames } =
    api.user.getUserNames.useQuery();

  const userMap: Record<string, string> = {};

  if (userNames) {
    for (const user of userNames) {
      if (user.name) {
        const email = user.email ? " | " + user.email : "";
        userMap[user.id] = user.name + email;
      }
    }
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    url: "",
    userOwners: [],
  });

  const utils = api.useUtils();

  const router = useRouter();

  const removeUser = (userIdToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      userOwners: prev.userOwners.filter((userId) => userId !== userIdToRemove),
    }));
  };

  const createOrModifyOrganizationMutation =
    api.organizations.createOrModifyOrganization.useMutation({
      onSuccess: async (organization) => {
        // await utils.organizations.getOrganizationIds.invalidate();
        // await utils.organizations.getOrganizationOverview.invalidate();
        // await utils.organizations.getOrganizationById.invalidate({
        //   id: organization.id,
        // });
        // Redirect to see project
        router.push(`/organizations/${organization.id}`);
      },
      onError: (error) => {
        toast.error(error.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      },
    });

  useEffect(() => {
    if (id && existingOrganization) {
      setFormData({
        url: existingOrganization.url ?? "",
        name: existingOrganization?.name ?? "",
        description: existingOrganization?.description ?? "",
        userOwners: existingOrganization?.user.map((up) => up.id) ?? [],
      });
    }
  }, [existingOrganization, id]);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const deleteOrganizationMutation =
    api.organizations.deleteOrganization.useMutation({
      onSuccess: async () => {
        await utils.organizations.getOrganizationIds.reset();
        toast.success("Organization deleted successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      },
    });

  const handleInputChange = (
    field: string,
    value: string | string[] | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteOrganization = () => {
    if (id) {
      deleteOrganizationMutation.mutate({ id });
    }
    setShowDeleteConfirmation(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrModifyOrganizationMutation.mutate({
      id: id,
      name: formData.name,
      userIds: formData.userOwners,
      description: formData.description,
      url: formData.url,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
              <ProjectIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#E0E0E0]">
                {existingOrganization || id
                  ? "Edit Organization"
                  : "Create New Organization"}
              </h1>
              <p className="text-[#A0A0A0]">
                Share your organization with the DevTec community
              </p>
            </div>
            {(existingOrganization ?? id) && (
              <Button
                className="ml-auto bg-red-600 hover:bg-red-700 hover:shadow-red-600/30"
                type="button"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Organization
              </Button>
            )}
          </div>
        </div>

        {isLoadingExistingOrganization && (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="mb-6 space-y-6 lg:col-span-3">
                <div className="h-32 rounded-xl bg-[#1E1E1E]"></div>
                <div className="h-48 rounded-xl bg-[#1E1E1E]"></div>
                <div className="h-32 rounded-xl bg-[#1E1E1E]"></div>
                <div className="h-32 rounded-xl bg-[#1E1E1E]"></div>
                <div className="flex flex-row justify-end gap-x-6">
                  <div className="mb-6 h-10 w-32 rounded bg-[#1E1E1E]"></div>
                  <div className="mb-6 h-10 w-32 rounded bg-[#1E1E1E]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!isLoadingExistingOrganization && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Link Section */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Link *
              </h2>

              {/* GitHub URL */}
              <label
                htmlFor="githubUrl"
                className="mb-2 block text-sm font-medium text-[#A0A0A0]"
              >
                Link to GitHub Organization or Webpage
              </label>
              <input
                type="url"
                id="url"
                value={formData.url ?? ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://github.com/organization"
                className="w-full rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
              />
            </div>
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Organization Details
              </h2>

              {/* Organization Name */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#A0A0A0]"
                >
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your organization name"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>

              {/* Description */}
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[#A0A0A0]"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe what your organization does, or the type of work it focuses on..."
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
              />
            </div>

            {/* Organization Members Section */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Organization Members
              </h2>

              {loadingUserNames ? (
                <div>Loading...</div>
              ) : (
                <MultiSearchableDropdown
                  options={userNames?.map((user) => user.id) ?? []}
                  value={formData.userOwners}
                  formatOptions={(userId) =>
                    formatUserName({ userId, userMap })
                  }
                  onChange={(value) => handleInputChange("userOwners", value)}
                  placeholder="Search developers..."
                  className="mb-4"
                />
              )}

              {/* Selected Members */}
              {formData.userOwners.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                    Selected Members:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.userOwners.map((user) => (
                      <span
                        key={user}
                        className="inline-flex items-center rounded-full bg-[#8B5CF6] px-3 py-1 text-xs font-medium text-white"
                      >
                        {formatUserName({ userId: user, userMap })}
                        <button
                          type="button"
                          onClick={() => removeUser(user)}
                          className="ml-2 hover:text-gray-300 focus:outline-none"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                className="px-8"
                disabled={!formData.name || !formData.description}
              >
                <div className="flex items-center space-x-2">
                  <ProjectIcon className="h-5 w-5" />
                  <span>
                    {existingOrganization || id
                      ? "Save"
                      : "Create New Organization"}
                  </span>
                </div>
              </Button>
            </div>
          </form>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="max-w-md rounded-xl bg-[#1E1E1E] p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-[#E0E0E0]">
                Delete Organization
              </h3>
              <p className="mb-6 text-[#A0A0A0]">
                Are you sure you want to delete this organization? This action
                will permanently remove all organization data and cannot be
                recovered.
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 hover:shadow-gray-600/30"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 hover:shadow-red-600/30"
                  onClick={handleDeleteOrganization}
                  disabled={deleteOrganizationMutation.isPending}
                >
                  {deleteOrganizationMutation.isPending
                    ? "Deleting..."
                    : "Delete Forever"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CreateOrganizationPageWrapper() {
  return (
    <Suspense>
      <CreateOrganizationPage />
    </Suspense>
  );
}
