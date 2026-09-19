# PingPong — Comprehensive Production Audit — 2026-09-16

## 0. Environment limitations (stated up front, per instructions)
This review ran in a sandboxed container with **no outbound network access** and **no
Android SDK / Gradle cache**. That means, same as the prior 2026-09-14 audit already
recorded in this repo:
- `npm install` could not run, so third-party packages (`express`, `pg`, `ioredis`,
  `firebase-admin`, etc.) could not be exercised.
- `gradle assembleRelease` could not run, so no APK was (or could be) built here.
- No live Redis / PostgreSQL / Firebase / Agora / LiveKit / SMS gateway was available,
  so nothing that requires those services could be run end-to-end.

Everything below is either (a) static code review, (b) the repository's own
dependency-free regression suite (`node test/run-all.js`), which **does** run in this
environment because it mocks Redis/Postgres rather than needing them live, or (c)
config-file inspection. Nothing here should be read as "tested against production
infrastructure."

## 1. What was run
- `node --check` on all 228 `.js` files in the repo → **0 syntax errors**.
- Cross-check of every `require("pkg")` call against `package.json` → **0 missing
  dependencies, 0 unused-but-required phantom packages**.
- Cross-check of every relative `require("./...")` against files that actually exist
  on disk → **0 broken local imports** (10 initial hits were all inside comments
  showing example call sites, not real code — verified individually).
- `node test/run-all.js` — the repo's own suite (auth, sessions, wallet/gift/recharge,
  rooms, seats, voice/video signaling, Redis cross-instance behavior, RBAC, rate
  limits, KYC, ranking, agency commission, WhatsApp/SMS, TURN/ICE, LiveKit SFU
  contracts, etc.):
  **Suites: 52/52 passed — 614 individual assertions passed, 0 failed.**
- Targeted static review (read, not just grepped) of: `security/userAuth.js`,
  `security/session.js`, `security/otpService.js`, `security/refreshTokens.js`,
  `security/corsConfig.js`, `security/headers.js`, `security/validation.js`,
  `security/bruteForce.js`, `security/rateLimiter.js`, `middleware/idempotency.js`,
  the `/api/gifts/send` and `/api/video-gifts/send` handlers in `server.js`, and the
  Android `AndroidManifest.xml` / `app/build.gradle.kts` / `MainActivity.kt` WebView
  + JS-bridge + SSL-handling code.
- Pattern sweeps across the whole repo for: hardcoded secrets, `eval()`, insecure
  `Math.random()` used for tokens/OTP, string-concatenated SQL, unprotected
  `/api/admin/*` routes, and `TODO`/`FIXME`/`HACK` markers.

## 2. Findings by your priority list

**1. Node.js/server runtime & logic** — No syntax errors, no missing/broken
`require()`s. `server.js` (480 KB) was spot-checked in the areas below rather than
read line-by-line in full; see §3.

**2. API routes, auth, session, OTP, error handling** — `security/userAuth.js` issues
opaque `crypto.randomBytes(32)` tokens (not JWT, not guessable), persists them to
disk so a restart doesn't force-logout everyone, and has a Redis-mirror + PostgreSQL
fallback for multi-instance deployments, all fire-and-forget so a down Redis/Postgres
never breaks login. `security/otpService.js` explicitly uses `crypto.randomInt`
(comments confirm `Math.random()` was deliberately removed). All 73 `/api/admin/*`
routes require `requireAdmin` except `/api/admin/login` itself, which is correctly
public but rate-limited (`adminLoginLimiter`). **No fix needed** — nothing broken
found.

**3. Wallet (Diamonds/Beans), recharge, gifts, balance consistency** —
`/api/gifts/send` snapshots both balances before mutating, rolls the in-memory
snapshot back on any mid-sequence error, uses `requestId`-based duplicate-request
detection so a client retry can't double-spend, and pushes real-time wallet updates
to both sender and receiver. `rechargeService.test.js` alone has 63 passing
assertions covering the "server-first" PENDING → PAYMENT_SUBMITTED → PAID flow,
concurrent-approve double-credit prevention, and ownership checks. **No fix
needed.**

