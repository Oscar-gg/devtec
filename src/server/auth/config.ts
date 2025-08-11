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
  callbacks: {
    async signIn({ profile, account, user }) {
      const allowedDomain = "tec.mx";

      // Check if primary email has the allowed domain
      if (profile?.email?.endsWith(`@${allowedDomain}`)) {
        return true;
      }

      // Check if any verified email has the allowed domain
      if (account?.access_token?.toString()) {
        const associatedEmails = await getEmails(account?.access_token);

        for (const email of associatedEmails) {
          if (email.verified && email.email.endsWith(`@${allowedDomain}`)) {
            user.email = email.email; // Save tec email
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
