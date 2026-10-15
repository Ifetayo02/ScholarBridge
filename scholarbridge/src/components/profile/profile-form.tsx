"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/constants/countries";
import { FIELD_OPTIONS, STUDY_LEVELS } from "@/constants/profile-options";
import { saveProfile } from "@/app/actions/profile";
import type { StudentProfile } from "@/types/profile";

type FormValues = {
  full_name: string;
  nationality: string;
  study_level: string;
  field_of_study: string;
  desired_study_country: string;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-secondary">
        {label}
      </label>
      <div className="relative mt-1.5">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer appearance-none rounded-md border border-border bg-background pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
      </div>
    </div>
  );
}

export function ProfileForm({
  initial,
  email,
}: {
  initial: StudentProfile | null;
  email: string;
}) {
  const [values, setValues] = useState<FormValues>({
    full_name: initial?.full_name ?? "",
    nationality: initial?.nationality ?? "",
    study_level: initial?.study_level ?? "",
    field_of_study: initial?.field_of_study ?? "",
    desired_study_country: initial?.desired_study_country ?? "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(key: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await saveProfile(values);
      if (result.success) {
        setMessage({ type: "success", text: "Saved. Scholarships are now ranked for your profile." });
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        setMessage({ type: "error", text: result.error ?? "Something went wrong." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-secondary">Email</label>
        <p className="mt-1.5 text-sm text-foreground">{email}</p>
      </div>

      <div>
        <label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Full name
        </label>
        <Input
          id="full_name"
          value={values.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          maxLength={80}
          autoComplete="name"
          className="mt-1.5"
        />
      </div>

      <SelectField
        id="nationality"
        label="Nationality"
        value={values.nationality}
        onChange={(v) => update("nationality", v)}
        options={COUNTRIES}
        placeholder="Select your country"
      />

      <SelectField
        id="study_level"
        label="Study level"
        value={values.study_level}
        onChange={(v) => update("study_level", v)}
        options={STUDY_LEVELS}
        placeholder="Select a level"
      />

      <SelectField
        id="field_of_study"
        label="Field of study"
        value={values.field_of_study}
        onChange={(v) => update("field_of_study", v)}
        options={FIELD_OPTIONS}
        placeholder="Select a field"
      />

      <SelectField
        id="desired_study_country"
        label="Where do you want to study?"
        value={values.desired_study_country}
        onChange={(v) => update("desired_study_country", v)}
        options={COUNTRIES}
        placeholder="No preference"
      />

      {message && (
        <p
          role="status"
          className={`rounded-md border px-3 py-2 text-xs ${
            message.type === "success"
              ? "border-border bg-card text-foreground"
              : "border-red-300 bg-red-50 text-red-700"
          }`}
        >
          {message.text}{" "}
          {message.type === "success" && (
            <Link href="/scholarships" className="font-medium text-primary underline underline-offset-2">
              See your matches
            </Link>
          )}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="bg-primary font-semibold text-background hover:opacity-90">
        {isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}