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

---

## 9. Decisions taken and implementation status (2026-10-16, later the same day)

The owner answered all twelve questions in section 6: 1 (b); 2, 4, 11 as recommended; 3 merge;
5 yes with a grade filter; 6 yes, provided the real Mackenzie River's display is untouched;
7 yes; 8 fix the type and screen, no alias; 9 record, do not retire; 10 build the screens;
12 move the guides to Turso and identify grade-level gaps.

### 9.1 Code phase (done, this branch)
- Key figures may carry `notableFigureId` as well as `explorerId`; the Deep Dive screen opens
  the Notable Figure screen for the former and takes the portrait from whichever record is
  linked (`lessons/[id].tsx`, `types/education.ts`).
- Documents list has a grade chip row; the server already filtered on `gradeLevel`.
- `assessmentSuggestions` renamed to `assessment` in the type and both teacher screens.
- Colour and label config added for `metis_leader`, `voyageur`, live pronunciation term types,
  document types `report` and `inscription`, comparison types `perspectives`,
  `trade_companies`, `trade_routes`, and the Blackfoot, Mohawk, Iroquois and Inuit labels.
  Underscore replacement is now global in the four screens that only replaced the first one.
- Exploration points: new table `UserExploration` and route `POST /api/gamification/explore`;
  the server fixes the points (waterway 5, location 3, document 5, pronunciation 2) and awards
  each (device, activity, record) once. Opening the detail sheet records waterway or location,
  opening a document records it, and the pronunciation card gained an "I've learned this"
  button. The twelve achievements of section 2.17 are reachable.
- Screens `stories/[id]` and `vocabulary-quiz/[id]`; the cards on the Indigenous Languages
  screen open them.
- Related records are navigable: the server attaches `explorer`, `waterway`, `location`
  objects to timeline events, What Happened Here events, documents and field-trip stops
  (`backend/src/lib/related.ts`), notable-figure associated explorers gain a resolved
  `explorerId` (exact or honorific-stripped name match), and the map accepts
  `/?markerId=&markerType=` to open a record and `/?lat=&lng=` to centre. A shared
  `RelatedLinks` component renders the chips.
- Reading guides live in the new `ReadingGuide` table and are returned inside the waterway,
  location, explorer and notable-figure detail responses; the two static files are deleted.

### 9.2 Reading-guide import and the grade-level gap
`2026-10-16-import-reading-guides.ts` moved the static entries into Turso (backup
`backups/2026-10-16-reading-guides-import.json`).

| Measure | Value |
|---|---|
| Entries in the static files | 1,047 |
| Exact duplicates (same title, source and url) skipped | 60 |
| Rows inserted | 986 (waterway 254, location 345, explorer 387) |
| Targets covered | 68 waterways, 85 locations, 92 explorers |
| Fields truncated at an apostrophe in the static files | 290 |
| Of those restored to the full text (unambiguous titles and publishers) | 133 |
| Of those kept as the fragment before the cut | 157 |
| Entries dropped | 1 (Batoche: Diane Payment, Golden Dog Press, title lost entirely) |
| Four dead keys remapped by the place their entries describe | Fort Simpson, Oxford House, Fort Edmonton (HBC), Rocky Mountain House (NWC) |

**Grade bands.** No entry carried a reading level. Each row was given one by source type, a
heuristic the owner can override per row: encyclopedias, Parks Canada, museums and Wikipedia
pages read as 7-9; archival series, scholarly editions and monographs as 10-12.

| Band | Entries | Targets with at least one entry |
|---|---|---|
| K-3 | 0 | 0 of 262 |
| 4-6 | 0 | 0 of 262 |
| 7-9 | 437 | all 245 covered targets have at least one encyclopedia-level entry |
| 10-12 | 549 | all 245 covered targets |

So the reading-guide gap is uniform: there is no K-3 or 4-6 "Additional Study" material for
any waterway, location or explorer, and no guide at all for Hayes River, Kaministiquia River and
fifteen locations (Lower Fort Garry, Fort Ellice, Fort Kaministiquia, Sault Ste. Marie Post,
Fort Augustus (NWC), Fort George (NWC - Saskatchewan), Fort McLeod (BC), Fort George (NWC -
BC), Fort Gibraltar, Fort Lac La Pluie, Fort Battleford, Fort Liard, Fort Simpson (BC), Fort
McLoughlin, Rupert House). Notable figures have none yet; the fourteen people moving out of
`Explorer` bring their guides with them in the data pass. Filling the K-3 and 4-6 bands means
children's and middle-grade titles (picture books, Canadian Geographic Kids, Scholastic Canada
biographies, Parks Canada learning pages), one or two per target, sourced at authoring time.

### 9.3 Data phase (done, same day; one script per decision under `backend/prisma/turso-migrations/`, each with a dry run, a committed backup and a verification step)

| Decision | Script | Result (verified by query after apply) |
|---|---|---|
| 2 duplicates | `2026-10-16-dedupe-nations-cartographers-quizzes.ts` | 7 nations, 9 cartographers, 7 quizzes with 36 questions; the one class assignment that pointed at a deleted quiz copy repointed to the kept copy |
| 6 bogus river | `2026-10-16-remove-mackenzie-ontario.ts` | row and its 4 guide entries deleted; Roderick McKenzie now names Fort William, Thunder Bay, Lake Superior; the real Mackenzie River untouched |
| 1b people | `2026-10-16-move-people-to-notable-figures.ts` | 15 Explorer rows removed (77 remain); figure rows created for Chief Peguis and Shawnadithit (20 figures); 35 key-figure entries in 12 lessons now carry `notableFigureId`; 64 reading-guide rows retargeted; portraits copied to Akaitcho, Chief Peguis, Cuthbert Grant, Gabriel Dumont, Lagimodière, Riel, Gaboury, Shawnadithit. **Not copied:** Thanadelthur (no likeness exists). **Provenance to confirm:** Cuthbert Grant, Jean-Baptiste Lagimodière, and the pre-existing Matonabbee portrait; none has an authenticated contemporary likeness that the author of this document knows of |
| 4 taxonomies | `2026-10-16-canonical-taxonomies.ts` | locationType: Fort 53, Trading Post 16, Portage 14, Cultural Site 12, Settlement 5; WaterwayType `lake` folded (Lake 13); nationality reduced to 16 values with 11 biographies gaining one sentence of detail; tradingCompany to 10 full-name spellings |
| 3 fort pairs | `2026-10-16-merge-fort-pairs.ts` | 94 locations; Fort William, Fort Edmonton, Fort Churchill, Upper Fort Garry (absorbing Fort Garry and Fort Garry (Upper)), Rocky Mountain House each hold the merged notes, gallery, earliest year and reading guide; Riel's associated location "Fort Garry" rewritten |
| 7 waterways | `2026-10-16-bay-of-fundy-and-churchill.ts` | see below |
| 5 grades | `2026-10-16-document-grades.ts` | applied 2026-10-17 after approval: no document without a band; 4-6 ×10, 7-9 ×28, 10-12 ×10 |

**Bay of Fundy.** New waterway (type Bay, anchor 45.1 N 65.6 W, region New Brunswick / Nova
Scotia). Geometry from OpenStreetMap through the exporter's bay branch: one relation, 15,148
points, bbox 66.95 W to 64.94 W, 44.21 N to 45.49 N, anchor inside. Four Wikimedia Commons
images with licence and author recorded (Eric Van Lochem CC BY-SA 4.0; Ian Mackenzie CC BY 2.0;
Madereugeneandrew CC BY-SA 3.0; NASA/METI ASTER public domain), served as `Special:FilePath`
URLs because the R2 keys are not in this session. Champlain linked (1604) with expedition
notes; three reading-guide entries; Port-Royal moved onto it. The Mi'kmaq name is left null
rather than asserted.

**Churchill River: a correction to decision 7.** The row named "Churchill River (Saskatchewan)"
already carried the whole river: its KML spans 108.38 W to 94.18 W and reaches 58.79 N, the
mouth at Churchill, Manitoba. A separate "Manitoba" row would have duplicated that geometry,
so the row was renamed "Churchill River" (region unchanged: Saskatchewan / Manitoba) and the
merged Fort Churchill moved onto it from Hudson Bay, beside Prince of Wales Fort, Methye
Portage and Frog Portage. The home-map overview was rebuilt for the new name
(`generated/river-overview.json`, 28 rivers).

### 9.5 Content pack 1, New France to the Gulf (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/new-france-to-the-gulf.ts`, applied by
`2026-10-17-pack-new-france-to-the-gulf.ts` after a dry run that resolved every name to a live
id and confirmed every image URL and KML file; backup of the backfilled events in `backups/`.
Idempotent: a rerun reports everything as existing and writes nothing.

| Added | Count | Notes |
|---|---|---|
| Waterways | 11 | Mississippi, Illinois, Wisconsin, Fox (Wisconsin), Richelieu, Lake Champlain, Hudson, Lake Nipissing, Mattawa, Detroit, Niagara; all with OpenStreetMap geometry (the Fox re-exported with a 25 km continuity gap so the Illinois Fox was not chained to it); Indigenous names only where the attestation is well known, language stated; fur-trade rows for the Mississippi and the Hudson |
| Explorers | 4 | Hennepin, Dulhut, de Troyes, Tonti; no portraits (no verified likeness) |
| Explorer–waterway links | 37 | Jolliet, Marquette, La Salle, Cadillac, Champlain, Hudson, Nicolet, Brûlé and Iberville now have waterways; Abitibi, Moose and Kaministiquia rivers gain their first explorer |
| Locations | 21 | from Stadacona and Hochelaga to Fort Orange, New Amsterdam, Michilimackinac, Fort de Chartres, Kaskaskia and New Orleans; Fort Crèvecoeur, Stadacona and Hochelaga have no image (nothing suitable and licensed on Commons) |
| Notable figures | 4 | Donnacona, Kondiaronk, Tessouat, Membertou; associated locations use exact waterway names so they appear on those waterways |
| Timeline events | 17 | 1535 to 1763, each linked to its explorer, waterway or location |
| What Happened Here events | 9 new, 14 existing events given their explorer/waterway/location links | |
| Pronunciations | 17 | |
| Quiz | 1 | 8 questions, grade 7-9, every question with `sourceType`/`sourceId` |
| Deep Dive / lesson plan | 1 | grade 7-9, student and teacher faces, six key figures (five explorers, Kondiaronk as a figure), seven timeline items linked to events, related waterway/location/explorer/quiz ids filled |
| Field trip | 1 | the first K-3 trip, Michilimackinac, five stops each linked to the pin and Lake Huron |
| Reading-guide entries | 69 | Wikipedia and Canadian Encyclopedia at 7-9, Dictionary of Canadian Biography, Jesuit Relations and Parkman at 10-12 |
| Images | 63 URLs | all Wikimedia Commons, public domain or CC BY / CC BY-SA, author and licence in every credit, served as `Special:FilePath` URLs until R2 keys are available |

Added later the same day (`2026-10-17-primary-sources-new-france.ts`): 17 primary-source
pointer documents, each saying what the source is, who made it and when, and exactly where it
is readable today (archive, edition, verified URL), with no quoted transcription; linked to their
explorer, waterway and location and graded (1 at 4-6, 10 at 7-9, 6 at 10-12). Still not
included: Indigenous vocabulary. The river overview was
rebuilt (37 rivers). The Fox River trip and the `FieldTripStop.narrative` field: the trip table has
no introduction or conclusion columns, so that text stays in the pack file.

### 9.6 Content pack 2, The Pacific and the Russians (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/pacific-and-russians.ts`, applied by
`2026-10-17-pack-pacific-and-russians.ts` (dry run, backup of every row it changed, apply,
verify; idempotent). Scope: the Northwest Coast from Bering (1741) to the Oregon Treaty (1846)
and the sale of Alaska (1867): Spain and the Nootka Crisis, Cook and Vancouver, the
Russian-American Company at Sitka, Astoria, the North West and Hudson's Bay companies west of
the Rockies, Lewis and Clark, and the Indigenous leaders who dealt with all of them.

