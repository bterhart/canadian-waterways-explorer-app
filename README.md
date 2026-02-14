# Canadian Interactive Waterways Initiative

An interactive educational map app showcasing Canada's major waterways, their Indigenous heritage, historical explorers, and the fur trade era. Designed for K-12 students.

## Features

### Interactive Map
- **Waterways Display**: Rivers, lakes, bays, and straits across Canada with color-coded markers
- **Historic Locations**: Forts, trading posts, portages, and settlements
- **Indigenous Names**: Original names displayed alongside English names
- **Tap-to-Explore**: Tap any marker to learn more
- **Boundary Highlighting**: When you tap on a river or lake, it highlights the entire waterway boundary like a highlighter on a map
- **Zoom to Fit**: Map automatically zooms to show the full extent of a selected waterway

### Educational Content
- **Chronological Timeline**: Explorer information is displayed chronologically, from earliest (Leif Erikson, c. 1000 AD) to latest (Vilhjalmur Stefansson, 1918)
- **Explorer Profiles**: Detailed biographies of **91 explorers** spanning 1,000 years of exploration, including the complete La Vérendrye family (father and four sons) who opened the western interior
- **Indigenous Heritage**: Learn about the First Nations peoples who have lived along these waterways for thousands of years
- **Fur Trade History**: Discover how waterways shaped the fur trade era, including famous portages like the Great Dog Portage
- **Archaeological Discoveries**: Learn about famous finds like the Franklin expedition ships (HMS Erebus & Terror), Champlain's astrolabe, and the L'Anse aux Meadows Norse settlement

### User Contributions
- **Submit Content**: Users can add photos, descriptions, historical facts, and stories about waterways and locations
- **Community Input**: Approved contributions appear in the detail view for each waterway/location
- **Admin Review**: All submissions go through admin vetting before being published

### Admin Panel & Security (UPDATED)
- **Super-Admin Approval System**: New admins must be approved by super-admin before gaining access
- **Role Hierarchy**: Super-Admin > Admin > Moderator
- **Content Management**:
  - Admins can create lesson plans, field trips, documents, printables
  - Core content (original 25 lessons, 14 documents, etc.) is protected and cannot be edited
  - User-created content starts as private, can request global approval from super-admin
- **JWT Authentication**: Persistent sessions with 15-minute access tokens and 7-day refresh tokens
- **Security Features**: Brute force protection, account lockout, password complexity requirements
- **Test Accounts Available**:
  - Teacher: teacher@canadianwaterways.ca / Teacher123!
  - Admin: admin@canadianwaterways.ca / Admin123!
  - Super-Admin: superadmin@canadianwaterways.ca / SuperAdmin123!

### RCGS Educational Quizzes
- **Quiz Categories**: Explorers, Fur Trade, Maritime History, Indigenous Heritage, Geography, Archaeological Discoveries
- **Grade Levels**: K-3, 4-6, 7-9, 10-12, and All
- **Difficulty Levels**: Easy, Medium, Hard
- **Multiple Choice**: Questions with 4 options and detailed explanations
- **Instant Feedback**: Students see their score and correct answers after completing a quiz
- **6 Sample Quizzes**: Pre-loaded with 36 questions covering Canadian history

### Gamification & Progress System (NEW)
- **Explorer Ranks**: Progress from "Apprentice Voyageur" to "Master Explorer" based on points
- **Achievement Badges**: Earn badges for exploring, learning, and completing activities
- **Daily Challenges**: New question each day with points rewards
- **Streak Tracking**: Build daily streaks to maintain engagement
- **Progress Stats**: Track waterways explored, quizzes completed, documents read, and more

