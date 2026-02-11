# Canada Waterways Explorer

An interactive educational map app showcasing Canada's major waterways, their Indigenous heritage, historical explorers, and the fur trade era. Designed for K-12 students.

## Features

### Interactive Map
- **Waterways Display**: Rivers, lakes, bays, and straits across Canada with color-coded markers
- **Historic Locations**: Forts, trading posts, portages, and settlements
- **Indigenous Names**: Original names displayed alongside English names
- **Tap-to-Explore**: Tap any marker to learn more

### Educational Content
- **Explorer Profiles**: Detailed biographies of famous explorers like Samuel de Champlain, Alexander Mackenzie, and David Thompson
- **Indigenous Heritage**: Learn about the First Nations peoples who have lived along these waterways for thousands of years
- **Fur Trade History**: Discover how waterways shaped the fur trade era

### Map Legend
- 🔵 **Blue** - Rivers
- 🔵 **Cyan** - Lakes
- 🟢 **Green** - Bays
- 🔴 **Red** - Forts
- 🟠 **Orange** - Trading Posts
- 🟤 **Brown** - Portages

## Data Included

### Waterways (16)
- St. Lawrence River (Kaniatarowanenneh)
- Mackenzie River (Deh Cho)
- Fraser River (Sto:lo)
- Ottawa River (Kichi Sibi)
- Saskatchewan River (Kisiskāciwani-sīpiy)
- Churchill River (Missinipi)
- Columbia River (Wimahl)
- Great Lakes (Superior, Huron, Ontario)
- Lake Winnipeg, Athabasca, Great Slave, Great Bear
- Hudson Bay, James Bay

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

- `GET /api/waterways` - List all waterways
- `GET /api/waterways/:id` - Waterway details with explorers and fur trade info
- `GET /api/locations` - List all historic locations
- `GET /api/locations/:id` - Location details
- `GET /api/explorers` - List all explorers
- `GET /api/explorers/:id` - Explorer details with explored waterways
- `GET /api/indigenous/nations` - List Indigenous nations