| Added | Count | Notes |
|---|---|---|
| Waterways | 14 | Puget Sound, Prince William Sound, Cook Inlet, Sitka Sound, Dixon Entrance, Clayoquot Sound, Snake, Willamette, Kootenay, Thompson, Skeena, Stikine, Nass, Okanagan Lake. OpenStreetMap geometry for ten; the four Alaskan bodies (Prince William Sound, Cook Inlet, Sitka Sound, Dixon Entrance) are mapped in OSM as single nodes with no shoreline polygon and so are pins only. The existing Georgia Strait row, which had no geometry, was given its OSM polygon (719 KB). Fur-trade row for the Snake |
| Explorers | 14 | Ogden, John Stuart, Samuel Black, Martínez, Quimper, Meares, C. W. Barkley, Puget, Alexander Ross, Franchère, David Stuart, Lewis, Clark, Jaco Finlay. One portrait: Meares, from W. Beechey's engraving in the 1790 *Voyages* (a lifetime likeness, confirmed from the Commons file's own record). No usable lifetime likeness was found on Commons for the others, so they have none |
| Explorer–waterway links | 44 | Cook, Bering, Pérez, Vancouver, Gray, Quadra, Fraser, Thompson, McLoughlin, Douglas, Simpson and Harmon gain the new waterways; every new explorer has at least one |
| Locations | 11 | Fort Okanogan, Fort Nisqually, Novo-Arkhangelsk (Sitka), Fort Fraser, Fort Boise, Fort Clatsop, Celilo Falls, Opitsaht, Fort Stikine, Howse Pass, Athabasca Pass. Fort Kamloops moved from the Fraser River row to the new Thompson River (it stands where the North and South Thompson meet; backup records the old waterway id) |
| Notable figures | 9 | Maquinna, Wickaninnish, Comcomly, Kwah, Amelia Douglas, Frances Barkley, John Jacob Astor, Alexander Baranov, Grigory Shelikhov. Two portraits: Astor (Gilbert Stuart, 1794) and Lady Douglas (a photograph taken in her lifetime, NARA). Maquinna's biography notes that the Dictionary of Canadian Biography treats the chief of 1778-1795 and the chief who seized the *Boston* in 1803 as two men |
| Timeline events | 28 | 1741 to 1867 |
| What Happened Here events | 13 new; 3 existing Pacific events (Vancouver meets Galiano and Valdés, Fort Victoria established, Juan de Fuca Strait discovered) given their explorer/waterway/location links | |
| Pronunciations | 17 | Nuu-chah-nulth, Chinook, Dakelh, Secwepemctsín, Nsyilxcən, Ktunaxa, Tlingit, Dena'ina, Haida and Russian terms |
| Quiz | 1 | "The Pacific Contest", 8 questions, grade 7-9, every question sourced |
| Deep Dive / lesson plan | 1 | "The Pacific Contest: Four Empires on the Northwest Coast, 1741-1846", grade 10-12, nine key figures (five explorers, four notable figures incl. Maquinna, Baranov, Astor and Amelia Douglas), ten timeline items linked to events |
| Field trip | 1 | "Yuquot and the Nootka Crisis of 1789", grade 10-12, six stops at Friendly Cove and Nootka Sound |
| Reading-guide entries | 73 | Wikipedia and Canadian Encyclopedia at 7-9, Dictionary of Canadian Biography and the Lewis and Clark journals site at 10-12 |
| Images | 75 URLs | Wikimedia Commons, public domain or CC BY / CC BY-SA, author and licence in every credit; includes Webber's 1778 view of the houses at Nootka, the 1790 print of the Argonaut's seizure, Postels's 1827 view of Castle Hill, William Hind's Athabasca Pass (c. 1862), Clark's map of the Great Falls of the Columbia, Franchère's drawing of Astoria in 1813, and the 1911 Admiralty chart of Dixon Entrance |

Two corrections made along the way. Wikimedia's API throttled this session's shared address on
every endpoint, so the image search was rebuilt to use the ordinary HTML search page and each
file's raw wikitext (same manifest shape; copy in `backups/2026-10-17-commons-pack2-manifest.json`).
And biographi.ca answers 200 with a "Biography not found" page for any slug, so a status
check proves nothing: the pack script now checks every DCB guide URL by page title, nine
guessed slugs in the pack were corrected or replaced before applying, and an audit of the DCB
guide URLs already in Turso found and fixed two wrong ones (Tonty, Tessouat;
`2026-10-17-fix-dcb-guide-urls.ts`).

Added the same day (`2026-10-17-primary-sources-pacific.ts`): 23 primary-source pointer
documents (Cook's Nootka journal, Meares's Memorial and Voyages, the Nootka Convention and
the 1790 official papers, Mozino, Vancouver, Jewitt, the Lewis and Clark journals, Franchère,
Ross, Cox, Thompson's Narrative, Harmon, Lisiansky on the Battle of Sitka, Steller, Simpson's
1824-25 journal, Ogden's Snake Country journals, McLoughlin's letters, Frances Barkley's
reminiscences, Pérez's 1774 diary, Irving's Astoria, the Oregon Treaty, the Alaska cession
treaty), each with what it is, who made it and when, and where it can be read (archive,
edition, URL only where the page answered), linked and graded (12 at 7-9, 11 at 10-12).
Documents now total 88 (11 at 4-6, 50 at 7-9, 27 at 10-12). The river overview was rebuilt
(44 rivers). Data only: no mobile build is needed for this pack.

### 9.7 Content pack 3, The Arctic Searches (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/arctic-searches.ts`, applied by
`2026-10-17-pack-arctic-searches.ts` (dry run, backup, apply, verify; idempotent). Scope: the
Northwest Passage from Frobisher (1576) to Amundsen (1906) and Bernier (1909), approached from
the Atlantic (Davis Strait, Hudson Strait, Lancaster Sound) and from the Pacific (Bering Strait,
the Beaufort Sea), the Franklin search of 1848-1859 as the decade that mapped the archipelago,
and the Inuit who guided, interpreted for and finally explained the fate of the expeditions.

