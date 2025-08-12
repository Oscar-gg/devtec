import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(350),
  category: z.string().min(1).max(50),
  githubUrl: z.string().url().nullish(),
  deploymentUrl: z.string().url().nullish(),
  createdAt: z.date().nullish(),
  tags: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string().min(1).max(50),
      color: z.string().min(1).max(20),
    }),
  ),
  userIds: z.array(z.string()),
});
