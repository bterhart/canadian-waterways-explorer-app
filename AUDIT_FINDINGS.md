# Full Application Audit — Findings

**Date:** 2026-10-14
**Branch audited:** `feat/river-overview-home-layer` tip (working branch `claude/fix-map-filter-hide-hs4mz`)
**Scope:** every file under `backend/src`, `backend/src/admin-panel.html`, `backend/prisma/schema.prisma`, `backend/scripts`, every file under `mobile/src` (all screens, components, API client, types, i18n, data), `mobile/app.json`, `mobile/eas.json`, all `.env*`, `.gitignore`, `tsconfig.json`s, root docs.

## 0. How to read this document

Every finding states **where** (`file:line`) and **how it was verified**. Three verification levels are used:

| Tag | Meaning |
|---|---|
| **READ** | Confirmed by reading both sides of the code (e.g. client payload vs server zod schema). |
| **PROBED** | Confirmed empirically by running the backend locally on `:3000` and sending requests (no Turso connectivity, so DB calls 500 — but auth middleware either fires 401 first or it doesn't). |
| **UNVERIFIED** | Depends on live Turso data, Railway configuration, or a device build that could not be reached from this environment. Stated as a hypothesis, not a fact. |

**What could NOT be checked, and why.** The sandbox's outbound proxy returns `403` for both the Turso host and the Railway host (the previous session, same environment id, had the identical limitation). Therefore: no live-schema introspection, no row counts, no check of which seeded ids/strings actually exist, no check of Railway env vars. Every claim about Turso *content* below is tagged UNVERIFIED. To unblock, allow the two hosts under the environment's Network access settings.

**Terminology.** The one and only database is **Turso**. `@prisma/client` + `@prisma/adapter-libsql` is the *query library* the backend uses to reach it; `schema.prisma` is a *declaration*, not the source of truth. The word "Prisma" below appears only where it is a literal library/file name.

**Severity.** CRITICAL = exploitable now / data exposure. HIGH = a user-facing feature does not work or a documented feature does not exist. MED = degraded, wrong-shape, or latent. LOW = cosmetic, dead code, hygiene. INFO = design note.

---

## 1. Executive summary — the twelve things that matter most

1. **Nine backend route groups have no authentication at all** (PROBED): admin contribution review, notable-figure create/edit/delete, journals, gamification, map-annotations, voyageur-journeys, image-health, the `/admin/image-export-csv` download, and the demo `/api/sample`. Anyone on the internet can approve contributions, grant unlimited points, read/write children's journals, or delete a notable figure. §2.1
2. **Default credentials are published in the repo** (READ): `user_guide.md` and `RCGS_EXECUTIVE_SUMMARY.md` list teacher/admin/super-admin test accounts with passwords; two root scripts write the teacher password straight into Turso. Whether those rows exist live is UNVERIFIED — treat as compromised until checked. §2.2
3. **All four `.env` files are tracked in git with live secrets** (Turso token, R2 keys, OpenAI key). §2.3
4. **Admin contribution review is broken end-to-end**: the app never sends `reviewedBy`, the server requires it → every Approve/Reject returns 400. §3.1
5. **Admin and teacher sessions die after 15 minutes**: access tokens expire at 15 min, nothing in the app or the KML web panel ever calls `/api/auth/refresh`. §3.2
6. **Four of five admin content types cannot be authored or edited from the app** — Lesson Plans, Field Trips, Documents, Printables show "Coming Soon" for Create/Edit (only Delete is wired). Quizzes are the single working editor. §4.1
7. **The entire student/teacher loop is disconnected**: no Join Class screen exists (FAQ documents one), assignment creation is broken three ways, student progress is never written, and four unlinked identity schemes mean no data can be attributed to a real student. §3.4, §3.5, §4.3
8. **Gamification is write-side dead**: no screen ever calls add-points or achievements-check; everything runs under a hardcoded `demo-user-001` shared by every install. §3.6
9. **Android maps are blank**: no Google Maps API key in `app.json`, no `app.config.*`, `eas.json` builds Android for store. §3.9
10. **Mobile types describe fields that do not exist** (documents, field-trip stops, printables `pdfUrl` vs `fileUrl`, lesson `assessmentSuggestions` vs `assessment`) → whole sections of detail screens never render and every "Download PDF" is a no-op. §5
11. **Permission layer is dead code**: `canEditContent/canDeleteContent/requireGlobalContentPermission/requireAuth` are never called; `isCore`/`visibility` are enforced nowhere; public routes leak teacher-only lesson content and printable answer keys. §2.4, §2.5
12. **Schema delivery to Turso is CREATE-only with an ephemeral SQL source** (`scripts/push-turso-schema.ts` reads `/tmp/turso_schema.sql`, skips "already exists"), so `schema.prisma` and live Turso can silently drift and nothing in the repo records what was applied. §7.1

---

## 2. Security

### 2.1 Unauthenticated routes (PROBED on local backend, no `Authorization` header; control routes with middleware returned 401 before any DB call)

| Route | File | Observed | Impact |
|---|---|---|---|
| `GET /api/admin/contributions` | `backend/src/routes/admin.ts:167` | 500 (reached DB) | Lists pending contributions incl. `contributorEmail` PII |
| `PATCH /api/admin/contributions/:id` | `admin.ts:210` | 400 ZodError (past auth) | Anyone can approve/reject; `reviewedBy` comes from body |
| `POST /api/notable-figures` | `notable-figures.ts:197` | 400 ZodError | Public create |
| `PATCH /api/notable-figures/:id` | `:236` | 500 (reached DB) | Public edit |
| `DELETE /api/notable-figures/:id` | `:280` | — (READ) | Public delete |
| `POST /api/gamification/progress/add-points` | `gamification.ts:130` | 400 ZodError | Client-supplied `points` for any `userId`; leaderboard fakeable |
| `POST /api/gamification/achievements/check`, `daily-challenge/submit` | whole file | READ | Same |
| `POST /api/map-annotations` and every `/:id` mutation | `map-annotations.ts` whole file | 400 ZodError | Anyone with an id owns the map; `PUT /:id` can flip `isPublic` |
| `GET /api/journals/by-identifier/:identifier`, `POST /api/journals`, all entry/saved-location routes | `journals.ts` whole file | 500 / 400 | Read/write a child's journal, name, school, grade by guessing identifier or cuid |
| `GET /api/voyageur-journeys/:id/start` and `/choice`, `/progress` | `voyageur-journey.ts` | 500 | `userId` is a client string |
| `GET /api/admin/image-health`, `POST /api/admin/image-health/run` | `admin-image-health.ts:24,76` | READ | Anyone can start a full image scan (and the auto-repair in §6.3) |
| `GET /admin/image-export-csv` | `backend/src/index.ts:67` | **200, full 106 KB CSV served** | Unauthenticated data export |
| `GET /api/sample` | `sample.ts:5`, mounted `index.ts:85` | 200 | Demo route live in production |

Routes that **do** carry auth but lack **ownership** checks (READ):
- `backend/src/routes/classes.ts:127-676` — after `requireTeacher`, no route compares `c.get("teacher").id` to the class's `teacherId` (file never calls `c.get`). Any teacher can read/patch/delete any class, regenerate join codes, add/remove students, create assignments, set progress. `GET /:id` (175) also returns the owning teacher's email. `POST /` (24,166) takes `teacherId` from the body.
- `teachers.ts:258,405` — `GET /api/teachers/:id` and `/:id/classes` readable by any teacher (incl. `joinCode`). PATCH and change-password (310/363) do check.
- `GET /api/waterways/admin/kml-status`, `POST/DELETE /api/waterways/:id/kml` correctly require super-admin (`waterways.ts:159,251,282`); the `/admin/kml` HTML page itself is public but harmless (all its data calls are server-gated).

### 2.2 Published default credentials (READ; live state UNVERIFIED)
- `user_guide.md:313,530-531` and `RCGS_EXECUTIVE_SUMMARY.md:227-229` publish three "Test Accounts" with passwords (teacher, admin, super-admin on the `canadianwaterways.ca` domain).
- `backend/prisma/seed-credentials.ts` creates exactly those three (bcryptjs for admins — matches `admin.ts:75 bcrypt.compare`; `Bun.password.hash` for teacher — matches `teachers.ts:178`). This script uses a bare `new PrismaClient()` (no libsql adapter) so it may never have reached Turso.
- **But** `backend/fix-teacher-password.ts:1-18` and `backend/hash-and-update-teacher.ts:1-19` connect to Turso via `@libsql/client` with `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` and run `UPDATE Teacher SET passwordHash=?, status='approved' WHERE email=<teacher test email>` with the published password. Their existence strongly implies that teacher row exists in live Turso with that password.
- **Action for user:** query Turso `Teacher` and `Admin` tables for the three emails; rotate or delete; remove the credentials from both documents; delete the two root scripts.

### 2.3 Secrets in git (READ: `git ls-files`)
- `backend/.env`, `backend/.env.production`, `mobile/.env`, `mobile/.env.production` are tracked. They contain the Turso auth token, R2 access key + secret, OpenAI key (the latter referenced by nothing in `backend/src`; dead secret). `.gitignore` excludes only `.env.*.local`.
- `mobile/.env*` expose `EXPO_PUBLIC_R2_SECRET_ACCESS_KEY` / `EXPO_PUBLIC_R2_ACCESS_KEY_ID`. The `EXPO_PUBLIC_` prefix means they are compiled into the client bundle if referenced (no source references found — but they must not be in the mobile env at all).
- **Action:** rotate all of them; `git rm --cached` the four files; add `.env` and `.env.production` to `.gitignore`; keep `.env.example`s.

### 2.4 Dead permission layer (READ, grep of `backend/src`)
- `backend/src/lib/admin-middleware.ts:127-242` — `requireGlobalContentPermission`, `canAccessContent`, `canEditContent`, `canDeleteContent` are **never called**. `teacher-middleware.ts:82 requireAuth` never called.
- Consequence: `isCore`, `visibility`, `createdById` on LessonPlan / VirtualFieldTrip / PrimarySourceDocument / PrintableResource are enforced nowhere. Any approved admin (default role "moderator") can edit/delete any content including `isCore`. The admin "My Content" screen's info box (§4.1) promises semantics the backend does not have.
- `createdById` is taken from the request body (`admin-quizzes.ts:20,234`, `admin-lesson-plans.ts:37,171`), not from `c.get("admin").id`; the app never sends it → always null.

### 2.5 Data exposure on public routes (READ)
- `lesson-plans.ts:46-100` public `GET /:id` spreads the whole row → returns `teacherObjectives`, `teacherActivities`, `teacherQuestions`, `teacherNotes`, `assessment`, plus `visibility/createdById/isCore`. The comment at line 67 ("excluded from general user view by default") is false. Filters only `isPublished`; ignores `visibility`. **Coupling warning:** `mobile/src/app/teacher/deep-dive/[id].tsx:70,223-234` *relies* on this leak to show teacher sections — fixing the leak without adding a teacher-authenticated route blanks that screen.
- `printables.ts:76-91` public `GET /:id` returns `answerKey` and `teacherNotes`. Students can fetch answer keys.
- `field-trips.ts:26,63`, `documents.ts:26,62`, `comparisons.ts:26,59` ignore `visibility`.

### 2.6 Other security (READ)
- `env.ts:19-20` — JWT access/refresh secrets default to hardcoded strings when unset. Prior session set 13 Railway vars incl. JWT secrets → likely mitigated in prod; UNVERIFIED from here.
- `jwt-utils.ts:20-38`, `auth-utils.ts:42-86` — token blacklist and rate limiters are in-memory; reset on restart; blacklist `cleanup()` is an empty placeholder → unbounded growth. Logout is not durable.
- `contributions.ts:64` — `validateImageUrl` HEAD-requests any user-supplied URL (SSRF surface).
- `teachers.ts:16` teacher password min 8, no complexity; admin `passwordSchema` (auth-utils.ts:7) is 12 + complexity. Mobile `admin/register.tsx:60-66,213` enforces 8 and says "At least 8 characters" → compliant-looking 8–11 char passwords fail server-side with a raw ZodError string.
- `admin-approval.ts:57` rate limit keyed on spoofable `x-forwarded-for`.
- `auth-utils.ts:107-137` — `logAdminAction` and `sendEmailNotification` are `console.log` stubs. No approval e-mails are ever sent; the registration success copy in `admin/register.tsx:104` and `teacher/register.tsx:133` promises a notification that never arrives.

---

## 3. Broken user-facing flows (bugs)

### 3.1 Admin contribution review (HIGH, READ)
`mobile/src/lib/api/waterways-api.ts:210-215` PATCHes `{status, adminNotes}`; `backend/src/routes/admin.ts:18-22` requires `reviewedBy: z.string().min(1)` → 400 on every Approve/Reject → "Failed to approve contribution" (`admin/contributions.tsx:154-157,183-187`).

### 3.2 15-minute sessions, no refresh (HIGH, READ)
- Access tokens expire at 15 min (`jwt-utils.ts:50`). No file under `mobile/src` references `/api/auth/refresh`; `refreshToken` appears only in types. `setAuthToken` is called only at `(tabs)/admin.tsx:129` and `teacher/dashboard.tsx:56`.
- Teacher: `teacher/login.tsx:49-52` stores `{...teacher, accessToken}` and discards `refreshToken`; after 15 min every call is 401, dashboard shows "No classes". Logout (76) never calls `setAuthToken(null)`. `teacher/class/new.tsx:41-52` never calls `setAuthToken` → cold deep-link = 401.
- Admin: `(tabs)/admin.tsx:92` `isLoggedIn` is component state; app restart = logged out.
- KML web panel: `admin-panel.html:838,981-1019` stores only the access token; force-logout on 401 → panel dies every 15 min.

### 3.3 Android crash on Reject (MED, READ)
`Alert.prompt` is iOS-only. Used at `admin/contributions.tsx:172`, `admin/approvals.tsx:147`, `admin/teacher-approvals.tsx:170` → TypeError on Android when tapping Reject.

### 3.4 Teacher assignment creation (HIGH, READ) — `teacher/assignment/new.tsx`
- Line 41 reads only `classId`; `teacher/deep-dive/[id].tsx:347` navigates with `?lessonId=` → "Class ID is missing" every time from that entry point; `lessonId` ignored.
- Lines 80-89: no quiz or field-trip picker; `quizId`/`fieldTripId` never sent; backend requires them per type (`classes.ts:474-491`) → 400. `lessonPlanId` labelled optional (211) but required for `lesson_plan` (480). Chips capped at first 10 plans (218).
- Lines 197-205: due date free text `YYYY-MM-DD`; backend `dueDate: z.string().datetime()` (`classes.ts:52`) → any due date → 400. Only a lesson-plan assignment with a chip selected and a blank due date can succeed.

### 3.5 No student side at all (HIGH, READ + grep)
- `useJoinClass` (`education-api.ts:614`) is imported by no screen; `(tabs)/learn.tsx` has no Join Class entry; `faq.tsx:241` tells students to "Go to Learn > Join Class".
- `PUT /api/classes/:id/students/:sid/progress/:aid` (`classes.ts:613`) — the only way assignment progress is written — has **no caller** anywhere. `GET /classes/:id/progress` (573) likewise. "Progress Tracking" (user guide, FAQ) can never show data.
- `teacher/class/[id].tsx:202-233` assignment rows are plain Views: no edit/delete/progress. Unused hooks: `useDeleteAssignment`, `useUpdateClass`, `useDeleteClass`, `useAddStudent`, `useClassStudents`, `useClassAssignments`, `useTeacher`, `useUpdateTeacher`. No class edit/deactivate/delete, no manual add-student, no teacher profile/change-password UI (`Settings` icon imported unused at `dashboard.tsx:20`).

### 3.6 Gamification write-side dead (HIGH, READ + grep)
- `useAddPoints`, `useCheckAchievements`, `useLeaderboard` used by no screen. `quiz/[id].tsx:325-352` never awards points on submit.
- `achievements.tsx:62-63` `const DEMO_USER_ID = 'demo-user-001'` used for progress (413), achievements (415), daily challenge (416, 435). Every install shares one row.
- "Your Activity" cards (560-601) and achievements grid (603-630) are therefore permanently 0 / "0/N". Only daily-challenge submit is live, and it needs a seeded `DailyChallenge` row for today — no generator exists in `backend/src` (`gamification.ts:414-419` "No daily challenge available" is the steady state). Daily-challenge submit updates `totalPoints` but not streak on existing rows (546-548).

### 3.7 Journal entries cannot be viewed/edited/deleted (HIGH, READ)
`journal/index.tsx:107` pushes `/journal/entry/${id}` without `journalId`; `journal/entry/[id].tsx:30-49` resolves the entry via `useJournal(journalId)` → undefined → form opens empty; `handleSave` (59-95) matches neither branch and silently `router.back()`; Delete (222) never renders. Only "new" works (FAB passes `journalId`, 276). Tags cannot be cleared (`tags: undefined` skipped server-side, 77/87).

### 3.8 Printables "Download PDF" is a no-op (HIGH, READ)
Client reads `pdfUrl` (`printables.tsx:135-141`, `types/education.ts:435`, `admin-api.ts:250,270`); backend/Turso field is `fileUrl` (`admin-printables.ts:19,33,94,134`, `schema.prisma:550`). `Linking.openURL` is never reached; admin create/update silently drops `pdfUrl` (zod strips unknown keys).

### 3.9 Android maps blank (HIGH, READ)
`react-native-maps` on Android is Google-only. `mobile/app.json` has no `android.config.googleMaps.apiKey`; no `mobile/app.config.*` exists (glob). Every `MapView` — `(tabs)/index.tsx`, `field-trips/[id].tsx:115`, `voyageur-journey/[id].tsx:362`, `my-maps/[id].tsx:439`, DetailBottomSheet mini-map (278-301) — renders blank on Android. `eas.json` builds Android for store. Whether an Android build has ever shipped is UNVERIFIED (prior session shipped iOS only).

### 3.10 Other broken controls (READ)
- `field-trips/[id].tsx:261-266` "Listen to Audio Guide" has no `onPress`.
- `my-maps/[id].tsx:360-377` Export builds data, never uses it, alerts "Export Complete". `:343-357` Share generates a code nobody can redeem (`useSharedMapAnnotation` unused; backend `/shared/:code` unreachable). `useUpdateMapAnnotation` imported, never called (141) → no title/description/isPublic editing.
- `nearby-history.tsx:403` "View on Map" pushes `/?lat=&lng=&eventId=`; `(tabs)/index.tsx` reads no search params → map opens unchanged.
- `indigenous-languages.tsx:223-246` vocabulary-quiz cards and `:248-276` story cards are non-pressable Views (`useVocabularyQuiz`, `useSubmitVocabularyQuiz`, `useIndigenousStory` unused). Word `audioUrl` never played; `useIndigenousWord`, `useIndigenousCategories` unused.
- `notable-figures/[id].tsx:254-267` explorer rows show a chevron, not pressable. `imageUrl` never rendered anywhere although the image-health job checks it.
- `timeline.tsx:174-191,440-457` related entities shown as static labels; ids present, nothing navigates.
- `teacher/lesson-plan/[id].tsx:239-248`, `deep-dive/[id].tsx:330-339` "Related Quizzes" goes to the generic quizzes tab.
- `lib/onboarding.ts:47-71` `useOnboardingCheck` is called by no screen → first-launch tutorial never auto-shows (only via Settings replay).
- `quiz/[id].tsx:348-351` on submit failure renders "0/0 · 0% · Keep Practicing" with no error. `handleSubmitQuiz` (188-222) is dead code.
- `teacher/login.tsx:55-60` every failure → "Invalid email or password"; backend distinguishes PENDING / REJECTED / SUSPENDED / LOCKED / RATE_LIMIT (`teachers.ts:96-174`). A pending teacher is told their password is wrong.
- `admin/teacher-approvals.tsx:111-120,283-298` "All Teachers" tab shows Approve/Reject on every card regardless of status → 400 "already approved"; reject invalidates only `pending()` → stale list; no Suspend/Reactivate UI though backend has both.
- `admin/users.tsx` only action is irreversible Grant Super Admin (no revoke route exists either); no suspend/reactivate.
- `admin/approvals.tsx:156-158`, `teacher-approvals.tsx:179-181` client requires non-empty reason; backend requires ≥10 chars → generic failure.
- `QuestionEditorModal.tsx:284-293` never sets `orderIndex` → all questions 0 → arbitrary order; drag handle (146-148) is decorative. `quiz-editor/[id].tsx:237-239` description/gradeLevel cannot be cleared once set. `:468` sorts the React Query cache in place.

### 3.11 Reading guides likely never render for waterways/locations (HIGH, READ; live ids UNVERIFIED)
`components/DetailBottomSheet.tsx:841,1186` look up `locationReadingGuideData[markerId]` where `markerId` is the Turso `Waterway`/`Location` id (`(tabs)/index.tsx:1278`); `schema.prisma` declares both `@default(cuid())`. But `mobile/src/data/locationReadingGuideData.ts` (4,305 lines) is keyed by **slugs** (`'atikokan-river-waterway'`, `'bloody_falls_location'`…). No file in the repo writes such slugs as ids (grep). Unless live ids are those slugs, the "Additional Study" section never renders and the file is dead bundle weight. By contrast `data/readingGuideData.ts` (explorers, 2,999 lines) is keyed by cuids and used by `ExplorerDetailModal.tsx:117` — shape-consistent but silently breaks on any reseed.

### 3.12 Identity (architecture, HIGH)
Four unlinked user-identity schemes: hardcoded `demo-user-001` (`achievements.tsx:63`), hardcoded `student-user-001` (`my-maps/index.tsx:47`, `new.tsx:30` — all users list/delete the same maps), random per-install `@waterways_user_id` (`voyageur-journey/[id].tsx:41-67`), random per-install `@waterways_journal_identifier` (`journal/index.tsx:36,76`), plus the teacher JWT in `@waterways_teacher_session`. Nothing links them to a class membership. Journals/journeys are lost on reinstall; gamification and My Maps are globally shared.

---

## 4. Unwired UI

### 4.1 Admin (mobile `app/admin/*`)
| Content type | List | Create | Edit | Delete | Backend CRUD exists |
|---|---|---|---|---|---|
| Quizzes (+questions) | ✔ | ✔ | ✔ | ✔ | ✔ |
| Lesson plans | ✔ | "Coming Soon" `lesson-plans.tsx:152-160` | "Coming Soon" | ✔ | ✔ |
| Field trips (+stops) | ✔ | "Coming Soon" `field-trips.tsx:170-178` | "Coming Soon" | ✔ (no stop UI) | ✔ incl. stops |
| Documents | ✔ | "Coming Soon" `documents.tsx:167-175` | "Coming Soon" | ✔ | ✔ |
| Printables | ✔ | "Coming Soon" `printables.tsx:166-174` | "Coming Soon" | ✔ | ✔ |

- 15 admin hooks exist in `admin-api.ts` for the above and are imported by nothing.
- `admin/my-content.tsx` — `// TODO` (66); all five counts hardcoded `0` (138-170); `isLoading` constant false; every card routes to the generic list with no "mine" filter.
- `(tabs)/admin.tsx` dashboard has no entry for KML management, image health, notable figures, or suspend/reactivate. The only admin UI outside mobile is the KML web panel (`backend/src/admin-panel.html`, served at `/admin/kml`).
- `admin-panel.html:1054,1114` reads `w.region`; `GET /api/waterways/admin/kml-status` returns `regionName` (`waterways.ts:171-177`) → every card "Unknown region"; region search never matches.

### 4.2 Backend has NO admin CRUD for (READ; content only changeable by scripts against Turso)
Waterway (except KML), Location, Explorer, ExplorerWaterway, FurTradeInfo, Cartographer, IndigenousNation, ArchaeologicalDiscovery, TimelineEvent, ComparisonTemplate, PronunciationGuide, IndigenousWord, WordOfTheDay, VocabularyQuiz, IndigenousStory, Achievement, DailyChallenge, UserProgress, HistoricalEvent, VoyageurJourney, JourneyNode, UserMapAnnotation moderation. NotableFigure has CRUD but unauthenticated (§2.1).

### 4.3 Teacher / student — see §3.4–3.6.

### 4.4 Client hooks with no consumer (47, from `scratchpad/xref.py`)
Admin CRUD ×15 (§4.1); teacher class mgmt ×8 (§3.5); `useJoinClass`; `useSaveLocation`, `useRemoveSavedLocation`; `useAddPoints`, `useCheckAchievements`, `useLeaderboard`; `useIndigenousWord`, `useIndigenousCategories`, `useVocabularyQuiz`, `useSubmitVocabularyQuiz`, `useIndigenousStory`; `useExplorerComparison`, `useFortComparison` (dynamic comparison generators never used); `useNearbyHistoryEvents`, `useNearbyWaterways`, `useNearbyLocations`, `useHistoricalEventDetail`; `useSharedMapAnnotation`; `usePrintable`; `useContributions`, `useIndigenousNations`, `useNotableFiguresByExplorer`, `usePronunciationByTerm`, `useQuizStats` (whose response type is also wrong: client expects flat `{totalQuizzes…byCategory[]}`, server returns `{overview:{…}, quizzes:[…]}` — `admin-quizzes.ts:128-138`).

### 4.5 Backend routes with no caller anywhere (mobile or web panel)
Entire `discoveries.ts` (3 routes), `sample.ts`; `explorers/search/:q`; `waterways/region|type|search`; `locations/type/:t`, `locations/waterway/:id`; `indigenous/nations/:id`, `indigenous/cartographers(+/:id)`, `indigenous/waterway-types`; `pronunciations/:id`; `classes/:id/progress` GET+PUT; `PATCH classes/:id/assignments/:aid`; `map-annotations/:id/export`; `POST/PATCH/DELETE notable-figures`; `POST /api/auth/refresh|logout`; `POST teachers/:id/change-password`; admin/teacher `suspend|reactivate`; image-health GET/POST; `/admin/image-export-csv`.

---

## 5. Client ↔ backend contract mismatches (READ both sides)

| # | Client | Backend / column | Effect |
|---|---|---|---|
| C1 | review payload lacks `reviewedBy` | `admin.ts:18-22` requires it | §3.1 |
| C5 | `annotations: Record<string,string>` (`admin-api.ts:207,227`) | `z.array({gradeLevel, annotation})` (`admin-documents.ts:13-16`) | create → 400; read → wrong shape |
| C6 | `pdfUrl` | `fileUrl` | §3.8 |
| C7 | document `description` sent/read | no such column (`schema.prisma:372-395`) | silently stripped / undefined |
| C9 | `assessmentSuggestions`, `extensionActivities` (`types/education.ts:59-60`) | `assessment`, `extensions` | "Assessment Suggestions" never renders (`teacher/lesson-plan/[id].tsx:202-209`, `deep-dive/[id].tsx:292-302`) |
| C10 | `CurriculumConnection {province, subject, grade, expectations[]}` | admin shape `{subject, strand, expectation?}` (`admin-lesson-plans.ts:18-22`) | two incompatible client shapes for one column; `teacher/lesson-plan/[id].tsx:224` `connection.expectations.map` unguarded → crash if stored shape is the admin one (stored shape UNVERIFIED) |
| C11 | `FieldTripStop.fieldTripId`, `narrative`; `FieldTripDetail.introduction/conclusion` | `tripId`, `description`, `funFact`, `thinkQuestion`; no intro/conclusion (`schema 330-370`) | `field-trips/[id].tsx:213,254,271` never render; real `funFact`/`thinkQuestion` never shown |
| C12 | `DocumentDetail.description/contextualBackground/historicalSignificance/sourceUrl/sourceAttribution`; `annotations {id,text,x,y}`; `vocabulary {term,…}` | real fields `historicalContext`, `originalText`; `{gradeLevel, annotation}`; `{word, definition}` | `documents/[id].tsx:130-221` sections never render; **a document's historical context and original text are invisible to users**; vocabulary term blank |
| C13 | `JourneyNode.voyageurSong`, `title` non-null, `VoyageurJourneyDetail.introduction/conclusion`, `HistoricalEvent.sourceUrl` | not in schema | song label fallback; nullable title; dead fields |
| T1/T2 | `Waterway.kmlData` on list item; `UserContribution.status` required | list never selects `kmlData`; public contributions never select `status` | always undefined |
| E1 | client shows `json.error?.message` (`api.ts:48`) | zod failures return `{"success":false,"error":{"name":"ZodError","message":"[…]"}}` (default `@hono/zod-validator` hook), not `{error:{message,code}}` per `.claude/rules/api-patterns.md` | user sees a raw stringified issues array |
| E2 | — | no `app.onError`/`app.notFound` in `index.ts` | unhandled throws → `text/plain` "Internal Server Error", not JSON |
| G4 | `useQuizzes/useQuiz/useSubmitQuizAttempt` defined in both `waterways-api.ts:253-279` and `education-api.ts:1476-1518` with different types | — | two sources of truth (no cache collision) |

---

## 6. Robustness / data integrity (backend, READ)

### 6.1 Unguarded `JSON.parse` on DB strings → 500 on any non-JSON row
`quizzes.ts:104`, `admin-quizzes.ts:209,380,437,470`, `lesson-plans.ts:64-97`, `admin-lesson-plans.ts:105-125`, `documents.ts:76-80`, `admin-documents.ts:103-107`, `comparisons.ts:73-77`, `auth.ts:101`, `admin.ts:135,144`. Whether such rows exist: UNVERIFIED.

### 6.2 Input parsing
`timeline.ts:31,34` `parseInt` no NaN guard; `gamification.ts:583` `parseInt(limit)` → `take: NaN`; `nearby-history.ts:39-44` `parseFloat` radius → NaN → silently empty; `pronunciations.ts:67` `decodeURIComponent` on already-decoded param → URIError on `%`.

### 6.3 Nightly image auto-repair writes to production rows without review (MED)
`jobs/image-health-check.ts:225-264,352-367` replaces a 404'd Wikimedia URL with the sole search hit; runs nightly (`index.ts:123`). A correct-but-moved image can be replaced by an unrelated one. `admin-image-health.ts:76-82 POST /run` has no in-progress lock; "latest run" is a 10-min window (41-48).

### 6.4 Semantics
- `voyageur-journey.ts:109-199` `GET /:id/start` **mutates** (upsert resets progress) — non-idempotent GET. `POST /:id/choice` (209-338) never checks `nodeId === currentNodeId` → skip/replay. Journey `score` never reaches gamification.
- `gamification.ts:596-600` class leaderboard joins on `displayName` as `userId` ("for simplicity") → collisions.
- `journals.ts:75` `journal ? 200 : 201` always 200; `:49` `studentIdentifier` not `@unique` → duplicate journals on concurrent first post.
- `indigenous-language.ts:54-84` word-of-day create race on `date @unique`; day boundary `setHours` (local) vs `gamification.ts:408 setUTCHours`. `:166-175` vocab submit ignores `isPublished`; `questions.length===0` → NaN score (199).
- `notable-figures.ts:59-62` "parse JSON fields" map is a no-op → list and detail shapes differ (`:162-171` parses). `:90-121` `/by-explorer` substring match. Waterway↔NotableFigure linkage is `associatedLocations contains waterway.name` string match (`waterways.ts:206-240`, `locations.ts:96-130`) — no FK; breaks on rename.
- `waterways.ts:186-247` public detail returns full `kmlData` (MBs) — list routes correctly omit it; `:251-279` KML upload has no size limit; `:206-241` indentation broken.
- `admin-lesson-plans.ts:13-64` create/update schemas omit `narrativeContent, heroImageUrl, images, keyFigures, timeline, readingTimeMinutes, teacher*`, `isCore`, `visibility` → unmanageable via API. `:103-126` admin GET returns raw JSON strings while public GET parses.

### 6.5 Mobile perf
`(tabs)/index.tsx:927-957` regex-parses the selected waterway's full KML (e.g. 6,019-line Churchill) on **every render** (IIFE, not memoised) plus again in the effect at 522. `lessons/[id].tsx:66` one `useExplorerDetail` request per key-figure card. `QuestionEditorModal.tsx:145-147` fetches explorers/waterways/locations while hidden.

---

## 7. Infrastructure, schema delivery, repo hygiene

### 7.1 Schema delivery to Turso (HIGH)
`backend/scripts/push-turso-schema.ts` is the only mechanism found: reads a hand-made `/tmp/turso_schema.sql` (line 10), splits on `;\n`, executes via raw `@libsql/client`, **skips** any error containing "already exists" (56-60), logs-and-continues on other errors. → CREATE-only (new columns are never ALTERed in), ephemeral SQL source not in repo, non-fatal errors. `backend/prisma/migrations/` does not exist. 78 files use raw `@libsql/client`; `backend/src` uses `@prisma/client`+`PrismaLibSQL`. Two access patterns, no shared source of truth. **Declared-vs-live drift check is blocked (needs Turso access).** `backend/check-auth-tables.ts` / `check-better-auth-tables.ts` imply Better Auth tables (`user/session/account`) may exist in Turso undeclared by `schema.prisma` — UNVERIFIED.

### 7.2 Dead / pre-Turso scripts (decision needed)
- 37 scripts construct `new PrismaClient()` **without** the libsql adapter and therefore never targeted Turso: 34 in `backend/prisma/` (`seed*.ts` ×32, `fix-all-wikimedia-urls.ts`, `fix-image-urls-final.ts`), 3 in `backend/scripts/` (`add-location-images`, `fix-database-duplicates`, `populate-all-lesson-hero-images`). With `DATABASE_URL` now removed from `backend/.env` they fail at startup.
- 17 ad-hoc probes at `backend/*.ts` root (`check-*`, `fix-teacher-password`, `hash-and-update-teacher`, `migrate-marble-island`, …). Three of them (`get_location_details.ts`, `migrate-marble-island.ts`, `check-fort-william.ts`) are the only importers of `backend/src/db.ts` (duplicate of `src/prisma.ts`).
- `backend/tsconfig.json` has no include/exclude → `tsc` checks all of the above → backend typecheck has 17 pre-existing errors, **0 in `src/`** (`scripts/bootstrap-mackenzie-ontario.ts:129` references non-existent model `notableFigureWaterway`; `scripts/build-waterway-overview.ts` ×10; `scripts/lib/audit-loaders.ts:358-361`; `prisma/migrate-from-csv.ts:379`). Typecheck cannot pass while they remain.
- Mobile typecheck: 2 errors, both in stray `mobile/mobile/backend/prisma/migrate-from-csv.ts`.

### 7.3 Vibecode remnants (all dead per user; delete)
`backend/scripts/start` (runs `prisma db push --accept-data-loss` against a **local file** per `scripts/env.sh:9-11`, sqlite3 backup, calls api.vibecodeapp.com — Railway start command is `bun run src/index.ts`), `backend/scripts/env.sh`, `backend/scripts/studio`, `backend/.env.production:5` `BACKEND_URL=…vibecode.run`, `env.ts:11-12` BACKEND_URL comment + `DATABASE_URL` declaration ("Deprecated"; `prisma generate` verified to work without it), `mobile/.env.production` `EXPO_PUBLIC_VIBECODE_BACKEND_URL` + `EXPO_PUBLIC_EXAMPLE_ENV_VAR` (also in `eas.json` preview/production env), `.claude/rules/api-patterns.md` (describes Better Auth + Vibecode trustedOrigins + a start script that runs generate — none true for this app), `lib/state/example-state.ts` ("DO NOTE USE THIS FILE"), `app/modal.tsx` placeholder (registered `_layout.tsx:35`), `components/Themed.tsx` (imported by nothing).

### 7.4 Tracked files that should not be
`backend/dev.db` (0 bytes), `Churchill_River.kml` (6,019 lines, at repo root), `backend/prisma/image-export.csv` (106 KB, served unauthenticated), `mobile/backend/cleaned_urls_final.csv` (~501 KB), `mobile/mobile/` nested dir, `backend/prisma/prisma/` nested dir, the four `.env` files (§2.3).

### 7.5 Config
- `mobile/.env` (dev) lacks `EXPO_PUBLIC_BACKEND_URL` → `api.ts:8` `baseUrl = undefined` → every URL `undefined/api/...` under local `expo start` unless exported in the shell.
- `index.ts:46-50` CORS allows only `localhost`, `127.0.0.1`, `*.up.railway.app` (native apps unaffected).
- `OPENAI_API_KEY` in both backend envs, not in `env.ts` schema, referenced by nothing.
- `CLAUDE.md:46` still names repo `bterhart/Canadian_Waterways_App`; earlier CLAUDE.md text claimed "Migrations run via bunx prisma migrate deploy" — no such mechanism exists.

### 7.6 "Prisma" terminology (PRIORITY task, in progress)
Done: header NOTE at every `@prisma/*` import in `backend/src`, `backend/scripts`, `backend/prisma`, `mobile/mobile` (63 files + 7 src files); `backend/.env` `DATABASE_URL` removed; CLAUDE.md rule added. Remaining: rename the `prisma` identifier (382 occurrences, 39 `backend/src` files) → `db`; consolidate `src/prisma.ts`/`src/db.ts` and retarget the 3 root scripts; remove `DATABASE_URL` from `env.ts`; fix `.claude/rules/api-patterns.md`; script-local variables after the dead-script decision. Library-forced names (`@prisma/client`, `@prisma/adapter-libsql`, `PrismaClient`, `PrismaLibSQL`, `schema.prisma`, `prisma generate`) must stay.

---

## 8. Documentation that is false (shipped copy)

| Where | Claim | Reality |
|---|---|---|
| `faq.tsx:77` | "The entire app is available in both English and French" | faq.tsx has no i18n; user-guide imports `t` unused; about translates titles only; ~245 keys cover tabs/map/quizzes/nearby-history; admin/teacher/lessons/documents/journal all English. `fr.ts` is written almost entirely **without diacritics** (~200 strings; e.g. "Succes", "Parametres", "Riviere"); `settings/index.tsx:47`, `i18n/index.tsx:115` "Francais" |
| `faq.tsx:241` | "Learn > Join Class" | no such screen (§3.5) |
| `faq.tsx:303,343,399` | "Reset Progress" / "Clear the app cache" in Settings | `settings/index.tsx` has neither |
| `faq.tsx:309` | class + global leaderboard | backend route exists; no screen (§4.4) |
| `faq.tsx:355,361,367`, `user-guide.tsx:259` | "Feedback form / option in the app menu" | no feedback screen or route exists |
| `faq.tsx:259` | "tap the bookmark icon to save to your journal" | no bookmark/save action; `useSaveLocation` unused |
| `faq.tsx:265` | audio pronunciation "available for many terms" | pronunciations screen plays audio (`expo-av`) ✔; indigenous words do not |
| `faq.tsx:253` | share journal entries with teacher | no sharing exists |
| `faq.tsx:227` | assign quizzes, lesson plans, field trips | §3.4 |
| `faq.tsx:279` "7 ranks"; `user-guide.tsx:147-152` 5 ranks with thresholds 0-99/100-249/250-499/500-999/1000+ | backend `gamification.ts:10-18`: 7 ranks, 0-100/101-300/301-600/601-1000/1001-1500/1501-2500/2501+ | user guide wrong on count and thresholds; `en.ts:115-121` names the 7 |
| `user-guide.tsx:167-176`, `onboarding.tsx:71` | "298 words across 8 languages" | guide lists 7 languages summing to 291; live counts UNVERIFIED |
| `user-guide.tsx:81-87` | 26 lesson plans, 4 field trips, 14 documents, 8 printables, 33+ pronunciations, 4 comparisons, 16 timeline events | hardcoded; UNVERIFIED vs Turso |
| `about.tsx:104-106`, `user-guide.tsx:277` | "Version 1.0.0 / February 2026" | `app.json` version `3.4.0`; not read from `expo-constants` |
| `about.tsx` vs `user-guide.tsx:262-263` / `user_guide.md:1742-1745` | contact `*@canadianwaterways.ca` vs `*@waterways.edu` | two domains; existence of either UNVERIFIED |
| `admin/register.tsx:104`, `teacher/register.tsx:133` | "you will be notified" | notifications are console stubs (§2.6) |
| `admin/my-content.tsx:176-184` | draft/publish-by-creator semantics | not enforced (§2.4) |
| `faq.tsx:314-331` | Admin Access Qs filed under "Technical" | cosmetic |
| `user-guide.tsx:1` | "from user_guide.md" | inline 240-line abridged fork of the 1,782-line root file; drifted |

---

## 9. Verified working end-to-end (so nobody re-audits them)
Map (waterways/locations/explorers/river-overview tiering/lazy KML fetch via `useWaterwayDetail`), detail sheets (gallery/video JSON-or-URL compat, Google Earth link, explorer bio modal, notable-figure nav), contribution submission (`ContributeModal` → `POST /api/contributions`), quizzes list/detail/attempt, admin login + pending-contributions list, admin quiz CRUD incl. questions (`quiz-editor/*`), admin list+delete for the other four content types, admin/teacher approval lists + approve + grant-super-admin, admin register, teacher register/login/dashboard/classes/create class/class detail/regenerate code/remove student, lesson plans list/detail (reads real `narrativeContent/keyFigures/timeline/images/heroImageUrl/readingTimeMinutes`), timeline + themes, field trips list/detail (except §5 C11 fields), documents list + dynamic types, comparisons list/detail (table-key heuristic `comparisons/[id].tsx:114-134` UNVERIFIED vs stored JSON), pronunciations list + audio, printables list, indigenous words/word-of-day/languages, achievements read-side + daily-challenge submit, voyageur journeys list/detail/start/choice/progress/play-again, my-maps list/create/detail/pins/routes/notes/delete, nearby-history by category + categories + location permission flow, notable figures list/featured/types/nations/detail, KML admin web panel (upload/delete/status under super-admin), i18n persistence + EN fallback, `_layout` QueryClient defaults, all `learn.tsx` routes resolve.

---

## 10. Decisions required from the user

1. **Credentials (§2.2):** verify in Turso, rotate/delete, scrub both docs, delete the two root scripts.
2. **Secrets in git (§2.3):** rotate Turso token, R2 keys, OpenAI key; untrack the four `.env` files.
3. **Network access:** allow the Turso and Railway hosts for this environment so §7.1 drift and all UNVERIFIED items can be closed.
4. **Dead scripts (§7.2):** delete the 37 pre-Turso scripts + 17 root probes, or port the ones still needed to `@libsql/client`/the adapter. Decision gates the typecheck green and the rest of the Prisma-rename task.
5. **Vibecode remnants (§7.3):** confirm deletion list.
6. **Auth design:** (a) add `requireAdmin` to the unauthenticated routes in §2.1, (b) add teacher-ownership checks in `classes.ts`, (c) choose an identity model for students (§3.12) before any gamification/journal/map fix is attempted, (d) decide whether `/api/notable-figures` write routes should exist at all.
7. **Public-route leaks (§2.5):** fixing `lesson-plans.ts` requires first adding a teacher-authenticated lesson route that `teacher/deep-dive/[id].tsx` can switch to.
8. **Android:** supply a Google Maps key (or drop Android from `eas.json`).
9. **Reading guides (§3.11):** confirm live id format; if cuids, decide whether to re-key `locationReadingGuideData.ts` or move guides into Turso.
10. **Documentation (§8):** decide which promised features are to be built vs. removed from FAQ/user guide/about.

---

## Appendix A — method artefacts
- Backend: all 46 `src/*.ts` read in full; `admin-panel.html`, `scripts/start`, `scripts/env.sh`, `scripts/push-turso-schema.ts`, `schema.prisma`, `.env*`, `.gitignore`, `tsconfig.json`; local run on `:3000` for auth probes.
- Mobile: all files under `src/app`, `src/components`, `src/lib`, `src/data` heads/keys; `app.json`, `eas.json`, `.env*`; typecheck run.
- Cross-reference: `xref.py` (session scratchpad) parsed every `app.route()` mount, every `router.<verb>()` in `backend/src/routes`, every `api.<verb>()` in `mobile/src/lib/api` with its enclosing hook, and grepped every hook across screens. All 130 client calls resolve to a mounted route; breaks are in payload/auth/params, not URLs.
- Prior-session context (`session_01K9kdFVxA3aDDckDafyxgkJ`): backend was never reachable from any cloud session; Railway start command `bun run src/index.ts`; 13 Railway env vars set incl. JWT secrets; KML lazy-load landed; Vibecode deps removed; EAS `appVersionSource: remote` + autoIncrement; TestFlight published.
