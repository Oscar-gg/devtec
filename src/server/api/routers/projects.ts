import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { ProjectSchema } from "~/utils/schemas/project";
import { orderOptions } from "~/utils/constants/filters";
import { sortBySchema } from "~/utils/schemas/filters";
import { type Prisma } from "@prisma/client";
import {
  getGithubAccessToken,
  getRepositoryData,
} from "~/utils/backend/github";
import { defaultLanguage } from "~/utils/constants/tags";
import { defaultOrganization } from "~/utils/constants/organizations";

export const projectsRouter = createTRPCRouter({
  createOrModifyProject: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ input, ctx }) => {
      // If the default organization is selected, set it to null
      if (input.organizationId === defaultOrganization) {
        input.organizationId = null;
      }

      // Create a project
      if (!input.id) {
        if (!input.userIds.find((id) => id === ctx.session.user.id)) {
          input.userIds.push(ctx.session.user.id);
        }

        // Get github data if githubUrl is provided
        let stars = null;
        let forks = null;

        if (input.githubUrl) {
          const accessToken = await getGithubAccessToken(
            ctx.session.user.id,
            ctx.db,
          );
          if (accessToken) {
            const githubData = await getRepositoryData({
              accessToken: accessToken,
              repoUrl: input.githubUrl,
            });

            stars = githubData.stargazers_count;
            forks = githubData.forks_count;
          }
        }

        const project = await ctx.db.project.create({
          data: {
            name: input.name,
            description: input.description,
            category: input.category,
            githubUrl: input.githubUrl,
            deploymentUrl: input.deploymentUrl,
            programmingLanguage: input.programmingLanguage,
            tags: input.tags,
            forks: forks,
            stars: stars,
            ...(input.organizationId && {
              organization: {
                connect: {
                  id: input.organizationId,
                },
              },
            }),
          },
        });

        return await ctx.db.project.update({
          where: { id: project.id },
          data: {
            userProject: {
              connectOrCreate: input.userIds.map((id) => ({
                where: {
                  userId_projectId: { userId: id, projectId: project.id },
                },
                create: { userId: id },
              })),
            },
          },
        });
      } else {
        // Update a project
        const project = await ctx.db.project.findUnique({
          where: { id: input.id },
          include: { userProject: true },
        });
        if (!project) {
          throw new Error("Project not found");
        }
        if (
          !project.userProject.some(
            (userProject) => userProject.userId === ctx.session.user.id,
          )
        ) {
          throw new Error("You do not have permission to modify this project");
        }

        if (!input.userIds.find((id) => id === ctx.session.user.id)) {
          input.userIds.push(ctx.session.user.id);
        }

        // Remove existing user associations
        await ctx.db.userProject.deleteMany({
          where: { projectId: input.id },
        });

        let stars = null;
        let forks = null;

        if (input.githubUrl) {
          const accessToken = await getGithubAccessToken(
            ctx.session.user.id,
            ctx.db,
          );
          try {
            if (accessToken) {
              const githubData = await getRepositoryData({
                accessToken: accessToken,
                repoUrl: input.githubUrl,
              });

              stars = githubData.stargazers_count;
              forks = githubData.forks_count;
            }
          } catch (error) {
            console.error("Error fetching GitHub data:", error);
          }
        }

        return await ctx.db.project.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            category: input.category,
            githubUrl: input.githubUrl,
            deploymentUrl: input.deploymentUrl,
            programmingLanguage: input.programmingLanguage,
            tags: input.tags,
            forks: forks,
            stars: stars,
            ...(input.organizationId && {
              organization: {
                connect: {
                  id: input.organizationId,
                },
              },
            }),
            // Disconnect the previous organization
            ...(!input.organizationId &&
              project.organizationId && {
                organization: {
                  disconnect: {
                    id: project.organizationId,
                  },
                },
              }),
            userProject: {
              connectOrCreate: input.userIds.map((id) => ({
                where: {
                  userId_projectId: { userId: id, projectId: project.id },
                },
                create: { userId: id },
              })),
            },
          },
        });
      }
    }),

  getProjectById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          userProject: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  canEditProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          userProject: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project.userProject.some(
        (userProject) => userProject.userId === ctx.session.user.id,
      );
    }),

  isLiked: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const like = await ctx.db.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: ctx.session.user.id,
            projectId: input.id,
          },
        },
      });

      return !!like;
    }),

  toggleUpvote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const like = await ctx.db.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: ctx.session.user.id,
            projectId: input.id,
          },
        },
      });

      if (like) {
        return await ctx.db.projectLike.delete({
          where: {
            userId_projectId: {
              userId: ctx.session.user.id,
              projectId: input.id,
            },
          },
        });
      } else {
        await ctx.db.projectLike.create({
          data: {
            userId: ctx.session.user.id,
            projectId: input.id,
          },
        });
        return { upvoted: true };
      }
    }),

  getLikeCount: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const count = await ctx.db.projectLike.count({
        where: { projectId: input.id },
      });
      return count;
    }),

  getProjectIds: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
        text: z.string().optional(),
        category: z.array(z.string()).optional(),
        programmingLanguage: z.array(z.string()).optional(),
        sortBy: sortBySchema,
        tags: z.array(z.string()).optional(),
        order: z.enum(orderOptions).optional(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereConditions: Prisma.ProjectWhereInput = {};

      // Text search (search in both name and description)
      if (input.text) {
        whereConditions.OR = [
          { name: { contains: input.text, mode: "insensitive" } },
          { description: { contains: input.text, mode: "insensitive" } },
        ];
      }

      if ((input?.category?.length ?? 0 > 0) && input?.category) {
        whereConditions.category = { in: input.category };
      }

      if (
        (input?.programmingLanguage?.length ?? 0 > 0) &&
        input?.programmingLanguage
      ) {
        whereConditions.programmingLanguage = { in: input.programmingLanguage };
      }

      if ((input?.tags?.length ?? 0 > 0) && input?.tags) {
        whereConditions.tags = {
          hasSome: input.tags,
        };
      }

      const projects = await ctx.db.project.findMany({
        take: input.limit + 1, // get an extra item at the end which we'll use as next cursor
        select: { id: true },
        where: whereConditions,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          [input.sortBy ?? "updatedAt"]: input.order ?? "desc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (projects.length > input.limit) {
        const nextItem = projects.pop();
        nextCursor = nextItem!.id;
      }
      return {
        projects,
        nextCursor,
      };
    }),

  getProjectOverview: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              projectLike: true,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return project;
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const project = await ctx.db.project.findUnique({
        where: {
          id: input.id,
          userProject: { some: { userId: ctx.session.user.id } },
        },
      });

      if (!project) {
        throw new Error(
          "Project not found or you do not have permission to delete it",
        );
      }

      return await ctx.db.project.delete({
        where: { id: input.id },
      });
    }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const lastStats = await ctx.db.statsCache.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // Refresh once a day
    if (
      !lastStats ||
      lastStats.createdAt < new Date(now.getTime() - 24 * 60 * 60 * 1000)
    ) {
      const allProjects = await ctx.db.project.findMany({
        select: { programmingLanguage: true },
      });

      const totalProjects = allProjects.length;

      if (totalProjects === 0) {
        return null;
      }

      // Calculate programming language statistics
      const languageCount: Record<string, number> = {};

      for (const project of allProjects) {
        if (project.programmingLanguage) {
          languageCount[project.programmingLanguage] =
            (languageCount[project.programmingLanguage] ?? 0) + 1;
        }
      }

      // Sort languages by usage and get top k (k=6)
      const sortedLanguages = Object.entries(languageCount)
        .filter((lang) => lang[0] !== defaultLanguage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6);

      const topLanguages = sortedLanguages.map(([lang]) => lang);
      const topPercentages = sortedLanguages.map(
        ([, count]) => Math.round((count / totalProjects) * 100 * 100) / 100,
      );

      const consideredLanguages = sortedLanguages.reduce(
        (acc, [, count]) => acc + count,
        0,
      );

      // add Other to topLanguages
      if (consideredLanguages < totalProjects) {
        topLanguages.push(defaultLanguage);
        topPercentages.push(
          Math.round(
            ((totalProjects - consideredLanguages) / totalProjects) * 100 * 100,
          ) / 100,
        );
      }

      // Save stats to cache
      return await ctx.db.statsCache.create({
        data: {
          languages: topLanguages,
          percentages: topPercentages,
          totalProjects: totalProjects,
        },
      });
    } else {
      return lastStats;
    }
  }),
});
