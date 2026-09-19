# PingPong — Treasure Chest + Game Payout Final Update

Date: 2026-09-18

## Treasure Chest
- Chest tap now opens a dedicated live chest sheet.
- Shows current level, contribution progress and reset countdown.
- Shows Top 1 / Top 2 / Top 3 reward cards.
- Chest rewards are Diamonds + Frame only; XP is not granted by the chest.
- A 3 → 2 → 1 → OPEN presentation is shown when a chest opens.
- The opener's display name is shown during the opening animation.
- The live chest sheet shows who contributed Diamonds, ranked by contribution.
- Top-rank Frames are added to the user's existing Frame Store inventory permanently and are not auto-equipped.

## Admin
- Added `Chest Frames` section to the admin sidebar.
- Admin can upload a PNG and assign it to a Chest Level + Top 1/2/3.
- The upload is added to the normal Frame catalog and wired into that chest rank.
- Existing chest diamond reward amounts are preserved when older chest configuration is loaded.

## Game payout fix
- Fruit Wheel payout is now exactly `winning bet × configured fruit multiplier`.
- Removed the old round-funded-pool scaling that could reduce a configured 5x win to 3x or another lower amount depending on other players' bets.
- Example: 1,000 on a 5x fruit pays exactly 5,000 Diamonds; 1,000,000 on a 5x fruit pays exactly 5,000,000 Diamonds.
- Teen Patti's existing separate 2.9x client game flow was not changed by this Fruit Wheel payout correction.

## Verification
- `node --check server.js` — passed
- `node --check public/app.js` — passed
- `node --check admin/app.js` — passed
- Existing project test suite — 53/53 suites passed before final packaging.
- Runtime startup in this isolated build sandbox could not be completed because project npm dependencies are intentionally not installed in the extracted source; the failure was `Cannot find module 'dotenv'`, not a syntax error in the changes.
