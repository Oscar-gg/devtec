import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(350),
  category: z.string().min(1).max(50),
  githubUrl: z.string().nullish(),
  deploymentUrl: z.string().nullish(),
  programmingLanguage: z.string().min(1).max(50).nullish(),
  createdAt: z.date().nullish(),
  tags: z.array(z.string().min(1).max(50)),
  userIds: z.array(z.string()),
});
