# Popular Home Reference Match — 2026-09-17

Implemented in the supplied Premium build without deleting existing project data.

## Popular mode
- Mine remains on the existing room-card presentation.
- Popular is a separate presentation mode.
- Removed the unused Explore primary tab from the home header.
- Popular shows the existing event/banner system only when Popular is selected.
- Added three reference-style feature cards: Ranking, Agency Ranking, and CP Ranking.
- Replaced Recommend/New with Popular, Game, and Video/Music filters.
- Popular rooms render as a compact two-column image grid with square media, level badge, live viewer count, optional host badge, online avatars, room name, flag, room ID, and category.
- Tapping a popular room still calls the existing `joinRoom(room.roomId)` flow.

## Gift mention correction
- Room gift activity now displays the sender name as well as the receiver name, so a gift sent between two users is visibly attributed in the room activity/chat stream.
- Existing server-authoritative gift transaction, balance, and Socket.IO broadcast logic was left intact.

## Verification
- All 228 JavaScript files in the supplied archive pass `node --check`.
- No existing project files were intentionally deleted.