| Added | Count | Notes |
|---|---|---|
| Waterways | 16 | Hudson Strait, Beaufort Sea, Bering Strait, Coronation Gulf, Victoria Strait, Peel Sound, Prince Regent Inlet, Wellington Channel, Viscount Melville Sound, Prince of Wales Strait, Smith Sound, Simpson Strait, Amundsen Gulf, Repulse Bay (Naujaat), Wager Bay (Ukkusiksalik), Kotzebue Sound. OpenStreetMap polygons for fifteen; Kotzebue Sound, and the existing Davis Strait and Parry Channel rows, are single OSM nodes and stay pins. The Hudson Strait polygon (331,000 points, 8.6 MB) was thinned to every fifth point (2.2 MB); the full export is kept outside the repository. Seas and gulfs use the Bay type, as Queen Maud Gulf already did |
| Explorers | 20 | John Ross, James Clark Ross, Richardson, Thomas Simpson, Dease, McClintock, Collinson, Beechey, Kotzebue, Kane, Hall, William Kennedy, Bellot, Crozier, Middleton, Munk, Sverdrup, Bernier, Penny, Kellett. Portraits for eight, all lifetime likenesses confirmed from the Commons file records: J. C. Ross (1852 print), Richardson, McClintock, Collinson and Beechey (Stephen Pearce, 1850s), Crozier (Beard daguerreotype, 1845), Hall (the only known photograph), Bernier (Bain photograph) |
| Explorer–waterway links | 100 | Frobisher, Hudson, Button, Bylot, Baffin, Foxe, James, Cook, Parry, Franklin, Back, Rae, McClure, Amundsen, Stefansson, Hearne and Mackenzie gain Arctic waterways; Button, Bylot, James and Amundsen had none before |
| Locations | 15 | Beechey Island, Fort Enterprise, Fort Franklin (Délı̨nę), Fort Confidence, Winter Harbour, Victory Point, Gjoa Haven (Uqsuqtuuq), Fort Hope, Kodlunarn Island, Mercy Bay, Felix Harbour, Herschel Island (Qikiqtaruk), Icy Cape, Port Leopold, Dealy Island. Fort Confidence and Victory Point have no image (nothing suitable and licensed on Commons) |
| Notable figures | 11 | Kalicho, Arnaq, Ouligbuck, William Ouligbuck, In-nook-poo-zhe-jook, Tookoolito, Ebierbing, Eenoolooapik, Lady Jane Franklin, Hans Hendrik, Qillarsuaq. Portraits for four: John White's 1577 watercolours of Kalicho and of Arnaq with Nutaaq, the tintype of Tookoolito and Ebierbing, the Smithsonian photograph of Ebierbing |
| Timeline events | 36 | 1577 to 1913; the two unlinked Mackenzie timeline events were given their explorer and waterway (new `timelineBackfill` in the pack format) |
| What Happened Here events | 17 new; 11 existing events linked (Franklin departs, ships trapped, Erebus and Terror found, Amundsen, Hearne's three expeditions, surrender of Prince of Wales Fort, creation of Nunavut, Bloody Falls ceremony) | |
| Pronunciations | 18 | Inuktitut, Inuinnaqtun and Inuvialuktun terms |
| Quiz | 1 | "The Search for the Northwest Passage", 8 questions, grade 7-9 |
| Deep Dive / lesson plan | 1 | "Two Oceans, One Passage: The Arctic Searches, 1576-1909", grade 10-12; twelve key figures (seven explorers, five notable figures); the existing 7-9 lesson "The Northwest Passage: Dreams and Disasters" is untouched |
| Field trip | 1 | "Beechey Island: Franklin's First Winter", grade 7-9, six stops |
| Reading-guide entries | 112 | every Dictionary of Canadian Biography and Canadian Encyclopedia link verified by page content, every Wikipedia link by HEAD, before applying |
| Images | 74 URLs | Commons, public domain or CC BY / CC BY-SA, credited; includes John White's 1577 skirmish at Bloody Point, Parry's 1826 view of Prince Regent Inlet, the 1862 Admiralty chart of Wellington Channel and Melville Island, McDougall's watercolour of the Investigator in Mercy Bay, the Fox, Hecla and Griper at Winter Harbour, the Beechey Island graves, and the Library of Congress chart of the coast from the Mackenzie to Bering Strait |

Link repair found on the way: with a browser user agent the Canadian Encyclopedia can be
checked after all (404 for a missing article), and 48 of the 164 Canadian Encyclopedia guide
links already in Turso were dead, guessed slugs from the October 16 import.
`2026-10-17-fix-tce-guide-urls.ts` replaced 47 of them with verified Canadian Encyclopedia,
Dictionary of Canadian Biography or Wikipedia pages (each candidate tested live at dry run)
and deleted the one with no working replacement; all three pack scripts now check those two
hosts by content. Reading guides total 1,117 after the repair.

Added the same day (`2026-10-17-primary-sources-arctic.ts`): 26 primary-source pointer
documents, from Best's True Discourse (1578), Davis, Prickett on Hudson, Baffin, Munk and
Middleton through Parry, Franklin's two Narratives, Beechey, Kotzebue, John Ross, Simpson, Rae,
the Victory Point record, McClintock, McClure and Miertsching, Kennedy and Bellot, Kane and
Hans Hendrik, Hall's two books and the Inuit testimony, Richardson, Amundsen, Bernier,
Sverdrup and Stefansson; each with what it is, who made it and when, and where it can be read
(archive, edition, URL only where the page answered), linked and graded (12 at 7-9, 14 at
10-12). Documents now total 114 (11 at 4-6, 62 at 7-9, 41 at 10-12). Data only: no mobile
build is needed.

### 9.8 Gaps reported by the owner on 2026-10-17, and the first repairs
The owner reported, on the production app: no Slave River, North Saskatchewan or South
Saskatchewan; the Mattawa River narrative names Champlain and Brûlé but the explorer panel
does not show them; many explorers without portraits where likenesses exist (Lewis, Clark);
and a general concern that the content leans on single sources. Findings and actions:

- **Narrative links.** A database-wide read of every waterway's text for explorer names with
  no link, and of every explorer's text for waterway names with no link, found 36 real gaps
  (after discarding false hits such as "Hudson's Bay Company" for Henry Hudson). All 36 links
  were written with a year and a sentence checked against the Dictionary of Canadian Biography
  or the explorer's narrative (`2026-10-17-link-gaps.ts`): Brûlé on the Mattawa, French River and
  Lake Nipissing; Button, Foxe and James on Hudson Bay; Groseilliers on Lake Superior and Hudson
  Bay; the Hudson's Bay Company's inland men (Kelsey, Henday, Hearne, Cocking, Turnor, Tomison)
  on the bay and the Saskatchewan; Roderick Mackenzie on Lake Athabasca; Galiano and Valdés on
  Burrard Inlet; and others. One wrong sentence was corrected with a backup: Chesterfield Inlet
  was explored in 1762 by Moses Norton, not by Hearne in 1770. The Mattawa River on production
  now returns Champlain (1615) and Brûlé (1610); Champlain was already linked in the data before
  this, so if the panel showed neither on the device, the app was showing cached data.
- **Portraits.** Every explorer and notable figure without an image was checked against the
  lead image of its Wikipedia article and the Commons record of that file, and a Commons search
  was run for the rest. Twelve lifetime likenesses were confirmed and set
  (`2026-10-17-portraits-from-commons.ts`): Lewis (Peale, c. 1807) and Clark (Peale, 1810), as
  the owner pointed out; Hennepin (1694 engraving); Ogden (photograph before 1854); Martínez
  (Spanish naval portrait, c. 1785); Quimper (c. 1790); Alexander Ross (photograph); Franchère
  (before 1863); Sverdrup (photograph, National Library of Norway); Tattannoeuck (Robert Hood,
  1821); Maquinna (Suría, 1791); Baranov (Tikhanov, 1818). Not set, because no likeness made in
  the person's lifetime exists or could be found: Sacagawea (every image is a twentieth-century
  statue or painting; the owner may decide whether a labelled depiction is acceptable),
  Thompson, Thanadelthur, Charlotte Small, Isabel Gunn, Saukamappee, Keskarrah (Hood's 1821
  drawing of him exists at Library and Archives Canada but is not on Commons), Donnacona,
  Kondiaronk, Tessouat (the Codex canadensis "one-eyed captain" is c. 1700, posthumous),
  Membertou, Wickaninnish, Kwah, Comcomly (Catlin's portrait is posthumous), John Ross (the BnF
  image is a later reproduction), Kane (Hicks's portrait is 1858, after his death), Shelikhov
  and Kotzebue (undated), Bellot, Kennedy, Dease, Middleton, Munk, Penny, Kellett, Eenoolooapik,
  Lady Franklin, Hans Hendrik, and the eighteenth-century Hudson's Bay Company men.
- **Missing waterways.** The roster was compared with a list of the fur-trade and exploration
  rivers and lakes; 33 exports from OpenStreetMap are running for a fourth pack (Slave, North
  and South Saskatchewan, Liard, Winnipeg River, Rainy River and Lake, Sturgeon-Weir, Clearwater,
  Bow, Qu'Appelle, Finlay, Parsnip, Nechako, Stuart Lake, Bella Coola, Georgian Bay, Lake
  Timiskaming, Lakes Winnipegosis and Manitoba, Pigeon, Dease, Pelly, Kazan, Dubawnt, Seal,
  Severn, Rupert, Eastmain, Ungava Bay, Lakes Mistassini and Abitibi, Gulf of St. Lawrence).
- **Sources.** 327 records carry reading guides; 47 of them point to a single kind of source and
  22 have none (Hayes and Kaministiquia rivers, fourteen posts, and the figures Sacagawea,
  Saukamappee, Tattannoeuck, Keskarrah and Roderick McKenzie). Overall the guides cite 348
  Wikipedia pages, 129 Canadian Encyclopedia articles, 89 Hudson's Bay Company Archives
  references, 41 Parks Canada pages, 35 Dictionary of Canadian Biography entries and some 300
  books and editions. The next pass adds a scholarly or archival source to every single-source
  record and guides to the 22 without.

### 9.9 Content pack 4, The Interior Rivers (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/interior-rivers.ts`, applied by
`2026-10-17-pack-interior-rivers.ts` (dry run, backup, apply, verify; idempotent). Scope, from the
owner's report of the missing Slave River and Saskatchewan branches: the water highways of the
interior fur trade from Georgian Bay and the Pigeon River to the two branches of the
Saskatchewan, the Sturgeon-Weir and Clearwater links to the Athabasca, the Slave and the Liard,
and the New Caledonia rivers, told as Indigenous routes the traders followed.

| Added | Count | Notes |
|---|---|---|
| Waterways | 21 | Slave, North Saskatchewan, South Saskatchewan, Liard, Winnipeg River, Rainy River, Rainy Lake, Sturgeon-Weir, Clearwater, Bow, Qu'Appelle, Finlay, Parsnip, Nechako, Stuart Lake, Bella Coola, Georgian Bay, Lake Timiskaming, Lake Winnipegosis, Lake Manitoba, Pigeon River. OpenStreetMap polygons or centrelines for twenty (Rainy Lake thinned from 149,000 to 50,000 points); Georgian Bay is a single OSM node and stays a pin. Fur-trade rows for the Slave, North Saskatchewan, Winnipeg and Clearwater |
| Existing posts moved to the right river | 16 | Fort Edmonton, Fort Augustus, Fort Pitt, Fort George (Saskatchewan), Fort Carlton, Fort Battleford and Rocky Mountain House to the North Saskatchewan; Batoche to the South Saskatchewan; Fort Liard to the Liard; Bas-de-la-Rivière, Slave Falls Portage and Rat Portage to the Winnipeg River; Fort Lac La Pluie to the Rainy River; Fort Qu'Appelle to the Qu'Appelle; Fort St. James to Stuart Lake; Fort Témiscamingue to Lake Timiskaming (backup records every old waterway id) |
| Explorers | 10 | Joseph and Thomas Frobisher, James Finlay, Joseph Howse, John Rowand, Robert Campbell, John McLeod, Alexander Caulfield Anderson, Henry Youle Hind, James Hector. Lifetime portraits for five (Frobisher by Dulongpré c. 1800; photographs of Campbell, Anderson, Hind and Hector) |
| Explorer–waterway links | 93 | Henday, Cocking, Tomison, Pond, Thompson, Fidler, Franklin, Palliser and the La Vérendryes on the new rivers; every new explorer has at least one |
| Locations | 16 | Fort Smith, Fort Halkett, Fort St. Pierre, Fort Dauphin, South Branch House, Chesterfield House, Hudson House, Buckingham House, Fort Calgary, Blackfoot Crossing, Fort Espérance, Fort Charlotte, Île-à-la-Crosse, Mackenzie Rock, Sainte-Marie among the Hurons, Penetanguishene. Five have no image (nothing suitable and licensed on Commons): Fort Halkett, South Branch House, Hudson House, Île-à-la-Crosse, Mackenzie Rock |
| Notable figures | 6 | Maskepetoon, Payipwat (Piapot), Mistawasis, Ahtahkakoop, Jerry Potts, Pierre Falcon. Lifetime portraits for four: Piapot (photograph c. 1885), Mistawasis and Ahtahkakoop (the 1886 photograph of four Cree chiefs), Potts (photograph) |
| Timeline events | 37 new; 12 existing unlinked timeline events given their links (HBC charter, Thanadelthur's mission, Cumberland House with Hearne, Fraser's descent, Thompson's arrival on the Pacific, Seven Oaks, Red River Resistance, Manitoba, Northwest Resistance with Batoche, Lake of the Woods massacre, and others) | |
| What Happened Here events | 15 new; 14 existing unlinked events given links (Treaty 6 at Fort Carlton, Seven Oaks, Selkirk settlers, Fort Rouge, Treaty 1, the rendezvous at Grand Portage and Fort William, Fort St. Charles, HBC founded, NWC formed, Plains of Abraham, Thompson's Mandan journey, and others) | |
| Pronunciations | 18 | Cree, Blackfoot, Dene, Dakelh, Sekani, Nuxalk, Kaska, Anishinaabe, Nakoda and Wendat terms, and pemmican |
| Quiz | 1 | "Rivers of the Fur Trade Interior", 8 questions, grade 7-9 |
| Deep Dive / lesson plan | 1 | "River Highways: How Indigenous Routes Became the Fur Trade's Roads", grade 4-6, Indigenous Routes |
| Field trip | 1 | "Sainte-Marie among the Hurons, 1639-1649", grade 4-6, six stops |
| Reading-guide entries | 119 | Dictionary of Canadian Biography, Canadian Encyclopedia, Parks Canada, Hudson's Bay Company Archives and Wikipedia, every URL verified |
| Images | 88 URLs | Commons, public domain or CC BY / CC BY-SA, credited; includes Franklin's 1828 plate of the Clearwater valley from Methye Portage, Pond's 1785 map, Fidler's copy of Ac ko mok ki's 1801 map, Thompson's 1814 map, Palliser's general map, Fort Carlton in 1877, Back's buffalo pound, the 1878 photograph of the police at Fort Calgary, and the 1908 water-power plan of the Winnipeg River |

Added the same day (`2026-10-17-primary-sources-interior.ts`): 14 primary-source pointer
documents (Brébeuf's and Ragueneau's Relations, the La Vérendrye journals, Henday, Cocking,
Pond, Henry the Younger, Fidler and the Ac ko mok ki map, Hind, the Palliser reports, Anderson's
gold-rush handbook, Morris's Treaties with Erasmus's Buffalo Days and Nights, Falcon's song,
Mackenzie's 1793 journal). After the pack, every record in Turso has at least two kinds of
source among its reading guides (`2026-10-17-reading-guide-gaps.ts`, 172 guides in two passes),
and no record is without one.

### 9.10 Content pack 5, The Bay and the Barren Lands (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/bay-and-barren-lands.ts`, applied by
`2026-10-17-pack-bay-and-barren-lands.ts` (dry run, backup, apply, verify; idempotent). Scope:
the rivers of Hudson Bay and James Bay that the earlier packs left as bare names or did not have
at all: the Omushkego Cree rivers of the Ontario lowlands, the Eeyou Istchee rivers of the Quebec
side, Lake Mistassini and Lake Abitibi on the overland routes, the Nunavik rivers to Ungava Bay,
and the Sayisi Dene and Caribou Inuit rivers of the Barren Grounds to Baker Lake. People come from
the Dictionary of Canadian Biography wherever it has them (thirteen explorers and all six figures);
Low, Pike, Seton and J. W. Tyrrell, whom it does not cover, rest on Wikipedia, the Geological
Survey reports and their own books, and every date in the pack was checked against those sources
before it was written.

| Added | Count | Notes |
|---|---|---|
| Waterways | 18 | Severn, Winisk, Attawapiskat, Rupert, Eastmain, Nottaway, Harricana, La Grande, Great Whale, Seal, Kazan, Dubawnt, Baker Lake, Ungava Bay, Koksoak, George, Lake Mistassini, Lake Abitibi. OpenStreetMap geometry for seventeen (Lake Mistassini thinned from 114,000 to 39,000 points; the Quebec rivers exported under their French OSM names); the Eastmain has no named OSM relation and stays a pin. Fur-trade rows for the Severn, Rupert, Eastmain and Koksoak |
| Existing posts moved to the right river | 3 | York Factory to the Hayes (the Hayes had no post and no explorer), Fort Severn to the Severn, Rupert House to the Rupert; the backup records the old waterway ids |
| Explorers | 17 | Albanel, Isham, Coats, Mitchell, Isbister, Graham, Wales, Erlandson, Finlayson, McLean, Bell, Low, Pike, Hanbury, Hornby, J. W. Tyrrell, Seton. Lifetime portraits for two only (Seton, Harris and Ewing photograph; Bell, the photograph in the Royal Society of Canada's Proceedings, dated no later than 1917). Commons has no lifetime likeness of Hornby, Hanbury, McLean, Pike, Low, Nickawa or Christian, and none exists for the eighteenth-century men |
| Explorer–waterway links | 74 | Hearne on the Seal, Kazan, Dubawnt and Thelon; James and Foxe at the Severn; Groseilliers at the Rupert; de Troyes and Iberville on the Albany, Rupert, Moose, Abitibi, Severn and Hayes; Radisson and Kelsey on the Hayes; J. B. Tyrrell on the Dubawnt, Kazan, Baker Lake and Chesterfield Inlet; every new explorer has at least one. The Albany and the Hayes, which had none, now have four and four |
| Locations | 12 | Henley House, Eastmain House, Fort George (Chisasibi), Fort Chimo, Fort Severight, Mistassini Post, Fort Richmond, Great Whale River Post, Baker Lake Post, Hornby Point, Winisk (Peawanuck), Attawapiskat. Fort Richmond has no image |
| Notable figures | 6 | Miscomote, Wappisis, Abishabis, Inukjuarjuk, Zhauwuno-geezhigo-gaubow (Jack Fiddler), Frances Nickawa; all from the Dictionary of Canadian Biography. No lifetime likeness on Commons for any (Forster's 1921 portrait of Nickawa is not there) |
| Timeline events | 33 new; the unlinked "Thanadelthur Captured by Cree Raiders" linked to Hudson Bay and York Factory | |
| What Happened Here events | 10 new (Albanel at the Rupert, the taking of Fort Albany, the surrender of York Fort, the Albany hangings, the transit of Venus, Erlandson at Lake Melville, the death of Abishabis, the Tyrrells on the coast, Jack Fiddler at Norway House, the last entry at Hornby Point) | |
| Pronunciations | 22 | Omushkego and Eeyou Cree, Inuktitut, Naskapi, Dene and Algonquin place names and nations, and windigo |
| Quiz | 1 | "The Bay and the Barren Lands", 8 questions, grade 7-9 |
| Deep Dive / lesson plan | 1 | "The Bay: Cree, Inuit, Dene and the Company on Hudson Bay", grade 7-9, Fur Trade |
| Field trip | 1 | "The Thelon: Hornby Point and the Barren Lands", grade 7-9, six stops |
| Reading-guide entries | 151 | Dictionary of Canadian Biography, Canadian Encyclopedia, Hudson's Bay Company Archives, Internet Archive editions of the sources, Parks Canada and Wikipedia; every URL verified (five Commons image URLs answered only 429 on the final check and were accepted on the strength of their file records) |
| Images | 78 URLs | Commons, public domain or CC BY / CC BY-SA, credited; includes Andrew Graham's 1768-70 plan of the bay, Moses Norton's 1760 draught, Pierre Allemand's chart of the forts taken in 1686, Low's map of Lake Mistassini, the 1935 Seal River survey sheet, the Keewatin survey of the Winisk, the stove in Hornby's cabin from the NWT Archives, and the 1937 Hoare and Clarke photograph on the Thelon |

Added the same day (`2026-10-17-primary-sources-bay.ts`): 17 primary-source pointer documents
(Albanel's Relation of 1672, Isham's and Graham's Observations, Coats's Geography, Wales's
Churchill journal, the Severn journal on Abishabis, Erlandson's crossing, McLean's Notes, Turner's
Ethnology of Ungava, Bell's Attawapiskat report, Low's Labrador reports, Tyrrell's Dubawnt and
Kazan report with his brother's book, Pike, Hanbury, Seton, Christian's diary, and Killing the
Shamen).

### 9.11 Content pack 6, The Yukon (applied 2026-10-17)
Data in `backend/prisma/turso-migrations/packs/yukon.ts`, applied by `2026-10-17-pack-yukon.ts`
(dry run, backup, apply, verify; idempotent). Scope: the Yukon, which existed as a row with no
explorers and one post, and everything around it: the tributaries and headwater lakes, the two
routes by which the Hudson's Bay Company reached the river from the Mackenzie in the 1840s, the
surveys of the 1880s, the Klondike, and the Hän, Tagish and Ta'an Kwäch'än response to it. The
Yukon row itself went from no explorers and one post to 17 explorers and 7 posts and sites. People rest on the Dictionary
of Canadian Biography where it has them (ten explorers, four figures, each entry read in full) and
on Wikipedia and their own books for the Americans it does not (McQuesten, Harper, Ladue,
Carmack, Ogilvie, Kennicott, Zagoskin, Jim Boss).

| Added | Count | Notes |
|---|---|---|
| Waterways | 16 | Pelly, Stewart, Klondike, Teslin River, White, Porcupine, Peel, Dease River, Fortymile, Lake Laberge, Bennett Lake, Tagish Lake, Kluane Lake, Teslin Lake, Atlin Lake, Frances Lake; OpenStreetMap geometry for all sixteen. Fur-trade rows for the Pelly and the Porcupine |
| Explorers | 17 | Bell, Murray, Hardisty, Schwatka, Whymper, Dawson, Bompas, Constantine, Steele, Zagoskin, Kennicott, McQuesten, Harper, Ogilvie, Carmack, Ladue, and Campbell's links extended. Lifetime likenesses for eight (Schwatka, 1881 engraving; Dawson, Notman photograph 1892; Bompas; Steele, 1900; Zagoskin; McQuesten; Ogilvie; Harper in Farciot's 1884 group at Fort Yukon; Carmack by Woodside c. 1900). None exists on Commons for Bell, Murray, Hardisty, Whymper, Constantine, Kennicott (an engraving of uncertain date was passed over) or Ladue |
| Explorer–waterway links | 56 | Campbell on the Frances, Pelly, Yukon, Stewart and Dease; Bell on the Peel, Porcupine and Yukon; Franklin on the Peel; the Yukon row goes from no explorers to seventeen |
| Locations | 15 | Fort Selkirk, Frances Lake Post, Lapierre House, Fort Reliance (Yukon), Forty Mile, Fort Constantine, Tr'ochëk, Moosehide, Dawson City, Bonanza Creek Discovery Claim, Carcross, Bennett, Chilkoot Pass, Miles Canyon, Five Finger Rapids. Three have no image (Frances Lake Post, Fort Reliance, Fort Constantine) |
| Notable figures | 5 | Keish (Skookum Jim), Káa Goox (Dawson Charlie), Shaaw Tláa (Kate Carmack), Isaac, Jim Boss. Lifetime photographs for four (Keish by Duclos, Dawson, 1898; Káa Goox and Carmack from Library and Archives Canada; Shaaw Tláa; Jim Boss from the Parks Canada designation record); none on Commons for Chief Isaac |
| Timeline events | 30 | From McLeod on the Dease (1831) to the World Heritage inscription (2023) | 
| What Happened Here events | 8 | Campbell's walk to the Pelly, Fort Yukon in Russian territory, the sack of Fort Selkirk, Schwatka in Miles Canyon, gold on Rabbit Creek, the Hän leaving Tr'ochëk, Steele's rules at Bennett, Keish's return to Carcross | 
| Pronunciations | 21 | Hän, Northern and Southern Tutchone, Gwich'in, Tlingit, Tagish and Kaska names |
| Quiz | 1 | "The Yukon: River, Company and Klondike", 8 questions, grade 7-9 |
| Deep Dive / lesson plan | 1 | "The Yukon: A River Road from the Company to the Klondike", grade 7-9 |
| Field trip | 1 | "Klondike, 1896-1898: From Tr'ochëk to Dawson", grade 7-9, six stops |
| Reading-guide entries | 135 | Dictionary of Canadian Biography, Canadian Encyclopedia, Hudson's Bay Company Archives, Parks Canada, Internet Archive editions and Wikipedia; every URL verified, with the Canadian Encyclopedia slugs checked individually (it has no articles on most of the Yukon's rivers) |
| Images | 76 URLs | Commons, public domain or CC BY / CC BY-SA, credited; includes Isbister's 1845 sketch map of the Peel, Marsh Lake and Forty Mile about 1899, the 1899 Bonanza Creek drawing, and a 1897 fortune-seekers' guide |

Added the same day (`2026-10-17-primary-sources-yukon.ts`): 15 primary-source pointer documents
(Campbell's Discovery and Exploration of the Youcon, Murray's Journal of the Yukon, Hardisty's
Loucheux Indians, Whymper with Dall, Schwatka's book and report, Dawson's 1887 report, Ogilvie's
1897 pamphlet and Early Days, Hayne's Pioneers of the Klondyke, Adney's Klondike Stampede, Steele's
Forty Years, Haskell's Two Years, Carmack's My Experiences, Zagoskin's Travels, Martha Black's My
Seventy Years, and Angela Sidney's Tagish account of the discovery).

Owner's review of 2026-10-17, to be taken up after this pack: the Parsnip River has no fur-trade
record or posts, and the app has no waterway-to-waterway relation at all (the Peace, Finlay and
Parsnip are joined only in prose); the Kaministiquia route (Dog Lake, Dog River, Lac des Mille
Lacs) is absent though Great Dog Portage exists; and a full sweep of every template field for
every record is required once the packs are done. Measured on 2026-10-17 across 150 waterways:
118 without a fur-trade record, 111 with no connected notable figure, 144 with no archaeological
discovery, 81 without video, 64 without a post or site, 55 without an Indigenous name, 16 without
an explorer, 9 without geometry.

### 9.12 Gap pack: the Kaministiquia route and the Parsnip (applied 2026-10-18)
From the owner's review of 2026-10-17. Data in `packs/kaministiquia-and-parsnip.ts`, applied by
`2026-10-18-gap-kaministiquia-parsnip.ts`, a copy of the pack machinery with the lesson and field
trip made optional and a `furTradeForExisting` list for rows that lacked a fur-trade record.

| Added or changed | Notes |
|---|---|
| Waterways (6) | Dog Lake, Dog River, Lac des Mille Lacs, Savanne River (no OpenStreetMap geometry; a pin), Pack River, McLeod Lake; geometry for the other five |
| Fur-trade records (4) | Parsnip River and Kaministiquia River (existing rows that had none), Dog Lake and McLeod Lake |
| Explorer | Zacharie Robutel de La Noue, who built Fort Kaministiquia in 1717 (Dictionary of Canadian Biography) |
| Links (8) | de Noyon on Dog Lake, Dog River and Lac des Mille Lacs (1688); La Noue on the Kaministiquia and Lake Superior; Dulhut on Lake Superior; Fraser and Stuart on the Pack and McLeod Lake (1805); Mackenzie on the Peace (1793) |
| Location | Kakabeka Falls, the Mountain Portage of the Kaministiquia route |
| Posts moved | Fort Kaministiquia from the Lake Superior row to the Kaministiquia; Fort McLeod (BC) from the Peace to McLeod Lake, which the Parsnip and the Pack reach |
| Events, pronunciations, quiz | 3 timeline events, 2 What Happened Here events (La Noue's post; Mackenzie at Finlay Forks), 3 pronunciations, a four-question quiz; 20 reading guides |

Still open from the same review: the data model has no waterway-to-waterway relation, so the
Parsnip, Finlay and Peace are joined only in prose. A tributary or confluence relation is proposed
as a code change for the owner's approval before the template-field sweep (section 9.11, last
paragraph) begins.

### 9.13 Content pack 7, The Atlantic (applied 2026-10-18)
Atlantic Canada was the thinnest part of the data (Newfoundland and Labrador had three waterways,
New Brunswick one). Data in `packs/atlantic.ts`, applied by `2026-10-18-pack-atlantic.ts`; primary
sources by `2026-10-18-primary-sources-atlantic.ts`. The Gulf of St. Lawrence, Newfoundland, Labrador
and the Maritimes from the Bristol and Portuguese voyages to the Admiralty surveys, with the Mi'kmaq,
Wolastoqiyik, Beothuk, Innu and Labrador Inuit at the centre. People rest on the Dictionary of
Canadian Biography (34 biographies read in full) and on Wikipedia for Mina Hubbard and Nonosabasut.

| Added or changed | Notes |
|---|---|
| Waterways (21) | Gulf of St. Lawrence (no single OpenStreetMap geometry; a pin at 48°N 62°W), Exploits River, Beothuk Lake (Red Indian Lake), Notre Dame Bay, Trinity Bay, Conception Bay, Humber River (Newfoundland; no OSM geometry, a pin), Hamilton Inlet (with Lake Melville's geometry), Churchill River (Labrador), Naskaupi River, Sandwich Bay, Nain Bay, Miramichi, Restigouche, Annapolis Basin, Minas Basin, Northumberland Strait, Cabot Strait, Bras d'Or Lake, Chignecto Bay; 19 with geometry |
| Fur-trade records (4) | Hamilton Inlet (Fornel 1743, Hudson's Bay Company 1836), Sandwich Bay (Cartwright 1775), Annapolis Basin (de Monts to d'Aulnay), Bras d'Or Lake (Denys 1654-69) |
| Explorers (28) | Corte-Real, Verrazzano, Roberval, Jean Alfonse, Gilbert, Edward Hayes, John Guy, John Mason, Whitbourne, Kirke, de Monts, Poutrincourt, Lescarbot, La Tour, Razilly, Denys, Argall, Fornel, Laure, Palliser, Cartwright, Jens Haven, Buchan, Cormack, Jukes, Bayfield, DesBarres, Mina Benson Hubbard |
| Portraits (8) | Lifetime likenesses only: Roberval (Clouet sketch, c. 1540), Palliser (attr. Dance, c. 1775), Cartwright (Hilton, c. 1791), DesBarres (credited to Peachey), Jukes (photograph c. 1860), Mina Hubbard (1905), and the figures Demasduit (Lady Hamilton, 1819) and Mikak (Russell, 1769). No lifetime likeness could be confirmed for the other twenty; they are left without portraits rather than given a later imagining |
| Notable figures (4) | Demasduit, Nonosabasut, Mikak, Tuglavina (Shawnadithit and Membertou already existed) |
| Links (66) | Including the existing Cabot, Cartier, Champlain, Cook, Jolliet (the 1694 Labrador voyage), John Davis (Hamilton Inlet, 1586), d'Iberville (Placentia, 1696), McLean and Erlandson (the Grand Falls, 1839) and A. P. Low (1894); new links on the existing Strait of Belle Isle, Placentia Bay, Baie des Chaleurs, Saguenay, Saint John, Bay of Fundy, St. Lawrence and George River rows |
| Locations (14) | Cupids, Trinity, Boyd's Cove Beothuk Site, Placentia (Plaisance), North West River, Rigolet, Cartwright, Nain Moravian Mission, Fort La Tour, Grand-Pré, Fort Beauséjour, Saint-Pierre (St. Peter's), Nipisiguit, Miscou Post |
| Post moved | Port-Royal (Habitation) from the Bay of Fundy row to the new Annapolis Basin |
| Events, pronunciations | 37 timeline events, 10 What Happened Here events (Gilbert at St. John's; Sainte-Croix; the Théâtre de Neptune; Bull Arm; Fornel; Chateau Bay; Buchan's marines; the taking of Demasduit; Shawnadithit's drawings; the Grand Falls), 26 pronunciations (Mi'kmaq, Wolastoqey, Beothuk, Innu-aimun, Inuttitut) |
| Quiz, lesson, field trip | Quiz "The Atlantic Gateway" (8 questions); lesson "The Atlantic Gateway: Where Europe First Met the Northeast" (grades 7-9); field trip "Port-Royal, 1606-1607: The Winter of Good Cheer" (grades 4-6, six stops) |
| Primary sources (16) | The Cabot and Corte-Real letters (Biggar), Hayes on Gilbert (Hakluyt), Guy's letters (Purchas, Cell), Mason's and Whitbourne's Discourses, Champlain's and Lescarbot's Acadia, Biard's Relation of 1616, Denys (Ganong), Fornel's Relation, Cartwright's Journal, Cormack's Narrative, Shawnadithit's drawings and the Beothuk record (Howley), Jukes, Bayfield's Sailing Directions, Mina Hubbard; every Internet Archive identifier checked |

Rules kept: every statement was read in the Dictionary of Canadian Biography or Wikipedia during
authoring, and details that could not be found there were cut (Cartier's return through the Cabot
Strait, the Fornel page numbers, Jukes's later career, Bayfield's exact end date). The Beothuk
material follows the DCB entries on Demasduwit and Shawnadithit closely. Verify after apply:
192 waterways, 187 explorers, 618 explorer-waterway links, 199 locations, 65 notable figures, 244 timeline events, 132 What Happened Here events, 172 pronunciations, 15 quizzes, 33 lessons, 13 field trips, 2,002 reading guides, 176 primary-source documents (85 for grades 10-12, 80 for 7-9, 11 for 4-6). Gulf of St. Lawrence 6 explorers; Annapolis Basin 7 explorers and Port-Royal; Hamilton Inlet 5 explorers, North West River and Rigolet. The production API served all 192 waterways, 187 explorers and 65 figures within a minute of the apply. Three timeline and four What Happened Here events from older packs remain unlinked and go to the sweep.

### 9.14 Template-field sweep, pass 1 (applied 2026-10-18)
The owner's instruction of 2026-10-17: once the packs are done, sweep the whole app so that as many
as possible of the template fields on every waterway and call-out are populated, because those
call-outs are the gate to further research. The sweep is run as numbered passes, each a migration
script with a dry run, a backup and a verify block, each committed with its before-and-after counts.

**Baseline after pack 7 (192 waterways, 199 locations, 187 explorers, 65 figures):**

| Field | Missing before pass 1 |
|---|---|
| Waterway: Indigenous name | 78 (language 28) |
| Waterway: fur-trade record | 150 (47 of them have a fort or trading post attached) |
| Waterway: connected notable figure | 143 |
| Waterway: archaeological discovery | 186 (8 discoveries exist in all) |
| Waterway: video | 123 |
| Waterway: no explorer / no location / no geometry | 22 / 88 / 12 |
| Waterway: image / gallery of two or more | 4 / 12 |
| Location: image / year / Indigenous name | 14 / 17 / 103 |
| Explorer: image / no waterway link | 88 / 11 |
| Figure: image / no waterway in associatedLocations | 30 / 14 |

**Pass 1** (`2026-10-18-sweep-1-links-figures-names.ts`): the connections the detail sheets key on.
13 figures given the waterways their own biographies and the Dictionary of Canadian Biography name
(Riel, Dumont, Grant and Lagimodière to the Red; Poundmaker and Big Bear to the North Saskatchewan;
Crowfoot to the Bow; Shawnadithit to the Exploits, Beothuk Lake and Notre Dame Bay; and so on);
22 explorer-waterway links added from the DCB (Norton, William Stuart and Colen on the Hayes and
Churchill; McTavish and McGillivray at Grand Portage and Fort William; McDonald of Garth on the North
Saskatchewan and Columbia; Anderson on the Fraser and Thompson; Finlay on the Saskatchewan; La
Vérendrye and Harmon on the Assiniboine; La Salle and Jolliet on Lake Erie; Champlain on the Minas
Basin; Thompson on Reindeer Lake; Buchan on Notre Dame Bay; Schwatka on Tagish Lake and the White);
9 Indigenous names set from the waterways' Wikipedia articles (Attawapiskat, Fox, Kootenay, Liard,
Snake, Stewart, White, Terror Bay, Bay of Fundy); one sentence in the William Stuart row that put
Kelsey after Stuart corrected. After: 640 links; 15 waterways without an explorer; 2 explorers
without a waterway; 1 figure (Saukamappee) without a waterway; 69 waterways without an Indigenous name.

**Pass 2** (`2026-10-18-sweep-2-fur-trade.ts`): fur-trade records for 38 waterways that carried a
fort or trading post but had nothing behind the "Fur Trade History" card, written from the posts' own
sourced rows (Lake Huron, Lake Ontario, Great Slave Lake, Nelson, Assiniboine, Yukon, Saint John, Baie
des Chaleurs, Juan de Fuca Strait, Queen Charlotte Sound, Hayes, Moose, Albany, Lake of the Woods,
Illinois, Fox, Detroit, Niagara, Puget Sound, Thompson, Stikine, South Saskatchewan, Liard, Rainy River
and Lake, Qu'Appelle, Stuart Lake, Georgian Bay, Lake Timiskaming, Lake Winnipegosis, Pigeon, La Grande,
Great Whale, Baker Lake, George River, Lake Mistassini, Fortymile, Frances Lake). Fur species are named
only where the rows name them. Eight waterways whose posts were garrisons, police posts or expedition
bases (Chignecto, Placentia, Richelieu, Lake Champlain, Bow, Coppermine, Repulse Bay, Great Bear Lake)
were left without a record on purpose. After: 80 fur-trade records; 112 waterways without one, most
of them Arctic channels, bays and rivers with no post.

**Pass 3** (`2026-10-18-sweep-3-indigenous-names.ts`): the Wikipedia and Canadian Encyclopedia
articles cited on all 69 waterways and 103 locations without an Indigenous name were read for one;
six were found and set (Richelieu: Masoliantekw, Abenaki; Nottaway: Natuweu Nipi, Cree; Dubawnt:
Tobotua, Dene Sųłıné; Fort Carillon: Tekontaró:ken, Mohawk; Bas-de-la-Rivière: Zaagiing, Ojibwe; Fort
Gibraltar: Nistawâyâw, Cree). The remaining 66 waterways and 100 locations have no recorded name in
those sources; a later pass will go to the provincial and territorial place-name records and the
nations' own sources rather than invent one.

**Pass 5** (`2026-10-18-sweep-5-discoveries.ts`): archaeological discoveries, which 186 waterways had
nothing for. Three existing rows were pointed at the wrong waterway and moved (L'Anse aux Meadows and
Red Bay from the St. Lawrence to the Strait of Belle Isle; the Beechey Island graves from Hudson Bay to
Wellington Channel). Eighteen sites added from their Wikipedia articles: Port au Choix, Boyd's Cove,
Sainte-Marie among the Hurons, Bluefish Caves, Fort Michilimackinac, Fort Saint Charles, Wanuskewin,
Charlesbourg-Royal, Saint Croix Island, Kodlunarn Island, The Forks, Kay-Nah-Chi-Wah-Nung, Whitefish
Island, Xá:ytem, Marpole Midden, Charlie Lake Cave, Sheguiandah, and McClintock's Victory Point and
Erebus Bay finds of 1859. Six candidates (Agawa Rock, Skraeling Island, Fort Vancouver, Namu, Debert,
Yuquot) were held back because the excavation dates and names could not be confirmed in the sources
read today; they go to a later pass with other sources. After: 26 discoveries on 23 waterways.

**Pass 6** (`2026-10-18-sweep-6-portraits.ts`): for the 88 explorers and 30 figures without an image,
the cited Wikipedia article's portrait and its Commons file record were read, and a Commons search by
name run. Seven lifetime likenesses found and set: Henri de Tonti (attributed to Nicolaes Maes), Sir
John Ross (c. 1833, Royal Museums Greenwich), William Penny (Stephen Pearce, 1853), A. P. Low (1894
photograph), James William Tyrrell (1900), Robert Kennicott (Smithsonian photograph) and Keskarrah
(Robert Hood's watercolour of 1821). Everything else was passed over for the owner's rule: posthumous
engravings (Thomas Simpson 1845, Verrazzano 1768), imagined portraits (Comcomly, Membertou, Lescarbot by
Jefferys), undated images (McGillivray, Rowand, Shelikhov, Kotzebue) and the many people for whom no
likeness exists. Denys's 1672 description of the Restigouche added as a link. After: 82 explorers and
29 figures without an image; 14 waterways without an explorer.

**Pass 7** (`2026-10-18-sweep-7-location-images.ts`): a Commons search for each of the 14 locations and 4
waterways without an image found a usable, freely licensed one for three: Fort Crèvecoeur (a 1932 book
illustration), Hochelaga (the national historic site's landscape at Montreal) and the Pack River. The
one hit for Fort Reliance (Yukon) was the ruin of Back's Fort Reliance on Great Slave Lake and was
rejected. After: 12 locations and 3 waterways without an image (Savanne River, Lac des Mille Lacs,
McLeod Lake), none of which has a photograph on Commons.

**Also measured, no change possible yet:** the twelve waterways without geometry were tried again
against OpenStreetMap (Georgian Bay, Davis Strait, Cook Inlet, Prince William Sound, Dixon Entrance,
Kotzebue Sound, Sitka Sound, Parry Channel); none has a named relation there, so they stay as pins.
Of the 15 waterways without an explorer, the Wikipedia articles name no documented visit by anyone in
the data for Atlin, Kluane, Nass, Skeena, Harricana, Nottaway, La Grande, Winisk, Savanne, Atikokan,
Chignecto, Teslin, Lesser Slave Lake or Sitka Sound; Denys's 1672 description of the Restigouche is the
one lead and goes into pass 4 with the others when they are sourced.

**Flagged for the owner, not changed:** the explorer row "Richard Stuart" (said to have accompanied
William Stuart inland from York Factory) matches no one in the Dictionary of Canadian Biography or
the Hudson's Bay Company record as far as could be found; it looks like an invented seed row and
should be deleted or sourced.

**Passes still to run, in order:**
2. Done above.
3. Done above for what the cited articles hold; the remaining 66 waterways from the Canadian Encyclopedia, the provincial
   and territorial place-name records and Indigenous-nation sources, each with its language; the
   103 locations without one treated the same way.
4. Explorer links for the 15 waterways still without one (Atlin, Kluane, Nass, Skeena, Harricana,
   Nottaway, La Grande, Winisk, Savanne, Atikokan, Restigouche, Chignecto, Sitka Sound, Teslin,
   Lesser Slave Lake), where a documented visit exists.
5. Done above for eighteen sites; the six held back and a general pass: a sourced set for the sites the data already names (Red Bay,
   L'Anse aux Meadows, Boyd's Cove, Port-Royal, Sainte-Marie, Fort Chipewyan, Yuquot, Beechey Island,
   Erebus and Terror, and the others) before any general pass.
6. Done above for people and, in pass 7, for the three places Commons has a photograph of; the 12
   locations and 3 waterways still without one have nothing on Commons.
7. Location years and Indigenous names; the 12 waterways without geometry (the Arctic channels,
   the Gulf, the Humber) where OpenStreetMap has a usable relation.

**Needing the owner's decision before they are touched:** (a) video: 123 waterways have none, and
no video should be attached that has not been watched and found accurate, so the sweep proposes a
short list of institutional channels (Parks Canada, Historica's Heritage Minutes, the Canadian
Encyclopedia, provincial archives) for the owner to approve before any URL is written; (b) the
waterway-to-waterway relation (tributary, confluence, outlet) first proposed in section 9.12, a
schema and client change, so that the Parsnip, Finlay and Peace, or the Exploits and Beothuk Lake,
are joined in the app and not only in prose.

### 9.15 Owner decisions of 2026-10-18: waterway connections, the Richard Stuart row, header images, video
The owner answered the three questions of section 9.14 on 2026-10-18: video from the approved
institutional channels only, and no video is acceptable; every waterway and location must have a
header image; build the waterway-to-waterway relation and populate it; delete the "Richard Stuart" row.

**Waterway connections (schema and client change).** New table `WaterwayConnection` (fromId, toId,
relation, notes), declared in `schema.prisma` and created in Turso with the CREATE-only DDL
`2026-10-18-waterway-connections.sql`. Relations: `flows_into` (a river into a river, lake, bay or
sea; a lake into the body it drains to), `outlet_of` (a river that drains a lake), `part_of` (an arm,
basin or bay of a larger body) and `joins` (a strait or channel between two bodies). `GET
/api/waterways/:id` returns `connections`, each with the other waterway (id, name, type, coordinates),
the relation and a direction read from the viewed waterway's side; the detail sheet shows them as a
tappable "Connected Waterways" card that opens the other waterway on the map through the existing
`/?markerId=&markerType=` route. Populated by `2026-10-18-waterway-connections-data.ts` with 165
links over 174 waterways, each checked against the source, mouth, inflow, outflow and part-of fields
of the waterways' Wikipedia articles or the geography sourced in the packs; where the water passes
through a river or lake that is not a row (the St. Marys River, the Rivière des Rochers, the
Waterhen) the note says so. The 18 waterways left unconnected are coastal bodies whose parent water
is not a row (Bonavista, Trinity, Conception, Placentia and Lituya bays, Terror and Mercy bays, the
Alaska sounds, Bering Strait, the Back, Hudson and Stikine rivers, Sandwich and Nain bays). Verified
end to end on the local backend: the Parsnip now shows the Pack flowing in and itself flowing into
the Peace; Lake Winnipeg shows the Red, Winnipeg and Saskatchewan rivers and Lake Manitoba flowing in
and the Nelson as its outlet. The client change needs an EAS build to reach phones.

**The Richard Stuart row.** Deleted with its two reading guides, and its three documents with it.
The row described an eighteenth-century Hudson's Bay Company servant who "accompanied William
Stuart" from York Factory; no such person is in the Dictionary of Canadian Biography, and the
documents under his name were quoted journals and letters of 1715-17 that cannot exist. He is not
the real Richard Stuart (PhD, LSE; Parks Canada historian, Dawson historian 1976-84, died 2005),
whom the owner had in mind for a moment; the two are unrelated and the deletion stands. Backups:
`2026-10-18-delete-richard-stuart-before.json` and `...-documents-before.json`.

**Audit finding, awaiting the owner.** The same check found 44 other primary-source documents from
the original seed data that carry quoted transcriptions nobody has checked. Some are plausibly
adapted from real texts (Mackenzie's rock inscription of 22 July 1793; Cartier's cross at Gaspé;
Hearne at the Coppermine). Others cannot be real as written: "Letter from Matonabbee to Samuel
Hearne, 1772", "York Factory Trade Record, 1780" with an exact count of 34,567 pelts, Moses
Norton's "journal" of 1762, La Pérouse's "letter to the minister" in invented wording, and the three
"William Stuart" and three "Philip Turnor" pieces. The owner's standing rule is no quoted
transcription unless checked. Recommended: strip the transcription text from all 44, keep each
document as a sourced pointer, and restore a quotation only where it can be checked against a
published edition. The list is in the audit output of 2026-10-18 and will be attached to the pass
that acts on it.

**Header images, done (passes 8 and 10).** Every card now has an image. Pass 8
(`2026-10-18-sweep-8-people-header-images.ts`): the 81 explorers and 29 figures without a lifetime
likeness carry as header the primary image of the waterway they are most tied to (the earliest-dated
link for an explorer, the first associated waterway for a figure), two set by hand (François de La
Vérendrye: Lake of the Woods; Saukamappee: Bow River); these are landscapes, maps and posts, never a
person, so nothing reads as a portrait. Pass 10 (`2026-10-18-sweep-10-header-images.ts`): a second
Commons search at a lower size threshold found period images for eight locations (Everette's 1884
drawing of Fort Reliance, the 1820 view of the Île-à-la-Crosse forts, Pike's 1896 Frances River, the
Smith River falls at Fort Halkett's site, the Mounted Police post at Forty Mile for Fort Constantine,
a nineteenth-century painting of Cartier at Stadacona, the Richmond Gulf satellite view, the map of
the Saskatchewan posts for Hudson House) and a historical view of Fort McLeod for McLeod Lake; Fort
Confidence, Victory Point, South Branch House and Mackenzie Rock take their own waterway's image, and
the Savanne River and Lac des Mille Lacs, which have no photograph on Commons, take the Seine River's,
the river that drains the lake. After: 0 waterways, 0 locations, 0 explorers, 0 figures without an image.

**Video, done (pass 9).** `2026-10-18-sweep-9-videos.ts`. Approved channels: Parks Canada / Parcs
Canada, Historica Canada (Heritage Minutes), the Canadian Encyclopedia, provincial and territorial
archives. First the 69 waterways with a video from the original seed data were checked against
YouTube's own record of each video (title and channel): not one was from an approved channel (travel
vlogs, "FactSpark", "Amazing Planet", Manitoba Hydro, a Reindeer Lake fishing film attached to the
Coppermine, a "Sucker fishing" clip on the Atikokan), and eleven no longer existed; all were removed,
with a backup, except the one Parks Canada video on Terror Bay. Then 31 videos were added from a
YouTube search of each waterway's historic sites, kept only where the channel is approved and the
subject is the waterway's history, and each confirmed from its metadata before it was written: the
Heritage Minutes on Cartier (Gaspé), Cabot (Cabot Strait, Bonavista Bay), Frontenac (Lake Ontario),
Nicollet (Lake Michigan, Fox River), Sam Steele (Yukon), Laura Secord (Niagara), the Grosse Île
Orphans (St. Lawrence), Treaty 9 (James Bay) and the Acadian Deportation (Minas Basin); Parks Canada
on Red Bay, the Klondike sites, the Chilkoot, Fort Langley, Kluane, Batoche, the York boats of Lower
Fort Garry, Fort St. James, Rocky Mountain House, Fort Chambly, the Erebus wreck, Castle Hill, the
Sault canal, the Rideau Canal, Fort Malden, Mingan, the Gulf Islands clam garden and Fort Rodd Hill;
and Historica's fur-trade summary on Lake Superior. After pass 9: 32 waterways with a video, 160 without.

**Correction (pass 11, `2026-10-18-sweep-11-restore-videos-strip-transcriptions.ts`).** Pass 9 read
the owner's channel list too narrowly. The owner's rule, restated the same day: YouTube at large is
acceptable, the expanded list is in addition, and videos are not to be scrubbed for being off that list
(Bloody Falls on the Coppermine was the example). Every video pass 9 removed was restored from its
backup except the eleven that YouTube no longer serves, placed after the approved-channel video where
one was added. After: 82 waterways with a video, 110 without. Nature and promotional videos from the
approved channels were still passed over as not about the waterway's history.

**Documents, decided.** The owner has read the 44 seed documents with unchecked quoted transcriptions
and wants them kept as sourced pointers, which they are: pass 11 set their `transcription` and
`originalText` to null and left title, author, date, context, vocabulary and questions in place. A
quotation goes back only when it has been checked against a published edition. 173 documents remain;
none now carries an unchecked quotation.

### 9.16 Passes 12 to 14 (applied 2026-10-18): held-back sites, checked quotations, names from records

Worked in the order the owner approved: Indigenous names from provincial and nation records, the six
archaeological sites held back in pass 5, explorer visits for the explorer-less waterways, and checked
quotations back into the documents. Data only; no build needed.

**Pass 12, the six held-back sites** (`2026-10-18-sweep-12-discoveries-held-back.ts`). Pass 5 held
these back because their dates and names could not be confirmed in the Wikipedia articles. Each is now
confirmed from a better source and inserted with it: Debert Palaeo-Indian Site, 1948 (Canadian
Encyclopedia; MacDonald 1968), Agawa Rock Pictographs, 1958 (Canadian Encyclopedia; Dewdney and Kidd
1962), Norse artifacts on Skraeling Island, 1978 (Schledermann, Arctic 1980), Namu, 1969 (Simon Fraser
University archaeology press; the 2011 reburial), Yuquot excavations, 1966 (Dewhirst, Parks Canada
1980; Ha-Shilth-Sa 2018), Fort Vancouver excavations, 1947 (U.S. National Park Service administrative
history; Caywood 1955). After: 32 discoveries on 28 waterways.

**Pass 13, checked quotations** (`2026-10-18-sweep-13-checked-quotations.ts`). Three of the 44
stripped documents get their quotation back, each read in the full text of the edition on the Internet
Archive, with a line in `historicalContext` naming the edition: Mackenzie's inscription from *Voyages
from Montreal* (1801), the full sentence with the memorial in Mackenzie's own words ("the twenty-second
of July, one thousand seven hundred and ninety-three"; the seed's "22d July 1793" is the monument's
abbreviation); Cartier's cross at Gaspé from Biggar's 1924 edition, English with Biggar's bracketed
insertions and the French text as `originalText`, the chief unnamed as in the narrative; Hearne at the
Coppermine from the Champlain Society edition of 1911, whose sentences (one hundred and eighty yards
wide, three falls in sight, the mine "an entire jumble of rocks and gravel", one piece of copper
"above four pounds") replace a seed passage ("thirty yards wide", "several pieces of ore") that is not
in the published *Journey*. The other 41 stay as pointers until each is checked. Also links Jacques de
Noyon to the Savanne River, 1688: his Kaministiquia route (DCB) runs from Dog Lake over the height of
land and down the Savanne to Lac des Mille Lacs, and he was already linked to every other waterway on it.

**Pass 14, Indigenous names from records** (`2026-10-18-sweep-14-indigenous-names-records.ts`). All 66
waterways and 100 locations still without a name were looked up in the Canadian Geographical Names
Database (official names with a language code, by feature), BC Geographical Names (with origin notes),
the Commission de toponymie du Québec (its "variante traditionnelle autochtone" records), and Wikidata's
native-label statements as leads; then, where those gave nothing, in nation sources. Fourteen names were
found and set, each citing its record: Eastmain River, Iismeniiu-siipii (Cree; Commission de toponymie);
Prince of Wales Strait, Ikirahak (Inuinnaqtun; official, NWT 2006); Naskaupi River, Meshikamau-shipu
(Innu-aimun; official, Newfoundland and Labrador 2015); Okanagan Lake, kɬúsx̌nítkʷ (Nsyilxcən; syilx
sources, BC names records the language); Humber River and Beothuk Lake, Maqtukwek and Mekwe'jite'wey
(Mi'kmaq; Qalipu First Nation's Ktaqmkuk handbook); Miramichi River, Listuguji'j (Mi'kmaq; the
Mi'gmaq-Mi'kmaq Online dictionary, Listuguj); Restigouche River, Listuguj (Mi'kmaq origin per the
federal and Quebec records); Rainy River, Manidoo Ziibi (Anishinaabemowin; Rainy River First Nations
usage); and the locations Fort McLoughlin, Q̓ḷc (Heiltsuk, from the Heiltsuk Nation's 2025 submission to
BC names), Fort Stikine, Ḵaachx̱an.áakʼw (Tlingit; Sealaska), Trois-Rivières, Mad8baloden (Abenaki;
Commission de toponymie), Placentia, Plisantek (Mi'kmaq; Ktaqmkuk handbook), Lapierre House, Zheh
Gwatsal (Gwich'in; Yukon alternate official name 2018). Official English names that are themselves
Indigenous words (Tagish Lake, Winnipegosis, Clayoquot, Nootka, Stikine, Bella Coola) were not copied
into the field. After: 57 waterways and 95 locations without an Indigenous name; these have no recorded
name in any of the sources above (the Arctic straits and sounds, most fur-trade posts, the United States
rows) and stay null rather than invented. Pass 14 also adds three explorer links from the DCB: Peter
Skene Ogden at the Nass, 1831 (Fort Nass, later Fort Simpson); Pierre Du Gua de Monts and Samuel de
Champlain at Chignecto, June 1604. Eleven waterways remain without an explorer (Lesser Slave Lake,
Atikokan, Sitka Sound, Skeena, Winisk, Nottaway, Harricana, La Grande, Teslin, Kluane, Atlin): the DCB
biographies checked (Thompson, Bell, Constantine, Schwatka) do not place an explorer in the database on
them, and no link is added without a source.

### 9.17 Pass 15 (applied 2026-10-19): checked quotations back into 24 more documents

The owner asked for the 41 remaining stripped documents to be worked through. Each was looked for in a
published edition on the Internet Archive, or in the Dictionary of Canadian Biography where it prints
the archival sentence; 24 were found and restored by `2026-10-19-sweep-15-checked-quotations-2.ts`,
each with a line in `historicalContext` naming the edition and saying what, if anything, of the seed
wording was not in it. Only text read in the edition went into `transcription`; omitted stretches are
marked, the editions' brackets kept, and OCR line-breaks joined.

**Restored from the editions.** Mackenzie's departure from Fort Fork, 9 May 1793, and the wreck of
the canoe on 13 June 1793 (*Voyages from Montreal*, 1801); Hearne's report of Matonabbee's words on
women and travel, October 1770, and Norton's orders for the third journey of 7 December 1770, printed
in full (*Journey*, Champlain Society 1911); Thompson's Narrative for 4-5 July 1811 on the Columbia and
Saukamappee's account (Champlain Society 1916); Fraser above Spuzzum, June 1808 (Masson, *Les
Bourgeois*, 1889); Champlain's arrival at Quebec and the building of the habitation, 1608, the Place
Royale description of 1611 with its French, and the 1618 memorial to the King with its French
(Biggar, *Works*, vol. II); Cartier at Hochelaga and the scurvy winter with the Louvain sentence in
French (Biggar 1924); La Salle's act of possession, 9 April 1682 (French, *Historical Collections of
Louisiana*, 1846); Joutel on the murder of La Salle, March 1687 (1714 translation, Stiles 1906); Rae's
Repulse Bay letter of 29 July 1854; Back at the mouth of the Thlew-ee-choh and the Fort Reliance winter
(*Narrative*, 1836); Tyrrell's journal extract for 30 July 1893 among the caribou at Carey Lake (GSC
1897) and his Red Deer River bone-bed sentences (GSC 1887). **Restored from the DCB's printed
archival sentences:** Knight on Thanadelthur, Stuart's note of October 1715, Fidler's "sole motive"
sentence of 1790-91, Turnor on Mackenzie and on Fort Chipewyan, and the Company's 1778 engagement of
Turnor.

**Corrections made on the way.** Six seed titles or authors were wrong and are corrected, with the
reason in `historicalContext`: Saukamappee's account was told to David Thompson in the winter of
1787-88, not to Fidler in 1792-93 (author, date and explorer link changed); the 1778 instructions
ran from the Company to Turnor, not the reverse; Stuart kept no journal, but his October 1715 note
survives in Knight's journal; Thompson's Columbia descent is July 1811, not June field notes;
Champlain called the Montreal site Place Royale, not Hochelaga; the Red Deer bone beds are described
in Tyrrell's 1887 report, which does not mention the skull. Knight's sentence on Thanadelthur was
written at her death in February 1717, not 1715. Seed sentences not in the editions were dropped:
Mackenzie's speech asking for volunteers and his "mutiny"; Hearne's "seven wives" paragraph (though
Hearne does record the seven wives in January 1772); Champlain's dove-cote and his "art of
navigation" opening (which is from the 1632 *Traitté de la marine*, not the 1618 memorial); Cartier's
sleeping platforms; Back's "sixty below" (he records seventy); Tyrrell's 12 July entry and his
first-person skull story.

**Still pointers (17).** No published text could be reached for: the York Factory trade record of
1780 and the "letter from Matonabbee" (neither appears to exist as a document); Thompson on Charlotte
Small (the Narrative does not mention her); the La Salle letter to Frontenac of 1681 (he reached the
mouth in 1682); Tyrrell's 1898 Klondike letter; Back's 1836 letter to the Admiralty; Fidler's Peigan
journal and Red River survey report (unpublished); Turnor's 1792 Churchill report; Norton's 1762
journal and 1768 trade report; Stuart's peace-mission report and trade-customs account (he kept no
journal); La Pérouse's three 1782 reports (his campaign report is in the French naval archives, not
in print on the Archive); and Hearne's own account of the capture, which is not in the *Journey*. The
first four of these describe documents that may not exist. After pass 15: 27 documents with a checked
transcription, 173 documents in all.

