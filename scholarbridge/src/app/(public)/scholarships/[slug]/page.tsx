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
  Check,
  FileText,
  Languages,
  Share2,
  ExternalLink,
  Mail,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ScholarshipDetailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-primary"
            >
              ScholarBridge
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
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
                className="font-semibold text-primary"
              >
                Directory
              </Link>
            </nav>

            <div className="relative hidden w-64 lg:block">
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

            <div className="flex items-center gap-3 border-l border-border pl-4">
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Back Link */}
        <Link
          href="/scholarships"
          className="inline-flex items-center gap-2 text-xs font-medium text-secondary transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Discover</span>
        </Link>

        {/* 2-Column Layout */}
        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Details (Left 8 Cols) */}
          <div className="lg:col-span-8">
            {/* Header / Hero Card */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-secondary">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                    Chevening Scholarships 2026
                  </h1>
                  <p className="mt-1 text-sm text-secondary">
                    Foreign, Commonwealth & Development Office (FCDO)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start">
                <Button className="bg-primary text-background hover:opacity-90 font-semibold px-6">
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

            {/* Tag Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="border border-border bg-card text-foreground font-normal"
              >
                Masters Degree
              </Badge>
              <Badge
                variant="secondary"
                className="border border-border bg-card text-foreground font-normal"
              >
                International Students
              </Badge>
              <Badge
                variant="secondary"
                className="border border-border bg-card text-foreground font-normal"
              >
                Fully Funded
              </Badge>
            </div>

            {/* Four-column Key Metrics Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6 sm:grid-cols-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Wallet className="h-3.5 w-3.5" />
                  <span>Funding</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  Fully Funded
                </p>
                <p className="text-xs text-secondary">Tuition + Stipend</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Level</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  Masters
                </p>
                <p className="text-xs text-secondary">1 Year Duration</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Destination</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  United Kingdom
                </p>
                <p className="text-xs text-secondary">Multiple Univ.</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Deadline</span>
                </div>
                <p className="mt-1 font-serif text-base font-bold text-foreground">
                  Nov 07, 2026
                </p>
                <p className="text-xs text-secondary">12:00 GMT</p>
              </div>
            </div>

            {/* Overview Section */}
            <section className="mt-10">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
                <FileText className="h-5 w-5 text-secondary" />
                Overview
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-secondary">
                <p>
                  Chevening is the UK government’s international awards programme
                  aimed at developing global leaders. Funded by the Foreign,
                  Commonwealth and Development Office (FCDO) and partner
                  organisations, Chevening offers a unique opportunity for future
                  leaders, influencers, and decision-makers from all over the world
                  to develop professionally and academically, network extensively,
                  experience UK culture, and build lasting positive relationships
                  with the UK.
                </p>
                <p>
                  A Chevening Scholarship offers financial support along with the
                  opportunity to become part of the highly regarded and influential
                  Chevening global network.
                </p>
              </div>
            </section>

            {/* Eligibility Criteria */}
            <section className="mt-10">
              <h2 className="font-serif text-xl font-bold text-primary">
                Eligibility Criteria
              </h2>
              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Citizenship
                    </h3>
                    <p className="mt-0.5 text-xs text-secondary">
                      Be a citizen of a Chevening-eligible country or territory.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Post-study Commitment
                    </h3>
                    <p className="mt-0.5 text-xs text-secondary">
                      Return to your country of citizenship for a minimum of two
                      years after your award has ended.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Academic Background
                    </h3>
                    <p className="mt-0.5 text-xs text-secondary">
                      Have completed all components of an undergraduate degree that
                      will enable you to gain entry onto a postgraduate programme at
                      a UK university.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Work Experience
                    </h3>
                    <p className="mt-0.5 text-xs text-secondary">
                      Have at least two years (equivalent to 2,800 hours) of work
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Required Documents Grid */}
            <section className="mt-10">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
                <FileText className="h-5 w-5 text-secondary" />
                Required Documents
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <FileText className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Academic Transcripts
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <User className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Two Reference Letters
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Languages className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    English Language Test
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Globe className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Valid Passport
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar: About Provider & Share (Right 4 Cols) */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-serif text-base font-bold text-primary">
                About the Provider
              </h3>

              <div className="mt-4 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-secondary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    FCDO UK
                  </h4>
                  <p className="text-xs text-secondary">Government Agency</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-secondary">
                The Foreign, Commonwealth & Development Office (FCDO) is a
                department of the Government of the United Kingdom. It promotes
                the interests of British citizens, safeguards the UK’s security,
                defends its values, reduces poverty and tackles global challenges
                with international partners.
              </p>

              <div className="mt-6 space-y-3 border-t border-border pt-4 text-xs font-medium">
                <a
                  href="https://www.chevening.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground transition hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-secondary" />
                  <span>Visit Official Website</span>
                </a>
                <a
                  href="mailto:contact@chevening.org"
                  className="flex items-center gap-2 text-foreground transition hover:text-primary"
                >
                  <Mail className="h-3.5 w-3.5 text-secondary" />
                  <span>Contact Provider</span>
                </a>
              </div>

              {/* Share Box */}
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs font-medium text-secondary">
                  Share this opportunity
                </p>
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

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-primary">ScholarBridge</p>
            <p className="mt-1 text-xs text-secondary">
              © 2026 ScholarBridge. Empowering academic ambition.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-secondary">
            <Link href="/about" className="hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact Support
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}