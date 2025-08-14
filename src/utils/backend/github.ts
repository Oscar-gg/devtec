import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

const GitHubEmailSchema = z.object({
  email: z.string(),
  primary: z.boolean(),
  verified: z.boolean(),
  visibility: z.union([z.literal("public"), z.literal("private")]).nullish(),
});

export const getEmails = async (
  accessToken: string,
): Promise<z.infer<typeof GitHubEmailSchema>[]> => {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const emails = z.array(GitHubEmailSchema).parse(await response.json());
    return emails;
  } else {
    throw new Error("Failed to fetch emails");
  }
};

const GitHubProjectSchema = z.object({
  full_name: z.string(),
  description: z.string().nullish(),
  stargazers_count: z.number().optional(),
  language: z.string().optional(),
  forks_count: z.number().optional(),
});

export const getRepositoryData = async ({
  accessToken,
  repoUrl,
}: {
  accessToken: string;
  repoUrl: string;
}): Promise<z.infer<typeof GitHubProjectSchema>> => {
  if (repoUrl.endsWith("/")) {
    repoUrl = repoUrl.slice(0, -1);
  }
  const ownerRepo = repoUrl.split("/").slice(-2);

  if (ownerRepo.length !== 2) {
    throw new Error("Invalid repository URL format");
  }

  const response = await fetch(
    `https://api.github.com/repos/${ownerRepo[0]}/${ownerRepo[1]}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.ok) {
    const projectData = GitHubProjectSchema.parse(await response.json());
    return projectData;
  } else {
    if (response.status === 404) {
      throw new Error("Repository not found");
    }
    throw new Error("Failed to fetch project data");
  }
};

export const getGithubAccessToken = async (
  userId: string,
  db: PrismaClient,
): Promise<string | null> => {
  const userAccessToken = await db.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        where: { provider: "github" },
        select: { access_token: true },
      },
    },
  });

  if (
    !userAccessToken ||
    userAccessToken.accounts.length === 0 ||
    !userAccessToken.accounts[0]?.access_token
  ) {
    return null;
  }
  return userAccessToken.accounts[0].access_token;
};