**Owner's decision (2026-10-19), applied as pass 16** (`2026-10-19-sweep-16-asterisk-undocumented.ts`):
the four are retained, because what they say is consistent with the documented record and still
elucidating, but marked. Each title now ends with an asterisk (York Factory Trade Record, 1780 *;
Letter from Matonabbee to Samuel Hearne, 1772 *; Letter from La Salle to Governor Frontenac, 1681 *;
David Thompson's References to Charlotte Small, 1799-1811 *) and each `historicalContext` ends with
the line "* No documented source: no record of this document has been found in any archive or
published edition. It is kept as an illustrative text because what it describes is consistent with the
documented history of the people and places involved; it should not be cited as a primary source."
Also on 2026-10-19 the stray `mobile/mobile` folder (an older draft of the archived R2 image migration
script, the cause of the two mobile typecheck errors) was deleted; the mobile typecheck now passes clean.

## 10. Roadmap approved 2026-10-19 (project scope)

The owner asked for an assessment of what would make the app more useful, more engaging, more
valuable to teachers and more valuable as a research tool, and then placed the whole list in scope
("everything you've listed here put into the app"). Items marked *(needs partners or recordings)*
cannot be completed in code alone. Work proceeds in the order of section 10.6; each item ships as
schema (CREATE-only Turso migration), API, client and data, with a spec entry.

### 10.1 More useful
1. **Connections as the backbone of navigation**: "follow this river" (upstream and downstream chains from WaterwayConnection), "who was here in this decade" (ExplorerWaterway by year), "everything about this person" views walkable from any record.
2. **Expedition route layer**: dated routes per expedition drawn along the waterway geometry, with a leg strip; see 10.5. *(top three)*
3. **Search and filter across everything**: one search over names, Indigenous names, nations, companies, years and document text.
4. **Offline packs**: a region's records and images bundled for download.

### 10.2 More engaging
5. **Let the sources speak**: the checked transcriptions as read-aloud cards tied to the exact spot on the map; the voyageur journeys quote them at the right node.
6. **Finish the journeys**: a fur-trade era journey over the 80 posts and a Klondike 1898 journey, with the real choices scored against what happened.
7. **Then-and-now imagery**: period illustrations in the galleries paired with a modern photograph of the same spot.
8. **Audio for pronunciations and vocabulary** *(needs partners or recordings)*: recorded by the nations whose names are cited.

### 10.3 More value for teachers
9. **Curriculum alignment by province**: lesson plans mapped to Ontario, BC, Alberta and Quebec social-studies outcomes, searchable by code.
10. **Primary-source literacy unit**: the seed passage beside the published sentences; what changed and why.
11. **Class tools that close the loop**: class report (who read what, quiz answers by question, journal entries) as CSV or PDF.
12. **Grade-band balance**: K-3 and 4-6 material authored for the band, not filtered down.
13. **Generated printables**: blank maps from the geometry, timeline strips from the events, pronunciation cards.

### 10.4 More value as a research tool
14. **Structured citations on every record, exportable** (BibTeX, RIS, CSV), with stable links to DCB, Internet Archive editions, CGNDB, BC names and Commission de toponymie records; see 10.5. *(top three)*
15. **Cartography gallery**: the maps that made the country, georeferenced over the modern base; see 10.5. *(top three)*
16. **Indigenous contributions as records**: a "knowledge given" record type linking person, explorer, waterway and source.
17. **Open data**: a documented read-only API or periodic export under a clear licence.
18. **Versioning and corrections**: a visible "last checked" date and a per-record changelog.

### 10.5 The top three, UI design (built first)

**Expedition routes.** New tables `Expedition` (explorer, name, start and end year, summary, colour, source) and `ExpeditionLeg` (order, waterway, year, optional location, notes). Map tab: an "Expeditions" chip beside the existing filters opens a sheet listing expeditions grouped by explorer with years; choosing one draws every leg's waterway geometry in the expedition's colour over the base map, numbered leg markers at the leg's location or the waterway's centre, dashed straight segments where consecutive legs share no water, and the camera fits the route. A leg strip along the bottom (year, waterway, note) scrolls with the route; tapping a leg moves the camera and opens that waterway's detail. The explorer's detail shows an "Expeditions" card with "Show on map" per expedition, which opens the map with `expeditionId`. Legs are authored in order from the DCB biography or the published journal, with the source stored on the expedition.

**Structured citations.** New table `Citation` (targetType, targetId, sortOrder, kind: dcb | encyclopedia | edition | archive | place_name_record | parks_canada | book | article | web, author, title, container, publisher, year, pages, url, accessed, note). API: `GET /api/citations/:targetType/:targetId` and `GET /api/citations/export?targetType&targetId&format=bibtex|ris|csv` returning text. Every detail view (waterway and location sheets, explorer modal, notable figure, document, discovery) gains a "Sources" card listing citations as tappable rows (kind badge, author, title, year, container) that open the link, with "Copy citation" per row and "Export sources" for the record (share sheet with BibTeX). A "Cite this record" row generates the citation for the app's own record. Citations are seeded from the sources already on the records: the DCB, Encyclopedia, Parks Canada and Internet Archive links in the 2,000 reading guides, the `sources` text on the 32 discoveries, the "checked against" lines on the 27 documents, the Indigenous-name records of passes 3 and 14, and the place-name authority records; new content adds them at authoring time.

**Cartography gallery.** New table `HistoricalMap` (title, cartographer name and optional cartographer link, year, description, what it shows and what it got wrong, image URL and credit and licence, source URL, region, optional overlay bounds as SW and NE corners, related waterway and explorer ids, sort order). Discover hub: a "Historic Maps" card opens a gallery (thumbnail, cartographer, year, region; filters by century and region); a map's page shows the image full-screen and zoomable, the description, the cartographer's biography, related waterways and explorers as links, and the sources; "View on the map" overlays the image on the live map at its bounds with an opacity slider, so Pond's Athabasca can be seen beside the modern lake. Indigenous-made maps (Ac ko mok ki's map for Fidler 1801, the Chipewyan map for Hearne, Inuit charts for Parry and Ross) are first-class entries with the mapmaker named.

