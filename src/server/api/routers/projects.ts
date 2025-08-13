import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { ProjectSchema } from "~/utils/schemas/project";
import { orderOptions, sortByOptions } from "~/utils/constants/filters";
import { sortBySchema } from "~/utils/schemas/filters";
export const projectsRouter = createTRPCRouter({
  createOrModifyProject: protectedProcedure
    .input(ProjectSchema)
    .mutation(async ({ input, ctx }) => {
      if (!input.id) {
        if (!input.userIds.find((id) => id === ctx.session.user.id)) {
          input.userIds.push(ctx.session.user.id);
        }

        const project = await ctx.db.project.create({
          data: {
            name: input.name,
            description: input.description,
            category: input.category,
            githubUrl: input.githubUrl,
            deploymentUrl: input.deploymentUrl,
            // tags: {
            //   connectOrCreate: input.tags.map((tag) => ({
            //     where: { name: tag.name },
            //     create: { name: tag.name, color: tag.color },
            //   })),
            // },
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

        return await ctx.db.project.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            category: input.category,
            githubUrl: input.githubUrl,
            deploymentUrl: input.deploymentUrl,
            // tags: {
            //   connectOrCreate: input.tags.map((tag) => ({
            //     where: { name: tag.name },
            //     create: { name: tag.name, color: tag.color },
            //   })),
            // },
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
                  profileImage: true,
                },
              },
            },
          },
          tags: true,
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
      const whereConditions: {
        OR?: Array<{
          name?: { contains: string; mode: "insensitive" };
          description?: { contains: string; mode: "insensitive" };
        }>;
        category?: { in: string[] };
        programmingLanguage?: { in: string[] };
        tags?: {
          some: {
            name: { in: string[] };
          };
        };
      } = {};

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
          some: {
            name: { in: input.tags },
          },
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
          tags: true,
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
});
