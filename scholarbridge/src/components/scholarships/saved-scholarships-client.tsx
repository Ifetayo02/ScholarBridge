"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Bookmark,
  Calendar,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { toggleSaveScholarship } from "@/app/actions/saved";
import type { Scholarship } from "@/types/scholarship";

function isUrgent(deadline: string | null) {
  if (!deadline) return false;
  const daysLeft = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
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

export function SavedScholarshipsClient({
  initialScholarships,
}: {
  initialScholarships: Scholarship[];
}) {
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRemove(id: string) {
    setScholarships((prev) => prev.filter((item) => item.id !== id)); // optimistic
    startTransition(async () => {
      const result = await toggleSaveScholarship(id);
      if (!result.success) {
        // revert if the server call actually failed
        setScholarships(initialScholarships);
      }
    });
  }

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fields_of_study.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            Manage your bookmarked opportunities, sorted by upcoming deadlines.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {filteredScholarships.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <Bookmark className="h-8 w-8 text-secondary" />
              <h2 className="mt-3 font-serif text-lg font-semibold text-primary">
                No saved scholarships found
              </h2>
              <p className="mt-1 text-xs text-secondary">
                {searchQuery
                  ? "No scholarships match your search query."
                  : "Explore the directory to discover and bookmark opportunities."}
              </p>
              <Link
                href="/scholarships"
                className={buttonVariants({
                  size: "sm",
                  className: "mt-4 bg-primary text-background hover:opacity-90",
                })}
              >
                Browse Scholarships
              </Link>
            </div>
          ) : (
            filteredScholarships.map((s) => {
              const urgent = isUrgent(s.application_deadline);
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

                  <div className="flex shrink-0 flex-col items-end gap-3 self-stretch justify-between sm:self-center">
                    
                      href={s.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        className: "w-full sm:w-32 bg-primary text-background font-semibold hover:opacity-90",
                      })}
                    >
                      Apply Now
                    </a>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemove(s.id)}
                      className="inline-flex items-center gap-1 text-xs text-secondary transition hover:text-red-600 disabled:opacity-50 dark:hover:text-red-400"
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