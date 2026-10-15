"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function getInitials(name: string | null, email: string | undefined) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (!email) return "?";
  const namePart = email.split("@")[0];
  const segments = namePart.split(/[._-]/).filter(Boolean);
  if (segments.length >= 2) {
    return (segments[0][0] + segments[1][0]).toUpperCase();
  }
  return namePart.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadName = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();
    setFullName(data?.full_name ?? null);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (data.user) loadName(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      const id = session?.user?.id;
      // Deferred: calling Supabase inside this callback can deadlock
      if (id) setTimeout(() => loadName(id), 0);
      else setFullName(null);
    });

    function handleProfileUpdated() {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) loadName(data.user.id);
      });
    }
    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [loadName]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-8 w-8" />;
  }

  if (!user) {
    return (
      <Link href="/login" aria-label="Account" className="text-secondary transition hover:text-foreground">
        <User className="h-5 w-5" />
      </Link>
    );
  }

  const initials = getInitials(fullName, user.email);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-background transition hover:opacity-90"
      >
        {initials}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-60 rounded-md border border-border bg-card shadow-md">
            <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-background">
                {initials}
              </div>
              <div className="min-w-0">
                {fullName && <p className="truncate text-xs font-semibold text-foreground">{fullName}</p>}
                <p className="truncate text-xs text-secondary">{user.email}</p>
              </div>
            </div>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-xs text-foreground hover:bg-secondary/10"
            >
              My profile
            </Link>
            <Link
              href="/saved"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-xs text-foreground hover:bg-secondary/10"
            >
              Saved Scholarships
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}