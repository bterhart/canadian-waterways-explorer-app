# Deploying from a fresh Windows 11 machine — step by step

Written 2026-10-14. Assumes **nothing** is installed: no Git, no Node, no clone.
Everything below is done in **Windows PowerShell** (Start → type "PowerShell" → open).
Lines starting with `#` are comments, not commands. Things marked **[check]** could not
be verified from the repository and are confirmed once in the relevant web dashboard.

There are three independent deliveries. You can stop after any of them:

| # | What | Where it runs | Needs local tools? |
|---|------|---------------|--------------------|
| A | Merge the fix branch into `main` | GitHub website | **No** |
| B | Deploy the backend | Railway website (or CLI) | **No** if Railway is connected to GitHub |
| C | Build + submit the iOS app to TestFlight | EAS (Expo cloud) | **Yes** — Git, Node, Bun, EAS CLI |

---

## Part A — Merge on the GitHub website (no installs)

The repo is `https://github.com/bterhart/canadian-waterways-explorer-app`.

**State on 2026-10-14 08:01 UTC:** PR #4 (`claude/fix-map-filter-hide-hs4mz` → `main`) was
merged with "Rebase and merge". `main` now contains all of `feat/river-overview-home-layer`
plus the audit/fix commits (verified: `git diff main claude/fix-map-filter-hide-hs4mz` is empty).
Because a rebase-merge gives the commits new hashes, `feat/river-overview-home-layer` still
points at the *old* copies of its 28 commits and GitHub reports "conflicts" against `main`
that are really duplicates. **PR #5 (`feat` → `main`) must be closed, not merged.**

One-time cleanup so the branches stop diverging:
1. Open **https://github.com/bterhart/canadian-waterways-explorer-app/pull/5** → scroll to the
   bottom → **Close pull request** (do NOT click Resolve conflicts or merge).
2. After it closes, a **Delete branch** button appears on the same page → click it
   (deletes `feat/river-overview-home-layer`, whose content is already in `main`).
3. Recreate it from `main`: go to **https://github.com/bterhart/canadian-waterways-explorer-app**,
   click the branch dropdown (says `main`), type `feat/river-overview-home-layer`, click
   **Create branch feat/river-overview-home-layer from main**.
4. Verify: **…/commits/main** shows "docs: rewrite DEPLOY.md…", "fix(mobile): teacher lesson-plan…"
   at the top, and **…/compare/main...feat/river-overview-home-layer** says
   "There isn't anything to compare".

**For every future change (the normal flow):** the work arrives on
`claude/fix-map-filter-hide-hs4mz`; open
**…/compare/main...claude/fix-map-filter-hide-hs4mz** → **Create pull request** → merge with
**Create a merge commit** (not rebase — a merge commit never rewrites hashes, so no branch
can drift). If GitHub says "Can't automatically merge", stop and tell me.

---

## Part B — Backend to Railway

Known from the previous session: Railway service with Root Directory `backend`, Start Command
`bun run src/index.ts`, 13 environment variables already set (Turso URL/token, JWT secrets,
R2, BACKEND_URL). Production URL: `https://canadian-waterways-explorer-app-production.up.railway.app`.

1. Log in at **https://railway.app**, open the project, click the **production** service.
2. **Settings → Source.** **[check]** One of two things is true:

   **B-1. It shows the GitHub repo and a branch (most likely `main`).**
   Auto-deploy is on. Part A already triggered the deploy. Click the **Deployments** tab and wait
   until the top entry says **Active** (2–5 minutes).

   **B-2. Source is empty / "No source connected".**
   Click **Connect Repo**, pick `bterhart/canadian-waterways-explorer-app`, branch `main`.
   Make sure **Settings → Root Directory** is `backend`. Railway deploys immediately and
   on every future push to `main`. (No CLI needed.)

3. Verify from PowerShell — this is the proof the new code is live:
   ```powershell
   curl.exe -s https://canadian-waterways-explorer-app-production.up.railway.app/health
   # expect: {"status":"ok"}

   curl.exe -s -o NUL -w "%{http_code}`n" https://canadian-waterways-explorer-app-production.up.railway.app/api/admin/contributions
   # expect: 401   (before this release it returned 200 with data — that was the security hole)
   ```
   If the second line prints `200`, the old code is still running — wait for the deployment to finish.

The **database** needs nothing for this release: the one schema change (`ImageHealthLog` table)
was already applied to Turso on 2026-10-14. For future schema changes see Part D.

---

## Part C — iOS app to TestFlight (installs required)

The app has no over-the-air updates (`expo-updates` is not installed), so the mobile fixes
(teacher lesson-plan crash, contribution review) only reach phones through a new TestFlight build.

### C-1. Install the tools (once, ~10 minutes)

Open PowerShell and run one line at a time. `winget` is built into Windows 11.

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
```
**Close PowerShell and open a new one** (so the PATH picks up the installs), then:

