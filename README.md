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
