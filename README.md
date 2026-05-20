# Pop's Woodshop

A rustic, farmhouse-style marketplace site for a family woodworking business. Customers browse
handmade pieces and submit **custom order requests** — there's no checkout. Each request is saved to
Supabase and the shop is notified instantly by **SMS (Twilio)**.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4**.

---

## How it works

1. Customer browses the gallery (`/products`) and category pages.
2. From a product page or the nav, they open the **Custom Order** form (`/custom-order`).
3. On submit, a **server action** (`src/app/actions/submit-order.ts`):
   - validates the fields (`src/lib/validation.ts`),
   - uploads the optional inspiration photo to Supabase Storage,
   - inserts the request into the `woodworking_orders` table,
   - sends the shop an SMS with every detail (Twilio),
   - redirects to a confirmation page (`/confirmation`).

Orders are saved **before** the SMS is sent, so a Twilio hiccup never loses a lead.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

The site builds and runs **without** env vars configured — the form will validate and reach the
confirmation page, but it won't persist or text anything (it logs a clear warning). Wire up the env
vars below to enable the full flow.

---

## Environment variables

See `.env.example`. All are **server-only** (no `NEXT_PUBLIC_` prefix).

| Variable | What it is |
| --- | --- |
| `SUPABASE_URL` | Your dedicated PopsShop project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (secret — bypasses RLS, server only) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_FROM_NUMBER` | A Twilio number you own (E.164, e.g. `+15551234567`) |
| `BUSINESS_PHONE` | Where order texts go — the shop's mobile (E.164) |
| `NEXT_PUBLIC_SITE_URL` | (optional) Canonical site URL, for absolute OG image links |

---

## Supabase setup

> ⚠️ Use a **dedicated PopsShop project** — not the Ten-Eight/FleetManage project.

1. Create a new project at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/0001_woodworking_orders.sql`
   (SQL Editor → paste → run, or `supabase db push` with the CLI). It creates:
   - the `woodworking_orders` table (RLS enabled, no public policies — access is server-side via the
     service-role key or the dashboard),
   - the public `order-photos` storage bucket for inspiration photos.
3. Copy **Project URL** and the **service_role key** (Project Settings → API) into your env vars.

To review incoming orders, use the Supabase **Table Editor** on `woodworking_orders` (or build an
authenticated admin view later).

## Twilio setup

1. Create a Twilio account and buy/verify an SMS-capable number.
2. Put the SID, auth token, and your Twilio number in the env vars.
3. Set `BUSINESS_PHONE` to the mobile that should receive order texts.

> While on a Twilio trial, you can only text **verified** numbers — verify the shop's number first.

---

## Editing the catalog

Products and categories live in `src/data/products.ts` (static — every piece is made to order, so
there's no live inventory). To add a piece:

1. Drop a web-ready photo in `public/images/products/`.
2. Add a `Product` entry pointing at it, with a `category` of
   `tables | shelves | signs | cutting-boards | custom`.
3. Set `featured: true` to surface it on the home page.

**Cutting Boards** currently has no catalog photo, so its category renders as a "made to order" card.
Drop a `cutting-boards-*.jpg` in the products folder and add an entry to populate it.

Business name, tagline, and contact info are in `src/data/site.ts`.

---

## Deploy to Vercel

1. Push to GitHub (`ReelistikDev/PopsShop`).
2. Import the repo in Vercel (framework auto-detects as Next.js).
3. Add all env vars in **Project → Settings → Environment Variables**.
4. Deploy. Add a custom domain when ready.

---

## Project structure

```
src/
  app/
    layout.tsx                       # fonts, metadata, header/footer
    page.tsx                         # home
    products/page.tsx                # gallery overview
    products/[category]/page.tsx     # category listing
    products/[category]/[slug]/page.tsx  # product detail / order request
    custom-order/page.tsx            # custom order form
    confirmation/page.tsx            # success page
    actions/submit-order.ts          # server action: validate → upload → save → SMS → redirect
  components/                        # header, footer, cards, order form
  data/                              # site config + product catalog
  lib/                               # supabase admin, twilio, zod validation
supabase/migrations/                 # woodworking_orders + storage bucket
public/images/products/              # curated product photos
```
