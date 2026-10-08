"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Bookmark,
  Calendar,
  Wallet,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import {
  toggleSaveScholarship,
  updateApplicationStatus,
} from "@/app/actions/saved";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type SavedScholarship,
} from "@/types/scholarship";

type StatusFilter = "all" | ApplicationStatus;

function isPastDeadline(deadline: string | null) {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
}

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

// Upcoming deadlines first, then passed ones, then scholarships with no deadline.
function deadlineBucket(deadline: string | null) {
  if (!deadline) return 2;
  return isPastDeadline(deadline) ? 1 : 0;
}

function compareByDeadline(a: SavedScholarship, b: SavedScholarship) {
  const bucketDiff =
    deadlineBucket(a.application_deadline) -
    deadlineBucket(b.application_deadline);
  if (bucketDiff !== 0) return bucketDiff;
  if (!a.application_deadline || !b.application_deadline) return 0;
  return (
    new Date(a.application_deadline).getTime() -
    new Date(b.application_deadline).getTime()
  );
}

export function SavedScholarshipsClient({
  initialScholarships,
}: {
  initialScholarships: SavedScholarship[];
}) {
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      all: scholarships.length,
      saved: 0,
      preparing: 0,
      applied: 0,
      awarded: 0,
      not_selected: 0,
    };
    scholarships.forEach((s) => {
      base[s.application_status] += 1;
    });
    return base;
  }, [scholarships]);

  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scholarships
      .filter((s) => statusFilter === "all" || s.application_status === statusFilter)
      .filter(
        (s) =>
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.fields_of_study.some((f) => f.toLowerCase().includes(q))
      )
      .sort(compareByDeadline);
  }, [scholarships, searchQuery, statusFilter]);

  function handleStatusChange(id: string, status: ApplicationStatus) {
    const previous = scholarships;
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, application_status: status } : s))
    );
    startTransition(async () => {
      const result = await updateApplicationStatus(id, status);
      if (!result.success) {
        setScholarships(previous);
      }
    });
  }

  function handleRemove(id: string) {
    const previous = scholarships;
    setScholarships((prev) => prev.filter((s) => s.id !== id));
    startTransition(async () => {
      const result = await toggleSaveScholarship(id);
      if (!result.success) {
        setScholarships(previous);
      }
    });
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved..."
                className="h-9 w-full rounded-md border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-secondary focus-visible:ring-primary"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-secondary transition hover:text-foreground">Discover</Link>
            <Link href="/saved" className="border-b-2 border-primary pb-1 font-semibold text-primary">Saved</Link>
            <Link href="/scholarships" className="text-secondary transition hover:text-foreground">Directory</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button aria-label="Notifications" className="text-secondary transition hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
            Saved Scholarships
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Track each opportunity from saved to awarded, sorted by upcoming deadlines.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border text-sm font-medium">
          {(["all", ...APPLICATION_STATUSES] as StatusFilter[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`flex items-center gap-1.5 border-b-2 pb-3 ${
                statusFilter === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              <span>{tab === "all" ? "All" : APPLICATION_STATUS_LABELS[tab]}</span>
              <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-xs">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-5">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <Bookmark className="h-8 w-8 text-secondary" />
              <h2 className="mt-3 font-serif text-lg font-semibold text-primary">
                {scholarships.length === 0
                  ? "No saved scholarships yet"
                  : "Nothing matches this view"}
              </h2>
              <p className="mt-1 text-xs text-secondary">
                {scholarships.length === 0
                  ? "Explore the directory to discover and bookmark opportunities."
                  : "Try a different status tab or clear your search."}
              </p>
              {scholarships.length === 0 && (
                <Link
                  href="/scholarships"
                  className={buttonVariants({
                    size: "sm",
                    className: "mt-4 bg-primary text-background hover:opacity-90",
                  })}
                >
                  Browse Scholarships
                </Link>
              )}
            </div>
          ) : (
            visible.map((s) => {
              const status = s.application_status;
              const needsAction = status === "saved" || status === "preparing";
              const urgent = needsAction && isUrgent(s.application_deadline);
              const past = needsAction && isPastDeadline(s.application_deadline);

              return (
                <div
                  key={s.id}
                  className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 shadow-2xs transition sm:flex-row sm:items-center"
                >
                  <div className="max-w-2xl space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {urgent && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          Deadline approaching
                        </span>
                      )}
                      {past && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          Deadline passed
                        </span>
                      )}
                      {s.fields_of_study.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="border border-border bg-background px-2.5 py-0.5 text-xs font-normal text-secondary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <Link
                        href={`/scholarships/${s.slug}`}
                        className="font-serif text-xl font-bold tracking-tight text-primary transition hover:underline"
                      >
                        {s.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-secondary">
                        {s.provider} •{" "}
                        {s.is_globally_eligible
                          ? "Open to all nationalities"
                          : s.eligible_countries.join(", ") || "Restricted eligibility"}
                      </p>
                    </div>

                    <p className="text-xs leading-relaxed text-secondary">
                      {s.description ?? "No description available."}
                    </p>

                    <div className="flex items-center gap-6 pt-1 text-xs font-medium">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Wallet className="h-3.5 w-3.5 text-secondary" />
                        <span>{s.funding_amount ?? "Not specified"}</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          urgent ? "text-red-600 dark:text-red-400" : "text-secondary"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDeadline(s.application_deadline)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 flex-col gap-3 sm:w-44">
                    <a
                      href={s.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        className: "w-full bg-primary text-background font-semibold hover:opacity-90",
                      })}
                    >
                      Apply Now
                    </a>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-secondary">
                        Application status
                      </label>
                      <div className="relative mt-1">
                        <select
                          value={status}
                          disabled={isPending}
                          onChange={(e) =>
                            handleStatusChange(s.id, e.target.value as ApplicationStatus)
                          }
                          className="h-9 w-full cursor-pointer appearance-none rounded-md border border-border bg-background pl-3 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        >
                          {APPLICATION_STATUSES.map((opt) => (
                            <option key={opt} value={opt}>
                              {APPLICATION_STATUS_LABELS[opt]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemove(s.id)}
                      className="inline-flex items-center gap-1 self-start text-xs text-secondary transition hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
                    >
                      <Bookmark className="h-3.5 w-3.5 fill-current" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}