# ODEJ Platform — Eco-Efficiency Practices

**Purpose:** Checklist of green-technology choices for ECOHACK '26 and long-term operations.  
**Principle:** *Innovate without inflating the carbon footprint* — minimal compute, small payloads, efficient clients.

---

## 1. Architecture & infrastructure

| Practice | Status | Description |
|----------|--------|-------------|
| **Single-page application (SPA)** | ✅ Implemented | One app shell; navigation without full page reloads from server |
| **Static frontend hosting** | 📋 Production | Build `dist/` served from CDN / edge cache — no Node server per page view |
| **Right-sized API** | 📋 Planned | REST + Edge Functions; no always-on heavy microservices for CRUD |
| **PostgreSQL over document bloat** | 📋 Planned | Relational data with indexes; avoid storing duplicate large JSON blobs |
| **Dev: Supabase** | 📋 Planned | Managed Postgres for fast development; migrate when scale/sovereignty requires |
| **Prod: Private PostgreSQL** | 📋 Future | Self-hosted or wilaya-controlled VPS — predictable resources, data residency |
| **Avoid over-engineering** | ✅ Policy | Use SQL queries before ML; use CMS before custom pipelines |

---

## 2. Network & API efficiency

| Practice | Status | Description |
|----------|--------|-------------|
| **Pagination** | ✅ Implemented | Lists (events, news, training) load 12–15 items per request |
| **Lean JSON responses** | ✅ / 📋 | List endpoints return summary fields only; detail on separate GET |
| **HTTP caching** | 📋 Production | `Cache-Control` on public catalog; TanStack Query `staleTime` on client |
| **Compression** | 📋 Production | Brotli/gzip on CDN and API |
| **Batch invalidation** | ✅ Implemented | React Query invalidates only affected keys after mutations |
| **No polling by default** | ✅ Policy | Refetch on focus or user action—not 1s interval timers |
| **Debounce search** | 📋 Planned | Wait 300ms before search API calls |

---

## 3. Frontend & client energy

| Practice | Status | Description |
|----------|--------|-------------|
| **TanStack Query cache** | ✅ Implemented | Reuse data across components; fewer network round-trips |
| **Route-based code splitting** | 📋 Planned | `React.lazy()` for `/admin`, `/club`, heavy charts |
| **Tree-shaking build** | ✅ Implemented | Vite production build drops unused code |
| **Minimal dependencies** | ✅ Ongoing | Prefer native APIs; audit `package.json` regularly |
| **Leaflet + OSM maps** | ✅ Implemented | Lighter than heavy proprietary map SDKs |
| **SVG wilaya map** | ✅ Implemented | Vector map vs large raster tile sets for Algeria overview |
| **Lazy-loaded images** | 📋 Planned | `loading="lazy"` on cards and article bodies |
| **Responsive images** | 📋 Planned | `srcset` / WebP for institution and event photos |
| **Dark mode option** | 📋 Planned | OLED-friendly; reduces display power on mobile (user choice) |
| **Reduced motion** | 📋 Planned | Respect `prefers-reduced-motion` for animations (Framer Motion) |
| **No autoplay video heroes** | ✅ Policy | Static images or user-started media only |

---

## 4. Media & assets

| Practice | Status | Description |
|----------|--------|-------------|
| **Official logo asset** | ✅ Implemented | Single `odej-logo.png`; optimize to ≤100 KB for favicon variant |
| **Compress uploads** | 📋 Admin | Max dimensions + WebP conversion on upload (Supabase Storage trigger) |
| **PDF agreements** | ✅ Implemented | Club uploads PDF only when needed—not embedded in every API response |
| **Icon system** | ✅ Implemented | Lucide icons (tree-shaken) vs heavy icon font packs |
| **Self-hosted fonts** | 📋 Optional | Subset Cairo font to Arabic/Latin used glyphs only |

---

## 5. AI chatbot (planned) — green AI

| Practice | Description |
|----------|-------------|
| **RAG, not open chat** | Answers only from approved ODEJ knowledge base |
| **Cache frequent questions** | Store top 50 Q&A pairs; zero LLM call on exact match |
| **Short context** | Retrieve top 3–5 chunks, not entire website |
| **Rate limiting** | e.g. 20 questions/hour per user — prevents abuse and GPU waste |
| **No LLM on page load** | Chatbot loads only when user opens widget |
| **Escalate to humans** | Khilya / contact links instead of long generated replies |
| **Smallest viable model** | Use efficient hosted model or local embedder where possible |
| **Log for improvement** | Anonymized question clusters → admins update FAQ (fewer repeat LLM calls) |

---

## 6. Database & storage

| Practice | Description |
|----------|-------------|
| **Indexes on filters** | `status`, `wilaya_code`, `start_date` for list queries |
| **Archive old events** | Move past events to `archived` partition — smaller hot tables |
| **Storage lifecycle** | Delete orphaned media; compress images in bucket |
| **Connection pooling** | PgBouncer on private Postgres — fewer idle connections |
| **Avoid N+1 queries** | Join or batch in API layer |

---

## 7. Operations & delivery

| Practice | Description |
|----------|-------------|
| **CI: lint + typecheck only** | Fast pipelines; full E2E on release branches |
| **Preview deployments** | One preview per PR, not per commit |
| **Green hosting region** | Prefer EU/Maghreb edge if latency allows (discuss with hoster) |
| **Monitoring without excess** | Sample-based APM; don’t log full request bodies |
| **Scheduled jobs off-peak** | Reports and backups at low-traffic hours |

---

## 8. Multilingual without duplication

| Practice | Status | Description |
|----------|--------|-------------|
| **i18n JSON files** | ✅ Implemented | One codebase; AR / FR / EN / Kabyle — not 4 separate sites |
| **Locale in URL** | ✅ Implemented | `/ar/`, `/fr/` prefixes — share same components |
| **RTL/LTR switch** | ✅ Implemented | CSS logical properties; no duplicate layouts |

---

## 9. What we measure (for pitch & iteration)

| Metric | How |
|--------|-----|
| **Page weight** | Lighthouse / WebPageTest on 3G throttling |
| **API payload size** | Log response bytes per endpoint |
| **Requests per session** | Analytics (privacy-friendly) |
| **Lighthouse Performance** | Target ≥ 85 mobile |
| **Chatbot cost** | Tokens per day + cache hit rate |

---

## 10. Hackathon demo vs production

| Demo (today) | Production (target) |
|--------------|---------------------|
| Mock API in `localStorage` | Supabase → private PostgreSQL |
| Zero server during local demo | Efficient API + CDN |
| Full feature UI for judges | Same UI, real data |

**Message for judges:** Architecture is designed for **low carbon in production**, while the demo intentionally avoids cloud compute during presentation.

---

## 11. Quick wins before national rollout

1. Compress `odej-logo.png` and all hero images to WebP.  
2. Add `loading="lazy"` and route-based code splitting.  
3. Enable TanStack Query `staleTime` defaults (e.g. 5 min for catalogs).  
4. Ship chatbot with FAQ cache before full RAG.  
5. Plan private Postgres migration checklist from day one of Supabase schema design.  

---

*Aligned with ECOHACK '26 green technology mandate · ODEJ Béjaïa platform*
