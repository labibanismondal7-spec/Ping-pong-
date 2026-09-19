# PingPong Room/Profile Bugfix — 2026-09-18

Applied to this ZIP:

1. Profile pages
   - Removed the "Gifts Received" / gifting section from the user's own Profile.
   - Removed the same gift section from other-user profile UI if present.
   - Removed the now-unused profile gift loader call/function path so opening Profile does not depend on gift history.

2. Room gift mention
   - Added a dedicated lower-room "Mention the gift" notice.
   - After a successful server gift event, it shows:
     - recipient name (`Sent to @Name`)
     - the gift image/PNG supplied by the gift catalog
     - gift name
     - quantity (`×N`)
   - Auto-hides after 5 seconds.
   - Existing authoritative `gift-received` transaction flow remains unchanged.

3. One-user-one-room
   - Client-side Create Room button is locked while the request is in flight, preventing double taps.
   - Server already had a cross-instance creation lock and single-room check; retained it.
   - Added startup/persistence normalization: if older `rooms.json` contains duplicate rooms for one host, only one room is retained so duplicates are not resurrected after restart.

4. Seat size
   - Reduced room seat circles to approximately 68% width / max 78px while preserving the existing seat grid, labels, frames, speaking animation and touch behavior.

Verification:
- `node --check public/app.js` — PASS
- `node --check server.js` — PASS
- relevant room/Redis/voice JS syntax checks — PASS
- full project test suite: 53/53 suites passed, 0 failed
