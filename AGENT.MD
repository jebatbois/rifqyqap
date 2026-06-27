# agent.md - rifqy-portfolio Agent Guide

## Project Overview
A dynamic personal portfolio website for Rifqy, showcasing technical expertise in fullstack web development and **Machine Learning**. The project aims for a "simple but cool" tech aesthetic, prioritizing responsiveness, clean micro-interactions, and secure data management.

## Stack & Environment
- **Environment:** Ubuntu 24.04, VS Code.
- **Frontend:** Next.js (App Router), TypeScript.
- **Backend/Database:** Supabase (BaaS, PostgreSQL, Storage, Edge Functions).
- **Authentication:** Supabase Auth (for Admin access).
- **Styling:** Tailwind CSS.

## Design System & Style Guide
Ensure all generated UI components and modified code adhere strictly to this modern, 'tech-savvy' dark mode aesthetic:

- **Palette (Dark Mode Default):**
  - Primary Navy: ` Slate 900` (`#0F172A`) - Backgrounds.
  - Secondary Navy: ` Slate 800` (`#1E293B`) - Cards, secondary elements.
  - Accent Orange: ` Orange 500` (`#F97316`) - CTAs, highlights, glowing effects.
  - Accent Orange Hover: ` Orange 600` (`#EA580C`).
  - Text Primary: ` Slate 200` (`#E2E8F0`).
  - Text Secondary: ` Slate 400` (`#94A3B8`).

- **Key Design Principles:**
  - **Simple but Cool:** Minimalist typography, default Dark Mode, subtle 'glow' effects, smooth transitions.
  - **Glow Effects:** Use `shadow-accent-orange/30`, `hover:shadow-accent-orange/50`, and `blur-xl` sparingly for orange glowing borders and light sources.
  - **Interaction:** Cards must lift on hover (`hover:-translate-y-2`) and show glint layers.

- **Required Components:**
  - **Floating Pill Navbar:** Minimalist structure (Home, About, Projects, Contact, Admin), fixed top, glassmorphism blur (`backdrop-blur-md`). Dynamic dot active state.
  - **Minimalist Typographic Footer:** Signature text "Crafted with O by Rifqy" and minimalist Fa-series social icons.

## Project Structure (Next.js App Router)
Agents must respect this standard structure:

- `src/app/page.tsx` (Home): Hero, Tech Icons Marquee, "Offer" cards.
- `src/app/about/page.tsx` (About): Dynamic fetching for Skills (categorized), Experience (Timeline Tree), Certificates. Static Education.
- `src/app/projects/page.tsx` (Projects): Grid layout. Dynamic fetching. **Details open in a Modal Card** (not a new page).
- `src/app/contact/page.tsx` (Contact): Split-screen layout (Left: Form, Right: Social Cards). Direct Supabase insert to `messages`.
- `src/app/admin/page.tsx` (Admin): Protected by Supabase Auth (Sign-in form, Dashboard with Message Management priority).
- `src/components/` (Shared UI: Navbar, Footer).
- `src/lib/` (Supabase client initialization: `supabase.ts`).
- `public/` (Visual assets: profile image, Lottie JSON, icons).

## Supabase & Database Integration
Agents must follow these rules for database interaction:

### SQL Schema Guidelines:
Refer to the original SQL schema definitions for tables (`skills`, `experiences`, `certificates`, `projects`, `messages`). Use exact data types.

### Row Level Security (RLS) & Authentication:
- **Public Side (Anon Access):** RLS must restrict public access to `SELECT` (for viewing portfolio content) and `INSERT` (for submitting contact forms to the `messages` table).
- **Admin Side (Authenticated User):** RLS must require `auth.role() = 'authenticated'` for `INSERT`, `UPDATE`, `DELETE` operations on all tables, and for `SELECT` on the `messages` table.
- **Admin Authentication:** Implement only via Supabase Auth (Sign-in with email and password). No hardcoded passwords.

## Page-Specific Guidelines

### Home (`/`):
- **Hero:** Profile image (`public/profile.jpg`), Name, English tagline. *(Updated to reflect actual image used)*
- **Tech Icons Marquee:** Infinite scroll from `react-icons/si`. Pause on hover. Glow effect on tech icons.
- **"What Can I Offer" Cards:** Lottie animations discarded; use **Mouse-Follow Glow** and **Monospace Tech Keywords** version.

### Contact (`/contact`):
- Use the 2-column split layout (Left: Form, Right: Connect Cards). Focus on clean micro-interactions and live validation.

### Admin (`/admin`):
- The dashboard is the primary tool for managing portfolio data.
- The `messages` table management (Unread/Read status, Delete) is the highest priority feature for the Admin dashboard.

## Agent Constraints & Best Practices
- **Strict Adherence:** Maintain all existing Tailwind, TypeScript, and Supabase configurations. Do not modify root configs unless explicitly requested.
- **Language:** All user-facing content (About, taglines, project descriptions) must be in full English.
- **TypeScript Types:** Always use defined Interfaces for data fetching (e.g., `interface Project`, `interface Skill`).
- **Secret Protection:** Never commit `.env.local` to version control. Ensure it is in `.gitignore`. Ensure all secrets are accessed via `process.env`.
- **Bias for Code:** Prioritize editing code and maintaining the existing aesthetic over generating new visual assets unless explicitly instructed.