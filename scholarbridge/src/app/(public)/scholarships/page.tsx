"use client";

import { useState } from "react";
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

interface ScholarshipItem {
  id: string;
  slug: string;
  country: string;
  title: string;
  provider: string;
  value: string;
  level: string;
  deadlineText: string;
  isUrgent?: boolean;
}

const mockScholarships: ScholarshipItem[] = [
  {
    id: "1",
    slug: "chevening-scholarship",
    country: "United Kingdom",
    title: "Chevening Scholarship",
    provider: "UK Foreign, Commonwealth and Development Office",
    value: "Fully Funded",
    level: "Masters",
    deadlineText: "Ends in 3 days",
    isUrgent: true,
  },
  {
    id: "2",
    slug: "fulbright-foreign-student-program",
    country: "United States",
    title: "Fulbright Foreign Student Program",
    provider: "U.S. Department of State",
    value: "Fully Funded",
    level: "Masters, PhD",
    deadlineText: "Oct 15, 2026",
    isUrgent: false,
  },
  {
    id: "3",
    slug: "australia-awards-scholarships",
    country: "Australia",
    title: "Australia Awards Scholarships",
    provider: "Department of Foreign Affairs",
    value: "Full Tuition + Stipend",
    level: "Undergrad, Masters",
    deadlineText: "April 30, 2027",
    isUrgent: false,
  },
];

const destinationOptions = ["United Kingdom", "United States", "Canada"];
const levelOptions = ["Undergraduate", "Masters", "PhD"];
const fundingScopeOptions = ["Fully Funded", "Partial Funding"];

export default function ScholarshipsDirectoryPage() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["Masters"]);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([
    "Fully Funded",
  ]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("soonest");

  function toggleFilter(
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) {
    if (list.includes(val)) {
      setList(list.filter((item) => item !== val));
    } else {
      setList([...list, val]);
    }
  }

  function clearAllFilters() {
    setSelectedLevels([]);
    setSelectedFunding([]);
    setSelectedDestinations([]);
  }

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
      remove: () =>
        toggleFilter(selectedDestinations, setSelectedDestinations, tag),
    })),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navbar with embedded search bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-primary"
            >
              ScholarBridge
            </Link>
            <div className="relative hidden w-72 md:block">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search scholarships..."
                className="h-9 w-full rounded-md border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-secondary focus-visible:ring-primary"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-secondary transition hover:text-foreground"
            >
              Discover
            </Link>
            <Link
              href="/saved"
              className="text-secondary transition hover:text-foreground"
            >
              Saved
            </Link>
            <Link
              href="/scholarships"
              className="border-b-2 border-primary pb-1 font-semibold text-primary"
            >
              Directory
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              aria-label="Notifications"
              className="text-secondary transition hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
            </button>
            <Link
              href="/login"
              aria-label="Account"
              className="text-secondary transition hover:text-foreground"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar: Filters */}
          <aside className="lg:col-span-1">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-serif text-lg font-semibold text-primary">
                Filters
              </h2>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-secondary underline-offset-2 hover:text-primary hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6 pt-6 text-sm">
              {/* Filter Group: Study Destination */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Study Destination
                </p>
                <div className="mt-3 space-y-2.5">
                  {destinationOptions.map((country) => (
                    <label
                      key={country}
                      className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(country)}
                        onChange={() =>
                          toggleFilter(
                            selectedDestinations,
                            setSelectedDestinations,
                            country
                          )
                        }
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Level of Study */}
              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Level of Study
                </p>
                <div className="mt-3 space-y-2.5">
                  {levelOptions.map((level) => (
                    <label
                      key={level}
                      className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level)}
                        onChange={() =>
                          toggleFilter(selectedLevels, setSelectedLevels, level)
                        }
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Group: Funding Scope */}
              <div className="border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Funding Scope
                </p>
                <div className="mt-3 space-y-2.5">
                  {fundingScopeOptions.map((scope) => (
                    <label
                      key={scope}
                      className="flex cursor-pointer items-center gap-2.5 text-stone-700 dark:text-stone-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFunding.includes(scope)}
                        onChange={() =>
                          toggleFilter(
                            selectedFunding,
                            setSelectedFunding,
                            scope
                          )
                        }
                        className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                      />
                      <span>{scope}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Area: Results Grid & Controls */}
          <section className="lg:col-span-3">
            {/* Header: Count & Sort Dropdown */}
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
                124 Scholarships Available
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
                    <option value="value">Highest Funding</option>
                    <option value="newest">Newly Added</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
                </div>
              </div>
            </div>

            {/* Active Tag Chips */}
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

            {/* Scholarship Cards Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {mockScholarships.map((s) => (
                <div
                  key={s.id}
                  className={`flex flex-col rounded-lg border p-6 shadow-2xs transition ${
                    s.isUrgent
                      ? "border-red-200/80 bg-red-50/20 dark:border-red-950 dark:bg-red-950/10"
                      : "border-border bg-card"
                  }`}
                >
                  {/* Top Bar: Country Tag & Bookmark */}
                  <div className="flex items-start justify-between">
                    <span className="rounded border border-border bg-background px-2.5 py-0.5 text-xs text-secondary">
                      {s.country}
                    </span>
                    <button
                      type="button"
                      aria-label={`Save ${s.title}`}
                      className="text-secondary transition hover:text-primary"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card Main Info */}
                  <h3 className="mt-3 font-serif text-xl font-semibold leading-snug text-primary">
                    {s.title}
                  </h3>

                  <div className="mt-2 flex items-start gap-1.5 text-xs text-secondary">
                    <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{s.provider}</span>
                  </div>

                  {/* Metadata Fields */}
                  <div className="mt-6 space-y-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-secondary">
                        Value
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {s.value}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-secondary">
                        Level
                      </p>
                      <p className="text-sm text-foreground">{s.level}</p>
                    </div>
                  </div>

                  {/* Card Bottom: Deadline Badge + View Details Button */}
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-6">
                    <div className="flex items-center gap-1.5 text-xs">
                      {s.isUrgent ? (
                        <>
                          <Clock className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            {s.deadlineText}
                          </span>
                        </>
                      ) : (
                        <>
                          <Calendar className="h-3.5 w-3.5 text-secondary" />
                          <span className="text-secondary">
                            {s.deadlineText}
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      href={`/scholarships/${s.slug}`}
                      className={buttonVariants({
                        size: "sm",
                        className:
                          "bg-primary text-background font-semibold hover:opacity-90",
                      })}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}