# PingPong — Premium Final Update — 2026-09-17

## Applied
- Profile avatar upload now accepts GIF (`image/gif`) in addition to PNG/JPG/WEBP.
- GIF files are stored as the original bytes, so animated GIF frames are preserved instead of being converted to PNG.
- Hardened upload magic-byte validation for GIF (`GIF87a` / `GIF89a`).
- Fixed the profile-background upload response bug that referenced an undefined `asset.url`.
- Added authoritative room-entry activity events after a successful server-side join. The joining user's avatar/name now appears in the room's bottom chat/activity feed as “<name> joined the room”.
- Added premium animated join activity styling.
- Gift activity already existed in the bottom feed; its sender → receiver, gift icon and value presentation was retained and given the same premium animation/polish.
- Added a Premium Popular section showing live Agency Event and Top Gifters data from the existing authenticated ranking APIs.
- Added responsive glass/glow cards, micro-interactions, animated entry effects and reduced-motion support without deleting existing user/gift/room data.

## Verification
- 228/228 JavaScript files pass `node --check`.
- `server.js`, `public/app.js`, and `storage/uploadValidation.js` pass syntax checks.
- Existing regression runner: 51/52 suites passed in this sandbox. The only failing suite is `test/envReadiness.test.js`, with its 2 LiveKit assertions failing because this sandbox has no LiveKit environment/dependencies configured. The other 14 assertions in that suite pass. This failure is environment-related and was not caused by the UI/GIF/room-activity changes.
- No existing `data/` records, custom gifts, user levels, rooms, or uploaded assets were deleted or reset by this update.

## Runtime acceptance still required
The production Railway environment/device should be used to verify animated GIF rendering on the profile, multi-user room join feed, real gift send/receive, Popular Agency/Top-Gifter API responses, and WebRTC/network behavior.
