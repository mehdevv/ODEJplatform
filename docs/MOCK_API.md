# ODEJ Platform — Mock API

See also the project root [`MOCK_API.md`](../MOCK_API.md) for the same reference.

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

- `registerClub` — creates `club` user + `ClubProfile` with `status: pending`
- `reviewClubProfile` — admin approve/reject on `/admin/users` (club role rows)
- `getClubDashboard`, `getMyClubProfile`, `updateClubProfile`

## Reset data

Clear `localStorage` keys `odej_mock_store_v3` (and legacy `v2`/`v1`) and `odej_token`, then reload.
