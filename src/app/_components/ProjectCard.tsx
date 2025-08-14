import { api } from "~/trpc/react";

import {
  StarIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import { formatNumber } from "~/utils/frontend/number";
import { getColorByLanguage } from "~/utils/constants/colors";
import { ForkIcon } from "./icons";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const ProjectCard = ({
  projectId,
  position,
  setMaxVisibleProject,
}: {
  projectId: string;
  position?: number;
  setMaxVisibleProject?: (num: number) => void;
}) => {
  const { data: project, isLoading } = api.projects.getProjectOverview.useQuery(
    {
      id: projectId,
    },
  );

  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading || position === undefined) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && position !== undefined) {
          setMaxVisibleProject?.(position);
        }
      },
      { threshold: 0.1 }, // 10% visible
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [position, setMaxVisibleProject, isLoading]);

  if (isLoading) {
    return <ProjectCardSkeleton />;
  }

  return (
    <div
      ref={elementRef}
      className="group rounded-xl border border-gray-800 bg-[#1E1E1E] p-6 transition-all duration-200 hover:border-[#8B5CF6]/50 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
    >
      <Link className="cursor-pointer" href={`/projects/${projectId}`}>
        {/* Repository Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-[#E0E0E0] transition-colors duration-200 group-hover:text-[#3B82F6]">
                {project?.name}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#A0A0A0]">
              {project?.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Repository Stats */}
      <div className="flex items-center justify-between">
        <Link className="cursor-pointer" href={`/projects/${projectId}`}>
          <div className="flex items-center space-x-6">
            {/* Language */}
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

            {typeof project?.stars === "number" && (
              <div className="flex items-center space-x-1 text-[#A0A0A0]">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm">{formatNumber(project?.stars)}</span>
              </div>
            )}

            {typeof project?.forks === "number" && (
              <div className="flex items-center space-x-1 text-[#A0A0A0]">
                <ForkIcon className="h-4 w-4" />
                <span className="text-sm">{formatNumber(project?.forks)}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-[#A0A0A0]">
              <HeartIcon className="h-4 w-4" />
              <span className="text-sm">
                {formatNumber(project?._count.projectLike)}
              </span>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {project?.deploymentUrl && (
            <a
              href={project?.deploymentUrl}
              target="_blank"
              className="inline-flex items-center rounded-lg bg-[#3B82F6]/20 px-3 py-1 text-sm font-medium text-[#3B82F6] transition-all duration-200 hover:bg-[#3B82F6]/30 hover:shadow-lg hover:shadow-[#3B82F6]/20"
            >
              <ArrowTopRightOnSquareIcon className="mr-1 h-4 w-4" />
              Deployment
            </a>
          )}
          {project?.githubUrl && (
            <a
              href={project?.githubUrl}
              target="_blank"
              className="inline-flex items-center rounded-lg bg-[#10B981]/20 px-3 py-1 text-sm font-medium text-[#10B981] transition-all duration-200 hover:bg-[#10B981]/30 hover:shadow-lg hover:shadow-[#10B981]/20"
            >
              <EyeIcon className="mr-1 h-4 w-4" />
              Visit GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-800 bg-[#1E1E1E] p-6">
      {/* Repository Header Skeleton */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center space-x-2">
            <div className="h-6 w-32 rounded bg-gray-700"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-700"></div>
            <div className="h-4 w-3/4 rounded bg-gray-700"></div>
          </div>
        </div>
      </div>

      {/* Repository Stats Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Language Skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-700"></div>
            <div className="h-4 w-20 rounded bg-gray-700"></div>
          </div>

          {/* Stars Skeleton */}
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded bg-gray-700"></div>
            <div className="h-4 w-8 rounded bg-gray-700"></div>
          </div>

          {/* Forks Skeleton */}
          <div className="flex items-center space-x-1">
            <div className="h-4 w-4 rounded bg-gray-700"></div>
            <div className="h-4 w-8 rounded bg-gray-700"></div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-24 rounded-lg bg-gray-700"></div>
          <div className="h-8 w-28 rounded-lg bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};
