import { getPublishedScholarships } from "@/services/scholarships";
import { ScholarshipsDirectory } from "@/components/scholarships/scholarships-directory";

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const scholarships = await getPublishedScholarships(q);

  return (
    <ScholarshipsDirectory initialScholarships={scholarships} initialQuery={q} />
  );
}