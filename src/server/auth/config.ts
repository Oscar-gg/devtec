import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

import { db } from "~/server/db";
import { getEmails } from "~/utils/backend/github";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    error: "/auth/error",
  },
  providers: [
    GitHub({
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: {
          scope: "read:user user:email",
          prompt: "select_account",
        },
      },
      // Handle email override in callback. Safe to add as github verifies emails.
      allowDangerousEmailAccountLinking: true,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  events: {
    createUser: async ({ user }) => {
      // Init preferences for new users
      if (user.id) {
        await db.userPreferences.create({
          data: {
            userId: user.id,
          },
        });
        await db.user.update({
          where: { id: user.id },
          data: {
            originalImage: user.image,
          },
        });
      }
    },
  },
  callbacks: {
    async signIn({ profile, account, user }) {
      const allowedDomains = ["@tec.mx", "@exatec.mx"];

      // Check if primary email has the allowed domain
      if (
        profile?.email &&
        allowedDomains.some((domain) => profile?.email?.endsWith(domain))
      ) {
        if (user.id) {
          try {
            await db.user.update({
              where: { id: user.id },
              data: { schoolEmail: profile.email },
            });
          } catch (error) {
            console.error("Error updating user:", error);
          }
        }
        return true;
      }

      // Check if any verified email has the allowed domain
      if (account?.access_token?.toString()) {
        const associatedEmails = await getEmails(account?.access_token);

        for (const email of associatedEmails) {
          if (
            email.verified &&
            allowedDomains.some((domain) => email.email.endsWith(domain))
          ) {
            if (user.id) {
              try {
                await db.user.update({
                  where: { id: user.id },
                  data: { schoolEmail: email.email },
                });
              } catch (error) {
                console.error("Error updating user:", error);
              }
            }

            return true;
          }
        }
      }

      return false;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
