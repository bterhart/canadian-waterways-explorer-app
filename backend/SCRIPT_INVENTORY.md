# Backend script inventory — `backend/*.ts`, `backend/prisma/**/*.ts`, `backend/scripts/**`

> **Status after cleanup (2026-10-14):** paths below are the *pre-cleanup* locations.
> DEAD (38), VIBECODE (3) and the 19 ONE-OFF files carrying embedded secrets or
> password resets were **deleted**. The remaining 90 ONE-OFF files were **moved to
> `backend/archive/{root,prisma,scripts}/`** (see `backend/archive/README.md`).
> The 20 LIVE-TOOL files stay where they were.

Date: 2026-10-14. Branch: `claude/fix-map-filter-hide-hs4mz`. READ-ONLY audit: every file below was opened and read (small files in full; large seed/update files via header + exhaustive grep of every `prisma.<model>.<op>` / `db.<model>.<op>` / raw-SQL statement in the file). Nothing was run, modified or deleted. No secret values are reproduced here.

## Legend

**DB access method**
- `adapter(src/db)` — `import { db } from "../src/db"` → `PrismaClient({ adapter: PrismaLibSQL(TURSO_*) })`. Reaches Turso.
- `adapter(inline)` — the script builds its own `new PrismaLibSQL({url, authToken})` and passes it to `new PrismaClient({ adapter })`. Reaches Turso. Sub-variants: `env` = URL/token from `process.env.TURSO_*`; `HARDCODED` = URL **and auth token are string literals in the source** (see §Credentials).
- `libsql-raw` — `@libsql/client` `createClient({ url: TURSO_DATABASE_URL, authToken })` + raw SQL. Reaches Turso.
- `bare-PrismaClient` — `new PrismaClient()` with **no adapter** → resolves `datasource db { provider = "sqlite", url = env("DATABASE_URL") }` (`backend/prisma/schema.prisma:6-9`) = a local file. **Cannot reach Turso.** `DATABASE_URL` is not defined in `backend/.env` or `backend/.env.production` (variable names checked; values not read), so today these scripts would fail at client init.
- `none` — no database client constructed.

**verdict**
- `DEAD` — bare-PrismaClient (cannot reach Turso) and referenced by no code / `package.json` script. `DEAD (doc-ref only)` = same, but a Markdown file mentions the name (none of those references can make it work).
- `LIVE-TOOL` — reaches Turso (or is a DB-free helper in a live pipeline) and is referenced, or is a plausible re-usable operational tool (audit / export / schema push / KML / overview build / generic read-only report).
- `ONE-OFF` — reaches Turso but is a single historical fix or probe (hardcoded record ids, one named entity, one-time migration, credential reset, etc.).
- `VIBECODE` — shell files tied to the old Vibecode hosting (`api.vibecodeapp.com`, `DATABASE_FILE`, `prisma db push`).

**referenced-by** = grep of the basename across the whole repo (node_modules excluded). `AUDIT_FINDINGS.md` is the repo-root audit document (tracked, commit `c29c0f0`); a mention there is a *finding about* the script, not a use of it. "Lesson A/B" below = `LessonPlan` ids `cmliiajbo0001m2u2lltp5xgn` ("Animals of the Fur Trade") and `cmliiajbw0004m2u260srsthb` ("A Day at the Trading Post").

Totals: **170 files** — 17 root `.ts`, 78 `prisma/*.ts`, 67 `scripts/*.ts`, 5 `scripts/lib/*.ts`, 3 shell files.

---

## 1. `backend/*.ts` — root-level loose scripts (17)

| # | path | DB access | mode | tables | purpose | referenced-by | verdict |
|---|------|-----------|------|--------|---------|---------------|---------|
| 1 | `backend/add-headers.ts` | libsql-raw | write | LessonPlan | Overwrites `narrativeContent` of Lesson A and Lesson B with a version containing `##` headers. | none | ONE-OFF |
| 2 | `backend/check-animals-timeline.ts` | libsql-raw | read-only | LessonPlan | Prints parsed `timeline` JSON for lessons whose title contains "Animals". | none | ONE-OFF |
| 3 | `backend/check-auth-tables.ts` | libsql-raw | read-only | sqlite_master | Lists all tables, then those whose name contains user/account/auth. | AUDIT_FINDINGS.md | ONE-OFF |
| 4 | `backend/check-better-auth-tables.ts` | libsql-raw | read-only | sqlite_master, Teacher (PRAGMA table_info) | Lists tables and dumps the Teacher column layout (looking for Better-Auth tables). | AUDIT_FINDINGS.md | ONE-OFF |
| 5 | `backend/check-fort-william.ts` | adapter(src/db) | read-only | Location, Waterway | Loads Fort William (`cmlhbjrr2000vm2mb4xb3au6o`), finds Kaministiquia and Lake Superior, prints a "schema limitation" note. Despite the function name `updateFortWilliam`, it writes nothing. | AUDIT_FINDINGS.md | ONE-OFF |
| 6 | `backend/check-ids.ts` | libsql-raw | read-only | Explorer, NotableFigure | Looks up one hardcoded id (`cmlijaiex000mm22rseuv61do`) in both tables, prints 5 sample explorer ids. | none | ONE-OFF |
| 7 | `backend/check-narrative.ts` | libsql-raw | read-only | LessonPlan | Prints first 500 chars of `narrativeContent` for Lessons A/B. | none | ONE-OFF |
| 8 | `backend/check-teacher-credentials.ts` | libsql-raw | read-only | `User` | Queries a table named `User` (not declared in `schema.prisma`; whether it exists in Turso is unverified) for teacher/admin/superadmin emails. | none | ONE-OFF |
| 9 | `backend/check-teacher-table.ts` | libsql-raw | read-only | Teacher, AdminUser | Dumps every Teacher and AdminUser row (id, email, name/role, has-password flag). | none | ONE-OFF |
| 10 | `backend/expand-teacher-content.ts` | libsql-raw | write | LessonPlan | Overwrites `mainContent` (teacher content) of Lessons A/B with longer text. | none | ONE-OFF |
| 11 | `backend/find-matching-events.ts` | libsql-raw | read-only | LessonPlan, TimelineEvent | For each timeline entry of two hardcoded lessons, lists TimelineEvent rows with the same year. | none | ONE-OFF |
| 12 | `backend/fix-teacher-password.ts` | libsql-raw | write | Teacher | Hashes a literal password with `Bun.password.hash`, sets `passwordHash` + `status='approved'` for a hardcoded teacher email, prints the credentials. | AUDIT_FINDINGS.md | ONE-OFF — **CREDENTIALS** |
| 13 | `backend/get-full-narrative.ts` | libsql-raw | read-only | LessonPlan | Prints full `narrativeContent` for Lessons A/B. | none | ONE-OFF |
| 14 | `backend/get_location_details.ts` | adapter(src/db) | read-only | Location | Prints selected fields of the Location named "Fort William". | AUDIT_FINDINGS.md | ONE-OFF |
| 15 | `backend/hash-and-update-teacher.ts` | libsql-raw | write | Teacher | Same as #12 but hashes with `bcryptjs` instead of `Bun.password`. | AUDIT_FINDINGS.md | ONE-OFF — **CREDENTIALS** |
| 16 | `backend/migrate-marble-island.ts` | adapter(src/db) | write | Waterway, Location | Moves "Marble Island" (`cml_marble_island`) from Waterway to Location (creates Location with the same id under Hudson Bay, then deletes the Waterway row). | AUDIT_FINDINGS.md | ONE-OFF |
| 17 | `backend/update-both-timelines.ts` | libsql-raw | write | LessonPlan | Replaces `timeline` JSON of Lessons A/B with entries carrying `eventId`/`waterwayId`. | none | ONE-OFF |

