# Stitch Design Prompt — Therapy Companion App

## Context

Design a mobile-first therapy companion app for psychologists and their patients in Costa Rica. The app has two user roles: therapist and patient. It functions as a structured progress dashboard and self-monitoring tool. The therapist documents sessions and assigns forms; the patient sees their own progress and completes those forms.

This app must feel warm, modern, and approachable — not clinical, not hospital-like. Think of it as a wellness tool that happens to be used in a therapeutic context. It should feel like something a patient would actually want to open.

---

## Screens to Design

Design the following screens. Each screen should be shown at mobile viewport (390px wide, approximately iPhone 15 Pro scale). Include a light mode version. Dark mode is a stretch goal.

### 1. App Landing / Marketing Page (web, desktop)
A landing page for the app aimed at therapists considering adopting the tool. It should:
- Introduce the app concept clearly in one hero headline
- Show a visual of the patient dashboard (mockup or illustration)
- Have a clear CTA to sign up or request access
- Feel professional enough to earn a therapist's trust but warm enough to signal this is not another EDUS clone
- Include a short "how it works" section with 3 steps

### 2. Login Screen (mobile)
- Role selector: "Soy terapeuta" / "Soy paciente"
- Email and password fields
- Magic link option ("Ingresar sin contraseña")
- App logo/name prominent
- Language: Spanish

### 3. Therapist Home — Patient List (mobile)
- List of active patients (name, last session date, session count)
- Quick action to start a new session
- Search/filter bar at top
- Bottom navigation: Patients / Sessions / Settings

### 4. Patient Record — Progress Dashboard (mobile, therapist view)
This is the core screen. The therapist opens a patient and sees:
- Patient name and active since date
- Metric trend charts (2–3 Likert-scale metrics shown as small line charts, e.g. Anxiety, Sleep, Mood scored 0–10)
- Most recent session summary
- List of assigned autorregistros and their completion status
- Button to start a new session

### 5. Patient Dashboard (mobile, patient view)
What the patient sees when they log in:
- Greeting with their first name
- Their metric trend charts (same data, different framing — "your progress")
- Pending forms to complete
- A "streak" or engagement indicator (placeholder — system TBD)
- Recent activity

### 6. Autorregistro — Form Completion (mobile, patient view)
A patient filling out a self-monitoring form assigned by their therapist. Show a form with mixed field types:
- Free text question ("¿Qué pasó?")
- Emotion picker (visual emotion grid with labels)
- Likert scale 0–10 (horizontal slider or tap-to-select)
- Submit button
- Progress indicator (question 2 of 4)

---

## Design Direction

### Personality
Warm, approachable, modern. Not childish. Not clinical. Not a corporate health dashboard. Think: a tool a thoughtful friend would design if they knew how to build apps.

### Color Palette — Let Stitch Recommend
Do not lock in a specific palette. Let the AI recommend a cohesive palette that fits the description above. Guidelines:
- Should use color to create warmth, not sterility
- Charts and data visualizations should be readable and accessible
- Avoid: cold blues and grays that feel medical; pure white backgrounds with no warmth; neon or overly saturated accent colors
- Acceptable: warm neutrals, muted but distinct accent colors, a primary brand color that works on both light and dark surfaces

### Typography
- One serif or rounded display font for headings (warm, human)
- One clean sans-serif for body and UI text
- Spanish language — accent characters must render correctly

### Key UI Patterns
- Metric trend charts: small, sparkline-style line charts that communicate direction at a glance
- Likert scale input: horizontal, tactile, easy to tap on mobile — not a tiny slider
- Form fields: generous touch targets, clear labels, visible progress
- Patient list: scannable, not dense — each item should communicate status at a glance
- Dashboard cards: group related info into distinct cards with clear hierarchy

### Navigation
- Bottom tab bar for primary navigation (mobile)
- Role-based: therapist and patient see different tabs
- No hamburger menus

---

## What to Produce

1. A full design system: colors, typography, spacing scale, component library (buttons, inputs, cards, charts, form fields)
2. All 6 screens above at mobile viewport (plus the landing page at desktop)
3. Interactive prototype connecting: Login → role selection → Therapist Home → Patient Record → Start Session
4. Annotations on the Patient Dashboard and Form Completion screens explaining design decisions

---

## What to Avoid

- EDUS / CCSS aesthetic (government system look)
- Pure white flat design with no warmth
- Dashboard overload — no more than 3 visible metrics at once without scrolling
- Desktop-first layouts adapted to mobile — design mobile first
- English labels — all UI copy should be in Spanish
