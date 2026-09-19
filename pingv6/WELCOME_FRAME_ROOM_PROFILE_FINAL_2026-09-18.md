# Welcome Frame + Room Profile Final Update — 2026-09-18

- Supplied NEW frame converted to a transparent production PNG at `public/images/default-new-frame-7d.png`.
- Every account receives the NEW frame automatically for 7 days unless that automatic grant was already manually removed/expired.
- The frame is active automatically on the user's profile and is synchronized to occupied room seats.
- Expiry removes the user's welcome-frame inventory entry and active profile selection; the shared catalog asset remains available for future grants.
- Manual Remove removes the user's welcome-frame inventory entry and permanently dismisses the automatic grant for that account.
- Server performs a one-minute expiry sweep plus lazy expiry checks on frame/profile/room paths.
- The supplied NEW artwork is the default room logo for newly created rooms and the fallback logo whenever a room has no custom logo.
- Room Profile keeps a small Settings button visible. Only the room owner/admin can open the existing management settings.
- Three-dot Room Actions is a compact dark floating menu, not a white full-height sheet.
- Room Profile gift and diamond totals use compact K/M notation for large values.
- Seat frame rendering uses transparent artwork, circular avatar clipping, and a controlled oversized overlay so the frame surrounds the avatar instead of covering the face.
- Added a visible NEW-frame countdown on the user's Frames page and profile area.

Validation:
- `node --check server.js` — PASS
- `node --check public/app.js` — PASS
- `npm test` — 53/53 suites passed, 0 failed
