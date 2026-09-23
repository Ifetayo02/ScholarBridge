import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSavedScholarships } from "@/services/saved";
import { SavedScholarshipsClient } from "@/components/scholarships/saved-scholarships-client";

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/saved");
  }

  const scholarships = await getSavedScholarships();

  return <SavedScholarshipsClient initialScholarships={scholarships} />;
}