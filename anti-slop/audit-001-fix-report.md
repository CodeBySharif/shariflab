# antislop audit 001 — fix report — 2026-10-03

Approved scope: **all findings (1–20)**, high priority first.

## Fixed

| # | Change |
|---|--------|
| 1 | Hub-first product: login/README/copy no longer sell analytics as core; tracking off by default; analytics tabs only when tracking is on |
| 2 | Removed user-facing em dashes (secret alert, thumbnail failure, empty field placeholders use “Not set”) |
| 3 | Error states + Retry on projects list, project detail queries, edit load |
| 4 | Create/save/delete `onError` toasts |
| 5 | Removed orphaned `.input { outline: none }` with the unused marketing CSS |
| 6 | Layout/edit no longer lock viewport scroll; body allows vertical scroll |
| 7 | Primary card CTA is **Open site**; Details is secondary |
| 8 | Removed misleading `N views` from cards |
| 9 | Tracking checkbox defaults to **false**; labeled optional |
| 10 | Tracking tab never shows `YOUR_SITE_SECRET`; snippet only after generate |
| 11 | Charts use MUI theme colors (light/dark) |
| 12 | Removed platform-chip blur |
| 13 | Slimmed `index.css` to tokens + card exit/fade animations |
| 14 | Empty hub copy + **Add project** button match the control |
| 15 | Card hierarchy: Open → Details → Edit → Delete |
| 16 | Dark-first kept; light charts fixed (#11); reason in DESIGN.md |
| 17 | Project not-found on detail + edit |
| 18 | README hub-first, Google-only auth, tracking optional |
| 19 | Open site is full button (44px-ish min height), not icon-only |
| 20 | Login brand + soft identity wash; brand name always visible in nav |

## Verify

- `npm run build` in `frontend/` → **PASS** (tsc + vite)

## Not changed (by design)

- Backend `track.js` pipeline left in place for optional use; not repaired as a product promise
- File still named `ProjectAnalyticsPage.tsx` (route `/projects/:id`); UI is project details first
