import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/services/profile";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfileForm } from "@/components/profile/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const profile = await getMyProfile();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-6 py-10">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-primary">Your profile</h1>
        <p className="mt-2 text-sm text-secondary">
          Everything here is optional. We use it only to rank scholarships for you, and it is
          never shown publicly.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <ProfileForm initial={profile} email={user.email ?? ""} />
        </div>
      </main>
    </div>
  );
}