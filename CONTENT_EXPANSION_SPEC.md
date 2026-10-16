# Content Expansion Specification

Prepared 2026-10-16 from a full parse of the mobile app (every screen under `mobile/src/app`),
every API route the app calls, the backend route handlers, and the live Turso data. Every
number below was read from Turso on that date; nothing is inferred from the schema alone.

Purpose: define what a *complete* addition of each content type is, where it surfaces in the
app, what it must link to, and what has to be fixed before new content is added.

---

## 1. Every surface in the app and the data behind it

### Student side

| Surface | Screen | Data read | Filters / gating |
|---|---|---|---|
| Home map, river layer | Map tab | `generated/river-overview.json` built from `Waterway.kmlData` (type River only) | three zoom tiers |
| Pins | Map tab | `Waterway` (lat/lng, type), `Location` (lat/lng, locationType) | legend type; waterway; explorer (via `ExplorerWaterway`); **era** (via `Location.yearEstablished` → the waterways that have locations established in the era) |
| Selected trace | Map tab | `GET /waterways/:id/geometry` from `kmlData` | five tiers by zoom, viewport-clipped |
| Preview card | Map tab | `Waterway`/`Location` name, type, Indigenous name | |
| Detail sheet, waterway | DetailBottomSheet | `Waterway` + `type`, `explorers[]` (+ `yearExplored`, `expeditionNotes`), `furTradeInfo`, `locations[]`, `discoveries[]`, `notableFigures[]` (matched by **name string** in `NotableFigure.associatedLocations`), gallery, video, user contributions | |
| Detail sheet, location | DetailBottomSheet | `Location` + `waterway`, `cartographer`, notable figures (name match), gallery, contributions | |
| Explorers tab | two.tsx | `Explorer` list sorted by surname: name, nationality, portrait; modal: biography, notable achievements, `waterways[]` explored | none |
| Quizzes tab | quizzes.tsx | `Quiz` (+ `questions`) | grade band, category |
| Deep Dives | lessons/ | `LessonPlan` student fields: title, description, gradeLevel, topic, heroImageUrl, narrativeContent, images[], keyFigures[] (→ `Explorer` by `explorerId`), timeline[] (→ `TimelineEvent` by `eventId`), readingTimeMinutes | grade band |
| Timeline | timeline.tsx | `TimelineEvent`: year/month/day/endYear, theme, importance, links to explorer/waterway/location | theme |
| Field Trips | field-trips/ | `VirtualFieldTrip` + `FieldTripStop` (coords, image, funFact, thinkQuestion) | grade band, theme |
| Documents | documents/ | `PrimarySourceDocument`: original text, transcription, annotations, context, vocabulary, discussion questions, image | type, **grade band** |
| What Happened Here | nearby-history.tsx | `HistoricalEvent` by GPS radius: coords, year, category, description | category, radius |
| Notable Figures | notable-figures/ | `NotableFigure`: all fields incl. achievements, associated explorers/locations, active period, featured | figureType, nation |
| Indigenous Languages | indigenous-languages.tsx | `IndigenousWord` (by language, category), `WordOfTheDay`, `VocabularyQuiz`, `IndigenousStory` | language; story grade band |
| Compare | comparisons/ | `ComparisonTemplate`; **generated** comparisons from `Explorer` (name, birth/death years) and `Location` (name, type, yearEstablished, historicalNotes) | type, grade band |
| Pronunciations | pronunciations.tsx | `PronunciationGuide`: term, phonetic, audio, meaning | language, termType |
| Printables | printables/ | `PrintableResource`: content HTML or file, teacher notes, answer key | type, topic, grade band |
| Voyageur Journeys | voyageur-journey/ | `VoyageurJourney` + `JourneyNode` (story/choice/ending, coords, challenge) | grade band |
| Achievements | achievements.tsx | `Achievement` (criteria types: waterways_explored, locations_visited, quizzes_completed, field_trips_completed, journal_entries, pronunciations_learned, documents_read, total_points, daily_streak), `DailyChallenge`, ranks | |
| My Class / My Journal / My Maps | — | user data; assignments reference `Quiz`, `LessonPlan`, `VirtualFieldTrip` | |

### Teacher side

