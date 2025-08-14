# ButterBee (Next.js + TypeScript + Tailwind)

Yellow-themed takeaway site with cart, search, category filters, and WhatsApp checkout.

## Run locally

```bash
# 1) Install deps
npm i

# 2) Start dev
npm run dev

# 3) Build for prod
npm run build && npm start
```

## Project highlights

- Next.js App Router + TypeScript
- Tailwind CSS (brand colors in `tailwind.config.ts`)
- Components: Header, Footer, ProductCard, FloatingWhatsApp, CategoryFilter
- Cart with badge + localStorage persistence (see `lib/cart.tsx`)
- Search + Category filter on Menu
- Toast notifications via `react-hot-toast`
- SEO metadata in `app/layout.tsx`
- Products in `data/products.json`
- Public images under `public/images`

## Deploy to Vercel

1. Create a GitHub repo and push this project.
2. In Vercel, **New Project** → import your repo.
3. Framework preset: **Next.js**. Keep default build command (`next build`) & output.
4. Deploy.

### Connect your GoDaddy domain

1. In Vercel: **Settings → Domains → Add** your domain (e.g., `butterbee.in`).
2. Vercel will show DNS records. For GoDaddy:
   - Create an **A** record for `@` pointing to Vercel's apex IPs shown.
   - Or use a **CNAME** for `www` → `cname.vercel-dns.com.`
3. Wait for DNS to propagate. Vercel will auto-issue SSL.

> Tip: If you want root (apex) and `www` both working, set the apex with A records and `www` with CNAME.

## Customize

- Update WhatsApp number from `components/FloatingWhatsApp.tsx` and in `app/checkout/page.tsx`.
- Add/modify products at `data/products.json` (fields: id, name, description, price, image, category, tags, available).
- Replace `public/logo.svg` and `public/favicon.svg` with your own assets.
- Edit brand colors in `tailwind.config.ts`.

## Future payments

Replace the placeholder flow in `app/checkout/page.tsx` with Razorpay/PhonePe buttons or serverless functions for UPI links.
