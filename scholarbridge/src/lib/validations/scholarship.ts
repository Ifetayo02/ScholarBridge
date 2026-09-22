import { z } from "zod";

export const scholarshipFormSchema = z
  .object({
    title: z.string().min(3, "Title is required"),
    slug: z
      .string()
      .min(3, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
    provider: z.string().min(2, "Provider is required"),
    description: z.string().optional(),
    funding_type: z.enum(["full", "partial", "tuition", "other"]),
    funding_amount: z.string().optional(),
    application_deadline: z.string().min(1, "Deadline is required"),
    application_url: z.string().url("Must be a valid URL"),
    destination_country: z.string().min(2, "Destination country is required"),
    is_globally_eligible: z.boolean(),
    eligible_countries: z.array(z.string()),
    study_levels: z.array(z.string()).min(1, "Select at least one study level"),
    fields_of_study: z.array(z.string()),
    source_name: z.string().min(2, "Source name is required"),
    source_website_url: z.string().url("Must be a valid URL"),
    verification_status: z.enum(["pending", "verified", "rejected"]),
    status: z.enum(["draft", "published", "archived"]),
  })
  .refine(
    (data) => data.is_globally_eligible || data.eligible_countries.length > 0,
    {
      message: "Add at least one eligible country, or mark as globally eligible",
      path: ["eligible_countries"],
    }
  );

export type ScholarshipFormValues = z.infer<typeof scholarshipFormSchema>;