### 10.7 Delivered 2026-10-19 (build required for the app side)

**Navigation.** The back button names the tab a screen was opened from (Map, Explorers, Quizzes,
Discover, Admin) instead of "(tabs)": the root stack's "(tabs)" screen takes its title from the last
tab segment seen. The Learn tab is renamed Discover (Découvrir) and the hub's "Discovery" section
becomes "Near You".

**Citations (item 14).** `Citation` table (`2026-10-19-citations.sql`), `GET /api/citations/:targetType/:targetId`
(sources formatted as text, with BibTeX, RIS and plain-text exports and the citation for the app's own
record) and `/export?format=` as a downloadable file. Seed (`2026-10-19-citations-seed.ts`): 724 citations
across 567 records, derived only from sources already on the records: the DCB, Encyclopedia, Parks
Canada, Internet Archive and other authority links in the reading guides (Wikipedia guides excluded on
purpose), the "checked against" editions on the 27 documents, the discovery sources, and the place-name
records behind the Indigenous names. In the app a **Sources** card appears on waterway and location
sheets, the explorer modal, notable figures, documents and historic maps: kind badge, author, title,
container, year, note; tap opens the link, long press copies the reference, export shares BibTeX, RIS
or text, and "Cite this record" gives the citation for the app's own entry.

