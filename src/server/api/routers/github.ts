import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import {
  getRepositoryData,
  getGithubAccessToken,
} from "~/utils/backend/github";

export const githubRouter = createTRPCRouter({
  fetchProjectData: protectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input, ctx }) => {
      const userAccessToken = await getGithubAccessToken(
        ctx.session.user.id,
        ctx.db,
      );

      if (!userAccessToken) {
        throw new Error("No GitHub access token found for the user.");
      }

      return await getRepositoryData({
        accessToken: userAccessToken,
        repoUrl: input.url,
      });
    }),

  // Only update star and fork counts
  refreshProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        select: {
          githubUrl: true,
        },
      });

      if (!project?.githubUrl) {
        throw new Error("Project not found or does not have a GitHub URL");
      }

      const userAccessToken = await getGithubAccessToken(
        ctx.session.user.id,
        ctx.db,
      );

      if (!userAccessToken) {
        throw new Error("No GitHub access token found for the user.");
      }

      const projectData = await getRepositoryData({
        accessToken: userAccessToken,
        repoUrl: project.githubUrl,
      });

      return await ctx.db.project.update({
        where: { id: input.id },
        data: {
          stars: projectData.stargazers_count,
          forks: projectData.forks_count,
        },
      });
    }),
});
