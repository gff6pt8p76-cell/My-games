# ScentNest — Bottled Luxury

Storefront for ScentNest, a Lebanese house of inspired fragrances. Black and white with a champagne-gold accent, motion throughout, cash-on-delivery checkout.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lenis smooth scroll · Supabase (Postgres) · deploys on Vercel.

The site works **before** Supabase is connected: it reads the bundled catalog in `lib/catalog.ts`, and orders show the confirmation screen without being stored. Once the environment variables are set, everything reads from and writes to Supabase automatically.

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # fill in later; the site runs without it
npm run dev                  # http://localhost:3000
```

## 2. Connect Supabase (about 5 minutes)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: paste and run `supabase/migrations/0001_init.sql` (tables, triggers, row-level security).
3. Run `supabase/seed.sql` in the same way to load all 22 products.
4. **Project Settings → API**: copy the Project URL, the `anon` public key and the `service_role` key into `.env.local`:

   | Variable | Where |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key (**server only, never commit**) |
   | `NEXT_PUBLIC_SITE_URL` | final domain, e.g. `https://scentnest.com` |
   | `NEXT_PUBLIC_WHATSAPP` | WhatsApp number, digits only, e.g. `96170123456` |
   | `NEXT_PUBLIC_INSTAGRAM` | Instagram profile URL |

With the Supabase CLI instead: `supabase link --project-ref <ref>`, then `supabase db push`, then `psql "$DB_URL" -f supabase/seed.sql`.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In [vercel.com/new](https://vercel.com/new), import the repo. The framework is detected as Next.js; keep the defaults.
3. Add the same six environment variables under **Settings → Environment Variables** (Production and Preview).
4. Deploy, then add the custom domain under **Settings → Domains**.

The Supabase integration in the Vercel Marketplace can also fill in the Supabase variables automatically.

---

## Running the shop day to day (Supabase dashboard → Table Editor)

- **Orders** → `orders`. New orders arrive with `status = pending`. Call the customer, then move them to `confirmed` → `out_for_delivery` → `delivered` (or `cancelled`).
- **Prices and sizes** → `products.sizes`, for example `[{"ml":30,"price":15},{"ml":50,"price":22},{"ml":100,"price":35}]`.
- **Hide a product** → set `active = false`.
- **Homepage hero and signature gallery** → `featured = true`. **Bestseller badge** → `bestseller = true`. **Order** → `sort`.
- **New product** → add a row. For the image, upload to Supabase Storage (a public bucket) and paste the public URL into `image_url`, or add a file to `public/products/` and use `/products/name.webp`.
- **Newsletter sign-ups** → `subscribers`. **Contact form** → `contact_messages`.

Changes appear on the live site within 5 minutes (`revalidate = 300` in `app/layout.tsx`).

## Project map

```
app/
  page.tsx               Home: hero, marquee, pinned signature gallery, him/her split,
                         scent finder, bestsellers, philosophy, how it works, FAQ, CTA
  shop/                  Catalog with filters, search and sort
  products/[slug]/       Product page: size picker, notes, WhatsApp order, related
  checkout/              Cash-on-delivery checkout and confirmation
  about/ faq/ contact/ policies/
  actions.ts             Server actions: placeOrder (re-prices on the server), subscribe, sendMessage
  template.tsx           Page transition
components/              Header, bag drawer, footer, preloader, motion primitives, cards…
lib/
  catalog.ts             Bundled product data (source for seed.sql)
  products.ts            Reads Supabase, falls back to catalog.ts
  site.ts                Brand settings, regions, nav, delivery fee
supabase/
  migrations/0001_init.sql
  seed.sql               Regenerate with `npm run seed:sql` after editing catalog.ts
public/products/         Product photos (WebP)
```

## Design notes

- **Palette:** ink `#0A0A0A`, bone `#F5F3EF`, gold `#C8A96A` (`tailwind.config.ts`).
- **Type:** Bodoni Moda (display) and Geist (text), loaded through `next/font`.
- **Arch frame:** product images sit in a domed arch that echoes the shoulder of the ScentNest bottle. The photos have white backgrounds and use `mix-blend-multiply` so they blend into the bone panels.
- **Motion:** intro loader (once per session), word-mask headline reveals, curtain image reveals, parallax, a pinned horizontal gallery, magnetic buttons, shared-layout filter pills, an animated bag drawer and route transitions. Everything respects `prefers-reduced-motion`.

## To confirm with the owner before launch

- [ ] Real **prices** for each size (placeholders: 30 ml $15, 50 ml $22, 100 ml $35).
- [ ] **WhatsApp number** and **Instagram** link.
- [ ] **Delivery fee** (`site.deliveryFee` in `lib/site.ts`, currently free) and delivery times (the copy says 2 to 4 business days).
- [ ] Product **names**. Each scent has an original ScentNest name plus "Inspired by …". Rename freely in Supabase.
- [ ] Concentration wording ("Eau de parfum" tag, "rich in perfume oil") and the returns policy in `app/policies/page.tsx`.
- [ ] Final domain for `NEXT_PUBLIC_SITE_URL` (used for SEO, the sitemap and social previews).
