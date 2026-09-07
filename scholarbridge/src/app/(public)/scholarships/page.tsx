import { getPublishedScholarships } from "@/services/scholarships";
import { ScholarshipsDirectory } from "@/components/scholarships/scholarships-directory";

export default async function ScholarshipsPage() {
  const scholarships = await getPublishedScholarships();

  return <ScholarshipsDirectory initialScholarships={scholarships} />;
}