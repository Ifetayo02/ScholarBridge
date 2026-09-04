// src/app/(auth)/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Import the server client

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/"; // Redirect destination after successful login

  // If a code is present in the URL, we must exchange it for a session
  if (code) {
    const supabase = await createClient(); // Initialize the SERVER client
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // If successful, redirect the user to their destination
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code is missing or exchange fails, redirect to login with an error message
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}