**4. Voice/video, room, 12-seat, permissions, reconnect** — Covered by
`seatAdjacency.test.js` (22/22 — seat-neighbor geometry incl. row-wrap edge case),
`seatChangeVoiceRenegotiation.test.js` (7/7), `roomJoinRpc`/`roomOpRpc`/
`roomStateJoinRace` (43/43), `voiceCrossInstanceEmit`/`voiceRecoveryStatic`/
`voiceSfuLiveKitIntegration` (35/35), `twoNodeCluster.test.js` (27/27 — presence,
cross-instance notifications, reconnect-to-a-different-node room continuity). On the
Android side, camera/mic are declared as **optional** hardware features (so the app
isn't hidden from devices without them on the Play Store) and the WebView's
`onPermissionRequest`/SSL-error handling was read directly — SSL errors are
`handler.cancel()`'d, not bypassed. **No fix needed** in what was reviewable
statically; live multi-device WebRTC reconnect quality is **Needs Runtime Testing**
(see §4).

**5. Custom gifts, gift upload/send, profile GIF, media upload** — Upload routes are
behind `requireAdmin` + `requirePermission("gifts:manage")`. `giftCrossInstanceEmit`
and the gift-send transaction logic (see §3 above) pass their tests. Actual image/GIF
processing (Jimp/Sharp) was not exercised since it needs the real packages installed.
**Needs Runtime Testing.**

**6. Admin panel, Agency Center, Diamond Center, KYC, withdrawal/salary/report** —
`agencyCommission.test.js`, `agencyRanking.test.js`, `diamondCenter.test.js`,
`countryKyc.test.js`, `hostSalary.test.js`, `payoutWithdrawal.test.js`,
`rbacAccessControl.test.js`, `rbacEscalation.test.js` all pass. **No fix needed**
statically; real payout/withdrawal against a live payment processor is **Needs
Runtime Testing.**

**7. Database/Redis/Firebase/Agora integration & transaction consistency** — The
newer "Module 4" Postgres wallet ledger (`integration_update/module4_wallet_ledger/`)
is **intentionally unwired** behind `MODULE4_WALLET_ENABLED=false` — this is
documented in `WALLET_CUTOVER_PLAN.md` and `FILE_BY_FILE_STATUS.md` as a deliberate,
not-yet-signed-off cutover, not a bug or leftover dead code. Per your explicit
instruction not to change working behavior without cause, **it was left disabled and
untouched** — flipping it on is a deployment decision for you, not something to do
silently in a cleanup pass. **Needs Runtime Testing** (real Postgres) before any
future cutover.

**8. Security: secrets, unsafe endpoints, validation, authorization** — No hardcoded
secrets found server-side (the one literal API key on disk is the Firebase **client**
`apiKey` in `public/firebaseClient.js`, which is public-by-design in Firebase's own
model — protected by Firebase security rules, not secrecy). No `eval()` outside a
Redis Lua-script `.eval()` call (that's the ioredis API, not JS eval). No
string-concatenated SQL — every query found uses `$1,$2...` parameterization.
**No fix needed.**

**9. Dead/unused code, duplicate/conflicting implementations** — The only
"duplicate-looking" system found is the Module 4 wallet ledger vs. the legacy
in-memory wallet — already covered in item 7; it's a documented, flagged-off,
not-yet-cut-over module, not conflicting production logic. No `TODO`/`FIXME`/`HACK`
markers exist anywhere in the codebase (0 hits). No genuinely dead/unreachable code
was identified in the areas reviewed. A full dead-code sweep of a 480 KB `server.js`
line-by-line was not done in this pass — flagging as a possible follow-up, not a
confirmed issue.

**10. Android WebView wrapper, manifest, permissions, Gradle/release config** —
`AndroidManifest.xml`: camera/mic/bluetooth marked `android:required="false"` via
`<uses-feature>` (so Play Store doesn't hide the listing on devices without them),
`usesCleartextTraffic` driven by a Gradle property that defaults to `false`,
`FileProvider` correctly declared and wired to camera-capture. `app/build.gradle.kts`:
release build has `isMinifyEnabled = true`, `isShrinkResources = true`, ProGuard
rules applied, and a real release `signingConfig` that reads
`PINGPONG_KEYSTORE_FILE`/`PASSWORD`/`ALIAS`/`KEY_PASSWORD` from the environment —
with a clearly-labeled, warning-logged local-only fallback keystore for test builds
that explicitly tells you **not** to upload it to Play Console. `versionCode = 5`,
`versionName = "1.4.0"`. `MainActivity.kt`: SSL errors are cancelled (not bypassed),
`addJavascriptInterface`'s bridge methods re-check the WebView's current origin
before doing anything (mitigating the known Android WebView JS-bridge risk),
`allowFileAccessFromFileURLs`/`allowUniversalAccessFromFileURLs` are both `false`.
**No fix needed.** This could not be *built* here (§0) — see §5 for what you need
to do to actually produce a signed APK.

**11. Frontend UI/UX functional issues, network/API failure handling** —
`onReceivedError`/`onRenderProcessGone` are both handled (network-error toast;
render-process-crash auto-recovers the WebView instead of showing a blank screen).
A full manual pass over `public/app.js` and the room/admin HTML for UI-level bugs
(visual glitches, broken buttons, etc.) requires actually running the app in a
browser/device and was **not done** here — **Needs Runtime Testing.**

**12. Existing data/config compatibility, migration** — `.env.example` declares 95
variables and matches the env vars the production scripts (`production-preflight.js`,
`production-readiness.js`, `production-check.js`, `envReadiness.js`) check for.
`scripts/wallet-opening-balance-migration.js` is idempotent and dry-run-by-default
per its own documentation. **No existing `data/`, custom gifts, frames, or user
records were touched, deleted, or modified in this pass** — only one new file
(this report) was added.

## 3. Changes made in this pass

**None to application code.** Every area above that could be verified through static
review, the existing 52-suite/614-assertion regression run, and config inspection
came back clean — no confirmed bug was found to fix. Per your instruction not to
guess or claim something is "fixed" without being able to verify it, nothing was
speculatively changed. The only file added is this report
(`PRODUCTION_AUDIT_REPORT_2026-09-16.md`) — no existing file was modified, and no
data/feature was touched.

If you're seeing a specific symptom in the running app right now (a particular gift
not crediting, a specific seat not reconnecting, a specific screen crashing) — that's
the fastest way to find a real, fixable bug: tell me exactly what happens and I'll
go straight to that code path.

## 4. Needs Runtime Testing (cannot be confirmed by code review alone)
1. `npm install` + `npm test` in an environment with real network access — to catch
   anything only the actual npm dependency versions would surface.
2. `npm run preflight`, `npm run readiness`, `npm run production:check` against real
   Railway/production environment variables.
3. Database migrations (`npm run db:migrate`) against the real staging/production
   PostgreSQL instance.
4. Redis, TURN (Cloudflare), and the active voice provider (mesh/SFU/LiveKit) with
   real credentials.
5. Building and installing the Android **release** APK (see §5) and manually testing
   on real Android 15/16 devices: camera, microphone, WebRTC/SFU reconnect on a real
   flaky network, file upload from camera vs. gallery, downloads, back-navigation,
   and renderer-crash recovery.
6. End-to-end wallet/gift/recharge/withdrawal, Food Wheel, Teen Patti, room seat,
   host, agency, KYC, and admin-permission flows using real (non-production) test
   accounts against live services.
7. Any eventual Module 4 wallet-ledger cutover (§2 item 7) — requires a real
   Postgres instance and the dry-run migration script's output to be reviewed before
   `MODULE4_WALLET_ENABLED` is ever flipped to `true`.
8. A manual UI/UX pass through the actual web app and admin panel in a real browser
   (§2 item 11).

## 5. About the APK / Play Store
This sandbox has no internet access and no Android SDK, so **no APK was built here**,
and none could be — this is an environment limitation, not something a different
kind of "fix" would get around. The Android project itself is left in a state that
should build cleanly with:
```
cd android
export PINGPONG_KEYSTORE_FILE=/path/to/your/upload-keystore.jks
export PINGPONG_KEYSTORE_PASSWORD=...
export PINGPONG_KEY_ALIAS=...
export PINGPONG_KEY_PASSWORD=...
./gradlew assembleRelease   # or bundleRelease for a Play Store .aab
```
on your own machine, in Android Studio, or in a CI runner (e.g. GitHub Actions —
`.github/workflows/` already exists in this repo) that has network access and the
Android SDK. **Use your real original Play Store upload key** for
`PINGPONG_KEYSTORE_*` — the auto-generated local fallback keystore mentioned in
`app/build.gradle.kts` is explicitly for local testing only and Play Console will
reject it as an update.

## 6. Bottom line
No confirmed, fixable bug was found across the 12 priority areas via static review
plus the existing 52-suite regression run — the codebase (already through many prior
audit/fix passes, per the dozens of dated reports already in this repo) checked out
clean everywhere this pass could verify. That is **not** the same as a guarantee of
zero bugs or of Play Store readiness — it's a statement of what was and wasn't
possible to check without live infrastructure, a real Android build, and real user
traffic. Section 4 is the concrete list of what still needs to happen before you can
honestly call this "100% production-verified."
