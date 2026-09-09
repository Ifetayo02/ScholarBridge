import { notFound } from "next/navigation";
import { getScholarshipBySlug } from "@/services/scholarships";
import { ScholarshipDetail } from "@/components/scholarships/scholarship-detail";

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scholarship = await getScholarshipBySlug(slug);

  if (!scholarship) {
    notFound();
  }

  return <ScholarshipDetail scholarship={scholarship} />;
}