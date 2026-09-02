import Link from "next/link";
import { Search, Bell, User, Bookmark, FlaskConical, Palette, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const quickFilters = ["STEM", "First-Gen", "Women in Tech", "Study Abroad"];

const featuredScholarships = [
  {
    slug: "future-innovators-tech-scholarship",
    badge: "Ends in 3 days",
    badgeVariant: "urgent" as const,
    title: "Future Innovators Tech Scholarship",
    provider: "TechFoundation",
    funding: "$10,000",
  },
  {
    slug: "global-perspectives-study-abroad-grant",
    badge: "Dec 15 Deadline",
    badgeVariant: "default" as const,
    title: "Global Perspectives Study Abroad Grant",
    provider: "International Education Council",
    funding: "$5,000",
  },
  {
    slug: "first-generation-college-student-award",
    badge: "Jan 01 Deadline",
    badgeVariant: "default" as const,
    title: "First-Generation College Student Award",
    provider: "The Bridge Institute",
    funding: "Full Tuition",
  },
];

const categories = [
  { name: "STEM", icon: FlaskConical, slug: "stem" },
  { name: "Arts & Design", icon: Palette, slug: "arts-design" },
  { name: "Social Sciences", icon: Globe, slug: "social-sciences" },
  { name: "Business", icon: Briefcase, slug: "business" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-xl font-semibold">
            ScholarBridge
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/" className="border-b-2 border-foreground pb-1">
              Discover
            </Link>
            <Link href="/saved" className="text-muted-foreground hover:text-foreground">
              Saved
            </Link>
            <Link href="/scholarships" className="text-muted-foreground hover:text-foreground">
              Directory
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/login" aria-label="Account">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
          Bridge the gap to your future.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Discover scholarships tailored to your ambitions. Start searching with
          zero account required and unlock your potential.
        </p>

        <form
          action="/scholarships"
          className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-md border border-border bg-white p-1.5 shadow-sm"
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            name="q"
            placeholder="Search scholarships, majors, or keywords..."
            aria-label="Search scholarships"
            className="border-none shadow-none focus-visible:ring-0"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {quickFilters.map((filter) => (
            <Link
              key={filter}
              href={`/scholarships?tag=${encodeURIComponent(filter.toLowerCase())}`}
            >
              <Badge variant="secondary" className="cursor-pointer font-normal">
                {filter}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="mx-auto max-w-6xl border-t border-border px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl">Featured Scholarships</h2>
            <p className="mt-1 text-sm text-muted-foreground">Opportunities ending soon</p>
          </div>
          <Link href="/scholarships" className="text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredScholarships.map((s) => (
            <div
              key={s.slug}
              className="flex flex-col rounded-lg border border-border bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <Badge
                  className={
                    s.badgeVariant === "urgent"
                      ? "bg-red-50 text-red-700 hover:bg-red-50"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }
                >
                  {s.badge}
                </Badge>
                <button aria-label={`Save ${s.title}`} className="text-muted-foreground hover:text-foreground">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-serif text-lg leading-snug">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.provider}</p>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-4 mt-6">
                <div>
                  <p className="text-xs text-muted-foreground">Funding</p>
                  <p className="font-serif text-base">{s.funding}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/scholarships/${s.slug}`}>Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Category */}
      <section className="mx-auto max-w-6xl border-t border-border px-6 py-16 text-center">
        <h2 className="font-serif text-3xl">Explore by Category</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find the perfect funding for your field of study.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/scholarships?category=${c.slug}`}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-8 transition-colors hover:border-foreground"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-sm font-medium">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg">ScholarBridge</p>
            <p className="mt-1 text-xs text-muted-foreground">
              © 2024 ScholarBridge. Empowering academic ambition.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">About Us</Link>
            <Link href="/contact" className="hover:text-foreground">Contact Support</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}