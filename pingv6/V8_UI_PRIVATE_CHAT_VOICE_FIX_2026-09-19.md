# PingPong V8 UI / Private Chat / Voice Fix — 2026-09-19

Applied directly to the supplied V7 project without changing room/seat/game structure.

## Changes
- Replaced the supplied Gift, Reaction Emoji and Private Message artwork.
- Removed only the edge-connected black background from the supplied artwork; internal black pixels remain intact.
- Gift/reaction/toolbar icon containers are transparent; no black square icon background.
- Gift icon was reduced for a compact room toolbar footprint.
- Added a compact white Private Message notification above the room/game layer with unread count.
- Added persistent private-message read markers and per-conversation unread counts.
- Added Inbox unread badge and per-conversation unread badge.
- Added Online / In room / Offline status to Inbox and the private-chat header.
- Added room name to the private-chat presence label when the other user is currently in a room.
- Opening a private thread marks incoming messages as read.
- Friendship/CP/system/normal private-message socket delivery now participates in unread counting without changing the existing message-card logic.
- Strengthened mesh remote-audio playback retries and added a lightweight periodic room voice reconciliation/track-recovery pass.
- Existing room layout, seats, games, gifts, chest, room chat and voice transport architecture were preserved.

## Verification
- `node --check public/app.js` — passed.
- `node --check server.js` — passed.
- Supplied icon assets are RGBA PNGs with transparent edge backgrounds.
