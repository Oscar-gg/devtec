import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { OrganizationSchema } from "~/utils/schemas/project";
import { orderOptions } from "~/utils/constants/filters";
import { type Prisma } from "@prisma/client";
import {
  getGithubAccessToken,
  getOrganizationData,
} from "~/utils/backend/github";

export const organizationsRouter = createTRPCRouter({
  createOrModifyOrganization: protectedProcedure
    .input(OrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      //   Always include the current user among the users of the organization
      if (!input.userIds.find((id) => id === ctx.session.user.id)) {
        input.userIds.push(ctx.session.user.id);
      }

      // Get github image if github url is provided
      let imageUrl = null;
      const accessToken = await getGithubAccessToken(
        ctx.session.user.id,
        ctx.db,
      );

      if (!accessToken) {
        throw new Error("No GitHub access token found for the user.");
      }

      if (input.url.includes("github.com")) {
        const githubData = await getOrganizationData({
          orgUrl: input.url,
        });
        if (githubData) {
          imageUrl = githubData.avatar_url;
        }
      }

      // Create an organization
      if (!input.id) {
        return await ctx.db.organization.create({
          data: {
            name: input.name,
            description: input.description,
            logo: imageUrl,
            url: input.url,
            user: {
              connect: input.userIds.map((id) => ({ id })),
            },
          },
        });
      } else {
        // Update an organization
        const organization = await ctx.db.organization.findUnique({
          where: { id: input.id },
          include: { user: true },
        });
        if (!organization) {
          throw new Error("Organization not found");
        }
        if (
          !organization.user.some((user) => user.id === ctx.session.user.id)
        ) {
          throw new Error(
            "You do not have permission to modify this organization",
          );
        }

        // Remove existing user associations
        await ctx.db.organization.update({
          where: { id: input.id },
          data: {
            user: {
              disconnect: organization.user.map((user) => ({ id: user.id })),
            },
          },
        });

        return await ctx.db.organization.update({
          where: { id: input.id },
          data: {
            name: input.name,
            description: input.description,
            logo: imageUrl,
            url: input.url,
            user: {
              connect: input.userIds.map((id) => ({ id })),
            },
          },
        });
      }
    }),

  getOrganizationById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          Project: {
            take: 6,
            select: {
              id: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!organization) {
        throw new Error("Organization not found");
      }

      return organization;
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

  getOrganizationIds: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
        text: z.string().optional(),
        order: z.enum(orderOptions).optional(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereConditions: Prisma.OrganizationWhereInput = {};

      // Text search (search in both name and description)
      if (input.text) {
        whereConditions.OR = [
          { name: { contains: input.text, mode: "insensitive" } },
          { description: { contains: input.text, mode: "insensitive" } },
        ];
      }

      const organizations = await ctx.db.organization.findMany({
        take: input.limit + 1, // get an extra item at the end which we'll use as next cursor
        select: { id: true },
        where: whereConditions,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: input.order ?? "desc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (organizations.length > input.limit) {
        const nextItem = organizations.pop();
        nextCursor = nextItem!.id;
      }
      return {
        organizations,
        nextCursor,
      };
    }),

  getOrganizationOverview: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          logo: true,
          name: true,
          description: true,
          url: true,
          createdAt: true,
        },
      });

      if (!organization) {
        throw new Error("Organization not found");
      }

      return organization;
    }),

  canEditOrganization: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { id: input.id, user: { some: { id: ctx.session.user.id } } },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      return !!organization;
    }),

  deleteOrganization: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const organization = await ctx.db.organization.findUnique({
        where: { id: input.id, user: { some: { id: ctx.session.user.id } } },
      });

      if (!organization) {
        throw new Error(
          "Organization not found or you do not have permission to delete it",
        );
      }

      return await ctx.db.organization.delete({
        where: { id: input.id },
      });
    }),

  getOrganizationStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.organization.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              Project: true,
              user: true,
            },
          },
        },
      });
    }),

  getOrganizationNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.organization.findMany({
      select: {
        name: true,
        id: true,
      },
    });
  }),
});
