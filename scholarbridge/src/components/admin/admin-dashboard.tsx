"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AlertTriangle, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import type { AdminScholarshipRow } from "@/services/admin-scholarships";
import { archiveScholarship, restoreScholarship } from "@/app/(admin)/admin/actions";

type StatusTab = "all" | "draft" | "published" | "archived";

function formatDate(d: string | null) {
  if (!d) return "Not set";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function daysUntil(d: string | null) {
  if (!d) return null;
  const days = Math.ceil(
    (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days < 0) return "Passed";
  if (days === 0) return "Today";
  return `In ${days} day${days === 1 ? "" : "s"}`;
}

export function AdminDashboard({
  scholarships,
}: {
  scholarships: AdminScholarshipRow[];
}) {
  const [tab, setTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline-soonest");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const pageSize = 10;

  const counts = useMemo(
    () => ({
      all: scholarships.length,
      draft: scholarships.filter((s) => s.status === "draft").length,
      published: scholarships.filter((s) => s.status === "published").length,
      archived: scholarships.filter((s) => s.status === "archived").length,
    }),
    [scholarships]
  );

  const pendingCount = useMemo(
    () => scholarships.filter((s) => s.verification_status !== "verified").length,
    [scholarships]
  );

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(scholarships.map((s) => s.destination_country))).sort(),
    [scholarships]
  );

  const filtered = useMemo(() => {
    let result = scholarships;

    if (tab !== "all") result = result.filter((s) => s.status === tab);

    if (verificationFilter !== "all") {
      result = result.filter((s) => s.verification_status === verificationFilter);
    }

    if (countryFilter !== "all") {
      result = result.filter((s) => s.destination_country === countryFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.destination_country.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "deadline-soonest") {
        if (!a.application_deadline) return 1;
        if (!b.application_deadline) return -1;
        return (
          new Date(a.application_deadline).getTime() -
          new Date(b.application_deadline).getTime()
        );
      }
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [scholarships, tab, verificationFilter, countryFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleTabChange(t: StatusTab) {
    setTab(t);
    setPage(1);
  }

  function handleArchive(id: string) {
    startTransition(() => archiveScholarship(id));
  }

  function handleRestore(id: string) {
    startTransition(() => restoreScholarship(id));
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="font-serif text-xl font-bold tracking-tight text-primary">
            ScholarBridge Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="border-b-2 border-primary pb-1 font-semibold text-primary">
              Directory
            </Link>
          </nav>
          <Link
            href="/admin/scholarships/new"
            className={buttonVariants({
              className: "bg-primary text-background hover:opacity-90 font-semibold",
            })}
          >
            + Add Scholarship
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-wider text-secondary">
          Administration / Scholarship Directory
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-primary">
          Scholarship Index
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-secondary">
          Curate, verify, and publish scholarship opportunities.
        </p>

        {pendingCount > 0 && (
          <div className="mt-8 flex items-start gap-3 border-l-2 border-red-600 bg-red-50/50 px-4 py-3 dark:bg-red-950/20">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Action Required: {pendingCount} scholarship{pendingCount === 1 ? "" : "s"} pending
                verification before publication.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTab("all");
                setVerificationFilter("pending");
              }}
              className="whitespace-nowrap text-xs font-medium text-primary underline underline-offset-2"
            >
              Review Queue →
            </button>
          </div>
        )}

        <div className="mt-8 flex items-center gap-6 border-b border-border text-sm font-medium">
          {(["all", "draft", "published", "archived"] as StatusTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={`flex items-center gap-1.5 border-b-2 pb-3 ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              <span className="capitalize">{t}</span>
              <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-xs">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <Input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, provider, or destination..."
              className="h-10 pl-9 text-sm"
            />
          </div>

          <div className="relative">
            <select
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 cursor-pointer appearance-none rounded-md border border-border bg-background px-3 pr-8 text-xs font-medium text-foreground"
            >
              <option value="all">Verification: All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
          </div>

          <div className="relative">
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 cursor-pointer appearance-none rounded-md border border-border bg-background px-3 pr-8 text-xs font-medium text-foreground"
            >
              <option value="all">Country: All</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-md border border-border bg-background px-3 pr-8 text-xs font-medium text-foreground"
            >
              <option value="deadline-soonest">Sort: Deadline Soonest</option>
              <option value="newest">Sort: Newest Added</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary" />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left text-xs uppercase tracking-wider text-secondary">
                <th className="px-4 py-3 font-medium">Title & Provider</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Verification</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-secondary">
                    No scholarships match these filters.
                  </td>
                </tr>
              )}
              {pageItems.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-serif font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-secondary">{s.provider}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{s.destination_country}</td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{formatDate(s.application_deadline)}</p>
                    <p className="text-xs text-secondary">{daysUntil(s.application_deadline)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-medium ${
                        s.verification_status === "verified"
                          ? "border-border bg-background text-foreground"
                          : s.verification_status === "rejected"
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-red-300 bg-red-50 text-red-700"
                      }`}
                    >
                      {s.verification_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium uppercase text-secondary">{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <Link
                        href={`/admin/scholarships/${s.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      {s.status === "archived" ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleRestore(s.id)}
                          className="text-primary hover:underline disabled:opacity-50"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleArchive(s.id)}
                          className="text-secondary hover:text-primary hover:underline disabled:opacity-50"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-secondary">
          <p>
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} scholarships
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}