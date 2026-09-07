import { createClient } from "@/lib/supabase/server";
import type { Scholarship } from "@/types/scholarship";

export async function getPublishedScholarships(): Promise<Scholarship[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select(
      `
      id,
      slug,
      title,
      provider,
      description,
      funding_type,
      funding_amount,
      application_deadline,
      application_url,
      verification_status,
      status,
      scholarship_countries ( country ),
      scholarship_study_levels ( study_level ),
      scholarship_fields_of_study ( field )
    `
    )
    .eq("status", "published")
    .order("application_deadline", { ascending: true });

  if (error) {
    console.error("Error fetching scholarships:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    provider: row.provider,
    description: row.description,
    funding_type: row.funding_type,
    funding_amount: row.funding_amount,
    application_deadline: row.application_deadline,
    application_url: row.application_url,
    verification_status: row.verification_status,
    status: row.status,
    countries: (row.scholarship_countries ?? []).map((c: { country: string }) => c.country),
    study_levels: (row.scholarship_study_levels ?? []).map(
      (l: { study_level: string }) => l.study_level
    ),
    fields_of_study: (row.scholarship_fields_of_study ?? []).map(
      (f: { field: string }) => f.field
    ),
  }));
}