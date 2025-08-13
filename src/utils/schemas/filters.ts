import { sortByOptions } from "~/utils/constants/filters";
import { z } from "zod";

export const sortBySchema = z.enum(sortByOptions).optional();