### Indigenous Language Learning Module (NEW)
- **298 Indigenous Words**: Comprehensive vocabulary across multiple First Nations languages
- **8 Languages**: Cree (83 words), Ojibwe (58), Inuktitut (45), Dene (34), Blackfoot (30), Mohawk (22), Mi'kmaq (19), Iroquois/Seneca (7)
- **Word of the Day**: Featured Indigenous word with pronunciation and meaning
- **Phrases & Greetings**: Simple phrases like "My name is..." and common greetings
- **Pronunciation Guides**: Phonetic spellings and cultural context
- **Vocabulary Quizzes**: Test your knowledge of Indigenous words and phrases
- **Traditional Stories**: Stories from Indigenous perspectives about waterways

### Voyageur Journey Simulator (NEW)
- **Choose Your Own Adventure**: Play as a voyageur making decisions on the fur trade routes
- **Two Complete Journeys**: "The Grand Portage Route" (Grade 4-6) and "Race to the Pacific" (Grade 7-9)
- **Historical Decisions**: Choose routes, handle storms, trade with Indigenous guides, portage heavy loads
- **Voyageur Songs**: Experience authentic voyageur songs with lyrics (e.g., "En Roulant Ma Boule")
- **Map Integration**: See your journey progress on the map

### My Maps - Drawing & Annotation Tools (NEW)
- **Custom Maps**: Create your own annotated maps of Canadian waterways
- **Pin Tool**: Add custom pins with titles and descriptions
- **Route Drawing**: Draw routes tracing explorer paths
- **Notes**: Add text notes anywhere on the map
- **Color Customization**: Choose from 8 colors for annotations
- **Share Codes**: Share your maps with classmates
- **Export**: Export map data for reports

### What Happened Here? - Location Feature (NEW)
- **GPS-Based Discovery**: Find historical events near your current location
- **Radius Search**: Search within 5km, 10km, 25km, 50km, or 100km
- **Category Filters**: Filter by exploration, fur trade, Indigenous, settlement, battle, treaty
- **Distance Display**: See how far you are from each historical event
- **Perfect for Field Trips**: Discover history wherever you are in Canada

### Multi-Language Support (NEW)
- **English and French**: Full app available in both official languages
- **Language Settings**: Switch languages in Settings
- **French Immersion Ready**: Perfect for French immersion classrooms

