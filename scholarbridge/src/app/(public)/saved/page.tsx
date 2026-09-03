"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  User,
  Bookmark,
  Calendar,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SavedScholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  scope: string;
  description: string;
  funding: string;
  deadline: string;
  isUrgent?: boolean;
  tags: string[];
  applyUrl: string;
}

const initialSavedScholarships: SavedScholarship[] = [
  {
    id: "1",
    slug: "women-in-technology-fellowship",
    title: "Women in Technology Fellowship",
    provider: "Google Educational Foundation",
    scope: "Global",
    description:
      "A merit-based scholarship for undergraduate and graduate female students pursuing degrees in computer science or computer engineering.",
    funding: "$10,000",
    deadline: "Oct 15, 2026",
    isUrgent: true,
    tags: ["STEM"],
    applyUrl: "https://example.com/apply/wit",
  },
  {
    id: "2",
    slug: "national-arts-humanities-grant",
    title: "National Arts & Humanities Grant",
    provider: "US Dept. of Education",
    scope: "National",
    description:
      "Funding to support creative projects and tuition for first-generation college students pursuing degrees in the humanities and fine arts.",
    funding: "$5,000",
    deadline: "Nov 01, 2026",
    isUrgent: false,
    tags: ["First-Gen", "Arts"],
    applyUrl: "https://example.com/apply/arts",
  },
  {
    id: "3",
    slug: "future-innovators-scholarship",
    title: "Future Innovators Scholarship",
    provider: "Lockheed Martin",
    scope: "US Citizens",
    description:
      "Full tuition assistance for aspiring aerospace and mechanical engineers with demonstrable passion for innovation and robotics research.",
    funding: "$15,000",
    deadline: "Dec 15, 2026",
    isUrgent: false,
    tags: ["Engineering"],
    applyUrl: "https://example.com/apply/innovators",
  },
];

export default function SavedScholarshipsPage() {
  const [scholarships, setScholarships] = useState<SavedScholarship[]>(
    initialSavedScholarships
  );
  const [searchQuery, setSearchQuery] = useState("");

  function handleRemove(id: string) {
    setScholarships((prev) => prev.filter((item) => item.id !== id));
  }

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <div className="relative hidden w-72 md:block">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
                aria-hidden="true"
              />
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
            <Link
              href="/"
              className="text-secondary transition hover:text-foreground"
            >
              Discover
            </Link>
            <Link
              href="/saved"
              className="border-b-2 border-primary pb-1 font-semibold text-primary"
            >
              Saved
            </Link>
            <Link
              href="/scholarships"
              className="text-secondary transition hover:text-foreground"
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
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Page Header */}
        <div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
            Saved Scholarships
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Manage your bookmarked opportunities, sorted by upcoming deadlines.
          </p>
        </div>

        {/* Scholarships List */}
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
            filteredScholarships.map((s) => (
              <div
                key={s.id}
                className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 shadow-2xs transition sm:flex-row sm:items-center"
              >
                {/* Left Side: Tags, Titles, Descriptions, Meta */}
                <div className="max-w-2xl space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {s.isUrgent && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        Deadline approaching
                      </span>
                    )}
                    {s.tags.map((tag) => (
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
                      {s.provider} • {s.scope}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-secondary">
                    {s.description}
                  </p>

                  <div className="flex items-center gap-6 pt-1 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Wallet className="h-3.5 w-3.5 text-secondary" />
                      <span>{s.funding}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        s.isUrgent
                          ? "text-red-600 dark:text-red-400"
                          : "text-secondary"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{s.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Apply Button & Remove Action */}
                <div className="flex shrink-0 flex-col items-end gap-3 self-stretch justify-between sm:self-center">
                  <a
                    href={s.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      className:
                        "w-full sm:w-32 bg-primary text-background font-semibold hover:opacity-90",
                    })}
                  >
                    Apply Now
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(s.id)}
                    className="inline-flex items-center gap-1 text-xs text-secondary transition hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}