```powershell
git --version        # expect: git version 2.x
node --version       # expect: v22.x or v20.x
npm --version

# Bun (the project uses bun.lock, so EAS builds with Bun):
powershell -c "irm bun.sh/install.ps1 | iex"
```
**Close and reopen PowerShell again**, then:

```powershell
bun --version        # expect: 1.x
npm install -g eas-cli
eas --version        # expect: eas-cli/16.x or newer (eas.json requires >= 16.17.4)
```

### C-2. Get the code

```powershell
mkdir C:\dev
cd C:\dev
git clone https://github.com/bterhart/canadian-waterways-explorer-app.git
cd canadian-waterways-explorer-app
git checkout main      # only after Part A is done; otherwise use: git checkout claude/fix-map-filter-hide-hs4mz
cd mobile
bun install            # ~1–2 min; installs node_modules from bun.lock
```
(The repo is public, so cloning asks for no password. Pushing later would — Git for Windows
opens a browser login the first time.)

### C-3. Log in to Expo and build

```powershell
eas login              # the Expo account that owns project "canada-waterways-explorer"
eas whoami             # confirms it

eas build --platform ios --profile production
```
What happens / what to answer:
- It may ask to **log in to your Apple Developer account** and whether EAS should manage
  credentials (certificates, provisioning profile). Answer **yes**; the credentials are
  stored on Expo's servers from the previous TestFlight release and are reused.
- The build runs in Expo's cloud (15–25 min). The terminal prints a link like
  `https://expo.dev/accounts/<you>/projects/canada-waterways-explorer/builds/<id>` — you can
  close PowerShell and watch it there.
- The build number is bumped automatically (`autoIncrement: true`, version source `remote`).
  **Do not** edit `version` or `buildNumber` in `app.json`.

### C-4. Submit to TestFlight

When the build is **Finished**:
```powershell
eas submit --platform ios --profile production --latest
```
(`--latest` picks the build you just made; ASC App ID `6759135663` is already in `eas.json`.)
It asks for an App Store Connect login or an API key the first time; the browser flow is fine.

Then: **App Store Connect → My Apps → Canada Waterways Explorer → TestFlight**. The build
appears after Apple processes it (10–30 min). If your tester group doesn't inherit new builds
automatically, add it to the group.

**Alternative without any local installs:** every step of C-3/C-4 can also be done from
**https://expo.dev** → the project → *Builds* → *Create a build* (choose the GitHub repo
and branch when prompted) and, when finished, *Submit to App Store* on the build page.
This requires linking the GitHub repo in the project's settings once.

### Android
On Android, react-native-maps only works with Google Maps, which needs an API key. The key must
not be committed (the repo is public), so `mobile/app.config.js` injects it from an EAS
environment variable at build time. One-time setup:

1. Google Cloud Console → create (or reuse) a project → **APIs & Services → Library → "Maps SDK
   for Android" → Enable**.
2. **Credentials → Create credentials → API key.** Restrict it: *Application restrictions* =
   Android apps, package name `com.bterhart.canadianwaterwaysexplorer`, SHA-1 from
   `eas credentials --platform android` (production keystore); *API restrictions* = Maps SDK for
   Android only.
3. Store it for EAS builds (from `C:\dev\canadian-waterways-explorer-app\mobile`):
   ```powershell
   eas env:create --scope project --environment production --name GOOGLE_MAPS_ANDROID_API_KEY --value <paste key> --visibility secret
   ```
4. Build and submit:
   ```powershell
   eas build --platform android --profile production
   eas submit --platform android --profile production --latest
   ```
Until step 3 is done, do not ship Android: every map screen renders blank there.

---

## Part D — Future database schema changes (reference only)

Turso is never touched by a deploy. When `schema.prisma` gains a table or column:
1. Put the DDL in a new file under `backend/prisma/turso-migrations/` (see the
   2026-10-14 example there).
2. From the clone, with `backend/.env` present (it holds `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`):
   ```powershell
   cd C:\dev\canadian-waterways-explorer-app\backend
   bun install
   bun run scripts/push-turso-schema.ts prisma/turso-migrations/<file>.sql
   ```
   The script is CREATE-only and skips "already exists"; ALTERs must be written explicitly.

---

## Release order for 2026-10-14
1. **Part A** (merge) — 5 minutes, browser only.
2. **Part B** (backend) — mostly waiting; confirm the `401`.
3. **Part C** (iOS) — the only part that needs the installs; ~45 minutes end to end, mostly waiting.
