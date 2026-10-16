# Content Sweep and Expansion Specification

Prepared 2026-10-16. This document replaces the earlier specification in full.

**How it was produced.** Every screen file under `mobile/src/app` and the components they
render were read line by line (file:line references below are to those reads). Every backend
route the app calls was read in full. Every count and every "filled / not filled" statement was
produced by read-only queries against the live Turso database on 2026-10-16
(`sweep-verify.ts`, `sweep-verify2.ts`, kept in the session scratchpad; the row-level output is
in `sweep-verify.json`). Nothing in sections 1 to 4 is inferred from `schema.prisma` or from
file names. Where something could not be verified in this session it is marked **unverified**.
Historical statements in section 5 are domain knowledge offered for the owner's judgement; the
two things that section cannot assert without running the tools are marked as such: whether
OpenStreetMap holds a usable geometry for a waterway, and whether a verified likeness exists
for a person.

**Scope rule (owner's instruction).** The app is about early North American exploration,
trade and cartography as it bears on Canadian history. It is not gated to the present border:
New France to the Gulf of Mexico, the Dutch trade on the Hudson, Lake Champlain, Peter Pond,
Astor and Astoria, Fort Vancouver, the Spanish Pacific voyages and the Russians all belong.
Not everything needs to link to everything; a link is wanted only where the app has a surface
that shows it and the connection is historically real.

**Vocabulary.** "Turso" is the database. `@prisma/client` is the query library the backend
uses to reach it; it is not a database. `schema.prisma` is the declaration the client was
generated from and is not the source of truth.

---

## 0. Numbers at a glance (live, 2026-10-16)

| Table | Rows | Published | Notes |
|---|---|---|---|
| Waterway | 70 | n/a | River 29, Bay 15, Lake 12, Strait 6, Sound 4, Inlet 3, plus one row typed `lake`; 66 with KML; 69 with image; 59 with Indigenous name |
| Location | 100 | n/a | Fort 52, Trading Post 16, Portage 14, Cultural Site 9, Settlement 5, `historic_site` 3, `fort` 1; all 100 have an image |
| Explorer | 92 | n/a | 70 with portrait; 42 with at least one waterway link; 105 ExplorerWaterway rows, all with year and notes |
| FurTradeInfo | 21 | n/a | one per waterway |
| ArchaeologicalDiscovery | 8 | n/a | all with coordinates |
| Cartographer | 11 | n/a | Bellin ×2, Jolliet ×2; 1 location links to a cartographer |
| IndigenousNation | 14 | n/a | 7 nations, each stored twice; no screen reads this table |
| NotableFigure | 18 | n/a | 7 featured; 4 with image |
| LessonPlan | 26 | 26 | all have narrative, hero, images, key figures, timeline; `visibility` = private on all 26 |
| VirtualFieldTrip / FieldTripStop | 6 / 36 | 6 | every stop has image, fun fact and think question; 0 stops linked to a pin or waterway |
| PrimarySourceDocument | 48 | 48 | 34 without grade level; 1 with image; 43 linked to an explorer |
| Quiz / QuizQuestion | 13 / 71 | 13 | 6 quizzes exist twice; 16 questions carry `sourceType` = explorer with no `sourceId` |
| ComparisonTemplate | 4 | 4 | |
| PrintableResource | 8 | 8 | all HTML content, all with answer key and teacher notes, none with file or preview image |
| TimelineEvent | 23 | n/a | 1613 to 1885; 0 images; 4 explorer links, 5 location links, 0 waterway links |
| HistoricalEvent | 48 | n/a | 1534 to 2016; 31 images; 2 waterway links, 2 location links, 0 explorer links |
| PronunciationGuide | 33 | n/a | 0 audio; 0 link columns filled |
| IndigenousWord | 298 | n/a | 10 language labels; 0 linked to a waterway or location; 0 audio |
| VocabularyQuiz | 4 | 4 | |
| IndigenousStory | 3 | 3 | Cree, Ojibwe, Inuit |
| VoyageurJourney / JourneyNode | 2 / 23 | 2 | all nodes have coordinates and a historical fact; 0 cover images |
| Achievement | 28 | n/a | 12 of them count activities no route ever records (see 2.17) |
| DailyChallenge | 30 | n/a | dates 2026-02-11 to 2026-03-12, rotated by day index |
| WordOfTheDay | 4 | n/a | created on demand |

User and operational tables (contributions 2, teachers 7, classes 2, assignments 5, students 0,
journals 0, progress 0, map annotations 0, image health logs 6,150) are not content and are
not treated further.

---

## 1. Screen by screen

Each entry gives: the data hook and the route it calls; the fields the screen reads; filters and
gating; every cross-record connection and the mechanism that realizes it; and what a record
must carry to be complete on that screen. Paths are relative to `mobile/src/` unless they start
with `backend/`.

### 1.1 Student side

#### Map tab, native: `app/(tabs)/index.tsx`
- **Data.** `useWaterways()` (288) → `GET /api/waterways` (`backend/src/routes/waterways.ts:45-62`: id, name, indigenousName, lat, lng, regionName, type.name). `useLocations()` (290) → `GET /api/locations` (`locations.ts:21-40`: id, name, indigenousName, lat, lng, locationType, yearEstablished, imageUrl, waterway{id,name}). `useExplorers()` (291) → `GET /api/explorers` (`explorers.ts:7-21`). `useExplorerDetail(selectedExplorerId)` (292) for the explorer filter. `useRiverOverview()` (289) → `GET /api/waterways/overview/rivers`, the committed `generated/river-overview.json` built by `backend/scripts/build-waterway-overview.ts --types=River` (line paths only for line waterways, 172). `useWaterwayGeometry(id, tier, bbox)` (564-565) → `GET /api/waterways/:id/geometry`.
- **Filters.** Legend offers only River, Lake, Bay, Fort, Trading Post, Portage (967-1010); Strait, Sound, Inlet, Settlement, Cultural Site and `historic_site` have no legend entry (471-480, 511-520). Era chips (30-36) filter locations by `yearEstablished` with inclusive bounds (450-455, 537-542) and keep a waterway only if one of its locations falls in the era (447-461, 495-498). Explorer filter keeps the waterways in `explorerDetail.waterways[].waterway.id` and the locations on them (409, 491, 531).
- **Connections.** Explorer → waterway by `ExplorerWaterway` rows (409). Location → waterway by `Location.waterwayId` (458, 524, 531). Overview record → waterway by shared id (427-428). Tap hit-testing on the overview is geometric: bbox prefilter, point-in-ring, 24 px segment distance (202-249).
- **Complete record here.** A waterway needs `latitude`/`longitude`, `type`, and `kmlData` for a trace (overview for rivers, geometry route for all). A location needs coordinates, a `locationType` the legend knows, a `yearEstablished` for the era filter (a null year passes every era, 450), and a `waterwayId`. An explorer needs at least one `ExplorerWaterway` row or the filter returns nothing (490, 530).

#### Map, web: `app/(tabs)/index.web.tsx`
- Lists waterways and locations (26-27), detail panels via `useWaterwayDetail`/`useLocationDetail` (31-36). Shows explorers (158-165), fur trade (172-194), location's waterway and cartographer (238, 245). No navigation, no filters (166, 170). Reads `regionName` (85), the only screen that does.

#### Detail sheet: `components/DetailBottomSheet.tsx`
- **Data.** `useWaterwayDetail` (151-153) → `GET /api/waterways/:id` (`waterways.ts:194-264`, includes type, explorers{explorer} by yearExplored, furTradeInfo, locations{cartographer}, discoveries; strips `kmlData`, adds `hasKml`, 253-260). `useLocationDetail` (154-156) → `GET /api/locations/:id` (`locations.ts:72-141`, includes waterway{type, explorers{explorer}, furTradeInfo}, cartographer). Contributions by waterway/location (159-164). `useExplorerDetail(selectedExplorerId)` (169).
- **Fields.** Waterway: type, imageUrl, galleryImages (JSON, parsed 63), videoUrl (JSON array or plain URL, parsed 102-123), description, historicalSignificance, indigenousName/Language, explorers[] with year and notes (564-640), notableFigures[] (653-700), discoveries[] (704-780), furTradeInfo (787-835). Location: locationType, yearEstablished, cartographer.name (946-952), historicalNotes, and the **parent waterway's** explorers, notable figures and fur trade (975-1157), plus a non-tappable "Connected Waterway" card (1166-1179).
- **Connections and mechanisms.**
  - Waterway → explorers: `ExplorerWaterway` rows; tap opens `ExplorerDetailModal` (608, 1375-1378).
  - Waterway → notable figures: **text match**. The server runs `notableFigure.findMany({ where: { associatedLocations: { contains: waterway.name } } })` and filters the parsed array for the exact name (`waterways.ts:217-251`; same on `location.waterway.name` in `locations.ts:96-130`). A location's own name is never matched; a location shows its waterway's figures. Tap → `/notable-figures/:id` (668, 1076).
  - Waterway → discoveries: `ArchaeologicalDiscovery.waterwayId`. The discovery's explorer is `relatedExplorerName`, **text only**, not linked (751-753).
  - Location → cartographer: `cartographerId` (952).
  - Reading guide: **static file** `data/locationReadingGuideData.ts` keyed by record id, used for both waterway ids (841) and location ids (1186).
  - Contribution: `waterwayId`/`locationId` passed to `ContributeModal` (1361-1364).
- **Complete record here.** Waterway: description, historicalSignificance, imageUrl, 3+ gallery entries `{url, caption, credit}`, explorers with `yearExplored` and `expeditionNotes` (year shows "N/A" otherwise, 578-596), fur trade where it applies, and a reading-guide entry. A notable figure appears on a waterway only if `associatedLocations` contains the waterway's exact `name`. Location: yearEstablished, historicalNotes, image and gallery, cartographer where one surveyed it, reading-guide entry.

#### Explorer modal: `components/ExplorerDetailModal.tsx`
- Props only (18-22). Reads imageUrl, name, nationality, birth/death (shown only when both exist, 46), biography, notableAchievements, waterways[] with type badge, year and notes (72-110). Waterway rows are not tappable (78-81). Reading guide from static `data/readingGuideData.ts` keyed by explorer id (117, 123).

#### Explorers tab: `app/(tabs)/two.tsx`
- `useExplorers()` (40); sorted by the last whitespace-separated word of `name` (20-28, 44-51), so "Sieur de La Vérendrye" sorts under "Vérendrye" and "Captain George Vancouver" under "Vancouver". Card shows portrait, name, nationality verbatim, years (71-84). Tap → modal (68, 153-156). No filter.

#### Quizzes tab: `app/(tabs)/quizzes.tsx` and `app/quiz/[id].tsx`
- `useQuizzes(filters)` (188-190) → `GET /api/quizzes` (isPublished; `quizzes.ts`). Category chips hard-coded: Explorers, Fur Trade, Indigenous Heritage, Geography, Maritime History (19); grade chips K-3, 4-6, 7-9, 10-12 (23). Filters applied server-side and again client-side: category by substring (200), grade by equality (207). Estimated time = question count (81).
- Quiz screen posts `{userId, answers[{questionId, selectedAnswer}]}` to `POST /api/quizzes/:id/attempt` (336-345; `education-api.ts:1571-1573`); the server grades and awards points via `completeResource` (`quizzes.ts:237-256`). Question `sourceType`/`sourceId` are not read by this screen.
- **Complete record here.** title, description, category from the hard-coded five, gradeLevel from the four bands, difficulty, 5+ questions with options, correctAnswer id, explanation.

#### Deep Dives: `app/lessons/index.tsx`, `app/lessons/[id].tsx`
- List: `useLessonPlans({gradeLevel, topic})` (41-44) → `GET /api/lesson-plans` (`lesson-plans.ts:14-50`). Topic chips are **hard-coded** (25-34): Fur Trade, Geography, Indigenous Routes, Maritime Discovery, Metis History, Women in History, Cartography, Early Explorers. Live topics match this list exactly.
- Detail: `useLessonPlan` (110) → `GET /api/lesson-plans/:id` (`lesson-plans.ts:53-108`, parses images, keyFigures, timeline, curriculumConnections, objectives, materials, activities, discussionQuestions, teacher* arrays, related*Ids). Shows hero, grade, reading time, title, description, topic, `narrativeContent` (197-200), key figures (207-223), timeline (226-262), gallery (266-287), Mark Complete (290).
- **Connections and mechanisms.**
  - Key figure → explorer: `keyFigures[].explorerId` inside the JSON, read through `as any` (67, 213); the portrait is taken from the explorer record first (`explorerData?.imageUrl ?? figure.imageUrl`, 71); tap opens `ExplorerDetailModal` (218, 296-298). Live: 105 of 105 key figures carry an `explorerId` that resolves.
  - Timeline item → `TimelineEvent`: `timeline[].eventId` inside the JSON (233) → `useTimelineEvent` (115) → `GET /api/timeline/:id`. Items without `eventId` are pressable but open nothing (234-236). Live: 68 of 123 timeline items resolve.
  - `relatedWaterwayIds`, `relatedLocationIds`, `relatedExplorerIds`: parsed by the server, **read by no screen**. Live: empty on all 26.
  - Completion: `POST /api/lesson-plans/:id/complete` with `{userId}` (`MarkCompleteButton.tsx:53-56`, `education-api.ts:643`), 15 points, assignment completion (`lib/progress.ts`).
- **Complete record here.** gradeLevel, topic from the chip list, heroImageUrl, narrativeContent, images[] with caption and credit, keyFigures[] each with `explorerId` (and the person present in `Explorer` with a portrait if a likeness exists), timeline[] each with `eventId` pointing at a real `TimelineEvent`, readingTimeMinutes (live: 5 of 26 set).

#### Timeline: `app/timeline.tsx`
- `useTimelineEvents({theme, importance})` (75-78) → `GET /api/timeline` (`timeline.ts:7-61`); themes from `GET /api/timeline/themes`. Grouped by century in arrival order, assumes server year order (88-97). `explorerId`/`waterwayId`/`locationId` are shown as the words "Explorer", "Waterway", "Location" (174-191) and in the modal as "Related …" labels (440-457); **nothing is fetched or navigable**. No images are read.
- **Complete record here.** year (+ month/day/endYear/isApproximate), theme from the live set (exploration, fur_trade, indigenous, settlement), importance (major/moderate/minor), description. Link ids only matter if a future change makes them navigable.

#### Field Trips: `app/field-trips/index.tsx`, `app/field-trips/[id].tsx`
- List: `useFieldTrips({gradeLevel, theme})` (30-33) → `GET /api/field-trips` (`field-trips.ts:14-64`). Grade chips from `GRADE_LEVEL_RANGES`; `selectedTheme` exists but has **no chip UI** (28, 32).
- Detail: `useFieldTrip` (38) → `GET /api/field-trips/:id` (stops ordered, `field-trips.ts:67-87`). The map region is the average of stop coordinates (85-96); stops without coordinates are dropped from the map (82-84). Shows title, image, description, narrative, audio button with no handler (262-267). Introduction on first stop, conclusion and Mark Complete on last (214, 272, 280-281) → `POST /api/field-trips/:id/complete`, 20 points.
- **Connections.** None to other records. `FieldTripStop.locationId`/`waterwayId` exist in the admin schema (`backend/src/routes/admin-field-trips.ts:33-45`) and are 0 of 36 filled; the screen does not read them. Stop titles are prose ("David Thompson's Base Camp"); no stop title equals a location or waterway name, and the trips' subjects (Fort Carlton, Fort William, Prince of Wales Fort, Rocky Mountain House, York Factory) exist as `Location` rows only by **coordinate coincidence**, not by any join.
- **Complete record here.** gradeLevel, theme (live values `fur_trade`, `explorer`), estimatedMinutes, coverImageUrl, 6 stops each with coordinates, image, description, funFact, thinkQuestion. The screen also reads `stop.narrative` (255-258), which is neither in the admin stop schema (`admin-field-trips.ts:33-45`) nor a column in Turso (2026-10-14 introspection), so that section never renders; `audioUrl` is a column and is null on all 36 stops.

#### Documents: `app/documents/index.tsx`, `app/documents/[id].tsx`
- List: `useDocuments({type})` (38-40) → `GET /api/documents` (isPublished, filters type and gradeLevel, `documents.ts:7-43`). Type chips from `GET /api/documents/types` (150). **There is no grade filter UI**; `gradeBadge` styles are unused (302-311). Badge colour map keys: map, journal, letter, treaty, photograph, artwork, newspaper (24-32); live types are journal, report, letter, inscription, map, so `report` and `inscription` take the grey fallback.
- Detail: `useDocument` (49) → parses annotations, vocabulary, discussionQuestions (`documents.ts:59-84`). Shows image, type, grade, author, date, historicalContext, originalText and transcription, annotations by grade, vocabulary, discussion questions (80-205).
- **Connections.** `explorerId`/`waterwayId`/`locationId` are returned raw and **not read by either screen**. The author is a free-text string; 40 of 48 author strings equal an `Explorer.name` exactly.
- **Complete record here.** documentType, author, originalYear (originalDate optional), transcription (originalText where the source is in English), historicalContext, vocabulary[], discussionQuestions[], annotations[] by grade, **gradeLevel** (34 of 48 missing, so they never answer a grade query), imageUrl of the manuscript or a period image (1 of 48).

#### What Happened Here: `app/nearby-history.tsx`
- `useNearbyHistoryEventsByCategory(lat, lng, radius, category)` (339-349) → `GET /api/nearby-history/by-category` and `GET /api/nearby-history` (haversine radius, `nearby-history.ts:213-250`). Radius 5/10/25/50/100 km, default 50 (62, 328). Category chips are the hard-coded seven: exploration, fur_trade, indigenous, settlement, battle, treaty, maritime (65-101); `maritime` has 0 events. The categories hook result is ignored (336). Sorted by server-computed distance (407-409). "View on Map" pushes `/?lat&lng&eventId` (403).
- **Connections.** By coordinates only. The detail route joins related explorer/waterway/location (`nearby-history.ts:254-314`) but the screen never calls it.
- **Complete record here.** precise latitude/longitude, locationName, year, category from the seven, significance, description, imageUrl (31 of 48). Events in London and Greenhithe (1821 merger, 1845 departure) can only ever be found by a user standing in England.

#### Notable Figures: `app/notable-figures/index.tsx`, `app/notable-figures/[id].tsx`
- List: `useNotableFigures({figureType, nation})` (235-238) → `GET /api/notable-figures` (`notable-figures.ts:10-66`); featured via `/featured`; types and nations via `/types`, `/nations` (distinct values). `figureTypeConfig` knows woman, indigenous_leader, guide, interpreter, trader (43-74); live types also include `metis_leader` (3) and `voyageur` (1), which take the grey fallback (76-85).
- Detail: `useNotableFigure` (100) → parses associatedExplorers, achievements, associatedLocations (`notable-figures.ts:148-175`). Associated explorers render as cards with a chevron but are plain `View`s with **no press handler** and no id (255-265). Associated locations are text chips (277-281). Biography and significance render without a null guard (219-230).
- **Connections.** Figure → waterway is the text match in 1.1 Detail sheet (server side); figure → explorer is `{name, relationship}` text; 12 of 23 associated-explorer names equal an `Explorer.name` exactly, 11 do not (John Franklin vs "Sir John Franklin", John Richardson, George Back vs "Sir George Back", each twice; Lord Selkirk, Thomas Scott, Meriwether Lewis, William Clark, Toussaint Charbonneau).
- **Complete record here.** figureType from a canonical set, nation, role, biography, significance, achievements[], associatedExplorers[] with names spelled exactly as in `Explorer`, associatedLocations[] containing the exact `Waterway.name` strings for the waterways the figure should appear on, birth/death or active period, isFeatured, imageUrl only where a likeness exists.

#### Indigenous Languages: `app/indigenous-languages.tsx`
- `useWordOfTheDay`, `useIndigenousLanguages`, `useIndigenousWords({language})`, `useVocabularyQuizzes`, `useIndigenousStories` (65-71) → `/api/indigenous-language/*` (`indigenous-language.ts`). Language tabs from the live groupBy. Word cards show language, category, word, phonetic, translation, culturalContext (185-214).
- **Quiz cards (226) and story cards (251) are plain `View`s, not pressable.** Detail hooks `useVocabularyQuiz`, `useSubmitVocabularyQuiz`, `useIndigenousStory` exist (`education-api.ts:911-953`) and routes exist, but no screen opens a story or plays a vocabulary quiz. Colour map keys Cree, Ojibwe, Inuktitut, Mi'kmaq, Dene, Multiple (50-57); Blackfoot, Mohawk, Iroquois fall to the default; story colour uses the story's **nation** against the language map (249).
- **Connections.** None rendered. `relatedWaterwayId`/`relatedLocationId` on words and stories are 0 filled and unread.
- **Complete record here.** Word: word, translation, language, phonetic, culturalContext, category. Story: title, nation, language, content, summary, theme, gradeLevel. Vocabulary quiz: title, language, difficulty, questions[]. A story or quiz is "complete" only once a screen can open it.

#### Pronunciations: `app/pronunciations.tsx`
- `usePronunciations({termType, language})` (41-44), term types and languages from the server. Shows term, phonetic, meaning, play button only with `audioUrl` (106). Live: 0 of 33 have audio. Colour map keys waterway, location, nation, explorer, general (28-34); live termTypes are indigenous_nation, indigenous_place, french, explorer, so three of four take the fallback. No connections rendered; link columns 0 filled.

#### Compare: `app/comparisons/index.tsx`, `app/comparisons/[id].tsx`
- `useComparisons({type, gradeLevel})` (37-40), `useComparison` (49) → `ComparisonTemplate` only. Items are free-form JSON; the label key is the first of name, perspective, route, title (21-32); every key/value is rendered (133-158). The generated comparisons (`/api/comparisons/generate/explorers`, `/generate/forts`; `comparisons.ts:84-147, 165-196`) have hooks (`education-api.ts:333, 343`) but **no screen calls them**. Colour keys explorers, forts, waterways, nations, trading_companies (24-30); live types are explorers, perspectives, trade_companies, trade_routes, so three of four take the fallback.

#### Printables: `app/printables/index.tsx`, `app/printables/[id].tsx`
- `usePrintables({type, topic, gradeLevel})` (61-65); topics are fetched but there is no topic UI (58, 67). Detail renders `content` HTML in a WebView (50, 121); Download only with `fileUrl` (143), which no row has. Public route strips answerKey and teacherNotes (`printables.ts:91-94`). Colour keys worksheet, map, timeline, activity_sheet, quiz_printable match live.

#### Voyageur Journeys: `app/voyageur-journey/index.tsx`, `app/voyageur-journey/[id].tsx`
- `useVoyageurJourneys` (167), `useVoyageurJourney`, `useStartJourney`, `useMakeJourneyChoice`, `useJourneyProgress` (190-193). No client filter. Choices are posted to the server, which returns the next node (`voyageur-journey.ts`; screen 229-241). Map renders when the node has coordinates (346). `nodeType`, `challengeQuestion`, `challengeAnswer` are not read by the screen. Journey completion awards no `UserProgress` points (route adds `pointsChange` to journey progress only).
- **Connections.** `locationName` is text; in "The Grand Portage Route" two node names equal `Location.name` (Grand Portage, Fort William) by coincidence; nothing joins.

#### Achievements: `app/achievements.tsx`
- `useUserProgress`, `useAchievements`, `useUserAchievements`, `useDailyChallenge`, `useSubmitDailyChallenge` (413-419). Earned status matches `userAchievement.id` to `achievement.id`; the server returns the achievement's id in `id` (`gamification.ts:181-182`), so the match is correct. Daily challenge: `GET /api/gamification/daily-challenge` rotates the 30-row pool by day index (`gamification.ts:214-283`); submit awards `pointsReward` directly (292-407).
- **Criteria that can never be met.** `recordActivity` is called only for journal entries (`journals.ts:186`) and by `completeResource` for quizzes, lessons and field trips (`lib/progress.ts:267`). The only route that records `waterway_explored`, `location_visited`, `pronunciation_learned` or `document_read` is `POST /api/gamification/progress/add-points` (`gamification.ts:111-130`), and its client hook (`education-api.ts:993`) is called by **no screen**. So the 12 achievements with those criteria (First Steps, Waterway Wanderer, River Runner, Master Cartographer, Location Scout, Fort Finder, First Discovery, Document Detective, Archive Master, First Words, Language Learner, Polyglot) cannot be earned today.

#### My Class, Join Class, Journal, My Maps
- `app/my-class.tsx`: `GET /api/classes/mine?userId` (`classes.ts:152-213`); assignment rows route to `/quiz/:id`, `/lessons/:id`, `/field-trips/:id` by `quizId`/`lessonPlanId`/`fieldTripId` (42-47). These are the only content types a teacher can assign (`classes.ts:49-57`).
- Journal: entries may carry `waterwayId`, `locationId`, `explorerId`, `quizId`, `lessonPlanId`, `fieldTripId` (`journals.ts:17-27`) but the entry screen posts only title, content, tags (`journal/entry/[id].tsx:72-90`). Saved locations exist server-side (`journals.ts:264-326`) and no screen calls them.
- My Maps: pins may carry `linkedWaterwayId`/`linkedLocationId`/`linkedExplorerId` and routes `compareToExplorerId` (`map-annotations.ts:31-51`); the screen posts coordinates, title, description, colour only (`my-maps/[id].tsx:236-242`).

#### Learn hub, settings, onboarding
- `app/(tabs)/learn.tsx` is static navigation (130-323). `settings/*` and `onboarding.tsx` carry no records; onboarding hard-codes "Learn 298 words from 8 Indigenous languages" (71), which is the live word count today and will drift.

### 1.2 Teacher side

#### Lesson Plans: `app/teacher/lesson-plans.tsx`, `app/teacher/lesson-plan/[id].tsx`
- Same list endpoint as Deep Dives; same hard-coded topic list (24-34). Detail reads the **teacher face**: objectives, materials, activities `{title, duration, description, materials[]}`, discussionQuestions, `assessmentSuggestions` (192-198), curriculumConnections `{subject, strand, expectation}`, relatedQuizIds as a count (227-236) whose button pushes the generic `/(tabs)/quizzes` with no filter (232).
- **Bug.** The screen reads `lesson.assessmentSuggestions`; the server spreads the row and the column is `assessment` (`lesson-plans.ts:53-108`; schema line 277). The type file declares `assessmentSuggestions` (`lib/types/education.ts:63`). The Assessment section never renders for the 25 plans that have one.

#### Deep Dives (teacher view): `app/teacher/deep-dives.tsx`, `app/teacher/deep-dive/[id].tsx`
- All plans, no filter (26, 81). Detail merges base and teacher arrays without distinction (91-106); "teacher only" sections are styled, not gated, and the screen has no session check (205, 219). Renders narrativeContent, mainContent, teacherNotes, assessmentSuggestions as Markdown via `components/MarkdownContent.tsx` (H2/H3/H4, bullets, numbered as bullets, bold, italic; no links, images or tables, 51-160). "Assign" pushes `/teacher/assignment/new?lessonId=` (340).

#### Classes and assignments: `app/teacher/dashboard.tsx`, `class/new.tsx`, `class/[id].tsx`, `assignment/new.tsx`
- Dashboard requires a teacher session (56-59). Class detail shows students and assignments with "x of N students completed" against the current roster (231-232); assignment rows are not pressable and never read the resource ids (205). New assignment picks a quiz, lesson plan or field trip by title substring (144-148), **not filtered by the class's grade**, and posts `{title, assignmentType, instructions, dueDate, quizId|lessonPlanId|fieldTripId}` (189-200; `classes.ts:603-664`).

### 1.3 Admin side

| Screen | What it can do | Evidence |
|---|---|---|
| `(tabs)/admin.tsx` | login, counts, links; admin tab is always declared in the tab bar (`(tabs)/_layout.tsx:105-118`) | 101-111, 279-366 |
| `admin/quizzes.tsx`, `quiz-editor/new.tsx`, `quiz-editor/[id].tsx`, `components/QuestionEditorModal.tsx` | full quiz and question editing; question may link `sourceType` explorer/waterway/location + `sourceId` from live lists (QuestionEditorModal 145-147, 319-330); server validates correctAnswer ∈ options (`admin-quizzes.ts:348-360`) | |
| `admin/lesson-plans.tsx` | list and delete only; Create and Edit show "Coming Soon" (152-160) although `POST/PATCH /api/admin/lesson-plans` exist | |
| `admin/documents.tsx` | list and delete; Create/Edit "Coming Soon" (167-175); API exists with annotations/vocabulary schemas (`admin-documents.ts:13-60`) | |
| `admin/field-trips.tsx` | list and delete; Create/Edit "Coming Soon" (170-178); API exists incl. stops with `locationId`/`waterwayId` (`admin-field-trips.ts:33-59, 207-309`) | |
| `admin/printables.tsx` | list and delete; Create/Edit "Coming Soon" (166-174) | |
| `admin/contributions.tsx` | approve/reject pending contributions (156-187) | |
| `admin/my-content.tsx` | placeholder, all counts hard-coded 0 (66-68, 138-170) | |
| `admin/users.tsx`, `approvals.tsx`, `teacher-approvals.tsx` | account management | |
| Notable figures | `POST/PATCH/DELETE /api/notable-figures` behind `requireAdmin` (`notable-figures.ts:178-297`); **no screen** | |
| KML | `POST/DELETE /api/waterways/:id/kml` super admin; `backend/src/admin-panel.html` served at `/admin/kml` (`index.ts:80-83`) | |
| Image health | `scheduleImageHealthCheck()` daily 02:00 (`jobs/image-health-check.ts:414-431`), covers imageUrl/gallery/hero/cover fields on 14 models (50-171), auto-repairs broken Wikimedia URLs on non-UGC rows (225-264); `admin-image-health.ts` dashboard route | |

**No editor of any kind** (screen or admin route) exists for: Waterway rows (other than KML), Location, Explorer, ExplorerWaterway, FurTradeInfo, Cartographer, IndigenousNation, TimelineEvent, HistoricalEvent, IndigenousWord, PronunciationGuide, IndigenousStory, VocabularyQuiz, ComparisonTemplate, VoyageurJourney/JourneyNode, DailyChallenge, Achievement. These are populated only by scripts against Turso.

---

## 2. Type by type: what a complete record is, and how it connects

For each type: the surfaces (from section 1), the connection mechanisms with the live fill, the
minimum data for a new record to be useful, and the live defects.

### 2.1 Waterway
- **Surfaces.** Map pin and trace, preview card, detail sheet, web list, explorer modal (name and type), lesson key-figure modal, fur trade, discoveries.
- **Connections.**

| To | Mechanism | Live fill |
|---|---|---|
| WaterwayType | `typeId` column | 70/70; one row typed `lake` beside 12 `Lake` |
| Explorer | `ExplorerWaterway` rows (join) | 52 waterways have ≥1; 18 have none |
| Location | `Location.waterwayId` (column on the location) | 33 waterways have ≥1 location |
| FurTradeInfo | 1:1 `waterwayId` | 21 |
| ArchaeologicalDiscovery | `waterwayId` | 6 waterways |
| NotableFigure | **text**: `associatedLocations` contains exact `name` | 5 waterways reached (Coppermine 3, Columbia 2, Great Slave Lake 2, Great Bear Lake 1, Mackenzie River (Ontario) 1; the other 65 show no figure) |
| TimelineEvent / HistoricalEvent | `waterwayId` | 0 / 2 |
| LessonPlan | `relatedWaterwayIds` JSON | 0 |
| FieldTripStop | `waterwayId` | 0 |
| QuizQuestion | `sourceType`=waterway + `sourceId` | 0 |
| IndigenousWord / IndigenousStory | `relatedWaterwayId` | 0 / 0 |
| PronunciationGuide | `waterwayId`; or term equals name | 0; 1 term equals an Indigenous name (Kisiskatchewan) |
| Reading guide | static key = id | 68 of 70 (Hayes River and Kaministiquia River lack one) |
| Geometry | `kmlData` → overview JSON (rivers) and geometry route | 66 of 70; missing: Davis Strait, Georgia Strait, Parry Channel, Mackenzie River (Ontario) |
| Imagery | `imageUrl` + `galleryImages` JSON + `videoUrl` JSON, all on R2 | 69 (the missing one is Mackenzie River (Ontario)); 279 gallery entries |

- **Minimum useful record.** name (with a disambiguating suffix for namesakes, e.g. "Red Deer River (Alberta)"), type from the six live types, latitude/longitude anchor (the KML cleaning guard measures from it), regionName, description, historicalSignificance, indigenousName + indigenousLanguage where attested, kmlData exported with `backend/scripts/export-waterway-kml.ts` (continuity guard, `--with-surface` for wide rivers) then `build-waterway-overview.ts` if a River, imageUrl and 3-5 gallery entries with caption and credit on R2, at least one ExplorerWaterway with year and notes, FurTradeInfo where trade ran on it, its forts/posts/portages as Locations (which is what makes the era filter find it), and a reading-guide entry.
- **Defects.** Type `lake`; "Mackenzie River (Ontario)" has no KML, no image, no links and is reached only by the Roderick McKenzie text match; 18 waterways without an explorer (Abitibi, Albany, Assiniboine, Atikokan, Bellot Strait, Chesterfield Inlet, Friendly Cove, Hayes, Lake Erie, Lake Nipigon, Lesser Slave Lake, Moose, Placentia Bay, Reindeer Lake, Saguenay, Saint John, Yukon, plus the Ontario row).

### 2.2 Location
- **Surfaces.** Map pin (legend type, era), preview, detail sheet (its own fields plus the parent waterway's people), web list, generated fort comparison (unused by any screen).
- **Connections.** waterwayId 100/100; cartographerId 1/100 (Fort Témiscamingue → Louis Jolliet); reached from field trip stops 0/36, timeline 5/23, historical events 2/48, documents 1/48, lesson relatedLocationIds 0, quiz source 0, words 0, pronunciation 0; reading guide 83/100 (17 forts lack one, listed in `sweep-verify.json`); image 100/100, gallery 99/100 (350 entries, 1 on commons.wikimedia.org and broken per the last health run), video 100/100.
- **Minimum useful record.** name, locationType from the canonical set (Fort, Trading Post, Portage, Settlement, Cultural Site), latitude/longitude, yearEstablished (null passes every era filter), description, historicalNotes, waterwayId, imageUrl + gallery, indigenousName where attested, cartographerId where a mapmaker surveyed it, reading-guide entry. The locationType must be one the legend knows if it should be filterable (Settlement and Cultural Site are not).
- **Defects.** `fort` ×1 and `historic_site` ×3 beside the canonical labels; Fort William / Fort William (NWC), Fort Edmonton / Fort Edmonton (HBC), Fort Churchill / Fort Churchill (HBC), Fort Garry / Fort Garry (Upper) / Upper Fort Garry, Rocky Mountain House / Rocky Mountain House (NWC) are pairs that need a keep/merge decision; Fort Churchill (HBC, 1783) sits on "Churchill River (Saskatchewan)" and Prince of Wales Fort (1717) likewise, though the Churchill mouth is the Manitoba Churchill (data correctness to confirm, unverified against sources).

### 2.3 Explorer
- **Surfaces.** Explorers tab, explorer modal, map explorer filter, detail-sheet explorer rows, lesson key-figure cards and modal, generated explorer comparison (unused).
- **Connections.** ExplorerWaterway: 42 of 92 have ≥1; 50 have none and are therefore invisible on the map and show an empty "Waterways Explored". Documents by `explorerId`: 43 docs over 17 explorers. Timeline `explorerId` 4; historical events 0. Lesson key figures by `explorerId` 105 entries pointing at 39 distinct explorers; 53 explorers appear in no lesson. Notable figures naming the explorer by text: 10. Discoveries by `relatedExplorerName`: 6. Pronunciation: 3 terms typed explorer (Des Groseilliers, La Verendrye, Radisson) but the term is not the full name so no screen can match it. Reading guide 92/92. Portrait 70/92; all on R2.
- **Minimum useful record.** name (the surname-sort rule means titles like "Captain", "Sir", "Dr." are harmless but "de La Vérendrye" sorts under V), birthYear/deathYear (both or the lifespan is hidden), nationality from a controlled list, biography, notableAchievements, imageUrl only with a verified likeness, ≥1 ExplorerWaterway with yearExplored and expeditionNotes, reading-guide entry, and where the person wrote: documents with `explorerId`.
- **Defects.** 37 nationality variants printed verbatim ("American (Vermont), Loyalist", "Danish (sailing for Russia)"). 22 without portrait: Alexander Henry the Younger, Charlotte Small, Duncan McGillivray, François de La Vérendrye, Isabel Gunn, Jacques de Noyon, James Knight, Jean-Baptiste Gaultier de La Vérendrye, John McDonald of Garth, Joseph Colen, Louis-Joseph Gaultier de La Vérendrye, Matthew Cocking, Moses Norton, Philip Turnor, Pierre Gaultier de La Vérendrye fils, Richard Norton, Richard Stuart, Robert Bylot, Roderick Mackenzie, Thomas James, William Stuart, William Tomison. Richard Stuart and Robert Bylot have no years. **Fourteen rows are not explorers and also exist as NotableFigure**: Akaitcho, Big Bear, Charlotte Small, Chief Peguis (figure absent), Crowfoot, Cuthbert Grant, Gabriel Dumont, Isabel Gunn, Jean-Baptiste Lagimodiere, Louis Riel, Marie-Anne Gaboury, Matonabbee, Poundmaker, Thanadelthur (Shawnadithit is in Explorer only). They are there because lesson key figures can only point at `Explorer` (2.9). A rule is needed; see section 6.

### 2.4 Notable figure
- **Surfaces.** Notable Figures list and detail; detail sheet of the waterways named in `associatedLocations`.
- **Connections.** Waterway by text (6 of 18 figures reach any waterway: Akaitcho, Charlotte Small, Matonabbee, Roderick McKenzie, Sacagawea, Tattannoeuck); explorer by `{name, relationship}` text, no id; lesson key figures reach these people only through their duplicate `Explorer` row. Image 4/18 (3 on R2, Crowfoot on Wikimedia and broken in the last health run).
- **Minimum useful record.** As 1.1 Notable Figures. For the figure to appear on a waterway, `associatedLocations` must hold that waterway's exact `name`; for a location, the location's waterway name (a location name alone does nothing).
- **Defects.** `nation` is free text with 11 variants and does not reference `IndigenousNation`; 9 of the 11 are absent from that table. figureTypes `metis_leader` and `voyageur` have no colour/label config. Associated-explorer names mismatch `Explorer.name` in 11 of 23 entries. Sacagawea has no link into the app other than "Columbia River" (owner's earlier call to keep).

### 2.5 Indigenous nation
- **Surfaces.** None. `useIndigenousNations()` exists (`lib/api/waterways-api.ts:152-155`) and `/api/indigenous/nations` is served, but no file under `app/` calls the hook. The figure filter "nation" and story `nation` are free-text distinct values, not this table.
- **Connections.** None by column anywhere. Pronunciation terms equal 3 nation names (Cree, Dene, Mi'kmaq).
- **Minimum useful record.** name, alternateNames, languageFamily, traditionalTerritory, culturalNotes. Useful only once a surface exists or `NotableFigure.nation` / `IndigenousStory.nation` / `IndigenousWord.language` are tied to it.
- **Defects.** All 7 nations duplicated (14 rows).

### 2.6 Cartographer
- **Surfaces.** `locationDetail.cartographer.name` only (DetailBottomSheet 946-952; web 245). No list, no detail.
- **Connections.** `Location.cartographerId`: 1 of 100. Five of the eleven (Thompson, Jolliet, Fidler, Turnor, Champlain) duplicate `Explorer` rows by name.
- **Defects.** Bellin ×2, Jolliet ×2 (one of the Jolliet rows holds the single location link).

### 2.7 Fur trade info
- 1:1 with waterway; shown in detail sheet and web detail and inherited by locations. 21 rows. `tradingCompany` is free text in 11 spellings of the same four companies plus "Pacific Fur Company", "XY Company", "British maritime traders".

### 2.8 Archaeological discovery
- 8 rows, shown only in the waterway detail sheet. Explorer by `relatedExplorerName` text (6 of 8 equal an `Explorer.name`; Red Bay has none). Route `/api/discoveries` exists but the app reads discoveries only through the waterway detail include.

### 2.9 Lesson plan / Deep Dive (one row, two faces)
- **Surfaces.** Deep Dives (student), teacher Lesson Plans, teacher Deep Dives, assignable.
- **Connections.** keyFigures[].explorerId → `Explorer` 105/105 resolve (JSON id, not a column); timeline[].eventId → `TimelineEvent` 68/123; related*Ids 0/26 and unread; relatedQuizIds 0 and read only as a count. Hero and images 26/26 on R2. Completion → points and assignments.
- **Minimum useful record.** Student face: title, description, gradeLevel (one of four bands), topic (from the hard-coded chip list), heroImageUrl, narrativeContent (markdown; live range roughly 2,500-4,000 characters), images[] `{url, caption, credit}`, keyFigures[] `{name, role, years, description, explorerId}`, timeline[] `{year, title, description, eventId}`, readingTimeMinutes. Teacher face: curriculumConnections[] `{subject, strand, expectation}`, objectives[], estimatedMinutes, materials[], mainContent, activities[] `{title, duration, description, materials[]}`, discussionQuestions[], assessment, teacherObjectives[], teacherActivities[], teacherQuestions[], teacherNotes. Flags isPublished (the public route filters on isPublished only; `visibility` and `isCore` are consulted only by the admin edit-permission helper in `backend/src/lib/admin-middleware.ts:161-190`).
- **Consequence for people.** Because the key-figure link is `explorerId`, every person a Deep Dive wants to make tappable must be an `Explorer` row. That is why Thanadelthur, Riel and the chiefs are in that table. Either the key-figure link gains a `notableFigureId` alternative (code change) or the rule stays "anyone who is a key figure is an Explorer" and the Explorers tab accepts that.

### 2.10 Virtual field trip and stops
- Covered in 1.1. 6 trips, 36 stops, all stops imaged; 0 stop links; themes `fur_trade`/`explorer`; grades 4-6 ×4, 7-9 ×2; none for K-3 or 10-12. Subjects: Fort Carlton, Fort William, L'Anse aux Meadows, Prince of Wales Fort, Rocky Mountain House, York Factory. Four of the six subjects exist as `Location` rows at the same coordinates with no join; L'Anse aux Meadows exists only as a discovery row.

### 2.11 Quiz and questions
- 13 quizzes, 6 duplicated by title and content (Canada's Waterways Geography, Explorers of Canada's Coasts, Famous Canadian Explorers, Indigenous Peoples & Canadian Waterways, Lost & Found, The Fur Trade Era); "Explorers of Canada" has 1 question. 71 questions, all multiple choice with explanation. `sourceType`=explorer on 16 with `sourceId` null; the editor can set both (QuestionEditorModal 456-472) and the server stores them, but the editor's reset effect wipes a loaded `sourceId` when `sourceType` changes (235-237). Categories and grade bands are hard-coded in the tab.
- **Minimum useful record.** 5-8 questions; category from the five; gradeLevel from the four; difficulty; sourceType/sourceId where the question is about one record (only useful once a screen reads it).

### 2.12 Primary source document
- 48 rows: journal 25, report 12, letter 9, inscription 1, map 1. Authors: 17 explorers (Mackenzie 3, Back 3, Cartier 3, Champlain 3, Fidler 3, La Pérouse 4, La Salle 3, Norton 3, R. Stuart 3, W. Stuart 3, Turnor 3, Tyrrell 3, Hearne 3, Thompson 2, Rae 1, Fraser 1, Pond 1) plus Joutel, Knight, Matonabbee, Marten, Saukamappee-via-Fidler. 43 have `explorerId`; the 5 without: Rae's report, Knight on Thanadelthur, Pond's map, Fidler recording Saukamappee, York Factory Trade Record (the last is the only one with waterwayId and locationId). 34 have no gradeLevel; 14 have annotations; 1 has an image.
- **Minimum useful record.** As 1.1 Documents, with gradeLevel always set and explorerId set when the author or subject is an explorer.

### 2.13 Timeline event
- 23 rows, 1613-1885, all without image; 4 explorer and 5 location links, 0 waterway links. Reached from lessons by eventId: 68 of 123 lesson timeline items carry one, pointing at 18 distinct events; 5 events are referenced by no lesson. Link ids are displayed as labels only.

### 2.14 Historical event (What Happened Here)
- 48 rows, 1534-2016, GPS-driven. 31 images (29 R2, 2 Wikimedia; the Crowfoot one broken). 2 waterway links, 2 location links, 0 explorer links. Two events are placed in England.

### 2.15 Indigenous language content
- Words 298 in 10 labels (Cree 83, Ojibwe 58, Inuktitut 45, Dene 34, Blackfoot 30, Mohawk 22, Mi'kmaq 19, Iroquois 5, Seneca/Iroquois 1, Mohawk/Iroquois 1), 9 categories, all with phonetic and cultural context, 0 audio, 0 links. Stories 3, vocabulary quizzes 4, neither openable from any screen. Pronunciations 33, 0 audio, 0 links.

### 2.16 Comparison, printable, voyageur journey, daily challenge
- Comparisons 4 (explorers, perspectives, trade_companies, trade_routes), items with parallel keys; grades 7-9 ×3, 10-12 ×1. Printables 8, all HTML, grades 4-6 ×4, 7-9 ×3, 10-12 ×1, none K-3. Journeys 2 (Race to the Pacific 1793, 7-9; The Grand Portage Route 1790, 4-6), 23 nodes all with coordinates and facts, 0 cover images, 0 challenges. Daily challenges 30 (explorer 8, indigenous 8, fur_trade 6, waterway 4, voyageur 4).

### 2.17 Achievements and points
- 28 achievements in 6 categories. Reachable today: total_points (3), daily_streak (3), quizzes_completed (4), field_trips_completed (3), journal_entries (3). Unreachable (12): waterways_explored (4), locations_visited (2), documents_read (3), pronunciations_learned (3), because no screen records those activities (1.1 Achievements). This is a code gap, not a content gap, and it bears on what "complete" means for waterways, documents and pronunciations.

### 2.18 Static data files (shipped in the app binary)
- `data/locationReadingGuideData.ts`: 155 keys; 68 resolve to waterways, 83 to locations, 4 resolve to nothing (`cmlhbjrrri0017m2mbfts7d8is`, `cmlhcpxjz0007m2a3yptljq2u`, `cmlhcpxk7000dm2a3aywic3h2`, `cmlhcpxka000dm2a3aywic3h2`; two look like typos of neighbouring ids). Entries are `{authorSource, title, publisher?, year?, url?, description?}`; some `authorSource` strings are corrupted by escaping ("Hudson\\\\", "Lady Franklin\\\\").
- `data/readingGuideData.ts`: 92 keys, all 92 explorers covered.
- Any new waterway, location or explorer needs an entry here and therefore **an app build**, unlike every other content type, which is server-side.

---

## 3. Connection mechanisms, consolidated

| # | Mechanism | Where | Fill today | Note |
|---|---|---|---|---|
| A | Foreign-key column, joined server-side | Location.waterwayId; Location.cartographerId; FurTradeInfo.waterwayId; ArchaeologicalDiscovery.waterwayId; FieldTripStop.tripId; QuizQuestion.quizId; JourneyNode.journeyId; ClassAssignment.quizId/lessonPlanId/fieldTripId | high where it is the parent key; 1/100 cartographer; 0/36 stop links | the only mechanism the app can navigate reliably |
| B | Join table | ExplorerWaterway | 105 rows, 42/92 explorers | drives map filter and both detail views |
| C | Id column returned raw, not joined, not read by the screen | TimelineEvent.*Id, HistoricalEvent.*Id (list), PrimarySourceDocument.*Id, IndigenousWord.related*, IndigenousStory.relatedWaterwayId, PronunciationGuide.*Id, LessonPlan.related*Ids, QuizQuestion.sourceId | mostly 0 | filling these changes nothing on screen until code reads them |
| D | Id embedded in a JSON column, read through `as any` | LessonPlan.keyFigures[].explorerId (105/105), LessonPlan.timeline[].eventId (68/123) | | the two links that make Deep Dives interactive |
| E | Text match on a name | NotableFigure.associatedLocations ∋ Waterway.name (server); NotableFigure.associatedExplorers[].name; ArchaeologicalDiscovery.relatedExplorerName; Document.author; JourneyNode.locationName; HistoricalEvent.locationName | partial | breaks silently on any rename or spelling variant |
| F | Coordinates | FieldTripStop lat/lng; HistoricalEvent radius; JourneyNode lat/lng; map hit-testing | full | coincidence with pins is not a join |
| G | Static file keyed by id, shipped in the binary | reading guides | 155 + 92 keys | needs a build to change |
| H | Hard-coded taxonomy in the client | quiz categories and grades; lesson topics; nearby-history categories; legend types; colour maps for document type, figure type, pronunciation termType, comparison type, journey difficulty | | new values render in grey or are unfilterable until the client changes |

---

## 4. Teaching resources by grade band (live)

| Band | Deep Dives / Lesson Plans | Quizzes | Field trips | Documents | Printables | Journeys | Comparisons | Stories |
|---|---|---|---|---|---|---|---|---|
| K-3 | 6 | 2 (1 distinct) | 0 | 0 | 0 | 0 | 0 | 0 |
| 4-6 | 7 | 4 (2 distinct) | 4 | 5 | 4 | 1 | 0 | 2 |
| 7-9 | 7 | 5 (3 distinct) | 2 | 9 | 3 | 1 | 3 | 1 |
| 10-12 | 6 | 2 (1 distinct) | 0 | 0 | 1 | 0 | 1 | 0 |
| no band | 0 | 0 | 0 | 34 | 0 | 0 | 0 | 0 |

Topic coverage of the 26 plans: Fur Trade 12, Indigenous Routes 4, Metis History 3,
Cartography 2, Maritime Discovery 2, Early Explorers 1, Geography 1, Women in History 1.
Quiz categories: Explorers 5 (3 distinct), Geography 2 (1), Maritime History 2 (1),
Indigenous Heritage 2 (1), Fur Trade 2 (1). Nothing on New France, the Pacific voyages,
the Arctic searches, cartography, Métis history or women exists as a quiz; no field trip
exists outside the fur trade and L'Anse aux Meadows; no document is set for K-3 or 10-12.

---

## 5. Gap analysis in the North American context

The test for inclusion is the owner's: relevant to early North American exploration, trade and
cartography as it bears on Canadian history, and useful on at least one surface the app has.
For each candidate the surfaces it would serve and the records it would link to are stated.
**Geometry availability** means the OpenStreetMap exporter has not been run for it in this
session and is unverified until it is. **Likeness** means whether a portrait with a defensible
provenance exists; this is unverified for every person named below and must be checked one by
one at authoring time (the rule stands: no portrait where none is verified, as with David
Thompson).

### 5.1 Waterways

Present and reasonably connected: St. Lawrence, Ottawa, Saskatchewan, Churchill (Sask.),
Columbia, Fraser, Mackenzie, Red, Peace, Athabasca, Lake Athabasca, Lake Winnipeg, Lake
Superior, Hudson Bay, James Bay, Nootka Sound, Great Slave Lake, Coppermine, Kaministiquia.

Present but isolated (no explorer, no location, or both): Abitibi, Albany, Assiniboine (3
locations, no explorer), Atikokan, Bellot Strait, Chesterfield Inlet, Friendly Cove, Hayes
(the HBC's main road inland from York Factory and the one Thompson, Fidler and every Orkney
servant travelled; it has neither explorer nor location nor reading guide), Lake Erie, Lake
Nipigon, Lesser Slave Lake, Moose, Placentia Bay, Reindeer Lake, Saguenay (Tadoussac is on the
St. Lawrence row), Saint John, Yukon.

Absent, grouped by why they matter to the app's story:

- **Interior of the fur trade (Canada).** North Saskatchewan and South Saskatchewan as named
  rows (the forts along them sit on the single "Saskatchewan River"); Winnipeg River, Rainy
  River and Rainy Lake, Pigeon River (the Grand Portage route); Clearwater River with Methye
  Portage (the portage is a location on the Churchill row); Sturgeon-Weir; Slave River (the link
  between Athabasca and Great Slave Lake that Mackenzie, Pond and every northern brigade used);
  Liard; Qu'Appelle; Bow and Oldman; Battle River; Beaver River (Alberta); Lake Manitoba,
  Lake Winnipegosis, Cedar Lake; Lake Nipissing and the Mattawa (the Champlain/voyageur route to
  the French River); Lake Timiskaming; Rupert, Eastmain, Severn, Attawapiskat, Missinaibi (the
  James Bay posts); Churchill River (Manitoba), which is where Prince of Wales Fort actually
  stands; Dubawnt, Kazan and the Thelon's neighbours (Tyrrell, Hearne); Hay River; Thompson,
  Skeena, Stikine, Nass, Kootenay and the Okanagan (New Caledonia and the Columbia Department);
  Richelieu and Lake Champlain (Champlain 1609, the Iroquois war road, the fur route to Albany);
  Niagara; Detroit River and Lake St. Clair (Cadillac).
- **New France to the Gulf.** Mississippi (Jolliet and Marquette 1673, La Salle 1682, the
  Louisiana documents already in the app have nowhere to point); Illinois River and the Chicago
  portage; Wisconsin and Fox rivers (Marquette's route from Green Bay); Ohio (La Salle, the
  1750s contest); Missouri (La Vérendrye's sons 1738-43, Thompson at the Mandan villages 1797,
  Lewis and Clark); Arkansas and Red River of the South only if the Louisiana story is told.
- **The Dutch and the English colonies.** Hudson River (Hudson 1609, Fort Orange/Albany, the
  Mohawk trade that pulled furs away from Montreal); Mohawk River; Lake George; Connecticut
  River is marginal.
- **Pacific and Russian.** Strait of Georgia and Juan de Fuca are present; absent are the
  Snake River (Ogden, Astorians), Willamette, Puget Sound (Vancouver 1792), Prince William
  Sound and Cook Inlet (Cook 1778, Russians), Sitka Sound (Baranov, the Russian-American
  Company), Kodiak, the Alaska coast Bering and Chirikov touched (Lituya Bay is present).
- **Arctic and the search for the Passage.** Davis Strait and Parry Channel exist without
  KML; absent are Smith Sound, Jones Sound, Wellington Channel (Franklin's last route), Peel
  Sound, Victoria Strait and Simpson Strait (Rae, Dease and Simpson), Coronation Gulf, Bathurst
  Inlet, Repulse Bay (Rae's winter base), Wager Bay (Middleton 1742), Roes Welcome Sound (Munk,
  Knight), Great Fish/Back is present, Hood River, Hudson Strait and Ungava Bay (the whole HBC
  supply road), Fury and Hecla Strait, Lyon Inlet, Melville Sound.
- **Atlantic approaches.** Cabot Strait, Gulf of St. Lawrence as its own row, Bay of Fundy
  (Port-Royal is currently pinned to the St. Lawrence row, which is geographically wrong),
  Annapolis River, Miramichi, Restigouche, Labrador coast (Cartwright, the Moravians), Hamilton
  Inlet and Churchill River (Labrador), Trinity and Conception bays, Grand Banks only as a bay
  type if fisheries are told.

Each absent waterway is worth adding only with at least one explorer row, its posts as
locations, and a reading-guide entry; a bare trace adds nothing to any screen but the map.

### 5.2 Locations

Absent forts, posts and places that the existing people and documents already name:
Île-à-la-Crosse (Thompson, Charlotte Small, Fidler); Fort Fork (Mackenzie 1793, a document
exists); Fort Reliance is present but Fort Enterprise and Fort Franklin are not; Fort
Wedderburn and Fort Chipewyan (present) on Lake Athabasca; Pembina (Lagimodière, Gaboury,
Gunn); Red River Settlement/Fort Douglas and Seven Oaks (Grant, Riel, a battle event exists);
Fort Rouge (an event exists); Fort St. Pierre, Fort St. Charles (present), Fort Maurepas, Fort
La Reine, Fort Dauphin, Fort Bourbon, Fort Paskoya (the La Vérendrye chain); Grand Portage is
present; Fort Charlotte at its inland end; Rainy Lake House (present as Fort Lac La Pluie);
Michilimackinac (an event exists), Sault Ste. Marie (present), Green Bay/La Baye, Fort
Frontenac (event exists), Fort Niagara, Fort Detroit (event exists), Fort Pontchartrain;
Stadacona and Hochelaga as Indigenous settlements rather than only as Quebec and Montreal;
Tadoussac present; Trois-Rivières; Lachine; Fort Orange/Albany and New Amsterdam (the Dutch
trade); Fort Astoria present, Fort Okanogan, Fort Nez Percés present, Spokane House present,
Fort Vancouver present, Fort Nisqually, Fort Langley present, Fort Victoria present, Fort St.
James present, Fort McLeod present, Fort Fraser, Fort George (BC) present; Sitka/New Archangel
(Russian), Yuquot present, Fort San Miguel present; Fort Enterprise, Fort Confidence, Fort
Hope and Repulse Bay (Rae), Beechey Island (a discovery row exists), Fort Ross (Bellot Strait);
Churchill: Prince of Wales Fort present; Port Nelson and the first York Factory; Henley House,
Albany present, Moose Factory present, Eastmain House, Rupert House present; Port-Royal
present (on the wrong waterway), Louisbourg (event exists), Halifax (event exists), Red Bay
present, L'Anse aux Meadows (only as a discovery; the field trip has no pin to open).

For portages (the one location type the legend filters that is not a building): Methye,
Grand, Chaudière, Long Sault, La Vase, French, Frog, Echimamish, The Pas, Rat, Slave Falls,
Great Dog and Hauteur des Terres are present; absent are the Mattawa portages, Portage la
Prairie (a pronunciation term exists), Pigeon River's Grand Portage is present, the
Athabasca Pass and Howse Pass (Thompson), the Yellowhead, the Chicago portage, the Fox-Wisconsin
portage, and the Mohawk-Hudson carries.

### 5.3 People

The app has two person tables and one rule gap (2.3, 2.9). Candidates are listed by role;
each needs a decision on table membership under the rule the owner chooses.

**Explorers, traders and officers absent.** Jolliet (present) and Marquette (present) have no
waterway; Jean Nicolet has Lake Michigan only. Absent: Louis Hennepin; Daniel Greysolon Dulhut
(Lake Superior, Lake Nipigon); Pierre de Troyes and the 1686 James Bay raid; Henry Kelsey is
present; James Knight present; Jens Munk (Churchill 1619); Thomas Button present; Christopher
Middleton and William Moor (Wager Bay 1742, 1746); Joseph Frobisher and Thomas Frobisher
(Churchill River posts, the Montreal partners); Alexander Henry the Elder present; Peter Pond
present; the La Vérendrye sons present without waterways; Jacques Repentigny Legardeur de
Saint-Pierre; Anthony Henday present; Matthew Cocking present without a waterway; William
Tomison present without a waterway; Joseph Colen likewise; John Rowand (Fort Edmonton); Colin
Robertson (Athabasca campaign); John Stuart (New Caledonia, Fort St. James); Peter Skene Ogden
(Snake Country, Fort St. James, the Pacific department); Samuel Black (Finlay River); Daniel
Harmon present without a waterway; John McLoughlin present without a waterway (Fort Vancouver
is a location); John Jacob Astor and the Astorians Gabriel Franchère, Alexander Ross, Duncan
McDougall, David Stuart (the Pacific Fur Company already appears in the Columbia fur-trade
row); Lord Selkirk, Miles Macdonell, Robert Semple (Red River colony, Seven Oaks); George
Simpson present without a waterway; Thomas Simpson and Peter Warren Dease (Arctic coast
1837-39); John Richardson (named by three notable figures, absent as a person); John Ross and
James Clark Ross (magnetic pole 1831); Francis Leopold McClintock (Fox 1859); Jane Franklin;
Elisha Kent Kane and Charles Francis Hall (American Franklin searches, if the Arctic story is
told fully); Frederick Schwatka; Jerry Potts; Pierre Falcon (the Métis bard); Alexander Ross;
James Sinclair; Jaco Finlay (Howse Pass, Spokane House); David Thompson present; Simon Fraser
present; John Stuart; George Vancouver present; Peter Puget and Joseph Whidbey if Puget Sound
is added; Alexander Baranov and Grigory Shelikhov (Russian-American Company); Juan José Pérez
Hernández present as Juan Pérez; Esteban José Martínez (Nootka Crisis 1789); Manuel Quimper
(Juan de Fuca 1790); Francisco de Eliza; John Meares (Nootka); Charles Barkley and Frances
Barkley (Juan de Fuca 1787, she the first European woman on the coast); Robert Gray present;
Meriwether Lewis and William Clark (named by Sacagawea's row, absent as people); Zebulon Pike
(Mississippi headwaters 1805) only if the Mississippi is added; Henry Youle Hind and John
Palliser (present, no waterway) with Thomas Blakiston and James Hector; Robert Campbell (Yukon,
Fort Selkirk) if the Yukon is to have an explorer; John Bell and Alexander Hunter Murray (Fort
Yukon is present with no explorer).

**Cartographers absent** (the table has no surface today, so these matter only with a screen or
with location links): Jean-Baptiste-Louis Franquelin (New France), Guillaume Delisle, Nicolas
Sanson, Vincenzo Coronelli, Pierre Desceliers (Dieppe school, the Cartier coast), John Mitchell
(1755), Thomas Jefferys, Henry Popple, Lewis Evans, Peter Pond as cartographer (his 1785 map is
already a document), Aaron Arrowsmith present, James Cook and George Vancouver as surveyors,
Joseph Bouchette present, Henry Youle Hind, Palliser's map, Franklin's and Back's survey maps,
Rae's. **Indigenous cartographers**, central to the "cartography" theme and absent entirely:
Ac ko mok ki (Old Swan), whose 1801 map for Peter Fidler guided Lewis and Clark and Arrowsmith;
Ki oo cus; Cha chay pay way ti (Cree, for Fidler); the Chipewyan maps Matonabbee and Idotliazee
drew for Moses Norton that set Hearne's course; Iligliuk's maps for Parry and Lyon (1822);
Tookoolito and Ebierbing with Hall; the Inuit maps Rae and McClintock relied on. These link
directly to Fidler, Norton, Hearne, Parry and Matonabbee, all present.

**Indigenous leaders, guides and interpreters absent** (surface: Notable Figures; link by
exact waterway name): Maquinna and Wickaninnish (Nootka Sound, Clayoquot; Cook, Meares,
Martínez, Vancouver); Kwah (Carrier, Fort St. James, Simon Fraser, John Stuart); Membertou
(Port-Royal, Champlain); Donnacona, Domagaya and Taignoagny (Cartier, Stadacona); Kondiaronk
(Great Peace of 1701); Tessouat (Allumette Island, Champlain 1613); Joseph Brant (the
Haudenosaunee and the Grand River); Pontiac and Tecumseh are later and marginal to waterways
but tied to Detroit; Maskepetoon; Piapot; Mistawasis and Ahtahkakoop (Treaty 6 at Fort
Carlton, a field trip exists); Peguis is present as an explorer row only; Yellow Quill;
Nescambiouit; William Ouligbuck and his father (Inuit interpreters for Franklin, Rae); Mikak
(Labrador Inuit, London 1768); Tookoolito and Ebierbing; Demasduit and Nonosabasut (Beothuk,
with Shawnadithit present); English Chief (Mackenzie 1789); Awgeenah; Nestabeck (Keskarrah is
present); Augustus/Tattannoeuck present and Junius/Hoeootoerock absent; Saukamappee present;
Old Swan as cartographer above; the Mandan chiefs Sheheke and Black Cat (Thompson 1797, Lewis
and Clark); Comcomly (Chinook, Astoria, Fort Vancouver); Concomly's daughter Ilchee; the
Tsleil-Waututh and Squamish leaders Vancouver met (Burrard Inlet is present).

**Métis figures absent.** Pierre Falcon; Jean-Baptiste Lagimodière present; Marie-Anne
Gaboury present; Cuthbert Grant present; James McKay (Treaty interpreter); Peter Erasmus
(Palliser's guide, Treaty 6 interpreter); Jerry Potts; Louis Goulet; Gabriel Dumont present;
Marie-Rose Delorme Smith; Pierre Bottineau (Red River guide to the US surveys); Johnny Grant.

**Women absent.** Frances Barkley (above); Amelia Douglas (Fort St. James, Fort Vancouver,
Victoria); Letitia Hargrave (York Factory letters, a primary source); Frances Simpson; Jane
Franklin; Marguerite Bourgeoys and Jeanne Mance only if Montreal's founding is told; Hélène
Boullé (Champlain); Marie de l'Incarnation (letters on New France); Thanadelthur, Charlotte
Small, Isabel Gunn, Marie-Anne Gaboury, Sacagawea present; the "country wives" named in
Thompson's and Harmon's journals; Catherine Sinclair; Nahovway; Mary Sinclair Inkster.

### 5.4 Teaching resources, by gap

- **Quizzes.** No quiz on New France, the Northwest Passage, the Pacific voyages, cartography,
  Métis history, women, treaties or Indigenous leaders; one quiz has one question; six are
  duplicates; K-3 and 10-12 each have one distinct quiz. The category list is hard-coded to
  five, so a "Cartography" or "Métis History" quiz would be unfilterable without a client
  change.
- **Field trips.** None for K-3 or 10-12; none on the St. Lawrence, the Pacific, the Arctic,
  the Great Lakes, or any Indigenous site except as the Norse met the "Skrælings". Each new
  trip should set `locationId` on its stops once a screen reads them.
- **Documents.** 34 without a grade; none for K-3 or 10-12; nothing from Marquette and Jolliet
  (Marquette's 1673 journal), Hennepin, La Vérendrye's own journals, Hearne's "A Journey" is
  represented, Thompson's "Narrative" by two; nothing by Franklin, Richardson, Parry, Rae's
  own letters, Harmon's journal, Henry the Younger's journal, Franchère, Ross, Cook's and
  Vancouver's journals, the Spanish Nootka accounts, Letitia Hargrave's letters, Isabel Gunn's
  record, the HBC post journals as a type; one image across all 48.
- **Timeline and What Happened Here.** The timeline stops at 1885 and starts at 1613; no
  Norse, Cabot, Cartier, Champlain 1608, Hudson, Munk, Kelsey, Cook, Vancouver, Nootka Crisis,
  Astoria, Oregon Treaty 1846, Franklin, Rae, Amundsen. Historical events have the Cartier,
  Champlain, Cook, Franklin and Amundsen items but nothing on the Pacific Spanish, the
  Russians, the Dutch, the Mississippi, or any treaty before 1871.
- **Indigenous languages.** Ten language labels for a country of some seventy; no words in
  Halkomelem, Nuu-chah-nulth, Dakelh (Carrier), Tlingit, Innu, Wolastoqey, Michif (the Métis
  language), Anishinaabemowin as distinct from "Ojibwe", Nakoda, Tsuut'ina; three stories;
  stories and vocabulary quizzes cannot be opened; zero audio anywhere; zero word links to
  waterways although 27 words are in the "waterway" category.
- **Journeys.** Two. Natural additions with coordinates the app can already draw: the Methye
  Portage brigade, Hearne to the Coppermine, the Red River cart trail, Fraser's descent,
  Thompson to the Pacific 1811, a York boat from York Factory to Norway House, Champlain 1615
  to Huronia, Jolliet and Marquette 1673.
- **Comparisons.** Four; none at K-3 or 4-6. The generated explorer and fort comparisons are
  built server-side and unused.
- **Printables.** None at K-3; no map of the Pacific, the Arctic or New France.

### 5.5 Imagery and geometry, what can be asserted

- Every current image except three Wikimedia URLs is on R2 (`pub-3768…r2.dev`). The last
  health run (2026-10-16 02:01) found 3 broken records: Marble Island gallery[0]
  (commons.wikimedia.org), the Crowfoot portrait used by both NotableFigure
  `crowfoot_leader` and HistoricalEvent `cmlhqohkg000gm2m4tpltfb4p`, and one rate-limited
  Coppermine image. The health job logged each three times in one run (6,150 rows total),
  which looks like three scheduler instances; a code item, not content.
- R2 credentials are not present in this session's environment (`R2_*` absent from
  `backend/.env`), so no upload can be verified here; `backend/src/lib/image-cdn.ts`
  (`uploadImageFromUrl`) is the path when they are.
- Geometry: `export-waterway-kml.ts` queries OpenStreetMap by name within a North American
  bbox and can take an explicit `--osm=relation/ID`. Whether a relation exists and is clean for
  any waterway in 5.1 is **unverified** until the exporter is run for it with the continuity
  guard; the St. Lawrence experience (centreline plus surface polygons) shows wide estuaries
  need `--with-surface`.

---

## 6. Decisions the owner must make before any writes

1. **Who is an Explorer.** Either (a) keep "anyone a Deep Dive key figure points at is an
   Explorer row" and accept Riel, Crowfoot and Thanadelthur in the Explorers tab, or (b) add a
   `notableFigureId` alternative to `keyFigures[]` and `useNotableFigure` in the lesson screen,
   then move the fourteen to NotableFigure only. (b) is a code change plus a data move.
2. **Duplicates.** Nations ×7, Cartographers ×2, Quizzes ×6: delete the later-created copies
   after confirming no attempt or link references them (quiz attempts: 0 today).
3. **Fort pairs** (2.2): keep both as distinct posts with distinct years and notes, or merge.
4. **Taxonomies.** Canonical `locationType` (fold `fort`, `historic_site`), `WaterwayType`
   (fold `lake`), `Explorer.nationality` (controlled list, free text kept in biography),
   `FurTradeInfo.tradingCompany` spellings, `NotableFigure.figureType` colour config for
   `metis_leader` and `voyageur`, hard-coded quiz categories and lesson topics if new themes
   are added.
5. **Document grade levels** for 34 rows, and whether Documents should have a grade filter UI
   like every other resource list.
6. **Mackenzie River (Ontario)** and the Roderick McKenzie figure row that reaches it.
7. **Port-Royal's waterway** (St. Lawrence today) and the two Churchill-mouth forts on the
   Saskatchewan Churchill row.
8. **Assessment field name** in the teacher Lesson Plan screen (`assessmentSuggestions` vs
   `assessment`): fix the type and screen, or add an alias on the server.
9. **The twelve unreachable achievements**: record `waterway_explored` and `location_visited`
   from the detail sheet, `document_read` from the document screen, `pronunciation_learned`
   from the pronunciation screen, or retire them.
10. **Stories and vocabulary quizzes**: give them screens, or stop listing them.
11. **Links no screen reads** (mechanism C): decide which to make navigable before filling
    them, in this order of value: field trip stop → pin and waterway; timeline/What Happened
    Here → explorer, waterway, location; document → explorer; notable figure → explorer by id.
12. **Static reading guides**: fix the 4 dead keys and the escaped author strings, add the 2
    waterways and 17 locations, and accept that each new place or person needs a build, or
    move the guides to Turso.

---

## 7. What this sweep did not verify

- The historical accuracy of existing prose (descriptions, biographies, notes). Only
  structure, links and counts were checked.
- The content of `videoUrl` JSON beyond its shape (69 waterways, 100 locations carry a value;
  the health job does not check video URLs).
- OpenStreetMap coverage for any waterway in 5.1; portrait provenance for any person in 5.3.
- `backend/src/routes/teachers.ts`, `auth.ts`, `admin-approval.ts`, `teacher-approval.ts`,
  `sample.ts` were read earlier in the project but are account plumbing and carry no content.

---

## 8. Next steps (nothing below starts without approval)

1. Owner reads this document and answers section 6.
2. Fix-first data pass under the established pattern: dry run, committed backup under
   `backend/prisma/turso-migrations/backups/`, `--apply`, verification, idempotent rerun.
3. Code items that gate content value: lesson key-figure link to notable figures (if 6.1b),
   stop/timeline/document link reading, achievement recording, story and vocabulary quiz
   screens, grade filter on Documents, assessment field, taxonomy configs, reading guides.
4. Content packs by region and theme, student and teacher faces together, each pack validated
   against section 2 (required fields, canonical values, link targets that exist, exact-name
   strings for text matches) and section 5 (relevance stated), images fetched with credit to R2,
   KML exported with the guard and the overview rebuilt for rivers, then the same
   dry run → backup → apply → verify cycle.
5. Sources for authoring: Dictionary of Canadian Biography, The Canadian Encyclopedia, Library
   and Archives Canada, Hudson's Bay Company Archives (Archives of Manitoba), Champlain Society
   editions, Wikimedia Commons for imagery with licence recorded, OpenStreetMap for geometry.
