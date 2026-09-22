"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

import { redirect } from "next/navigation";
import {
  scholarshipFormSchema,
  type ScholarshipFormValues,
} from "@/lib/validations/scholarship";

export async function archiveScholarship(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("scholarships")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) {
    console.error("Error archiving scholarship:", error);
    return { success: false };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function restoreScholarship(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("scholarships")
    .update({ status: "draft" })
    .eq("id", id);

  if (error) {
    console.error("Error restoring scholarship:", error);
    return { success: false };
  }

  revalidatePath("/admin");
  return { success: true };
}


async function syncJoinTables(
  supabase: ReturnType<typeof createAdminClient>,
  scholarshipId: string,
  values: ScholarshipFormValues
) {
  await supabase
    .from("scholarship_eligible_countries")
    .delete()
    .eq("scholarship_id", scholarshipId);
  await supabase
    .from("scholarship_study_levels")
    .delete()
    .eq("scholarship_id", scholarshipId);
  await supabase
    .from("scholarship_fields_of_study")
    .delete()
    .eq("scholarship_id", scholarshipId);

  if (!values.is_globally_eligible && values.eligible_countries.length > 0) {
    await supabase.from("scholarship_eligible_countries").insert(
      values.eligible_countries.map((country) => ({
        scholarship_id: scholarshipId,
        country,
      }))
    );
  }

  if (values.study_levels.length > 0) {
    await supabase.from("scholarship_study_levels").insert(
      values.study_levels.map((study_level) => ({
        scholarship_id: scholarshipId,
        study_level,
      }))
    );
  }

  if (values.fields_of_study.length > 0) {
    await supabase.from("scholarship_fields_of_study").insert(
      values.fields_of_study.map((field_of_study) => ({
        scholarship_id: scholarshipId,
        field_of_study,
      }))
    );
  }
}

async function upsertSource(
  supabase: ReturnType<typeof createAdminClient>,
  name: string,
  websiteUrl: string
) {
  const { data: existing } = await supabase
    .from("scholarship_sources")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("scholarship_sources")
    .insert({ name, website_url: websiteUrl, trust_level: "verified" })
    .select("id")
    .single();

  if (error || !created) throw new Error("Failed to create source");
  return created.id;
}

export async function createScholarship(rawValues: unknown) {
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

export async function updateScholarship(id: string, rawValues: unknown) {
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