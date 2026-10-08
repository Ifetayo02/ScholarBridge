export type FundingType = "full" | "partial" | "tuition" | "other";

export type ApplicationStatus =
  | "saved"
  | "preparing"
  | "applied"
  | "awarded"
  | "not_selected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "saved",
  "preparing",
  "applied",
  "awarded",
  "not_selected",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  preparing: "Preparing",
  applied: "Applied",
  awarded: "Awarded",
  not_selected: "Not selected",
};

export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string | null;
  funding_type: FundingType | null;
  funding_amount: string | null;
  application_deadline: string | null;
  application_url: string;
  destination_country: string;
  is_globally_eligible: boolean;
  verification_status: string;
  status: string;
  created_at: string;
  eligible_countries: string[];
  study_levels: string[];
  fields_of_study: string[];
  source_name: string | null;
  source_website_url: string | null;
}

export interface SavedScholarship extends Scholarship {
  application_status: ApplicationStatus;
}

export const FUNDING_TYPE_LABELS: Record<FundingType, string> = {
  full: "Full Funding",
  partial: "Partial Funding",
  tuition: "Tuition Only",
  other: "Other",
};