import { createClient } from "@/lib/supabase/server";
import type { StudentProfile, StudyLevel } from "@/types/profile";

export async function getMyProfile(): Promise<StudentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("full_name, nationality, study_level, field_of_study, desired_study_country")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  if (!data) return null;

  return {
    full_name: data.full_name,
    nationality: data.nationality,
    study_level: data.study_level as StudyLevel | null,
    field_of_study: data.field_of_study,
    desired_study_country: data.desired_study_country,
  };
}