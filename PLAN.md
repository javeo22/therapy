# PLAN.md — Refugio Editorial Development Roadmap

## Summary

Phased development plan for a PWA therapy companion app for Costa Rican psychologists and patients. Solo developer using Claude Code. Ship the core loop first (therapist documents session → records metrics → patient sees progress), then layer on autorregistros, polish, and compliance.

**Total estimated effort: 47–66 hours across 7 phases.**

---

## Technical Decisions

### App Name
**Refugio Editorial** — from the Stitch design system output.

### Charting: Recharts
Lightweight, React-native, JSX API. Best fit for sparkline trend charts on patient dashboards. `<LineChart>` with `<ResponsiveContainer>` handles mobile viewports well.

### Supabase Client Architecture: 3 Factories
1. **`lib/supabase/client.ts`** — Browser client. `createBrowserClient` from `@supabase/ssr`. Singleton. Used in `"use client"` components.
2. **`lib/supabase/server.ts`** — Server client. `createServerClient` with `cookies()`. Per-request (not singleton). Used in Server Components, Server Actions, Route Handlers.
3. **`lib/supabase/middleware.ts`** — Middleware client. `createServerClient` with request/response cookie handling. Session refresh + route protection.

### Form Builder: JSONB Schema
`form_templates.fields` stores `FormField[]` as JSONB. Discriminated union on `type` field:
```typescript
type FormField =
  | { type: "scale"; id: string; label: string; min: number; max: number }
  | { type: "emotion"; id: string; label: string; options: string[] }
  | { type: "text"; id: string; label: string; placeholder?: string; multiline?: boolean }
  | { type: "time_block"; id: string; label: string; blocks: string[] };
```
Submissions store `responses` JSONB keyed by field `id`. Zod validation on both client and server.

### Server Actions Over API Routes
Use Next.js Server Actions (`"use server"`) for all mutations. They handle CSRF, carry the user's JWT via cookies for RLS. Reserve API routes only for file downloads (data export).

### Patient Onboarding: Therapist-Invites Model
Therapist creates a patient record → generates an invite link → patient registers via that link → auto-linked to therapist. No self-registration for patients.

