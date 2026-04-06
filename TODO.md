# TODO.md — Therapy

Actionable task checklist. Check off items as they're completed. See `PLAN.md` for full context and acceptance criteria per phase.

---

## Phase 0: Project Bootstrap

- [ ] Initialize git repo + `.gitignore`
- [ ] Scaffold Next.js project (TypeScript + Tailwind + App Router)
- [ ] Install dependencies (`@supabase/supabase-js`, `@supabase/ssr`, `framer-motion`, `lucide-react`, `recharts`)
- [ ] Configure fonts: Noto Serif + Plus Jakarta Sans via `next/font/google`
- [ ] Configure Tailwind with Stitch design tokens (colors, fonts, radius, spacing)
- [ ] Set up `globals.css` with CSS custom properties for design system
- [ ] Create `.env.example` with Supabase key placeholders
- [ ] Create Supabase project (us-east-1), get URL + anon key, populate `.env.local`
- [ ] Create Supabase client factories (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [ ] Create root `middleware.ts` (session refresh only)
- [ ] Set up route group stubs: `(auth)`, `(therapist)`, `(patient)` with layout files
- [ ] Create `public/manifest.json` (theme_color: #9b4f36)
- [ ] Create `public/sw.js` skeleton + `public/offline.html`
- [ ] Wire service worker registration in root layout
- [ ] Connect GitHub repo to Vercel, verify deploy

## Phase 1: Foundation

### Database
- [x] Write `supabase/migrations/001_initial_schema.sql` (all tables + RLS + triggers)
- [x] Apply migration to Supabase
- [x] Generate TypeScript types (`supabase gen types typescript`)
- [x] Write RLS test scripts (`supabase/tests/rls_test.sql`)

### Auth
- [x] Build `LoginForm` (email/password + magic link toggle)
- [x] Build `RegisterForm` with `RoleSelector` ("Soy terapeuta" / "Soy paciente")
- [x] Build auth callback route (`/auth/callback/route.ts`)
- [x] Build patient invite flow (therapist generates link → patient registers → auto-links)
- [x] Update middleware: session refresh + role-based route protection

### UI Primitives
- [x] `Button` (primary gradient, secondary, tertiary/ghost)
- [x] `Input` (minimalist, bottom ghost border, focus state)
- [x] `Card` (xl radius, no divider lines, tonal layering)
- [x] `BottomNav` (glassmorphism, role-based tabs)
- [x] `Avatar` (image + initials fallback)

### Layouts
- [x] Therapist shell (header + BottomNav: Pacientes / Sesiones / Ajustes)
- [x] Patient shell (header + BottomNav: Inicio / Registros / Progreso / Perfil)
- [x] Auth layout (centered card)
- [x] Placeholder dashboard pages for both roles

## Phase 2: Therapist Core

### Patient Management
- [x] Server Actions: `createPatient`, `updatePatient`, `listPatients`, `getPatient`
- [x] `PatientList` component with search/filter
- [x] `PatientCard` component (name, condition, last session, session count)
- [x] `PatientForm` component (create/edit)
- [x] Patient list page (`/terapeuta/pacientes`)
- [x] New patient page + invite generation

### Session Documentation
- [x] Server Actions: `createSession`, `getSessionsByPatient`, `getSession`
- [x] `SessionForm` component (notes + metric recording)
- [x] New session page (`/terapeuta/pacientes/[id]/sesiones/nueva`)
- [x] Session history page (`/terapeuta/pacientes/[id]/sesiones`)

### Metrics
- [x] Server Actions: `createMetric`, `updateMetric`, `recordMetricValues`, `getMetricHistory`
- [x] `MetricDefinitionForm` (name, description, min/max)
- [x] `MetricRecorder` (slider/tap inputs for 0–10 scales)
- [x] Integrate `MetricRecorder` into `SessionForm`
- [x] `MetricChart` shared component (Recharts LineChart, sparkline variant)

### Patient Detail
- [x] `PatientDashboardView` (charts + recent session + form status)
- [x] Patient detail page (`/terapeuta/pacientes/[id]`)

## Phase 3: Patient Core

- [x] Server Actions: `getMyMetrics`, `getMySessionHistory`, `getMyPendingForms`
- [x] `PatientGreeting` ("Hola, María" with time-of-day context)
- [x] `MetricSummary` (cards with sparkline + current value)
- [x] `PendingForms` (list of forms awaiting completion)
- [x] `EngagementIndicator` (streak / completion rate placeholder)
- [x] Patient dashboard page (`/paciente`)
- [x] `SessionHistoryPatient` (dates + metrics, no therapist notes)
- [x] Patient sessions page (`/paciente/sesiones`)

## Phase 4: Autorregistros

### Types & Validation
- [x] TypeScript types for form fields (`lib/types/forms.ts`)
- [x] Zod schemas for template validation + submission validation

### Field Components
- [x] `ScaleField` (0–10 horizontal tap selector)
- [x] `EmotionPicker` (visual emotion grid with labels)
- [x] `TextField` (free text / multiline)
- [x] `TimeBlockGrid` (time-of-day block selector)
- [x] `YesNoField` (boolean toggle)
- [x] `ChecklistField` (multi-select)
- [x] `SelectField` (single-select)

### Therapist: Form Builder
- [x] `FormBuilder` (add/remove/reorder fields, configure each)
- [x] `FieldConfigurator` (type-specific options per field — integrated into FormBuilder)
- [x] `FormPreview` (renders via FormRenderer in read-only mode — integrated into FormBuilder)
- [x] Server Actions: `createTemplate`, `getTemplates`, `toggleActive`
- [x] Form template list (integrated into patient dashboard)
- [x] Form builder page (new template)

### Patient: Form Completion
- [x] `FormRenderer` (maps field array to components, manages state)
- [x] `FormProgress` (progress bar with answered/total count)
- [x] `FormConfirmation` (success screen — integrated into FormCompletion)
- [x] Server Actions: `submitForm`, `getMySubmissions`
- [x] Form completion page (`/paciente/registros/[id]`)
- [x] Form list page (pending + completed)

### Therapist: Submission Viewing
- [x] `SubmissionList` (list per template)
- [x] `SubmissionDetail` (view individual submission)
- [x] Submission viewing pages
- [x] Wire `PendingForms` on patient dashboard to real data

## Phase 5: Polish & PWA

### Offline & PWA
- [x] Upgrade `sw.js`: caching strategy, offline fallback, stale-while-revalidate
- [x] `OfflineBanner` component + offline detection hook
- [ ] Test PWA install on iOS and Android

### Error Handling & Loading
- [x] Error boundary (`error.tsx`) with Spanish messages
- [x] Custom 404 (`not-found.tsx`)
- [x] `LoadingSkeleton` components (patient list, dashboard, forms)
- [x] Add `loading.tsx` to all route groups
- [x] Toast notification system

### Compliance & Data
- [x] Consent flow page (`/consentimiento`) — Ley 8968
- [x] `consent_given_at` column + migration + Server Action
- [x] Gate post-auth routes on consent in middleware
- [x] Data export route (JSON via `/api/export`)
- [x] Patient settings page (export, delete account info)
- [x] Therapist settings page (profile info)

### Visual Polish
- [x] Framer Motion: PageTransition, StaggerList, CardEntrance, FadeIn primitives
- [ ] Responsive audit: 390px, 768px, 1024px
- [ ] Verify no PII in Vercel logs

## Phase 6: Launch Prep

- [ ] Vercel production environment setup (env vars, region)
- [ ] Custom domain + HTTPS
- [ ] Supabase custom SMTP (Spanish auth email templates)
- [ ] Lighthouse audit (PWA 90+, Performance 80+, A11y 90+)
- [ ] Fix Lighthouse issues
- [ ] Comprehensive RLS test suite
- [ ] Remove `console.log` that could leak PII
- [ ] Write compliance checklist (`docs/compliance-checklist.md`)
- [ ] Write + execute smoke test (`docs/smoke-test.md`)
- [ ] Verify Supabase database backups
- [ ] Create seed data script for demos
