# PingPong V4 — Room Settings + Room Logo Fix — 2026-09-18

## Fixed
- Room Settings opened from Room Profile Settings and Three-dot Settings now transitions directly without the delayed `history.back()` popstate closing the newly opened modal.
- Room Settings modal is now centered, scrollable and layered above the room toolbar/game UI.
- Room Logo is separated from the automatic NEW profile frame asset.
- Added a distinct default Room Logo asset: `public/images/room-default-logo.png`.
- Existing rooms using the V3 mistaken `default-new-frame-7d.png` as their room logo are migrated to the distinct default logo on load.
- New rooms now use the distinct default Room Logo.
- Room Logo upload updates the room header, profile sheet and settings preview immediately.
- Added `Use Default Room Logo` control.
- Server rejects the legacy profile-frame asset as a room logo and falls back to the real Room Logo.
- Room Theme control remains available and now keeps a clear Change/Choose label.
- Room Lock controls remain functional.
- Seat Lock controls are visible in Room Settings again.
- Existing moderation controls/listeners remain intact.

## Validation
- `node --check public/app.js` — PASS
- `node --check server.js` — PASS
- HTML duplicate ID scan — 587 IDs / 587 unique
- `npm test` — 53/53 suites passed, 0 failed
- ZIP integrity — PASS
