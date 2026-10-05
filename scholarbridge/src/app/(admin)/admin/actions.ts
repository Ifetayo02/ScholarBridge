"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  scholarshipFormSchema,
  type ScholarshipFormValues,
} from "@/lib/validations/scholarship";

type ActionResult =
  | { success: true }
  | {
      success: false;
      errors: Partial<Record<keyof ScholarshipFormValues | "_form", string[]>>;
    };

// ... (syncJoinTables, upsertSource stay exactly as before)

export async function createScholarship(rawValues: unknown): Promise<ActionResult> {
  const parsed = scholarshipFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  const values = parsed.data;
  const supabase = createAdminClient();

  const sourceId = await upsertSource(supabase, values.source_name, values.source_website_url);

  const { data: scholarship, error } = await supabase
    .from("scholarships")
    .insert({
      title: values.title,
      slug: values.slug,
      provider: values.provider,
      description: values.description || null,
      funding_type: values.funding_type,
      funding_amount: values.funding_amount || null,
      application_deadline: values.application_deadline,
      application_url: values.application_url,
      destination_country: values.destination_country,
      is_globally_eligible: values.is_globally_eligible,
      source_id: sourceId,
      verification_status: values.verification_status,
      status: values.status,
    })
    .select("id")
    .single();

  if (error || !scholarship) {
    console.error("Error creating scholarship:", error);
    return { success: false, errors: { _form: ["Failed to save. The slug may already be in use."] } };
  }

  await syncJoinTables(supabase, scholarship.id, values);

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateScholarship(id: string, rawValues: unknown): Promise<ActionResult> {
  const parsed = scholarshipFormSchema.safeParse(rawValues);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  const values = parsed.data;
  const supabase = createAdminClient();

  const sourceId = await upsertSource(supabase, values.source_name, values.source_website_url);

  const { error } = await supabase
    .from("scholarships")
    .update({
      title: values.title,
      slug: values.slug,
      provider: values.provider,
      description: values.description || null,
      funding_type: values.funding_type,
      funding_amount: values.funding_amount || null,
      application_deadline: values.application_deadline,
      application_url: values.application_url,
      destination_country: values.destination_country,
      is_globally_eligible: values.is_globally_eligible,
      source_id: sourceId,
      verification_status: values.verification_status,
      status: values.status,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating scholarship:", error);
    return { success: false, errors: { _form: ["Failed to save. The slug may already be in use."] } };
  }

  await syncJoinTables(supabase, id, values);

  revalidatePath("/admin");
  redirect("/admin");
}