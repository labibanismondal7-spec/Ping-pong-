# PingPong — Final Fix Update — 2026-09-17

## Source assets
- The supplied PDF was visually inspected page-by-page and its fruit/control artwork was converted to transparent PNG assets under `public/images/pdf-assets/`.
- Fruit Wheel now uses the supplied PNG artwork instead of emoji for the eight fruit cards and result visuals.
- Supplied mute artwork is wired to the room-seat mute badge.
- Supplied settings artwork is wired to the Room Settings control and Settings menu icon.
- Existing project/data assets were retained; no user/gift/room records were intentionally deleted or reset.

## Fixes applied

### 1. Fruit Wheel PNG sizing + winning result
- Added transparent PNGs for Orange, Lemon, Grape, Cherry, Apple, Watermelon, Mango and Strawberry.
- Fruit cards use a fixed contained visual box so the source artwork keeps its proportions while appearing larger.
- Result/history visuals use the same source artwork at controlled sizes.
- Fruit Wheel result display now consumes the server-authoritative `win`, `betTotal` and `balanceAfter` values.
- Removed the old history display that re-calculated the win as `bet × multiplier`; the server settlement amount is shown instead.
- Server `fruitwheel-result` now includes the authoritative post-settlement balance.

### 2. Room-scoped music
- Leaving/switching rooms immediately stops and unloads the local room audio.
- Every new `room-state` fully replaces the audio state; if the new room has no music, the previous track is stopped.
- This prevents Room A music from continuing after entering Room B.
- Server room music state remains room-specific so other users still hear the song only while they are in that room.

### 3. Normal Gift continuous sending
- The Gift Box no longer closes after every normal gift send.
- Selected recipient(s), selected gift and quantity remain ready for the next tap.
- Each tap generates a unique request ID, so rapid sends are independent transactions.
- Added a visible send counter (`1, 2, 3, 4...`) and a small send-button animation for rapid repeated sending.
- x1 remains the default single-gift flow; existing x7/x77/x777 quantity controls remain available.
- Custom/video gift behavior was not changed by this continuous-send change.

### 4. Admin Beans removal
- Added an Admin Users action: `Remove Beans`.
- Admin can enter a User ID/mobile-selected user from the Users table and remove a specific Beans amount.
- The server validates balance, prevents overdrafts, uses the production wallet adapter when enabled, persists the result, records the transaction and audit log, and pushes the updated wallet live.
- Diamonds are not modified by this operation.
- Users table now displays the actual Beans balance instead of duplicating Diamonds.

### 5. Mic-off seat indicator
- Room seats continue to show the mute state only when the user is actually muted.
- The supplied PDF mute artwork is used as the seat indicator.
- The indicator is deliberately small and positioned beside the seat/avatar so it does not cover the user's frame or avatar.

### 6. Name-color animation
- Kept the existing server-approved `premium_gradient` name effect.
- Increased the room-seat gradient movement speed and preserved the text-only behavior.
- The live `name-effect-updated` and room profile-style synchronization paths remain intact.

## Verification
- `node --check server.js` — PASS
- `node --check public/app.js` — PASS
- `node --check admin/app.js` — PASS
- Inline `public/foodwheel/index.html` JavaScript syntax — PASS
- Full existing test suite: **48/48 PASS**
- Project `data/` files were restored/verified byte-for-byte against the supplied source ZIP after test execution; **no data-file differences remain**.
