"use client";

import { useEffect, useState } from "react";
import { Button } from "~/app/_components/button";
import { ProjectIcon } from "~/app/_components/icons/project-icon";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { GitHubIcon } from "~/app/_components/icons";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { projectCategories, tagNames } from "~/utils/constants/tags";
import { useSearchParams } from "next/navigation";
import { defaultLanguage, defaultCategory } from "~/utils/constants/tags";
import { SearchableDropdown } from "~/app/_components/searchable-dropdown";
import { Suspense } from "react";

import { programmingLanguages } from "~/utils/constants/languages";
import { MultiSearchableDropdown } from "~/app/_components/multi-searchable-dropdown";

interface FormData {
  name: string;
  description: string;
  category: string;
  githubUrl: string | null;
  deploymentUrl: string | null;
  programmingLanguage: string;
  userOwners: string[];
  tags: string[];
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

function CreateProjectPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: existingProject, isLoading: isLoadingExistingProject } =
    api.projects.getProjectById.useQuery({ id: id ?? "" }, { enabled: !!id });

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
    githubUrl: null,
    deploymentUrl: null,
    category: defaultCategory,
    programmingLanguage: defaultLanguage,
    tags: [],
    userOwners: [],
  });

  const utils = api.useUtils();

  const [loadFromGithub, setLoadFromGithub] = useState(false);

  const { data, error } = api.github.fetchProjectData.useQuery(
    {
      url: formData.githubUrl ?? "",
    },
    {
      enabled: !!formData.githubUrl && loadFromGithub,
      retry: false,
    },
  );

  const router = useRouter();

  const createOrModifyProjectMutation =
    api.projects.createOrModifyProject.useMutation({
      onSuccess: async (project) => {
        await utils.projects.getProjectIds.invalidate();
        await utils.projects.getProjectOverview.invalidate();
        await utils.projects.getProjectById.invalidate({ id: project.id });
        // Redirect to see project
        router.push(`/projects/${project.id}`);
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
    if (data && loadFromGithub) {
      setFormData((prev) => ({
        ...prev,
        name: data.full_name,
        description: data.description ?? prev.description,
        programmingLanguage: data.language ?? prev.programmingLanguage,
      }));
      setLoadFromGithub(false);
    } else if (error && loadFromGithub) {
      setLoadFromGithub(false);
    }
  }, [loadFromGithub, data, error]);

  useEffect(() => {
    if (id && existingProject) {
      setFormData({
        // ...prev,
        name: existingProject?.name ?? "",
        description: existingProject?.description ?? "",
        githubUrl: existingProject?.githubUrl ?? "",
        deploymentUrl: existingProject?.deploymentUrl ?? "",
        category: existingProject?.category ?? "",
        programmingLanguage:
          existingProject?.programmingLanguage ?? defaultLanguage,
        tags: existingProject?.tags ?? [],
        userOwners: existingProject?.userProject.map((up) => up.userId) ?? [],
      });
    }
  }, [existingProject, id]);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const deleteProjectMutation = api.projects.deleteProject.useMutation({
    onSuccess: async () => {
      await utils.projects.getProjectIds.reset();
      toast.success("Project deleted successfully", {
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

  const handleDeleteProject = () => {
    if (id) {
      deleteProjectMutation.mutate({ id });
    }
    setShowDeleteConfirmation(false);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const removeUser = (userIdToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      userOwners: prev.userOwners.filter((userId) => userId !== userIdToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrModifyProjectMutation.mutate({
      id: id,
      category: formData.category,
      description: formData.description,
      githubUrl: formData.githubUrl,
      deploymentUrl: formData.deploymentUrl,
      programmingLanguage: formData.programmingLanguage,
      name: formData.name,
      userIds: formData.userOwners,
      tags: formData.tags,
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
                {existingProject || id ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="text-[#A0A0A0]">
                Share your project with the DevTec community
              </p>
            </div>
            {(existingProject ?? id) && (
              <Button
                className="ml-auto bg-red-600 hover:bg-red-700 hover:shadow-red-600/30"
                type="button"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete Project
              </Button>
            )}
          </div>
        </div>

        {isLoadingExistingProject && (
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
        {!isLoadingExistingProject && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Links Section */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Links
              </h2>

              {/* GitHub URL */}
              <div className="mb-6">
                <label
                  htmlFor="githubUrl"
                  className="mb-2 block text-sm font-medium text-[#A0A0A0]"
                >
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  value={formData.githubUrl ?? ""}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  placeholder="https://github.com/username/repository"
                  className="w-full rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />

                {formData.githubUrl && (
                  <div className="flex flex-row">
                    <Button
                      className="mt-4"
                      onClick={() => setLoadFromGithub(true)}
                      type="button"
                    >
                      <div className="flex flex-row items-center justify-center space-x-2">
                        <p>Load from</p>
                        <GitHubIcon className="mr-2 inline h-5 w-5" />
                      </div>
                    </Button>
                    {error && (
                      <p className="mt-5 ml-4 text-sm text-red-500">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Deployment URL */}
              <div className="mb-6">
                <label
                  htmlFor="deploymentUrl"
                  className="mb-2 block text-sm font-medium text-[#A0A0A0]"
                >
                  Live Demo / Deployment
                </label>
                <input
                  type="url"
                  id="deploymentUrl"
                  value={formData.deploymentUrl ?? ""}
                  onChange={(e) =>
                    handleInputChange("deploymentUrl", e.target.value)
                  }
                  placeholder="https://your-project.vercel.app"
                  className="w-full rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>
            </div>
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Project Details
              </h2>

              {/* Project Name */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#A0A0A0]"
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your project name"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
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
                  placeholder="Describe what your project does, its key features, and what makes it special..."
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>

              {/* Category */}
              <SearchableDropdown
                className="mb-6"
                label="Category *"
                options={projectCategories}
                value={formData.category}
                onChange={(value) => handleInputChange("category", value)}
              />

              {/* Language */}
              <SearchableDropdown
                label="Language *"
                options={programmingLanguages}
                value={formData.programmingLanguage}
                onChange={(value) =>
                  handleInputChange("programmingLanguage", value)
                }
              />
            </div>

            {/* Tags Section */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Tags
              </h2>

              <MultiSearchableDropdown
                options={tagNames}
                value={formData.tags}
                onChange={(value) => handleInputChange("tags", value)}
                placeholder="Search tags..."
                className="mb-4"
                maxDisplayItems={3}
              />

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                    Selected Tags:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#8B5CF6] px-3 py-1 text-xs font-medium text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
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

            {/* Authors Section */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
                Authors
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

              {/* Selected Authors */}
              {formData.userOwners.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                    Selected Authors:
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
                    {existingProject || id ? "Save" : "Create New Project"}
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
                Delete Project
              </h3>
              <p className="mb-6 text-[#A0A0A0]">
                Are you sure you want to delete this project? This action will
                permanently remove all project data and cannot be recovered.
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
                  onClick={handleDeleteProject}
                  disabled={deleteProjectMutation.isPending}
                >
                  {deleteProjectMutation.isPending
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

export default function CreateProjectPageWrapper() {
  return (
    <Suspense>
      <CreateProjectPage />
    </Suspense>
  );
}
