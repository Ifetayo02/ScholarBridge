import { notFound } from "next/navigation";
import { getScholarshipForAdmin } from "@/services/admin-scholarships";
import { AdminShell } from "@/components/admin/admin-shell";
import { ScholarshipForm } from "@/components/admin/scholarship-form";

export default async function EditScholarshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scholarship = await getScholarshipForAdmin(id);

  if (!scholarship) notFound();

  return (
    <AdminShell>
      <ScholarshipForm scholarship={scholarship} />
    </AdminShell>
  );
}