import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { defaultProfilePicture } from "~/utils/frontend/defaultProfilePicture";

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
});