**Expedition routes (item 2).** `Expedition` and `ExpeditionLeg` tables (`2026-10-19-expeditions.sql`),
`GET /api/expeditions` and `/:id`, and `expeditions` on the explorer detail. Seed
(`2026-10-19-expeditions-seed.ts`): 18 journeys, 85 legs, 14 explorers (Mackenzie 1789 and 1793,
Fraser 1808, Hearne 1770-72, Franklin 1819-22 and 1825-27, Back 1833-35, Rae 1846-47 and 1853-54,
Cartier 1534 and 1535-36, La Vérendrye 1731-38, Kelsey 1690-92, Henday 1754-55, Pond 1778-79, Hudson
1610-11, Thompson 1807-11, Champlain 1615-16), each leg ordered from the DCB article or published
journal named on the expedition and carrying its own note; waters the party crossed that the database
lacks are left out rather than approximated. In the app: an **Expeditions** section in the map's filter
menu grouped by explorer; choosing one draws every leg's waterway geometry from the overview dataset in
the expedition's colour, dashed connectors between consecutive legs, numbered leg markers at the leg's
historic place or the water's centre, and a strip of leg chips (number, place or water, year) that move
the camera and preview the water; the camera fits the whole route once. The explorer modal gains an
**Expeditions** card with the summary, leg count, source and "Show on map" (`/?expeditionId=`).

