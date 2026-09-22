import { createAdminClient } from "@/lib/supabase/admin";
import type { Scholarship } from "@/types/scholarship";

export interface AdminScholarshipRow extends Scholarship {
  source_name_admin: string | null;
}

export async function getAllScholarshipsForAdmin(): Promise<AdminScholarshipRow[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select(
      `
      id, slug, title, provider, description, funding_type, funding_amount,
      application_deadline, application_url, destination_country,
      is_globally_eligible, verification_status, status, created_at,
      scholarship_eligible_countries ( country ),
      scholarship_study_levels ( study_level ),
      scholarship_fields_of_study ( field_of_study ),
      scholarship_sources ( name, website_url )
      `
    )
    .order("application_deadline", { ascending: true });

  if (error) {
    console.error("Error fetching admin scholarships:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const source = Array.isArray(row.scholarship_sources)
      ? row.scholarship_sources[0]
      : row.scholarship_sources;

    return {
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
      created_at: row.created_at,
      eligible_countries: (row.scholarship_eligible_countries ?? []).map(
        (c: { country: string }) => c.country
      ),
      study_levels: (row.scholarship_study_levels ?? []).map(
        (l: { study_level: string }) => l.study_level
      ),
      fields_of_study: (row.scholarship_fields_of_study ?? []).map(
        (f: { field_of_study: string }) => f.field_of_study
      ),
      source_name: source?.name ?? null,
      source_website_url: source?.website_url ?? null,
      source_name_admin: source?.name ?? null,
    };
  });
}

export async function getScholarshipForAdmin(
  id: string
): Promise<AdminScholarshipRow | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("scholarships")
    .select(
      `
      id, slug, title, provider, description, funding_type, funding_amount,
      application_deadline, application_url, destination_country,
      is_globally_eligible, verification_status, status, created_at, source_id,
      scholarship_eligible_countries ( country ),
      scholarship_study_levels ( study_level ),
      scholarship_fields_of_study ( field_of_study ),
      scholarship_sources ( name, website_url )
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching scholarship:", error);
    return null;
  }

  const source = Array.isArray(data.scholarship_sources)
    ? data.scholarship_sources[0]
    : data.scholarship_sources;

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
    created_at: data.created_at,
    eligible_countries: (data.scholarship_eligible_countries ?? []).map(
      (c: { country: string }) => c.country
    ),
    study_levels: (data.scholarship_study_levels ?? []).map(
      (l: { study_level: string }) => l.study_level
    ),
    fields_of_study: (data.scholarship_fields_of_study ?? []).map(
      (f: { field_of_study: string }) => f.field_of_study
    ),
    source_name: source?.name ?? null,
    source_website_url: source?.website_url ?? null,
    source_name_admin: source?.name ?? null,
  };
}