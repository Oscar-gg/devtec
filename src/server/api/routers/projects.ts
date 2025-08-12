import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { ProjectSchema } from "~/utils/schemas/project";

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
});