**Cartography gallery (item 15).** `HistoricalMap` table (`2026-10-19-historical-maps.sql`),
`GET /api/historical-maps` and `/:id` (bounds, related waterways and explorers, cartographer,
citations). In the app: a **Historic Maps** card on the Discover hub; a gallery filtered by century and
region with an "On the map" badge for georeferenced maps; a map's page with the image pinch-zoomable,
what it shows, what it got wrong, the mapmaker, related waterways (tap to open on the map) and
explorers, where the copy comes from, and the Sources card; and **View on the map**, which lays the
image over the live map at its south-west and north-east corners (`/?mapOverlayId=`) with an opacity
control (30, 50, 70, 100 percent) and an About link back to the page. The seed of maps is recorded in
10.8 as it lands.

### 10.8 Cartography gallery seed (applied 2026-10-19)

`2026-10-19-historical-maps-seed.ts`: sixteen maps, each image found on Wikimedia Commons with its
licence and author taken from the file record, and each examined at 1600 pixels before its
description was written, so that "what it shows" and "what it got wrong" name only features read on
the sheet or stated in the DCB article cited on the record. Oldest first: the Harleian mappemonde
(c. 1544, Dieppe school); Champlain's Carte de la Nouvelle France (1632, in the 1850 Albany
facsimile, so marked); Sanson's Le Canada ou Nouvelle France (1656, the first printed map with all
five Great Lakes, Superior and Michigan open at their western ends); Bressani's Jesuit map (1657,
halftone reproduction, so marked); Jaillot's Partie de la Nouvelle France (1685, the posts against
the Hudson Bay trade); Coronelli's Partie occidentale (1688, with the Marquette-Jolliet and La Salle
notes) and La Louisiana (1696); Lahontan's Rivière Longue (1703, the invented river, with the
Gnacsitares' deerskin map); Delisle's Carte du Canada (1703, carrying Lahontan's river with a caveat);
Bellin's Carte de la Baye de Hudson (1744, with the posts named and "cette partie n'est pas connue"
on the east coast); Mitchell (1755); Pond's Hudson's Bay's Country (1785, in Kohl's copy, the river
from Slave Lake to a "Mer du Nord West"); Arrowsmith's Map Exhibiting all the New Discoveries (1795,
later state); Mackenzie's track map (1801, the Tacoutche Tesse carried to the sea as the Columbia);
Thompson's Map of the North-West Territory (1814, Archives of Ontario sheet); and Franklin's route
map of 1819-20 (1823). Two carry approximate overlay bounds read from their printed graticules
(Bellin 1744, converted from the Paris meridian; Franklin 1823, from Greenwich); the rest display as
images. Four are linked to cartographer rows (Champlain, Bellin, Arrowsmith, Thompson); every map
carries its related waterways and explorers and one or more citations (BnF Gallica, Library of
Congress, Archives of Ontario, NYPL, JCB, DCB). Not found on Commons at usable size, to be added as
copies are located: Hearne's 1795 map, Ac ko mok ki's 1801 map for Fidler (HBCA), Auchagah's map for
La Vérendrye, Iligliuk's chart for Parry, Franquelin 1688 (only a 942-pixel copy), Dawson 1887.

