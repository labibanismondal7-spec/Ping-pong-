# PingPong production source replacement

This bundle is intended to replace the current GitHub working tree with this
known source snapshot before Railway redeploys it.

## Important
`.gitignore` does **not** remove files that are already tracked by Git. If
the GitHub repository contains old tracked files that are absent from this
bundle, remove those tracked files during the replacement commit.

## Safe replacement from Termux

1. Keep a backup of the current repository.
2. Extract this ZIP into a separate directory.
3. Copy the bundle contents over the repository.
4. Do **not** copy `android/local.properties` or any secrets.
5. Check the diff before committing:

```bash
git status
git diff --stat
git diff -- android/app/build.gradle.kts android/local.properties.example
```

6. Verify the backend URL is the intended Railway deployment:

```bash
grep -RIn "ping-pong-production-5e76.up.railway.app" . --exclude-dir=node_modules || true
grep -RIn "ping-pong-production-5e76.up.railway.app" android/app/build.gradle.kts android/local.properties.example
```

7. Run the server/tests available in the environment:

```bash
npm install
npm test
```

8. Only after the local checks pass:

```bash
git add -A
git status
git commit -m "Restore production working source and Railway URL"
git push origin main
```

Railway should then deploy the pushed commit if its GitHub deployment trigger is
configured for the `main` branch.

## What was changed in this bundle

- Uses the supplied 2026-09-19 project snapshot as the source tree.
- Removes the stale Android default Railway URL from the Gradle build config.
- Removes the same stale URL from `android/local.properties.example`.
- Adds a production-oriented `.gitignore` for local/secrets/build artifacts.
- Does not invent or modify room/game/video-gift business logic without a
  Railway error trace proving that a particular code path is broken.

## Critical deployment rule

Do not rely on `.gitignore` to replace old tracked files. A clean replacement
commit must use `git add -A` after the working tree has been reconciled, so
Git records deletions as well as additions/changes.
