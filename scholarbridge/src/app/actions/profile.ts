"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/profile";

export async function saveProfile(
  raw: unknown
): Promise<{ success: boolean; error?: string }> {
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Some values aren't valid. Please pick from the lists." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Please sign in again." };
  }

  const v = parsed.data;
  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      full_name: v.full_name || null,
      nationality: v.nationality || null,
      study_level: v.study_level || null,
      field_of_study: v.field_of_study || null,
      desired_study_country: v.desired_study_country || null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Error saving profile:", error);
    return { success: false, error: "Could not save your profile. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/scholarships");
  return { success: true };
}