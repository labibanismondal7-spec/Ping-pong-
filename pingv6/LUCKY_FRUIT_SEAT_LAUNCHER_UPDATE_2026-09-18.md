# PingPong Lucky Fruit + Seat Fit Update — 2026-09-18

- Added the supplied Lucky Fruit artwork as `public/images/lucky-fruit-launcher.png` with the black source background removed.
- Added a small animated circular Lucky Fruit launcher above the room Treasure Chest.
- Tapping the launcher opens the existing real Food Wheel iframe via `openRoomGame("foodwheel")`; it does not create a demo game or duplicate the game logic.
- Launcher visibility follows the existing room `gameEnabled` permission.
- Finalized room seat geometry to a stable circular 60px footprint (58px on small screens) and controlled frame overscan so the frame surrounds the avatar without changing the grid.
- Preserved existing chest click behavior and game/admin logic.
- Syntax checks: `public/app.js` PASS; `server.js` PASS.
