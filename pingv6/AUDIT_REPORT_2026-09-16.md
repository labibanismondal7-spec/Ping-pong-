# PingPong — Comprehensive Production Audit — 2026-09-16

## সারসংক্ষেপ (Executive Summary)

এই কোডবেসটি প্রথমবার দেখা কোনো "কাঁচা" প্রজেক্ট নয় — এটা ইতিমধ্যে অনেকগুলো audit/hardening pass এর মধ্য দিয়ে গেছে (৫০+ `*_REPORT.md`/`*_FIX_*.md` ফাইল প্রমাণ)। কোডে প্রতিটা গুরুত্বপূর্ণ সিদ্ধান্তের কারণ ইন-লাইন কমেন্টে লেখা আছে (কেন fix করা হয়েছে, কী বাগ ছিল)। তাই এই পাসে যা পাওয়া গেছে তা প্রত্যাশিতভাবেই ছোট পরিসরের — বড় কোনো critical bug (auth bypass, double-spend, syntax error) পাওয়া যায়নি।

**যা করা হয়েছে:**
- ২২৮টি `.js` ফাইলে `node --check` — সব pass ✅
- প্রজেক্টের নিজস্ব ৫২টি independent, dependency-free test suite (`node test/run-all.js`, `integration_update/*/test/*` সহ) সত্যিকারভাবে রান করা হয়েছে — **52/52 passed** ✅ (এটা অনুমান নয়, বাস্তবে রান করে দেখা হয়েছে)
- Auth/session/OTP, wallet balance-clamping, rate-limiting, CORS, security headers, multer file-upload validation, Android manifest/Gradle/signing config — সবগুলো ম্যানুয়ালি রিভিউ করা হয়েছে
- Route duplication, hardcoded secrets, dead/orphaned modules, env-var ডকুমেন্টেশন গ্যাপ — grep-based sweep করা হয়েছে

**যা করা যায়নি (environment limitation, অনুমান করে "ঠিক আছে" বলা হয়নি):**
- এই sandbox-এ ইন্টারনেট/নেটওয়ার্ক নেই, তাই `npm install`, আসল PostgreSQL/Redis/Firebase/Agora/LiveKit-এর সাথে সংযোগ, বা `gradlew assembleRelease` চালিয়ে সত্যিকারের APK বিল্ড করা — এসব সম্ভব হয়নি।

---

## পরিবর্তিত ফাইলসমূহ (Changes Applied)

### 1. `.github/workflows/ci.yml` (নতুন ফাইল)
- **সমস্যা ছিল:** প্রজেক্টের নিজস্ব ডকুমেন্টেশন (`FILE_BY_FILE_STATUS.md`) একটা `ci.yml`-এর কথা বলে যেটা `npm test` চালানোর কথা, কিন্তু repo-তে সেই ফাইলটাই ছিল না — শুধু `android-apk.yml` (শুধু APK বিল্ড করে, টেস্ট চালায় না) ছিল। মানে প্রতি push-এ কোনো automatic regression test চলছিল না।
- **কীভাবে fix করা হয়েছে:** নতুন `ci.yml` যোগ করা হয়েছে যা push/PR-এ `npm ci` → সব `.js` ফাইলে syntax check → `npm test` (৫২টা suite) → readiness check চালায়।
- **কীভাবে verify করা হয়েছে:** YAML syntax `python3 -m yaml` দিয়ে parse করে যাচাই করা হয়েছে; এর ভেতরে যা কমান্ড আছে (`node --check`, `npm test`) সেগুলো এই sandbox-এই সরাসরি চালিয়ে ৫২/৫২ pass কনফার্ম করা হয়েছে।
- **Runtime testing দরকার:** GitHub-এ push করার পর Actions ট্যাবে গিয়ে workflow সত্যিই সবুজ (green) হয় কিনা দেখতে হবে — GitHub Actions-এর নিজস্ব internet access লাগে যা এই sandbox-এ নেই।

### 2. `.github/workflows/android-apk.yml` (পরিবর্তিত, কোনো existing behavior ভাঙা হয়নি)
- **সমস্যা ছিল:** এই workflow চাইলে release keystore secret ব্যবহার করার সুযোগ ছিল না — `build.gradle.kts`-এ real-keystore env var-গুলো (`PINGPONG_KEYSTORE_FILE` ইত্যাদি) চেক হয় ঠিকই, কিন্তু CI কখনো সেগুলো পাস করত না। ফলে **প্রতিবার CI দিয়ে বিল্ড করলে একটা নতুন throwaway/local keystore দিয়ে সাইন হতো** — এটা দিয়ে Play Store-এ existing app আপডেট করতে গেলে reject হবে, এবং কেউ খেয়াল না করলে বুঝতেই পারবে না যে তার "real" release key আসলে কখনো ব্যবহার হয়নি।
- **কীভাবে fix করা হয়েছে:** ঐচ্ছিক ধাপ যোগ করা হয়েছে — যদি repo-তে `PINGPONG_KEYSTORE_BASE64` (+ password/alias secrets) সেট করা থাকে, তাহলে সেটা decode করে real keystore দিয়ে সাইন হবে; সেট না থাকলে **আগের মতোই** throwaway keystore ব্যবহার হবে (backward compatible, কারো কিছু ভাঙে না)।
- **কীভাবে verify করা হয়েছে:** YAML syntax valid; conditional (`if:`) লজিক অনুযায়ী secret না থাকলে ধাপটা skip হবে, এটা GitHub Actions-এর স্ট্যান্ডার্ড pattern।
- **Runtime testing দরকার:** আসল Play Store keystore থাকলে সেটা base64 করে repo secret-এ বসিয়ে একবার build ট্রিগার করে দেখতে হবে যে সঠিকভাবে সাইন হচ্ছে কিনা (`jarsigner -verify` বা `apksigner verify`)।