---

## 2. `backend/prisma/*.ts` (78) — no sub-directories contain `.ts` files (`prisma/prisma/` holds only `dev.db`)

### 2a. Non-seed scripts (46)

| # | path | DB access | mode | tables | purpose | referenced-by | verdict |
|---|------|-----------|------|--------|---------|---------------|---------|
| 1 | `prisma/add-explorer-portraits.ts` | adapter(inline, env) | write | Explorer | Sets `imageUrl` for explorers whose image is null, from a hardcoded name→Wikimedia `Special:FilePath` map (~50 names). | none | ONE-OFF |
| 2 | `prisma/assess-damage.ts` | adapter(src/db) | read-only | Location, Waterway | Counts entities whose galleries still contain R2-CDN URLs vs. none; counts heroes pointing at Wikimedia. | none | ONE-OFF |
| 3 | `prisma/audit-all-gallery.ts` | adapter(src/db) | read-only | Location, Waterway | Prints every hero/gallery URL classified R2_CDN / FABRICATED (fixed pattern list from the `fix-all-media` incident) / WIKIMEDIA_SPECIFIC. | none | ONE-OFF |
| 4 | `prisma/audit-deletion-list.ts` | adapter(src/db) | read-only | Location, Waterway | Dry-run listing of hero and gallery slots that `execute-cleanup.ts` would delete. | none | ONE-OFF |
| 5 | `prisma/audit-explorers.ts` | adapter(inline, **HARDCODED**) | read-only | Explorer, ExplorerWaterway, Waterway, ArchaeologicalDiscovery | Dumps every explorer with its waterway links and lists explorer names mentioned in discoveries. | none | ONE-OFF — **CREDENTIALS** |
| 6 | `prisma/audit-fix-urls.ts` | adapter(inline, env) | write | Location, Waterway | HEAD-checks every hero/gallery URL; rewrites broken Wikimedia URLs to `Special:FilePath` / direct-upload candidates that return 200. | none | LIVE-TOOL (generic repair; writes) |
| 7 | `prisma/audit-locations.ts` | adapter(inline, **HARDCODED**) | read-only | Location, Waterway | Prints `LOC|id|name|HAS_IMAGE` / `WAY|…` lines. | none | ONE-OFF — **CREDENTIALS** |
| 8 | `prisma/audit-media.ts` | adapter(src/db) | read-only | Location, Waterway | Emits one JSON blob of id/name/imageUrl/galleryImages/videoUrl for all locations and waterways. | none | LIVE-TOOL (read-only export) |
| 9 | `prisma/audit-reading-guide.ts` | adapter(inline, **HARDCODED**) | read-only | Explorer | Prints explorer ids as TS-ready string literals. | none | ONE-OFF — **CREDENTIALS** |
| 10 | `prisma/audit-summary.ts` | adapter(src/db) | read-only | Location, Waterway | Counts hero/gallery URLs by R2 / FABRICATED / SPECIFIC and lists offenders. | none | ONE-OFF |
| 11 | `prisma/audit-thompson.ts` | adapter(inline, **HARDCODED**) | read-only | Explorer, ExplorerWaterway, Waterway | Prints David Thompson (`cmlhaslpx0006m2zhsckolb5o`) and all waterways. | none | ONE-OFF — **CREDENTIALS** |
| 12 | `prisma/check-current-images.ts` | adapter(inline, **HARDCODED**) | read-only | Location, Waterway | Samples 5 imageUrls per table; counts placeholder / wikimedia / null. | none | ONE-OFF — **CREDENTIALS** |
| 13 | `prisma/check-era.ts` | adapter(inline, **HARDCODED**) | read-only | Location, Explorer | Lists `yearEstablished`/type/waterwayId per location and 5 explorers. | none | ONE-OFF — **CREDENTIALS** |
| 14 | `prisma/check-media-detail.ts` | adapter(src/db) | read-only | Waterway, Location | Prints 3 samples each of R2-hero and Wikimedia-hero entities with their galleries. | none | ONE-OFF |
| 15 | `prisma/check-media-full.ts` | adapter(src/db) | read-only | Waterway | Counts waterway hero types and prints 3 samples. | none | ONE-OFF |
| 16 | `prisma/check-media-state.ts` | adapter(src/db) | read-only | Location | Counts location hero/gallery states; prints 8 samples. | none | ONE-OFF |
| 17 | `prisma/check-methye.ts` | adapter(inline, **HARDCODED**) | read-only | Location, Waterway, Explorer, ExplorerWaterway, FurTradeInfo, Cartographer | Dumps Methye Portage, Athabasca River and Peter Pond with relations. | none | ONE-OFF — **CREDENTIALS** |
| 18 | `prisma/check-special-cases.ts` | adapter(src/db) | read-only | Location, Waterway | Prints images for 4 named entities (Port-Royal, Quebec City, Saint John River, Strait of Belle Isle). | none | ONE-OFF |
| 19 | `prisma/check-waterways.ts` | adapter(inline, **HARDCODED**) | read-only | Waterway, ExplorerWaterway | Verifies 5 hardcoded waterway ids exist; lists Thompson's links. | none | ONE-OFF — **CREDENTIALS** |
| 20 | `prisma/delete-broken-urls.ts` | adapter(src/db) | write | many (Waterway, Location, Explorer, UserContribution, FieldTripStop, VirtualFieldTrip, LessonPlan, PrintableResource, VoyageurJourney, JourneyNode, HistoricalEvent, NotableFigure) | Reads `prisma/image-test-results.csv`; for every `NOT_FOUND` row nulls the image field or removes the URL from the gallery/images JSON. Step 3 of the export→test→delete pipeline. | none | LIVE-TOOL (pipeline; destructive) |
| 21 | `prisma/execute-cleanup.ts` | adapter(src/db) | write | Location, Waterway | Nulls hero URLs and strips gallery slots matching R2 or the FABRICATED pattern list. | none | ONE-OFF |
| 22 | `prisma/export-all-images.ts` | adapter(src/db) | read-only (writes `prisma/image-export.csv`) | many (Waterway, Location, Explorer, UserContribution, FieldTripStop, VirtualFieldTrip, LessonPlan, PrintableResource, PrimarySourceDocument, VoyageurJourney, JourneyNode, TimelineEvent, HistoricalEvent, NotableFigure) | Exports every image/gallery URL across 14 tables to CSV. Step 1 of the pipeline. | none | LIVE-TOOL |
| 23 | `prisma/final-portrait-update.ts` | adapter(inline, env) | write | Explorer | Name→portrait map applied to all explorers. | none | ONE-OFF |
| 24 | `prisma/fix-404-images.ts` | adapter(src/db) | write | Location | Sets `imageUrl` for 4 named locations. | none | ONE-OFF |
| 25 | `prisma/fix-404-urls.ts` | adapter(src/db) | write | Location, Waterway | Replaces 3 specific dead Wikimedia URLs wherever they occur in hero/gallery. | none | ONE-OFF |
| 26 | `prisma/fix-all-images.ts` | libsql-raw | write | Location | For a hardcoded list of 99 location ids, queries the Wikipedia API for article images and rewrites `imageUrl` + `galleryImages`. | none | ONE-OFF |
| 27 | `prisma/fix-all-media.ts` | none (neutralised: `export {}` stub, `import { db }` commented out) | n/a | — | Deprecated ("DO NOT RUN"); original body kept as reference. Its header points to `migrate-images-to-cdn.ts`, which **does not exist anywhere in the repo**. | comments in `audit-all-gallery.ts`, `execute-cleanup.ts` | DEAD |
| 28 | `prisma/fix-all-wikimedia-urls.ts` | **bare-PrismaClient** | write | many (LessonPlan, Location, Explorer, VirtualFieldTrip, FieldTripStop, TimelineEvent, PrimarySourceDocument, JourneyNode, HistoricalEvent, NotableFigure, VoyageurJourney) + `$queryRawUnsafe` COUNT | Converts `/thumb/` Wikimedia URLs to `Special:FilePath` in 11 tables. | `prisma/README-IMAGE-URLS.md` (usage + "results from last run"), AUDIT_FINDINGS.md | DEAD (doc-ref only) — README's run counts came from whatever `DATABASE_URL` pointed at, not Turso |
| 29 | `prisma/fix-broken-image-urls.ts` | adapter(inline, env) | write | LessonPlan | Replaces specific wrong Wikimedia filenames in deep-dive `heroImageUrl`/`images`. | none | ONE-OFF |
| 30 | `prisma/fix-broken-images.ts` | adapter(inline, env) | write | Location | Replaces Google-Places photo URLs with a name→Wikimedia map. | none | ONE-OFF |
| 31 | `prisma/fix-champlain.ts` | adapter(inline, env) | write | Explorer | `updateMany` Champlain's portrait URL. | none | ONE-OFF |
| 32 | `prisma/fix-explorer-portraits.ts` | adapter(inline, env) | write | Explorer | Name→portrait map update. | none | ONE-OFF |
| 33 | `prisma/fix-gallery-urls.ts` | adapter(src/db) | write | Location, Waterway | Two-pass gallery repair (known-dead replacements, then thumb→FilePath); does not touch hero. | none | ONE-OFF |
| 34 | `prisma/fix-image-urls-final.ts` | **bare-PrismaClient** | write | Explorer, Location, VirtualFieldTrip, FieldTripStop | "Verified filename" map applied to explorers, locations, field trips/stops. | AUDIT_FINDINGS.md | DEAD (doc-ref only) |
| 35 | `prisma/fix-quebec-city.ts` | adapter(inline, env) | write | Location | Fixes Quebec City hero + one gallery URL. | none | ONE-OFF |
| 36 | `prisma/fix-thompson-db.ts` | adapter(inline, **HARDCODED**) | write | ExplorerWaterway | Deletes one link by id (`cmlhc4h1s002lm2oga63nrr7y`), creates 5 Thompson↔waterway links. | none | ONE-OFF — **CREDENTIALS** |
| 37 | `prisma/get-all-explorer-ids.ts` | adapter(inline; URL literal, token from env) + an unused `@libsql/client` client | read-only | Explorer | Prints explorer ids. **Hardcoded host is `canadian-waterways-weston-r.turso.io`, a different database from the `canadianwaterwaysexplorer-bterhart…` host every other hardcoded script uses.** Which (if either) matches `.env` is unverified. | none | ONE-OFF |
| 38 | `prisma/get-explorer-ids-for-crossref.ts` | adapter(inline, **HARDCODED**) | read-only | Explorer | Prints `id|name`. | none | ONE-OFF — **CREDENTIALS** |
| 39 | `prisma/migrate-from-csv.ts` | adapter(src/db) | write | many (Waterway, Location, LessonPlan, VirtualFieldTrip, UserContribution, PrimarySourceDocument, NotableFigure, HistoricalEvent, FieldTripStop, Explorer) + R2 uploads | Self-described ONE-TIME: reads `cleaned_urls_final.csv`, downloads each image, re-encodes with sharp, uploads to Cloudflare R2, rewrites the DB URL per (table, field) sequence. | `prisma/migration-monitor.sh`, AUDIT_FINDINGS.md, stray copy `mobile/mobile/backend/prisma/migrate-from-csv.ts` (differs) | ONE-OFF |
| 40 | `prisma/migrate-images.ts` | adapter(inline, **HARDCODED**) | write | Location, Waterway | Applies `/tmp/image_migration_map.json` (place_id→url) to `imageUrl`. | comment in `fix-all-media.ts` | ONE-OFF — **CREDENTIALS** |
| 41 | `prisma/purge-r2-bucket.ts` | none (AWS S3 client → Cloudflare R2) | n/a (deletes every object in the R2 bucket) | — | Lists and batch-deletes all objects in `R2_BUCKET_NAME`. No DB. Extremely destructive. | none | ONE-OFF |
| 42 | `prisma/test-all-urls.ts` | none | n/a (reads `image-export.csv`, writes `image-test-results.csv`) | — | HEAD-requests every URL with 200 ms spacing; classifies OK / NOT_FOUND / RATE_LIMITED. Step 2 of the pipeline. | none | LIVE-TOOL |
| 43 | `prisma/update-all-explorer-portraits.ts` | adapter(inline, env) | write | Explorer | Large name→portrait map update. | none | ONE-OFF |
| 44 | `prisma/update-three-explorer-portraits.ts` | adapter(inline, env) | write | Explorer | Portraits for Fidler, Button, Harmon. | none | ONE-OFF |
| 45 | `prisma/update-verified-portraits.ts` | adapter(inline, env) | write | Explorer | ~30 "verified 200" portrait URLs; prints count still missing. | none | ONE-OFF |
| 46 | `prisma/verify-urls.ts` | adapter(src/db) | read-only | Location, Waterway | Breaks every hero/gallery URL down by format (Special:FilePath / thumb / direct / other) and lists all thumb URLs. | none | LIVE-TOOL (read-only report) |

