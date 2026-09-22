"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/scholarships/new", label: "Add Scholarship", icon: PlusCircle },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-border bg-card p-6">
        <div className="space-y-8">
          <div>
            <Link href="/admin" className="font-serif text-xl font-bold tracking-tight text-primary">
              ScholarBridge Admin
            </Link>
            <p className="mt-1 text-xs text-secondary">Portal Management</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                    active
                      ? "bg-primary text-background shadow-xs"
                      : "text-secondary hover:bg-secondary/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-secondary transition hover:bg-secondary/10 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}