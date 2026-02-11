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
- **Explorer Profiles**: Detailed biographies of famous explorers like Samuel de Champlain, Alexander Mackenzie, and David Thompson
- **Indigenous Heritage**: Learn about the First Nations peoples who have lived along these waterways for thousands of years
- **Fur Trade History**: Discover how waterways shaped the fur trade era

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

### Waterways (31)
**Rivers**: St. Lawrence, Mackenzie, Fraser, Ottawa, Saskatchewan, Churchill, Columbia, Nelson, Athabasca, Peace, Red, Assiniboine, Yukon, Coppermine, Thelon, Saguenay, Saint John

**Lakes**: Superior, Huron, Ontario, Erie, Michigan, Winnipeg, Athabasca, Great Slave, Great Bear, Reindeer, Nipigon, Lesser Slave

**Bays**: Hudson Bay, James Bay

### Historic Locations (21)
Including Fort Chipewyan, York Factory, Fort William, Fort Garry, Moose Factory, Norway House, Tadoussac, and many more

### Explorers (6)
- Samuel de Champlain (Father of New France)
- Alexander Mackenzie (First transcontinental crossing)
- David Thompson (Greatest land geographer)
- Samuel Hearne (First to Arctic Ocean overland)
- Sir John Franklin (Arctic explorer)
- Simon Fraser (Fraser River explorer)

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
- `GET /api/waterways/:id` - Waterway details with explorers and fur trade info
- `GET /api/locations` - List all historic locations
- `GET /api/locations/:id` - Location details
- `GET /api/explorers` - List all explorers
- `GET /api/explorers/:id` - Explorer details with explored waterways
- `GET /api/indigenous/nations` - List Indigenous nations
- `GET /api/contributions` - List approved contributions
- `POST /api/contributions` - Submit a new contribution

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/contributions` - List pending contributions
- `PATCH /api/admin/contributions/:id` - Approve or reject a contribution
