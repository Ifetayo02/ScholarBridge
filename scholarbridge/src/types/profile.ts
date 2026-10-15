export type StudyLevel = "Undergraduate" | "Masters" | "PhD";

export interface StudentProfile {
  full_name: string | null;
  nationality: string | null;
  study_level: StudyLevel | null;
  field_of_study: string | null;
  desired_study_country: string | null;
}