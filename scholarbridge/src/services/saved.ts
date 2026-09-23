import { createClient } from "@/lib/supabase/server";
import type { Scholarship } from "@/types/scholarship";

export async function getSavedScholarshipIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("saved_scholarships")
    .select("scholarship_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved ids:", error);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.scholarship_id));
}

export async function getSavedScholarships(): Promise<Scholarship[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saved_scholarships")
    .select(
      `
      scholarships (
        id, slug, title, provider, description, funding_type, funding_amount,
        application_deadline, application_url, destination_country,
        is_globally_eligible, verification_status, status, created_at,
        scholarship_eligible_countries ( country ),
        scholarship_study_levels ( study_level ),
        scholarship_fields_of_study ( field_of_study )
      )
      `
    )
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching saved scholarships:", error);
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const s = Array.isArray(row.scholarships) ? row.scholarships[0] : row.scholarships;
      if (!s) return null;
      return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        provider: s.provider,
        description: s.description,
        funding_type: s.funding_type,
        funding_amount: s.funding_amount,
        application_deadline: s.application_deadline,
        application_url: s.application_url,
        destination_country: s.destination_country,
        is_globally_eligible: s.is_globally_eligible,
        verification_status: s.verification_status,
        status: s.status,
        created_at: s.created_at,
        eligible_countries: (s.scholarship_eligible_countries ?? []).map((c: { country: string }) => c.country),
        study_levels: (s.scholarship_study_levels ?? []).map((l: { study_level: string }) => l.study_level),
        fields_of_study: (s.scholarship_fields_of_study ?? []).map((f: { field_of_study: string }) => f.field_of_study),
        source_name: null,
        source_website_url: null,
      };
    })
    .filter((s): s is Scholarship => s !== null);
}