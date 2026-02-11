# Canada Waterways Explorer

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
- **Chronological Timeline**: Explorer information is displayed chronologically, from earliest (Leif Erikson, c. 1000 AD) to latest (Joseph Tyrrell, 1893)
- **Explorer Profiles**: Detailed biographies of 24 explorers spanning 1,000 years of exploration
- **Indigenous Heritage**: Learn about the First Nations peoples who have lived along these waterways for thousands of years
- **Fur Trade History**: Discover how waterways shaped the fur trade era
- **Archaeological Discoveries**: Learn about famous finds like the Franklin expedition ships (HMS Erebus & Terror), Champlain's astrolabe, and the L'Anse aux Meadows Norse settlement

### User Contributions
- **Submit Content**: Users can add photos, descriptions, historical facts, and stories about waterways and locations
- **Community Input**: Approved contributions appear in the detail view for each waterway/location
- **Admin Review**: All submissions go through admin vetting before being published

### Admin Panel
- **Review Submissions**: View all pending user contributions
- **Approve/Reject**: Admin can approve or reject submissions with notes
- **Default Admin**: email: admin@waterways.edu, password: admin123

### Map Legend
- Blue - Rivers
- Cyan - Lakes
- Green - Bays
- Red - Forts
- Orange - Trading Posts
- Brown - Portages

## Data Included

### Waterways (44)
**Rivers**: St. Lawrence, Mackenzie, Fraser, Ottawa, Saskatchewan, Churchill, Columbia, Nelson, Athabasca, Peace, Red, Assiniboine, Yukon, Coppermine, Thelon, Saguenay, Saint John

**Lakes**: Superior, Huron, Ontario, Erie, Michigan, Winnipeg, Athabasca, Great Slave, Great Bear, Reindeer, Nipigon, Lesser Slave

**Bays & Sounds**: Hudson Bay, James Bay, Baie des Chaleurs, Gaspé Bay, Bonavista Bay, Placentia Bay, Nootka Sound, English Bay, Friendly Cove (Yuquot), Queen Charlotte Sound, Lituya Bay

**Straits & Inlets**: Strait of Belle Isle, Juan de Fuca Strait, Georgia Strait, Burrard Inlet

### Historic Locations (33)
Including Fort Chipewyan, York Factory, Fort William, Fort Garry, Moose Factory, Norway House, Tadoussac, Cape Bonavista (Cabot's landing), Cartier's Cross at Gaspé, Spanish Banks Beach, Cook's Landing at Friendly Cove, Fort San Miguel, Bligh Island, and many more

### Explorers (38) - Chronological

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
