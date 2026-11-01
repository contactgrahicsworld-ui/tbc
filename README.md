# TBC — Tailik Business Committee Website

Production Next.js application with public website + full Admin Panel.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Prisma ORM · PostgreSQL (Neon) · Vercel Blob (photo uploads)

## Features

- Public site: home, chapters, members, events, resources, visitor pass,
  membership application, contact
- **Admin Panel** (`/admin`): dashboard, visitor requests (approve/reject +
  notes), membership applications, chapters & members CRUD, events with
  chapter assignment, testimonials, contact inquiries, admin user management,
  Excel export (all + chapter-wise), settings
- **Auth**: first-run admin setup (no hardcoded credentials), scrypt password
  hashing, httpOnly session cookies (7-day), forgot-password via 6-digit code
  on WhatsApp
- **Production hardening**: security headers, per-IP rate limiting on all
  public forms and auth endpoints, server-side input clamping, HSTS

## Quick start (local)

```bash
npm install
cp .env.example .env        # fill Postgres URL
npx prisma db push
npm run dev                 # http://localhost:3000
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) — Vercel + Neon Postgres + Vercel Blob.
Push to `main` = automatic production deploy.

## Structure

```
src/app/            # App Router pages + API routes
src/app/admin/      # Admin panel (client SPA behind session cookie)
src/app/api/        # Public + admin API routes
src/components/tbc/ # TBC UI components
prisma/schema.prisma# Database schema (PostgreSQL)
```