### 10.9 Connections as the backbone of navigation (item 1, delivered 2026-10-19; build required)

No new tables: every view reads the links the records already carry. Three views, each reachable
from the records it concerns.

**Follow the Water.** `GET /api/waterways/:id/system` walks `WaterwayConnection` from the viewed
water: the downstream chain (`flows_into` forward and `outlet_of` reversed; the data has no water
with two outlets and no cycles, so the chain is a list, longest Dog River → Dog Lake →
Kaministiquia → Superior → Huron → Detroit → Erie → Niagara → Ontario → St. Lawrence → Gulf), the
tributaries as a depth-first tree, the body it is part of, its arms and reaches, and the waters a
strait joins it to, each with the connection note, the number of explorers linked to it and their
earliest year. In the app the waterway sheet's flat "Connected Waterways" list is replaced by a
**Follow the Water** card: the viewed water, then "flows into" steps to the sea; "Fed by" with
tributaries indented by depth; Part of, Arms and reaches, Joined to. Every row opens that water on
the map, and **Show the whole system on the map** (`/?systemId=`) draws every water of the system
over the base map in one colour, the viewed water heavier, with a strip of chips that fly to each.

**Who Was Here When.** `GET /api/decades` lists every decade the database dates something to with
counts; `GET /api/decades/:decade` returns the explorers on the water (grouped, with each water and
year from `ExplorerWaterway.yearExplored`), the expeditions underway, the posts and places founded
(`Location.yearEstablished`), the timeline events and the documents written (`originalYear`). In the
app: a **Who Was Here When** card on the Discover hub opens the list of decades (47, 1000s to 1920s)
under their centuries; a decade's page has arrows and a chip strip to its neighbours, "Show this
decade on the map" (`/?decade=`, the visited waters drawn with the explorers' names on the chips),
and sections On the water (explorer rows open the person view, water chips open the map), Journeys
underway (Show on map), Posts and places founded, What happened and Written in this decade, each a
link. The decade is reachable from any dated record: the year badges on the waterway and location
sheets, the explored years in the explorer view, and a "Who else was here in the 1790s" link under a
timeline event.

**Everything about this person.** `GET /api/explorers/:id` now also returns the documents the
explorer wrote (`PrimarySourceDocument.explorerId`), timeline and "what happened here" events
(`explorerId`), archaeological discoveries (`relatedExplorerName`, matched after dropping honorifics),
the notable figures whose `associatedExplorers` name them (with the stored relationship), the
historic maps that cite them and the deep dives that list them (`relatedExplorerIds` or a key
figure). The explorer view gains Events, Documents, People Connected, Maps, Archaeological
Discoveries and Deep Dives sections, every row a link; its waterway rows now open the water on the
map and its years open the decade. Franklin's view, for example, now walks to two documents, six
events, three discoveries, Akaitcho, Lady Jane Franklin and the 1823 route map.

### 10.10 Search across everything (item 3, delivered 2026-10-19; build required)

`GET /api/search?q=&types=&limit=` (`backend/src/lib/search.ts`). The searchable corpus is about
1,800 rows, so it is read from Turso into one in-memory index (rebuilt every ten minutes) and
searched there: waterways (name, Indigenous name and language, region, description, significance,
fur-trade company and notes, and the explorers and years linked to them), places, explorers,
notable figures (with alternate names), published documents including their transcription,
original text and context, timeline and "what happened here" events, deep dives (with their key
figures), field trips, historic maps, Indigenous words and pronunciations, expeditions,
discoveries, quizzes and stories. Matching is accent-insensitive (verendrye finds La Vérendrye;
nehiyaw finds nēhiyawēwin), ranked (an exact name, then a name that starts with the query, then a
word in the name, then every term among the names, then the phrase or every term in the body), and
a 3- or 4-digit query also matches every record dated to that year and offers the decade view.
Body matches carry a snippet cut around the first match. In the app a **Search** screen (search
bar on the Discover hub, magnifier on the map) debounces typing, shows type chips with counts to
narrow the results, groups hits by type in rank order, and opens each hit in its record: waters
and places on the map, explorers in the person view, figures, documents, deep dives, field trips,
maps, quizzes and stories on their pages, expeditions drawn on the map, events at their place,
years in the decade view, words and pronunciations in their guides. No new tables.

**Expedition camera fix (same batch).** Tapping an expedition leg flew the camera to the leg and
then, because the leg's water was previewed, the zoom-to-extent animation flew it again to the
whole water, so a Mackenzie leg zoomed in and straight back out across the country. The leg tap
(and a highlight chip) now marks the extent as already shown, so the camera stays on the leg.

### 10.6 Order of work
10.5's three features first (citations, then expedition routes, then the cartography gallery, because routes and maps both cite); then 1, 3, 5, 16, 18, 6, 7, 9, 10, 11, 13, 12, 17, 4; item 8 when recordings exist.

### 9.4 Document grade bands (approved and applied 2026-10-17)
Proposed from a Flesch-Kincaid estimate of each transcription (≤ 7 → 4-6, ≤ 11 → 7-9, above →
10-12), checked against the fourteen documents that already had a band (their estimates run
4.4 to 10.9 for 7-9 and 5.6 to 9.3 for 4-6). Result: 5 at 4-6 (Champlain's founding of Quebec
and his Hochelaga description, Cartier on scurvy, Joutel on La Salle's last expedition, Fidler
with the Peigan), 19 at 7-9, 10 at 10-12 (La Salle's Louisiana claim, Tyrrell's bone beds,
Back's three, Turnor's instructions, Norton's instructions and trade report, Stuart's peace
mission report, La Pérouse's attack account). The full list is in the script's `GRADES` map.
