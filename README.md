# Ritkalp — Multi-Festival Puja Kits Website

A Next.js site that sells complete puja kits for **multiple festivals**
(Navratri, Diwali, Holi — more addable later) from one codebase, with a
real e-commerce backend: guest + optional customer accounts, a Kit
Builder (build-your-own kit, tap-to-add extras with a live price), an
admin panel for managing orders and the catalog, Razorpay online
payments, and email notifications. The original WhatsApp order flow
still works alongside online payment — nothing about it was removed.

Everything ships as one Next.js app on **Vercel** — no separate backend
host needed. See **Deploy to Vercel** below.

## Architecture at a glance

| Layer | What it is |
|---|---|
| Storefront copy (theme colors, hero text, the 9-day guide's significance/vidhi/mantra, About page) | Still plain code, one file per festival — `lib/festivals/*.ts`. Editorial content, not something an admin CRUD should touch. |
| Catalog (kits, day-kits, Kit Builder extras — prices, items, stock) | **Database**, admin-editable at `/admin/catalog`. Seeded once from the original `lib/festivals/*.ts` content (`npm run db:seed`) so nothing was retyped. |
| Orders, customers, admin accounts | Database (Postgres via [Prisma](https://www.prisma.io)). |
| Auth | [Auth.js](https://authjs.dev) — separate optional customer accounts and required admin accounts, both plain email/password. |
| Payments | [Razorpay](https://razorpay.com) — Orders API + Checkout.js, confirmed server-side via signature verification and a webhook (never trusts the browser alone). |
| Email | [Resend](https://resend.com) — order confirmation to the customer, new-order alert to the business owner. Without an API key it just logs instead of sending, so local dev works before you set one up. |

## Local dev setup

**1. Install a local Postgres** (one-time — this repo's dev database
lives on your own machine, separate from production):

```bash
brew install postgresql@16
brew services start postgresql@16
/opt/homebrew/opt/postgresql@16/bin/createdb ritkalp_dev
```

**2. This project needs Node 20+** (Prisma's requirement). If your
default `node -v` is older, install one alongside it without touching
your system Node:

```bash
brew install node@20
```

Then prefix commands with its `bin` dir, e.g.:

```bash
PATH="/opt/homebrew/opt/node@20/bin:$PATH" npm install
```

(`.claude/launch.json` and this README's commands already assume that
PATH prefix where it matters.)

**3. Install dependencies and set up the database:**

```bash
npm install
npm run db:migrate     # creates all tables (prisma/schema.prisma)
npm run db:seed        # loads the real kits/day-kits/builder-extras
                        # from lib/festivals/*.ts into the database
```

**4. `.env` is already filled in for local dev** (gitignored — never
committed). It points `DATABASE_URL` at the local Postgres above and
leaves Razorpay/Resend keys blank, which is fine: those features
gracefully no-op (clear error message / console log) until configured.
See `.env.example` for what every variable does.

**5. Create your admin login:**

```bash
npm run admin:create -- you@example.com "a-strong-password" "Your Name" OWNER
```

**6. Run it:**

```bash
npm run dev
```

Open **http://localhost:3000** (redirects to the in-season festival, or
visit `/navratri`, `/diwali`, `/holi` directly) and **http://localhost:3000/admin**
for the admin panel.

## Setting up payments & email for real

These aren't required for local dev (see above) — only before you want
real payments/emails to actually go out.

**Razorpay** (Dashboard → Settings → API Keys):
1. Sign up at [razorpay.com](https://razorpay.com). Test-mode keys work
   immediately, no business KYC needed — good enough to fully test the
   payment flow before your business verification is approved.
2. Copy the Key ID and Key Secret into `RAZORPAY_KEY_ID`,
   `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` (same value
   as the Key ID).
3. Dashboard → Settings → Webhooks → add one pointing at
   `https://<your-domain>/api/webhooks/razorpay`, event
   `payment.captured`. Copy its Secret into `RAZORPAY_WEBHOOK_SECRET`.
4. Before going **live** (not test mode), Razorpay requires your site
   to have Terms of Service, Privacy Policy, and a Refund/Cancellation
   Policy page — ask for these to be added when you're ready.

**Resend** (email):
1. Sign up at [resend.com](https://resend.com), verify a sending domain
   (or use their onboarding domain for testing).
2. Copy the API key into `RESEND_API_KEY`.
3. Set `EMAIL_FROM` to a verified sender address, and
   `BUSINESS_NOTIFY_EMAIL` to the inbox that should get new-order alerts.

## Deploy to Vercel

1. Push this project to a GitHub repository, then import it at
   [vercel.com/new](https://vercel.com/new).
2. **Add environment variables** (Project Settings → Environment
   Variables) — every one listed in `.env.example`:
   - `DATABASE_URL` — a [Neon](https://neon.tech) Postgres connection
     string (free tier is plenty to start). Create a project there, run
     `npm run db:migrate` once locally against it (temporarily point
     `.env`'s `DATABASE_URL` at it) to create the tables, then
     `npm run db:seed` and `npm run admin:create` the same way.
   - `AUTH_SECRET` — generate with `openssl rand -base64 32`.
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
     / `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RESEND_API_KEY`, `EMAIL_FROM`,
     `BUSINESS_NOTIFY_EMAIL` — see above.
3. Deploy. Vercel auto-detects Next.js; `npm run build` already runs
   `prisma generate` first, so no extra build config is needed.
4. Every push to the connected branch redeploys automatically.

## Inventory model

Ritkalp used to track stock as a single admin-toggled boolean
(`inStock`) with no real quantity anywhere, enforced nowhere at
checkout — a stale page could still successfully order something
already hidden from the storefront. Real stock/price tracking is now handled by **Inventoryfy** (a separate
multi-tenant inventory system, `../Inventoryfy` alongside this repo),
which Ritkalp connects to as a client — the same way an independent
e-commerce site would connect to any third-party inventory platform
(Zoho Inventory, etc.). The integration lives on Inventoryfy's side as
a generic, platform-agnostic contract (its own README's "Integrations
model" section) — nothing about it is Ritkalp-specific.

- **What moved, and what didn't.** Presentation (name, description,
  image, item ordering, festival grouping, featured/badge, the whole
  day-guide) is still 100% Ritkalp's own data, editable exactly as
  before. Only *commercial truth* — price and real stock quantity —
  moved to Inventoryfy. `Item`, `BuilderExtraItem`, and `Kit` each
  gained an `inventoryfySku` field and now mirror Inventoryfy's price +
  stock (`price`/`stock` columns), refreshed by webhook — the admin
  catalog forms show these read-only ("managed in Inventoryfy") once a
  row is linked, rather than letting an edit here get silently
  overwritten by the next webhook.
- **Kits are real bundles, not a separate concept.** A `Kit` maps to an
  Inventoryfy bundle Product; its `KitLineItem`s map 1:1 to
  `BundleComponent`s pointing at each component `Item`'s own
  Inventoryfy product. Since the same samagri `Item` (कलश, नारियल, ...)
  is already deduplicated per-festival in Ritkalp's own schema
  (`@@unique([festivalSlug, name])`), each one is genuinely *one* real
  Inventoryfy SKU with one real stock count shared correctly across
  every kit that includes it — buying one kit correctly drops the
  displayed availability of every *other* kit sharing that component
  too, not just the one purchased.
- **`scripts/sync-inventoryfy.ts`** is the one-time (idempotent,
  re-runnable) link: creates a real Inventoryfy product for every
  not-yet-synced `Item`/`BuilderExtraItem`/`Kit` (skips anything that
  already has an `inventoryfySku`), allocates its starting stock into
  Inventoryfy's warehouse for real (see the comment on why `POST
  /products`'s own `stock` field alone isn't enough — it's
  "Unallocated" until a warehouse adjustment actually moves it there,
  or a real order against that warehouse backorders instead of
  fulfilling), and writes the generated SKU back into the local row.
  Also registers Ritkalp's `IntegrationConnection` (API key + webhook
  secret) the first time it runs, writing both straight into `.env`.
  Run with `npm run sync:inventoryfy` any time after adding new catalog
  content.
- **`app/api/webhooks/inventory/route.ts`** receives Inventoryfy's
  signed `inventory.updated` events (price *or* stock changed) and
  updates the matching row by `inventoryfySku` — same raw-body HMAC
  verification pattern as `app/api/webhooks/razorpay/route.ts`.
- **`createOrderFromCart()` (`lib/orders.ts`) now actually calls
  Inventoryfy** before creating the local `Order` — every resolved
  cart line becomes a real SKU quantity sent to
  `POST /integrations/v1/orders`, and the local order only gets created
  once Inventoryfy accepts. A canonical kit line is one SKU; a custom
  Kit Builder combo is *decomposed* into several — its base kit's SKU
  plus each tapped-on extra's SKU — since there's no single Inventoryfy
  product for an ad-hoc combo. Both the base kit and every extra are
  now also re-priced server-side from their real (Inventoryfy-mirrored)
  DB prices, closing what used to be the one gap in this file's price
  re-verification: a custom combo's `unitPrice` used to be trusted
  as-is from the client.
- **Stale-order stock release.** Stock is decremented at
  checkout-intent time, before payment completes (true for both the
  WhatsApp and Razorpay flows, and was already true before this
  integration — see `app/api/payment/create-order/route.ts`'s
  comments), so an abandoned/failed Razorpay payment would otherwise
  leave real stock locked up in Inventoryfy forever.
  `app/api/cron/release-stale-orders/route.ts` — scheduled via
  `vercel.json` (default every 15 minutes; **check your Vercel plan's
  cron frequency limits**, the Hobby tier has historically been more
  restrictive than Pro) — finds `ONLINE_PAYMENT` orders still `UNPAID`
  past `STALE_ORDER_MINUTES` (default 30) and cancels them through
  Inventoryfy's new `POST /integrations/v1/orders/cancel`, which
  restores stock the same way cancelling from inside Inventoryfy
  itself would. **Deliberately scoped to `ONLINE_PAYMENT` only** — a
  WhatsApp order staying `UNPAID` is completely normal (the business
  collects payment separately, COD/UPI) and must never be touched by
  this job; it isn't. Protected by `CRON_SECRET` (Vercel sends it
  automatically as a Bearer token on scheduled invocations once that
  env var is set) — runs unauthenticated with a console warning if
  unset, which is fine for local testing
  (`curl http://localhost:3000/api/cron/release-stale-orders`) but not
  for a real deployment.

## How it's organized

### Storefront content — one file per festival

| File | What it controls |
|---|---|
| [`config/business.ts`](config/business.ts) | WhatsApp number, business name, Instagram link — shared across every festival. |
| [`lib/festivals/navratri.ts`](lib/festivals/navratri.ts) | Navratri's theme colors, hero copy, 9-day guide, About page copy. Real content. |
| [`lib/festivals/diwali.ts`](lib/festivals/diwali.ts) / [`holi.ts`](lib/festivals/holi.ts) | Same shape, drafted content — search for `TODO_REVIEW`. |
| [`lib/festivals/registry.ts`](lib/festivals/registry.ts) | The list of festivals, and which one `/` defaults to by month. |
| [`lib/festivals/types.ts`](lib/festivals/types.ts) | The `FestivalConfig` shape every festival file fills in. |

Kit/day-kit/builder-extra **prices and item lists** used to live in
these files too — they've moved to the database (admin-editable). The
files above still hold the copy text around them (section headings,
intro paragraphs) and the day-guide's actual religious content.

### Database — `prisma/schema.prisma`

- `Kit` — curated "Shop Kits" and auto-generated day-kits, one table,
  distinguished by `kind`.
- `BuilderExtraCategory` / `BuilderExtraItem` — the Kit Builder's
  tap-to-add extras.
- `Customer` / `Address` — optional accounts; guest checkout never
  creates one automatically, only signup does.
- `Order` / `OrderItem` — every order, WhatsApp or paid, with a snapshot
  of what was actually bought (name/price/items at order time, so later
  catalog edits don't rewrite history).
- `Admin` — staff logins for `/admin`, role `OWNER` or `STAFF`.

### App routes

```
app/
  [festival]/              — the public storefront (Hero, Kit Builder, Kits, DayGuide, ...)
  account/                 — optional customer signup/login/order-history
  admin/                   — staff-only: dashboard, orders, catalog, customers
  api/
    orders/                 — WhatsApp-flow order recording
    payment/create-order/   — starts a Razorpay payment
    payment/verify/         — client-side payment confirmation (fast path)
    webhooks/razorpay/      — server-to-server payment confirmation (source of truth)
    auth/[...nextauth]/     — Auth.js
lib/
  festivals/                — storefront copy + types (see above)
  catalog-db.ts             — DB → same shapes the storefront components already expect
  orders.ts                 — order creation + payment confirmation, shared by every order path
  auth.ts / auth.config.ts  — Auth.js config (split for Edge-runtime-safe middleware)
  razorpay.ts / email.ts    — Razorpay/Resend clients, lazy — no crash if unconfigured
  actions/                  — Server Actions (customer auth, admin auth, admin catalog/orders)
components/
  admin/                    — admin panel forms/badges
  KitBuilder.tsx             — the build-your-own-kit centerpiece
  CartDrawer.tsx             — cart → checkout → Pay Online (Razorpay) or WhatsApp
prisma/
  schema.prisma              — the full DB schema
  seed.ts                    — one-time migration from lib/festivals/*.ts into the DB
scripts/create-admin.ts     — CLI to create/reset an admin login
middleware.ts               — gates /admin/** behind an admin session
```
