# PingPong Premium Final — 2026-09-17 UX/Bug Fix Pass

Implemented in this build:
- Room gift messages now render inside the existing bottom chat/message feed as a compact “Sent to [receiver] [gift icon] ×quantity” activity line.
- Normal and custom/video gifts use the actual gift image/icon when available.
- Gift chat entries auto-expire through the existing activity-feed expiry system.
- Custom/video gift broadcasts now include icon/image metadata so the chat mention can render the custom gift artwork.
- Added server-authoritative received-gift history endpoint and a compact Gifts Received section on user profiles.
- Added recent profile visitor tracking/list with clickable visitor IDs that open the visitor profile.
- Fixed Admin Beans removal target lookup so the selected user in `/api/admin/users/:mobile/beans/remove` is modified instead of accidentally resolving the authenticated admin identity.
- Compact room seats slightly and keep custom frame artwork proportional to the avatar/profile dimensions.
- Reworked Home Mine/Popular/Explore tab selection to be text-first with a small purple active indicator instead of a rectangular selected box.
- Preserved existing gift wallet/ledger transaction flow and existing room chat TTL behavior.

Verification:
- `node --check server.js` PASS
- `node --check public/app.js` PASS
- `node --check admin/app.js` PASS
- Full project test runner: 52/52 suites PASS

No user data files were intentionally deleted or reset.
