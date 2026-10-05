import { getPublishedScholarships } from "@/services/scholarships";
import { getSavedScholarshipIds } from "@/services/saved";
import { createClient } from "@/lib/supabase/server";
import { ScholarshipsDirectory } from "@/components/scholarships/scholarships-directory";

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [scholarships, savedIds] = await Promise.all([
    getPublishedScholarships(q),
    getSavedScholarshipIds(),
  ]);

  return (
    <ScholarshipsDirectory
      initialScholarships={scholarships}
      initialQuery={q}
      savedIds={savedIds}
      isLoggedIn={!!user}
    />
  );
}