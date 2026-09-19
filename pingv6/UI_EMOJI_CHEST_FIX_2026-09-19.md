# PingPong V8 UI Fix — 2026-09-19

- Replaced the room toolbar Reactions text emoji with the supplied white face artwork.
- Converted only the outer connected black background of the supplied artwork to transparency; enclosed black facial details remain intact.
- Kept the existing `btn-open-emoji` ID and reaction handler unchanged.
- Removed the legacy circular badge (`.chest-box::before`) behind the Treasure Chest in the room.
- Kept the actual chest artwork and its existing live level/progress/countdown logic.
- Preserved the earlier V7 mic-state and frame-size stability changes.
- No user/room/wallet/database data is modified or reset by this UI patch.