### Design System: Stitch Output Available
Full design system from Stitch: "The Editorial Sanctuary" aesthetic. Terracotta primary (#9b4f36), sage secondary (#596a40), warm neutrals. Noto Serif for headings, Plus Jakarta Sans for body. Implement design tokens from Phase 0.

### Testing Strategy (MVP)
- Strict TypeScript (`strict: true`) + Zod validation as primary safety net
- SQL-level RLS tests (raw SQL scripts verifying cross-user isolation)
- Manual smoke test checklist before each deploy
- Playwright E2E after MVP

---

## Phase 0: Project Bootstrap

**Goal**: Deployable skeleton on Vercel with PWA capabilities, design tokens configured, Supabase client initialized.

### Tasks
1. `git init`, `.gitignore` (node_modules, .next, .env.local, .vercel, out)
2. `npx create-next-app@latest` — TypeScript + Tailwind + App Router
3. Install deps: `@supabase/supabase-js`, `@supabase/ssr`, `framer-motion`, `lucide-react`, `recharts`
4. Configure Tailwind with Stitch design tokens (colors, fonts, border-radius, spacing)
5. Install and configure fonts: Noto Serif + Plus Jakarta Sans (via `next/font/google`)
6. Create `.env.local` / `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Create Supabase project (dashboard), pick `us-east-1`, get URL + anon key
8. Create `lib/supabase/client.ts`, `server.ts`, `middleware.ts`
9. Create root `middleware.ts` — session refresh only (no route protection yet)
10. Set up route group layouts: `(auth)`, `(therapist)`, `(patient)` as stubs
11. Create `public/manifest.json` (app name, icons, theme_color #9b4f36)
12. Create `public/sw.js` skeleton + `public/offline.html` (Spanish)
13. Wire SW registration in root `layout.tsx`
14. Create `globals.css` with Tailwind directives + CSS custom properties for design tokens
15. Connect GitHub repo → Vercel, verify deploy

### Done Criteria
- Vercel URL shows placeholder page with correct fonts and colors
- Lighthouse PWA audit detects manifest + SW
- Supabase client initializes without errors
- Route groups exist and render distinct layout shells
- `.env.local` is gitignored; `.env.example` is committed

---

## Phase 1: Foundation

**Goal**: Complete database schema with RLS, working auth flow (login + register + magic link + invite), role-based routing, and UI primitive components.

### Tasks
1. Write `supabase/migrations/001_initial_schema.sql` — all tables, indexes, RLS policies, profile trigger
2. Apply migration via Supabase CLI or dashboard
3. Run `supabase gen types typescript` → `lib/types/database.ts`
4. Build UI primitives: `Button`, `Input`, `Card`, `BottomNav`, `Avatar` (matching Stitch design system)
5. Build `RoleSelector` component ("Soy terapeuta" / "Soy paciente")
6. Build `RegisterForm` — calls `supabase.auth.signUp`, writes role to `profiles`
7. Build `LoginForm` — email/password + magic link toggle
8. Build auth callback route (`/auth/callback/route.ts`)
9. Build patient invite flow — therapist generates link, patient registers via link, auto-links to therapist
10. Update `middleware.ts`: refresh session, redirect unauthenticated → `/login`, redirect by role
11. Build therapist layout shell (header + BottomNav: Pacientes / Sesiones / Ajustes)
12. Build patient layout shell (header + BottomNav: Inicio / Registros / Progreso / Perfil)
13. Build placeholder dashboard pages for both roles
14. Write RLS test scripts (`supabase/tests/rls_test.sql`)

### Done Criteria
- User can register as therapist, log in, and land on therapist shell
- Therapist can generate invite link; patient registers via link and lands on patient shell
- Magic link flow works end-to-end
- Unauthenticated users → `/login`; wrong-role users → correct shell
- RLS tests pass: therapist A cannot see therapist B's patients; patient A cannot see patient B's data
- UI primitives render correctly on 390px viewport with Stitch design tokens

---

## Phase 2: Therapist Core

**Goal**: Therapist can manage patients, document sessions, define metrics, and record metric values per session.

### Tasks
1. Server Actions for patient CRUD (`lib/actions/patients.ts`)
2. `PatientList`, `PatientCard`, `PatientForm` components
3. Patient list page with search/filter
4. Patient creation flow (create record + generate invite)
5. Server Actions for session CRUD (`lib/actions/sessions.ts`)
6. `SessionForm` component (notes + metric value inputs)
7. New session page
8. Session history list page
9. Server Actions for metrics (`lib/actions/metrics.ts`)
10. `MetricDefinitionForm` — therapist defines custom metrics per patient
11. `MetricRecorder` — slider/tap inputs for recording values during a session
12. Integrate metric recording into `SessionForm`
13. `MetricChart` shared component (Recharts `LineChart` with sparkline variant)
14. `PatientDashboardView` — assembles charts + recent session + form status
15. Patient detail page (`patients/[id]/page.tsx`)

### Done Criteria
- Therapist creates a patient and sees them in the list
- Therapist defines 1–3 custom metrics per patient (e.g., "Ansiedad", "Sueño", "Estado de ánimo")
- Therapist creates a session with notes and records metric values
- Patient detail page shows trend charts (even with 2–3 data points)
- Session history is visible and navigable
- All operations respect RLS (switch to different therapist account → data isolated)

---

## Phase 3: Patient Core

**Goal**: Patient logs in and sees a personalized dashboard with metric trends, session history, and pending forms placeholder.

### Tasks
1. Server Actions for patient data reads (`lib/actions/patient-data.ts`)
2. `PatientGreeting` component ("Hola, María")
3. `MetricSummary` — cards with sparkline trend + current value (reuses `MetricChart`)
4. `PendingForms` component (reads form_templates not yet submitted — empty until Phase 4)
5. `EngagementIndicator` — streak counter / completion rate placeholder
6. Patient dashboard page assembling all components
7. `SessionHistoryPatient` — dates + metrics only, no therapist notes
8. Patient sessions page

### Done Criteria
- Patient dashboard shows personalized greeting + metric sparklines with real data
- Pending forms section renders (empty for now)
- Session history shows dates and metric values, NOT therapist notes
- All data fetched through RLS — patient cannot see other patients
- Dashboard renders well on 390px viewport matching Stitch patient_dashboard screen

---

## Phase 4: Autorregistros

**Goal**: Full form lifecycle — therapist builds custom forms, patient completes them, therapist reviews submissions.

### Tasks
1. TypeScript types + Zod schemas (`lib/types/forms.ts`, `lib/utils/form-validation.ts`)
2. Shared field components: `ScaleField`, `EmotionPicker`, `TextField`, `TimeBlockGrid`
3. `FormRenderer` — maps field array to components, manages form state
4. `FormBuilder` — add/remove/reorder fields, configure each
5. `FormPreview` — renders builder output via `FormRenderer` in read-only mode
6. Server Actions for form templates (`lib/actions/form-templates.ts`)
7. Therapist form template list page
8. Therapist form builder page (new template)
9. Server Actions for form submissions (`lib/actions/form-submissions.ts`)
10. Patient form completion page with `FormRenderer` + progress indicator + submit
11. `FormConfirmation` success screen
12. Patient form list page (pending + completed)
13. `SubmissionList` + `SubmissionDetail` for therapist viewing
14. Therapist submission viewing pages
15. Wire `PendingForms` on patient dashboard to real data

### Done Criteria
- Therapist builds a form with scale + emotion + text fields
- Form preview matches patient view
- Patient sees pending forms on dashboard, completes one, sees confirmation
- Form completion is smooth on mobile — generous touch targets, progress indicator
- Therapist views all submissions for a template
- Zod rejects malformed submissions
- RLS: patients can only submit/view their own forms

---

## Phase 5: Polish & PWA

**Goal**: Production-quality UX with offline support, error handling, consent flows, and data export.

### Tasks
1. Upgrade `sw.js`: precache static assets, offline navigation fallback, background sync for form submissions
2. `OfflineBanner` component + offline detection hook
3. Error boundary (`error.tsx`) + custom 404 (`not-found.tsx`) — Spanish messages
4. `LoadingSkeleton` components for all major views
5. Add `loading.tsx` to all route groups
6. Consent flow page + `ConsentModal` (Ley 8968 compliance)
7. Consent Server Actions, add `consent_given_at` to profiles
8. Gate post-auth routes on consent check in middleware
9. Data export route (JSON/CSV of patient's own data)
10. Patient settings page (export + delete account)
11. Therapist settings page (profile, practice info)
12. Toast notification system for all mutations
13. Responsive audit: 390px, 768px, 1024px
14. Framer Motion animation pass (page transitions, card entrances, form progress)

### Done Criteria
- PWA installs on iOS and Android
- Offline fallback page displays; form submissions queue and sync
- Error boundaries show friendly Spanish messages
- All pages have skeleton loading states
- Consent flow gates access until accepted
- Patient can export their data as JSON
- Delete account path documented (can be manual for MVP)
- Animations feel smooth on mid-range device
- No PII in Vercel logs

---

## Phase 6: Launch Prep

**Goal**: Production deployment, audited and documented.

### Tasks
1. Vercel production environment (env vars, region)
2. Custom domain setup
3. Supabase custom SMTP for auth emails (Spanish templates)
4. Lighthouse audit: PWA 90+, Performance 80+, Accessibility 90+
5. Fix Lighthouse issues
6. Comprehensive RLS test suite
7. Remove all `console.log` that could leak PII
8. Complete compliance checklist document (`docs/compliance-checklist.md`)
9. Write and execute smoke test script (`docs/smoke-test.md`)
10. Supabase database backup verification
11. Seed data script for demos

### Done Criteria
- App on custom domain with HTTPS
- Lighthouse scores meet targets
- Auth emails arrive in Spanish
- RLS test suite: zero cross-user leaks
- Compliance checklist reviewed and documented
- Smoke test covers full user journey for both roles
- Database backups verified

---

## Phase Summary

| Phase | Focus | Effort |
|-------|-------|--------|
| 0 | Bootstrap | 2–3 hrs |
| 1 | Foundation (DB + Auth + UI) | 6–8 hrs |
| 2 | Therapist Core | 10–14 hrs |
| 3 | Patient Core | 5–7 hrs |
| 4 | Autorregistros | 12–16 hrs |
| 5 | Polish & PWA | 8–12 hrs |
| 6 | Launch Prep | 4–6 hrs |
| **Total** | | **47–66 hrs** |

---

## Architecture Notes

### Security Model: Defense in Depth
- **Middleware** = UX layer (redirects, session refresh)
- **RLS** = security layer (Postgres enforces data isolation)
- Even if middleware fails, RLS blocks unauthorized access

### One App, Two Shells
`(therapist)` and `(patient)` route groups share `components/ui/` and `components/shared/` but have completely separate layouts, navigation, and data access patterns.

### Incremental PWA
Phase 0 sets up manifest + basic SW. Phase 5 upgrades with real caching and background sync. Don't over-invest in offline before core features exist.
