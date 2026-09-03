import Link from "next/link";
import {
  Search,
  Bell,
  User,
  Bookmark,
  FlaskConical,
  Palette,
  Globe,
  Briefcase,
  Send,
  Star,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

const howItWorks = [
  {
    step: "1",
    icon: Search,
    title: "Discover",
    description:
      "Browse thousands of vetted scholarships matching your unique profile and academic goals.",
  },
  {
    step: "2",
    icon: Bookmark,
    title: "Track",
    description:
      "Save opportunities to your personal dashboard and never miss a crucial deadline again.",
  },
  {
    step: "3",
    icon: Send,
    title: "Apply",
    description:
      "Get direct links to application portals and utilize our tips to craft winning submissions.",
  },
];

// Placeholder only — replace with real student feedback once available.
const testimonials = [
  {
    initials: "MC",
    name: "Maria C.",
    role: "Engineering Major",
    quote:
      "I found a niche scholarship for first-generation engineering students that I never would have discovered otherwise. It covered my entire senior year tuition!",
  },
  {
    initials: "JD",
    name: "James D.",
    role: "Arts History Major",
    quote:
      "The tracking feature kept me sane during application season. I managed to apply for 15 scholarships and won 3 of them. Highly recommend.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-xl font-semibold text-primary">
            ScholarBridge
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/" className="border-b-2 border-primary pb-1 text-primary font-medium">
              Discover
            </Link>
            <Link href="/saved" className="text-secondary hover:text-foreground">
              Saved
            </Link>
            <Link href="/scholarships" className="text-secondary hover:text-foreground">
              Directory
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button aria-label="Notifications" className="text-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/login" aria-label="Account" className="text-secondary hover:text-foreground">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-primary sm:text-6xl">
          Bridge the gap to your future.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-secondary">
          Discover scholarships tailored to your ambitions. Start searching with
          zero account required and unlock your potential.
        </p>

        <form
          action="/scholarships"
          className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-md border border-border bg-card p-1.5 shadow-sm"
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
          <Input
            type="search"
            name="q"
            placeholder="Search scholarships, majors, or keywords..."
            aria-label="Search scholarships"
            className="border-none shadow-none text-foreground placeholder:text-secondary focus-visible:ring-0 bg-transparent"
          />
          <Button type="submit" className="bg-primary hover:opacity-90 text-background font-semibold">Search</Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {quickFilters.map((filter) => (
            <Link
              key={filter}
              href={`/scholarships?tag=${encodeURIComponent(filter.toLowerCase())}`}
            >
              <Badge variant="secondary" className="cursor-pointer font-normal border border-border bg-card text-foreground hover:border-primary hover:text-primary">
                {filter}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* How ScholarBridge Works */}
      <section className="mx-auto max-w-6xl border-t border-border px-6 py-16 text-center">
        <h2 className="font-serif text-3xl text-primary">How ScholarBridge Works</h2>
        <p className="mt-1 text-sm text-secondary">
          Three simple steps to fund your education.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {howItWorks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg text-primary">
                  {item.step}. {item.title}
                </h3>
                <p className="mt-2 text-sm text-secondary">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="mx-auto max-w-6xl border-t border-border px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl text-primary">Featured Scholarships</h2>
            <p className="mt-1 text-sm text-secondary">Opportunities ending soon</p>
          </div>
          <Link href="/scholarships" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredScholarships.map((s) => (
            <div
              key={s.slug}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <Badge
                  className={
                    s.badgeVariant === "urgent"
                      ? "border border-border bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]"
                      : "border border-border bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]"
                  }
                >
                  {s.badge}
                </Badge>
                <button aria-label={`Save ${s.title}`} className="text-secondary hover:text-foreground">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-serif text-lg leading-snug text-primary">{s.title}</h3>
              <p className="mt-1 text-sm text-secondary">{s.provider}</p>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-4 mt-6">
                <div>
                  <p className="text-xs text-secondary">Funding</p>
                  <p className="font-serif text-base font-medium text-primary">{s.funding}</p>
                </div>
                <Link
                  href={`/scholarships/${s.slug}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "border-border bg-card text-foreground hover:bg-secondary/10 hover:border-primary",
                  })}
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Category */}
      <section className="mx-auto max-w-6xl border-t border-border px-6 py-16 text-center">
        <h2 className="font-serif text-3xl text-primary">Explore by Category</h2>
        <p className="mt-1 text-sm text-secondary">
          Find the perfect funding for your field of study.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/scholarships?category=${c.slug}`}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 transition-colors hover:border-primary"
              >
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="border-t border-border bg-secondary/10">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-serif text-3xl text-primary">Student Success Stories</h2>
          <p className="mt-1 text-sm text-secondary">
            Hear from students who funded their education through ScholarBridge.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-lg border border-border bg-card p-6 text-left"
              >
                <div className="mb-3 flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-secondary">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-background">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{t.name}</p>
                    <p className="text-xs text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Never Miss a Deadline */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center rounded-lg bg-card border border-border px-6 py-14 text-center text-foreground">
          <Bell className="h-6 w-6 text-accent" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-3xl text-primary">Never Miss a Deadline</h2>
          <p className="mt-2 max-w-md text-sm text-secondary">
            Join thousands of students receiving weekly updates on the newest
            high-value scholarships.
          </p>
          <form className="mt-6 flex w-full max-w-md items-center gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="border-border bg-background text-foreground placeholder:text-secondary focus-visible:ring-primary"
            />
            <Button type="submit" className="bg-accent text-background hover:opacity-90 font-medium">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-lg text-primary">ScholarBridge</p>
            <p className="mt-1 text-xs text-secondary">
              © 2026 ScholarBridge. Empowering academic ambition.
            </p>
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