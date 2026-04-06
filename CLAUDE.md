# CLAUDE.md — Refugio Editorial

## Project Overview

**Refugio Editorial** — a therapy process companion app for Costa Rican psychologists and their patients. Built as a PWA-first web app with a clear path toward native mobile. Therapists document session progress, assign self-monitoring forms (autorregistros), and build patient dashboards. Patients view their own progress, complete assigned forms, and track their therapeutic journey.

Solo developer project, built with Claude Code. Move fast, ship incrementally, keep the architecture clean.

---

## Core Concept

A biofeedback-style dashboard for qualitative and quantitative therapeutic data. The therapist is the primary content creator (defines metrics, assigns forms, annotates sessions). The patient is the primary consumer of their own data (sees progress, completes forms, builds a longitudinal view).

Both roles exist in the same app. The experience is split by role, not by product.

---

## User Roles

### Therapist
- Creates and manages patient records
- Documents session notes and progress markers
- Defines custom Likert-scale metrics per patient (e.g. anxiety 0–10, sleep quality 0–10)
- Creates and assigns autorregistros (self-monitoring forms) per patient
- Views the patient dashboard from the therapist perspective
- Has access to all patient data within their practice

### Patient
- Views their own progress dashboard (not the therapist's admin view)
- Completes assigned autorregistros
- Sees their metric trends over time (charts, graphs)
- Cannot see other patients or therapist-only notes
- Onboarded via invite link from therapist (no self-registration)

---

## Key Features

### Session Documentation
- Per-session notes linked to a patient record
- Progress markers per session (free text + structured)
- Custom Likert-scale metrics defined by therapist per patient (scored 0–10)
- Session history timeline

### Patient Dashboard
- Visual progress dashboard built from therapist-defined metrics
- Sparkline trend charts for each metric over time
- Summary of assigned and completed autorregistros
- Designed to be shown during sessions or accessed independently

### Autorregistros (Self-Monitoring Forms)
- Therapist creates custom forms per patient
- Field types: scale (0–10), emotion picker, free text, time-block grid
- Patient fills out forms in-app with minimal friction
- Therapist views completed submissions
- JSONB-based form schema with Zod validation

### Reinforcement System
- Deferred to after core features are solid
- Goal: increase patient engagement and return rate
- Explore: streaks, completion indicators, session milestones

---

## Design System

**Name**: The Editorial Sanctuary (via Stitch)
**Aesthetic**: Warm, editorial, organic — not clinical, not EDUS.

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #9b4f36 (terracotta) | CTAs, brand accent |
| `secondary` | #596a40 (sage) | Positive trends, secondary actions |
| `tertiary` | #845c32 (warm brown) | Links, neutral data |
| `surface` | #fffcf7 (warm white) | Base background |
| `surface_container` | #f6f4ec | Content zones |
| `on_surface` | #373831 | Primary text (never pure black) |
| `error` | #b33938 | Error states |

### Typography
| Role | Font | Size |
|------|------|------|
| Display | Noto Serif | 3.5rem |
| Headline | Noto Serif | 1.75rem |
| Title | Plus Jakarta Sans | 1.375rem |
| Body | Plus Jakarta Sans | 1rem |
| Label | Plus Jakarta Sans | 0.75rem |

### Design Rules
- **No 1px borders** — use tonal background shifts for separation
- **Glassmorphism** for floating elements (bottom nav, modals)
- **Gradient CTAs** — primary to primary_dim at 135deg
- **xl radius** (1.5rem) for main containers, **md** (0.75rem) for nested elements
- **No pure black** — always use `on_surface` (#373831)
- Spanish text is ~25% longer than English — maintain 1.5x line height for body

### Stitch Assets
Design screens and system are in `stitch_assets/`:
- `design_system.json` — full token definitions
- `screens/` — PNG + HTML for all 6 designed screens
- Screens: login, therapist home, patient record, patient dashboard, autorregistro, landing page

---

## Tech Stack

### Frontend
- Next.js (App Router) + React + TypeScript
- Tailwind CSS (configured with Stitch design tokens)
- Framer Motion for animations
- Lucide React for icons
- Recharts for metric trend charts

### Backend & Auth
- Supabase (Postgres, Auth, real-time)
- RLS on every table — no exceptions
- Auth: email/password + magic link
- Patient onboarding: therapist-invite model (invite link → register → auto-link)
- Server Actions for all mutations (not API routes)

### Supabase Client Architecture
- `lib/supabase/client.ts` — Browser client (singleton, `createBrowserClient`)
- `lib/supabase/server.ts` — Server client (per-request, `createServerClient` with cookies)
- `lib/supabase/middleware.ts` — Middleware client (session refresh, request/response cookies)

### PWA
- Manifest + service worker from Phase 0
- Full offline support + background sync in Phase 5

### Infrastructure
- Vercel (auto-deploy from GitHub)
- GitHub for version control

---

## Project Structure

```
/
├── app/
│   ├── (auth)/                # Login, register, invite, consent
│   ├── (therapist)/           # Therapist-only routes
│   │   ├── patients/          # Patient list, detail, sessions, metrics, forms
│   │   └── settings/          # Therapist settings
│   ├── (patient)/             # Patient-only routes
│   │   ├── dashboard/         # Patient progress view
│   │   ├── forms/             # Autorregistro completion
│   │   ├── sessions/          # Session history (patient view)
│   │   └── settings/          # Patient settings, export, delete
│   └── api/                   # API routes (data export only)
├── components/
│   ├── auth/                  # LoginForm, RegisterForm, RoleSelector
│   ├── therapist/             # PatientList, SessionForm, FormBuilder, etc.
│   ├── patient/               # PatientGreeting, FormRenderer, MetricSummary, etc.
│   ├── shared/                # MetricChart, EmptyState, field components
│   └── ui/                    # Button, Input, Card, BottomNav, Avatar, Toast
├── lib/
│   ├── supabase/              # Client, server, middleware factories
│   ├── actions/               # Server Actions (patients, sessions, metrics, forms)
│   ├── types/                 # TypeScript interfaces, database types, form types
│   └── utils/                 # Auth helpers, date formatting, form validation (Zod)
├── public/                    # PWA manifest, icons, service worker, offline.html
├── supabase/
│   ├── migrations/            # SQL migrations
│   └── tests/                 # RLS test scripts
├── stitch_assets/             # Stitch design output (reference only)
├── docs/                      # Compliance notes, smoke tests, deployment runbook
├── PLAN.md                    # Phased development roadmap
└── TODO.md                    # Actionable task checklist
```

---

## Database Schema

```sql
profiles
  id uuid references auth.users
  role text check (role in ('therapist', 'patient'))
  full_name text
  created_at timestamptz

patient_records
  id uuid
  therapist_id uuid references profiles
  patient_id uuid references profiles    -- nullable until patient accepts invite
  invite_token text unique               -- for invite flow
  created_at timestamptz
  is_active boolean

sessions
  id uuid
  patient_record_id uuid references patient_records
  session_date date
  notes text
  created_at timestamptz

metrics
  id uuid
  patient_record_id uuid references patient_records
  name text
  description text
  min_value integer default 0
  max_value integer default 10

metric_values
  id uuid
  session_id uuid references sessions
  metric_id uuid references metrics
  value integer
  recorded_at timestamptz

form_templates
  id uuid
  therapist_id uuid references profiles
  patient_record_id uuid references patient_records
  title text
  fields jsonb              -- FormField[] array
  created_at timestamptz
  is_active boolean

form_submissions
  id uuid
  form_template_id uuid references form_templates
  patient_id uuid references profiles
  responses jsonb           -- keyed by field id
  submitted_at timestamptz
```

All tables have RLS. Therapists access only their own patients. Patients access only their own data.

---

## Compliance & Legal (Costa Rica)

Regulated by Colegio de Psicólogos de Costa Rica and Ley 8968 (data protection).

**Research required before launch:**
- Review Colegio guidelines on digital patient records (expediente clínico digital)
- Confirm cloud storage rules under professional secrecy (secreto profesional)
- Determine consent requirements for digital data storage
- Confirm data residency requirements (Supabase region: us-east-1)
- Draft in-app consent flow

**Implementation requirements (enforced from day one):**
- Supabase RLS on every table
- No patient identifiable data in logs
- Data export capability for patients (free)
- Data deletion path when therapeutic relationship ends

---

## Development Principles

1. **RLS first.** Every new table gets a policy before any data is written.
2. **Mobile-first.** Every component is designed for 390px before desktop.
3. **Low friction.** Patient-facing flows — every tap counts.
4. **Role separation.** Therapist and patient UI are distinct. Never mixed.
5. **Incremental.** Core loop first: session → metrics → chart. Everything else is additive.
6. **No borders.** Follow the design system's "no-line" rule — tonal shifts, not dividers.
7. **Spanish UI.** All user-facing copy in Spanish. Use ¡ and ¿ correctly.

---

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App name | Refugio Editorial | From Stitch design system output |
| Patient onboarding | Therapist-invites | Therapist controls who has access; no unsolicited registrations |
| Charting library | Recharts | Lightweight, React-native JSX API, good mobile support |
| Form data model | JSONB fields + responses | Simple, flexible, no migration needed for new field types |
| Mutations | Server Actions | CSRF handled, JWT forwarded for RLS, less boilerplate than API routes |
| Testing (MVP) | TypeScript strict + Zod + RLS SQL tests | Maximize safety with minimal test infrastructure |
| Design system | Stitch "Editorial Sanctuary" | Full tokens available in stitch_assets/design_system.json |

---

## Open Questions

- Whether to support multiple therapists per practice (multi-tenant) — defer, schema allows it later
- Native app path: React Native vs Capacitor vs rebuild — decide after MVP validation
- Reinforcement system design — defer to after core features
