import { z } from "zod";
import { COUNTRIES } from "@/constants/countries";
import { FIELD_OPTIONS, STUDY_LEVELS } from "@/constants/profile-options";

export const profileSchema = z.object({
  full_name: z.string().trim().max(80),
  nationality: z.union([z.enum(COUNTRIES), z.literal("")]),
  study_level: z.union([z.enum(STUDY_LEVELS), z.literal("")]),
  field_of_study: z.union([z.enum(FIELD_OPTIONS), z.literal("")]),
  desired_study_country: z.union([z.enum(COUNTRIES), z.literal("")]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;