### Notable Figures - Women & Indigenous Leaders (18 profiles - NEW)
- **Unsung Heroes**: Highlighting women and Indigenous leaders crucial to Canadian exploration
- **Women in History**: Charlotte Small (David Thompson's wife), Thanadelthur, Marie-Anne Gaboury, Isabel Gunn
- **Indigenous Leaders**: Matonabbee (guided Samuel Hearne), Saukamappee (hosted Peter Fidler), Akaitcho (guided John Franklin)
- **Guides & Interpreters**: Tattannoeuck (Augustus), Keskarrah, Nattoway
- **Métis Leaders**: Louis Riel, Gabriel Dumont, Cuthbert Grant, Jean-Baptiste Lagimodière
- **Detailed Biographies**: Full stories of their contributions and significance
- **Explorer Connections**: See which explorers they worked with and how they shaped Canadian history

### Pronunciation Guide (33+ entries - NEW)
- **Indigenous Place Names**: Kisiskatchewan, Athabasca, Winnipeg, Manitoba, Assiniboine, Qu'Appelle, etc.
- **Indigenous Nations**: Cree, Ojibwe, Anishinaabe, Dene, Métis, Haudenosaunee, Mi'kmaq, Stó:lō
- **Explorer Names**: La Vérendrye, Radisson, Des Groseilliers
- **Fur Trade Terms**: Voyageur, Pemmican, Coureur des bois, Portage, Canot du maitre, etc.
- **Phonetic Guidance**: Clear pronunciation guides for difficult or unfamiliar terms

### Deep Dives (General Users) / Lesson Plans (Teacher Portal)
- **Deep Dives**: General users see curriculum-aligned content branded as "Deep Dives" with the tagline "Plunge into the Past"
- **Teacher Portal**: Teachers access the same content as "Lesson Plans" with full filtering and classroom assignment features
- **Grade-Specific Content**: Content for all grade levels (K-3, 4-6, 7-9, 10-12)
- **"The Voyageur Life"** (Grade 4-6) - Daily life of voyageurs, canoe routes, pemmican
- **"Louis Riel and the Métis Nation"** (Grade 7-9) - Métis identity, Red River Resistance, Riel's legacy
- **"Women of the Fur Trade"** (Grade 7-9) - Crucial roles of Indigenous and Métis women
- **"Mapping Canada: The Work of David Thompson"** (Grade 10-12) - Surveying techniques
- **"The Hudson's Bay Company"** (Grade 4-6) - HBC history, trading post life
- **Curriculum-Aligned**: Connected to provincial curriculum expectations with learning objectives, activities, and assessments

### Primary Source Documents (48 documents)
Access historical documents with age-appropriate annotations spanning 500+ years of Canadian exploration:

**Early Explorers (1534-1687)**
- **Jacques Cartier** (3 documents): First Contact at Gaspé (1534), Stadacona & Hochelaga (1535), Scurvy & Indigenous Medicine (1536)
- **Samuel de Champlain** (3 documents): Founding of Quebec (1608), St. Lawrence Description (1611), Letter to King of France (1618)
- **René-Robert Cavelier de La Salle** (3 documents): Louisiana Claim (1682), Letter to Frontenac (1681), Joutel's Account of Final Expedition (1687)

**Hudson's Bay Company Era (1715-1814)**
- **William Stuart & Richard Stuart** (6 documents): Journey Inland with Thanadelthur (1715-1716), Peace Mission reports, Trade customs observations
- **Moses Norton** (3 documents): Prince of Wales Fort Journal (1762), Instructions to Hearne (1770), Trade Report (1768)
- **Philip Turnor** (3 documents): Instructions to HBC (1778), Lake Athabasca Survey (1790), Churchill River Report (1792)
- **Peter Fidler** (3 documents): Athabasca Survey (1791), Living with the Peigan (1792-1793), Red River Settlement Survey (1814)
- **Samuel Hearne** (2 documents): Journey to Arctic Ocean (1771), Matonabbee's Leadership account

**Pacific & Overland Explorers (1789-1854)**
- **Alexander Mackenzie** (3 documents): Rock Inscription (1793), Crossing the Rockies (1793), Fort Fork Speech (1793)
- **Simon Fraser** (1 document): Fraser River Canyon (1808)
- **David Thompson** (2 documents): Field Notes (1811), Charlotte Small references
- **Dr. John Rae** (1 document): Franklin Expedition Report (1854)

**Military & Naval (1782)**
- **Comte de La Pérouse** (4 documents): Attack on Prince of Wales Fort (1782), Destruction of York Factory (1782), Letter to French Minister (1782), plus Hearne's account of the French capture

**Scientific Exploration (1834-1898)**
- **Sir George Back** (3 documents): Great Fish River Expedition (1834), Fort Reliance Winter (1833-1834), Letter to Admiralty (1836)
- **Joseph Burr Tyrrell** (3 documents): Barren Lands Expedition (1893), Dinosaur Bone Beds Discovery (1884), Klondike Survey (1898)

**Additional Documents**
- York Factory Trade Record (1780), Letter from Matonabbee (1772), Peter Pond's Map (1785), James Knight on Thanadelthur (1715)

Each document includes original text/transcription, vocabulary definitions, historical context, and discussion questions for classroom use.

### Virtual Field Trips (6 complete tours - NEW)
- **York Factory** - Walk through the HBC's main depot on Hudson Bay (6 stops)
- **Fort William** - Attend a North West Company rendezvous (6 stops)
- **L'Anse aux Meadows** - Explore the Norse settlement from 1000 AD (6 stops)
- **Prince of Wales Fort** - Tour the massive stone fortress (6 stops)
- **Fort Carlton** - Experience the prairie fur trade and Treaty 6 signing site (6 stops)
- **Rocky Mountain House** - Discover David Thompson's base at the gateway to the Rockies (6 stops)

### Printable Resources (8 worksheets - NEW)
- **Blank Map of Canadian Fur Trade Routes** - Students trace routes
- **Timeline Activity** - Place events from 1000 AD to present
- **Vocabulary Builder** - Fur trade terms with definitions
- **Explorer Research Template** - Structured research guide
- **Geography Quiz** - Test knowledge of waterways (with answer key)
- **Indigenous Place Names Worksheet** - Learn meanings and pronunciation
- **Comparing Perspectives** - European vs Indigenous viewpoints
- **Voyageur Songs Activity** - Cross-curricular music and history

All resources include teacher notes and answer keys.

### Comparison Templates (4 templates - NEW)
- Hudson's Bay Company vs North West Company
- European vs Indigenous Perspectives on Land
- River Routes: St. Lawrence vs Hudson Bay
- David Thompson vs Alexander Mackenzie

### Timeline Events (18 major events - NEW)
From HBC Charter (1670) to Louis Riel's execution (1885)

### Map Legend
- Blue - Rivers
- Cyan - Lakes
- Green - Bays
- Red - Forts
- Orange - Trading Posts
- Brown - Portages

## Data Included

### Waterways (70)
**Rivers (28)**: St. Lawrence, Mackenzie, Fraser, Ottawa, Saskatchewan, Churchill, Columbia, Nelson, Hayes, Moose, Albany, Abitibi, Red, Assiniboine, Athabasca, Peace, Yukon, Coppermine, Thelon, Saguenay, Saint John, Kaministiquia, Back River, French River, Seine River, Atikokan River, Souris River, Red Deer River

**Lakes (13)**: Superior, Huron, Ontario, Erie, Michigan, Winnipeg, Athabasca, Great Slave, Great Bear, Reindeer, Nipigon, Lesser Slave, Lake of the Woods

**Bays & Sounds (18)**: Hudson Bay, James Bay, Baie des Chaleurs, Gaspé Bay, Bonavista Bay, Placentia Bay, Nootka Sound, English Bay, Friendly Cove (Yuquot), Queen Charlotte Sound, Lituya Bay, Terror Bay, Mercy Bay, Queen Maud Gulf, Foxe Basin, Baffin Bay, Frobisher Bay, Cumberland Sound, Lancaster Sound, Marble Island

**Straits & Inlets (11)**: Strait of Belle Isle, Juan de Fuca Strait, Georgia Strait, Burrard Inlet, Dean Channel, Davis Strait, Parry Channel, Bellot Strait, Chesterfield Inlet

**Arctic Waterways Added:**
- **Terror Bay** - Where HMS Terror was found (2016)
- **Mercy Bay** - Where HMS Investigator was found on Banks Island
- **Queen Maud Gulf** - Where HMS Erebus was found (2014)
- **Foxe Basin** - Named after Luke Foxe (1631)
- **Davis Strait** - Named after John Davis (1585)
- **Baffin Bay** - Mapped by William Baffin (1616)
- **Lancaster Sound** - Key Northwest Passage entry point
- **Back River** - Named after George Back (1834)

### Historic Locations (99)

**Hudson's Bay Company Posts:**
- Prince of Wales Fort (1717) - Massive stone fortress on Churchill River; Samuel Hearne, James Knight, Moses Norton as factors
- York Factory (1684) - Main HBC depot for nearly 200 years; Henry Kelsey served here
- Fort Churchill (1783) - Successor to Prince of Wales Fort
- Moose Factory (1673) - Oldest English settlement in Ontario
- Fort Albany (1679) - One of original Bay posts
- Norway House (1814) - HBC Northern Department headquarters
- Cumberland House (1774) - First HBC inland post, founded by Samuel Hearne
- Fort Edmonton (1795) - Gateway to Rockies; John Rowand as Chief Factor
- Fort Garry (1822) - Center of Red River Settlement
- Fort Vancouver (1825) - Columbia District HQ; John McLoughlin as Chief Factor
- Fort Victoria (1843) - Pacific headquarters; became BC's capital
- Fort Chipewyan (1788) - Gateway to Mackenzie River system
- Fort Simpson (1804) - Mackenzie District headquarters
- And many more...

**North West Company Posts:**
- Fort William (1803) - Grand inland headquarters; annual rendezvous site
- Grand Portage (1731) - Original NWC depot before US boundary
- Fort Augustus (1795) - Competed with Fort Edmonton
- Fort Gibraltar (1809) - Competed with HBC at The Forks
- Fort George BC (1807) - Simon Fraser's base; now Prince George
- Fort Astoria/Fort George (1811) - First American settlement on Pacific
- Rocky Mountain House (1799) - David Thompson's base for crossing Rockies
- Kootenay House (1807) - First post in Columbia Basin
- And many more...

**Maritime Landing Sites:**
- Cape Bonavista (Cabot's 1497 landfall)
- Cartier's Cross at Gaspé (1534)
- Cook's Landing at Friendly Cove (1778)
- Spanish Banks Beach (Vancouver-Galiano meeting, 1792)
- Fort San Miguel (Spanish fort at Nootka, 1789)

### Explorers (91 Total) - Chronological

**Comprehensive coverage spanning 1,000 years of Canadian exploration:**

The database includes 91 explorers from c. 1000 AD to 1918, including:
- Norse explorers (Leif Erikson, c. 1000 AD)
- Early maritime explorers (Cabot 1497, Cartier 1534, Hudson 1610)
- French coureurs des bois and voyageurs (Radisson, Des Groseilliers, Brûlé)
- HBC explorers (Kelsey, Knight, Henday, Hearne)
- Fur trade pioneers (Peter Pond, La Vérendrye family including all four sons, Simon McTavish)
- Pacific coast explorers (Cook, Vancouver, Spanish expeditions)
- Overland to Pacific (Mackenzie, Fraser, Thompson)
- Arctic explorers (Franklin, Rae, McClure, Amundsen)
- Modern era (Tyrrell 1893, Stefansson 1918)
- Indigenous guides recognized as explorers (Thanadelthur, Matonabbee)

All displayed **chronologically by birth year** to show the progression of Canadian exploration.

**Notable examples below:**

**East Coast Maritime:**
- **1497**: John Cabot (First English claim to North America)
- **1534**: Jacques Cartier (Claimed Gaspé for France)

**West Coast Maritime:**
- **1741**: Vitus Bering & Aleksei Chirikov (Russian exploration of Alaska)
- **1774**: Juan Pérez (First European at Nootka Sound)
- **1775**: Bodega y Quadra, Bruno de Heceta (Spanish claims)
- **1778**: Captain James Cook (Nootka Sound; sparked fur trade)
- **1786**: La Pérouse (French expedition; tragedy at Lituya Bay)
- **1791**: José María Narváez (First through Georgia Strait)
- **1792**: Captain George Vancouver, Galiano & Valdés (Spanish Banks meeting)
- **1792**: Robert Gray (First to enter Columbia River)

**Inland Explorers:**
- **c. 1000 AD**: Leif Erikson (Norse discovery)
- **1603-1635**: Samuel de Champlain (Father of New France)
- **1610-1633**: Étienne Brûlé (First European to see Great Lakes)
- **1610-1611**: Henry Hudson (Discovered Hudson Bay)
- **1659-1670**: Radisson & Groseilliers (HBC founders)
- **1690-1692**: Henry Kelsey (First European on prairies)
- **1719**: James Knight (Lost expedition)
- **1731-1743**: La Vérendrye (Extended French influence west)
- **1754-1755**: Anthony Henday (First to see Rockies from prairies)
- **1769-1771**: Samuel Hearne (First to Arctic Ocean overland)
- **1778**: Peter Pond (Opened Athabasca fur trade)
- **1789-1793**: Alexander Mackenzie (First transcontinental crossing)
- **1786-1812**: David Thompson (Greatest land geographer)
- **1808**: Simon Fraser (Fraser River descent)
- **1819-1847**: Sir John Franklin (Arctic explorer, lost expedition)
- **1846-1854**: Dr. John Rae (Determined Franklin's fate)
- **1850-1854**: Sir Robert McClure (First Northwest Passage traverse)
- **1884-1893**: Joseph Burr Tyrrell (Last great wilderness explorer)
- **1906-1918**: Vilhjalmur Stefansson (Canadian Arctic Expedition)

### Archaeological Discoveries (8)
- **HMS Erebus Wreck** (2014) - Franklin's flagship found in Queen Maud Gulf
- **HMS Terror Wreck** (2016) - Second Franklin ship found in Terror Bay
- **Knight Expedition Remains** (1767) - Found on Marble Island by Samuel Hearne
- **Champlain's Astrolabe** (1867) - 1603 navigation instrument found near Ottawa River
- **L'Anse aux Meadows** (1960) - Norse settlement in Newfoundland, c. 1000 AD
- **Red Bay Basque Whaling Station** (1978) - 16th century whaling operation
- **Franklin Expedition Graves** (1850) - Beechey Island graves, lead poisoning evidence (1984)
- **HMS Investigator Wreck** (2010) - McClure's ship in Mercy Bay

### Cartographers (8)
- Samuel de Champlain, David Thompson, Peter Fidler, Philippe Buache, Aaron Arrowsmith, Joseph Bouchette

### Indigenous Nations (7)
- Cree, Anishinaabe (Ojibwe), Haudenosaunee (Iroquois)
- Dene, Mi'kmaq, Inuit, Stó:lō

## Tech Stack

- **Frontend**: React Native, Expo SDK 53, react-native-maps
- **Backend**: Bun, Hono, Prisma (SQLite)
- **Styling**: NativeWind (TailwindCSS)

## API Endpoints

### Public Endpoints
- `GET /api/waterways` - List all waterways (includes boundary coordinates)
- `GET /api/waterways/:id` - Waterway details with explorers (chronological), fur trade info, and archaeological discoveries
- `GET /api/locations` - List all historic locations
- `GET /api/locations/:id` - Location details
- `GET /api/explorers` - List all explorers
- `GET /api/explorers/:id` - Explorer details with explored waterways
- `GET /api/indigenous/nations` - List Indigenous nations
- `GET /api/discoveries` - List all archaeological discoveries
- `GET /api/discoveries/:id` - Single discovery details
- `GET /api/discoveries/waterway/:waterwayId` - Discoveries for a waterway
- `GET /api/contributions` - List approved contributions
- `POST /api/contributions` - Submit a new contribution

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/contributions` - List pending contributions
- `PATCH /api/admin/contributions/:id` - Approve or reject a contribution
- `GET /api/admin/quizzes` - List all quizzes (including unpublished)
- `POST /api/admin/quizzes` - Create a new quiz
- `PATCH /api/admin/quizzes/:id` - Update a quiz
- `DELETE /api/admin/quizzes/:id` - Delete a quiz
- `POST /api/admin/quizzes/:id/questions` - Add a question to a quiz
- `PATCH /api/admin/quizzes/:quizId/questions/:questionId` - Update a question
- `DELETE /api/admin/quizzes/:quizId/questions/:questionId` - Delete a question

### Quiz Endpoints
- `GET /api/quizzes` - List published quizzes (supports category, gradeLevel, difficulty filters)
- `GET /api/quizzes/:id` - Get quiz with questions (answers hidden)
- `POST /api/quizzes/:id/attempt` - Submit quiz answers and get scored results

### Gamification Endpoints (NEW)
- `GET /api/gamification/progress` - Get user's progress and stats
- `GET /api/gamification/achievements` - List all achievements
- `GET /api/gamification/achievements/user` - Get user's earned achievements
- `GET /api/gamification/daily-challenge` - Get today's challenge
- `POST /api/gamification/daily-challenge/submit` - Submit challenge answer
- `GET /api/gamification/ranks` - List explorer ranks
- `GET /api/gamification/leaderboard` - Get leaderboard

### Indigenous Language Endpoints (NEW)
- `GET /api/indigenous-language/words` - List Indigenous words (filter by language, category)
- `GET /api/indigenous-language/word-of-day` - Get featured word of the day
- `GET /api/indigenous-language/vocabulary-quizzes` - List vocabulary quizzes
- `POST /api/indigenous-language/vocabulary-quizzes/:id/submit` - Submit quiz answers
- `GET /api/indigenous-language/stories` - List Indigenous stories
- `GET /api/indigenous-language/languages` - List available languages

### Voyageur Journey Endpoints (NEW)
- `GET /api/voyageur-journeys` - List all journeys
- `GET /api/voyageur-journeys/:id` - Get journey with all nodes
- `GET /api/voyageur-journeys/:id/start` - Start a journey
- `POST /api/voyageur-journeys/:id/choice` - Make a choice at a node
- `GET /api/voyageur-journeys/:id/progress` - Get user's progress

### Map Annotation Endpoints (NEW)
- `GET /api/map-annotations` - List user's maps
- `POST /api/map-annotations` - Create new map
- `GET /api/map-annotations/:id` - Get map with all annotations
- `POST /api/map-annotations/:id/pin` - Add a pin
- `POST /api/map-annotations/:id/route` - Add a route
- `POST /api/map-annotations/:id/note` - Add a note
- `POST /api/map-annotations/:id/share` - Generate share code
- `GET /api/map-annotations/shared/:code` - Get shared map
- `DELETE /api/map-annotations/:id/pin/:pinId` - Delete a pin

### Nearby History Endpoints (NEW)
- `GET /api/nearby-history` - Get historical events near coordinates
- `GET /api/nearby-history/categories` - List event categories

### Notable Figures Endpoints (NEW)
- `GET /api/notable-figures` - List all notable figures (filter by figureType, nation)
- `GET /api/notable-figures/:id` - Get figure details
- `GET /api/notable-figures/featured` - Get featured figures
- `GET /api/notable-figures/types` - List figure types
- `GET /api/notable-figures/nations` - List nations represented
- `GET /api/notable-figures/by-explorer/:name` - Get figures associated with an explorer

### Historical Imagery (NEW)

The app now features extensive Creative Commons imagery from Wikimedia Commons throughout:

**Explorer Portraits:**
- Samuel Hearne, La Vérendrye, Henry Kelsey, Étienne Brûlé, Jacques Marquette, Louis Jolliet, La Salle, Simon Fraser, George Vancouver, Captain James Cook, Martin Frobisher, Roald Amundsen

**Indigenous Leaders:**
- Matonabbee (Samuel Hearne's guide), Crowfoot, Poundmaker, Big Bear

**Historical Events with Imagery:**
- Bloody Falls Massacre (1771) - Samuel Hearne's traumatic account
- Lake of the Woods Massacre (1736) - La Vérendrye's son and Father Aulneau
- Battle of the Plains of Abraham, Battle of Seven Oaks, Siege of Louisbourg
- Franklin Expedition, Hearne's Arctic expeditions, and more

**Historic Locations:**
- Bloody Falls / Kugluk Territorial Park (Coppermine River)
- Massacre Island and Fort St. Charles (Lake of the Woods)
- Prince of Wales Fort, York Factory, Fort William

**New Historical Events Added:**
- Bloody Falls Massacre (July 17, 1771) - With full account and 1996 reconciliation ceremony
- Lake of the Woods Massacre (June 6, 1736) - Father Aulneau and Jean-Baptiste de La Vérendrye
- Hearne's three Arctic expeditions (1769, 1770, 1770-1772)
- Surrender of Prince of Wales Fort (1782)
- La Vérendrye Reaches Lake Winnipeg (1733)
- Rediscovery of Fort St. Charles (1908)

All images are Public Domain or Creative Commons licensed from Wikimedia Commons.