### 2b. Seed scripts — all 32 are `bare-PrismaClient` → never targeted Turso

| # | path | DB access | mode | tables | purpose | referenced-by | verdict |
|---|------|-----------|------|--------|---------|---------------|---------|
| 47 | `prisma/seed.ts` | bare-PrismaClient | write | WaterwayType, Waterway, Location, Explorer, ExplorerWaterway, FurTradeInfo, Cartographer, IndigenousNation | Base seed: 4 waterway types, 16 waterways, explorers, cartographers, locations, nations, fur-trade info (skips when counts > 0). | none (no `prisma.seed` key in `package.json`) | DEAD |
| 48 | `prisma/seed-all-waterways-detailed.ts` | bare-PrismaClient | write | Waterway | Updates existing waterways (by name) with generated 400+-point coordinate paths. | none | DEAD |
| 49 | `prisma/seed-comprehensive.ts` | bare-PrismaClient | write | WaterwayType, Waterway, VirtualFieldTrip, FieldTripStop, TimelineEvent, PronunciationGuide, NotableFigure | Adds missing river systems, Métis figures, timeline events, pronunciations, a field trip (find-then-create/update). | none | DEAD |
| 50 | `prisma/seed-credentials.ts` | bare-PrismaClient | write | Teacher, AdminUser | Creates/updates a test teacher, an admin (moderator) and a super-admin with literal passwords; prints them. | AUDIT_FINDINGS.md | DEAD (doc-ref only) — **CREDENTIALS** |
| 51 | `prisma/seed-detailed-boundaries.ts` | bare-PrismaClient | write | Waterway | Updates waterway boundary coordinates (by name). | none | DEAD |
| 52 | `prisma/seed-educational-content.ts` | bare-PrismaClient | write | PrintableResource, PrimarySourceDocument, VirtualFieldTrip (reads Explorer, Waterway, Location) | 8 printables, 6 primary-source documents, 3 field trips. | `SEEDING_SUMMARY.md` | DEAD (doc-ref only) |
| 53 | `prisma/seed-explorers-comprehensive.ts` | bare-PrismaClient | write | Explorer | Adds/updates HBC, NWC, French, Indigenous, Métis explorers by name. | none | DEAD |
| 54 | `prisma/seed-field-trip-images.ts` | bare-PrismaClient | write | VirtualFieldTrip, FieldTripStop | Sets cover/stop image URLs for existing field trips. | none | DEAD |
| 55 | `prisma/seed-fort-carlton-field-trip.ts` | bare-PrismaClient | write | VirtualFieldTrip, FieldTripStop (`deleteMany` stops then re-create) | Fort Carlton field trip + stops. | none | DEAD |
| 56 | `prisma/seed-fur-trade-posts.ts` | bare-PrismaClient | write | Location, FurTradeInfo (reads Waterway) | HBC/NWC forts and posts, upsert-by-name. | none | DEAD |
| 57 | `prisma/seed-gamification.ts` | bare-PrismaClient | write | Achievement, DailyChallenge | Upserts achievements and daily challenges. | none | DEAD |
| 58 | `prisma/seed-historic-waterways.ts` | bare-PrismaClient | write | Waterway, FurTradeInfo, ExplorerWaterway | Upserts 5 fur-trade rivers with explorer links. | none | DEAD |
| 59 | `prisma/seed-historical-events.ts` | bare-PrismaClient | write | HistoricalEvent (`deleteMany` all, then create) | Replaces the whole HistoricalEvent table with a regional event list. | none | DEAD |
| 60 | `prisma/seed-historical-imagery.ts` | bare-PrismaClient | write | Location, HistoricalEvent, WaterwayType, Waterway, NotableFigure, Explorer | Upserts entities with Wikimedia imagery. | none | DEAD |
| 61 | `prisma/seed-historical.ts` | bare-PrismaClient | write | Explorer, ExplorerWaterway, Cartographer, ArchaeologicalDiscovery | Chronological explorers (Norse→Tyrrell), cartographers, discoveries. | none | DEAD |
| 62 | `prisma/seed-indigenous-expanded.ts` | bare-PrismaClient | write | IndigenousWord | Upserts 200+ Indigenous words/phrases. | none | DEAD |
| 63 | `prisma/seed-indigenous-language.ts` | bare-PrismaClient | write | IndigenousWord, WordOfTheDay, VocabularyQuiz, IndigenousStory | Words, word-of-the-day, vocabulary quizzes, stories. | none | DEAD |
| 64 | `prisma/seed-indigenous-words-explorers.ts` | bare-PrismaClient | write | IndigenousWord, Explorer, Cartographer | 100+ words plus missing explorers/cartographers. | none | DEAD |
| 65 | `prisma/seed-laverendrye-portage.ts` | bare-PrismaClient | write | Location, Waterway, WaterwayType, Explorer, ExplorerWaterway, TimelineEvent | Great Dog Portage + La Vérendrye family + de Noyon. | none | DEAD |
| 66 | `prisma/seed-lesson-plans-comprehensive.ts` | bare-PrismaClient | write | LessonPlan | Full K-12 lesson-plan set (find-by-title then create/update). | none | DEAD |
| 67 | `prisma/seed-location-images.ts` | bare-PrismaClient | write | Location (+ `$queryRaw` duplicate check) | Name→Wikimedia image map for forts/posts. | none | DEAD |
| 68 | `prisma/seed-maritime.ts` | bare-PrismaClient | write | WaterwayType, Waterway, Location, Explorer, ExplorerWaterway | Coastal waterways, maritime explorers, landing sites. | none | DEAD |
| 69 | `prisma/seed-missing-waterways.ts` | bare-PrismaClient | write | Waterway, ExplorerWaterway, ArchaeologicalDiscovery | Upserts 14 waterways, links explorers, re-points discoveries. | none | DEAD |
| 70 | `prisma/seed-notable-figures.ts` | bare-PrismaClient | write | NotableFigure | Notable figures (find-by-name then create/update). | none | DEAD |
| 71 | `prisma/seed-portages.ts` | bare-PrismaClient | write | Location, TimelineEvent | Portage locations + related timeline events. | none | DEAD |
| 72 | `prisma/seed-primary-sources-expanded.ts` | bare-PrismaClient | write | PrimarySourceDocument | 8 more primary-source documents. | none | DEAD |
| 73 | `prisma/seed-quizzes.ts` | bare-PrismaClient | write | Quiz, QuizQuestion | 6 quizzes with questions. | none | DEAD |
| 74 | `prisma/seed-rocky-mountain-house-field-trip.ts` | bare-PrismaClient | write | VirtualFieldTrip, FieldTripStop (`deleteMany` stops) | Rocky Mountain House field trip. | none | DEAD |
| 75 | `prisma/seed-super-admin.ts` | bare-PrismaClient | write | AdminUser (upsert), LessonPlan / VirtualFieldTrip / PrimarySourceDocument / PrintableResource (`updateMany` → `isCore=true, visibility='global'` where `createdById IS NULL`) | Creates the super-admin with a literal password and flags all seeded content as core. | `P0_IMPLEMENTATION_SUMMARY.md` | DEAD (doc-ref only) — **CREDENTIALS** |
| 76 | `prisma/seed-ultra-detailed-boundaries.ts` | bare-PrismaClient | write | Waterway | Even denser boundary coordinates. | none | DEAD |
| 77 | `prisma/seed-update.ts` | bare-PrismaClient | write | WaterwayType, Waterway, Location, AdminUser | Adds waterways/locations and a default admin whose `passwordHash` is a **plaintext literal**. | none | DEAD — **CREDENTIALS** |
| 78 | `prisma/seed-voyageur-journeys.ts` | bare-PrismaClient | write | VoyageurJourney, JourneyNode | Two journeys with `createMany` nodes. | none | DEAD |

