# ButterBee (Next.js + TypeScript + Tailwind) — Polished

Includes:
- Proper metadata (canonical, OG/Twitter, icons)
- JSON‑LD (FoodEstablishment)
- Friendly 404 & error pages
- robots with preview safety
- sitemap with canonical URLs
- Security headers
- Client-only providers to avoid Server/Client mixups
- Cart, search, category filters, WhatsApp checkout

## Local dev
```bash
nvm use 20
npm i
npm run dev
```
Set your canonical domain in `.env.local`.

## Build
```bash
npm run build && npm start
```

## Deploy (Vercel)
- Framework: Next.js
- Root: this folder
- Add domain/subdomain in Project → Settings → Domains
- GoDaddy: CNAME `butterbee` → `cname.vercel-dns.com`


## Auth + Neon (added)
- Run `npm i`
- `npx prisma migrate dev --name init` (or `npx prisma db push`)
- `node scripts/make-users.mjs`
- Set envs on Vercel and use `npm run vercel-build`


## Environment variables
Create `.env.local` (or copy `.env.example`):

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...long random string...
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WA_PHONE=8825755675
```

On Vercel, set the same keys in **Project → Settings → Environment Variables**.
