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
      scholarship_fields_of_study ( field_of_study ),
      scholarship_sources ( name, website_url )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
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
  };
}