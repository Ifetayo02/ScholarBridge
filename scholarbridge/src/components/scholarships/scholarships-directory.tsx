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
import type { Scholarship } from "@/types/scholarship";

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
}: {
  initialScholarships: Scholarship[];
}) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("soonest");

  // Derive filter option lists from actual data rather than hardcoding them
  const destinationOptions = useMemo(
    () => Array.from(new Set(initialScholarships.flatMap((s) => s.countries))).sort(),
    [initialScholarships]
  );
  const levelOptions = useMemo(
    () => Array.from(new Set(initialScholarships.flatMap((s) => s.study_levels))).sort(),
    [initialScholarships]
  );
  const fundingScopeOptions = useMemo(
    () => Array.from(new Set(initialScholarships.map((s) => s.funding_type).filter(Boolean))).sort() as string[],
    [initialScholarships]
  );

  function toggleFilter(
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) {
    setList(list.includes(val) ? list.filter((item) => item !== val) : [...list, val]);
  }

  function clearAllFilters() {
    setSelectedLevels([]);
    setSelectedFunding([]);
    setSelectedDestinations([]);
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
        selectedDestinations.some((d) => s.countries.includes(d));
      return matchesLevel && matchesFunding && matchesDestination;
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
      result = [...result].reverse(); // relies on query already ordering by deadline; swap for created_at if you add it to the select
    }

    return result;
  }, [initialScholarships, selectedLevels, selectedFunding, selectedDestinations, sortBy]);

  const activeTags = [
    ...selectedLevels.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedLevels, setSelectedLevels, tag),
    })),
    ...selectedFunding.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedFunding, setSelectedFunding, tag),
    })),
    ...selectedDestinations.map((tag) => ({
      tag,
      remove: () => toggleFilter(selectedDestinations, setSelectedDestinations, tag),
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
            <div className="relative hidden w-72 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search scholarships..."
                className="h-9 w-full rounded-md border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-secondary focus-visible:ring-primary"
              />
            </div>
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
                  {destinationOptions.length === 0 && (
                    <p className="text-xs text-secondary">No data yet</p>
                  )}
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
                      <span>{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                {filtered.length} Scholarship{filtered.length === 1 ? "" : "s"} Available
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
                  No scholarships match these filters — try clearing some.
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
                      <span className="rounded border border-border bg-background px-2.5 py-0.5 text-xs text-secondary">
                        {s.countries[0] ?? "Multiple regions"}
                      </span>
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