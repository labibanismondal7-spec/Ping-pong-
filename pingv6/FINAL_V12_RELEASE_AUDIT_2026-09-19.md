# PingPong Production Final V12 — Release Audit

## Applied
- Frame artwork fixed at 1.40x and speaking state is paint-only; voice activity no longer changes seat/frame transform, animation, or footprint.
- Private-message icon is slightly larger and positioned below the Treasure Chest.
- Lucky Fruit launcher increased and remains above the Treasure Chest.
- Private-message thread back button returns directly to the active room when the thread was opened from the room message indicator.
- Room Share now creates a deep room invitation URL (`?room=<roomId>`). Opening the link while logged in consumes the invitation and joins the room once.
- YouTube same-video replay after END explicitly seeks/restarts instead of relying on a stale ENDED iframe state.

## Verification
- `node --check` passed for all 231 project JavaScript files.
- `roomPremiumFinalFix.test.js`: PASS.
- `roomCapacityAndVideoGift.test.js`: PASS.
- `roomStateJoinRace.test.js`: PASS (8/8).

## APK
A release APK was not generated in this container because the Android Gradle wrapper requires downloading Gradle 8.11.1 and outbound network access is unavailable here. The existing `android/build-termux.sh` remains the intended Termux build path and the Android project is included in this release ZIP.
