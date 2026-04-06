# Design Guidelines: The Antigravity Sanctuary

This document serves as the core design philosophy and technical styling guide for the application. It merges the base "Editorial Sanctuary" design system provided by Stitch with the advanced spatial principles of "Antigravity UI & Motion Design."

## 1. Core Aesthetic: The "Human Sanctuary" + Antigravity Depth

The goal is to create an "app-as-a-companion" experience that feels premium, organic, and physically present. We reject sterile, clinical rigidity in favor of architectural depth, tactile surfaces, and fluid motion.

**Key Concepts:**
*   **Intentional Asymmetry & Bleeds:** Elements don't always have to sit in perfect boxes. Use bleeding edges for images to create visual interest.
*   **No 1px Lines:** Prohibit 1px solid borders for sectioning. Boundaries must be defined via background color shifts or tonal layering.
*   **Tonal Layering:** Treat the UI as a series of physical layers (like stacked cotton paper).
    *   *Base:* `surface` (`#fffcf7`)
    *   *Secondary Zone:* `surface_container` (`#f6f4ec`)
    *   *Interactive Layer:* `surface_container_highest` (`#eae9dd`)

## 2. Antigravity UI Enhancements

To make the app feel truly premium, we implement "Antigravity" concepts:

*   **Diffused Spatial Shadows:** Avoid harsh, short drop-shadows. Shadows should feel ambient and layered.
    ```css
    box-shadow: 
      0 4px 12px rgba(55, 56, 49, 0.03), 
      0 12px 32px rgba(55, 56, 49, 0.05),
      0 24px 64px rgba(55, 56, 49, 0.08); /* Grounding shadow */
    ```
*   **True Glassmorphism:** Sticky headers, floating action buttons, and bottom navigation should use frosted glass, allowing underlying content to blur beautifully.
    ```css
    background: rgba(255, 252, 247, 0.75); /* Your base surface color with transparency */
    backdrop-filter: blur(24px) saturate(1.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.4); /* Inner light reflection */
    ```
*   **Z-Axis Data Layering:** Lists (e.g., patient records, form fields) should transition in depth. As elements scroll out of view under a sticky header, they can scale down slightly (`0.95`) and fade.

## 3. Motion & Animation Standards (GSAP / Framer Motion)

All state changes and entrances must be fluid. We will use `framer-motion` or GSAP for these interactions.

1.  **Never Snap Instantly:** Every form field change, button hover, and tab switch must have a smooth transition (minimum `0.3s ease-out`).
2.  **Staggered Entrances:** Do not load grids or lists all at once. Elements should stagger their entry (e.g., start at `opacity: 0, y: 20` and animate to `opacity: 1, y: 0` with a `0.05s` stagger), creating a cascading domino effect.
3.  **Spring Physics:** Use spring-based easing for opening modals or sliding panels.
4.  **Tactile Focus States:** Input fields should lift slightly on focus (`y: -2px`) while casting a focused glow, avoiding plain browser outlines.
5.  **Scroll Hijacking (Tasteful):** Use scroll-linked animations for landing pages (parallax, floating cards in isometric perspective) to create spatial depth.
6.  **Accessibility:** Always respect `prefers-reduced-motion: reduce` by disabling these effects for users who require it.

## 4. Typography

*   **Display / Headline:** Noto Serif (High-impact moments, section titles)
*   **Body / UI / Meta:** Plus Jakarta Sans (Reading, fields, metadata)
*   **Line-Height Constraint:** Maintain a `1.5x` line-height for body text to accommodate Spanish translation length cleanly.

## 5. Component Triggers & UX Architecture

*   **Landing Page:** Use Parallax hero sections. Background imagery moves slower than foreground text.
*   **Patient Dashboard:** Use pulsing state indicators for current tasks (scale animation looping 1.02 to 1.0).
*   **Login Screens:** The main logo/mark should have an infinite subtle vertical float. Inputs should stagger-fade in from bottom to top.
