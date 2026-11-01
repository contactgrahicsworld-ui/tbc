# 🚀 TBC Website — Production Deployment

Ye website **live hai on Vercel** with: Neon PostgreSQL (Vercel Marketplace) +
Vercel Blob (photo storage) + GitHub auto-deploys.

## Current production setup

| Piece | Value |
|---|---|
| Hosting | Vercel — project **`tbc`** (team `iproup`) |
| Database | **Neon Postgres** — resource `tbc-db` (free plan, auto-connected) |
| Photo storage | **Vercel Blob** — store `tbc-blob` (`tbc-uploads/*` path) |
| Repo | `github.com/contactgrahicsworld-ui/tbc` (branch `main`) |

Database env vars (`POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `DATABASE_URL`, …)
**automatically inject** hote hain Neon connection se — sab environments
(production/preview/development) ke liye.

## Deploy kaise hota hai

- **Git push = auto deploy.** `main` branch par push karo → Vercel production
  par naya deploy chal jayega.
- Manual CLI deploy: `npx vercel --prod --scope iproup`

## Schema change karna ho to

```bash
# .env.local me POSTGRES_URL_NON_POOLING already hai (vercel env pull)
export POSTGRES_URL=$(grep '^POSTGRES_URL_NON_POOLING=' .env.local | cut -d= -f2- | tr -d '"')
npx prisma db push
```

## Admin panel (pehli baar)

1. `https://<your-app>.vercel.app/admin` kholo
2. Pehli visit par **"Create Admin Account"** setup aayega
   (naam, email, WhatsApp number, password — min 8 chars)
3. **Koi default/hardcoded credential nahi hai** — sirf aap banate ho
4. Password bhool gaye? Login page → **Forgot password?** → 6-digit code aapke
   WhatsApp par (wa.me link se khud bhej sakte ho, ya Admin Panel → Settings
   me WhatsApp Cloud API daal do to automatic)

## Notes

- **Sessions**: 7 din tak valid, phir auto-logout
- **Rate limits**: public forms 10 req/min, admin auth 5–10 req/5min per IP
- **Excel export**: Admin Panel → Excel Export → All ya chapter-wise
- **Local dev**: `npm run dev` (`.env.local` me Neon dev credentials hain —
  `vercel env pull` se aate hain)
