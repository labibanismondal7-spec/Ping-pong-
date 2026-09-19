# PingPong Android Build Verification — 2026-09-11

## Target
- Production URL: `https://ping-pong-video-live-production.up.railway.app/`
- Android application ID: `com.pingpong.voice`
- Target SDK: 36
- Minimum SDK: 24
- Release version: 1.4.0 (versionCode 5)

## Checks completed in the available build environment
- Repository ZIP inspected: 594 files.
- Android project, Gradle configuration, manifest, WebView bridge, foreground microphone service, FileProvider, and launcher resources inspected.
- All JavaScript source files passed `node --check` syntax validation.
- Production URL is wired as the Android default `WEB_APP_URL`.
- INTERNET, RECORD_AUDIO, CAMERA, audio settings, foreground microphone service, Bluetooth, and notification permissions are declared.
- WebView camera/microphone permission requests are origin-restricted to the production PingPong host.
- WebView renderer-crash recovery is implemented.
- Foreground voice service startup is guarded against runtime exceptions.
- Supplied Ping Pong image was installed as the launcher/splash artwork and all legacy launcher densities were regenerated from that exact image.
- GitHub Actions workflow added to build and upload the release APK automatically.

## Build limitation in this environment
A final binary APK could not be compiled here because the isolated build container has no outbound access to the Gradle distribution server. The project wrapper therefore could not download Gradle 8.11.1. This is an environment limitation, not a reported Android source failure.

The new GitHub Actions workflow is designed to perform the actual `assembleRelease` build on a GitHub-hosted runner, where the Gradle distribution can be downloaded normally.

## Important signing note
If no production signing environment variables are supplied, the Gradle script generates a local test/release keystore. That APK is installable for testing but must **not** be treated as the Play Store update key unless it matches the original signing key.
