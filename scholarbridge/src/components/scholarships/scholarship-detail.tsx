"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Bell,
  User,
  Bookmark,
  Building2,
  Calendar,
  GraduationCap,
  Globe,
  Wallet,
  FileText,
  Share2,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { Scholarship } from "@/types/scholarship";
import { FUNDING_TYPE_LABELS } from "@/types/scholarship";

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Not specified";
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ScholarshipDetail({ scholarship: s }: { scholarship: Scholarship }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
              ScholarBridge
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/" className="text-secondary transition hover:text-foreground">Discover</Link>
              <Link href="/saved" className="text-secondary transition hover:text-foreground">Saved</Link>
              <Link href="/scholarships" className="font-semibold text-primary">Directory</Link>
            </nav>

            <div className="relative hidden w-64 lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search scholarships..."
                className="h-9 w-full rounded-md border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-secondary focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center gap-3 border-l border-border pl-4">
              <ThemeToggle />
              <button aria-label="Notifications" className="text-secondary transition hover:text-foreground">
                <Bell className="h-5 w-5" />
              </button>
              <Link href="/login" aria-label="Account" className="text-secondary transition hover:text-foreground">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/scholarships"
          className="inline-flex items-center gap-2 text-xs font-medium text-secondary transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Directory</span>
        </Link>

        {s.verification_status !== "verified" && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              This listing hasn&apos;t been fully verified yet — double-check the deadline and details on the official site before applying.
            </span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-secondary">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    {s.title}
                  </h1>
                  <p className="mt-1 text-sm text-secondary">{s.provider}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start">
                <Button
                  className="bg-primary text-background hover:opacity-90 font-semibold px-6"
                  render={<a href={s.application_url} target="_blank" rel="noopener noreferrer" />}
                >
                  Apply Now
                </Button>
                <button
                  type="button"
                  aria-label="Save scholarship"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-secondary transition hover:text-primary"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {s.study_levels.map((level) => (
                <Badge key={level} variant="secondary" className="border border-border bg-card text-foreground font-normal">
                  {level}
                </Badge>
              ))}
              {s.funding_type && (
                <Badge variant="secondary" className="border border-border bg-card text-foreground font-normal">
                  {FUNDING_TYPE_LABELS[s.funding_type]}
                </Badge>
              )}
              <Badge variant="secondary" className="border border-border bg-card text-foreground font-normal">
                {s.is_globally_eligible ? "Open to all nationalities" : "Restricted eligibility"}
              </Badge>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 sm:grid-cols-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Wallet className="h-3.5 w-3.5" />
                  <span>Funding</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  {s.funding_amount ?? "Not specified"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Level</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  {s.study_levels.join(", ") || "Not specified"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Destination</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  {s.destination_country}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Deadline</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  {formatDeadline(s.application_deadline)}
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
                <FileText className="h-5 w-5 text-secondary" />
                Overview
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-secondary">
                <p>{s.description ?? "No description available yet."}</p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-serif text-xl font-bold text-primary">Who Can Apply</h2>
              <div className="mt-4 text-sm leading-relaxed text-secondary">
                {s.is_globally_eligible ? (
                  <p>This scholarship is open to applicants of any nationality.</p>
                ) : s.eligible_countries.length > 0 ? (
                  <>
                    <p className="mb-2">Open to citizens of:</p>
                    <div className="flex flex-wrap gap-2">
                      {s.eligible_countries.map((c) => (
                        <Badge key={c} variant="secondary" className="border border-border bg-card text-foreground font-normal">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Eligibility details not yet listed — check the official application page.</p>
                )}
              </div>
            </section>

            {s.fields_of_study.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-xl font-bold text-primary">Fields of Study</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.fields_of_study.map((f) => (
                    <Badge key={f} variant="secondary" className="border border-border bg-card text-foreground font-normal">
                      {f}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-base font-bold text-primary">About the Provider</h3>

              <div className="mt-4 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-secondary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {s.source_name ?? s.provider}
                  </h4>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-border pt-4 text-xs font-medium">
                {s.source_website_url && (
                  <a
                    href={s.source_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-foreground transition hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-secondary" />
                    <span>Visit Official Website</span>
                  </a>
                )}
                <a
                  href={s.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground transition hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-secondary" />
                  <span>Application Page</span>
                </a>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs font-medium text-secondary">Share this opportunity</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Copy link"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-secondary transition hover:text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Share"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-secondary transition hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-primary">ScholarBridge</p>
            <p className="mt-1 text-xs text-secondary">© 2026 ScholarBridge. Empowering academic ambition.</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-secondary">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/contact" className="hover:text-primary">Contact Support</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}