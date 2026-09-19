# PingPong — Room 101 Removal + 2026 Premium UI Update

## Scope
Applied to the extracted `PINGPONG-PRODUCTION-AUDITED-2026-09-16.zip` project.

### Room 101 / AI Customer Service Room
- Room 101 is no longer auto-created.
- Persisted room metadata containing Room 101 / AI customer-service room records is ignored at runtime.
- Room persistence now refuses to write Room 101 back into `rooms.json`.
- `/api/customer-service/room101` now returns HTTP 410 instead of exposing the removed room.
- The dedicated AI seat markup was removed from the room UI.
- The existing Customer Service/support functionality outside the room was intentionally not deleted.

### Home / Popular UI
- Removed the small Popular feature-card strip (`home-popular-tools`) so the mini boxed UI is no longer rendered.
- Existing Popular/Explore navigation remains intact.

### Premium 2026 visual system
- Added a transparent/glass visual layer with purple, violet, cyan, pink and gold accents.
- Added animated gradient/glow treatment to primary actions and selected UI.
- Reduced heavy boxed appearance across menus, settings, profile and room controls.
- Added responsive/reduced-motion handling.

### Profile background
- Added a `Change Background` control behind the profile hero.
- Added a persistent user `profileBackground` field.
- Added authenticated upload endpoint: `/api/user/upload-profile-background`.
- The selected background is rendered behind the profile header and survives profile reloads.

## Verification
- `node --check server.js` — PASS
- `node --check public/app.js` — PASS
- Existing user/data files were not broadly deleted or reset.
- Only the Room 101 room-specific runtime/persistence behavior was removed/disabled.
