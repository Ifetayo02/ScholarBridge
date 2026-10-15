import Link from "next/link";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";

type ActiveTab = "discover" | "saved" | "directory" | "none";

const tabs: { key: Exclude<ActiveTab, "none">; href: string; label: string }[] = [
  { key: "discover", href: "/", label: "Discover" },
  { key: "saved", href: "/saved", label: "Saved" },
  { key: "directory", href: "/scholarships", label: "Directory" },
];

export function SiteHeader({ active = "none" }: { active?: ActiveTab }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
          ScholarBridge
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={
                active === tab.key
                  ? "border-b-2 border-primary pb-1 font-semibold text-primary"
                  : "text-secondary transition hover:text-foreground"
              }
            >
              {tab.label}
            </Link>
          ))}
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
  );
}