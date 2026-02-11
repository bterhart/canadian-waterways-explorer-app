/**
 * Comprehensive Lesson Plans Seed for Fur Trade History Educational App
 *
 * This file creates a FULL set of curriculum-aligned lesson plans covering:
 * - ALL grade levels: K-3, 4-6, 7-9, 10-12
 * - ALL major topics: Early Explorers, Fur Trade, Indigenous Routes/Heritage,
 *   Maritime Discovery, Archaeology, Cartography, Metis History, Women in History, Geography
 *
 * Run with: bunx tsx prisma/seed-lesson-plans-comprehensive.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LessonPlanData {
  title: string;
  description: string;
  gradeLevel: string;
  topic: string;
  estimatedMinutes: number;
  objectives: string[];
  curriculumConnections: { subject: string; strand: string; expectation: string }[];
  materials: string[];
  introduction: string;
  mainContent: string;
  activities: { name: string; description: string; duration: string }[];
  discussionQuestions: string[];
  assessment: string;
  extensions: string;
  isPublished: boolean;
}

// ==================== K-3 LESSON PLANS ====================

const k3LessonPlans: LessonPlanData[] = [
  {
    title: "Meet the Voyageurs",
    description: "An engaging introduction to voyageur life for young learners, featuring songs, movement activities, and hands-on exploration of what it meant to paddle a canoe across Canada.",
    gradeLevel: "K-3",
    topic: "Fur Trade",
    estimatedMinutes: 45,
    objectives: [
      "Identify who the voyageurs were and what they did",
      "Learn a simple voyageur paddling song",
      "Understand that voyageurs traveled by canoe",
      "Practice counting and rhythm through paddling movements"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage and Identity", expectation: "Describe people who lived in Canada long ago" },
      { subject: "Music", strand: "Creating and Performing", expectation: "Sing songs from various cultures" },
      { subject: "Physical Education", strand: "Movement", expectation: "Perform rhythmic movements" }
    ],
    materials: [
      "Pictures of voyageurs and canoes",
      "Recording of 'En roulant ma boule' (voyageur song)",
      "Cardboard paddles (one per student)",
      "Blue fabric or paper for 'water'",
      "Voyageur hat template for coloring"
    ],
    introduction: "Gather students in a circle. Ask: 'Have you ever been in a canoe or a boat? Today we're going to learn about special travelers called voyageurs who paddled canoes a very, very long way - farther than you could walk in a whole month!'",
    mainContent: `## Who Were the Voyageurs?

Voyageurs were special workers who paddled big canoes across Canada a long, long time ago. Their name means "travelers" in French.

### What Did They Do?
- Paddled canoes filled with packages
- Sang songs while they paddled
- Carried heavy packs on their backs
- Traveled on rivers and lakes

### Their Canoes
Voyageur canoes were VERY big - as long as our classroom! They were made from tree bark and could hold lots of packages.

### Voyageur Songs
Voyageurs sang songs while they paddled. The songs helped everyone paddle together - stroke, stroke, stroke! When they sang fast, they paddled fast. When they sang slow, they paddled slow.

### What They Wore
- A red cap or toque
- A colorful sash around their waist
- Moccasins on their feet (like soft leather shoes)

### Fun Facts for Little Learners
- Voyageurs woke up when it was still dark outside
- They paddled ALL day long
- They ate special food called pemmican (like a trail bar made of meat and berries)
- They were very strong from all that paddling!`,
    activities: [
      { name: "Paddle to the Beat", description: "Give each student a cardboard paddle. Play the voyageur song and have students 'paddle' in rhythm. Speed up and slow down with the music.", duration: "10 minutes" },
      { name: "Canoe Circle", description: "Sit students in a long row (their 'canoe'). Practice paddling together while singing a simple song. Count strokes together.", duration: "10 minutes" },
      { name: "Color a Voyageur Hat", description: "Students color their own voyageur cap template, then wear it for the rest of the activities.", duration: "10 minutes" },
      { name: "Voyageur Says", description: "Play 'Simon Says' but call it 'Voyageur Says' - paddle left, paddle right, carry a pack, etc.", duration: "10 minutes" }
    ],
    discussionQuestions: [
      "Would you want to be a voyageur? Why or why not?",
      "Why do you think the voyageurs sang songs?",
      "What would be hard about paddling a canoe all day?",
      "What would be fun about being a voyageur?"
    ],
    assessment: "Observe students participating in activities. Have each student draw a picture of a voyageur and tell you one thing they learned.",
    extensions: "Create a classroom 'canoe' from a large cardboard box and let students take turns being voyageurs during free play.",
    isPublished: true
  },
  {
    title: "Animals of the Fur Trade",
    description: "Young learners discover the animals whose fur was traded, with a focus on the beaver, learning why their fur was so special and how they live.",
    gradeLevel: "K-3",
    topic: "Fur Trade",
    estimatedMinutes: 40,
    objectives: [
      "Identify the beaver as the most important fur trade animal",
      "Learn basic facts about beavers and their homes",
      "Name other animals that were trapped for fur",
      "Understand that animal fur was used to make warm clothing"
    ],
    curriculumConnections: [
      { subject: "Science", strand: "Living Things", expectation: "Identify characteristics of animals" },
      { subject: "Social Studies", strand: "Heritage", expectation: "Describe how people used natural resources" },
      { subject: "Art", strand: "Creating", expectation: "Create artwork inspired by nature" }
    ],
    materials: [
      "Pictures of beavers, otters, martens, foxes",
      "Samples of different textures (soft fur fabric, smooth fabric)",
      "Beaver puppet or stuffed animal",
      "Picture of a beaver dam and lodge",
      "Brown paper for beaver craft"
    ],
    introduction: "Show a picture of a beaver. Ask: 'Does anyone know what animal this is? Beavers were VERY important in Canada's history. Their fur helped build our country! Let's find out why.'",
    mainContent: `## The Amazing Beaver

### Why Were Beavers So Important?
Long ago, people in Europe wanted beaver fur to make fancy hats! Beaver fur is very soft and warm, perfect for keeping heads cozy.

### All About Beavers
- Beavers are as big as a medium-sized dog
- They have flat tails like a paddle
- They have orange teeth that never stop growing!
- They live in water and on land
- They build dams and lodges (beaver houses)

### Beaver Dams
Beavers use sticks and mud to build dams in rivers. These dams make ponds where beavers can build their homes called lodges.

### Other Fur Animals
People also wanted fur from:
- **Otters** - playful animals that swim and slide
- **Martens** - small, fast animals that climb trees
- **Foxes** - fluffy tails and pointed ears
- **Muskrats** - small cousins of beavers

### Feeling Fur
Different animals have different kinds of fur:
- Some is soft and fluffy
- Some is smooth and shiny
- All of it kept people warm!

### The Beaver Today
The beaver is now Canada's national animal! You can see it on our nickel coin.`,
    activities: [
      { name: "Texture Touch", description: "Pass around different fabric textures. Which feels most like beaver fur? Compare soft, smooth, and fluffy textures.", duration: "8 minutes" },
      { name: "Build a Lodge", description: "Using blocks or sticks, work together to build a beaver lodge. Discuss how beavers use their teeth and tails.", duration: "10 minutes" },
      { name: "Animal Sorting", description: "Sort pictures of animals into 'fur trade animals' and 'other animals.' Count how many of each.", duration: "8 minutes" },
      { name: "Beaver Craft", description: "Create a simple beaver using brown paper, with a flat tail and orange teeth (crayons).", duration: "12 minutes" }
    ],
    discussionQuestions: [
      "Why do animals have fur?",
      "How do beavers use their flat tails?",
      "What is special about beaver teeth?",
      "Can you think of other animals with soft fur?"
    ],
    assessment: "Students complete a simple worksheet matching animals to their descriptions. Each student names one fur trade animal.",
    extensions: "Take a nature walk to look for signs of animals. Set up a 'beaver pond' dramatic play area with blue fabric and building materials.",
    isPublished: true
  },
  {
    title: "Following the Rivers",
    description: "Simple map skills for young learners, using major Canadian waterways to practice directions, shapes, and the concept that rivers are like roads for canoes.",
    gradeLevel: "K-3",
    topic: "Geography",
    estimatedMinutes: 35,
    objectives: [
      "Understand that rivers were used like roads for travel",
      "Identify water (blue) on a simple map",
      "Practice left/right and directional words",
      "Trace a simple route on a map"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Geography", expectation: "Use simple maps to locate places" },
      { subject: "Math", strand: "Spatial Sense", expectation: "Describe positions using directional language" },
      { subject: "Language", strand: "Reading", expectation: "Read simple diagrams and maps" }
    ],
    materials: [
      "Large simple map of Canada showing major rivers",
      "Blue yarn or ribbon",
      "Small toy canoes or paper boats",
      "Floor map or large paper for walking on",
      "Crayons (especially blue)"
    ],
    introduction: "Ask: 'How do you get to school? By car? By bus? By walking? Long ago, there were no cars or buses. People traveled on RIVERS in canoes! Rivers were their roads.'",
    mainContent: `## Rivers: Nature's Roads

### Why Rivers?
- Long ago, there were no roads through the forests
- The forests were thick and hard to walk through
- Rivers made traveling easier!
- Canoes could carry heavy things

### What is a Map?
A map is like a picture taken from way up high, like a bird looking down.
- Blue on maps = water (rivers, lakes, oceans)
- Green on maps = land with trees
- Brown on maps = mountains

### Following the Water
On our map, let's find:
- The BIG lakes (Great Lakes - they're huge!)
- The long rivers (like blue ribbons across the land)
- Where the rivers meet (that's where people gathered)

### Directions
- Rivers flow DOWN from high places to low places
- Some rivers flow North (up on our map)
- Some rivers flow South (down on our map)
- Some flow East (right) or West (left)

### River Words
- **Upstream** - going against the water flow (harder!)
- **Downstream** - going with the water flow (easier!)
- **Portage** - when you have to carry your canoe over land`,
    activities: [
      { name: "River Walk", description: "Lay blue yarn on the floor in a river shape. Students 'paddle' along it, following directions (turn left, go straight, etc.).", duration: "8 minutes" },
      { name: "Find the Blue", description: "On individual simple maps, students color all the water blue and trace the river routes with their fingers.", duration: "10 minutes" },
      { name: "Canoe Journey", description: "Move a toy canoe along the floor map from one marked spot to another, describing the route.", duration: "8 minutes" },
      { name: "River Puzzle", description: "Cut a simple river map into pieces. Students put it back together like a puzzle.", duration: "8 minutes" }
    ],
    discussionQuestions: [
      "Why is blue used for water on maps?",
      "Would you rather paddle upstream or downstream? Why?",
      "What animals might you see traveling on a river?",
      "Why did people build towns near rivers?"
    ],
    assessment: "Students trace a route on a simple map and point to water when asked 'Show me a river.'",
    extensions: "Create a classroom floor map with blue tape for rivers. Use it during transitions - 'paddle' to your desk!",
    isPublished: true
  },
  {
    title: "First Nations Canoe Builders",
    description: "Celebrate Indigenous technology by learning how First Nations peoples invented and built the amazing birchbark canoes that made the fur trade possible.",
    gradeLevel: "K-3",
    topic: "Indigenous Routes",
    estimatedMinutes: 45,
    objectives: [
      "Understand that First Nations peoples invented canoes",
      "Learn that canoes were made from tree bark",
      "Appreciate that canoe-building required great skill",
      "Recognize that Europeans learned from First Nations peoples"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Recognize contributions of Indigenous peoples" },
      { subject: "Science", strand: "Materials", expectation: "Describe properties of materials" },
      { subject: "Art", strand: "Creating", expectation: "Create using various materials" }
    ],
    materials: [
      "Pictures of birchbark canoes",
      "Samples of bark (if available) or bark-textured paper",
      "Pictures of birch trees",
      "Materials for simple canoe craft (paper, tape)",
      "Video clip of canoe building (optional)"
    ],
    introduction: "Show a picture of a beautiful birchbark canoe. Ask: 'This canoe is made from the bark of a tree! How do you think people figured out how to build something so amazing from tree bark?'",
    mainContent: `## The Gift of the Canoe

### Who Invented Canoes?
First Nations peoples invented canoes thousands of years before Europeans came to Canada. They were master builders and inventors!

### The Birch Tree
- Birch trees have special white bark
- The bark peels off in big sheets
- Birch bark is waterproof - water can't get through!
- First Nations peoples discovered this amazing material

### Building a Canoe
Building a canoe took great skill:
1. **Gather bark** - carefully remove bark from birch trees
2. **Build a frame** - use thin, bendy wood for the skeleton
3. **Cover with bark** - stretch the bark over the frame
4. **Sew it together** - use roots as thread!
5. **Seal the seams** - use sticky tree sap so water can't get in

### Why Canoes Were Perfect
- Light enough to carry over land
- Strong enough to carry heavy loads
- Could float in shallow water
- Could be fixed easily in the forest

### Sharing Knowledge
When Europeans came to Canada, First Nations peoples taught them:
- How to paddle canoes
- How to fix canoes
- The best routes to travel
- How to survive in the wilderness

Without First Nations knowledge, Europeans could not have explored Canada!`,
    activities: [
      { name: "Bark Exploration", description: "Examine bark samples or bark-textured materials. Feel the texture, test if it's waterproof by dripping water on it.", duration: "8 minutes" },
      { name: "Simple Canoe Craft", description: "Fold paper into simple boat shapes. Test which designs float best in water.", duration: "12 minutes" },
      { name: "Canoe Building Sequence", description: "Put picture cards in order showing the steps of building a canoe.", duration: "8 minutes" },
      { name: "Thank You Circle", description: "Sit in a circle and take turns saying 'Thank you to First Nations peoples for teaching us about...'", duration: "8 minutes" }
    ],
    discussionQuestions: [
      "Why was it smart to make canoes from bark instead of heavy wood?",
      "What else do you think First Nations peoples invented?",
      "Why was it important for people to share their knowledge?",
      "What would happen if a canoe got a hole in it?"
    ],
    assessment: "Students draw a picture showing First Nations peoples building or using a canoe. Each student shares one thing they learned.",
    extensions: "Explore other First Nations inventions like snowshoes, toboggans, and maple syrup. Create a 'Thank You' card to First Nations peoples.",
    isPublished: true
  },
  {
    title: "A Day at the Trading Post",
    description: "Through dramatic play and hands-on activities, young learners experience what it was like to visit a fur trading post, learning about trading, counting, and cooperation.",
    gradeLevel: "K-3",
    topic: "Fur Trade",
    estimatedMinutes: 50,
    objectives: [
      "Understand what a trading post was",
      "Practice counting and simple trading concepts",
      "Learn what items were traded",
      "Experience history through dramatic play"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Describe places in the community long ago" },
      { subject: "Math", strand: "Number Sense", expectation: "Use counting in real-life situations" },
      { subject: "Drama", strand: "Creating", expectation: "Engage in dramatic play" }
    ],
    materials: [
      "Play furs (fake fur fabric pieces)",
      "Trade goods (beads, toy kettles, blankets)",
      "Token coins or counters for 'Made Beaver'",
      "Simple trading post setup (table with goods)",
      "Dress-up items (hats, sashes)"
    ],
    introduction: "Set up a corner of the room as a 'trading post.' Say: 'Long ago, there were special stores called trading posts. But you didn't use money - you traded things! Let's visit a trading post and see how it worked.'",
    mainContent: `## Welcome to the Trading Post!

### What is a Trading Post?
A trading post was like a store, but different:
- Instead of money, people traded things
- Indigenous peoples brought furs
- They traded furs for useful items
- Trading posts were often in the wilderness

### Who Came to Trade?
- First Nations trappers brought animal furs
- Whole families traveled to the trading post
- It was an exciting time to meet friends!
- People shared news and stories

### What Could You Get?
At a trading post, you could trade furs for:
- **Blankets** - warm and colorful
- **Kettles** - metal pots for cooking
- **Beads** - pretty decorations
- **Tools** - knives, axes, needles
- **Cloth** - fabric for making clothes

### How Trading Worked
Everything had a value in 'Made Beaver':
- 1 beaver pelt = 1 Made Beaver
- 1 blanket might cost 7 Made Beaver
- 1 kettle might cost 4 Made Beaver

### Trading Post Rules
- Be polite and fair
- Count carefully
- Shake hands to agree on a trade
- Everyone should feel happy with the trade`,
    activities: [
      { name: "Trading Post Dramatic Play", description: "Set up the trading post. Some students are traders, some bring 'furs.' Practice polite trading exchanges.", duration: "15 minutes" },
      { name: "Counting Furs", description: "Count groups of play furs. Practice 'I have 3 beaver furs. How many do I need for a blanket that costs 7?'", duration: "10 minutes" },
      { name: "Sort the Trade Goods", description: "Sort trade goods by type (clothing, tools, decorations). Count how many of each.", duration: "8 minutes" },
      { name: "Make a Trade", description: "In pairs, students practice making fair trades, using polite language.", duration: "10 minutes" }
    ],
    discussionQuestions: [
      "How is trading different from buying with money?",
      "What would you want to trade for if you were a trapper?",
      "Why was it important to be fair when trading?",
      "What would happen if someone wasn't honest in a trade?"
    ],
    assessment: "Observe students during dramatic play for understanding of trading concepts. Each student completes a simple trading transaction.",
    extensions: "Keep the trading post set up for free play time. Create 'trade cards' showing what different items cost in Made Beaver.",
    isPublished: true
  },
  {
    title: "Explorers and Their Ships",
    description: "A simple introduction to maritime exploration for young learners, featuring the ships that brought explorers to Canada and the brave people who sailed them.",
    gradeLevel: "K-3",
    topic: "Maritime Discovery",
    estimatedMinutes: 40,
    objectives: [
      "Learn that explorers came to Canada on sailing ships",
      "Understand that ocean voyages were long and difficult",
      "Identify basic parts of a ship",
      "Appreciate the bravery of early explorers"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Identify people who explored Canada" },
      { subject: "Science", strand: "Air and Water", expectation: "Understand how wind moves things" },
      { subject: "Art", strand: "Creating", expectation: "Create artwork about historical topics" }
    ],
    materials: [
      "Pictures of sailing ships",
      "Simple ship diagram",
      "Materials for paper boats",
      "Small fan or straw for 'wind'",
      "Blue paper/fabric for 'ocean'",
      "Globe or map showing Atlantic Ocean"
    ],
    introduction: "Show a globe. Point to Europe and then to Canada. Ask: 'Long ago, explorers traveled ALL the way across this big ocean to reach Canada. But there were no airplanes! How do you think they got here?' Show a picture of a sailing ship.",
    mainContent: `## Brave Sailors and Their Ships

### Coming to Canada
Long ago, people in Europe wanted to explore new lands. They built big ships with sails and crossed the ocean to reach Canada.

### What Made Ships Go?
- Ships had big sails made of cloth
- Wind pushed against the sails
- The wind made the ship move!
- No engines - just wind power

### Parts of a Ship
- **Hull** - the bottom part that floats on water
- **Mast** - the tall pole that holds the sails
- **Sails** - big cloths that catch the wind
- **Deck** - the floor where sailors walked
- **Bow** - the front of the ship
- **Stern** - the back of the ship

### Life on a Ship
Sailing to Canada took a long time - about 2 months!
- Sailors slept in small beds called bunks
- They ate hard bread and dried food
- Fresh water had to be saved carefully
- Sometimes there were big storms!

### Brave Explorers
Some famous explorers who sailed to Canada:
- **John Cabot** - one of the first to reach Canada
- **Jacques Cartier** - explored the St. Lawrence River
- **Samuel de Champlain** - started the first French towns

### Being Brave
Explorers didn't know what they would find. They had to be:
- Brave (the ocean was scary!)
- Patient (the trip was long)
- Curious (they wanted to learn new things)`,
    activities: [
      { name: "Paper Boat Sailing", description: "Make simple paper boats. Use straws to blow them across water in a tub. This is like wind in sails!", duration: "12 minutes" },
      { name: "Ship Parts Matching", description: "Match labels to parts of a ship on a big diagram.", duration: "8 minutes" },
      { name: "Ocean Journey", description: "Walk across the room (the 'ocean'). It's a long way! Count steps together.", duration: "5 minutes" },
      { name: "Explorer Ship Art", description: "Draw and decorate a sailing ship. Add waves, clouds, and maybe a whale!", duration: "12 minutes" }
    ],
    discussionQuestions: [
      "Would you be brave enough to sail across the ocean?",
      "What would be scary about being on a ship in a storm?",
      "What would you miss most if you were on a ship for 2 months?",
      "Why did explorers want to find new lands?"
    ],
    assessment: "Students point to and name at least 2 parts of a ship. Each student shares one thing that would be hard about sailing on a ship.",
    extensions: "Create a classroom ship using chairs and fabric. Act out a voyage with the captain giving directions.",
    isPublished: true
  }
];

// ==================== 4-6 LESSON PLANS ====================

const grades46LessonPlans: LessonPlanData[] = [
  {
    title: "The Voyageur Life",
    description: "Students explore the daily life of voyageurs, learning about their canoe routes, the food they ate, the songs they sang, and the incredible physical demands of their work.",
    gradeLevel: "4-6",
    topic: "Fur Trade",
    estimatedMinutes: 60,
    objectives: [
      "Understand the daily life and working conditions of voyageurs",
      "Learn about the different types of canoes and their purposes",
      "Appreciate the contributions of Indigenous peoples to voyageur travel",
      "Recognize the role of voyageur songs in maintaining paddling rhythm"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage and Identity", expectation: "Describe the contributions of various groups to Canadian society" },
      { subject: "Music", strand: "Cultural Context", expectation: "Identify the role of music in various historical and cultural contexts" },
      { subject: "Math", strand: "Measurement", expectation: "Calculate distances and time" }
    ],
    materials: [
      "Map of major fur trade routes",
      "Images of Montreal canoes and North canoes",
      "Audio recordings of traditional voyageur songs",
      "Pemmican recipe ingredients (optional)",
      "90-pound weight simulation materials"
    ],
    introduction: "Ask students: 'What would you pack for a journey of 2,000 kilometers that you had to complete by paddling a canoe?' Explain that voyageurs were professional canoe paddlers who traveled incredible distances carrying furs and trade goods.",
    mainContent: `## Who Were the Voyageurs?

Voyageurs were the paddlers and transporters of the fur trade, mostly French-Canadian men who moved goods and furs between Montreal and the interior posts. Their name means "travelers" in French.

### The Two Types of Voyageurs
1. **Mangeurs de lard** ("pork eaters") - Traveled the route from Montreal to Grand Portage and back in one season
2. **Hivernants** ("winterers") - Stayed in the interior year-round, traveling to more remote posts

### The Canoes
- **Canot du maitre** (Montreal canoe) - 36 feet long, carried 3-4 tons, crew of 8-10 men
- **Canot du nord** (North canoe) - 25 feet long, for interior rivers, crew of 4-6 men
Both were made of birchbark, a technology learned from Indigenous peoples.

### A Voyageur's Day
- Wake at 3-4 AM
- Paddle 14-18 hours with brief stops
- Each man paddled 55-60 strokes per minute
- Cover 80-120 km per day
- Carry 2 "pieces" (90-pound packs) over portages
- Eat pemmican, peas, and corn porridge

### Voyageur Songs
Songs kept time for paddling and boosted morale. Famous songs include "En roulant ma boule" and "A la claire fontaine." The rhythm of the song set the paddling pace.

### Indigenous Knowledge
Voyageurs depended on Indigenous knowledge: birchbark canoe technology, pemmican for food, knowledge of routes and portages, and guidance through unfamiliar territory.

### The Rendezvous
Each summer, voyageurs from Montreal and the interior met at Grand Portage (later Fort William) for a great gathering where furs and goods were exchanged.`,
    activities: [
      { name: "Route Mapping", description: "Map the voyageur route from Montreal to Grand Portage, calculating distances and identifying major portages.", duration: "15 minutes" },
      { name: "Voyageur Song", description: "Learn and sing a traditional voyageur song. Discuss how rhythm helped coordinate paddling.", duration: "10 minutes" },
      { name: "Journey Calculator", description: "Calculate how long a journey would take at 100 km per day. How many days from Montreal to Lake Winnipeg?", duration: "10 minutes" },
      { name: "Portage Challenge", description: "Experience carrying weighted backpacks to understand the physical demands of portaging.", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Why would someone choose to become a voyageur despite the hardships?",
      "How did voyageurs depend on Indigenous peoples and their knowledge?",
      "What modern jobs might be similar to being a voyageur?",
      "Why were songs so important to voyageurs?",
      "How did the voyageur life contribute to the blending of French and Indigenous cultures?"
    ],
    assessment: "Students create a 'Day in the Life' journal entry from a voyageur's perspective, describing their work, food, challenges, and experiences on the route.",
    extensions: "Research a specific voyageur route and create a detailed map showing all portages and their lengths. Compare to modern transportation times.",
    isPublished: true
  },
  {
    title: "The Hudson's Bay Company",
    description: "Trace the history of the Hudson's Bay Company from its founding in 1670 to its role as a modern retailer, understanding how the fur trade shaped Canada.",
    gradeLevel: "4-6",
    topic: "Fur Trade",
    estimatedMinutes: 50,
    objectives: [
      "Understand when and why the Hudson's Bay Company was founded",
      "Learn how trading posts operated",
      "Discover the 'Made Beaver' currency system",
      "Trace the company's evolution from fur trader to department store"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage and Identity", expectation: "Explain the role of the fur trade in shaping Canada" },
      { subject: "Math", strand: "Number Sense", expectation: "Understand currency and exchange" },
      { subject: "Language", strand: "Reading", expectation: "Read and interpret historical texts" }
    ],
    materials: [
      "Map of Rupert's Land",
      "Images of trading posts and trade goods",
      "Made Beaver value chart",
      "HBC Point Blanket image",
      "Timeline materials"
    ],
    introduction: "Show students the Hudson's Bay Company striped blanket or logo. Ask if anyone recognizes it. Explain that the company that makes these blankets is older than Canada itself - over 350 years old!",
    mainContent: `## The Hudson's Bay Company: A Company That Built a Nation

### The Birth of the HBC (1670)
King Charles II of England gave a charter to the "Governor and Company of Adventurers of England Trading into Hudson's Bay." This charter gave the company control over all lands draining into Hudson Bay - almost 40% of modern Canada! This territory was called Rupert's Land.

### How the Trade Worked
At first, the HBC built posts on Hudson Bay and waited for Indigenous trappers to bring furs to them. This was different from the French, who traveled into the interior.

### Indigenous Traders
- Cree and other nations trapped animals and prepared furs
- They traveled great distances to bring furs to the posts
- Some became "trading chiefs" who organized large trading brigades
- Women played crucial roles in preparing furs and making pemmican

### Made Beaver Currency
The HBC invented a clever currency system:
- One prime beaver pelt = 1 "Made Beaver" (MB)
- All trade goods were priced in Made Beaver
- Examples: 1 blanket = 7 MB, 1 gun = 14 MB, 1 kettle = 1 MB
- Even metal tokens were made to represent Made Beaver

### What Indigenous People Traded For
- Metal tools (knives, kettles, axes)
- Blankets and cloth
- Beads and decorative items
- Guns and ammunition
- Tea and tobacco

### Major Trading Posts
- York Factory - The most important HBC post
- Moose Factory - One of the oldest
- Fort Garry - Site of modern Winnipeg

### From Furs to Stores
In 1870, the HBC sold Rupert's Land to Canada for 300,000 pounds. The company then opened general stores across the West, eventually becoming a department store chain that still operates today.

### The Point Blanket
The HBC Point Blanket (with its colored stripes) was first traded in 1779 and is still made today - over 240 years later!`,
    activities: [
      { name: "Trading Simulation", description: "Students use 'Made Beaver' tokens to trade for goods, calculating costs and making decisions about what to purchase.", duration: "15 minutes" },
      { name: "Map Rupert's Land", description: "Color a map showing the extent of Rupert's Land compared to modern Canada.", duration: "10 minutes" },
      { name: "Trading Post Design", description: "Design your own trading post, deciding what goods to stock and why.", duration: "12 minutes" },
      { name: "Company Timeline", description: "Create a timeline of HBC history from 1670 to today.", duration: "10 minutes" }
    ],
    discussionQuestions: [
      "Why did Indigenous peoples want European trade goods?",
      "Was the trade fair? Why or why not?",
      "How did the fur trade change Indigenous peoples' lives?",
      "Why do you think the Hudson's Bay Company is still around after 350 years?",
      "What would have happened if the HBC had never been founded?"
    ],
    assessment: "Write a short story about a day at a trading post from the perspective of either a trader or an Indigenous person bringing furs.",
    extensions: "Research what happened to one specific trading post (like York Factory or Moose Factory) and create a timeline of its history.",
    isPublished: true
  },
  {
    title: "David Thompson: Master Mapmaker",
    description: "Students learn about David Thompson's incredible mapmaking achievements and practice basic surveying and navigation techniques used in the early 19th century.",
    gradeLevel: "4-6",
    topic: "Cartography",
    estimatedMinutes: 55,
    objectives: [
      "Learn about David Thompson's life and mapping achievements",
      "Understand basic surveying concepts like direction and distance",
      "Appreciate the role of Indigenous guides in exploration",
      "Practice simple mapping skills"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Identify significant individuals in Canadian history" },
      { subject: "Math", strand: "Measurement", expectation: "Measure and calculate distances" },
      { subject: "Science", strand: "Earth and Space", expectation: "Understand directions and navigation" }
    ],
    materials: [
      "Compasses (one per group)",
      "Measuring tape or meter sticks",
      "Grid paper for mapping",
      "Pictures of David Thompson and his maps",
      "Star charts (simple)"
    ],
    introduction: "Show students a satellite image of North America, then show David Thompson's map of the same region. Ask: 'This map was made over 200 years ago without satellites, airplanes, or even cameras. How accurate do you think it is?' Reveal that Thompson's maps are remarkably accurate.",
    mainContent: `## David Thompson: The Greatest Land Geographer

### Who Was David Thompson?
David Thompson (1770-1857) is often called "the greatest land geographer who ever lived." Born in London, England, he came to Canada at age 14 to work for the Hudson's Bay Company. He mapped over 3.9 million square kilometers of North America!

### Learning to Map
Thompson learned surveying from Philip Turnor, the HBC's official surveyor. He mastered:
- Using stars to find his location (celestial navigation)
- Using a compass to find direction
- Measuring distances traveled
- Recording observations in detailed journals

### Thompson's Instruments
- **Sextant** - for measuring angles to stars
- **Compass** - for finding direction
- **Chronometer** - a very accurate clock
- **Thermometer** - for recording weather
- **Notebooks** - for recording everything he saw

### How Thompson Mapped
Every clear night, Thompson would:
1. Measure the positions of stars with his sextant
2. Check his chronometer for the exact time
3. Calculate his latitude and longitude
4. Record landmarks, rivers, and Indigenous place names
5. Estimate distances traveled during the day

### Charlotte Small: Thompson's Partner
Thompson's Metis wife Charlotte traveled with him for over 10,000 miles! She:
- Served as interpreter with Indigenous peoples
- Helped maintain good relations with local nations
- Raised their children during wilderness journeys
- Made Thompson's work possible

### Thompson's Achievements
- Mapped the entire Columbia River from source to sea
- Found the Athabasca Pass through the Rocky Mountains
- Created the first accurate map of western Canada
- His maps were used for over 100 years after his death

### Why He's Not Famous
Despite his incredible achievements, Thompson is less famous than other explorers. Why? He was a quiet man who didn't seek fame. He spent his final years in poverty, while his maps helped others become rich and famous.`,
    activities: [
      { name: "Compass Directions", description: "Use compasses to find North, then identify landmarks in different directions from the classroom.", duration: "12 minutes" },
      { name: "Pace Mapping", description: "Measure the classroom or hallway by pacing. Create a simple map using these measurements.", duration: "15 minutes" },
      { name: "Thompson's Route", description: "Trace Thompson's journey on a map, identifying key locations he mapped.", duration: "10 minutes" },
      { name: "Compare Maps", description: "Compare Thompson's historic map to a modern map of the same area. What's similar? What's different?", duration: "10 minutes" }
    ],
    discussionQuestions: [
      "Why is Thompson called the greatest land geographer?",
      "How did Charlotte Small contribute to Thompson's success?",
      "Why do you think Thompson is less famous than other explorers?",
      "What would mapping be like without modern technology?",
      "Why was accurate mapping so important for the fur trade?"
    ],
    assessment: "Create a simple map of the school grounds using compass directions and pacing to measure distances.",
    extensions: "Research modern GPS technology and explain how it improves on Thompson's methods. Write a letter nominating Thompson for recognition.",
    isPublished: true
  },
  {
    title: "The Pemmican Trail",
    description: "Explore the Indigenous food technology that made the fur trade possible - pemmican - and learn about the trade networks that distributed this essential food.",
    gradeLevel: "4-6",
    topic: "Indigenous Routes",
    estimatedMinutes: 50,
    objectives: [
      "Understand what pemmican is and why it was essential",
      "Learn about Indigenous food preservation technology",
      "Trace the pemmican trade routes",
      "Appreciate the role of Metis buffalo hunters"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Describe Indigenous contributions to Canadian history" },
      { subject: "Science", strand: "Living Things", expectation: "Understand food preservation" },
      { subject: "Health", strand: "Nutrition", expectation: "Identify nutritious foods" }
    ],
    materials: [
      "Pemmican ingredients (dried meat, dried berries, fat) or pictures",
      "Map showing pemmican trade routes",
      "Pictures of buffalo hunts and Red River carts",
      "Recipe cards for classroom-safe pemmican alternative"
    ],
    introduction: "Ask students: 'Imagine you need food that will last for years, give you lots of energy, and not need cooking. What would you invent?' Explain that Indigenous peoples solved this problem with an amazing invention: pemmican.",
    mainContent: `## Pemmican: The Fuel of the Fur Trade

### What is Pemmican?
Pemmican is a concentrated food invented by Indigenous peoples of the prairies. The word comes from the Cree word "pimikan" meaning "he makes grease."

### How Pemmican Was Made
1. **Dry the meat** - Buffalo meat was cut into thin strips and dried in the sun
2. **Pound it** - The dried meat was pounded into powder
3. **Add berries** - Dried saskatoon berries or other berries were mixed in
4. **Add fat** - Melted buffalo fat was poured over the mixture
5. **Pack it** - The mixture was packed into bags made from buffalo hide

### Why Pemmican Was Amazing
- Could last for YEARS without spoiling
- Very lightweight for the energy it provided
- Didn't need cooking - could be eaten as is
- One pound of pemmican = many pounds of fresh meat
- Perfect for long canoe journeys

### The Buffalo Hunt
Making pemmican required buffalo:
- Metis and First Nations hunters followed the buffalo herds
- Hunts were carefully organized with strict rules
- Women did the crucial work of making pemmican
- A single hunt could produce tons of pemmican

### The Pemmican Trade Network
- Made on the prairies by Metis and First Nations peoples
- Transported to fur trade posts in Red River carts
- Stored at provision depots like Cumberland House
- Distributed to canoe brigades heading into the wilderness

### The Red River Cart
Pemmican was transported in Red River carts:
- Made entirely of wood and leather (no metal!)
- Could be heard squeaking from miles away
- Could carry 400 kg of pemmican
- Pulled by oxen or horses

### The Pemmican War (1814-1821)
Pemmican was so important that a war was fought over it! The HBC tried to stop Metis from selling pemmican to the North West Company, leading to conflict including the Battle of Seven Oaks.`,
    activities: [
      { name: "Pemmican Recipe", description: "Make a classroom-safe version using dried fruit, nuts, and honey. Discuss how it compares to traditional pemmican.", duration: "15 minutes" },
      { name: "Trade Route Mapping", description: "Map the pemmican trade routes from the prairies to northern trading posts.", duration: "10 minutes" },
      { name: "Energy Calculation", description: "Compare the weight and energy of pemmican to modern foods. Why was it so efficient?", duration: "10 minutes" },
      { name: "Buffalo Hunt Organization", description: "Role-play organizing a buffalo hunt with different responsibilities.", duration: "12 minutes" }
    ],
    discussionQuestions: [
      "Why was pemmican more important than gold to the fur trade?",
      "What does pemmican tell us about Indigenous scientific knowledge?",
      "How is pemmican similar to modern energy bars or trail food?",
      "Why would people fight a war over food?",
      "What traditional foods from your family have special preservation methods?"
    ],
    assessment: "Create an advertisement poster for pemmican, explaining what it is, how it's made, and why it's the best food for wilderness travel.",
    extensions: "Research the Pemmican Proclamation of 1814 and write a newspaper article about the conflict from different perspectives.",
    isPublished: true
  },
  {
    title: "Forts of the Fur Trade",
    description: "Compare Hudson's Bay Company and North West Company trading posts, learning how location, design, and management reflected different trading strategies.",
    gradeLevel: "4-6",
    topic: "Fur Trade",
    estimatedMinutes: 55,
    objectives: [
      "Compare the strategies of the HBC and NWC",
      "Understand why trading posts were built in specific locations",
      "Learn about life inside a fur trade fort",
      "Analyze how competition affected the fur trade"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Compare different perspectives in Canadian history" },
      { subject: "Geography", strand: "Human Systems", expectation: "Explain why places are located where they are" },
      { subject: "Language", strand: "Writing", expectation: "Write comparative texts" }
    ],
    materials: [
      "Maps showing HBC and NWC trading posts",
      "Diagrams of fort layouts",
      "Pictures of reconstructed forts",
      "Comparison chart template"
    ],
    introduction: "Show students a map with both HBC and NWC posts marked in different colors. Ask: 'Why do you think there are two posts right next to each other in some places? What happens when two businesses compete?'",
    mainContent: `## Two Companies, Two Strategies

### The Hudson's Bay Company Approach
- Built posts on Hudson Bay, then waited for traders to come to them
- Relied on Indigenous peoples to travel long distances
- Posts were large and well-supplied (ships brought goods directly)
- Employees were mostly from the Orkney Islands in Scotland
- Strict rules and discipline

### The North West Company Approach
- Traveled INTO the interior to meet Indigenous trappers
- Built posts close to where Indigenous peoples lived
- Used Montreal canoes to transport goods (longer route)
- Employees were French-Canadian voyageurs and Scottish partners
- More flexible, partnership-based organization

### Why Location Mattered
Posts were built where:
- Rivers met (to control travel routes)
- Portages occurred (everyone had to pass by)
- Indigenous nations gathered
- Good resources were available (wood, water, game)

### Inside a Trading Post
A typical fort included:
- **Palisade** - wooden wall for protection
- **Trading room** - where furs were exchanged
- **Warehouse** - for storing furs and trade goods
- **Living quarters** - for traders and their families
- **Blacksmith shop** - for repairs
- **Ice house** - for storing food

### Famous Trading Posts
**HBC Posts:**
- York Factory - Main depot on Hudson Bay
- Moose Factory - Oldest HBC post still standing

**NWC Posts:**
- Grand Portage - Original inland headquarters
- Fort William - Replaced Grand Portage after boundary changes

### The Competition
The two companies competed fiercely:
- Built posts right next to each other
- Tried to intercept each other's traders
- Sometimes the competition turned violent
- Finally merged in 1821`,
    activities: [
      { name: "Location Analysis", description: "Look at a map and predict where trading posts should be built. Then check against actual locations.", duration: "12 minutes" },
      { name: "Company Comparison", description: "Fill in a Venn diagram comparing HBC and NWC strategies, employees, and posts.", duration: "12 minutes" },
      { name: "Design a Fort", description: "Design your own trading post, explaining why you included each building and chose the location.", duration: "15 minutes" },
      { name: "Trading Post Jobs", description: "Assign students different jobs at a trading post and have them explain their responsibilities.", duration: "12 minutes" }
    ],
    discussionQuestions: [
      "Which company had the better strategy? Why?",
      "Why would two competing companies build posts right next to each other?",
      "How did competition affect Indigenous peoples?",
      "Why did the companies eventually merge instead of continuing to compete?",
      "What modern businesses compete like the HBC and NWC did?"
    ],
    assessment: "Write a letter as an HBC trader explaining why your company is better than the NWC, or vice versa.",
    extensions: "Research a specific fort (like Fort William, Lower Fort Garry, or Rocky Mountain House) and create a virtual tour.",
    isPublished: true
  },
  {
    title: "The Red River Cart",
    description: "Discover the iconic Red River cart, a uniquely Metis invention that connected the prairies to the wider world and became a symbol of Metis culture.",
    gradeLevel: "4-6",
    topic: "Metis History",
    estimatedMinutes: 45,
    objectives: [
      "Learn about the Red River cart's design and purpose",
      "Understand why it was made without metal",
      "Appreciate Metis innovation and engineering",
      "Trace the cart trails across the prairies"
    ],
    curriculumConnections: [
      { subject: "Social Studies", strand: "Heritage", expectation: "Describe Metis contributions to Canadian history" },
      { subject: "Science", strand: "Structures", expectation: "Understand how structures are designed for specific purposes" },
      { subject: "Math", strand: "Measurement", expectation: "Calculate distances and capacities" }
    ],
    materials: [
      "Pictures and diagrams of Red River carts",
      "Map showing cart trails",
      "Audio of cart squeaking (recordings exist!)",
      "Simple wheel-building materials"
    ],
    introduction: "Play a recording of the squeaking sound of a Red River cart (or describe it). Tell students: 'This sound could be heard from miles away! It was the sound of an amazing Metis invention crossing the prairies.'",
    mainContent: `## The Red River Cart: Metis Engineering

### What Was a Red River Cart?
The Red River cart was a two-wheeled cart designed by Metis people for travel across the prairies. It became one of the most important transportation technologies in western Canada.

### Unique Design
The most amazing thing about Red River carts: **NO METAL!**
- Made entirely of wood and leather
- Could be repaired anywhere on the prairies
- Floated across rivers (the wheels were removed and the cart became a raft)
- The squeaking was caused by wood rubbing on wood (grease would attract dirt)

### Why No Metal?
- Metal was expensive and hard to get on the prairies
- Metal parts couldn't be fixed without a blacksmith
- Wood could be replaced from any grove of trees
- Leather came from the buffalo they hunted

### How They Were Built
- Large wheels (about 5 feet across) for rolling over rough ground
- Dished (curved) wheels for strength
- Rawhide wrappings held pieces together
- A shaganappi (leather strap) connected the cart to the horse or ox

### What They Carried
A Red River cart could carry:
- 400-500 kg of pemmican or furs
- A whole family's belongings
- Trade goods to distant markets

### The Cart Trails
Cart trains (many carts traveling together) created trails across the prairies:
- **Carlton Trail** - From Fort Garry to Fort Carlton
- **Minnesota Trail** - To St. Paul, Minnesota (for trade with the US)
- Some trails are now modern highways!

### The Great Buffalo Hunt
During the buffalo hunt, hundreds of carts would travel together:
- A cart train might be over a mile long
- The squeaking could be heard from miles away
- After the hunt, carts carried tons of pemmican back to the settlements

### Symbol of Metis Culture
The Red River cart became a symbol of Metis identity:
- Represented Metis innovation and self-reliance
- Showed the blending of Indigenous and European knowledge
- Appears on some Metis flags and artwork today`,
    activities: [
      { name: "Cart Design Analysis", description: "Examine diagrams of Red River carts. Why were the wheels so big? Why was no metal used?", duration: "10 minutes" },
      { name: "Trail Mapping", description: "Trace the major cart trails on a map. Calculate distances between key stops.", duration: "10 minutes" },
      { name: "Simple Wheel Building", description: "Build simple wheels from craft materials. Test which designs roll best.", duration: "15 minutes" },
      { name: "Cart Train Math", description: "If each cart carries 400 kg and there are 500 carts, how much total can the cart train carry?", duration: "8 minutes" }
    ],
    discussionQuestions: [
      "Why was it clever to design a cart without metal?",
      "What does the Red River cart tell us about Metis problem-solving?",
      "How would prairie travel be different with or without the cart?",
      "What modern technologies are designed to be repaired easily?",
      "Why did the squeaking become famous instead of annoying?"
    ],
    assessment: "Design your own transportation for the prairies, explaining your design choices. Compare your design to the Red River cart.",
    extensions: "Research what happened to the Red River cart trails. Are any of them still visible today? Are any modern roads built on old cart trails?",
    isPublished: true
  }
];

// ==================== 7-9 LESSON PLANS ====================

const grades79LessonPlans: LessonPlanData[] = [
  {
    title: "Louis Riel and the Metis Nation",
    description: "A comprehensive examination of Louis Riel's life, the emergence of Metis national identity, and the Red River and Northwest Resistances that shaped Canada.",
    gradeLevel: "7-9",
    topic: "Metis History",
    estimatedMinutes: 90,
    objectives: [
      "Understand the origins and distinct identity of the Metis people",
      "Analyze the causes and events of the Red River Resistance (1869-70)",
      "Evaluate Louis Riel's role in Manitoba's entry into Confederation",
      "Examine the controversy surrounding Riel's trial and execution",
      "Reflect on Riel's legacy and modern Metis rights"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Canada 1850-1914", expectation: "Explain key factors that led to the Red River and Northwest Resistances" },
      { subject: "Civics", strand: "Citizenship", expectation: "Analyze diverse perspectives on issues of civic importance" },
      { subject: "Language", strand: "Critical Literacy", expectation: "Analyze texts for bias and perspective" }
    ],
    materials: [
      "Map of Red River Settlement",
      "Primary source excerpts from Riel's trial",
      "Timeline of Riel's life",
      "Photos of Fort Garry and Batoche",
      "Metis Bill of Rights document"
    ],
    introduction: "Ask students: 'Can someone be both a traitor and a hero at the same time?' Explain that Louis Riel was hanged as a traitor in 1885, but is now called a Father of Confederation. How is this possible?",
    mainContent: `## Louis Riel and the Metis Nation

### Who Are the Metis?
The Metis are a distinct Indigenous people who emerged from the unions of European fur traders (mostly French and Scottish) and First Nations women (mostly Cree and Ojibwe). By the early 1800s, the Metis had developed their own distinct culture, language (Michif), and national identity.

### Metis Culture and Identity
- The Metis sash and infinity flag
- The Red River cart and buffalo hunt
- Metis fiddle music and jigging
- Michif language (blending French and Cree)
- River lot farming system

### The Red River Settlement (1869)
By 1869, about 12,000 people lived at Red River, most of them Metis. They had their own government, economy, and way of life.

### The Crisis
When Canada purchased Rupert's Land from the Hudson's Bay Company:
- The Metis were NOT consulted
- Canadian surveyors arrived and began measuring Metis lands
- The new lieutenant-governor, William McDougall, was coming to take control
- The Metis feared losing everything

### Riel's Response
Louis Riel, a 25-year-old educated Metis, emerged as leader:
- Formed the National Committee of the Metis (October 1869)
- Stopped surveyors from measuring Metis lands
- Prevented McDougall from entering the territory
- Seized Fort Garry and established a provisional government

### The Metis Bill of Rights
Riel's provisional government created a Bill of Rights demanding:
- Protection of French language and Catholic schools
- Metis land rights (1.4 million acres)
- Local self-government
- Representation in Ottawa

### The Thomas Scott Affair
In March 1870, the provisional government executed Thomas Scott, an Ontario Orangeman who had twice tried to overthrow Riel's government. This made Riel a wanted man in Ontario.

### Manitoba Joins Confederation (1870)
The Manitoba Act of 1870 incorporated many Metis demands:
- Manitoba became a province (the "postage stamp province")
- French language rights guaranteed
- 1.4 million acres promised for Metis families
- But Riel was forced into exile

### The Northwest Resistance (1885)
By 1884, Metis who had moved west to Saskatchewan faced the same threats. Gabriel Dumont brought Riel back from exile to lead them. After failed negotiations, armed resistance broke out:
- March 26: Battle of Duck Lake
- April 24: Battle of Fish Creek
- May 9-12: Battle of Batoche (Metis defeat)

### Trial and Execution
Riel surrendered and was tried for treason in Regina:
- His lawyers argued insanity; Riel insisted on his sanity
- All-white, English-speaking jury
- Found guilty, sentenced to death
- Hanged November 16, 1885

### Legacy and Controversy
Riel's execution divided Canada:
- French Canadians saw it as murder of a defender of their rights
- English Canadians (especially Ontario) saw it as justice
- Led to the rise of Quebec nationalism

### Modern Recognition
- 1992: Parliament recognized Riel's contribution to Confederation
- 2008: Manitoba created Louis Riel Day
- Ongoing calls for a posthumous pardon
- Metis rights continue to be debated and litigated`,
    activities: [
      { name: "Primary Source Analysis", description: "Analyze excerpts from Riel's trial speeches. What was he trying to argue? Was he insane or politically sophisticated?", duration: "20 minutes" },
      { name: "Timeline Creation", description: "Create a detailed timeline from 1869-1885, identifying turning points and key decisions.", duration: "15 minutes" },
      { name: "Perspective Writing", description: "Write a newspaper editorial about Riel's execution from either a French-Canadian or English-Canadian perspective.", duration: "20 minutes" },
      { name: "Modern Connections", description: "Research modern Metis rights issues (Daniels case, land claims). How do they connect to Riel's struggle?", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Was Louis Riel a traitor or a hero? Can he be both?",
      "How might events have unfolded differently if Canada had consulted the Metis in 1869?",
      "Why did Riel insist on his sanity at trial, even though an insanity defense might have saved his life?",
      "How did Riel's execution affect French-English relations in Canada?",
      "What do modern Metis communities want Canadians to understand about their history?"
    ],
    assessment: "Write a persuasive essay arguing whether Louis Riel should receive a posthumous pardon, using evidence from primary and secondary sources.",
    extensions: "Research the Daniels case (2016 Supreme Court decision) and its implications for Metis rights today. Create a presentation connecting past and present.",
    isPublished: true
  },
  {
    title: "Women of the Fur Trade",
    description: "Discover the crucial but often overlooked roles that Indigenous and Metis women played in the fur trade, from making pemmican to serving as interpreters and diplomats.",
    gradeLevel: "7-9",
    topic: "Women in History",
    estimatedMinutes: 60,
    objectives: [
      "Recognize the essential contributions of Indigenous and Metis women to the fur trade",
      "Learn about specific notable women such as Thanadelthur, Charlotte Small, and Marie-Anne Gaboury",
      "Understand the concept of 'country marriages' and their significance",
      "Analyze why women's contributions were often overlooked in historical records"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Canada 1713-1850", expectation: "Analyze the contributions of various groups to the fur trade" },
      { subject: "Social Studies", strand: "Identity", expectation: "Examine how gender affected roles and opportunities" },
      { subject: "Language", strand: "Media Literacy", expectation: "Analyze whose voices are included or excluded in historical records" }
    ],
    materials: [
      "Biographies of notable women",
      "Images of fur trade life",
      "Excerpts from fur trade journals mentioning women",
      "Primary source analysis worksheets"
    ],
    introduction: "Ask students to brainstorm what jobs were essential in the fur trade. Record their answers. Then ask: 'Who do you think did most of this work?' Reveal that women did much of the essential labor that made the trade possible, yet are rarely mentioned in history books.",
    mainContent: `## Women of the Fur Trade: Hidden in Plain Sight

### Why Women Were Essential
The fur trade could not have functioned without Indigenous and Metis women. They provided:
- Essential skills (making pemmican, preparing hides, making moccasins and snowshoes)
- Cultural knowledge and language skills
- Diplomatic connections between traders and Indigenous nations
- Family stability that encouraged long-term trading relationships

### Country Marriages
"Country marriages" or marriages "a la facon du pays" (in the custom of the country) were unions between European traders and Indigenous women. These marriages:
- Were recognized by Indigenous communities
- Created trading alliances between families and nations
- Provided women's labor essential to post operations
- Eventually led to the emergence of the Metis nation

### Thanadelthur (c. 1697-1717)
"The Slave Woman" who changed history:
- A Chipewyan woman captured by Cree raiders
- Escaped and walked to York Factory in winter
- Convinced HBC Governor James Knight to make peace with the Chipewyan
- Led a peace mission in 1715-1716
- Brokered peace between Cree and Chipewyan nations
- Opened the northern fur trade
- Died at only about 20 years old, already a legend
- Knight wrote that she was "the chief promoter and actor" of the peace

### Charlotte Small (1785-1857)
David Thompson's wife and partner:
- Metis daughter of a NWC partner and a Cree woman
- Married David Thompson in 1799 (she was 13)
- Traveled over 10,000 miles with her husband during his surveys
- Served as interpreter and cultural broker
- Raised 13 children, many born during wilderness journeys
- Made Thompson's cartographic work possible
- Lived in poverty after Thompson's death

### Marie-Anne Gaboury (1780-1875)
First European woman in the Northwest:
- French-Canadian woman from Quebec
- Traveled west with her husband Jean-Baptiste Lagimodiere
- First European woman to travel to the Canadian Northwest
- Grandmother of Louis Riel
- Lived to 95, witnessing the transformation of the West

### Women's Work at Trading Posts
Women performed essential labor:
- Processing furs and hides (required great skill)
- Making pemmican (the food that fueled the trade)
- Sewing moccasins and snowshoes
- Interpreting and translating
- Gathering food and medicines
- Raising children who became the Metis nation

### Why Were Women's Contributions Forgotten?
- European men wrote the records; they often didn't value women's work
- Women were seen as "helpers" rather than essential workers
- Racism devalued Indigenous women's contributions
- "Country marriages" were later seen as shameful
- Women's work happened in private spaces, not public ones`,
    activities: [
      { name: "Biography Research", description: "Research one notable woman of the fur trade and create a biographical profile.", duration: "15 minutes" },
      { name: "Skills Analysis", description: "Create a comprehensive list of all skills women contributed. Which were most essential?", duration: "10 minutes" },
      { name: "Primary Source Analysis", description: "Read fur trade journal excerpts. How are women mentioned? What's NOT said?", duration: "15 minutes" },
      { name: "Perspective Writing", description: "Write a diary entry from the perspective of a woman at a trading post.", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Why were women's contributions to the fur trade often not recorded in written history?",
      "How did country marriages benefit both Indigenous communities and European traders?",
      "What might we be missing about other historical periods because women's work was not recorded?",
      "How can we learn about people whose stories were not written down?",
      "How do we balance understanding historical attitudes with recognizing their injustice?"
    ],
    assessment: "Research one notable woman of the fur trade and create a presentation arguing why she should be better known.",
    extensions: "Research modern Indigenous women leaders and compare their challenges to those faced by women in the fur trade era. How much has changed?",
    isPublished: true
  },
  {
    title: "The Great Rivalry: HBC vs NWC",
    description: "Examine the fierce competition between the Hudson's Bay Company and North West Company, analyzing how their different strategies shaped the fur trade and Canadian geography.",
    gradeLevel: "7-9",
    topic: "Fur Trade",
    estimatedMinutes: 75,
    objectives: [
      "Compare the business strategies of the HBC and NWC",
      "Analyze how competition affected Indigenous peoples",
      "Evaluate the causes and consequences of the 1821 merger",
      "Understand how fur trade competition shaped Canadian geography"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Canada to 1867", expectation: "Analyze the impact of the fur trade on Canada's development" },
      { subject: "Geography", strand: "Human Systems", expectation: "Explain how economic activities shape settlement patterns" },
      { subject: "Business", strand: "Competition", expectation: "Analyze competitive strategies and their outcomes" }
    ],
    materials: [
      "Maps showing HBC and NWC territories and posts",
      "Primary sources from both companies",
      "Timeline of the rivalry",
      "Data on fur production and trade volume"
    ],
    introduction: "Describe a scenario: 'Imagine you own a business and a competitor opens right next door, offering the same products. What would you do?' Explain that this is exactly what happened across Canada, leading to one of history's most intense business rivalries.",
    mainContent: `## The Great Rivalry: Competition That Shaped a Nation

### Two Different Approaches

**Hudson's Bay Company (HBC)**
- Founded: 1670 by royal charter
- Headquarters: London, with operations centered on York Factory
- Strategy: "Sleep by the Bay" - build posts and let Indigenous traders come to them
- Employees: Mostly Orkney Scots, strict hierarchy, employees on salary
- Advantage: Direct ship access to Hudson Bay

**North West Company (NWC)**
- Founded: 1779 as a partnership of Montreal traders
- Headquarters: Montreal, with Fort William as inland depot
- Strategy: Go into the interior, build posts near Indigenous communities
- Employees: French-Canadian voyageurs, Scottish partners, profit-sharing
- Advantage: Closer relationships with Indigenous peoples

### The Competition Intensifies (1780s-1821)
As beaver populations declined in the East, competition moved west:
- Companies built posts right next to each other
- Traders tried to intercept each other's Indigenous suppliers
- Both companies expanded rapidly, sometimes recklessly
- Violence became common - fights, destruction of property, even murder

### The Role of Indigenous Peoples
Indigenous peoples responded strategically:
- Played companies against each other for better prices
- Some nations allied with one company, some with the other
- Metis emerged as distinct people, working for both companies
- Indigenous knowledge was essential to both companies

### The Pemmican War (1814-1821)
Competition turned violent at Red River:
- HBC's Selkirk Settlement needed pemmican
- NWC's voyageurs also needed pemmican
- HBC tried to ban pemmican exports
- Led to the Battle of Seven Oaks (1816)
- Twenty-one settlers killed, including Governor Semple

### The Merger of 1821
Why did they merge?
- Both companies were losing money from competition
- Beaver populations were declining everywhere
- Violence was bad for business
- British government pressured them to merge

Terms of the merger:
- Combined company kept the HBC name and charter
- NWC partners became HBC partners
- Many employees lost their jobs
- George Simpson became governor of the combined company

### Consequences of the Merger
- End of competitive trading (lower prices for Indigenous peoples)
- Consolidation of posts (many closed)
- Voyageurs and laborers lost jobs
- Metis displaced from the trade
- Beginning of HBC monopoly that lasted until 1870`,
    activities: [
      { name: "Strategy Comparison", description: "Create a detailed comparison chart of HBC and NWC strategies, analyzing strengths and weaknesses of each.", duration: "15 minutes" },
      { name: "Map Analysis", description: "Analyze maps showing the spread of HBC and NWC posts over time. Where did competition concentrate?", duration: "15 minutes" },
      { name: "Role-Play Negotiation", description: "Role-play negotiations between HBC, NWC, and Indigenous traders. Who has the most power?", duration: "20 minutes" },
      { name: "Merger Analysis", description: "Analyze primary sources about the 1821 merger. Who benefited? Who lost out?", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Which company had the better strategy? Did the 'winner' have the best strategy?",
      "How did Indigenous peoples use the competition to their advantage?",
      "Was the merger good or bad for Canada? For Indigenous peoples? For employees?",
      "How did this competition shape the geography of Canada (where cities are located, etc.)?",
      "What modern business rivalries are similar to the HBC-NWC competition?"
    ],
    assessment: "Write an analysis of the merger from the perspective of one stakeholder group (HBC shareholders, NWC partners, voyageurs, Indigenous traders, or Metis peoples).",
    extensions: "Research George Simpson, who ran the merged company. How did his policies affect Indigenous peoples and company employees?",
    isPublished: true
  },
  {
    title: "Indigenous Perspectives on European Contact",
    description: "Analyze primary and secondary sources to understand how Indigenous peoples experienced and responded to the arrival of European traders and the fur trade.",
    gradeLevel: "7-9",
    topic: "Indigenous Routes",
    estimatedMinutes: 70,
    objectives: [
      "Analyze Indigenous perspectives on European contact",
      "Evaluate the impacts of the fur trade on Indigenous societies",
      "Examine how Indigenous peoples shaped the fur trade",
      "Practice critical analysis of historical sources"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Indigenous Perspectives", expectation: "Analyze the impact of European contact from Indigenous perspectives" },
      { subject: "Social Studies", strand: "Citizenship", expectation: "Examine issues from multiple perspectives" },
      { subject: "Language", strand: "Critical Literacy", expectation: "Analyze point of view and bias in texts" }
    ],
    materials: [
      "Primary sources from Indigenous oral traditions",
      "Excerpts from fur trade journals (describing Indigenous perspectives)",
      "Maps showing Indigenous territories",
      "Secondary source readings on Indigenous responses to contact"
    ],
    introduction: "Show students a painting of a fur trade scene from the European perspective. Ask: 'Whose story is this painting telling? Whose story is missing?' Explain that understanding history requires hearing all voices.",
    mainContent: `## Indigenous Perspectives: The Fur Trade from the Other Side

### Before Contact
Indigenous peoples had sophisticated societies before Europeans arrived:
- Complex trade networks spanning the continent
- Diverse economies (hunting, fishing, agriculture, trade)
- Elaborate systems of governance and diplomacy
- Deep spiritual relationships with the land and animals

### First Encounters
How did Indigenous peoples interpret the arrival of Europeans?
- Some nations had prophesies about newcomers
- Europeans were often seen as spiritually powerful but socially awkward
- Trade goods were valued but so were relationships
- Alliance-making was more important than simple trade

### Indigenous Agency in the Fur Trade
Indigenous peoples were not passive participants:
- They decided whether, when, and with whom to trade
- They set many of the terms of trade
- They provided essential knowledge, skills, and labor
- They shaped the geography of the trade (posts were built where Indigenous peoples gathered)

### The Ceremonial Aspect
For Indigenous peoples, trade was not just economic:
- Gift-giving established relationships
- Pipe ceremonies preceded trade
- Personal relationships mattered more than prices
- Dishonest traders were remembered and avoided

### Changes and Continuities
The fur trade brought significant changes:
- New technologies (metal tools, guns, cloth)
- New trade relationships and alliances
- New diseases (devastating epidemics)
- Increased conflict over trade territories
- Economic dependency on European goods

But much continued:
- Seasonal rhythms of hunting and gathering
- Family and clan structures
- Spiritual beliefs and practices
- Kinship-based decision making

### Oral Tradition Sources
Indigenous oral traditions remember the fur trade differently than written records:
- Emphasize relationships over transactions
- Remember personalities, not just events
- Pass down warnings about untrustworthy traders
- Preserve alternative interpretations of key events

### The Question of Impact
Historians debate the impact of the fur trade:
- Did it destroy Indigenous societies or were they resilient?
- Were Indigenous peoples victims or active participants?
- How do we weigh negative and positive impacts?
- Whose voice should we privilege in answering these questions?`,
    activities: [
      { name: "Source Comparison", description: "Compare a European account of a fur trade event with an Indigenous oral tradition of the same event. What's different?", duration: "20 minutes" },
      { name: "Perspective Writing", description: "Rewrite a European fur trade account from an Indigenous perspective.", duration: "15 minutes" },
      { name: "Impact Analysis", description: "Create a balanced chart of positive and negative impacts of the fur trade on Indigenous peoples.", duration: "15 minutes" },
      { name: "Voice Analysis", description: "Analyze whose voices are present and absent in textbook accounts of the fur trade.", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Why is it important to include Indigenous perspectives in fur trade history?",
      "How might the fur trade look different if Indigenous peoples had written the history?",
      "Were Indigenous peoples victims of the fur trade or active participants who shaped it?",
      "How can we learn about Indigenous perspectives when most written records were created by Europeans?",
      "What responsibilities do historians have when writing about Indigenous peoples?"
    ],
    assessment: "Write an essay analyzing the fur trade from an Indigenous perspective, using both primary sources and secondary source analysis.",
    extensions: "Interview an Elder or Indigenous historian (or read an interview) about how their community remembers the fur trade era. Compare with textbook accounts.",
    isPublished: true
  },
  {
    title: "The Northwest Passage: Dreams and Disasters",
    description: "Explore the centuries-long search for the Northwest Passage, culminating in the tragic Franklin expedition and its modern archaeological discoveries.",
    gradeLevel: "7-9",
    topic: "Maritime Discovery",
    estimatedMinutes: 75,
    objectives: [
      "Understand why Europeans sought a Northwest Passage",
      "Analyze the Franklin expedition's failures and their causes",
      "Evaluate the role of Inuit knowledge in Arctic exploration",
      "Connect historical events to modern archaeological discoveries"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Exploration", expectation: "Analyze the motivations and impacts of Arctic exploration" },
      { subject: "Science", strand: "Scientific Method", expectation: "Understand how evidence supports historical conclusions" },
      { subject: "Geography", strand: "Physical Geography", expectation: "Understand Arctic environments and their challenges" }
    ],
    materials: [
      "Maps of Arctic exploration routes",
      "Images of HMS Erebus and Terror",
      "Primary sources from Franklin expedition",
      "News articles about recent discoveries"
    ],
    introduction: "Show students a map of the Arctic with the Northwest Passage marked. Ask: 'Why would finding a water route through here be valuable enough to risk death for?' Explain that the search for this passage became an obsession that cost many lives.",
    mainContent: `## The Northwest Passage: A 400-Year Quest

### Why the Northwest Passage?
For centuries, Europeans dreamed of a sea route through North America:
- Would be a shortcut to Asia (China, India, Spice Islands)
- Would avoid Spanish-controlled southern routes
- Would bring enormous wealth to whoever controlled it
- Became a matter of national pride

### Early Searches
- 1497: John Cabot - disappeared on second voyage
- 1576-1578: Martin Frobisher - explored Baffin Island
- 1610-1611: Henry Hudson - discovered Hudson Bay, crew mutinied
- 1819-1827: William Parry - came closest before Franklin

### The Franklin Expedition (1845)
Sir John Franklin sailed with the best-equipped expedition ever:
- Two ships: HMS Erebus and HMS Terror
- 129 officers and men
- Three years of supplies
- Steam engines and screw propellers
- Libraries, silver place settings, and fine china

What went wrong?
- Ships became trapped in ice near King William Island (1846)
- Franklin died in 1847
- Men abandoned ships in 1848
- All 129 men eventually died

### Causes of Disaster
- Ice conditions worse than expected
- Lead poisoning from poorly soldered food tins
- Scurvy from lack of fresh food
- Refusal to adopt Inuit survival techniques
- Pride and inflexibility

### The Search for Franklin
The disappearance triggered the largest search in exploration history:
- Over 30 expeditions launched
- Lady Franklin spent her fortune funding searches
- Inuit oral tradition provided crucial information
- Some remains and artifacts found, but ships remained lost

### Inuit Knowledge
The Inuit knew what had happened:
- Oral traditions described meetings with starving men
- Described where ships had sunk
- This knowledge was often dismissed by Europeans
- Eventually proved accurate

### Modern Discoveries
- 2014: HMS Erebus discovered in Queen Maud Gulf
- 2016: HMS Terror discovered in Terror Bay
- Both ships found where Inuit oral tradition said they would be
- Ongoing archaeological research revealing new information

### Lessons of the Franklin Expedition
- Technology cannot overcome nature
- Local knowledge should not be dismissed
- Flexibility and adaptation are essential for survival
- Pride can be fatal`,
    activities: [
      { name: "Decision Analysis", description: "Analyze key decisions made by Franklin and his officers. What could they have done differently?", duration: "15 minutes" },
      { name: "Source Comparison", description: "Compare European written records with Inuit oral traditions about the expedition. What does each reveal?", duration: "20 minutes" },
      { name: "Archaeological Evidence", description: "Analyze how modern archaeological discoveries have changed our understanding of the expedition.", duration: "15 minutes" },
      { name: "Debate", description: "Debate: Should the search for Franklin have been called off earlier? Was the expense justified?", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Why did the Franklin expedition fail despite having the best equipment available?",
      "Why were European explorers so reluctant to learn from Inuit peoples?",
      "What does the discovery of the ships tell us that we didn't know before?",
      "Is it appropriate to disturb the remains of the Franklin expedition for research?",
      "What lessons does the Franklin expedition have for modern challenges?"
    ],
    assessment: "Write an analysis of the Franklin expedition disaster, evaluating the relative importance of different factors (weather, leadership, technology, cultural attitudes) in causing the tragedy.",
    extensions: "Research current climate change impacts on the Northwest Passage. How is the passage that Franklin died seeking now becoming navigable?",
    isPublished: true
  },
  {
    title: "Country Marriages and Metis Identity",
    description: "Explore the social history of the fur trade through the institution of 'country marriage,' examining how these unions created the Metis nation and shaped Canadian society.",
    gradeLevel: "7-9",
    topic: "Metis History",
    estimatedMinutes: 65,
    objectives: [
      "Understand what country marriages were and their significance",
      "Analyze how these marriages created the Metis nation",
      "Examine changing attitudes toward mixed-race families",
      "Evaluate the social and cultural impacts of fur trade relationships"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Social History", expectation: "Analyze social relationships in historical contexts" },
      { subject: "Social Studies", strand: "Identity", expectation: "Examine how identity is shaped by culture and history" },
      { subject: "Civics", strand: "Rights and Responsibilities", expectation: "Analyze changing concepts of rights and belonging" }
    ],
    materials: [
      "Primary sources about country marriages",
      "Family trees of fur trade families",
      "Excerpts from George Simpson's correspondence",
      "Readings on Metis identity formation"
    ],
    introduction: "Ask students: 'What makes a marriage legitimate?' Explain that in the fur trade era, there were different answers to this question, and those answers had enormous consequences for families and for Canada.",
    mainContent: `## Country Marriages: Love, Strategy, and Identity

### What Was a Country Marriage?
Country marriages (marriages "a la facon du pays" - in the custom of the country) were unions between European fur traders and Indigenous women. These marriages:
- Were conducted according to Indigenous customs
- Were recognized by Indigenous communities and fur trade posts
- Were NOT recognized by European law or churches
- Created family networks that shaped the fur trade

### Why Country Marriages Happened
For traders:
- Provided essential domestic labor
- Created trade alliances with Indigenous nations
- Offered companionship in isolated posts
- Sometimes genuine love and partnership

For Indigenous women and their families:
- Access to trade goods
- Alliance with powerful traders
- Sometimes genuine love and partnership
- Children would have connections to both worlds

### The Reality of Country Marriages
These marriages ranged from:
- Loving, lifelong partnerships (like David Thompson and Charlotte Small)
- Business arrangements that benefited both parties
- Exploitative relationships that harmed Indigenous women
- Temporary unions abandoned when traders returned to Europe

### The Birth of the Metis Nation
Children of these marriages became a new people:
- Not fully European, not fully Indigenous
- Developed distinct culture, language (Michif), and identity
- Eventually formed their own nation
- The Metis are now recognized as one of Canada's three Indigenous peoples

### Changing Attitudes
Attitudes toward country marriages changed over time:
- Early fur trade: Accepted and even encouraged
- Early 1800s: Growing respectability concerns
- 1830s-1840s: White women began arriving; mixed marriages stigmatized
- Victorian era: Country wives and Metis children marginalized

### George Simpson's "Country Wives"
George Simpson, HBC governor, exemplifies changing attitudes:
- Had multiple country wives and children
- Abandoned them when he brought a European wife to Canada
- His policies marginalized country wives and Metis
- His own children by Indigenous women were denied inheritance

### The Human Cost
When country marriages were abandoned:
- Women were often left destitute
- Children lost status and opportunities
- Families were broken apart
- The emerging Metis nation faced discrimination

### Legacy
Country marriages left lasting impacts:
- Created the Metis nation
- Many prominent Canadian families have mixed heritage
- Raised questions about legitimacy, identity, and belonging
- Shaped debates about Indigenous rights that continue today`,
    activities: [
      { name: "Case Study Analysis", description: "Analyze the marriages of David Thompson, George Simpson, and one other trader. How did they treat their families?", duration: "20 minutes" },
      { name: "Primary Source Analysis", description: "Read excerpts about attitudes toward country marriages. How and why did attitudes change?", duration: "15 minutes" },
      { name: "Identity Discussion", description: "Discuss: What makes someone Metis? How is identity determined?", duration: "15 minutes" },
      { name: "Perspective Writing", description: "Write from the perspective of a country wife whose husband has brought a European wife to Canada.", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Were country marriages primarily about love, economics, or alliance-building?",
      "Why did attitudes toward country marriages change over time?",
      "How did country marriages contribute to the emergence of Metis identity?",
      "What responsibilities did traders have to their country wives and children?",
      "How do historical attitudes about race and legitimacy continue to affect society today?"
    ],
    assessment: "Write an essay analyzing how country marriages contributed to the emergence of Metis identity, using specific examples from fur trade history.",
    extensions: "Research how Metis identity is defined today. What criteria are used? How do current debates connect to the history of country marriages?",
    isPublished: true
  }
];

// ==================== 10-12 LESSON PLANS ====================

const grades1012LessonPlans: LessonPlanData[] = [
  {
    title: "Mapping Canada: The Work of David Thompson",
    description: "An advanced examination of David Thompson's surveying methods, his relationships with Indigenous peoples, and his enduring contributions to North American cartography.",
    gradeLevel: "10-12",
    topic: "Cartography",
    estimatedMinutes: 90,
    objectives: [
      "Analyze the surveying techniques Thompson used and their accuracy",
      "Evaluate Thompson's relationships with Indigenous peoples",
      "Assess Thompson's historical reputation and why it has changed",
      "Apply critical analysis to primary sources from Thompson's journals"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Historical Inquiry", expectation: "Apply historical thinking concepts to analyze primary sources" },
      { subject: "Geography", strand: "Spatial Skills", expectation: "Understand mapping techniques and their evolution" },
      { subject: "Physics", strand: "Measurement", expectation: "Understand scientific methods of determining position" }
    ],
    materials: [
      "Excerpts from Thompson's journals",
      "Thompson's maps compared to modern satellite imagery",
      "Surveying instruments (or images)",
      "Scholarly articles on Thompson's legacy"
    ],
    introduction: "Display Thompson's master map alongside a Google Earth image of the same region. Ask: 'This map was made with no satellites, no airplanes, no cameras - just stars, a sextant, and years of walking. How is this possible, and why don't we know the name of the person who made it?'",
    mainContent: `## David Thompson: The Greatest Land Geographer

### Thompson's Life and Training
- Born in London, 1770, orphaned young, educated at Grey Coat School
- Apprenticed to the HBC at age 14
- Blinded in one eye in an accident (1789) - learned surveying during recovery
- Trained by Philip Turnor, the HBC's official surveyor
- Left HBC for NWC in 1797 (more freedom to explore)
- Married Charlotte Small, 1799

### Thompson's Scientific Method
Thompson's mapping was remarkably systematic:
1. **Celestial Observations** - Every clear night, measured angles to stars with a sextant
2. **Time Keeping** - Maintained precise chronometers to calculate longitude
3. **Dead Reckoning** - Calculated distance from direction and estimated travel speed
4. **Cross-Checking** - Used multiple methods to verify positions
5. **Documentation** - Kept meticulous journals (77 volumes survive)

### The Mathematics of Position
- Latitude: Measured by the angle of Polaris (North Star) or the sun at noon
- Longitude: Required accurate timekeeping and astronomical tables
- Thompson's positions were typically accurate to within minutes of arc
- His maps remained the standard for 100+ years

### Relationship with Indigenous Peoples
Thompson's approach was distinctive:
- Learned Indigenous languages (spoke fluent Cree, some others)
- Relied on Indigenous guides and knowledge
- Recorded Indigenous place names
- His Metis family gave him insider status
- More respectful than many contemporaries, but still a colonizer

### Charlotte Small's Role
Thompson's success was inseparable from his wife Charlotte:
- Served as interpreter and cultural mediator
- Maintained relationships that allowed safe travel
- Traveled over 10,000 miles during surveys
- Raised 13 children, many born in the wilderness
- Her contributions are rarely acknowledged

### Major Achievements
- Mapped 3.9 million km2 of North America
- First to navigate the entire Columbia River
- Found the Athabasca Pass across the Rockies
- Created the first accurate map of western Canada
- His Great Map (1814) was 10 feet wide

### Why Thompson Is Not Famous
- He didn't seek fame or write popular accounts
- Spent final years in poverty, his achievements unrecognized
- His maps were used by others who got the credit
- J.B. Tyrrell "rediscovered" Thompson's journals in 1888
- Reputation has grown over the 20th and 21st centuries

### Historiographical Questions
Historians debate:
- How should we assess Thompson's relationships with Indigenous peoples?
- Did his reliance on Indigenous knowledge diminish or enhance his achievements?
- How do we credit Charlotte Small's contributions?
- What does Thompson's obscurity tell us about how we construct historical memory?`,
    activities: [
      { name: "Primary Source Analysis", description: "Analyze excerpts from Thompson's journals. What do they reveal about his methods, attitudes, and experiences?", duration: "25 minutes" },
      { name: "Map Comparison", description: "Compare Thompson's maps to modern satellite imagery. Analyze accuracy and sources of error.", duration: "20 minutes" },
      { name: "Reputation Analysis", description: "Analyze how Thompson's reputation has changed over time. Why is he better known now than in his own time?", duration: "20 minutes" },
      { name: "Attribution Debate", description: "Debate: How should we credit Indigenous knowledge in Thompson's achievements?", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Why is Thompson less famous than explorers whose achievements were smaller?",
      "How should we credit Indigenous contributions to Thompson's work?",
      "How do we assess historical figures who were progressive for their time but would not meet current standards?",
      "What does Thompson's story tell us about how historical reputations are made?",
      "Why did Thompson die in poverty while his maps made others wealthy?"
    ],
    assessment: "Write a historiographical essay analyzing how interpretations of Thompson have changed over time and evaluating the relative contributions of Thompson, Charlotte Small, and Indigenous guides to his achievements.",
    extensions: "Research current debates about how to credit Indigenous knowledge in scientific achievements. How do these debates apply to historical cases like Thompson?",
    isPublished: true
  },
  {
    title: "The Economics of Empire: Mercantilism and the Fur Trade",
    description: "Analyze the fur trade as a case study in mercantilist economics, examining how economic theories shaped colonial policy and Indigenous relations.",
    gradeLevel: "10-12",
    topic: "Fur Trade",
    estimatedMinutes: 85,
    objectives: [
      "Understand mercantilist economic theory and its application to the fur trade",
      "Analyze how the HBC charter created a monopoly",
      "Evaluate the economic impacts of the fur trade on all parties",
      "Compare mercantilist and modern economic perspectives"
    ],
    curriculumConnections: [
      { subject: "Economics", strand: "Economic Systems", expectation: "Analyze different economic systems and their effects" },
      { subject: "History", strand: "Economic History", expectation: "Analyze economic factors in historical developments" },
      { subject: "Political Science", strand: "Political Economy", expectation: "Understand the relationship between politics and economics" }
    ],
    materials: [
      "Excerpts from the HBC charter",
      "Economic data on the fur trade",
      "Price lists and trade goods inventories",
      "Scholarly readings on mercantilist theory"
    ],
    introduction: "Ask: 'Why would a king give a private company control over an area larger than Western Europe?' Explain that the answer lies in mercantilist economic theory, which shaped European colonialism for centuries.",
    mainContent: `## The Economics of Empire: Mercantilism and the Fur Trade

### Mercantilist Theory
Mercantilism dominated European economic thinking from 1500-1800:
- A nation's wealth was measured in gold and silver
- Trade should benefit the home country (export more than import)
- Colonies existed to enrich the mother country
- Monopolies helped control trade
- Competition was seen as wasteful

### The HBC Charter (1670)
The Hudson's Bay Company charter was a mercantilist document:
- Granted monopoly over all lands draining into Hudson Bay (Rupert's Land)
- Company could make laws, wage war, and negotiate treaties
- All trade had to benefit England
- In exchange, the Company paid the Crown two elk and two black beavers per year (if asked)

### The Fur Trade as Mercantilist Enterprise
The fur trade fit mercantilist goals perfectly:
- Extracted valuable resources (furs) from colonies
- Processed in England (hat-making)
- Sold throughout Europe for profit
- Required few settlers (unlike agriculture)
- Indigenous peoples did the "production" (trapping)

### Who Profited?
**London Shareholders:**
- Received dividends when trade was profitable
- Risks were spread among investors
- Controlled the Company from afar

**Company Employees:**
- Low wages but secure employment
- Advancement was possible
- Many stayed in Canada permanently

**Indigenous Peoples:**
- Gained access to European goods
- Maintained control of trapping and trading (initially)
- But became increasingly dependent on trade goods
- Suffered devastating epidemics

### The Question of "Fair Trade"
Was the Made Beaver system fair?
- Indigenous peoples set many of the terms
- But traders manipulated prices
- Alcohol was used to influence trades
- Long-term economic dependency was harmful
- How do we measure fairness across cultures?

### Competition vs. Monopoly
When the NWC challenged the HBC monopoly:
- Prices paid to Indigenous trappers rose
- Quality of goods improved
- But wasteful competition depleted beaver populations
- Violence increased

After the 1821 merger:
- Monopoly restored
- Prices paid to trappers fell
- Company profits increased
- Indigenous peoples had no alternatives

### The End of Mercantilism
By 1870, mercantilist thinking was obsolete:
- Free trade ideology dominant
- HBC's monopoly indefensible
- Rupert's Land sold to Canada
- But the economic patterns persisted

### Legacy
The fur trade's economic structures shaped Canada:
- Resource extraction economy
- Dependent on external markets
- Indigenous peoples marginalized economically
- Wealth concentrated in central Canada and Britain`,
    activities: [
      { name: "Charter Analysis", description: "Analyze the HBC charter. What powers did it grant? How did it reflect mercantilist thinking?", duration: "20 minutes" },
      { name: "Trade Simulation", description: "Simulate fur trade negotiations with different power relationships. How do monopoly vs. competition affect outcomes?", duration: "25 minutes" },
      { name: "Stakeholder Analysis", description: "Analyze the fur trade from the perspective of different stakeholders. Who gained, who lost?", duration: "20 minutes" },
      { name: "Economic Comparison", description: "Compare mercantilist and modern free-market perspectives on the fur trade.", duration: "15 minutes" }
    ],
    discussionQuestions: [
      "Was the fur trade economically beneficial for Indigenous peoples? In the short term? Long term?",
      "How did the monopoly structure affect all parties in the trade?",
      "Can we judge 17th-century economics by modern standards?",
      "How did mercantilist thinking shape the development of Canada?",
      "What economic patterns from the fur trade era persist today?"
    ],
    assessment: "Write an economic analysis of the fur trade, evaluating its effects on different stakeholders and comparing mercantilist and modern economic interpretations.",
    extensions: "Research the concept of 'staples theory' in Canadian economic history. How does the fur trade fit this model?",
    isPublished: true
  },
  {
    title: "Historiography of the Fur Trade",
    description: "Examine how historical interpretations of the fur trade have changed over time, from triumphalist narratives to Indigenous perspectives and postcolonial critiques.",
    gradeLevel: "10-12",
    topic: "Fur Trade",
    estimatedMinutes: 90,
    objectives: [
      "Understand historiography as the study of how history is written",
      "Trace major shifts in fur trade historiography",
      "Analyze how perspective shapes historical interpretation",
      "Evaluate competing historical narratives"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Historical Thinking", expectation: "Analyze how historical narratives are constructed" },
      { subject: "Social Studies", strand: "Critical Thinking", expectation: "Evaluate sources for perspective and bias" },
      { subject: "Indigenous Studies", strand: "Representation", expectation: "Analyze how Indigenous peoples are represented in scholarship" }
    ],
    materials: [
      "Excerpts from different eras of fur trade scholarship",
      "Comparison of textbook treatments over time",
      "Indigenous historians' critiques",
      "Scholarly articles on historiographical debates"
    ],
    introduction: "Show students two accounts of the same fur trade event written 100 years apart. Ask: 'These are both supposed to be history, but they're very different. Which one is right? Or are they both right? Or both wrong?'",
    mainContent: `## Historiography: How the Story Changes

### What is Historiography?
Historiography is the study of how history is written - the history of history itself. It asks:
- Who writes history and why?
- What sources do they use?
- What assumptions shape their interpretations?
- How do present concerns shape views of the past?

### Phase 1: Triumphalist History (1850s-1930s)
Early fur trade history celebrated European achievement:
- Focus on heroic explorers and traders
- Indigenous peoples as either "noble savages" or obstacles
- The fur trade as bringing "civilization" to the wilderness
- Women almost entirely absent

Example: Harold Innis's "The Fur Trade in Canada" (1930) - brilliant economic analysis but focuses entirely on European actors

### Phase 2: Business and Economic History (1930s-1960s)
The fur trade studied as economic system:
- Focus on company records and economics
- Indigenous peoples as suppliers of raw materials
- More sophisticated analysis, but still Eurocentric
- Women still marginal

### Phase 3: Social History Revolution (1970s-1980s)
New questions about everyday life:
- Attention to workers, women, and families
- "Country marriages" studied seriously
- Material culture and daily life explored
- But Indigenous peoples still often studied through European sources

Sylvia Van Kirk's "Many Tender Ties" (1980) - pioneered study of women in the fur trade

### Phase 4: Indigenous Agency (1990s-2000s)
Indigenous peoples as active participants:
- Oral histories used alongside written sources
- Indigenous perspectives centered
- Trade studied as cultural exchange, not just economics
- Recognition that Indigenous peoples shaped the trade

### Phase 5: Postcolonial Critiques (2000s-Present)
Critical examination of colonialism:
- Fur trade as part of settler colonialism
- Environmental impacts studied
- Long-term effects on Indigenous societies
- Questions about historical injustice and reconciliation

### Key Historiographical Debates

**The Impact Debate:**
Did the fur trade destroy Indigenous societies (dependency theory) or were Indigenous peoples resilient and adaptive?

**The Agency Debate:**
Were Indigenous peoples victims or active participants who shaped the trade?

**The Gender Debate:**
How central were women's contributions, and why were they overlooked?

**The Periodization Debate:**
When did the fur trade "end"? Did it ever really end?

### Who Writes History Matters
Indigenous historians have challenged established narratives:
- Oral traditions as valid historical sources
- Different questions about what matters
- Challenge to European ways of knowing
- History as relationship, not just facts

### Implications
How we tell the fur trade story affects:
- How we understand Canadian identity
- Indigenous peoples' claims to rights and territory
- How we teach young people about their country
- How we think about reconciliation`,
    activities: [
      { name: "Source Comparison", description: "Compare treatments of the same event in sources from different eras. How has the narrative changed?", duration: "25 minutes" },
      { name: "Historiographical Timeline", description: "Create a timeline of major shifts in fur trade historiography, identifying key works and turning points.", duration: "20 minutes" },
      { name: "Perspective Analysis", description: "Analyze a scholarly article for its perspective, assumptions, and blind spots.", duration: "20 minutes" },
      { name: "Textbook Analysis", description: "Compare how fur trade is treated in textbooks from different decades.", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Can we ever write truly 'objective' history, or is all history shaped by perspective?",
      "What are the implications of studying Indigenous peoples primarily through European sources?",
      "How should present concerns (like reconciliation) shape how we study the past?",
      "Is there a 'correct' way to tell the story of the fur trade?",
      "What are the responsibilities of historians writing about colonialism?"
    ],
    assessment: "Write a historiographical essay analyzing how interpretations of one aspect of the fur trade (your choice) have changed over time, evaluating the strengths and weaknesses of different approaches.",
    extensions: "Interview historians or examine the methodology section of recent fur trade scholarship. How do contemporary historians approach these challenges?",
    isPublished: true
  },
  {
    title: "Indigenous Sovereignty and Treaty Rights",
    description: "Examine the legal and political dimensions of Indigenous-Crown relations during the fur trade era and their continuing significance for Indigenous rights today.",
    gradeLevel: "10-12",
    topic: "Indigenous Routes",
    estimatedMinutes: 90,
    objectives: [
      "Understand Indigenous concepts of sovereignty and land tenure",
      "Analyze the legal foundations of Crown-Indigenous relations",
      "Evaluate the numbered treaties and their ongoing significance",
      "Connect historical treaties to contemporary Indigenous rights"
    ],
    curriculumConnections: [
      { subject: "Law", strand: "Constitutional Law", expectation: "Analyze the legal status of Indigenous peoples" },
      { subject: "Political Science", strand: "Sovereignty", expectation: "Understand concepts of sovereignty and self-determination" },
      { subject: "History", strand: "Legal History", expectation: "Analyze the development of treaty relationships" }
    ],
    materials: [
      "Excerpts from the Royal Proclamation of 1763",
      "Numbered treaty texts",
      "Supreme Court decisions on treaty rights",
      "Indigenous perspectives on treaties"
    ],
    introduction: "Display a map showing the numbered treaties. Ask: 'These treaties were signed over 100 years ago. Why are they still in the news almost every week?' Explain that understanding the fur trade era is essential to understanding Indigenous rights today.",
    mainContent: `## Indigenous Sovereignty and Treaty Rights

### Indigenous Sovereignty Before Contact
Before European contact, Indigenous nations were sovereign:
- Controlled their own territories
- Made their own laws
- Conducted diplomacy with other nations
- Had sophisticated governance systems

The fur trade initially REQUIRED Indigenous consent - traders couldn't survive without Indigenous cooperation.

### The Royal Proclamation of 1763
After the British conquered New France, the Royal Proclamation established:
- Indigenous peoples had rights to their lands
- Only the Crown could purchase Indigenous lands
- Treaties required for settlement
- Called the "Indian Bill of Rights"

Why? Britain needed Indigenous allies and wanted orderly expansion.

### The Treaty Relationship
The Crown and Indigenous nations entered treaties that:
- Were nation-to-nation agreements
- Involved ceremony, negotiation, and consent
- Created ongoing relationships, not one-time transactions
- Remain constitutionally protected today

### The Numbered Treaties (1871-1921)
Eleven numbered treaties covered most of western and northern Canada:
- Signed as Canada expanded westward
- Crown gained land access
- Indigenous peoples retained rights to hunt, fish, and trap
- Reserve lands set aside
- Annual payments and other provisions

### Two Views of Treaties

**Crown View:**
- Land was surrendered
- Indigenous peoples became wards of the government
- Treaties were final

**Indigenous View:**
- Land cannot be surrendered (it's not property)
- Treaties were agreements to share, not surrender
- Oral promises are as binding as written text
- Treaties created ongoing relationships

### The Problem of Understanding
Written treaties don't capture what Indigenous negotiators understood:
- Oral promises made at negotiations weren't recorded
- Indigenous concepts of land didn't translate to English legal terms
- Interpreters may have misrepresented terms
- Power imbalance affected negotiations

### Modern Treaty Rights
Treaties remain legally binding:
- Section 35 of the Constitution Act (1982) protects treaty rights
- Courts have expanded treaty interpretation
- Duty to consult on development affecting treaty lands
- Treaty rights cannot be extinguished without consent

### Key Court Cases
- **Calder (1973)** - Aboriginal title exists
- **Sparrow (1990)** - Aboriginal rights are constitutionally protected
- **Haida Nation (2004)** - Crown has duty to consult
- **Tsilhqot'in (2014)** - Aboriginal title over specific territory declared

### The Fur Trade Connection
The fur trade era established patterns that persist:
- Crown-Indigenous relationships
- Resource extraction on Indigenous lands
- Disputes over territory and rights
- Questions of consent and consultation

### Reconciliation
Understanding treaties is essential for reconciliation:
- Truth and Reconciliation Commission calls to action
- United Nations Declaration on Rights of Indigenous Peoples
- Implementation of treaty rights
- New relationship-building`,
    activities: [
      { name: "Treaty Analysis", description: "Analyze the text of a numbered treaty. What did each party gain? What might have been misunderstood?", duration: "25 minutes" },
      { name: "Court Case Study", description: "Analyze a major Supreme Court decision on treaty rights. How did the Court interpret the historical relationship?", duration: "20 minutes" },
      { name: "Perspective Comparison", description: "Compare Crown and Indigenous interpretations of a specific treaty. How do they differ?", duration: "20 minutes" },
      { name: "Current Events Connection", description: "Find a current news story about treaty rights. How does understanding history help explain the issue?", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Were the numbered treaties fair? By what standards should we judge them?",
      "How should we interpret treaties today - by what was written, or by what Indigenous peoples understood?",
      "What are the implications of recognizing Indigenous sovereignty?",
      "How does understanding the fur trade era help us understand current Indigenous rights issues?",
      "What would genuine reconciliation require?"
    ],
    assessment: "Write a legal/historical analysis of a specific treaty issue, examining both historical context and contemporary implications.",
    extensions: "Attend a public event related to Indigenous rights or treaty implementation. Write a reflection connecting the event to historical content studied in class.",
    isPublished: true
  },
  {
    title: "Environmental Impact of the Fur Trade",
    description: "Analyze the environmental history of the fur trade, examining how it transformed ecosystems and shaped human-environment relationships across North America.",
    gradeLevel: "10-12",
    topic: "Fur Trade",
    estimatedMinutes: 80,
    objectives: [
      "Analyze the environmental impacts of the fur trade",
      "Understand how market forces affected wildlife populations",
      "Examine Indigenous environmental knowledge and practices",
      "Connect historical environmental changes to contemporary issues"
    ],
    curriculumConnections: [
      { subject: "Environmental Science", strand: "Human Impact", expectation: "Analyze human effects on ecosystems" },
      { subject: "History", strand: "Environmental History", expectation: "Analyze environmental factors in historical change" },
      { subject: "Geography", strand: "Human-Environment Interaction", expectation: "Understand how human activities transform environments" }
    ],
    materials: [
      "Maps showing beaver population changes",
      "Historical data on fur harvests",
      "Readings on environmental history",
      "Case studies of ecosystem changes"
    ],
    introduction: "Show students a graph of beaver populations over time. Ask: 'The beaver was nearly extinct by 1900 after hundreds of years of the fur trade. What can this tell us about how economics affects the environment?'",
    mainContent: `## Environmental Impact of the Fur Trade

### The Pre-Contact Environment
Before European contact, North American ecosystems were shaped by Indigenous management:
- Fire used to manage landscapes
- Hunting and fishing sustainably regulated
- Spiritual beliefs limited over-harvesting
- Human activities integrated into ecological cycles

### The Beaver: An Ecological Case Study

**Before the Fur Trade:**
- 60-400 million beavers in North America
- Beaver dams created wetlands covering millions of acres
- These wetlands filtered water, prevented floods, created habitat

**During the Fur Trade:**
- Millions of beavers killed annually
- Populations collapsed region by region
- Traders moved west as eastern populations depleted
- By 1900, beavers nearly extinct in most areas

**Ecological Consequences:**
- Wetlands drained as dams decayed
- Water tables dropped
- Flooding increased
- Habitat for countless species lost
- Entire ecosystems transformed

### Market Forces and Wildlife
The fur trade introduced new pressures:
- Indigenous hunting integrated into global markets
- Demand from Europe seemed unlimited
- Competition between HBC and NWC encouraged over-harvesting
- Short-term profit versus long-term sustainability

### The Buffalo Collapse
The buffalo (bison) faced similar pressures:
- Commercial hunting for robes and tongues
- Railways divided herds and brought hunters
- From 30-60 million to near extinction by 1885
- Metis and Plains peoples lost their economic foundation

### Indigenous Environmental Knowledge
Indigenous peoples had sophisticated environmental knowledge:
- Understanding of animal populations and cycles
- Conservation practices (leaving some animals to breed)
- Territorial systems that prevented over-harvesting
- Spiritual beliefs that regulated hunting

### What Changed?
The fur trade disrupted Indigenous conservation:
- Market incentives encouraged maximum harvest
- Competition made conservation costly
- Dependency on trade goods required continued trapping
- Epidemic diseases reduced Indigenous populations and knowledge

### The Company's Response
Both HBC and NWC recognized the problem:
- Attempted to regulate harvests
- Created "beaver preserves" where hunting was banned
- But competition undermined conservation efforts
- George Simpson's HBC tried more systematic management

### Long-Term Environmental Changes
The fur trade's environmental impacts persist:
- Altered ecosystems across the continent
- Species distributions changed
- Water systems transformed
- Some changes are only now being reversed

### Modern Parallels
The fur trade offers lessons for today:
- Market forces can drive environmental destruction
- Short-term profit versus long-term sustainability
- Indigenous knowledge valuable for conservation
- Ecosystem services (what beavers provide) have economic value

### The Recovery
Beaver populations have partially recovered:
- Conservation efforts beginning in early 1900s
- Beavers now used for ecosystem restoration
- Wetlands being recreated
- But full recovery impossible - the landscape has changed`,
    activities: [
      { name: "Data Analysis", description: "Analyze historical data on fur harvests and beaver populations. What patterns emerge?", duration: "20 minutes" },
      { name: "Ecosystem Mapping", description: "Map the cascade of ecological effects from beaver population decline.", duration: "15 minutes" },
      { name: "Comparative Analysis", description: "Compare Indigenous and European approaches to wildlife management. What were the differences?", duration: "20 minutes" },
      { name: "Modern Connection", description: "Research current beaver reintroduction programs. How is historical knowledge being applied?", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Were the environmental impacts of the fur trade inevitable, or could they have been prevented?",
      "How did market forces override Indigenous conservation practices?",
      "What can the fur trade teach us about current environmental challenges?",
      "How should we value ecosystem services like those provided by beavers?",
      "Is it possible to have sustainable resource extraction?"
    ],
    assessment: "Write an environmental history of a specific ecosystem affected by the fur trade, analyzing causes and consequences of environmental change.",
    extensions: "Research current debates about wildlife management in Canada. How do historical patterns continue to shape these debates?",
    isPublished: true
  },
  {
    title: "The Fall of New France: 1760",
    description: "Analyze the military, political, and social factors that led to the British conquest of New France, and examine its consequences for French Canadians, Indigenous peoples, and the fur trade.",
    gradeLevel: "10-12",
    topic: "Early Explorers",
    estimatedMinutes: 85,
    objectives: [
      "Analyze the causes of the Seven Years' War in North America",
      "Evaluate the military campaigns that led to British victory",
      "Examine the consequences of the conquest for different groups",
      "Assess the long-term impacts on Canadian history"
    ],
    curriculumConnections: [
      { subject: "History", strand: "Conflict and Change", expectation: "Analyze the causes and consequences of major conflicts" },
      { subject: "Political Science", strand: "Empire and Colony", expectation: "Understand colonial relationships and their transformations" },
      { subject: "Geography", strand: "Political Geography", expectation: "Analyze how political boundaries change" }
    ],
    materials: [
      "Maps of the Seven Years' War campaigns",
      "Primary sources from French and British perspectives",
      "The Treaty of Paris (1763)",
      "Images of the Battle of Quebec"
    ],
    introduction: "Show students a map of North America in 1750 (French claims) and 1763 (after Treaty of Paris). Ask: 'France went from controlling half a continent to having almost nothing. How did this happen, and why does it matter for understanding Canada today?'",
    mainContent: `## The Fall of New France: A Turning Point in History

### New France at its Height
By 1750, New France claimed a vast territory:
- From the St. Lawrence to Louisiana
- Controlled the Mississippi and Great Lakes
- Population: only ~70,000 (vs. 1.5 million in British colonies)
- Economy based on fur trade, not settlement
- Strong Indigenous alliances

### Causes of Conflict
Tensions between French and British North America:
- Competition for the Ohio Valley
- Trade rivalries
- Imperial ambitions
- Indigenous nations caught between competing empires

The Seven Years' War (1756-1763) was a world war fought on multiple continents.

### Indigenous Alliances
Both European powers relied on Indigenous allies:
- French had stronger alliances (more respectful treatment, intermarriage)
- British struggled to match French-Indigenous relationships
- Indigenous nations pursued their own interests
- Some tried to remain neutral or play both sides

### The Military Campaign

**1754-1757: French Successes**
- Braddock defeated at Fort Duquesne
- Fort Oswego captured
- French victories seemed to promise continued dominance

**1758-1760: British Victory**
- William Pitt commits massive resources
- Louisbourg captured (1758)
- Quebec captured after Battle of the Plains of Abraham (1759)
- Montreal surrendered (1760)

### The Battle of the Plains of Abraham (1759)
A pivotal 15-minute battle:
- British General James Wolfe vs. French General Louis-Joseph de Montcalm
- British troops scaled cliffs to reach plains outside Quebec
- Both generals killed in battle
- French forces routed
- Quebec surrendered

### The Treaty of Paris (1763)
France surrendered most of North America:
- Britain gained Canada, Cape Breton, lands east of Mississippi
- France kept only fishing rights and small islands
- Spain gained Louisiana
- France chose to keep sugar islands (Guadeloupe) over Canada

### Consequences for French Canadians
The Conquest transformed French Canadian society:
- 70,000 French Canadians now under British rule
- Guaranteed Catholic religion and French civil law (Quebec Act, 1774)
- But political power lost
- Commercial elite largely left
- Begin of French-English tensions that persist today

### Consequences for Indigenous Peoples
The Conquest was devastating for Indigenous alliances:
- Lost ability to play European powers against each other
- British much less generous than French had been
- Land pressures increased dramatically
- Royal Proclamation of 1763 tried to protect Indigenous lands
- But settlement pressure was relentless

### Consequences for the Fur Trade
The Conquest restructured the trade:
- Montreal traders eventually joined with Scottish merchants
- Led to creation of North West Company
- Competition with HBC intensified
- French-Canadian voyageurs continued essential work
- But control shifted to British/Scottish merchants

### Long-Term Impact
The Conquest shaped modern Canada:
- Two founding European nations
- French-English tensions
- Quebec's distinct society
- Different legal and political traditions
- Ongoing debates about national identity`,
    activities: [
      { name: "Military Analysis", description: "Analyze the military campaign. Why did the British win? Was it inevitable?", duration: "20 minutes" },
      { name: "Perspective Writing", description: "Write accounts of the Conquest from French Canadian, British, and Indigenous perspectives.", duration: "20 minutes" },
      { name: "Treaty Analysis", description: "Analyze the Treaty of Paris. What did each party gain and lose?", duration: "15 minutes" },
      { name: "Long-term Consequences", description: "Trace how the Conquest continues to affect Canadian politics today.", duration: "20 minutes" }
    ],
    discussionQuestions: [
      "Was the British conquest of New France inevitable? What could have changed the outcome?",
      "Why was the loss of French North America worse for Indigenous peoples than for French Canadians?",
      "How did the Conquest shape the development of the fur trade?",
      "How does the Conquest continue to affect French-English relations in Canada?",
      "Should we think of 1760 as a 'conquest' or as something else?"
    ],
    assessment: "Write an analytical essay examining the Conquest from multiple perspectives, evaluating its short-term and long-term consequences for one group (French Canadians, Indigenous peoples, or the fur trade).",
    extensions: "Research how the Conquest is commemorated (or not) in Quebec and the rest of Canada. How do different groups remember this event?",
    isPublished: true
  }
];

// ==================== MAIN SEED FUNCTION ====================

export async function seedComprehensiveLessonPlans(): Promise<void> {
  console.log("Starting comprehensive lesson plans seed...\n");

  const allLessonPlans = [
    ...k3LessonPlans,
    ...grades46LessonPlans,
    ...grades79LessonPlans,
    ...grades1012LessonPlans
  ];

  console.log(`Total lesson plans to seed: ${allLessonPlans.length}\n`);

  let created = 0;
  let updated = 0;

  for (const lesson of allLessonPlans) {
    const existing = await prisma.lessonPlan.findFirst({
      where: { title: lesson.title }
    });

    const lessonData = {
      title: lesson.title,
      description: lesson.description,
      gradeLevel: lesson.gradeLevel,
      topic: lesson.topic,
      estimatedMinutes: lesson.estimatedMinutes,
      objectives: JSON.stringify(lesson.objectives),
      curriculumConnections: JSON.stringify(lesson.curriculumConnections),
      materials: JSON.stringify(lesson.materials),
      introduction: lesson.introduction,
      mainContent: lesson.mainContent,
      activities: JSON.stringify(lesson.activities),
      discussionQuestions: JSON.stringify(lesson.discussionQuestions),
      assessment: lesson.assessment,
      extensions: lesson.extensions,
      isPublished: lesson.isPublished
    };

    if (existing) {
      console.log(`  Updating: ${lesson.title} (${lesson.gradeLevel})`);
      await prisma.lessonPlan.update({
        where: { id: existing.id },
        data: lessonData
      });
      updated++;
    } else {
      console.log(`  Creating: ${lesson.title} (${lesson.gradeLevel})`);
      await prisma.lessonPlan.create({
        data: lessonData
      });
      created++;
    }
  }

  // Print summary by grade level and topic
  console.log("\n=== Lesson Plans Summary ===\n");

  const byGrade: Record<string, number> = {};
  const byTopic: Record<string, number> = {};

  for (const lesson of allLessonPlans) {
    byGrade[lesson.gradeLevel] = (byGrade[lesson.gradeLevel] || 0) + 1;
    byTopic[lesson.topic] = (byTopic[lesson.topic] || 0) + 1;
  }

  console.log("By Grade Level:");
  for (const [grade, count] of Object.entries(byGrade)) {
    console.log(`  ${grade}: ${count} lesson plans`);
  }

  console.log("\nBy Topic:");
  for (const [topic, count] of Object.entries(byTopic)) {
    console.log(`  ${topic}: ${count} lesson plans`);
  }

  console.log(`\nTotal: ${allLessonPlans.length} lesson plans`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);

  const totalInDb = await prisma.lessonPlan.count();
  console.log(`  Total in database: ${totalInDb}`);
}

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` ||
                     process.argv[1]?.endsWith('seed-lesson-plans-comprehensive.ts');

if (isMainModule) {
  seedComprehensiveLessonPlans()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
