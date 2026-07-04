# Share Link Tracking + Copy Link Button

## Problem

Each `Application` has an external `accessLink`. Today, "opens" are only counted when a user clicks "BUKA APLIKASI" inside the portal (`AppCard.tsx` fires a `sendBeacon` POST to `/api/apps/[id]/open`). If someone copies the raw `accessLink` and shares it (e.g. via WhatsApp), anyone who opens it bypasses the portal entirely, so that access is invisible to monitoring (`/api/stats`, `KPIBar`, admin dashboard).

## Goal

- People should be able to copy a shareable link for an app, next to "BUKA APLIKASI" and the feedback ("rating & comment") button.
- When someone opens a link that was obtained via "Copy Link", that access must be reflected in monitoring — specifically, merged into the existing `openCount` metric (no new/separate KPI).

## Design

### Trackable redirect route

Add `GET /go/[id]` (`src/app/go/[id]/route.ts`):

1. Look up `Application` by `id`.
2. If found: increment `openCount`, then respond with a redirect (307) to `app.accessLink`.
3. If not found (app deleted): redirect to `/`.

The increment logic currently lives inline in `src/app/api/apps/[id]/open/route.ts`. Extract it into a shared helper, `incrementOpenCount(id: string)` in `src/lib/appStats.ts`, and use it from both:
- `POST /api/apps/[id]/open` (existing beacon fired on direct "BUKA APLIKASI" clicks)
- `GET /go/[id]` (new redirect route, hit when a shared link is opened)

Because both paths write to the same `openCount` field, `/api/stats`'s `totalOpens` aggregate and `KPIBar`'s "Total Dibuka" card automatically include share-link opens with no further changes.

### Copy Link button (`AppCard.tsx`)

Add a third icon button in the actions row, positioned between "BUKA APLIKASI" and the feedback button, styled consistently with the existing feedback icon button (bordered square, `border-foundry-border/40`, hover state `hover:border-molten/50 hover:text-molten`).

Behavior:
- On click, build `${window.location.origin}/go/${app.id}` and write it via `navigator.clipboard.writeText(...)`.
- Show local, temporary confirmation: swap the icon to a checkmark (`Check` from lucide-react) for ~1.5s, then revert. This mirrors the app's existing pattern of local component state for UI feedback (no toast library is used anywhere in the codebase).
- `aria-label`: `Salin link untuk {app.name}`, with a `title` tooltip "Salin Link".

### Maintenance-mode behavior

- "Copy Link" stays enabled even when `app.status === "MAINTENANCE"` (unlike "BUKA APLIKASI", which is disabled) — a link can still be pre-shared for when the app comes back online.
- `/go/[id]` does not check `status`; it redirects regardless, consistent with the fact that the backend doesn't otherwise enforce maintenance restrictions today (only the UI disables the button).

## Data flow

1. User clicks "Copy Link" on an `AppCard` → clipboard receives `origin/go/{id}`.
2. User shares that URL externally (WhatsApp, email, etc.).
3. Recipient opens the URL → hits `GET /go/[id]` → server increments `openCount` → server redirects (307) to the app's real `accessLink`.
4. Admin dashboard and portal `KPIBar` reflect the updated `openCount` on next fetch of `/api/stats` — no dashboard code changes required.

## Out of scope

- No new database columns or migrations.
- No separate "opened via share" metric/KPI card (explicitly merged into `openCount` per decision).
- No new API endpoints beyond `/go/[id]`.
- No changes to `FeedbackModal` or rating/comment flow.

## Testing

- Copy the link from a card, paste in a new browser tab: confirm it redirects to the app's `accessLink` and that `openCount` (visible via admin dashboard "Total Dibuka" / KPIBar) increases by 1.
- Visiting `/go/[id]` for a deleted/non-existent `id` redirects to `/` without error.
- Copy Link button works and shows the checkmark confirmation on both ACTIVE and MAINTENANCE apps.
