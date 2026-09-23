"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toggleSaveScholarship } from "@/app/actions/saved";

export function SaveButton({
  scholarshipId,
  initialSaved,
  isLoggedIn,
  label,
}: {
  scholarshipId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setSaved((prev) => !prev); // optimistic
    startTransition(async () => {
      const result = await toggleSaveScholarship(scholarshipId);
      if (!result.success) {
        setSaved((prev) => !prev); // revert on failure
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={label}
      aria-pressed={saved}
      className="text-secondary transition hover:text-primary disabled:opacity-50"
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
    </button>
  );
}