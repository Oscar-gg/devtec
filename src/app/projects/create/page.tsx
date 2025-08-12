"use client";

import { useEffect, useState } from "react";
import { Button } from "~/app/_components/button";
import { ProjectIcon } from "~/app/_components/icons/project-icon";
import {
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { GitHubIcon } from "~/app/_components/icons";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  interface FormData {
    name: string;
    description: string;
    githubUrl: string | null;
    deploymentUrl: string | null;
  }

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    githubUrl: null,
    deploymentUrl: null,
  });

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

  const createProjectMutation = api.projects.createOrModifyProject.useMutation({
    onSuccess: (project) => {
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
        description: data.description || prev.description,
      }));
      setLoadFromGithub(false);
    } else if (error && loadFromGithub) {
      setLoadFromGithub(false);
    }
  }, [loadFromGithub, data, error]);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Web Development");

  const projectCategories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Game Development",
    "Desktop Application",
    "API/Backend",
    "CLI",
    "Robotics",
    "Other",
  ];

  const popularTags = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "AWS",
    "Docker",
    "Machine Learning",
    "AI",
    "Flutter",
    "React Native",
    "Vue.js",
    "Angular",
  ];

  const handleInputChange = (field: string, value: string | null) => {
    if (value == "") value = null;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags((prev) => [...prev, tag.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      category: selectedCategory,
      description: formData.description,
      githubUrl: formData.githubUrl,
      deploymentUrl: formData.deploymentUrl,
      name: formData.name,
      userIds: [],
      tags: [],
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
                Create New Project
              </h1>
              <p className="text-[#A0A0A0]">
                Share your project with the DevTec community
              </p>
            </div>
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Links Section */}
          <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">Links</h2>

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
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
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
            <div className="mb-6">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-[#A0A0A0]"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 pr-10 text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                >
                  {projectCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-[#121212] text-[#E0E0E0]"
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform text-[#A0A0A0]" />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-[#E0E0E0]">
              Technologies & Tags
            </h2>

            {/* Tag Input */}
            <div className="mb-4">
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-[#A0A0A0]"
              >
                Add Tags
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyPress}
                  placeholder="Type a technology or tag..."
                  className="flex-1 rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-[#E0E0E0] placeholder-[#A0A0A0] transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="flex items-center justify-center rounded-lg bg-[#8B5CF6] px-4 py-3 text-white transition-all duration-200 hover:bg-[#7C3AED] focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-[#A0A0A0]">
                Press Enter or comma to add tags
              </p>
            </div>

            {/* Popular Tags */}
            <div className="mb-4">
              <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                Popular Tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      tags.includes(tag)
                        ? "cursor-not-allowed bg-[#2A2A2A] text-[#606060]"
                        : "cursor-pointer bg-[#121212] text-[#A0A0A0] hover:bg-[#8B5CF6] hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-[#A0A0A0]">
                  Selected Tags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
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

          {/* Submit Section */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-lg border border-gray-700 bg-transparent px-6 py-3 font-medium text-[#A0A0A0] transition-all duration-200 hover:bg-[#1E1E1E] hover:text-[#E0E0E0]"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="px-8"
              disabled={!formData.name || !formData.description}
            >
              <div className="flex items-center space-x-2">
                <ProjectIcon className="h-5 w-5" />
                <span>Create Project</span>
              </div>
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
