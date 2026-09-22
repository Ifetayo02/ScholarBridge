"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  User,
  Bookmark,
  Building2,
  Clock,
  Calendar,
  X,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { FundingType, Scholarship } from "@/types/scholarship";
import { FUNDING_TYPE_LABELS } from "@/types/scholarship";

function isUrgent(deadline: string | null) {
  if (!deadline) return false;
  const daysLeft =
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysLeft >= 0 && daysLeft <= 7;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline listed";
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ScholarshipsDirectory({
  initialScholarships,
  initialQuery,
}: {
  initialScholarships: Scholarship[];
  initialQuery?: string;
}) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFunding, setSelectedFunding] = useState<FundingType[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedEligibility, setSelectedEligibility] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [countrySearchFocused, setCountrySearchFocused] = useState(false);
  const [committedNoMatch, setCommittedNoMatch] = useState(false);
  const [sortBy, setSortBy] = useState("soonest");

  const destinationOptions = useMemo(
    () =>
      Array.from(
        new Set(initialScholarships.map((s) => s.destination_country))
      ).sort(),
    [initialScholarships]
  );
  const levelOptions = useMemo(
    () =>
      Array.from(
        new Set(initialScholarships.flatMap((s) => s.study_levels))
      ).sort(),
    [initialScholarships]
  );
  const fundingScopeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          initialScholarships
            .map((s) => s.funding_type)
            .filter((f): f is FundingType => f !== null)
        )
      ),
    [initialScholarships]
  );
  const fieldOptions = useMemo(
    () =>
      Array.from(
        new Set(initialScholarships.flatMap((s) => s.fields_of_study))
      ).sort(),
    [initialScholarships]
  );
  const eligibilityOptions = useMemo(
    () =>
      Array.from(
        new Set(initialScholarships.flatMap((s) => s.eligible_countries))
      ).sort(),
    [initialScholarships]
  );
  const globallyEligibleCount = useMemo(
    () => initialScholarships.filter((s) => s.is_globally_eligible).length,
    [initialScholarships]
  );

  const countrySuggestions = useMemo(() => {
    if (!countrySearch.trim()) return [];
    const q = countrySearch.trim().toLowerCase();
    return eligibilityOptions
      .filter((c) => !selectedEligibility.includes(c))
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 6);
  }, [countrySearch, eligibilityOptions, selectedEligibility]);

  function toggleFilter<T>(
    list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    val: T
  ) {
    setList(list.includes(val) ? list.filter((item) => item !== val) : [...list, val]);
  }

  function addEligibleCountry(country: string) {
    if (!selectedEligibility.includes(country)) {
      setSelectedEligibility([...selectedEligibility, country]);
    }
    setCountrySearch("");
    setCommittedNoMatch(false);
  }

  function handleCountryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const typed = countrySearch.trim();
    if (!typed) return;

    const exactMatch = eligibilityOptions.find(
      (c) => c.toLowerCase() === typed.toLowerCase()
    );

    if (exactMatch) {
      addEligibleCountry(exactMatch);
    } else {
      setCommittedNoMatch(true);
    }
  }

  function clearAllFilters() {
    setSelectedLevels([]);
    setSelectedFunding([]);
    setSelectedDestinations([]);
    setSelectedFields([]);
    setSelectedEligibility([]);
    setCountrySearch("");
    setCommittedNoMatch(false);
  }

  const filtered = useMemo(() => {
    let result = initialScholarships.filter((s) => {
      const matchesLevel =
        selectedLevels.length === 0 ||
        selectedLevels.some((l) => s.study_levels.includes(l));
      const matchesFunding =
        selectedFunding.length === 0 ||
        (s.funding_type && selectedFunding.includes(s.funding_type));
      const matchesDestination =
        selectedDestinations.length === 0 ||
        selectedDestinations.includes(s.destination_country);
      const matchesField =
        selectedFields.length === 0 ||
        selectedFields.some((f) => s.fields_of_study.includes(f));
      const matchesEligibility =
        selectedEligibility.length === 0 ||
        s.is_globally_eligible ||
        selectedEligibility.some((c) => s.eligible_countries.includes(c));
      return (
        matchesLevel &&
        matchesFunding &&
        matchesDestination &&
        matchesField &&
        matchesEligibility
      );
    });

    if (sortBy === "soonest") {
      result = [...result].sort((a, b) => {
        if (!a.application_deadline) return 1;
        if (!b.application_deadline) return -1;
        return (
          new Date(a.application_deadline).getTime() -
          new Date(b.application_deadline).getTime()
        );
      });
    } else if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [
    initialScholarships,
    selectedLevels,
    selectedFunding,
    selectedDestinations,
    selectedFields,
    selectedEligibility,
    sortBy,
  ]);

  const activeTags: { tag: string; remove: () => void }[] = [
    ...selectedEligibility.map((tag) => ({
      tag: `Eligible: ${tag}`,
      remove: () => toggleFilter(selectedEligibility, setSelectedEligibility, tag),
    })),
    ...selectedLevels.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedLevels, setSelectedLevels, tag),
    })),
    ...selectedFunding.map((tag) => ({
      tag: FUNDING_TYPE_LABELS[tag],
      remove: () => toggleFilter(selectedFunding, setSelectedFunding, tag),
    })),
    ...selectedDestinations.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedDestinations, setSelectedDestinations, tag),
    })),
    ...selectedFields.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedFields, setSelectedFields, tag),
    })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
              ScholarBridge
            </Link>
            <form action="/scholarships" className="relative hidden w-72 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" aria-hidden="true" />
              <Input
                type="search"
                name="q"
                defaultValue={initialQuery}
                placeholder="Search scholarships..."
                className="h-9 w-full rounded-md border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-secondary focus-visible:ring-primary"
              />
            </form>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-secondary transition hover:text-foreground">Discover</Link>
            <Link href="/saved" className="text-secondary transition hover:text-foreground">Saved</Link>
            <Link href="/scholarships" className="border-b-2 border-primary pb-1 font-semibold text-primary">Directory</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button aria-label="Notifications" className="text-secondary transition hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/login" aria-label="Account" className="text-secondary transition hover:text-foreground">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-serif text-lg font-semibold text-primary">Filters</h2>
              <button type="button" onClick={clearAllFilters} className="text-xs text-secondary underline-offset-2 hover:text-primary hover:underline">
                Clear All
              </button>
            </div>

            <div className="space-y-6 pt-6 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Where Can I Apply?
                </p>

                {globallyEligibleCount > 0 && (
                  <p className="mt-2 text-[11px] text-secondary">
                    {globallyEligibleCount} scholarship{globallyEligibleCount === 1 ? "" : "s"} open
                    to all nationalities, regardless of this filter.
                  </p>
                )}

                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setCommittedNoMatch(false);
                    }}
                    onKeyDown={handleCountryKeyDown}
                    onFocus={() => setCountrySearchFocused(true)}
                    onBlur={() => setTimeout(() => setCountrySearchFocused(false), 150)}
                    placeholder="Type your country..."
                    className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  {countrySearchFocused && countrySearch.trim() && (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-sm">
                      {committedNoMatch ? (
                        <p className="px-3 py-2 text-xs text-secondary">
                          No country-restricted scholarships list &quot;{countrySearch.trim()}&quot;
                          {globallyEligibleCount > 0
                            ? ` — but ${globallyEligibleCount} scholarship${globallyEligibleCount === 1 ? "" : "s"} are globally open.`
                            : "."}
                        </p>
                      ) : countrySuggestions.length > 0 ? (
                        countrySuggestions.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onMouseDown={() => addEligibleCountry(country)}
                            className="block w-full px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/10"
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-xs text-secondary">
                          No country-restricted scholarships list &quot;{countrySearch.trim()}&quot;
                          {globallyEligibleCount > 0
                            ? ` — but ${globallyEligibleCount} scholarship${globallyEligibleCount === 1 ? "" : "s"} are globally open.`
                            : "."}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {selectedEligibility.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedEligibility.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => toggleFilter(selectedEligibility, setSelectedEligibility, country)}
                        className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground hover:border-primary"
                      >
                        {country}
                        <X className="h-3 w-3 text-secondary" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Study Destination</p>
                <div className="mt-3 space-y-2.5">
                  {destinationOptions.map((country) => (
                    <label key={country} className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(country)}
                        onChange={() => toggleFilter(selectedDestinations, setSelectedDestinations, country)}
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Level of Study</p>
                <div className="mt-3 space-y-2.5">
                  {levelOptions.map((level) => (
                    <label key={level} className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() => toggleFilter(selectedLevels, setSelectedLevels, level)}
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Field of Study</p>
                <div className="mt-3 space-y-2.5">
                  {fieldOptions.map((field) => (
                    <label key={field} className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={() => toggleFilter(selectedFields, setSelectedFields, field)}
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Funding Scope</p>
                <div className="mt-3 space-y-2.5">
                  {fundingScopeOptions.map((scope) => (
                    <label key={scope} className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300">
                      <input
                        type="checkbox"
                        checked={selectedFunding.includes(scope)}
                        onChange={() => toggleFilter(selectedFunding, setSelectedFunding, scope)}
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{FUNDING_TYPE_LABELS[scope]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                {initialQuery
                  ? `Results for "${initialQuery}" (${filtered.length})`
                  : `${filtered.length} Scholarship${filtered.length === 1 ? "" : "s"} Available`}
              </h1>

              <div className="flex items-center gap-1 text-xs text-secondary">
                <span>Sort by:</span>
                <div className="relative inline-block">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer appearance-none rounded-sm border-none bg-transparent pr-4 font-semibold text-foreground focus:outline-none"
                  >
                    <option value="soonest">Soonest Deadline</option>
                    <option value="newest">Newly Added</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
                </div>
              </div>
            </div>

            {activeTags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeTags.map(({ tag, remove }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={remove}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground transition hover:border-primary"
                  >
                    <span>{tag}</span>
                    <X className="h-3 w-3 text-secondary hover:text-foreground" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {filtered.length === 0 && (
                <p className="col-span-full text-sm text-secondary">
                  {initialQuery
                    ? `No scholarships match "${initialQuery}" — try a different keyword.`
                    : "No scholarships match these filters — try clearing some."}
                </p>
              )}

              {filtered.map((s) => {
                const urgent = isUrgent(s.application_deadline);
                return (
                  <div
                    key={s.id}
                    className={`flex flex-col rounded-lg border p-6 shadow-2xs transition ${
                      urgent
                        ? "border-red-200/80 bg-red-50/20 dark:border-red-950 dark:bg-red-950/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded border border-border bg-background px-2.5 py-0.5 text-xs text-secondary">
                          Study in {s.destination_country}
                        </span>
                        {s.is_globally_eligible && (
                          <span className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
                            Globally Open
                          </span>
                        )}
                      </div>
                      <button type="button" aria-label={`Save ${s.title}`} className="text-secondary transition hover:text-primary">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-primary">
                      {s.title}
                    </h3>

                    <div className="mt-2 flex items-start gap-1.5 text-xs text-secondary">
                      <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{s.provider}</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-secondary">Value</p>
                        <p className="text-sm font-semibold text-foreground">
                          {s.funding_amount ?? "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-secondary">Level</p>
                        <p className="text-sm text-foreground">
                          {s.study_levels.join(", ") || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-secondary">Open to</p>
                        <p className="text-sm text-foreground">
                          {s.is_globally_eligible
                            ? "All nationalities"
                            : s.eligible_countries.join(", ") || "See details"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-6">
                      <div className="flex items-center gap-1.5 text-xs">
                        {urgent ? (
                          <>
                            <Clock className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              {formatDeadline(s.application_deadline)}
                            </span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-3.5 w-3.5 text-secondary" />
                            <span className="text-secondary">{formatDeadline(s.application_deadline)}</span>
                          </>
                        )}
                      </div>

                      <Link
                        href={`/scholarships/${s.slug}`}
                        className={buttonVariants({
                          size: "sm",
                          className: "bg-primary text-background font-semibold hover:opacity-90",
                        })}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}