# PingPong Premium Visual Migration — 2026-09-18

Migrated only the curated assets that materially improve the PingPong product UI.

## Included
- Premium default room theme: Royal Gold
- Six admin-selectable room themes in `data/theme_library.json`
- SVIP 1–6 compact tags
- SVIP 1–6 transparent avatar frames
- SVIP 5/6 room-entry effects with a bottom-up 3-second presentation
- SVIP 1–6 level-up effects
- Local WebGL VAP renderer (`public/pingpong-vap-player.js`) so packed RGB/alpha VAP video is rendered transparently rather than as a black/white source strip
- Selected non-rocket VAP assets retained for future event wiring: PK start/side/center, Truth/Dare, Red Envelope, Lucky Gift marquee, Task Reward

## Explicitly excluded
- All rocket effects
- Treasure/chest assets
- Unrelated Haco login, social, settings, and shell assets
- Haco-specific application logic or data

## Behavioral safeguards
- Room entry effect is shown only after the server confirms the requested room join.
- Entry effect is shown only for SVIP5/SVIP6, matching the existing SVIP privilege model.
- The effect is small, bottom-up, non-interactive, and does not change seat/chat geometry.
- Level-up effect is shown only to the user whose SVIP level changed.
- Leaving the room stops the effect immediately.
- Existing admin-assigned frames remain higher priority than the automatic SVIP frame.
- Existing wallet, voice, room, seat, gift, game, and moderation logic is preserved.
