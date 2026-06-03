# ODEJ Béjaïa Platform — Website Routes & Source Map

Base URL (local dev): `http://localhost:5173`  
Production (planned): national ODEJ portal (69 wilayas)

**Wilaya map:** Interactive SVG at `/` (homepage) — [`public/maps/algeria-69-wilayas.svg`](public/maps/algeria-69-wilayas.svg) (CC — [Algeria69WilayaMap](https://github.com/chemsallioua/Algeria69WilayaMap)).

All routes are defined in [`src/App.tsx`](src/App.tsx).

---

## Public pages (no login required)

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/` | الرئيسية | `src/pages/home.tsx` | Public |
| `/institutions` | المؤسسات الشبانية | `src/pages/institutions/index.tsx` | Public |
| `/institutions/:slug` | تفاصيل مؤسسة | `src/pages/institutions/[slug].tsx` | Public |
| `/actualites` | الأخبار والنشاطات | `src/pages/news/index.tsx` | Public |
| `/actualites/:slug` | مقال / خبر | `src/pages/news/[slug].tsx` | Public |
| `/activites` | الأنشطة والفعاليات | `src/pages/events/index.tsx` | Public |
| `/activites/:slug` | تفاصيل نشاط | `src/pages/events/[slug].tsx` | Public |
| `/formation` | التكوين والتعليم | `src/pages/training/index.tsx` | Public |
| `/formation/:slug` | تفاصيل برنامج تكوين | `src/pages/training/[slug].tsx` | Public |
| `/khilya` | خلية الإصغاء | `src/pages/khilya.tsx` | Public |
| `/diwan` | ديوان الشباب | `src/pages/diwan.tsx` | Public |
| `/partenariats` | الشراكات | `src/pages/partenariats.tsx` | Public |
| `/a-propos` | عن الديوان | `src/pages/about.tsx` | Public |
| `/contact` | اتصل بنا | `src/pages/contact.tsx` | Public |
| `/search` | نتائج البحث | `src/pages/search.tsx` | Public |
| `/search?q=...` | بحث (مع استعلام) | `src/pages/search.tsx` | Public |

### Example dynamic URLs (mock data)

| URL | Description |
|-----|-------------|
| `/institutions/maison-jeunes-bejaia` | بيت الشباب بجاية |
| `/institutions/centre-culturel-amizour` | المركز الثقافي أميزور |
| `/actualites/moussem-ete-2026` | خبر: الموسم الصيفي |
| `/activites/atelier-programmation` | نشاط: ورشة البرمجة |

---

## Authentication

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/auth` | اختيار نوع الحساب | `src/pages/auth/index.tsx` | Public |
| `/auth/login` | (إعادة توجيه → `/auth`) | `src/pages/auth/login.tsx` | Public |
| `/auth/login/youth` | تسجيل دخول عضو شاب | `src/pages/auth/login-youth.tsx` | Public |
| `/auth/login/club` | تسجيل دخول نادي | `src/pages/auth/login-club.tsx` | Public |
| `/auth/register` | إنشاء حساب شاب | `src/pages/auth/register.tsx` | Public |
| `/auth/register/youth` | نفس تسجيل الشاب | `src/pages/auth/register-youth.tsx` | Public |
| `/auth/register/club` | تسجيل نادي / جمعية | `src/pages/auth/register-club.tsx` | Public |
| `/auth/forgot-password` | نسيت كلمة المرور | `src/pages/auth/forgot-password.tsx` | Public |
| `/auth/verify-email` | تأكيد البريد | `src/pages/auth/verify-email.tsx` | User |
| `/auth/reset-password` | إعادة تعيين كلمة المرور | `src/pages/auth/reset-password.tsx` | Public |

### Locale prefixes

Public routes also work under locale prefixes:

| Prefix | Language |
|--------|----------|
| `/ar/` | Arabic (RTL) |
| `/fr/` | French |
| `/en/` | English |
| `/kab/` | Kabyle (Taqbaylit — Béjaïa dialect, LTR) |

Examples: `/ar/institutions`, `/en/khilya`, `/kab/actualites`. Auth, dashboard, and admin paths stay unprefixed.

Kabyle translation guide: [`docs/KABYLE_DICTIONARY.md`](docs/KABYLE_DICTIONARY.md).

---

## User dashboard (login required)

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/dashboard` | لوحة المستخدم | `src/pages/dashboard/index.tsx` | User |
| `/dashboard/profile` | إعدادات الحساب | `src/pages/dashboard/profile.tsx` | User |
| `/dashboard/bookings` | تسجيلاتي في الأنشطة | `src/pages/dashboard/bookings.tsx` | User |
| `/dashboard/training` | دوراتي وورشاتي | `src/pages/dashboard/training.tsx` | User (youth) |

---

## Club portal (club role, approved profile)

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/club` | لوحة النادي | `src/pages/club/index.tsx` | Club (approved) |
| `/club/profile` | الملف التنظيمي | `src/pages/club/profile.tsx` | Club (approved) |
| `/club/programs` | برامج التكوين | `src/pages/club/programs/index.tsx` | Club (approved) |
| `/club/programs/new` | برنامج جديد | `src/pages/club/programs/editor.tsx` | Club (approved) |
| `/club/programs/:id/edit` | تعديل برنامج | `src/pages/club/programs/editor.tsx` | Club (approved) |

Pending club accounts see an approval-waiting screen instead of portal content.

---

## Admin portal (dedicated entry)

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/portal` | بوابة الإدارة — تسجيل الدخول | `src/pages/portal/index.tsx` | Public (admin login) |
| `/auth/login/admin` | إعادة توجيه → `/portal` | `src/pages/auth/login-admin.tsx` | Public |

After admin login, users are redirected to `/admin` (full back-office with sidebar).

---

## Admin panel (admin / super_admin only)

| URL | Page (AR) | Source file | Access |
|-----|-----------|-------------|--------|
| `/admin` | نظرة عامة | `src/pages/admin/index.tsx` | Admin |
| `/admin/news` | إدارة الأخبار | `src/pages/admin/news/index.tsx` | Admin |
| `/admin/news/new` | مقال جديد | `src/pages/admin/news/editor.tsx` | Admin |
| `/admin/news/:id/edit` | تعديل مقال | `src/pages/admin/news/editor.tsx` | Admin |
| `/admin/events` | إدارة الأنشطة | `src/pages/admin/events/index.tsx` | Admin |
| `/admin/events/new` | نشاط جديد | `src/pages/admin/events/editor.tsx` | Admin |
| `/admin/events/:id/edit` | تعديل نشاط | `src/pages/admin/events/editor.tsx` | Admin |
| `/admin/institutions` | إدارة المؤسسات | `src/pages/admin/institutions/index.tsx` | Admin |
| `/admin/users` | إدارة المستخدمين | `src/pages/admin/users/index.tsx` | Admin |
| `/admin/training-programs` | برامج التكوين | `src/pages/admin/training/index.tsx` | Admin |
| `/admin/training-programs/:id` | مراجعة برنامج | `src/pages/admin/training/review.tsx` | Admin |
| `/admin/khilya` | خلية الإصغاء (مواعيد) | `src/pages/admin/khilya/index.tsx` | Admin |
| `/admin/partnerships` | الشراكات | `src/pages/admin/partnerships/index.tsx` | Admin |
| `/admin/diwan` | ديوان الشباب (طلبات) | `src/pages/admin/diwan/index.tsx` | Admin |
| `/admin/media` | مكتبة الوسائط | `src/pages/admin/media/index.tsx` | Admin |
| `/admin/settings` | إعدادات الموقع | `src/pages/admin/settings/index.tsx` | Admin |
| `/admin/khilya/counsellor` | بوابة المستشار | `src/pages/admin/khilya/counsellor.tsx` | Khilya staff / Admin |

### Example admin edit URLs

| URL | Description |
|-----|-------------|
| `/admin/news/moussem-ete-2026/edit` | Edit article by slug/id |
| `/admin/events/atelier-programmation/edit` | Edit event by slug/id |

---

## Fallback

| URL | Page | Source file |
|-----|------|-------------|
| `*` (any unknown path) | 404 — غير موجود | `src/pages/not-found.tsx` |

---

## Main navigation links (header)

These appear in [`src/components/layout/SiteLayout.tsx`](src/components/layout/SiteLayout.tsx):

| Nav label (AR) | URL |
|----------------|-----|
| الرئيسية | `/` |
| المؤسسات | `/institutions` |
| الأنشطة | `/activites` |
| الأخبار | `/actualites` |
| خلية الإصغاء | `/khilya` |
| ديوان شباب | `/diwan` |
| اتصال | `/contact` |
| بحث | `/search` |
| تسجيل الدخول | `/auth/login` |
| حسابي | `/dashboard` |
| لوحة التحكم | `/admin` |

---

## Footer quick links

| Label (AR) | URL |
|------------|-----|
| المؤسسات الشبانية | `/institutions` |
| الأنشطة والفعاليات | `/activites` |
| آخر الأخبار | `/actualites` |
| عن الديوان | `/a-propos` |
| خلية الإصغاء | `/khilya` |
| ديوان الشباب | `/diwan` |
| الشراكات | `/partenariats` |

---

## Source directory tree (`src/pages/`)

```
src/pages/
├── home.tsx
├── about.tsx
├── contact.tsx
├── khilya.tsx
├── diwan.tsx
├── partenariats.tsx
├── search.tsx
├── not-found.tsx
├── auth/
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── institutions/
│   ├── index.tsx          →  /institutions
│   └── [slug].tsx         →  /institutions/:slug
├── news/
│   ├── index.tsx          →  /actualites
│   └── [slug].tsx         →  /actualites/:slug
├── events/
│   ├── index.tsx          →  /activites
│   └── [slug].tsx         →  /activites/:slug
├── dashboard/
│   ├── index.tsx          →  /dashboard
│   ├── profile.tsx        →  /dashboard/profile
│   └── bookings.tsx       →  /dashboard/bookings
└── admin/
    ├── index.tsx          →  /admin
    ├── news/
    │   ├── index.tsx      →  /admin/news
    │   └── editor.tsx     →  /admin/news/new | /admin/news/:id/edit
    ├── events/
    │   ├── index.tsx      →  /admin/events
    │   └── editor.tsx     →  /admin/events/new | /admin/events/:id/edit
    ├── institutions/
    │   └── index.tsx      →  /admin/institutions
    ├── users/
    │   └── index.tsx      →  /admin/users
    ├── khilya/
    │   └── index.tsx      →  /admin/khilya
    ├── partnerships/
    │   └── index.tsx      →  /admin/partnerships
    └── diwan/
        └── index.tsx      →  /admin/diwan
```

---

## Related project folders (not URLs)

| Directory | Purpose |
|-----------|---------|
| `src/components/layout/` | SiteLayout, AdminLayout, navbar, footer |
| `src/components/sections/` | HeroCarousel, PageHeader |
| `src/components/cards/` | NewsCard, InstitutionCard, EventCard |
| `src/components/ui/` | shadcn/ui primitives |
| `src/components/auth/` | RequireAuth, RequireAdmin |
| `src/lib/api/` | Mock API, hooks, types |
| `src/locales/` | Arabic / French translations |
| `public/images/` | Hero images and static assets |
| `public/sitemap.xml` | Static sitemap (public routes only) |

---

## Route count summary

| Section | Routes |
|---------|--------|
| Public (static) | 11 |
| Public (dynamic) | 3 patterns (`:slug`) |
| Auth | 3 |
| User dashboard | 3 |
| Admin (static) | 9 |
| Admin (dynamic) | 2 patterns (`:id/edit`) |
| 404 fallback | 1 |
| **Total defined routes** | **32** |

---

*Generated for ODEJ Béjaïa — React + Vite platform (`odej-platform`).*