---

## 3. `backend/scripts/**` (67 `.ts` + 5 `lib/*.ts` + 3 shell)

| # | path | DB access | mode | tables | purpose | referenced-by | verdict |
|---|------|-----------|------|--------|---------|---------------|---------|
| 1 | `scripts/add-links.ts` | libsql-raw | write | LessonPlan | Sets `keyFigures`/`timeline` JSON (with explorerId/waterwayId) for Lessons A/B, then verifies. | none | ONE-OFF |
| 2 | `scripts/add-location-images.ts` | **bare-PrismaClient** | write | Location | Name→Wikimedia image map for locations lacking images. | AUDIT_FINDINGS.md | DEAD (doc-ref only) |
| 3 | `scripts/audit-entity-duplicates.ts` | adapter(src/db) | read-only (optional JSON report via `--out`) | Waterway / Location / Explorer, plus related counts (ExplorerWaterway, HistoricalEvent, UserContribution, PronunciationGuide, MapPin, FurTradeInfo, ArchaeologicalDiscovery, Location) | CLI duplicate finder by `--entity` + `--name`, optional `--with-related`, `--with-overview`. | `package.json` (`audit:entity`, `audit:waterway`, `audit:location`, `audit:explorer`), `lib/audit-args.ts` help text | LIVE-TOOL |
| 4 | `scripts/bootstrap-mackenzie-ontario.ts` | adapter(src/db) | write | Waterway, NotableFigure, **`notableFigureWaterway`** (reads WaterwayType) | Upserts "Mackenzie River (Ontario)" + Roderick McKenzie + a link row with fixed string ids. **`NotableFigureWaterway` is not a model in `schema.prisma` (49 models; NotableFigure has no waterway relation), so `db.notableFigureWaterway` does not exist on the client — the script cannot complete.** | AUDIT_FINDINGS.md | ONE-OFF (broken) |
| 5 | `scripts/build-waterway-overview.ts` | adapter(src/db) | read-only (writes `generated/river-overview.json`) | Waterway (+ type/region) | Parses each waterway's KML into simplified nation/region/local tiers and writes the overview dataset. | `package.json` (`build:waterway-overview`), AUDIT_FINDINGS.md | LIVE-TOOL |
| 6 | `scripts/check-content-depth.ts` | libsql-raw | read-only | LessonPlan | Reports lessons whose content fields are below size thresholds. | none | LIVE-TOOL (read-only report) |
| 7 | `scripts/check-deep-dive-lessons.ts` | libsql-raw | read-only | LessonPlan | Lists lessons that have `narrativeContent`. | none | LIVE-TOOL (read-only report) |
| 8 | `scripts/check-descriptions.ts` | libsql-raw | read-only | LessonPlan | Prints description/grade for Lessons A/B. | none | ONE-OFF |
| 9 | `scripts/check-existing-data.ts` | libsql-raw | read-only | Explorer, Cartographer, IndigenousNation, Location, LessonPlan, Waterway, FurTradeInfo | Dumps reference ids for hand-linking lesson JSON. | none | ONE-OFF |
| 10 | `scripts/check-narrative.ts` | libsql-raw | read-only | LessonPlan | Prints `narrativeContent` of Lesson B. | none | ONE-OFF |
| 11 | `scripts/check-publish-status.ts` | libsql-raw | read-only | LessonPlan | Lists `isPublished` per lesson. | none | LIVE-TOOL (read-only report) |
| 12 | `scripts/check-working-format.ts` | libsql-raw | read-only | LessonPlan | Prints JSON field samples of Red River Cart (`cmliiajcq000am2u2h58ck1el`). | none | ONE-OFF |
| 13 | `scripts/expand-all-21-lessons.ts` | libsql-raw | write | LessonPlan | Bulk-rewrites 11 content columns for 21 hardcoded lesson ids. | none | ONE-OFF |
| 14 | `scripts/expand-all-deep-dives.ts` | libsql-raw | write | LessonPlan | Rewrites 13 columns (incl. keyFigures/timeline) for hardcoded deep-dive lessons. | none | ONE-OFF |
| 15 | `scripts/fix-all-formats.ts` | libsql-raw | write | LessonPlan | Normalises heroImageUrl/keyFigures/timeline/images/activities/curriculumConnections/assessment/extensions formats for all rows. | none | ONE-OFF |
| 16 | `scripts/fix-database-duplicates.ts` | **bare-PrismaClient** | write | Explorer, ExplorerWaterway (+ `$queryRaw`) | Deletes hardcoded duplicate explorer ids, re-points/deletes orphan links. | AUDIT_FINDINGS.md | DEAD (doc-ref only) |
| 17 | `scripts/fix-final.ts` | libsql-raw | write | LessonPlan | Sets description/heroImageUrl/images for Lessons A/B. | none | ONE-OFF |
| 18 | `scripts/fix-json-fields.ts` | libsql-raw | write | LessonPlan | Normalises objectives/materials/activities/discussionQuestions/assessment/extensions/curriculumConnections JSON. | none | ONE-OFF |
| 19 | `scripts/fix-waterway-kml.ts` | adapter(src/db) | write (`--mode=apply`/`clear`; default `dry-run`) | Waterway | CLI to parse, filter, write, apply or clear one waterway's KML. | `scripts/fix-waterway-kml-README.md` | LIVE-TOOL |
| 20 | `scripts/get-expanded-lesson-example.ts` | libsql-raw | read-only | LessonPlan | Prints field presence for Red River Cart. | none | ONE-OFF |
| 21 | `scripts/lib/audit-args.ts` | none | n/a | — | CLI argument parser/help for the audit tool. | `audit-entity-duplicates.ts`, `lib/audit-loaders.ts` | LIVE-TOOL (support) |
| 22 | `scripts/lib/audit-format.ts` | none | n/a | — | Text/summary formatter for audit reports. | `audit-entity-duplicates.ts` | LIVE-TOOL (support) |
| 23 | `scripts/lib/audit-loaders.ts` | none (receives `db` as a parameter; type-only `PrismaClient` import) | read-only | Waterway, Location, Explorer | Loads candidate rows by name/match mode and builds the report. | `audit-entity-duplicates.ts`, other lib files, AUDIT_FINDINGS.md | LIVE-TOOL (support) |
| 24 | `scripts/lib/audit-overview.ts` | none | n/a (reads `generated/river-overview.json`) | — | Matches candidates against the overview dataset. | `audit-entity-duplicates.ts` | LIVE-TOOL (support) |
| 25 | `scripts/lib/audit-relations.ts` | none (receives `db`) | read-only | ExplorerWaterway, HistoricalEvent, UserContribution, PronunciationGuide, MapPin, FurTradeInfo, ArchaeologicalDiscovery, Location | Counts related rows per candidate and builds recommendations. | `audit-entity-duplicates.ts` | LIVE-TOOL (support) |
| 26 | `scripts/list-all-lessons.ts` | libsql-raw | read-only | LessonPlan | Lists lessons as EXPANDED/BASIC with hero image. | none | LIVE-TOOL (read-only report) |
| 27 | `scripts/populate-all-lesson-hero-images.ts` | **bare-PrismaClient** | write | LessonPlan | Title→hero image map. | AUDIT_FINDINGS.md | DEAD (doc-ref only) |
| 28 | `scripts/populate-david-thompson.ts` | libsql-raw | write | LessonPlan | Narrative/teacher fields for one lesson. | none | ONE-OFF |
| 29 | `scripts/populate-deep-dives.ts` | libsql-raw | write | LessonPlan | Red River Cart narrative/teacher fields. | none | ONE-OFF |
| 30 | `scripts/populate-gallery-images.ts` | libsql-raw | write | Location | Google Places photo lookup → `galleryImages`. | none | ONE-OFF — **CREDENTIALS** (Google key) |
| 31 | `scripts/populate-google-imagery.ts` | libsql-raw | write | Location | Google Places → `imageUrl` for locations lacking one. | none | ONE-OFF — **CREDENTIALS** (Google key) |
| 32 | `scripts/populate-google-video.ts` | libsql-raw (**HARDCODED** Turso URL + token) | write | Location, Waterway | Street View metadata / Maps embed → `videoUrl`. | none | ONE-OFF — **CREDENTIALS** (Turso token + Google key) |
| 33 | `scripts/populate-louis-riel.ts` | libsql-raw | write | LessonPlan | One lesson's narrative/teacher fields. | none | ONE-OFF |
| 34 | `scripts/populate-video-urls.ts` | libsql-raw | write | Location, Waterway | Curated YouTube URLs by entity name → `videoUrl`. | none | ONE-OFF |
| 35 | `scripts/populate-voyageur-life.ts` | libsql-raw | write | LessonPlan | One lesson's narrative/teacher fields. | none | ONE-OFF |
| 36 | `scripts/populate-waterway-gallery.ts` | libsql-raw | write | Waterway | Google Places → `imageUrl` + `galleryImages`. | none | ONE-OFF — **CREDENTIALS** (Google key) |
| 37 | `scripts/populate-women-fur-trade.ts` | libsql-raw | write | LessonPlan | One lesson's narrative/teacher fields. | none | ONE-OFF |
| 38 | `scripts/push-turso-schema.ts` | libsql-raw | write (DDL) | every table in `/tmp/turso_schema.sql` | Executes hand-written CREATE statements one by one, skipping "already exists". The only schema-delivery mechanism to Turso. | AUDIT_FINDINGS.md, `.claude/rules/api-patterns.md` | LIVE-TOOL |
| 39 | `scripts/query-lessons.ts` | libsql-raw | read-only | LessonPlan | Per-lesson content-presence report. | none | LIVE-TOOL (read-only report) |
| 40 | `scripts/replace-placeholder-images.ts` | libsql-raw | write | Location | Google Places replacement for a placeholder `imageUrl`. | none | ONE-OFF — **CREDENTIALS** (Google key) |
| 41 | `scripts/replace-remaining-duplicates.ts` | libsql-raw | write | Location | Google Places text/nearby search to de-duplicate `imageUrl`. | none | ONE-OFF — **CREDENTIALS** (Google key) |
| 42 | `scripts/review-updated-lessons.ts` | libsql-raw | read-only | LessonPlan | Prints full narrative/teacher text for Lessons A/B. | none | ONE-OFF |
| 43 | `scripts/update-canoe-builders.ts` | libsql-raw | write | LessonPlan | Full column rewrite of lesson `cmliiajbt0003m2u27u32vbfr`, then verify. | none | ONE-OFF |
| 44 | `scripts/update-country-marriages.ts` | libsql-raw | write | LessonPlan | Same pattern, `cmliiajde000em2u2hdx1wen2`. | none | ONE-OFF |
| 45 | `scripts/update-david-thompson.ts` | libsql-raw | write | LessonPlan | `cmliiajcg0007m2u2po4lyhcw`. | none | ONE-OFF |
| 46 | `scripts/update-economics-empire.ts` | libsql-raw | write | LessonPlan | `cmliiajdk000fm2u2maena1rg`. | none | ONE-OFF |
| 47 | `scripts/update-environmental-impact.ts` | libsql-raw | write | LessonPlan | `cmliiajds000im2u2op3br5x9`. | none | ONE-OFF |
| 48 | `scripts/update-explorers-ships.ts` | libsql-raw | write | LessonPlan | `cmliiajc30005m2u2rt6xuz2e`. | none | ONE-OFF |
| 49 | `scripts/update-fall-new-france.ts` | libsql-raw | write | LessonPlan | `cmliiajdv000jm2u2f2sgv1nj`. | none | ONE-OFF |
| 50 | `scripts/update-following-rivers.ts` | libsql-raw | write | LessonPlan | `cmliiajbr0002m2u2sj3x76t7`. | none | ONE-OFF |
| 51 | `scripts/update-forts.ts` | libsql-raw | write | LessonPlan | `cmliiajcm0009m2u2xpwxzc17`. | none | ONE-OFF |
| 52 | `scripts/update-great-rivalry.ts` | libsql-raw | write | LessonPlan | `cmliiajd3000bm2u2ya9gqld7`. | none | ONE-OFF |
| 53 | `scripts/update-hbc-modern.ts` | libsql-raw | write | LessonPlan | `cmligbkyc001dm20zsv5hrm6o`. | none | ONE-OFF |
| 54 | `scripts/update-hbc.ts` | libsql-raw | write | LessonPlan | `cmliiajcc0006m2u2n93x5b2b`. | none | ONE-OFF |
| 55 | `scripts/update-historiography.ts` | libsql-raw | write | LessonPlan | `cmliiajdm000gm2u29djof743`. | none | ONE-OFF |
| 56 | `scripts/update-indigenous-perspectives.ts` | libsql-raw | write | LessonPlan | `cmliiajd7000cm2u2r8ta6amg`. | none | ONE-OFF |
| 57 | `scripts/update-indigenous-sovereignty.ts` | libsql-raw | write | LessonPlan | `cmliiajdp000hm2u2p97957m6`. | none | ONE-OFF |
| 58 | `scripts/update-lesson-plans.ts` | libsql-raw | write | LessonPlan | Dynamic `SET` for Voyageur Routes (`cmlheagqq0006m28u7nkab8us`) and HBC-modern (`cmligbkyc001dm20zsv5hrm6o`). | none | ONE-OFF |
| 59 | `scripts/update-louis-riel.ts` | libsql-raw | write | LessonPlan | `cmligbky2001am20zloxux478`. | none | ONE-OFF |
| 60 | `scripts/update-mapping-canada.ts` | libsql-raw | write | LessonPlan | `cmligbky9001cm20z3vukcwiq`. | none | ONE-OFF |
| 61 | `scripts/update-meet-voyageurs.ts` | libsql-raw | write | LessonPlan | `cmliiajbd0000m2u231mzvoiv`. | none | ONE-OFF |
| 62 | `scripts/update-northwest-passage.ts` | libsql-raw | write | LessonPlan | `cmliiajda000dm2u233io4qsk`. | none | ONE-OFF |
| 63 | `scripts/update-pemmican-trail.ts` | libsql-raw | write | LessonPlan | `cmliiajcj0008m2u2gtcpor3y`. | none | ONE-OFF |
| 64 | `scripts/update-red-river-cart.ts` | libsql-raw | write | LessonPlan | `cmliiajcq000am2u2h58ck1el`. | none | ONE-OFF |
| 65 | `scripts/update-two-lessons.ts` | libsql-raw | write | LessonPlan | 13-column rewrite of Lessons A/B + verify. | none | ONE-OFF |
| 66 | `scripts/update-two-lessons-v2.ts` | libsql-raw | write | LessonPlan | Second revision of the same. | none | ONE-OFF |
| 67 | `scripts/update-two-lessons-v3.ts` | libsql-raw | write | LessonPlan | `mainContent` only for Lessons A/B. | none | ONE-OFF |
| 68 | `scripts/update-tyrrell-portrait.ts` | adapter(inline, env) | write | Explorer | Sets Joseph Burr Tyrrell's `imageUrl` if different. | none | ONE-OFF |
| 69 | `scripts/update-voyageur-life.ts` | libsql-raw | write | LessonPlan | `cmligbky00019m20z21c6dp3y`. | none | ONE-OFF |
| 70 | `scripts/update-voyageur-routes.ts` | libsql-raw | write | LessonPlan | `cmlheagqq0006m28u7nkab8us`. | none | ONE-OFF |
| 71 | `scripts/update-women-fur-trade.ts` | libsql-raw | write | LessonPlan | `cmligbky5001bm20zjl63dkn9`. | none | ONE-OFF |
| 72 | `scripts/verify-links.ts` | libsql-raw | read-only | LessonPlan | Prints explorerId/waterwayId presence in Lessons A/B. | none | ONE-OFF |
| 73 | `scripts/start` | none (shell) | n/a | — | Vibecode boot: sources `env.sh`, `sqlite3 VACUUM INTO` backup of `DATABASE_FILE`, `bun install`, `bunx prisma generate`, **`bunx prisma db push --accept-data-loss`** (against the local `DATABASE_URL=file:` from `env.sh`), POSTs to `api.vibecodeapp.com/.../cloud/db/enable`, then `exec bun src/index.ts`. | AUDIT_FINDINGS.md, `.gitignore` (no), `studio` (sources env.sh) | VIBECODE |
| 74 | `scripts/studio` | none (shell) | n/a | — | Sources `env.sh`, `bun install`, `exec bunx cloud-studio --port 3001` (Vibecode DB viewer). | AUDIT_FINDINGS.md, `backend/.gitignore` | VIBECODE |
| 75 | `scripts/env.sh` | none (shell) | n/a | — | In production exports `DATABASE_FILE=${DATA_DIR:-/data}/production.db` and `DATABASE_URL=file:${DATABASE_FILE}` — the local-sqlite URL the bare-PrismaClient scripts would consume. | `scripts/start`, `scripts/studio`, AUDIT_FINDINGS.md | VIBECODE |

