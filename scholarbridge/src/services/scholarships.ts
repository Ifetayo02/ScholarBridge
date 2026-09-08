import { createClient } from "@/lib/supabase/server";
import type { Scholarship } from "@/types/scholarship";

export async function getPublishedScholarships(
  query?: string
): Promise<Scholarship[]> {
  const supabase = await createClient();

  let request = supabase
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
      destination_country,
      is_globally_eligible,
      verification_status,
      status,
      scholarship_eligible_countries ( country ),
      scholarship_study_levels ( study_level ),
      scholarship_fields_of_study ( field_of_study )
    `
    )
    .eq("status", "published")
    .order("application_deadline", { ascending: true });

  if (query) {
    request = request.or(`title.ilike.%${query}%,provider.ilike.%${query}%`);
  }

  const { data, error } = await request;

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
    destination_country: row.destination_country,
    is_globally_eligible: row.is_globally_eligible,
    verification_status: row.verification_status,
    status: row.status,
    eligible_countries: (row.scholarship_eligible_countries ?? []).map(
      (c: { country: string }) => c.country
    ),
    study_levels: (row.scholarship_study_levels ?? []).map(
      (l: { study_level: string }) => l.study_level
    ),
    fields_of_study: (row.scholarship_fields_of_study ?? []).map(
      (f: { field_of_study: string }) => f.field_of_study
    ),
  }));
}

export async function getScholarshipBySlug(
  slug: string
): Promise<Scholarship | null> {
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
      destination_country,
      is_globally_eligible,
      verification_status,
      status,
      scholarship_eligible_countries ( country ),
      scholarship_study_levels ( study_level ),
      scholarship_fields_of_study ( field_of_study )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    console.error("Error fetching scholarship:", error);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    provider: data.provider,
    description: data.description,
    funding_type: data.funding_type,
    funding_amount: data.funding_amount,
    application_deadline: data.application_deadline,
    application_url: data.application_url,
    destination_country: data.destination_country,
    is_globally_eligible: data.is_globally_eligible,
    verification_status: data.verification_status,
    status: data.status,
    eligible_countries: (data.scholarship_eligible_countries ?? []).map(
      (c: { country: string }) => c.country
    ),
    study_levels: (data.scholarship_study_levels ?? []).map(
      (l: { study_level: string }) => l.study_level
    ),
    fields_of_study: (data.scholarship_fields_of_study ?? []).map(
      (f: { field_of_study: string }) => f.field_of_study
    ),
  };
}