# PingPong Production Final V11 — 2026-09-19

## Included fixes
- Private-message/inbox icon reduced and placed directly below the treasure chest box.
- Lucky Fruit launcher enlarged while keeping it directly above the chest.
- Global room custom-frame scale set to **1.40x** (`data/room_ui_config.json`), with client/server defaults aligned.
- Voice activity no longer rebuilds the complete seat grid on every speaking event. Only the affected seat's speaking class is toggled, preventing frame/avatar jumping and reducing DOM churn.
- Speaking-state CSS explicitly prevents seat/avatar/frame transforms and animations from changing layout geometry.
- Existing mesh/SFU/Agora voice recovery paths were preserved; no transport was removed or bypassed.
- Existing room, wallet, gifts, games, admin and persistence files were preserved.

## Validation
- 231 JavaScript files passed `node --check`.
- `roomPremiumFinalFix.test.js` passed.
- `roomCapacityAndVideoGift.test.js` passed.
- `roomStateJoinRace.test.js` passed (8/8).
- `joinRoomLifecycleFix.test.js` passed (31/31).
- Full test runner: 53/54 suites passed. The only failing suite was the existing `envReadiness.test.js` LiveKit status assertion in this local dependency/env-less test environment; the production fail-fast checks in that suite still passed. This does not prove live cloud-service availability.

## Production note
For high concurrent voice load, configure the deployment with a production SFU (LiveKit) or the configured Agora transport and a real TURN service. The ZIP preserves the existing transport selection rather than silently forcing an unconfigured provider.
