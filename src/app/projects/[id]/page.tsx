"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  StarIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  TagIcon,
  CodeBracketIcon,
  ArrowLeftIcon,
  HeartIcon,
  UserIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Button } from "~/app/_components/button";
import { ProjectIcon } from "~/app/_components/icons/project-icon";
import { GitHubIcon } from "~/app/_components/icons/github-icon";
import { api } from "~/trpc/react";
import { defaultProfilePicture } from "~/utils/frontend/defaultProfilePicture";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { formatNumber } from "~/utils/frontend/number";
import { getColorByLanguage } from "~/utils/constants/colors";
import { cn } from "~/utils/frontend/classnames";
import { getTagInfo } from "~/utils/constants/tags";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const session = useSession();
  const utils = api.useUtils();
  const { data: project, isLoading } = api.projects.getProjectById.useQuery(
    { id: projectId },
    { enabled: !!projectId },
  );

  const { data: canEdit } = api.projects.canEditProject.useQuery(
    { id: projectId },
    { enabled: !!projectId && !!session.data?.user },
  );

  const upvote = api.projects.toggleUpvote.useMutation({
    onSuccess: async () => {
      // Invalidate the isLiked query to refetch the upvote status
      await utils.projects.isLiked.invalidate({ id: projectId });
      await utils.projects.getLikeCount.invalidate({ id: projectId });
    },
  });

  const refreshGithubProject = api.github.refreshProject.useMutation({
    onSuccess: async () => {
      // Invalidate the project query to refetch the updated project data
      await utils.projects.getProjectById.invalidate({ id: projectId });
      toast.success("GitHub stats refreshed for this project!");
    },
    onError: (error) => {
      toast.error(`Failed to refresh GitHub stats: ${error.message}`);
    },
  });

  const { data: isLiked } = api.projects.isLiked.useQuery(
    {
      id: projectId,
    },
    {
      enabled: !!session.data?.user,
    },
  );
  const { data: likedCount } = api.projects.getLikeCount.useQuery({
    id: projectId,
  });

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-32 rounded bg-[#1E1E1E]"></div>
            <div className="mb-8 h-12 w-3/4 rounded bg-[#1E1E1E]"></div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-48 rounded-xl bg-[#1E1E1E]"></div>
                <div className="h-32 rounded-xl bg-[#1E1E1E]"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 rounded-xl bg-[#1E1E1E]"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E1E1E]">
              <ProjectIcon className="h-8 w-8 text-[#A0A0A0]" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-[#E0E0E0]">
              Project Not Found
            </h1>
            <p className="text-[#A0A0A0]">
              The project you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>
          <Link href="/">
            <Button>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const author = project.userProject[0]?.user;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-[#A0A0A0] transition-colors duration-200 hover:text-[#E0E0E0]"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
                <ProjectIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#E0E0E0]">
                  {project.name}
                </h1>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-[#A0A0A0]">
                    {project.userProject.length > 1 ? (
                      <>
                        <UserIcon className="h-4 w-4" />
                        <span className="text-sm">
                          {project.userProject.length} Authors
                        </span>
                      </>
                    ) : (
                      <>
                        <img
                          src={
                            author?.image ?? defaultProfilePicture(author?.name)
                          }
                          alt={author?.name ?? "No author"}
                          className="h-4 w-4 rounded-full"
                        />
                        <span className="text-sm">{author?.name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[#A0A0A0]">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">
                      Created {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {
              <div className="flex items-center space-x-3">
                {canEdit && (
                  <Link href={`/projects/editor?id=${projectId}`}>
                    <Button className="inline-flex h-9 items-center rounded-lg bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#7C3AED]">
                      <PencilSquareIcon className="mr-2 h-4 w-4" />
                      Edit Project
                    </Button>
                  </Link>
                )}

                {project.githubUrl && (
                  <button
                    onClick={() => {
                      refreshGithubProject.mutate({ id: projectId });
                    }}
                    className={`inline-flex h-9 cursor-pointer items-center rounded-lg bg-[#1E1E1E] px-4 py-2 text-sm font-medium text-[#A0A0A0] transition-all duration-200 hover:bg-[#2A2A2A] hover:text-[#E0E0E0]`}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  disabled={!session.data?.user}
                  onClick={() => {
                    upvote.mutate({ id: projectId });
                  }}
                  className={`inline-flex h-9 cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isLiked
                      ? "bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30"
                      : "bg-[#1E1E1E] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-[#E0E0E0]"
                  }`}
                >
                  {isLiked ? (
                    <HeartIconSolid className="mr-2 h-4 w-4" />
                  ) : (
                    <HeartIcon className="mr-2 h-4 w-4" />
                  )}
                  {formatNumber(likedCount)}
                </button>
              </div>
            }
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                About this project
              </h2>
              <p className="mb-4 leading-relaxed text-[#A0A0A0]">
                {project.description}
              </p>
            </div>

            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                Category
              </h2>
              <p className="leading-relaxed text-[#A0A0A0]">
                {project.category}
              </p>
            </div>

            {/* Technologies */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-[#E0E0E0]">
                <TagIcon className="mr-2 h-5 w-5" />
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.length === 0 && (
                  <span className="inline-flex items-center rounded-full bg-[#8B5CF6]/20 px-3 py-1 text-sm font-medium text-[#8B5CF6]">
                    No tags found
                  </span>
                )}
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    title={getTagInfo(tag).explanation}
                    className={cn(
                      "inline-flex items-center rounded-full bg-[#8B5CF6]/20 px-3 py-1 text-sm font-medium text-[#8B5CF6]",
                      getTagInfo(tag).color,
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-[#E0E0E0]">
                Project Links
              </h2>
              <div className="flex flex-wrap gap-4">
                {!project.githubUrl && !project.deploymentUrl && (
                  <span className="text-sm text-[#A0A0A0]">
                    No links available for this project.
                  </span>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-gray-700 bg-[#121212] px-4 py-3 text-sm font-medium text-[#E0E0E0] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#2A2A2A]"
                  >
                    <GitHubIcon className="mr-2 h-4 w-4" />
                    View Source Code
                  </a>
                )}
                {project.deploymentUrl && (
                  <a
                    href={project.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-[#3B82F6] px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2563EB] hover:shadow-lg hover:shadow-[#3B82F6]/30"
                  >
                    <ArrowTopRightOnSquareIcon className="mr-2 h-4 w-4" />
                    View Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-[#E0E0E0]">
                Project Stats
              </h3>
              <div className="space-y-4">
                {typeof project.stars === "number" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[#A0A0A0]">
                      <StarIcon className="h-4 w-4" />
                      <span className="text-sm">Stars</span>
                    </div>
                    <span className="font-medium text-[#E0E0E0]">
                      {formatNumber(project.stars)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#A0A0A0]">
                    <HeartIcon className="h-4 w-4" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="font-medium text-[#E0E0E0]">
                    {formatNumber(likedCount)}
                  </span>
                </div>
                {typeof project.forks === "number" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[#A0A0A0]">
                      <CodeBracketIcon className="h-4 w-4" />
                      <span className="text-sm">Forks</span>
                    </div>
                    <span className="font-medium text-[#E0E0E0]">
                      {formatNumber(project.forks)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Meta */}
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-[#E0E0E0]">
                Project Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#A0A0A0]">Language</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: getColorByLanguage(
                          project?.programmingLanguage,
                        ),
                      }}
                    />
                    <span className="text-sm text-[#E0E0E0]">
                      {project?.programmingLanguage ?? "Unknown Language"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#A0A0A0]">Category</p>
                  <p className="text-sm text-[#E0E0E0]">{project.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#A0A0A0]">Created</p>
                  <p className="text-sm text-[#E0E0E0]">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#A0A0A0]">
                    Last Updated
                  </p>
                  <p className="text-sm text-[#E0E0E0]">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#1E1E1E] p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-[#E0E0E0]">
                Author{project.userProject.length > 1 ? "s" : ""}
              </h3>
              <div className="mx-2 flex flex-col items-start space-y-4">
                {project.userProject.map((userProject) => (
                  <div
                    key={userProject.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
                      <img
                        src={
                          userProject.user.image ??
                          defaultProfilePicture(userProject.user.name)
                        }
                        alt={userProject.user.name ?? "User"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#E0E0E0]">
                        {userProject.user.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