| Surface | Data read |
|---|---|
| Lesson Plans | `LessonPlan` **teacher layer**: objectives, materials, activities, curriculumConnections, discussionQuestions, assessment, estimatedMinutes. Same table as Deep Dives; the student narrative and the teacher plan are two faces of one record. |
| Deep Dives (teacher view) | narrative + teacherObjectives, teacherActivities, teacherQuestions, teacherNotes, relatedQuizIds |
| Classes, assignments, progress | assignable types: quiz, lesson_plan, field_trip |

### Admin side (what has an editor and what does not)

Editors exist for: lesson plans, quizzes (full question editor), documents, field trips (with stops),
printables, contributions review, image health, KML upload, users and approvals.
Notable figures have API write routes but no screen.
**No admin editor exists** for waterways, locations, explorers, explorer–waterway links, fur trade
records, cartographers, Indigenous nations, timeline events, historical events, words,
pronunciations, stories, vocabulary quizzes, comparisons, voyageur journeys, daily challenges or
achievements. Those are populated by scripts, so the content pipeline (section 5) must cover them.

---

## 2. Live inventory (2026-10-16)

| Table | Rows | Notes |
|---|---|---|
| Waterway | 70 | 66 with KML; types River 29, Lake 12, Bay 15, Strait 6, Sound 4, Inlet 3, plus one stray type "lake" |
| Location | 100 | all with images; 52 forts, 16 trading posts, 14 portages, 9 cultural sites, 5 settlements, 3 "historic_site", 1 "fort" |
| Explorer | 92 | 22 without portrait; **50 with no waterway link** |
| ExplorerWaterway | — | the explorer filter on the map and "Waterways Explored" depend on it |
| FurTradeInfo | 21 | |
| Cartographer | 11 | Jolliet and Bellin duplicated |
| IndigenousNation | 14 | **every one of the 7 nations exists twice** |
| NotableFigure | 18 | 6 Indigenous leaders, 5 women, 3 Métis leaders, 1 guide, 1 interpreter, 1 trader, 1 voyageur |
| ArchaeologicalDiscovery | 8 | |
| LessonPlan (Deep Dive + Lesson Plan) | 26 | K-3 6, 4-6 7, 7-9 7, 10-12 6; topics: Fur Trade 12, Indigenous Routes 4, Métis History 3, Cartography 2, Maritime Discovery 2, Early Explorers 1, Geography 1, Women in History 1 |
| VirtualFieldTrip | 6 | 6 stops each; 4-6 ×4, 7-9 ×2; no K-3, no 10-12 |
| Quiz | 13 | **6 are exact duplicates**; one has a single question; categories Explorers, Fur Trade, Geography, Indigenous Heritage, Maritime History |
| PrimarySourceDocument | 48 | **34 have no grade level** and so escape grade gating |
| TimelineEvent | 23 | 1613–1885; themes exploration 10, fur_trade 6, settlement 5, indigenous 2 |
| HistoricalEvent | 48 | exploration 24, fur_trade 9, battle 6, settlement 4, indigenous 3, treaty 2 |
| IndigenousWord | 298 | Cree 83, Ojibwe 58, Inuktitut 45, Dene 34, Blackfoot 30, Mohawk 22, Mi'kmaq 19, Iroquois 5, two combined labels |
| PronunciationGuide | 33 | |
| IndigenousStory | 3 | Cree, Ojibwe, Inuit |
| VocabularyQuiz | 4 | |
| ComparisonTemplate | 4 | |
| PrintableResource | 8 | |
| VoyageurJourney | 2 | 11 and 12 nodes |
| DailyChallenge | 30 | rotated daily since PR #19 |
| Achievement | 28 | |

### Relationship fill rates: the links the templates provide are mostly empty

| Link | Filled |
|---|---|
| LessonPlan related waterway/explorer/location/quiz ids | **0 of 26** |
| QuizQuestion source link (sourceType/sourceId) | **0 of 71** |
| FieldTripStop → location or waterway | **0 of 36** (stops carry raw coordinates only) |
| IndigenousWord → waterway or location | **0 of 298** |
| PronunciationGuide → waterway/location/nation/explorer | **0 of 33** |
| TimelineEvent → explorer/waterway/location | 6 of 23 |
| HistoricalEvent → explorer/waterway/location | 2 of 48 |
| Location → cartographer | 1 of 100 |
| Explorer → at least one waterway | 42 of 92 |
| NotableFigure → waterway | by **string match** on the waterway's name inside `associatedLocations` (fragile; a rename breaks it) |

