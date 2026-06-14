# Italica — Luxury Lingerie E-Commerce

A full-stack e-commerce app built to run a live A/B test comparing two discovery paths: semantic search vs. an AI-powered Gift Helper. The hypothesis: users who pick a mood (Sleep / Sexy / Na codzień) reach their first product faster than users who type a search query.

**Live:** deployed on Vercel · analytics in Amplitude · data in Supabase

---

## A/B Test Architecture

Vercel middleware assigns every visitor to group A or B (50/50, cookie-persisted).

| Group | Discovery path | Key event tracked |
|-------|---------------|-------------------|
| **A** | Search icon → semantic query → results | `search_query_entered` |
| **B** | Gift Helper → mood button → recommendations | `gift_helper_mood_clicked` |

Both paths track `product_detail_viewed` with a `ttfp_source` property, allowing comparison of Time To First Product between groups.

---

## Tech Stack

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui

**Backend / Data**
- Supabase (PostgreSQL + pgvector)
- ~1 000 products seeded from a real dataset, enriched with Claude Batch API
- 384-dimensional embeddings via Supabase AI (`gte-small` model)
- Supabase Edge Function (`/functions/v1/embed`) for real-time query embedding
- `match_products` SQL function for vector similarity search (cosine, threshold 0.4)

**Analytics**
- Amplitude Analytics + Session Replay
- Custom event schema: search, Gift Helper, product views, cart, checkout
- A/B group set as Amplitude user property on every session

**Infrastructure**
- Vercel (frontend + serverless API route for Anthropic)
- GitHub Actions — cron synthetic testing
- Vercel middleware for A/B group assignment + deployment protection bypass

---

## Synthetic Testing

To seed the A/B test with realistic data while the app is pre-launch, a Playwright script runs on GitHub Actions and simulates 5 user personas:

| Persona | Behaviour |
|---------|-----------|
| `first_visit` | Browses slowly, leaves without buying |
| `premium_skeptic` | Reads everything, abandons at checkout price |
| `gift_buyer` | Uses Gift Helper, buys after recommendations |
| `power_shopper` | Searches precisely, converts fast |
| `loyal_customer` | Skips search, goes straight to category, completes order |

Each persona is randomly assigned to group A or B by the same middleware that real users hit. The script runs every 25 minutes (08:00–23:00) and flushes Amplitude events before closing the browser.

---

## Semantic Search

1. User types a query → 400 ms debounce
2. Frontend calls Supabase Edge Function with the raw text
3. Edge Function embeds the text with `gte-small` (384 dims)
4. `match_products` RPC compares against stored product embeddings
5. Top 8 results returned by cosine similarity

Gift Helper uses the same pipeline — a mood maps to a Polish-language query string which is embedded and matched against the catalogue.

---

## Key Files

```
middleware.ts                          # A/B group assignment (Vercel Edge)
src/
  hooks/useSemanticSearch.ts           # Search query → Edge Function → results
  hooks/useABGroup.ts                  # Read ab_group cookie in React
  lib/amplitude.ts                     # Event tracking + Session Replay init
  lib/anthropic.ts                     # Gift Helper recommendations (embed + match_products)
  components/GiftHelper.tsx            # Mood selection UI + recommendation cards
  pages/Category.tsx                   # Server-side paginated product grid
api/
  recommendations.ts                   # Vercel serverless — Anthropic fallback (rate-limited)
supabase/
  functions/embed/index.ts             # Edge Function — text → embedding
scripts/
  seed-products.ts                     # Dataset → Claude Batch API → Supabase
  generate-embeddings.ts               # Products → pgvector embeddings
  playwright/
    run-personas.ts                    # Orchestrator (2–3 personas per run)
    personas/                          # 5 persona scripts
```

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your keys
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Required environment variables (see `.env.example`):

| Variable | Where to get it |
|----------|----------------|
| `VITE_SUPABASE_URL` | Supabase project settings |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase project settings (anon key) |
| `VITE_AMPLITUDE_API_KEY` | Amplitude → Settings → Projects |

---

## Running Synthetic Personas Locally

```bash
cd scripts/playwright
npm install
TARGET_URL=https://your-vercel-url.vercel.app npx ts-node run-personas.ts
```
