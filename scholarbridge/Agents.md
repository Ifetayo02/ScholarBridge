# ScholarBridge — Agent Instructions

## Project

ScholarBridge is a scholarship discovery platform that helps students find relevant scholarships, understand their eligibility, save opportunities, track applications and deadlines, and eventually receive personalized recommendations.

The goal is a useful, lean MVP, not an over-engineered product. The first audience is Nigerian university students, mostly undergraduates.

The core question behind every feature:

> Does this help a student find, understand, manage, or act on a relevant scholarship they can trust?

If not, question whether it belongs in the current MVP.

---

## IMPORTANT: Check the actual project state first

I am behind the original 90-day schedule. Do not assume the project is at any particular day, or that every feature mentioned anywhere has been implemented.

**The codebase is the source of truth.** The 90-day roadmap is only a guide. A dated status summary is in `docs/HANDOFF.md` (as of 14 Oct 2026). If it disagrees with the code, the code wins.

Before making changes:

1. Inspect the existing codebase, routes/pages, and reusable components.
2. Inspect the Supabase integration and database-related code.
3. Inspect authentication, student profile functionality, saved scholarships, application tracking, and deadline tracking.
4. Inspect scholarship matching and recommendations.
5. Check `git status` and recent commits for uncommitted or reverted work.
6. Look for unfinished, broken, placeholder, mocked, or partially implemented features.
7. Run `npm run build` and `npx tsc --noEmit`.

Then determine what is complete, partially complete, missing, and broken, and what should logically be built next. Do not recreate features that already exist.

**Some state is invisible from the repo.** Supabase dashboard settings (Confirm email, SMTP, redirect URLs), applied SQL, and Vercel environment variables cannot be read from code. Ask me to confirm them. Do not assume them.

---

## Tech stack

- Next.js (App Router), TypeScript, Tailwind CSS **v4**
- shadcn/ui built on **Base UI**
- Supabase (PostgreSQL, Auth, Row Level Security)
- React Hook Form + Zod
- Vercel (deploys from GitHub)

Use the technologies already in the project. Do not replace them.

### Stack specifics that break things if ignored

- **Tailwind v4:** theme tokens live in `src/app/globals.css` (`@theme`, `:root`, `.dark`). There is no `tailwind.config.ts` to edit.
- **Base UI, not Radix:** there is no `asChild`. A `Button` rendered as a link uses `render={<Link href=... />}` and `nativeButton={false}`.
- **Next.js App Router:** `params` and `searchParams` are Promises, and `cookies()` is awaited. A page that calls `useSearchParams()` must wrap that component in `<Suspense>`. `middleware.ts` is deprecated in favor of `proxy.ts`; migrate only once deployment is stable.
- **Strict typing:** Vercel's build rejects type errors that `npm run dev` ignores. Give server action results explicit types, annotate mapped objects with the shared types, and make `startTransition` callbacks return `void`.

---

## Environment

- Windows, Command Prompt (cmd.exe) and VS Code. Use cmd-compatible commands and quote paths containing parentheses or brackets, e.g. `"src\app\(public)\page.tsx"`.
- Never run destructive commands (`git reset --hard`, `git clean`, `rmdir /s`, bulk deletes) without asking.
- Secrets live in `.env.local` (gitignored) and Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (the publishable key), and `SUPABASE_SECRET_KEY` (server-only). Never print them, commit them, or expose them to client code.

---

## Core product flow

Discover → Search/filter → View details → Check eligibility → Save → Track application → Track deadline → Receive relevant recommendations

Discovery works without an account. An account is required only to save, track, and view `/saved`.

---

## Product priorities (in roughly this order)

1. **Trusted, accurate scholarship data:** official sources, verification, and coverage for undergraduate and Nigeria-open scholarships
2. Reliable discovery: search and filtering
3. Scholarship details, including eligibility requirements and required documents
4. Authentication
5. Saved scholarships and application tracking (status and deadlines)
6. Prioritizing saved scholarships by application status plus upcoming deadline
7. Student profile and preferences, then relevance matching
8. Deadline and "applications open" reminders by email
9. Admin and data management
10. Testing and real-user feedback
11. Performance, accessibility, SEO, and launch polish

Do not build advanced AI features before the core product is reliable.

### Why trust comes first

A survey of 21 students (own network, so directional only) found:

- 13 of 21 had met a fake or outdated listing.
- The top struggles were finding the real application link and finding scholarships relevant to their field.
- 13 of 21 spend under an hour a month searching, and 7 don't actively search at all. The product wins on trust and fit, not speed.
- 20 of 21 said they want deadline reminders. Treat that as weak evidence; it comes after trust, data, and matching.