Not inventoried as scripts but present in the same folders: `scripts/fix-waterway-kml-README.md` (usage doc for #19), `prisma/README-IMAGE-URLS.md`, `prisma/migration-monitor.sh` (bash loop that re-runs `migrate-from-csv.ts` until exit 0; hardcoded `/home/user/workspace/backend` paths), CSV inputs/outputs (`cleaned_urls_final.csv`, `image-export.csv`, `image-test-results.csv`).

---

## 4. Verdict counts

| verdict | count |
|---|---|
| ONE-OFF | 109 (root 17, prisma 37, scripts 55) |
| DEAD | 38 (prisma 35 = 32 seeds + `fix-all-wikimedia-urls` + `fix-image-urls-final` + `fix-all-media`; scripts 3) |
| LIVE-TOOL | 20 (prisma 6, scripts 14 incl. 5 `lib/` helpers) |
| VIBECODE | 3 |
| **total** | **170** |

---

## 5. Bare-PrismaClient seed scripts — tables each one seeds (for comparison against live Turso row counts)

All 37 bare scripts (32 seeds + 5 fixers) target `env("DATABASE_URL")`. Evidence of where that pointed historically: `backend/prisma/prisma/dev.db` (766 KB, **tracked in git**) is a SQLite file whose bytes contain `CREATE TABLE` statements for all 49 schema tables (Achievement … WordOfTheDay); `backend/dev.db` and `backend/prisma/dev.db` are 0-byte tracked files. Whether any of this content was ever copied into Turso by another path (e.g. the Vibecode `prisma db push` era, a dump/restore, or hand-run SQL) is **unverified** — compare the lists below against live counts.

| seed script | creates / upserts in | also deletes |
|---|---|---|
| `seed.ts` | WaterwayType (4), Waterway (16), Location, Explorer (6+), ExplorerWaterway, FurTradeInfo, Cartographer (2), IndigenousNation | — |
| `seed-update.ts` | WaterwayType, Waterway (2 + 1 update), Location (1), AdminUser (1, plaintext "hash") | — |
| `seed-comprehensive.ts` | WaterwayType, Waterway, VirtualFieldTrip, FieldTripStop, TimelineEvent, PronunciationGuide, NotableFigure | — |
| `seed-historical.ts` | Explorer, ExplorerWaterway, Cartographer, ArchaeologicalDiscovery | — |
| `seed-historical-events.ts` | HistoricalEvent | **`historicalEvent.deleteMany({})` first — wipes the table** |
| `seed-historical-imagery.ts` | Location, HistoricalEvent, WaterwayType, Waterway, NotableFigure, Explorer (image fields) | — |
| `seed-explorers-comprehensive.ts` | Explorer | — |
| `seed-maritime.ts` | WaterwayType, Waterway, Location, Explorer, ExplorerWaterway | — |
| `seed-missing-waterways.ts` | Waterway (14 upserts), ExplorerWaterway, ArchaeologicalDiscovery (updates) | — |
| `seed-historic-waterways.ts` | Waterway (5), FurTradeInfo (5), ExplorerWaterway | — |
| `seed-fur-trade-posts.ts` | Location, FurTradeInfo | — |
| `seed-portages.ts` | Location, TimelineEvent | — |
| `seed-laverendrye-portage.ts` | Location, Waterway, WaterwayType, Explorer, ExplorerWaterway, TimelineEvent | — |
| `seed-detailed-boundaries.ts` / `seed-ultra-detailed-boundaries.ts` / `seed-all-waterways-detailed.ts` | Waterway (coordinate updates only; no inserts) | — |
| `seed-location-images.ts` | Location (imageUrl only) | — |
| `seed-educational-content.ts` | PrintableResource (8), PrimarySourceDocument (6), VirtualFieldTrip (3) | — |
| `seed-primary-sources-expanded.ts` | PrimarySourceDocument (8) | — |
| `seed-lesson-plans-comprehensive.ts` | LessonPlan | — |
| `seed-quizzes.ts` | Quiz (6), QuizQuestion | — |
| `seed-fort-carlton-field-trip.ts` | VirtualFieldTrip, FieldTripStop | `fieldTripStop.deleteMany` for that trip |
| `seed-rocky-mountain-house-field-trip.ts` | VirtualFieldTrip, FieldTripStop | `fieldTripStop.deleteMany` for that trip |
| `seed-field-trip-images.ts` | VirtualFieldTrip, FieldTripStop (image fields) | — |
| `seed-voyageur-journeys.ts` | VoyageurJourney (2), JourneyNode (createMany) | — |
| `seed-gamification.ts` | Achievement, DailyChallenge | — |
| `seed-indigenous-language.ts` | IndigenousWord, WordOfTheDay, VocabularyQuiz, IndigenousStory | — |
| `seed-indigenous-expanded.ts` | IndigenousWord (200+) | — |
| `seed-indigenous-words-explorers.ts` | IndigenousWord (100+), Explorer, Cartographer | — |
| `seed-notable-figures.ts` | NotableFigure | — |
| `seed-credentials.ts` | Teacher (1), AdminUser (2) | — |
| `seed-super-admin.ts` | AdminUser (1 upsert); `updateMany` isCore/visibility on LessonPlan, VirtualFieldTrip, PrimarySourceDocument, PrintableResource | — |

Non-seed bare scripts (same `DATABASE_URL` problem): `prisma/fix-all-wikimedia-urls.ts` (11 tables), `prisma/fix-image-urls-final.ts` (Explorer, Location, VirtualFieldTrip, FieldTripStop), `scripts/add-location-images.ts` (Location), `scripts/fix-database-duplicates.ts` (Explorer, ExplorerWaterway), `scripts/populate-all-lesson-hero-images.ts` (LessonPlan). Note `prisma/README-IMAGE-URLS.md` reports "Results from last run" row counts for `fix-all-wikimedia-urls.ts` — those counts describe whatever file `DATABASE_URL` pointed at, not Turso.

---

## 6. Embedded credentials (file:line; values intentionally not reproduced)

All of these are in files tracked by git on this branch, so they are in history regardless of any future edit. Rotation is the only real fix.

### 6a. Turso database URL **and auth token (JWT) as string literals** — 12 files
Each has `url: 'libsql://canadianwaterwaysexplorer-bterhart.aws-us-east-2.turso.io'` on one line and `authToken: 'eyJ…'` on the next (the same token in all 12):

| file | lines |
|---|---|
| `backend/prisma/audit-explorers.ts` | 6-7 |
| `backend/prisma/audit-locations.ts` | 6-7 |
| `backend/prisma/audit-reading-guide.ts` | 6-7 |
| `backend/prisma/audit-thompson.ts` | 6-7 |
| `backend/prisma/check-current-images.ts` | 6-7 |
| `backend/prisma/check-era.ts` | 6-7 |
| `backend/prisma/check-methye.ts` | 6-7 |
| `backend/prisma/check-waterways.ts` | 6-7 |
| `backend/prisma/fix-thompson-db.ts` | 6-7 |
| `backend/prisma/get-explorer-ids-for-crossref.ts` | 5-6 (as `const TURSO_DATABASE_URL` / `const TURSO_AUTH_TOKEN`) |
| `backend/prisma/migrate-images.ts` | 7-8 |
| `backend/scripts/populate-google-video.ts` | 16-17 |

Related, not a secret: `backend/prisma/get-all-explorer-ids.ts:6` hardcodes a *different* Turso hostname (`canadian-waterways-weston-r.turso.io`) with the token taken from env.

### 6b. Google Maps / Places API key as a string literal — 6 files (same key in all)
`backend/scripts/populate-gallery-images.ts:8`, `populate-google-imagery.ts:8`, `populate-google-video.ts:13`, `populate-waterway-gallery.ts:8`, `replace-placeholder-images.ts:8`, `replace-remaining-duplicates.ts:8` (`const GOOGLE_API_KEY = '…'`).

### 6c. Email + password pairs
| file | lines | what |
|---|---|---|
| `backend/fix-teacher-password.ts` | 10 (literal password passed to `Bun.password.hash`), 16-17 & 20-22 (teacher email; email+password printed) | Resets a real Teacher row's password to a literal and prints both. |
| `backend/hash-and-update-teacher.ts` | 11 (literal password → `bcrypt.hash`), 13, 17-18, 21 (email + password printed) | Same account, bcrypt variant. |
| `backend/prisma/seed-credentials.ts` | 12 (teacher password literal), 15/21/34 (teacher email), 46 (admin password literal), 49/54/69 (admin email), 82 (super-admin password literal), 85/90/105 (super-admin email), 120/126/133 (passwords echoed to console) | Three test accounts with literal passwords. |
| `backend/prisma/seed-super-admin.ts` | 16 & 19 (super-admin email), 22 (literal password → `hashPassword`) | Super-admin account. |
| `backend/prisma/seed-update.ts` | 600 (admin email), **602 (`passwordHash: "<plaintext>"` — the password itself is stored unhashed)**, 606 (email + password echoed) | Would create a login-able admin whose hash column holds the plaintext. |

### 6d. Other observations relevant to cleanup
- `backend/check-teacher-credentials.ts` queries a `User` table that is not declared in `schema.prisma`; whether such a table exists in Turso is unverified.
- `backend/prisma/fix-all-media.ts` and its two commenters reference `migrate-images-to-cdn.ts`, which exists nowhere in the repo.
- `backend/prisma/migration-monitor.sh` and the "Run:" comments in several prisma scripts hardcode `/home/user/workspace/backend`, a path that is not this checkout.
- `mobile/mobile/backend/prisma/migrate-from-csv.ts` is a stray, differing copy of the prisma script inside the mobile tree (AUDIT_FINDINGS.md already notes it causes the 2 mobile typecheck errors).
- `backend/dev.db`, `backend/prisma/dev.db` (0 B) and `backend/prisma/prisma/dev.db` (766 KB SQLite with all 49 tables) are tracked in git; the bare-PrismaClient scripts are the only plausible writers of such files.
