"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  scholarshipFormSchema,
  type ScholarshipFormValues,
} from "@/lib/validations/scholarship";
import { createScholarship, updateScholarship } from "@/app/(admin)/admin/actions";
import type { AdminScholarshipRow } from "@/services/admin-scholarships";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  }

  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
          >
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
              <X className="h-3 w-3 text-secondary hover:text-foreground" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : "Add another..."}
          className="min-w-[120px] flex-1 bg-transparent text-xs text-foreground placeholder:text-secondary focus:outline-none"
        />
      </div>
    </div>
  );
}

export function ScholarshipForm({
  scholarship,
}: {
  scholarship?: AdminScholarshipRow;
}) {
  const isEditing = !!scholarship;
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: {
      title: scholarship?.title ?? "",
      slug: scholarship?.slug ?? "",
      provider: scholarship?.provider ?? "",
      description: scholarship?.description ?? "",
      funding_type: scholarship?.funding_type ?? "full",
      funding_amount: scholarship?.funding_amount ?? "",
      application_deadline: scholarship?.application_deadline ?? "",
      application_url: scholarship?.application_url ?? "",
      destination_country: scholarship?.destination_country ?? "",
      is_globally_eligible: scholarship?.is_globally_eligible ?? false,
      eligible_countries: scholarship?.eligible_countries ?? [],
      study_levels: scholarship?.study_levels ?? [],
      fields_of_study: scholarship?.fields_of_study ?? [],
      source_name: scholarship?.source_name ?? "",
      source_website_url: scholarship?.source_website_url ?? "",
      verification_status: (scholarship?.verification_status as any) ?? "pending",
      status: (scholarship?.status as any) ?? "draft",
    },
  });

  const title = watch("title");
  const isGloballyEligible = watch("is_globally_eligible");
  const eligibleCountries = watch("eligible_countries");
  const studyLevels = watch("study_levels");
  const fieldsOfStudy = watch("fields_of_study");
  const currentStatus = watch("status");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("title", e.target.value);
    if (!slugTouched) {
      setValue("slug", slugify(e.target.value));
    }
  }

  function onSubmit(values: ScholarshipFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = isEditing
        ? await updateScholarship(scholarship!.id, values)
        : await createScholarship(values);

      if (result && !result.success) {
        setServerError(
          result.errors?._form?.[0] ?? "Something went wrong. Check the fields above."
        );
      }
    });
  }

  function toggleStudyLevel(level: string) {
    setValue(
      "study_levels",
      studyLevels.includes(level)
        ? studyLevels.filter((l) => l !== level)
        : [...studyLevels, level]
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-secondary">
            Scholarships / {isEditing ? scholarship!.title : "New Opportunity"}
          </p>
          <h1 className="mt-1 flex items-center gap-3 font-serif text-3xl font-bold text-primary">
            {isEditing ? "Edit Scholarship" : "Add Scholarship"}
            <span className="rounded border border-border bg-card px-2 py-0.5 text-xs font-medium uppercase text-secondary">
              {currentStatus}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm font-medium text-secondary hover:text-foreground">
            Cancel
          </Link>
          <Button type="submit" disabled={isPending} className="bg-primary text-background font-semibold">
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {serverError && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </p>
      )}

      {/* Core Details */}
      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-semibold text-primary">Core Details</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Scholarship Title
            </label>
            <Input {...register("title")} onChange={handleTitleChange} className="mt-1.5" />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Slug</label>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs text-secondary">/scholarships/</span>
              <Input
                {...register("slug")}
                onChange={(e) => {
                  setSlugTouched(true);
                  setValue("slug", e.target.value);
                }}
              />
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Provider</label>
            <Input {...register("provider")} className="mt-1.5" />
            {errors.provider && <p className="mt-1 text-xs text-red-600">{errors.provider.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="mt-1.5 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground"
            />
          </div>
        </div>
      </section>

      {/* Funding & Key Dates */}
      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-semibold text-primary">Funding &amp; Key Dates</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Funding Type</label>
            <select
              {...register("funding_type")}
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="full">Full Funding</option>
              <option value="partial">Partial Funding</option>
              <option value="tuition">Tuition Only</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Funding Amount (free text)
            </label>
            <Input {...register("funding_amount")} placeholder="e.g. Full Tuition + Stipend" className="mt-1.5" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Application Deadline
            </label>
            <Input type="date" {...register("application_deadline")} className="mt-1.5" />
            {errors.application_deadline && (
              <p className="mt-1 text-xs text-red-600">{errors.application_deadline.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Application URL
            </label>
            <Input {...register("application_url")} placeholder="https://" className="mt-1.5" />
            {errors.application_url && (
              <p className="mt-1 text-xs text-red-600">{errors.application_url.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Geographic Eligibility */}
      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-semibold text-primary">Geographic Eligibility</h2>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Destination Country
            </label>
            <Input {...register("destination_country")} className="mt-1.5" />
            {errors.destination_country && (
              <p className="mt-1 text-xs text-red-600">{errors.destination_country.message}</p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={isGloballyEligible}
              onChange={(e) => setValue("is_globally_eligible", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary accent-primary"
            />
            Eligible for applicants worldwide (no country restrictions)
          </label>

          {!isGloballyEligible && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Eligible Countries
              </label>
              <div className="mt-1.5">
                <TagInput
                  values={eligibleCountries}
                  onChange={(v) => setValue("eligible_countries", v)}
                  placeholder="Type a country and press Enter..."
                />
              </div>
              {errors.eligible_countries && (
                <p className="mt-1 text-xs text-red-600">{errors.eligible_countries.message as string}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Academic Criteria */}
      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-semibold text-primary">Academic Criteria</h2>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Study Levels
          </label>
          <div className="mt-2 flex flex-wrap gap-4">
            {["Undergraduate", "Masters", "PhD"].map((level) => (
              <label key={level} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={studyLevels.includes(level)}
                  onChange={() => toggleStudyLevel(level)}
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                />
                {level}
              </label>
            ))}
          </div>
          {errors.study_levels && (
            <p className="mt-1 text-xs text-red-600">{errors.study_levels.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Fields of Study
          </label>
          <div className="mt-1.5">
            <TagInput
              values={fieldsOfStudy}
              onChange={(v) => setValue("fields_of_study", v)}
              placeholder="e.g. STEM, Public Policy..."
            />
          </div>
        </div>
      </section>

      {/* Provenance & Curation Status */}
      <section className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-semibold text-primary">Source &amp; Curation Status</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Source Name
            </label>
            <Input {...register("source_name")} className="mt-1.5" />
            {errors.source_name && <p className="mt-1 text-xs text-red-600">{errors.source_name.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Source Website URL
            </label>
            <Input {...register("source_website_url")} placeholder="https://" className="mt-1.5" />
            {errors.source_website_url && (
              <p className="mt-1 text-xs text-red-600">{errors.source_website_url.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Verification Status
            </label>
            <select
              {...register("verification_status")}
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Publication Status
            </label>
            <select
              {...register("status")}
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="draft">Draft (not visible to students)</option>
              <option value="published">Published (live on the site)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Link href="/admin" className="text-sm font-medium text-secondary hover:text-foreground">
          Cancel
        </Link>
        <Button type="submit" disabled={isPending} className="bg-primary text-background font-semibold px-6">
          {isPending ? "Saving..." : isEditing ? "Save Changes" : "Save Scholarship"}
        </Button>
      </div>
    </form>
  );
}