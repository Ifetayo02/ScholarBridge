import { AdminShell } from "@/components/admin/admin-shell";
import { ScholarshipForm } from "@/components/admin/scholarship-form";

export default function NewScholarshipPage() {
  return (
    <AdminShell>
      <ScholarshipForm />
    </AdminShell>
  );
}