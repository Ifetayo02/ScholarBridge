"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, GraduationCap, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  emailPasswordSchema,
  magicLinkSchema,
  type EmailPasswordValues,
  type MagicLinkValues,
} from "@/lib/validations/auth";

type Mode = "sign-in" | "sign-up" | "magic-link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? "/saved";
  const authError = searchParams.get("error");

  const [mode, setMode] = useState<Mode>("sign-in");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const passwordForm = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicForm = useForm<MagicLinkValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function handlePasswordSubmit(values: EmailPasswordValues) {
    setError(null);
    setIsSubmitting(true);
    const supabase = createClient();

    if (mode === "sign-up") {
      const { data, error: authErr } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback?next=${redirectTo}`,
        },
      });

      setIsSubmitting(false);

      if (authErr) {
        setError(authErr.message);
        return;
      }

      if (!data.session) {
        setMagicLinkSent(true);
        return;
      }

      router.push(redirectTo);
      router.refresh();
      return;
    }

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    setIsSubmitting(false);

    if (authErr) {
      setError(authErr.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleMagicLinkSubmit(values: MagicLinkValues) {
    setError(null);
    setIsSubmitting(true);
    const supabase = createClient();

    const { error: authErr } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback?next=${redirectTo}`,
      },
    });

    setIsSubmitting(false);

    if (authErr) {
      setError(authErr.message);
      return;
    }

    setMagicLinkSent(true);
  }

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center bg-background">
      <section className="auth-promo hidden">
        <Link href="/" className="auth-logo">
          <span className="auth-logo-mark">
            <GraduationCap aria-hidden="true" size={20} />
          </span>
          ScholarBridge
        </Link>

        <div className="auth-promo-copy">
          <span className="auth-eyebrow">
            <Sparkles aria-hidden="true" size={14} />
            YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>
            Make room for <span>what&apos;s next.</span>
          </h1>
          <p>
            Find scholarships that fit your ambitions, keep every deadline in
            view, and spend more energy on the future you&apos;re building.
          </p>
          <Link href="/scholarships" className="auth-promo-link">
            Explore scholarships <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="auth-promo-footer">
          <GraduationCap aria-hidden="true" size={19} />
          <span>A little support can take you a long way.</span>
        </div>
      </section>

      <section className="auth-content">
        <div className="auth-card w-full max-w-sm">
          <Link href="/" className="auth-logo auth-mobile-logo hidden">
            <span className="auth-logo-mark">
              <GraduationCap aria-hidden="true" size={20} />
            </span>
            ScholarBridge
          </Link>

        <h1 className="auth-heading mt-8 font-serif text-2xl font-semibold text-foreground">
          {mode === "sign-up" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-description mt-1 text-sm text-secondary">
          {mode === "sign-up"
            ? "Save scholarships and track deadlines."
            : "Sign in to access your saved scholarships."}
        </p>

        {authError === "auth_failed" && !magicLinkSent && (
          <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
            That sign-in link didn&apos;t work or has expired — please try again.
          </p>
        )}

        {magicLinkSent ? (
          <div className="mt-8 rounded-md border border-border bg-card p-4 text-sm text-foreground">
            Check your email — we sent you a link to{" "}
            {mode === "sign-up" ? "confirm your account" : "sign in"}.
          </div>
        ) : (
          <>
            {mode !== "magic-link" ? (
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="auth-form mt-8 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Email
                  </label>
                  <Input
                    type="email"
                    {...passwordForm.register("email")}
                    className="mt-1.5"
                    autoComplete="email"
                  />
                  {passwordForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Password
                  </label>
                  <Input
                    type="password"
                    {...passwordForm.register("password")}
                    className="mt-1.5"
                    autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  />
                  {passwordForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-submit w-full bg-primary text-white font-semibold"
                >
                  {isSubmitting
                    ? "Please wait..."
                    : mode === "sign-up"
                    ? "Create account"
                    : "Sign in"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={magicForm.handleSubmit(handleMagicLinkSubmit)}
                className="auth-form mt-8 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Email
                  </label>
                  <Input
                    type="email"
                    {...magicForm.register("email")}
                    className="mt-1.5"
                    autoComplete="email"
                  />
                  {magicForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {magicForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-submit w-full bg-primary text-white font-semibold"
                >
                  {isSubmitting ? "Sending..." : "Send magic link"}
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-2 text-center text-xs">
              {mode !== "magic-link" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("magic-link");
                    setError(null);
                  }}
                  className="text-secondary hover:text-primary hover:underline"
                >
                  Sign in with a magic link instead
                </button>
              )}
              {mode === "magic-link" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("sign-in");
                    setError(null);
                  }}
                  className="block w-full text-secondary hover:text-primary hover:underline"
                >
                  Use a password instead
                </button>
              )}

              <div className="pt-2 text-secondary">
                {mode === "sign-up" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("sign-in");
                        setError(null);
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("sign-up");
                        setError(null);
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      Create one
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}