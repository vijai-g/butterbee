# ButterBee (Next.js + TypeScript + Tailwind)

Fresh, fast, and tasty. This app includes Menu, Cart, Checkout, About, and Contact pages.
Cart persists to `localStorage`. WhatsApp floating button is included.

## Quick Start
```bash
# Node 18+ recommended
npm install
npm run dev
# open http://localhost:3000
```

## Pages
- `/` Home
- `/menu` Menu with search + category filter
- `/cart` Cart (with quantity controls)
- `/checkout` Checkout form (payment placeholder)
- `/about` About
- `/contact` Contact

## Tech
- Next.js App Router + TypeScript
- TailwindCSS
- `react-hot-toast` for toasts

## Customization
- Branding colors in `app/globals.css` as CSS variables
- Data at `data/products.json`
- Floating WhatsApp link in `components/FloatingWhatsApp.tsx`

## Notes
- Placeholder images are simple SVGs in `/public/images`.
- Replace `/public/og.png`, `/public/favicon.ico` as needed.