---

## Architecture conventions

- A **Server Component page** fetches through `src/services/*`, then passes data to a **Client Component** for interactivity.
- Mutations are **Server Actions**.
- The service-role client (`src/lib/supabase/admin.ts`) is imported only by server code behind the `/admin` gate (middleware plus `users.is_admin`).
- Types live in `src/types/scholarship.ts`, and Zod schemas in `src/lib/validations/`.
- Reuse existing components before creating new ones.

---

## Database direction

Scholarship data supports: scholarships, sources, eligible countries, study levels, fields of study, funding, application deadlines and URLs, verification status, and publication status.

Student data supports: authenticated users, student profiles and preferences, saved scholarships, application status, and deadline tracking.

Use proper relational structures and junction tables for many-to-many data. Do not duplicate data unnecessarily.

**SQL is applied by hand.** I run SQL manually in the Supabase SQL editor. When a change needs schema or RLS changes, put the SQL in a clearly labeled block or a file, say it must be run, and do not assume it has been applied.

---

## Supabase

Use Supabase for the database, authentication, Row Level Security, and scholarship and student data.

- Follow least privilege. Do not disable RLS to make something work.
- Do not expose secrets or service-role keys in client-side code.
- Use environment variables for credentials.

---

## Data quality and verification

Scholarship information is central to the product.

- **Deadlines and requirements come only from the sponsor's official page.** Never copy dates from aggregator sites, which contradict each other.
- New or unverified listings are saved as `draft` and `pending`, and published only after verification.
- Expired or closed cycles show as closed, not live.
- Do not treat fake or placeholder scholarship information as production data, and do not invent details.
- Preserve source, application URL, deadline, eligibility, funding, destination, and verification status whenever scholarship data is added or modified.

---

## Recommendations and matching

Matching stays simple and explainable. Signals: study level, field of study, destination country, eligible country (nationality), and student preferences.

- Profile fields are optional and never gate signup.
- A profile pre-fills the directory filters. The student can always override them.
- Globally eligible scholarships always show.
- Do not introduce AI recommendations until basic matching is reliable.

---

## Development rules

1. **Inspect before editing.** Understand the existing implementation first.
2. **Don't over-engineer.** Choose the simplest implementation that solves the current problem.
3. **Preserve working functionality.** Don't rewrite working parts unnecessarily.
4. **Keep changes focused.** Avoid unrelated refactoring.
5. **Use TypeScript properly.** Avoid unnecessary `any`, and keep types close to the data they describe.
6. **Handle real-world states:** loading, empty, no results, error, success, authentication required, and expired deadlines.
7. **Responsive:** mobile, tablet, and desktop.
8. **Accessible:** semantic HTML, labeled controls, keyboard-friendly interactions, and clear loading and error feedback.

### Definition of done

- `npm run build` and `npx tsc --noEmit` pass.
- Loading, empty, error, and signed-out states are handled, and it works on mobile.
- No RLS weakened and no secrets in client code.
- You summarize what changed and say what is still incomplete.

---

## UI direction

Modern, clean, friendly, trustworthy, professional, and student-focused. The look is editorial and restrained: serif headings, generous whitespace, thin borders.

- Use the existing color tokens. Red is reserved for urgency. Do not introduce gradients without a strong existing design reason.
- Animations should be subtle and purposeful.
- Avoid generic SaaS styling.

---

## Working with me

When I ask you to build something:

1. Inspect the relevant existing implementation.
2. Briefly explain what you found if it affects the implementation.
3. Make the smallest appropriate changes.
4. Run the relevant checks.
5. Tell me what changed and what remains incomplete.
6. If a different feature should be completed first, explain why before making a large change.
7. Don't ask unnecessary questions when the codebase already provides enough context.

### Progress

If the project is behind schedule:

- Don't pretend unfinished features are complete.
- Don't implement several large features at once to match a day number.
- Find the highest-value unfinished feature, complete it properly, then move to the next.

Quality and actual progress matter more than the calendar.

---

## First task

Before implementing anything new, audit the current codebase and give me a concise report:

### Completed
Features clearly implemented and working.

### Partially complete
Features that exist but need more work.

### Missing
Important features that are not implemented.

### Problems
Bugs, broken flows, technical debt, inconsistent UI, or questionable architecture.

### Needs my confirmation
Anything that depends on Supabase dashboard settings, applied SQL, or Vercel configuration you can't see from the code.

### Recommended next step
The single most important feature or task to work on next.

After the audit, **stop and wait for my go-ahead if the next step touches the database schema, authentication, or RLS.** Otherwise continue with the recommended step.