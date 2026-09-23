"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleSaveScholarship(scholarshipId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, requiresAuth: true };
  }

  const { data: existing } = await supabase
    .from("saved_scholarships")
    .select("id")
    .eq("user_id", user.id)
    .eq("scholarship_id", scholarshipId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_scholarships").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("saved_scholarships")
      .insert({ user_id: user.id, scholarship_id: scholarshipId });
  }

  revalidatePath("/saved");
  revalidatePath("/scholarships");
  return { success: true, saved: !existing };
}