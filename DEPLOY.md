# Deploying — backend (Railway) and mobile (EAS / TestFlight)

Written 2026-10-14 for a Windows 11 workstation (PowerShell). Facts marked
**[check]** could not be verified from the repo and must be confirmed once in the
respective dashboard; after that this file can be corrected.

## 0. Branch flow (how changes reach `main`)

Work lands on a feature branch; you merge it yourself. Current state:

- `claude/fix-map-filter-hide-hs4mz` = `feat/river-overview-home-layer` + the audit/fix commits.
- `feat/river-overview-home-layer` is 28 commits ahead of `main`; `main` has nothing `feat` lacks.
  The 28 commits touch `mobile/` and docs only — `backend/` is identical between `main` and `feat`.

```powershell
cd <your clone>
git fetch origin
git checkout feat/river-overview-home-layer
git merge --ff-only origin/claude/fix-map-filter-hide-hs4mz   # fast-forward; no merge commit
git push origin feat/river-overview-home-layer

git checkout main
git merge --ff-only feat/river-overview-home-layer            # main has no divergent commits
git push origin main
```

If `--ff-only` refuses, stop: something was pushed to that branch outside this flow —
inspect with `git log --oneline --graph origin/main origin/feat/river-overview-home-layer -20`.

## 1. Backend → Railway

Railway service facts from the previous session: Root Directory `backend`, Start Command
`bun run src/index.ts`, 13 environment variables set in Railway (Turso URL/token, JWT
secrets, R2, BACKEND_URL). Two services/environments exist (URLs in `mobile/eas.json`):
`…-production.up.railway.app` and `…-preview.up.railway.app`.

**[check] once:** Railway dashboard → the production service → *Settings → Source*. It will
show either a connected GitHub repo + branch, or nothing.

### 1a. If Source shows GitHub + a branch (auto-deploy)
Pushing to that branch deploys. If the branch is `main`, step 0 above is the deploy.
Watch *Deployments* until the new one is **Active**, then verify:

```powershell
curl.exe -s https://canadian-waterways-explorer-app-production.up.railway.app/health
# expect {"status":"ok"}
curl.exe -s -o NUL -w "%{http_code}`n" https://canadian-waterways-explorer-app-production.up.railway.app/api/admin/contributions
# expect 401 (was 200 before the auth fix) — this is the proof the new code is live
```

### 1b. If Source is empty (manual deploy with the Railway CLI)
```powershell
npm install -g @railway/cli        # once
railway login                       # opens a browser
cd <your clone>\backend
railway link                        # pick the project, then the production service
railway up                          # uploads backend/ and deploys it
```
Then run the two `curl.exe` checks above.

### 1c. The database schema (only when `schema.prisma` gains a table/column)
Turso is never touched by deploys. New DDL goes in a file under
`backend/prisma/turso-migrations/` and is applied by hand:

```powershell
cd <your clone>\backend
bun run scripts/push-turso-schema.ts prisma/turso-migrations/<file>.sql
```
`TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` must be in `backend/.env` (they are). The
script is CREATE-only and skips "already exists"; ALTERs must be written explicitly.
The `ImageHealthLog` table was applied this way on 2026-10-14.

## 2. Mobile → TestFlight (iOS)

The app has no `expo-updates`, so every mobile change needs a new store build.
`eas.json` production profile: `appVersionSource: remote`, `autoIncrement: true`
(EAS bumps the build number itself — do **not** edit `buildNumber`/`version` in
`app.json`), iOS distribution `store`, ASC App ID `6759135663`.

```powershell
npm install -g eas-cli              # once; eas.json requires >= 16.17.4
eas login                           # Expo account that owns the project
cd <your clone>\mobile
bun install                         # or npm install — match what the lockfile was made with (bun.lock exists)

eas build --platform ios --profile production
# builds in the cloud; ~15–25 min. Answer "yes" to letting EAS manage credentials if asked.

eas submit --platform ios --profile production --latest
# uploads the build just made to App Store Connect / TestFlight.
```
Then in App Store Connect → TestFlight the build appears after processing (10–30 min);
add it to the tester group if it is not inherited.

Android: the production profile also declares `android.distribution: store`, but there
is **no Google Maps API key in `app.json`** — every map screen renders blank on Android
until one is added (`expo.android.config.googleMaps.apiKey`). Do not ship an Android
build before that is fixed.

## 3. Order for this release
1. Step 0 (merge to `main`).
2. Step 1a or 1b (backend). Confirm `/api/admin/contributions` → 401.
3. Step 2 (iOS build + submit). The teacher lesson-plan crash fix and the contribution
   review fix only reach devices with this build.
