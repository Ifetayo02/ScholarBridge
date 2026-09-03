"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // 1. Google OAuth Flow
  async function handleGoogleSignIn() {
    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  // 2. Email & Password Flow
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Check your email for a confirmation link to complete registration.");
      }
      setLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#F9FAF7] px-6 py-12 text-stone-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-emerald-950">
          ScholarBridge
        </Link>
        <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-emerald-950">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          {mode === "signin"
            ? "Track and manage your scholarship applications."
            : "Start bookmarking and securing funding today."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
          {/* Mode Switcher Tabs */}
          <div className="mb-6 flex rounded-lg border border-stone-200 bg-stone-50/70 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`w-1/2 rounded-md py-1.5 transition ${
                mode === "signin"
                  ? "bg-white text-emerald-950 shadow-xs font-semibold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`w-1/2 rounded-md py-1.5 transition ${
                mode === "signup"
                  ? "bg-white text-emerald-950 shadow-xs font-semibold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              {successMessage}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400">Or continue with</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="mt-1.5 border-stone-300"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="mt-1.5 border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Password
              </label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 border-stone-300"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 text-white hover:bg-emerald-950"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}