This is the most important finding. The app has the columns to inter-relate everything, and the
screens render those relations when present, but the existing content was authored without them.
New content must fill them, and existing content should be back-filled in the same pass, or the
new material will be more connected than the old.

### Integrity and consistency defects to fix first

1. Duplicates: all 7 `IndigenousNation` rows twice; `Cartographer` Jolliet and Bellin twice; 6 of 13 quizzes twice; the quiz "Explorers of Canada" has one question.
2. `PrimarySourceDocument.gradeLevel` null on 34 of 48.
3. Waterway "Mackenzie River (Ontario)": no KML, no image, no links. Waterway type "lake" (lower case) alongside "Lake".
4. `Location.locationType` mixes "Fort"/"fort" and "Cultural Site"/"historic_site".
5. `Explorer.nationality` is free text with 37 variants ("Scottish", "Scottish (Orkney)", "Scottish/Canadian"); the Explorers tab prints it verbatim.
6. The `Explorer` table holds people who are not explorers and who also exist as `NotableFigure`: Akaitcho, Crowfoot, Big Bear, Poundmaker, Louis Riel, Gabriel Dumont, Thanadelthur, Charlotte Small, Cuthbert Grant, Matonabbee, Marie-Anne Gaboury, Jean-Baptiste Lagimodière, Shawnadithit, Chief Peguis. One rule is needed for who belongs where; the Explorers tab and the explorer map filter show whatever is in `Explorer`.
7. Location pairs that may be duplicates or may be distinct posts: Fort William / Fort William (NWC); Fort Edmonton / Fort Edmonton (HBC); Fort Churchill / Fort Churchill (HBC); Fort Garry / Fort Garry (Upper). Each needs a decision.
8. Bug: the teacher Lesson Plan screen reads `assessmentSuggestions`, the API sends `assessment`; the Assessment section never renders.
9. `IndigenousWord.language` has two combined labels ("Mohawk/Iroquois", "Seneca/Iroquois") and "Iroquois", a confederacy, as a language (left as is at the owner's instruction).
10. Sacagawea is a notable figure with no Canadian connection (owner's call).

---

## 3. Minimum data set per addition, and its touch points

"Minimum" means the record renders completely on every screen that shows it and participates in
every filter and link the app offers. Optional items are marked.

### Waterway
- `name`, `indigenousName` + `indigenousLanguage` where attested, `description`, `historicalSignificance`, `latitude`/`longitude` (the anchor the KML guard uses), `regionName`, `typeId`.
- `kmlData` from `scripts/export-waterway-kml.ts` (continuity guard; `--with-surface` for wide rivers), then `build-waterway-overview.ts` if type River, then deploy.
- `imageUrl` hero + 3–5 `galleryImages` `{url, caption, credit}`, hosted on R2 under `waterways/<id>/`.
- `FurTradeInfo` (tradingCompany, peakTradePeriod, primaryFurs, tradeRouteNotes) where the river carried trade.
- ≥1 `ExplorerWaterway` (explorerId, yearExplored, expeditionNotes). Drives the explorer map filter and the detail sheet.
- Its forts, posts and portages as `Location` rows (which also drive the **era filter**).
- `PronunciationGuide` for the Indigenous name (termType indigenous_place, waterwayId).
- `IndigenousWord` rows for the name's components with relatedWaterwayId.
- `TimelineEvent` / `HistoricalEvent` for what happened on it, linked by waterwayId.
- `NotableFigure.associatedLocations` must contain the exact waterway name for the figure to appear on it.
- Optional: `videoUrl`, `ArchaeologicalDiscovery`.
- Display-name rule for namesakes: "Red Deer River (Alberta)" style suffix, OSM name kept separately in the export.

### Location
- `name`, `locationType` (one of the canonical set), `latitude`/`longitude`, `yearEstablished` (era filter), `description`, `historicalNotes`, `waterwayId`, `imageUrl` + gallery, `indigenousName` where attested, `cartographerId` where a mapmaker surveyed it.
- Feeds: generated fort comparisons (name, type, yearEstablished, historicalNotes), field trip stops (`locationId`), events (`locationId`).

### Explorer
- `name`, `birthYear`, `deathYear`, `nationality` (from a controlled list), `biography`, `notableAchievements`, `imageUrl` only where a verified likeness exists (David Thompson: none, and he stays).
- ≥1 `ExplorerWaterway`. Without it the explorer is invisible on the map and shows "Waterways Explored" empty.
- `PronunciationGuide` (termType explorer) for hard names; `PrimarySourceDocument` where writings survive; `TimelineEvent`/`HistoricalEvent` with explorerId.
- Feeds generated explorer comparisons (name, years) and Deep Dive key figures (`explorerId`).

### Notable figure
- `name`, `alternateNames`, `nation`, `birthYear`/`deathYear`, `birthPlace`, `figureType` (canonical set), `role`, `biography`, `significance`, `achievements[]`, `associatedExplorers[] {name, relationship}`, `associatedLocations[]` (exact waterway/location names), `activePeriodStart`/`End`, `imageUrl` where attested, `isFeatured`.

### Indigenous nation
- `name`, `alternateNames`, `languageFamily`, `traditionalTerritory`, `culturalNotes`; plus `PronunciationGuide` (termType indigenous_nation, indigenousNationId), words in its language, and a story where one can be told from a published, attributed source.

### Cartographer
- `name`, years, `nationality`, `biography`, `notableMaps`; linked from the locations surveyed.

### Lesson Plan / Deep Dive (one record, two faces)
Student face: `title`, `description`, `gradeLevel`, `topic`, `heroImageUrl`, `narrativeContent` (markdown, ~3,000 characters in the existing set), `images[] {url, caption, credit}`, `keyFigures[] {name, role, years, description, explorerId}`, `timeline[] {year, title, description, eventId}`, `readingTimeMinutes`.
Teacher face: `curriculumConnections[] {subject, strand, expectation}`, `objectives[]`, `estimatedMinutes`, `materials[]`, `introduction`, `mainContent`, `activities[] {title, duration, description}`, `discussionQuestions[]`, `assessment`, `extensions`, `teacherObjectives[]`, `teacherActivities[]`, `teacherQuestions[]`, `teacherNotes`.
Links: `relatedWaterwayIds`, `relatedLocationIds`, `relatedExplorerIds`, `relatedQuizIds` (today 0 of 26 filled). Flags: `isPublished`, `isCore`, `visibility`.
Coverage rule for a new theme: one record per grade band where the subject allows (K-3, 4-6, 7-9, 10-12).

### Virtual field trip
- `title`, `description`, `gradeLevel`, `estimatedMinutes`, `theme`, `coverImageUrl`; 6 stops with `title`, `description`, `latitude`/`longitude`, `imageUrl`, `funFact`, `thinkQuestion`, and `locationId`/`waterwayId` (today 0 of 36 filled). Assignable to classes.

### Quiz
- `title`, `description`, `gradeLevel`, `difficulty`, `category`; 5–8 questions with `options[] {id, text}`, `correctAnswer` id, `explanation`, `points`, `sourceType`/`sourceId` pointing at the waterway, explorer or document the question comes from (today 0 of 71 filled). Assignable.

### Primary source document
- `title`, `documentType`, `author`, `originalDate`/`originalYear`, `originalText`, `transcription`, `annotations[]`, `historicalContext`, `vocabulary[] {word, definition}`, `discussionQuestions[]`, `explorerId`/`waterwayId`/`locationId`, **`gradeLevel`**, `imageUrl` of the manuscript or a period image.

### Timeline event and historical event
- Timeline: `title`, `description`, `year` (+ month/day/endYear/isApproximate), `theme`, `importance`, `iconType`, `imageUrl`, links.
- What Happened Here: `title`, `description`, `latitude`/`longitude`, `locationName`, `year`, `category`, `significance`, `imageUrl`, links. Must have precise coordinates: the screen is GPS-driven.

### Indigenous language content
- Word: `word`, `translation`, `language`, `phonetic`, `meaning`, `culturalContext`, `category` (animal, cultural, geography, greeting, nature, number, trading, waterway, weather), `relatedWaterwayId`/`relatedLocationId`.
- Pronunciation: `term`, `termType`, `language`, `phonetic`, `meaning`, `notes`, link; `audioUrl` where a recording exists.
- Vocabulary quiz: `questions[] {id, word, correctAnswer, options[]}` by language and difficulty.
- Story: `title`, `nation`, `language`, `content`, `summary`, `theme`, `gradeLevel`, `relatedWaterwayId`, attribution in the content.

### Comparison, printable, voyageur journey, daily challenge
- Comparison: `items[]` with parallel attribute keys, `criteria[] {criterion, description}`, `analysisPrompts[]`, `gradeLevel`.
- Printable: `content` HTML (or `fileUrl`), `previewImageUrl`, `teacherNotes`, `answerKey`, `gradeLevel`, `topic`, `resourceType`.
- Journey: nodes with narrative, coords, choices `{id, text, nextNodeId, consequence, pointsChange}`, challenge question/answer, historical fact, endings.
- Daily challenge: question, options, correctAnswer, explanation, category, pointsReward (the pool rotates; new ones extend it).

### Imagery rules
- Sources: Wikimedia Commons public domain or Creative Commons, Library and Archives Canada open licence, HBC Archives where licence allows. Credit recorded on every image.
- People: a portrait only when a verified likeness exists. No likeness is never a reason to exclude a person.
- Hosting: R2 via the existing `image-cdn` module. This session holds Turso credentials but not R2 keys; uploading needs the R2 keys for the session or an authenticated upload route.

---

## 4. Preliminary gap list (to be made exhaustive in the research phase)

Existing and complete already: Souris River, Red Deer River (Alberta), Churchill River (Saskatchewan), Assiniboine, Saskatchewan (main stem), Hayes, Nelson, Peace, Athabasca.

Waterways absent today, each central to the fur trade or exploration story: North Saskatchewan, South Saskatchewan, Bow, Slave, Liard, Winnipeg River, Rainy River and Rainy Lake, Qu'Appelle, Clearwater River with Methye Portage, Sturgeon-Weir, Thompson, Skeena, Stikine, Nass, Kootenay, Richelieu, Niagara, Mattawa and Lake Nipissing, Rupert, Eastmain, Severn, Attawapiskat, Missinaibi, Churchill River (Labrador), Dubawnt and Kazan, Lake Manitoba and Lake Winnipegosis, Cedar Lake, Lake Timiskaming, Pigeon River, Hay River, Beaver River (Alberta), Battle River, Oldman and Belly rivers.

Explorers, traders and officers absent: Peter Skene Ogden, John Stuart, John Rowand, Colin Robertson, Lord Selkirk, Miles Macdonell, Robert Semple, Joseph and Thomas Frobisher, Jens Munk, Pierre de Troyes, Thomas Simpson, Peter Warren Dease, Francis Leopold McClintock, Jane Franklin, Alexander Ross, Gabriel Franchère, Jaco Finlay, James Sinclair, Samuel Black, Jerry Potts, Pierre Falcon.

Indigenous leaders, guides and interpreters absent: Maquinna and Wickaninnish (Nootka Sound), Kwah (Carrier, Fort St. James), Membertou, Donnacona, Kondiaronk, Joseph Brant, Maskepetoon, Piapot, Mikak, Tookoolito and Ebierbing, William Ouligbuck, Demasduit, Nahovway. Women absent: Amelia Douglas, Letitia Hargrave, Frances Simpson, Marie-Rose Delorme Smith.

Teaching resources: no field trip for K-3 or 10-12; no quiz on Métis history, cartography, women, or the Arctic; documents without grade levels; vocabulary with no waterway links; three stories for seven nations; two journeys.

---

## 5. Proposed work plan

1. **Fix first** (section 2 defects): dedupe nations, cartographers, quizzes; set document grade levels; remove the bogus waterway and the stray type; canonicalise locationType and nationality; decide the explorer/notable-figure rule and the duplicate forts; fix the assessment field name. Dry run, backup, apply, verify, as for every data change so far.
2. **Gap analysis document**: every candidate from section 4 and the rest found in research, each with its historical relevance, the records it links to, OSM geometry availability, image or likeness availability with source, and the grade bands it serves. Owner approves scope.
3. **Content pipeline**: one JSON pack per addition validated against section 3 (required fields, canonical taxonomies, link targets that must exist, normalized shapes for activities, curriculum connections, vocabulary and key figures), image fetch with credit and upload to R2, KML export with the guard, overview rebuild, dry run → backup → apply → verify. Back-fill script for the empty links in existing content.
4. **Author in packs** by region and theme, student and teacher resources together, all four grade bands per theme where sensible. Content is server-side and reviewable in the app without a build.
5. **Sources**: Dictionary of Canadian Biography, The Canadian Encyclopedia, Library and Archives Canada, HBC Archives (Archives of Manitoba), Champlain Society editions, Wikimedia Commons for imagery, OpenStreetMap for geometry.
