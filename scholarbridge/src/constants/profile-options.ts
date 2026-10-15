export const STUDY_LEVELS = ["Undergraduate", "Masters", "PhD"] as const;

// Use these same names when tagging scholarships in the admin form,
// otherwise field matching can't fire.
export const FIELD_OPTIONS = [
  "STEM",
  "Health Sciences",
  "Agriculture",
  "Business",
  "Social Sciences",
  "Humanities",
  "Education",
  "Law",
  "Public Policy",
  "Arts & Design",
] as const;