### 3. `.env.example` (পরিবর্তিত — শুধু ডকুমেন্টেশন যোগ, কোনো existing লাইন মোছা/পরিবর্তন হয়নি)
- **সমস্যা ছিল:** কোডে ব্যবহৃত ৬৬টি environment variable (`ADMIN_PASSWORD`, `ADMIN_USERNAME`, `CORS_ORIGINS`, `FIREBASE_SERVICE_ACCOUNT_BASE64`, `MODULE4_WALLET_*`, `OPENAI_API_KEY` ইত্যাদি) `.env.example`-এ ডকুমেন্ট করা ছিল না। বেশিরভাগেরই কোডে সেফ ডিফল্ট আছে, কিন্তু deployer এগুলোর অস্তিত্বই জানতে পারবে না।
- **কীভাবে fix করা হয়েছে:** ফাইলের শেষে একটা নতুন "AUDIT ADDENDUM" সেকশন যোগ করা হয়েছে যেখানে এই ৬৬টা variable, প্রতিটার ডিফল্ট আচরণ ও কোন মডিউল সেটা পড়ে তার ব্যাখ্যাসহ তালিকাভুক্ত করা হয়েছে। বিশেষভাবে `MODULE4_WALLET_ENABLED=false` রাখা হয়েছে (ডিফল্ট, deliberately off) — এটা ভুলে `true` করে ফেললে un-migrated wallet ledger চালু হয়ে যেতে পারত।
- **কীভাবে verify করা হয়েছে:** কোডের সব `process.env.X` reference বের করে `.env.example`-এর সাথে মিলিয়ে gap বের করা হয়েছে (grep diff); এখন সব ব্যবহৃত variable ডকুমেন্টেড।
- **Runtime testing দরকার:** কিছুই না — এটা pure ডকুমেন্টেশন, রানটাইম আচরণ অপরিবর্তিত।

---

## যা রিভিউ করা হয়েছে কিন্তু পরিবর্তনের দরকার পাওয়া যায়নি (Verified Clean)

| এলাকা | পাওয়া গেছে |
|---|---|
| Auth/session (`security/userAuth.js`, `session.js`) | Token opaque + HMAC নেই কিন্তু crypto.randomBytes(32), idle+absolute timeout, cross-instance Redis fallback, restart-safe disk persistence — সব ঠিকঠাক |
| OTP (`security/otpService.js`) | crypto.randomInt, salted HMAC hash storage (plaintext কখনো disk/log-এ যায় না), constant-time compare, resend cooldown, max attempts — সব ঠিকঠাক |
| Rate limiting | `apiLimiter` সব `/api` route-এ global, `authLimiter`/`otpLimiter`/`adminLoginLimiter` নির্দিষ্ট sensitive route-এ ঠিকভাবে wired |
| CORS/Security headers | env-driven allowlist, HTTP+Socket.IO উভয়ের জন্য শেয়ার্ড মডিউল থেকে wired |
| Wallet balance overflow/negative guard | `clampDiamondBalance`/`clampBeansBalance` — NaN/Infinity/negative/ceiling সব guard করা |
| File upload (multer) | প্রতিটা upload endpoint-এ file-size limit + mimetype whitelist আছে (unbounded upload নেই) |
| Route duplication | ১৫৯টা `app.*()` route-এর মধ্যে কোনো duplicate path পাওয়া যায়নি |
| Hardcoded secrets | কোনো hardcoded API secret/password পাওয়া যায়নি (Firebase client `apiKey` browser-side এর জন্য normal — domain-restricted) |
| Android Manifest | camera/mic `uses-feature required=false` (তা না হলে Play Store camera/mic ছাড়া ডিভাইসে app hide করে দিত), FileProvider সঠিকভাবে registered |
| `build.gradle.kts` signing | fallback keystore নিয়ে স্পষ্ট সতর্কতা কমেন্ট আছে, minify+shrink release build-এ চালু |
| Dead code candidates | `integration_update/admin_updates`, `integration_update/api`, `integration_update/call_hosting` — এগুলো ইচ্ছাকৃতভাবে "future use" scaffolding হিসেবে ডকুমেন্টেড, প্রোডাকশনে wire করা নেই কিন্তু bug না — কোনো action দরকার নেই |

