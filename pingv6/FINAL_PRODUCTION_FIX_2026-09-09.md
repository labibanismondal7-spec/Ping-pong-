# PingPong Final Production Fix — 2026-09-09

## Included fixes

1. **Room seats: 12 total**
   - Server authority is now 12 seats.
   - Client renders a 4 x 3 grid (No.1–No.12).
   - Empty seats keep the existing `＋` affordance.
   - Seat circles are slightly smaller/compact on mobile so all 12 remain visible.
   - Existing room seat arrays are padded to 12 instead of being reset.
   - Seat validation, seat moves, invites and Room 101 controls use the 1–12 range.
   - Existing 4-column adjacency logic remains valid for the new 12-seat 4 x 3 layout.

2. **Diamond Center self-recharge**
   - A Diamond Center owner can now recharge their own User ID.
   - The Center's Diamond inventory is still deducted, so this cannot mint free Diamonds.

3. **Diamond Center custom INR recharge**
   - Exact configured packages continue to work.
   - Any positive whole-rupee amount can now be entered.
   - Custom amounts use the approved ₹300 base rate when available (default: ₹300 = 100,000 Diamonds), with proportional integer Diamond calculation.
   - If ₹300 is not configured, the lowest active package becomes the deterministic fallback rate.
   - Bonus percentage remains server-controlled.
   - The server, not the client, decides the final Diamond amount and Center inventory deduction.

4. **Video Gift "network error" fix**
   - Added the missing public `/api/video-gifts/catalog` endpoint used by the Gift Box fallback.
   - Disabled gifts are never exposed through the public catalog.
   - Video playback now uses explicit preload/range-friendly static delivery, `playsinline`, error handling, muted autoplay fallback and a guaranteed cleanup timeout so a failed/stalled clip cannot trap the full-screen overlay.
   - Video Gift events carry quantity so the sender's live balance preview stays correct for repeated sends.

## Verification

Passed targeted regression suites:

- `test/seatAdjacency.test.js` — 22 passed, 0 failed
- `test/diamondCenter.test.js` — PASS
- `test/roomCapacityAndVideoGift.test.js` — PASS
- `test/friendshipCpVisual.test.js` — 32 passed, 0 failed
- `test/roomJoinRpc.test.js` — 16 passed, 0 failed
- `test/roomOpRpc.test.js` — 19 passed, 0 failed
- `test/giftCrossInstanceEmit.test.js` — 10 passed, 0 failed
- `test/rechargeService.test.js` — 63 passed, 0 failed

The full dependency install/runtime boot could not be completed in the isolated build environment because `npm install` exceeded the execution timeout; the project source passed Node syntax checks for all directly modified JS files.

## Important deployment note

Run `npm install` in the production/Termux environment before starting the server. Existing production `.env`, persistent data, uploaded video gifts and wallet/database configuration should be preserved.
