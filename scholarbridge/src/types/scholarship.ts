export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string | null;
  funding_type: string | null;
  funding_amount: string | null;
  application_deadline: string | null;
  application_url: string;
  verification_status: string;
  status: string;
  countries: string[];
  study_levels: string[];
  fields_of_study: string[];
}