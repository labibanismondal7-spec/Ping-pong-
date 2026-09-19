# PingPong Room Premium Final Fix — 2026-09-17

## Fixed
- Room Visitor popup close (`×`) is now an explicit, touch-safe close action and the overlay can also be dismissed by tapping outside the card.
- Room creation is single-owner/single-room: the existing-room check is performed after an owner lock. Redis `NX` locking is used when Redis is available; a local per-owner guard remains as fallback.
- Added owner-only Room Name editing inside Room Settings.
- Room rename persists to the existing room record and broadcasts updated room state/list without creating a new room.
- Gift activity now visibly mentions the receiver as `@Receiver` below the gift action.
- Existing reconnect/rejoin lifecycle was retained; the full existing test suite was rerun.

## Validation
- Node syntax checks: passed for server.js, public/app.js, roomEvents.js, voice-reconnect.js.
- Full project test runner: 52/52 suites passed.
- Final room-specific static validation: passed.

## Data safety
No existing user, room, gift, wallet, or other project data was intentionally deleted or reset by these changes.
