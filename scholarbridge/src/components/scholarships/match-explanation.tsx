import { Check, Minus, X } from "lucide-react";
import type { CheckStatus, MatchLabel, MatchResult } from "@/lib/matching";

const badgeClass: Record<Exclude<MatchLabel, "none">, string> = {
  strong: "border-primary bg-primary/10 text-primary",
  possible: "border-border bg-background text-foreground",
  ineligible:
    "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
};

const badgeText: Record<Exclude<MatchLabel, "none">, string> = {
  strong: "Strong match",
  possible: "Possible match",
  ineligible: "Not a fit",
};

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "match") {
    return (
      <Check
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-label="Matches"
      />
    );
  }
  if (status === "mismatch") {
    return (
      <X
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600 dark:text-red-400"
        aria-label="Doesn't match"
      />
    );
  }
  return (
    <Minus
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary"
      aria-label={status === "neutral" ? "Doesn't match, but not a dealbreaker" : "Unknown"}
    />
  );
}

export function MatchSummary({ match }: { match: MatchResult }) {
  if (!match.summary) return null;

  return (
    <div className="mt-3">
      {match.label !== "none" && (
        <span
          className={`inline-flex rounded border px-2 py-0.5 text-[11px] font-semibold ${badgeClass[match.label]}`}
        >
          {badgeText[match.label]}
        </span>
      )}
      <p className="mt-1.5 text-[11px] leading-relaxed text-secondary">{match.summary}</p>

      {match.checks.length > 0 && (
        <details className="mt-1.5">
          <summary className="cursor-pointer text-[11px] font-medium text-primary hover:underline">
            Why this match?
          </summary>
          <ul className="mt-2 space-y-2 rounded-md border border-border bg-background p-3">
            {match.checks.map((check) => (
              <li key={check.key} className="flex gap-2 text-[11px] leading-relaxed">
                <StatusIcon status={check.status} />
                <span>
                  <span className="font-semibold text-foreground">{check.label}: </span>
                  <span className="text-secondary">{check.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          {match.missing.length > 0 && (
            <p className="mt-2 text-[11px] text-secondary">
              Add your {match.missing.join(", ")} for a fuller picture.
            </p>
          )}
          <p className="mt-2 text-[11px] text-secondary">
            This compares your answers with the details the provider lists. Always confirm
            eligibility on the official page.
          </p>
        </details>
      )}
    </div>
  );
}