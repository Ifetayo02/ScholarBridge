import type { Scholarship } from "@/types/scholarship";
import type { StudentProfile } from "@/types/profile";

export type MatchLabel = "strong" | "possible" | "none" | "ineligible";

export interface MatchResult {
  eligible: boolean;
  score: number;
  label: MatchLabel;
  reasons: string[];
  gaps: string[];
}

export const EMPTY_MATCH: MatchResult = {
  eligible: true,
  score: 0,
  label: "none",
  reasons: [],
  gaps: [],
};

export function hasProfileInfo(p: StudentProfile | null): p is StudentProfile {
  return (
    !!p &&
    !!(p.nationality || p.study_level || p.field_of_study || p.desired_study_country)
  );
}

export function matchScholarship(
  profile: StudentProfile | null,
  s: Scholarship
): MatchResult {
  if (!hasProfileInfo(profile)) return EMPTY_MATCH;

  let score = 0;
  let max = 0;
  let eligible = true;
  const reasons: string[] = [];
  const gaps: string[] = [];

  // Nationality: a gate, plus a bonus when the country is listed explicitly
  if (profile.nationality) {
    max += 3;
    if (s.eligible_countries.includes(profile.nationality)) {
      score += 3;
      reasons.push(`Open to ${profile.nationality} applicants`);
    } else if (s.is_globally_eligible) {
      score += 2;
      reasons.push("Open to all nationalities");
    } else if (s.eligible_countries.length > 0) {
      eligible = false;
      gaps.push(`Not open to ${profile.nationality} applicants`);
    } else {
      gaps.push("Eligible countries not listed");
    }
  }

  // Study level: a mismatch pushes the scholarship down
  if (profile.study_level) {
    max += 3;
    if (s.study_levels.includes(profile.study_level)) {
      score += 3;
      reasons.push(`${profile.study_level} level`);
    } else if (s.study_levels.length > 0) {
      score -= 3;
      gaps.push(`For ${s.study_levels.join(" / ")} study only`);
    }
  }

  // Field of study: no fields listed means open to all fields
  if (profile.field_of_study) {
    max += 2;
    if (s.fields_of_study.length > 0) {
      if (s.fields_of_study.includes(profile.field_of_study)) {
        score += 2;
        reasons.push(profile.field_of_study);
      } else {
        gaps.push("Different field of study");
      }
    }
  }

  // Destination: a bonus only, never a penalty
  if (profile.desired_study_country) {
    max += 2;
    if (s.destination_country === profile.desired_study_country) {
      score += 2;
      reasons.push(`Study in ${s.destination_country}`);
    }
  }

  if (!eligible) {
    return { eligible: false, score: -100, label: "ineligible", reasons, gaps };
  }

  const ratio = max > 0 ? score / max : 0;
  const label: MatchLabel =
    ratio >= 0.75 ? "strong" : ratio >= 0.4 ? "possible" : "none";

  return { eligible, score, label, reasons, gaps };
}