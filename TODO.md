# TODO.md — Refugio Editorial

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
- [ ] Write `supabase/migrations/001_initial_schema.sql` (all tables + RLS + triggers)
- [ ] Apply migration to Supabase
- [ ] Generate TypeScript types (`supabase gen types typescript`)
- [ ] Write RLS test scripts (`supabase/tests/rls_test.sql`)

### Auth
- [ ] Build `LoginForm` (email/password + magic link toggle)
- [ ] Build `RegisterForm` with `RoleSelector` ("Soy terapeuta" / "Soy paciente")
- [ ] Build auth callback route (`/auth/callback/route.ts`)
- [ ] Build patient invite flow (therapist generates link → patient registers → auto-links)
- [ ] Update middleware: session refresh + role-based route protection

### UI Primitives
- [ ] `Button` (primary gradient, secondary, tertiary/ghost)
- [ ] `Input` (minimalist, bottom ghost border, focus state)
- [ ] `Card` (xl radius, no divider lines, tonal layering)
- [ ] `BottomNav` (glassmorphism, role-based tabs)
- [ ] `Avatar` (image + initials fallback)

### Layouts
- [ ] Therapist shell (header + BottomNav: Pacientes / Sesiones / Ajustes)
- [ ] Patient shell (header + BottomNav: Inicio / Registros / Progreso / Perfil)
- [ ] Auth layout (centered card)
- [ ] Placeholder dashboard pages for both roles

## Phase 2: Therapist Core

### Patient Management
- [ ] Server Actions: `createPatient`, `updatePatient`, `listPatients`, `getPatient`
- [ ] `PatientList` component with search/filter
- [ ] `PatientCard` component (name, condition, last session, session count)
- [ ] `PatientForm` component (create/edit)
- [ ] Patient list page (`/terapeuta/pacientes`)
- [ ] New patient page + invite generation

### Session Documentation
- [ ] Server Actions: `createSession`, `getSessionsByPatient`, `getSession`
- [ ] `SessionForm` component (notes + metric recording)
- [ ] New session page (`/terapeuta/pacientes/[id]/sesiones/nueva`)
- [ ] Session history page (`/terapeuta/pacientes/[id]/sesiones`)

### Metrics
- [ ] Server Actions: `createMetric`, `updateMetric`, `recordMetricValues`, `getMetricHistory`
- [ ] `MetricDefinitionForm` (name, description, min/max)
- [ ] `MetricRecorder` (slider/tap inputs for 0–10 scales)
- [ ] Integrate `MetricRecorder` into `SessionForm`
- [ ] `MetricChart` shared component (Recharts LineChart, sparkline variant)

### Patient Detail
- [ ] `PatientDashboardView` (charts + recent session + form status)
- [ ] Patient detail page (`/terapeuta/pacientes/[id]`)

## Phase 3: Patient Core

- [ ] Server Actions: `getMyMetrics`, `getMySessionHistory`, `getMyPendingForms`
- [ ] `PatientGreeting` ("Hola, María" with time-of-day context)
- [ ] `MetricSummary` (cards with sparkline + current value)
- [ ] `PendingForms` (list of forms awaiting completion)
- [ ] `EngagementIndicator` (streak / completion rate placeholder)
- [ ] Patient dashboard page (`/paciente`)
- [ ] `SessionHistoryPatient` (dates + metrics, no therapist notes)
- [ ] Patient sessions page (`/paciente/sesiones`)

## Phase 4: Autorregistros

### Types & Validation
- [ ] TypeScript types for form fields (`lib/types/forms.ts`)
- [ ] Zod schemas for template validation + submission validation

### Field Components
- [ ] `ScaleField` (0–10 horizontal tap selector)
- [ ] `EmotionPicker` (visual emotion grid with labels)
- [ ] `TextField` (free text / multiline)
- [ ] `TimeBlockGrid` (time-of-day block selector)

### Therapist: Form Builder
- [ ] `FormBuilder` (add/remove/reorder fields, configure each)
- [ ] `FieldConfigurator` (type-specific options per field)
- [ ] `FormPreview` (renders via FormRenderer in read-only mode)
- [ ] Server Actions: `createTemplate`, `getTemplates`, `toggleActive`
- [ ] Form template list page
- [ ] Form builder page (new template)

### Patient: Form Completion
- [ ] `FormRenderer` (maps field array to components, manages state)
- [ ] `FormProgress` ("Pregunta 2 de 4")
- [ ] `FormConfirmation` (success screen)
- [ ] Server Actions: `submitForm`, `getMySubmissions`
- [ ] Form completion page (`/paciente/formularios/[id]`)
- [ ] Form list page (pending + completed)

### Therapist: Submission Viewing
- [ ] `SubmissionList` (table/list per template)
- [ ] `SubmissionDetail` (view individual submission)
- [ ] Submission viewing pages
- [ ] Wire `PendingForms` on patient dashboard to real data

## Phase 5: Polish & PWA

### Offline & PWA
- [ ] Upgrade `sw.js`: caching strategy, offline fallback, background sync
- [ ] `OfflineBanner` component + offline detection hook
- [ ] Test PWA install on iOS and Android

### Error Handling & Loading
- [ ] Error boundary (`error.tsx`) with Spanish messages
- [ ] Custom 404 (`not-found.tsx`)
- [ ] `LoadingSkeleton` components (patient list, dashboard, forms)
- [ ] Add `loading.tsx` to all route groups
- [ ] Toast notification system

### Compliance & Data
- [ ] Consent flow page + `ConsentModal` (Ley 8968)
- [ ] `consent_given_at` column + Server Actions
- [ ] Gate post-auth routes on consent in middleware
- [ ] Data export route (JSON/CSV for patient's own data)
- [ ] Patient settings page (export, delete account)
- [ ] Therapist settings page (profile, practice info)

### Visual Polish
- [ ] Framer Motion: page transitions, card entrances, form progress animations
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
