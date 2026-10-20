"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/constants/countries";
import { FIELD_OPTIONS, STUDY_LEVELS } from "@/constants/profile-options";
import { saveProfile } from "@/app/actions/profile";
import type { StudentProfile } from "@/types/profile";

function MiniSelect({
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
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-wider text-secondary"
      >
        {label}
      </label>
      <div className="relative mt-1">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full cursor-pointer appearance-none rounded-md border border-border bg-background pl-2.5 pr-7 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
      </div>
    </div>
  );
}

export function QuickMatchPanel({ profile }: { profile: StudentProfile | null }) {
  const router = useRouter();
  const [values, setValues] = useState({
    nationality: profile?.nationality ?? "",
    study_level: profile?.study_level ?? "",
    field_of_study: profile?.field_of_study ?? "",
    desired_study_country: profile?.desired_study_country ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      // Keep the saved name: the quick panel doesn't edit it
      const result = await saveProfile({
        full_name: profile?.full_name ?? "",
        ...values,
      });
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      window.dispatchEvent(new Event("profile-updated"));
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-t border-border pt-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniSelect
          id="qm-nationality"
          label="Nationality"
          value={values.nationality}
          onChange={(v) => update("nationality", v)}
          options={COUNTRIES}
          placeholder="Select country"
        />
        <MiniSelect
          id="qm-level"
          label="Study level"
          value={values.study_level}
          onChange={(v) => update("study_level", v)}
          options={STUDY_LEVELS}
          placeholder="Select level"
        />
        <MiniSelect
          id="qm-field"
          label="Field of study"
          value={values.field_of_study}
          onChange={(v) => update("field_of_study", v)}
          options={FIELD_OPTIONS}
          placeholder="Select field"
        />
        <MiniSelect
          id="qm-destination"
          label="Want to study in"
          value={values.desired_study_country}
          onChange={(v) => update("desired_study_country", v)}
          options={COUNTRIES}
          placeholder="No preference"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="mt-3 bg-primary font-semibold text-background hover:opacity-90"
      >
        {isPending ? "Saving..." : "Show my matches"}
      </Button>
    </form>
  );
}