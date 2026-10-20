import type { Scholarship } from "@/types/scholarship";
import type { StudentProfile } from "@/types/profile";

export type MatchLabel = "strong" | "possible" | "none" | "ineligible";
export type CheckStatus = "match" | "mismatch" | "unknown" | "neutral";

export interface MatchCheck {
  key: "nationality" | "level" | "field" | "destination";
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface MatchResult {
  eligible: boolean;
  label: MatchLabel;
  ratio: number;
  score: number;
  summary: string;
  checks: MatchCheck[];
  missing: string[];
}

export const EMPTY_MATCH: MatchResult = {
  eligible: true,
  label: "none",
  ratio: 0,
  score: 0,
  summary: "",
  checks: [],
  missing: [],
};

const WEIGHTS = { nationality: 3, level: 3, field: 2, destination: 2 } as const;

export function hasProfileInfo(p: StudentProfile | null): p is StudentProfile {
  return (
    !!p &&
    !!(p.nationality || p.study_level || p.field_of_study || p.desired_study_country)
  );
}

function listPreview(items: string[], max = 4) {
  return items.length > max
    ? `${items.slice(0, max).join(", ")} and ${items.length - max} more`
    : items.join(", ");
}

export function matchScholarship(
  profile: StudentProfile | null,
  s: Scholarship
): MatchResult {
  if (!hasProfileInfo(profile)) return EMPTY_MATCH;

  const checks: MatchCheck[] = [];
  const missing: string[] = [];

  // Nationality
  if (profile.nationality) {
    if (s.eligible_countries.includes(profile.nationality)) {
      checks.push({
        key: "nationality",
        label: "Nationality",
        status: "match",
        detail: `${profile.nationality} is on this scholarship's eligible-country list.`,
      });
    } else if (s.is_globally_eligible) {
      checks.push({
        key: "nationality",
        label: "Nationality",
        status: "match",
        detail: "Open to applicants of any nationality.",
      });
    } else if (s.eligible_countries.length > 0) {
      checks.push({
        key: "nationality",
        label: "Nationality",
        status: "mismatch",
        detail: `Only open to citizens of ${listPreview(s.eligible_countries)}.`,
      });
    } else {
      checks.push({
        key: "nationality",
        label: "Nationality",
        status: "unknown",
        detail: "Eligible countries aren't listed, so this isn't counted. Check the official page.",
      });
    }
  } else {
    missing.push("nationality");
  }

  // Study level
  if (profile.study_level) {
    if (s.study_levels.length === 0) {
      checks.push({
        key: "level",
        label: "Study level",
        status: "unknown",
        detail: "Study levels aren't listed, so this isn't counted.",
      });
    } else if (s.study_levels.includes(profile.study_level)) {
      checks.push({
        key: "level",
        label: "Study level",
        status: "match",
        detail: `Offered at ${profile.study_level} level.`,
      });
    } else {
      checks.push({
        key: "level",
        label: "Study level",
        status: "mismatch",
        detail: `Offered for ${s.study_levels.join(" / ")} study only.`,
      });
    }
  } else {
    missing.push("study level");
  }

  // Field of study
  if (profile.field_of_study) {
    if (s.fields_of_study.length === 0) {
      checks.push({
        key: "field",
        label: "Field of study",
        status: "unknown",
        detail: "No fields are listed, so this isn't counted.",
      });
    } else if (s.fields_of_study.includes(profile.field_of_study)) {
      checks.push({
        key: "field",
        label: "Field of study",
        status: "match",
        detail: `Covers ${profile.field_of_study}.`,
      });
    } else {
      checks.push({
        key: "field",
        label: "Field of study",
        status: "mismatch",
        detail: `Listed fields: ${listPreview(s.fields_of_study)}. ${profile.field_of_study} isn't listed.`,
      });
    }
  } else {
    missing.push("field of study");
  }

  // Destination (never rules a scholarship out)
  if (profile.desired_study_country) {
    if (s.destination_country === profile.desired_study_country) {
      checks.push({
        key: "destination",
        label: "Destination",
        status: "match",
        detail: `You'd study in ${s.destination_country}, as you prefer.`,
      });
    } else {
      checks.push({
        key: "destination",
        label: "Destination",
        status: "neutral",
        detail: `You'd study in ${s.destination_country}; you prefer ${profile.desired_study_country}. This doesn't rule it out.`,
      });
    }
  } else {
    missing.push("preferred destination");
  }

  // Nationality and level are hard requirements
  const blockers = checks.filter(
    (c) => (c.key === "nationality" || c.key === "level") && c.status === "mismatch"
  );
  const eligible = blockers.length === 0;

  // Details the scholarship doesn't list are not counted
  const counted = checks.filter((c) => c.status !== "unknown");
  const matched = counted.filter((c) => c.status === "match");
  const totalWeight = counted.reduce((sum, c) => sum + WEIGHTS[c.key], 0);
  const matchedWeight = matched.reduce((sum, c) => sum + WEIGHTS[c.key], 0);
  const ratio = totalWeight > 0 ? matchedWeight / totalWeight : 0;

  let label: MatchLabel;
  let summary: string;

  if (!eligible) {
    label = "ineligible";
    summary = `Not a fit: ${blockers.map((b) => b.detail).join(" ")}`;
  } else if (counted.length === 0) {
    label = "none";
    summary = "Not enough listed details to compare with your profile.";
  } else {
    label = ratio >= 0.75 ? "strong" : ratio >= 0.4 ? "possible" : "none";
    summary = `Matches ${matched.length} of ${counted.length} things you told us.`;
  }

  return { eligible, label, ratio, score: matchedWeight, summary, checks, missing };
}