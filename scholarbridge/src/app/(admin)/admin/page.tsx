import { getAllScholarshipsForAdmin } from "@/services/admin-scholarships";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const scholarships = await getAllScholarshipsForAdmin();

  return (
    <AdminShell>
      <AdminDashboard scholarships={scholarships} />
    </AdminShell>
  );
}