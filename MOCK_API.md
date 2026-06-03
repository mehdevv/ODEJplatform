# ODEJ Platform — Mock API

The frontend uses an in-memory mock API with `localStorage` persistence (`odej_mock_store_v3`).

## Demo accounts

| Email | Password | Role | Portal |
|-------|----------|------|--------|
| admin@odejbejaia.dz | admin123 | admin | `/admin` |
| youth@odejbejaia.dz | youth123 | public (verified) | `/dashboard` |
| club@odej.dz | club123 | club (approved) | `/club` |
| club-pending@odej.dz | club123 | club (pending) | pending screen |
| counsellor@odejbejaia.dz | khilya123 | khilya_staff | `/admin/khilya/counsellor` |

## Training programs (mock)

- **Public catalog:** `listTrainingPrograms({ publicOnly: true })` — `published` only at `/formation`
- **Club:** `createTrainingProgram`, `updateTrainingProgram`, `submitTrainingProgram` — draft → submitted
- **Admin:** `reviewTrainingProgram` — approve, reject, publish
- **Youth:** `enrollInTrainingProgram`, `listMyTrainingEnrollments`, `cancelTrainingEnrollment`

## Club accounts (mock)

- `registerClub` — creates `club` user + `ClubProfile` with `status: pending` and uploaded **agreement** (PDF/Word/image, base64 in store)
- `reviewClubProfile` — admin views agreement on `/admin/users`, then approve/reject (approval requires agreement on file)
- `getClubDashboard`, `getMyClubProfile`, `updateClubProfile`

## Simulated features

- Email verification (`/auth/verify-email`)
- Password reset (link logged to console from forgot-password)
- Registration QR codes and `.ics` export
- Khilya slot booking
- Admin media library (base64 in store)
- Site settings, announcement banner, maintenance message
- Bulk article publish/archive
- CSV export (events registrations, users)

## Real API

Set `VITE_API_BASE_URL` in `.env` to point at a future backend. See `src/lib/api/client.ts`.

## Reset data

Clear `localStorage` keys `odej_mock_store_v3` (and legacy `v2`/`v1`) and `odej_token`, then reload.
