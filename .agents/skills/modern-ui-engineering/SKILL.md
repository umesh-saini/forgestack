---
name: modern-ui-engineering
description: Expert guidelines and best practices for building world-class, accessible, and high-performance user interfaces using modern React 19, Tailwind CSS v4, Radix UI primitives, Lucide icons, and responsive design systems.
---

# Modern UI Engineering & Frontend Craftsmanship

This skill dictates the design, architecture, accessibility, and performance standards for all frontend UI components and interfaces.

## 1. Core Visual & Architectural Principles

1. **Design System & Token Architecture**:
   - Standardize on semantic design tokens for colors, spacing, typography, and elevations using Tailwind CSS v4 CSS variables.
   - Never hardcode arbitrary hex codes in components (e.g. avoid `bg-[#1a202c]`). Use semantic color scales (`bg-background`, `text-foreground`, `bg-muted`, `border-border`, `text-primary`).
   - Implement seamless dark/light theme switching with CSS class strategies (`.dark`) and CSS custom property toggles.

2. **Primitive-Driven Composition**:
   - Build complex interactive widgets (dialogs, dropdowns, tooltips, popovers, accordions, tabs) on top of headless, unstyled primitives (Radix UI, Headless UI, or native HTML `<dialog>`).
   - Use `clsx` and `tailwind-merge` via the standard `cn()` utility to support style overrides without specificity collisions:
     ```typescript
     import { clsx, type ClassValue } from 'clsx';
     import { twMerge } from 'tailwind-merge';

     export function cn(...inputs: ClassValue[]): string {
       return twMerge(clsx(inputs));
     }
     ```
   - Utilize Class Variance Authority (`cva`) for multi-variant components (e.g. `Button` with variant `default | destructive | outline | ghost` and size `sm | md | lg`).

3. **Accessibility (WCAG 2.1 AA Compliance)**:
   - Ensure all interactive elements have visible focus indicators (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`).
   - Every button or link without visible text MUST include an `aria-label` or `sr-only` description.
   - Maintain color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text.
   - Modals and dialogs MUST trap focus, close on Escape key, and restore focus to the trigger upon closing.
   - Forms must connect `<label>` to `<input>` via matching `htmlFor` and `id` attributes or explicit wrapping.

4. **Layout & Responsive Architecture**:
   - Mobile-first responsive design using Tailwind's standard breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).
   - Use CSS Grid and Flexbox with consistent gap utilities (`gap-4`, `gap-6`).
   - Employ modern container queries (`@container`) for reusable components whose styling depends on their card/parent width rather than viewport width.
   - Eliminate Cumulative Layout Shift (CLS) by specifying aspect ratios (`aspect-video`, `aspect-square`) and skeleton loaders (`animate-pulse`) for async content.

5. **Motion, Feedback & Micro-Interactions**:
   - Keep animations subtle, functional, and purposeful (150ms–300ms duration, standard easing `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Respect user accessibility preferences by honoring `motion-reduce:transition-none` and `motion-reduce:animate-none`.
   - Toast notifications must be non-intrusive, auto-dismissible, and provide actionable feedback via Sonner (`toast.success()`, `toast.error()`).

6. **State & Data Interaction**:
   - Separate presentational components from data-fetching hooks. Components receive props; custom hooks (e.g. TanStack Query `useQuery` / `useMutation`) manage server state.
   - Use optimistic UI updates with rollback mechanisms for instant user perception.
