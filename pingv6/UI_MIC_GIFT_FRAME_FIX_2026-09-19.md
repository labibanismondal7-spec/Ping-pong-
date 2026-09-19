# PingPong UI Fix — 2026-09-19

## Applied
- Replaced the room toolbar microphone artwork with the supplied white microphone for the unmuted state.
- Added a single mic switch state: unmuted = supplied white mic; muted = supplied muted mic.
- Replaced the room Gift button artwork with the supplied Gift Box artwork.
- Reused the supplied muted microphone artwork for the seated muted indicator.
- Removed the speaking animation transform from the whole seat container. Speaking feedback remains on the seat ring shadow only, so custom/profile frames no longer grow, shrink, or move when voice activity is detected.
- No room structure, seat count, wallet, gifts ledger, users, frames, or persistent data were deleted/reset.

## Verification
- `node --check public/app.js`
- PNG assets inspected as RGBA with transparent black presentation backgrounds.
- Active references remain same-origin `/images/icons/...` paths.
