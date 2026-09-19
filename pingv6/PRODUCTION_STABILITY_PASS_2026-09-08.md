# PingPong Production Stability Pass — 2026-09-08

## Applied
- MainActivity ActivityResult launchers registered explicitly from `onCreate()`.
- Home/Mine/Popular/Explore chrome animations/transitions disabled to keep the
  top area stable when entering/leaving rooms.
- Home content remains a normal touch-scrolling pane without animated scroll.
- Login country selector made compact/responsive so the phone number remains
  visible and the selector does not expand the row.
- Existing frame upload/activation, room voice recovery, seat-leave audience
  reconciliation, video-call, wallet and admin feature code was preserved.

## Verification performed on the patched source
- `node --check server.js` — PASS
- `node --check public/app.js` — PASS
- `node --check admin/app.js` — PASS
- Full Node regression suite — **49/49 suites PASS** after aligning four stale
  test fixtures with the current Diamonds/wallet and Agora room-authorized APIs.

## Build limitation
The supplied sandbox could not download the Gradle 8.11.1 distribution because
outbound network access is unavailable, so a release APK was not generated here.
The Android project and wrapper remain included for GitHub/Railway/Termux build.

Runtime production certification still requires the real Railway environment,
persistent database/data, TURN credentials, SMS/OTP, Firebase, upload storage,
and real Android voice/video/device tests. A source archive alone cannot honestly
guarantee zero runtime problems.
