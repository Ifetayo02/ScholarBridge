import { getPublishedScholarships } from "@/services/scholarships";
import { getSavedScholarshipIds } from "@/services/saved";
import { getMyProfile } from "@/services/profile";
import { createClient } from "@/lib/supabase/server";
import { ScholarshipsDirectory } from "@/components/scholarships/scholarships-directory";

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; field?: string }>;
}) {
  const { q, field } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [scholarships, savedIds, profile] = await Promise.all([
    getPublishedScholarships(q),
    getSavedScholarshipIds(),
    getMyProfile(),
  ]);

  return (
    <ScholarshipsDirectory
      initialScholarships={scholarships}
      initialQuery={q}
      initialField={field}
      savedIds={savedIds}
      isLoggedIn={!!user}
      profile={profile}
    />
  );
}