---

## Needs Runtime Testing (কোড রিভিউ দিয়ে নিশ্চিত করা সম্ভব না — বাস্তবে টেস্ট করতে হবে)

### ১. Server logic/runtime
- Load-এর নিচে memory leak/GC pressure (৪৮০KB single-file server.js) — production traffic দিয়ে monitor করতে হবে

### ২. Auth/OTP/API
- Real SMS gateway দিয়ে actual OTP delivery
- Firebase phone-auth production credential দিয়ে login flow

### ৩. Wallet (Diamonds/Beans/Recharge/Gift)
- আসল payment gateway (UPI/recharge) দিয়ে end-to-end recharge → balance credit
- একই সাথে অনেক ইউজার concurrent gift পাঠালে race condition আছে কিনা (load test)
- `MODULE4_WALLET_ENABLED=true` করে migration চালানোর আগে staging DB-তে পুরো cutover টেস্ট

### ৪. Voice/Video/Room/12-seat
- আসল Agora/LiveKit credential দিয়ে call quality, reconnect, seat-change renegotiation
- একাধিক device/network (WiFi↔4G switch) এ mic/camera permission flow ও recovery

### ৫. Gifts/Media upload
- আসল S3/R2 bucket credential দিয়ে upload→CDN delivery
- বড় GIF/video ফাইল আপলোডে actual latency/timeout

### ৬. Admin/Agency/Diamond Center/KYC/Withdrawal
- Real admin credential দিয়ে পুরো approval workflow (agency approval → commission → salary payout)
- KYC document আপলোড ও verification-এর real country-specific rule

### ৭. DB/Redis/Firebase/Agora integration
- Real PostgreSQL + Redis cluster-এ multi-instance (২+ node) deployment টেস্ট (কোডে টেস্ট mock দিয়ে pass করে, কিন্তু real infra-তে network partition/latency আলাদা আচরণ করতে পারে)

### ৮. Security
- বাস্তব penetration test / dependency vulnerability scan (`npm audit`, এই sandbox-এ network না থাকায় চালানো যায়নি)

### ৯. Dead/duplicate code
- `integration_update/*` future-scaffolding modules ভবিষ্যতে চালু করার সময় ফের রিভিউ দরকার

### ১০. Android build/release
- **আসল সাইন করা APK/AAB বিল্ড করে Play Console-এ আপলোড করে দেখা** (এই sandbox-এ Android SDK/Gradle নেটওয়ার্ক না থাকায় সম্ভব হয়নি)
- Android 15/16 রিয়েল ডিভাইসে camera/mic permission, WebView reconnect, back-navigation, file-chooser

### ১১. Frontend UI/UX
- ধীর/অস্থির নেটওয়ার্কে actual UI behavior (loading state, retry, error toast)

### ১২. Data/migration compatibility
- `db:migrate-json` স্ক্রিপ্ট দিয়ে real production JSON ডেটা থেকে Postgres migration ড্রাই-রান (staging-এ)

---

## APK/Play Store সম্পর্কে স্পষ্ট কথা

- এই sandbox environment-এ **ইন্টারনেট নেই এবং Android SDK ইনস্টল করা নেই**, তাই এখানে সত্যিকারের সাইন করা `.apk`/`.aab` বিল্ড করা সম্ভব না — এটা অনুমান নয়, প্রযুক্তিগত সীমাবদ্ধতা।
- তবে প্রজেক্টে যা আছে তা দিয়ে **আপনি নিজে সহজেই বিল্ড করতে পারবেন**, দুইভাবে:
  1. **GitHub Actions (সবচেয়ে সহজ):** কোড GitHub-এ push করে `.github/workflows/android-apk.yml` workflow ম্যানুয়ালি ট্রিগার করলেই CI নিজে থেকে APK বিল্ড করে দেবে (এখন real keystore secret অপশনও আছে, উপরে দেখুন)।
  2. **নিজের কম্পিউটারে/Android Studio-তে:** `android/` ফোল্ডারে গিয়ে `./gradlew assembleRelease` চালালেই হবে (Android SDK + internet লাগবে)।
- Play Store-এ দেওয়ার আগে অবশ্যই real keystore secret সেট করে নিন (উপরের item ২ দেখুন) — নাহলে auto-generated throwaway key দিয়ে সাইন হবে যেটা existing app আপডেট করার জন্য কাজ করবে না।

---

## ডেটা/ফিচার সেফটি নিশ্চয়তা

- কোনো existing feature, custom gift, user level, `data/` ফোল্ডারের ফাইল, বা কনফিগারেশন **মোছা বা replace করা হয়নি**।
- সব পরিবর্তন **additive** (নতুন ফাইল, অথবা existing ফাইলে শুধু যোগ করা) — কোনো working লজিক পরিবর্তন করা হয়নি।
- পরিবর্তনের পর পুরো ৫২-suite test আবার চালিয়ে কনফার্ম করা হয়েছে যে সব আগের মতোই pass করছে (কিছু ভাঙেনি)।
