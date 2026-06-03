# Kabyle (Taqbaylit) — Béjaïa dialect guide for ODEJ platform

This document helps developers, translators, and content editors add and maintain **Kabyle** on the ODEJ Béjaïa platform. It focuses on the **Latin script** used in `src/locales/kab.json` and on vocabulary familiar to youth in **Béjaïa province** (Bgayet / Bgayet).

## Language code and routing

| Item | Value |
|------|--------|
| ISO 639-3 | `kab` |
| URL prefix | `/kab/` (e.g. `/kab/institutions`) |
| Text direction | **LTR** (left-to-right), same as French and English |
| `html lang` | `kab` |
| Locale file | `odej-platform/src/locales/kab.json` |

Arabic (`ar`) remains **RTL**. French (`fr`), English (`en`), and Kabyle (`kab`) are **LTR**.

## Orthography (Latin — platform default)

The platform uses **Kabyle Latin** (standard in Algerian education and many public sites in Kabylie):

- **Ǧ / ǧ** — like French “j” in *jardin* (e.g. *Bgayet*)
- **Č / č** — “ch” (e.g. *ččur* “month”)
- **Ṣ / ṣ**, **Ẓ / ẓ** — emphatic s/z
- **Ɣ / ɣ** — voiced velar fricative (e.g. *ɣef* “on/about”)
- **Ɛ / ɛ** — pharyngeal (e.g. *aɛejmi* “password”)
- **Ṭ / ṭ**, **Ḍ / ḍ** — emphatic t/d

**Béjaïa place names (common forms):**

| Arabic / French | Kabyle (Latin) |
|-----------------|----------------|
| Béjaïa | **Bgayet** or **Bgayet** |
| Toudja | **Tutja** |
| Amizour | **Amizuṛ** |
| Akbou | **Aqbu** |
| Tichy | **Ticci** |

Use one spelling consistently in UI strings (we use **Bgayet** in `kab.json`).

### Tifinagh (optional future)

Official Tamazight can also be written in **Tifinagh** (ⵜⴰⵎⴰⵣⵉⵖⵜ). If added later:

- Set `dir="rtl"` only if the whole UI is Tifinagh-first
- Provide a font with Tifinagh glyphs (e.g. Noto Sans Tifinagh)
- Keep Latin as fallback in `kab.json` until fonts and QA are ready

## Core UI vocabulary (ODEJ context)

| English | Kabyle (Latin) | Notes |
|---------|----------------|--------|
| Home | Asebter agejdan | |
| Institutions | Iimeẓla | youth houses, camps, etc. |
| Activities / events | Tirmitin | |
| News | Isallen | |
| Listening cell (Khilya) | Tacellit n umeslay | |
| Youth council (Diwan) | Diwan n yiseggasen | |
| Contact | Anermes | |
| Search | Nadi | verb root |
| Sign in | Kcem | |
| Sign out | Ffeɣ | |
| Read more | Ɣer sdat | |
| Loading | Asali | |
| Save | Sekles | |
| Cancel | Sefsex | |
| Back | Uɣal | |
| Book an appointment | Suter adrim | Béjaïa usage |
| Explore | Snirem | |
| Featured article | Amagrad yettwasnen | |
| Capacity | Tazmert | + `{{count}} n yemdanen` |

## Béjaïa dialect notes

Kabyle varies by region. For **Béjaïa**, prefer:

- Local place names youth recognize (**Bgayet**, **Tutja**, **Ticci**)
- Neutral, inclusive **tutlayt taqbaylit** — avoid heavy Chenoui or Shawiya forms unless the page is regional
- Short sentences for mobile UI (Kabyle often needs more words than French; use `line-clamp` and test layout)

**Examples of natural phrasing:**

- “Welcome to the ODEJ platform” → *Ansuf di tɣelwit n ODEJ*
- “No results” → *Ulac igmad*
- “Page not found” → *Asebter ulac-it*

## How to add or edit translations

1. Open `src/locales/kab.json`.
2. Mirror keys from `ar.json` / `en.json` — **same JSON structure**, only values change.
3. Run the app and switch language via the header **globe menu** → **Taqbaylit**.
4. Check `/kab/` URLs and LTR layout (nav, cards, hero carousel).

### i18n key convention

```
nav.*       — navigation
home.*      — homepage & hero
news.*      — news hub
institutions.* — institution cards
common.*    — shared buttons
auth.*      — login / verify / reset
```

Use `{{variable}}` for interpolation (same as English):

```json
"pageOf": "Asebter {{page}} ɣef {{total}}"
```

## Content not in locale files (yet)

Mock **articles**, **events**, and **institutions** in `src/lib/api/mock/seed.ts` are still in **Arabic** (admin/content data). To localize content:

1. Extend API types with optional `titleKab`, `bodyKab`, etc., **or**
2. Store per-locale content in separate seed maps keyed by slug.

UI chrome (nav, hero, footer, buttons) is fully driven by `kab.json`.

## QA checklist for Kabyle

- [ ] All keys in `en.json` exist in `kab.json`
- [ ] `/kab/` prefix works on public routes (not `/auth`, `/admin`, `/dashboard`)
- [ ] Hero carousel slides in correct language; dots centered in LTR
- [ ] Card images fill media area (`CardMedia` + `object-cover`)
- [ ] No overflow on long Kabyle strings in header and buttons
- [ ] Date formats use appropriate locale (`en-GB` fallback for `kab` in cards until `kab-DZ` is widely supported)

## References

- [Kabyle language (Wikipedia)](https://en.wikipedia.org/wiki/Kabyle_language)
- Algerian standardization: IRCAM / ANLCA resources for Tamazight
- Platform locales: `src/locales/kab.json`, `src/lib/languages.ts`, `src/lib/i18n.ts`

For questions about institutional terminology (ديوان، خلية الإصغاء), align with ODEJ Béjaïa official Arabic/French names first, then adapt to Kabyle with this glossary.
