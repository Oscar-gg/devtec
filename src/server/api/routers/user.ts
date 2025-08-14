import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { defaultProfilePicture } from "~/utils/frontend/defaultProfilePicture";
import { orderOptions } from "~/utils/constants/filters";
import type { Prisma } from "@prisma/client";

export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        workExperience: {
          include: {
            company: true,
          },
        },
        organizations: true,
        userPreferences: true,
        UserLink: {
          include: {
            linkType: true,
          },
        },
        UserProject: {
          include: {
            project: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Get public profile by ID
  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          workExperience: {
            include: {
              company: true,
            },
          },
          organizations: true,
          userPreferences: true,
          UserLink: {
            include: {
              linkType: true,
            },
          },
          UserProject: {
            take: 6,
            include: {
              project: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Apply privacy settings
      const preferences = user.userPreferences;

      return {
        ...user,
        email: preferences?.showEmail ? user.email : null,
        schoolEmail: preferences?.showSchoolEmail ? user.schoolEmail : null,
        image: user.image,
        workExperience: preferences?.showWorkExperience
          ? user.workExperience
          : [],
        organizations: preferences?.showOrganizations ? user.organizations : [],
        UserProject: preferences?.showRelatedProjects ? user.UserProject : [],
      };
    }),

  getProjectCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.userProject.count({
        where: { userId: input.userId },
      });
    }),

  // Update user preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        showGenericImage: z.boolean().optional(),
        showEmail: z.boolean().optional(),
        showSchoolEmail: z.boolean().optional(),
        showProfile: z.boolean().optional(),
        showWorkExperience: z.boolean().optional(),
        showOrganizations: z.boolean().optional(),
        showRelatedProjects: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update profile image if necessary
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { image: true, originalImage: true },
      });
      if (input.showGenericImage && user?.image === user?.originalImage) {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { image: defaultProfilePicture(ctx.session.user.name) },
        });
      } else if (
        !input.showGenericImage &&
        user?.image !== user?.originalImage
      ) {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { image: user?.originalImage },
        });
      }

      const preferences = await ctx.db.userPreferences.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
      });

      return preferences;
    }),

  getUserOverview: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      // Add properties for compatibility with ProfileCard component
      return { ...user, email: null, schoolEmail: null, organizations: null };
    }),

  getUserIds: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(5),
        text: z.string().optional(),
        order: z.enum(orderOptions).optional(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereConditions: Prisma.UserWhereInput = {};

      if (input.text) {
        whereConditions.OR = [
          { name: { contains: input.text, mode: "insensitive" } },
        ];
      }

      const users = await ctx.db.user.findMany({
        take: input.limit + 1, // get an extra item at the end which we'll use as next cursor
        select: { id: true },
        where: whereConditions,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: input.order ?? "desc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }
      return {
        users,
        nextCursor,
      };
    }),
});
