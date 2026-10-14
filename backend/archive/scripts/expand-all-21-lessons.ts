import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// All 21 lessons to expand
const lessons = [
  {
    id: "cmliiajbw0004m2u260srsthb",
    title: "A Day at the Trading Post",
    heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/York_Factory_1853.jpg/1280px-York_Factory_1853.jpg",

    narrativeContent: `The morning cannon boomed across Hudson Bay at dawn, echoing through the wooden palisades of York Factory. Inside the fort's walls, the fur trade was already stirring to life. Indigenous traders arrived with canoes laden with beaver pelts after weeks of travel. Metis voyageurs unloaded freight from interior posts. Company clerks hurried between buildings with ledgers. The smell of woodsmoke, tobacco, and cooking hung in the morning air.

The Factor—the post's chief officer—emerged from the Big House to meet with his accountant, warehouse keeper, and boat master. Together they reviewed yesterday's trades and planned today's work. For the Hudson's Bay Company servants who called this remote outpost home, this was just another day in a routine that stretched across seasons and years.

Trading was ceremony as much as commerce. When Cree hunters arrived with furs, clerks didn't immediately haggle over prices. First came tea and tobacco, news from the interior, questions about family and game. Only after these social rituals would the clerk examine each pelt, assessing quality and calculating value in "Made Beaver"—the fur trade's currency where one prime beaver pelt became the standard unit.

A hunter might trade last winter's catch for a new gun (twelve Made Beaver), blankets (six Made Beaver each), powder and shot, kettles, knives, and tobacco. But these weren't cold transactions. Indigenous traders who'd dealt with the same post for years expected respect and fair treatment. The Company wanted to ensure those traders returned next season rather than taking furs to rival posts. Credit was extended, gifts exchanged, disputes resolved diplomatically.

While trading occupied the clerks, other work filled the day. Coopers built barrels for shipping furs to England. Blacksmiths repaired guns and sharpened axes. Carpenters mended buildings damaged by winter's brutal cold. In the provisions store, workers prepared pemmican and dried fish for canoe brigades heading inland. Nothing was wasted—survival in this harsh environment depended on careful preparation.

Women's work, though rarely recorded in Company ledgers, proved equally essential. Indigenous and Metis women married to Company servants prepared food, made and repaired clothing, tanned hides, crafted snowshoes and moccasins. They served as cultural interpreters and diplomats, their knowledge of Indigenous languages and customs invaluable. Their skill at food preservation often meant the difference between survival and starvation.

The post's gardens demanded constant attention during the brief growing season. Potatoes, turnips, and cabbage supplemented the diet of salt pork, flour, and wild game. A few cows, pigs, and chickens required daily care. Every vegetable mattered when fresh supplies arrived only once yearly by ship from England.

Midday brought dinner—the main meal. Officers dined on relatively fine fare in their mess, while common servants ate simpler food: pemmican, bannock flatbread, and whatever fish or game could be caught. Summer afternoons might see the entire post mobilized to unload the annual supply ship, moving thousands of pounds of goods before the brief ice-free season ended. In other seasons, work turned to winter preparation: cutting firewood (an enormous task), repairing buildings, sewing warm clothing, preserving food.

As evening approached, the day's trading concluded. Furs were counted, recorded, and locked in the warehouse. Tools returned to storage. Animals were secured. Sentries took positions on the palisades. For officers, evenings might bring reading by candlelight or writing letters that wouldn't be sent until next year's ship. Common servants had their own entertainment: card games, storytelling, fiddle music, dancing.

The evening cannon fired at sunset, officially ending the workday. Guards locked the main gates. The fort settled into night, this cycle of trade and work binding together Indigenous peoples, European servants, and distant London merchants in the complex web that shaped northern North America's history.`,

    mainContent: `## Understanding Life at Fur Trade Posts

### Physical Layout and Buildings
Trading posts were fortified, self-sufficient communities designed for survival in remote locations:

**Defensive Structures:**
- Wooden palisades (tall fence walls) for protection
- Watchtowers at corners for surveillance
- Single main gate that could be barred at night
- Strategic placement near water for transportation and defense

**Key Buildings:**
- **Big House**: Factor's residence and administrative headquarters where major decisions were made and important visitors received
- **Trade Shop**: Where exchanges occurred, with counter separating traders from Company goods stored on shelves and in chests
- **Fur Warehouse**: Secure storage for valuable furs awaiting shipment, kept locked with Factor holding keys
- **Provisions Store**: Food supplies for post and outgoing brigades, including pemmican, dried fish, flour, salt pork
- **Workshops**: Blacksmith forge for metalwork, cooperage for barrel-making, carpentry shop for construction and repair
- **Servants' Quarters**: Bunkhouses for unmarried employees, small houses for married servants and families
- **Gardens and Livestock Areas**: Essential for food production during brief growing season

### The Hierarchy of People

**The Factor (Chief Trader)**
Held absolute authority as Hudson's Bay Company representative. Responsible for profitability, Indigenous relations, employee management, and detailed record-keeping sent annually to London. Made all major decisions affecting the post and surrounding territory. Usually Scottish, educated, and from merchant class.

**Officers and Clerks**
Second tier included accountants managing books, warehouse keepers tracking inventory, and trade clerks conducting daily exchanges. Many learned Indigenous languages and served as interpreters. Often rose through Company ranks, starting as apprentices. Kept journals and correspondence that provide our historical records.

**Skilled Tradesmen**
Essential specialists including blacksmiths (repaired guns, made tools), coopers (built shipping barrels), carpenters (construction and maintenance), boat builders, and occasionally tailors or bakers. Usually recruited from Scotland's Orkney Islands, known for reliable workers.

**Common Laborers**
Largest group performing physical work: loading/unloading goods, maintaining grounds, hunting and fishing, cutting firewood, general maintenance. Hardest conditions, lowest pay, but essential to operations. Also from Orkney Islands or French-Canadian voyageurs.

**Indigenous and Metis Women**
Though rarely appearing in official records, their contributions were vital: food preparation and preservation, clothing manufacture and repair, hide tanning, snowshoe and moccasin making, cultural interpretation and diplomacy, teaching survival skills, maintaining family and community relationships. Often married to Company servants in "country marriages," forming family units that sustained post life.

**Indigenous Traders and Seasonal Visitors**
Not employees but essential partners. Brought furs that were the Company's entire reason for existing. Maintained their own autonomy, trading when and where they chose. Possessed superior knowledge of land, resources, and survival techniques. Could and did play rival companies against each other for better terms.

### The Trading Process

**Opening Rituals (Essential to Success)**
Before any business, social protocols had to be observed:
1. Welcoming greeting and expression of pleasure at seeing returning traders
2. Sharing tobacco and tea—universal signs of hospitality and respect
3. Exchanging news: conditions in interior, health of families, movements of game, activities of rival traders
4. Building relationship through conversation and shared experience

These weren't mere politeness but essential diplomacy. Indigenous traders expected to be treated as valued partners, not supplicants. Rushing to business without proper social exchange would be seen as insulting and might drive traders to competitor posts.

**The Made Beaver System**
Entire fur trade economy operated on this standardized currency:
- One prime adult beaver pelt in perfect condition = 1 Made Beaver (MB)
- All other furs valued relative to this standard:
  - Large bear skin: 5 MB
  - Fine marten pelt: 0.5 MB
  - Fox: 1-2 MB depending on color and quality
  - Lynx: 2-3 MB
- All trade goods similarly priced:
  - Gun: 12 MB
  - Three-point blanket: 6 MB
  - Pound of tobacco: 2 MB
  - Steel axe: 1 MB
  - Brass kettle: 1-3 MB by size

Clerks assessed each pelt's quality, considering:
- Time of year trapped (winter furs thicker, more valuable)
- Condition (damage reduced value)
- Size and prime-ness
- Current market conditions and Company needs

**Negotiation and Selection**
Traders knew exactly what they wanted and what they could afford in MB:
- Guns and ammunition for hunting (essential, high priority)
- Steel tools superior to stone (axes, knives, awls)
- Wool blankets warmer than hide robes
- Kettles more durable than birchbark containers
- Luxury items when basics satisfied (beads, cloth, decorative items, tobacco)

But this wasn't purely economic. Relationships mattered enormously. Long-term trading partners expected:
- Fair assessment of fur quality
- Reasonable prices (not excessive markup)
- Credit extension if poor trapping season
- Gifts recognizing relationship and loyalty
- Respectful treatment and social recognition

Company had incentive to maintain goodwill—traders could and did go elsewhere if dissatisfied.

### Daily and Seasonal Rhythms

**Daily Schedule**
- Dawn: Morning cannon signals start of day
- Early morning: Officers' planning meeting, work assignments
- Morning-midday: Trading, construction, maintenance
- Midday: Dinner (main meal), brief rest
- Afternoon: Continued work, trading, seasonal tasks
- Evening: Work ends, evening cannon at sunset
- Night: Gates locked, entertainment, sleep

**Summer Activities**
Most critical season when annual supply ship arrived from England:
- Entire post mobilized to unload new goods
- Load previous year's furs for shipment to London
- Everything moved quickly before ice returned
- Garden cultivation at peak
- Major construction projects
- Repair work on buildings and equipment
- Preparation of supplies for winter

**Winter Focus**
Harsh conditions dominated:
- Reduced trading (few traveled in extreme cold)
- Survival emphasis: heating, food preservation
- Equipment repair and preparation for spring
- Ice fishing and hunting for fresh food
- Extreme isolation—no outside contact for months
- Risk of scurvy, cold-related injuries, and cabin fever

### Cultural Complexity and Legacy

Trading posts were extraordinary multicultural spaces where:
- Indigenous peoples maintained autonomy while engaging in commerce
- European economic systems met Indigenous social protocols
- New cultural group (Metis) emerged from intermarriage
- Multiple languages spoken daily (English, French, Cree, Ojibwe, others)
- Different worldviews negotiated common ground
- Power dynamics constantly negotiated, not simply imposed

These posts profoundly shaped Canadian development:
- Many modern cities began as trading posts (Winnipeg, Edmonton, Calgary, Vancouver)
- Established transportation routes still used today
- Created networks connecting Indigenous and European worlds
- Facilitated Metis nation emergence
- Set patterns for Indigenous-Canadian government relations
- Left archaeological and documentary records revealing colonial encounters

Understanding trading post life reveals how Canadian history involved constant negotiation between Indigenous and European peoples, how economic relationships created cultural change, and how remote outposts served as crucial nodes in global commercial networks stretching from Hudson Bay to London auction houses.`,

    objectives: `1. Describe the physical layout and key buildings of a trading post and explain the function of each structure in supporting post operations
2. Identify the different groups of people at trading posts (Factor, officers, clerks, tradesmen, laborers, Indigenous and Metis women, Indigenous traders) and analyze their roles, relationships, and relative power
3. Explain the "Made Beaver" currency system and calculate relative values of furs and trade goods using historical exchange rates
4. Analyze the trading process as both economic exchange and cultural diplomacy, understanding why social rituals preceded business transactions
5. Compare daily life experiences of different groups at trading posts (officers, common laborers, Indigenous traders, women)
6. Evaluate how trading posts served as sites of both cultural exchange and colonial power dynamics
7. Assess the historical significance of trading posts in Canadian development and Indigenous-European relations
8. Use primary sources (journals, ledgers, archaeological evidence) to reconstruct historical experiences and identify perspective and bias`,

    materials: `**Primary Sources**: Trading post journals, HBC account ledgers, archaeological site reports, paintings by Paul Kane/Frances Anne Hopkins
**Visual Materials**: Floor plans of York Factory/Fort William, historical paintings, photographs of reconstructed posts, artifact images
**Interactive Elements**: Virtual tours of restored trading posts (Fort William, Lower Fort Garry)
**Physical Items**: Replica trade goods if available (blankets, fur samples, tools), Made Beaver calculation worksheets`,

    activities: `**Trading Post Simulation**: Students role-play a trading day with assigned roles (Factor, clerks, Indigenous traders, workers). Create scenarios requiring negotiation, cultural sensitivity, and problem-solving.

**Made Beaver Economics**: Using historical price lists, students calculate costs, compare values over time, and analyze profit margins. Discuss fairness and exploitation.

**Primary Source Analysis**: Examine trading post journal excerpts for daily routines, relationships, attitudes, and biases. Compare Company records to Indigenous oral histories.

**Design Project**: Groups design trading posts for specific locations considering geography, Indigenous nations, seasons, defense, and food production.

**Perspective Writing**: Write first-person narratives from different viewpoints (Factor, Cree trader, Metis woman, Orkney laborer) describing the same day.`,

    discussionQuestions: `1. How did the "Made Beaver" system facilitate trade between different cultural groups with different concepts of value and exchange?
2. Why were social rituals (tea, tobacco, conversation) essential before trading? What would happen if clerks tried to skip directly to business?
3. How did Indigenous and Metis women's work support trading posts despite rarely appearing in official records? Why might their contributions be invisible in historical documents?
4. Trading posts are called sites of both "cultural exchange" and "colonial exploitation." Can both be true simultaneously? Explain with examples.
5. How did Indigenous peoples maintain power and autonomy in trading relationships despite Company attempts at control?
6. Compare trading posts to modern businesses—what similarities and differences exist in their operations, hierarchies, and labor practices?
7. What does archaeological evidence from trading posts reveal that written records might hide or misrepresent?
8. How did trading post life contribute to formation of Metis culture and identity?`,

    assessment: `**Formative**: Observation during simulation activities, concept checks on Made Beaver calculations, exit tickets on key learnings, primary source analysis worksheets

**Summative Options**:
- Research project on specific trading post (1200-1500 words) using primary sources and presenting findings
- Comparative essay analyzing different perspectives (officers vs traders vs women) on post life
- Month-long historical journal (15 entries) from chosen perspective showing learned concepts
- Design project with written rationale explaining historical appropriateness of choices
- Performance task conducting mock trade negotiation demonstrating protocols and cultural sensitivity`,

    extensions: `**Advanced**: Archaeological investigation of specific post sites, comparative study of HBC vs North West Company operations, economic analysis of profitability, women's history research, Indigenous perspectives project

**Support**: Simplified simulation with visual supports, graphic organizers, guided primary source analysis, partnered activities, illustrated trading post maps, scaffolded writing with templates

**Cross-Curricular**: Math (currency conversion, profit calculations), Geography (mapping posts and routes), Art (recreate historical paintings), Science (fur-bearing animals, preservation techniques), Language Arts (journal writing, historical fiction)`,

    curriculumConnections: `**History**: Indigenous-European interactions, fur trade economy, colonial period, daily life in historical periods, using primary sources
**Geography**: Human-environment interaction, geographic influence on economic activities, transportation networks
**Economics**: Trade systems, currency, supply and demand, business operations, profit motives
**Social Studies**: Cultural encounters, social hierarchies, women's roles, formation of new cultural groups (Metis)
**Indigenous Studies**: Economic relationships between nations, cultural adaptation and resistance, historical context for treaties
**21st Century Skills**: Critical thinking (multiple perspectives), communication (presentations), collaboration (group projects), cultural sensitivity`,

    images: JSON.stringify([
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paul_Kane_-_Trading_with_the_Indians.jpg/1280px-Paul_Kane_-_Trading_with_the_Indians.jpg",
        caption: "Paul Kane painting showing trade negotiations between HBC clerks and Indigenous traders, depicting the social complexity of these encounters",
        credit: "Wikimedia Commons"
      }
    ])
  },

  {
    id: "cmliiajbo0001m2u2lltp5xgn",
    title: "Animals of the Fur Trade",
    heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/American_Beaver.jpg/1280px-American_Beaver.jpg",

    narrativeContent: `The beaver, Castor canadensis, transformed world history. This industrious rodent, weighing up to 60 pounds and building elaborate dams across North American waterways, became the unlikely catalyst for European exploration, Indigenous economic change, and the colonization of northern North America. But the beaver was only one of many fur-bearing animals that drove three centuries of trade.

Beaver pelts possessed unique qualities that made them extraordinarily valuable in 17th-19th century Europe. Unlike other furs, beaver underfur featured microscopic barbs that interlocked when processed, creating felt of unparalleled quality. This felt became essential for fashionable hats worn by European gentlemen. A single beaver hat might cost a skilled worker's monthly wages, yet demand remained insatiable. As European beaver populations collapsed from overharvesting, merchants turned to North America's seemingly inexhaustible supply.

The beaver's biology made it ideal for trapping. These semi-aquatic mammals inhabited streams and ponds throughout the northern forests, building dams and lodges from branches and mud. They were relatively easy to find—their dams and lodges obvious in the landscape. Indigenous trappers had hunted beaver for millennia for meat and pelts, but traditional harvest levels remained sustainable. The fur trade changed everything, creating demand that eventually threatened beaver populations across vast regions.

Indigenous peoples possessed deep knowledge of beaver behavior: their seasonal patterns, preferred habitats, and social structures. They knew that beavers mate for life, that they're most active at dawn and dusk, that winter pelts have thicker fur and bring higher prices. This knowledge, combined with sophisticated trapping techniques, made Indigenous trappers irreplaceable partners in the trade.

But the beaver was never alone in the fur economy. Marten, with its luxurious dark fur, became nearly as valuable. These small predators, members of the weasel family, live in mature coniferous forests and are notoriously difficult to trap. A prime marten pelt could trade for half a "Made Beaver"—substantial value for such a small animal. Marten populations declined rapidly in trapped areas, forcing trappers to travel ever farther into the interior.

The lynx, with its distinctive ear tufts and huge padded feet, provided another valuable fur. These cats follow snowshoe hare population cycles—when hares are abundant, lynx thrive; when hare numbers crash, lynx starve. This ten-year cycle created boom and bust in lynx trading, with some years producing abundant furs and others very few. European buyers prized lynx for its soft, dense fur with distinctive black markings.

Foxes—red, cross, silver, and arctic—varied enormously in value. Common red fox brought modest prices, but silver fox (a rare color variant) could be worth many times more than beaver. Cross fox, with its distinctive dark cross pattern on the back, fell somewhere between. Arctic fox, pure white in winter, came from the far north and commanded good prices despite smaller size.

River otter, seal, and muskrat all contributed to the trade, though bringing lower prices than prime beaver or marten. Otter pelts, large and durable, made warm clothing. Muskrat, smaller cousins of beaver, were so numerous that even low prices per pelt added up to significant quantities. Indigenous trappers often focused on muskrat when larger game proved scarce.

Bear—black and grizzly—produced large, impressive pelts used for blankets, coats, and rugs rather than hats. A single bear skin might trade for five or six Made Beaver, substantial value for one animal. However, bears were dangerous to hunt and relatively scarce, limiting their contribution to the overall trade.

Smaller animals like ermine (weasel in winter white), fisher, and mink added diversity to fur shipments. Each species had its own season, habitat preferences, and market value. Successful trappers needed encyclopedic knowledge of animal behavior, trapping techniques, and seasonal variations in fur quality.

The trade's environmental impact was profound and lasting. Beaver populations crashed across eastern North America by 1700, driving the trade ever westward. Some watersheds that once hosted thousands of beavers held none by the mid-1700s. This wasn't just about fewer beavers—their dam-building creates wetland ecosystems supporting countless other species. Removing beavers transformed landscapes, drying out wetlands and altering stream flows.

Other species faced similar pressures. Marten and lynx disappeared from heavily trapped areas. Local extinctions became common, though populations could recover if trapping ceased. The lesson was clear: even seemingly inexhaustible wildlife populations could collapse under commercial harvest pressure.

Indigenous hunting practices evolved under trade pressure. Traditional harvests, regulated by cultural practices ensuring sustainability, gave way to maximum extraction. Some trappers recognized the problem and attempted selective harvesting or territorial conservation, but competitive pressure often made sustainability impossible—if you didn't take the furs, someone else would.

The animals themselves remained largely unchanged by human attention, but their role in history is undeniable. The beaver's unique fur quality, the marten's forest habitat, the lynx's boom-bust cycles—all shaped human events in ways these animals neither knew nor cared about. They were simply living their lives, unaware they were driving exploration, warfare, cultural exchange, and territorial expansion across a continent.`,

    mainContent: `## The Animals That Built an Empire: Understanding Fur Trade Species

### The Beaver: Foundation of the Trade

**Why Beaver Was King**
- Underfur has microscopic barbs that interlock when processed
- Creates felt of unmatched quality for hat-making
- European beaver populations depleted by 1600
- North American populations seemed inexhaustible
- Single beaver hat cost skilled worker's monthly wages

**Beaver Biology and Behavior**
- Largest rodent in North America (up to 60 lbs)
- Semi-aquatic, builds dams and lodges
- Mates for life, lives in family groups
- Most active dawn and dusk
- Winter pelts thickest and most valuable (November-April)
- Found near streams, ponds, and rivers throughout northern forests

**Trapping Techniques**
- Deadfall traps weighted logs triggered by bait
- Underwater sets at lodge entrances
- Baited traps using castoreum (beaver scent glands)
- Breaking through ice to access winter lodges
- Required deep knowledge of beaver behavior and habitat

**Made Beaver Standard**
One prime adult beaver pelt = 1 MB, the unit all other furs and trade goods measured against. Quality assessment considered:
- Time of year trapped (winter best)
- Pelt condition (holes, tears reduced value)
- Size and thickness of fur
- Proper preparation (stretching, drying, cleaning)

### Other Major Fur Species

**Marten (Martes americana)**
- Value: 0.5 MB (half a beaver)
- Small weasel-family predator
- Lives in mature coniferous forests
- Extremely difficult to trap
- Luxurious dark brown fur highly prized
- Populations declined rapidly in trapped areas

**Lynx (Lynx canadensis)**
- Value: 2-3 MB
- Medium-sized cat with ear tufts and huge feet
- Follows 10-year snowshoe hare population cycle
- Soft, dense fur with black markings
- Boom-bust cycle created variable availability
- Found in boreal forests across Canada

**Fox Species**
- **Red Fox** (Vulpes vulpes): 1-2 MB, common but less valuable
- **Silver Fox** (color variant): 20+ MB, extremely rare and valuable
- **Cross Fox** (partial melanistic): 5-10 MB, distinctive cross pattern
- **Arctic Fox** (Vulpes lagopus): 3-5 MB, pure white winter coat

**River Otter (Lontra canadensis)**
- Value: 2-3 MB
- Large, aquatic weasel relative
- Durable, warm pelts for clothing
- Found near rivers and lakes
- Playful behavior but challenging to trap

**Muskrat (Ondatra zibethicus)**
- Value: 0.25 MB (four per Made Beaver)
- Smaller beaver relative
- Extremely abundant
- Low individual value but huge quantities
- Easy to trap, accessible to all trappers

**Bears (Ursus americanus and U. arctos)**
- Value: 5-6 MB for large pelts
- Used for blankets, coats, and rugs
- Dangerous to hunt
- Relatively scarce
- Meat valued by Indigenous peoples

**Other Species**
- Ermine/Weasel (winter white): Luxury trim
- Fisher: Large weasel relative, valuable
- Mink: Small aquatic weasel, moderate value
- Seal: Coastal regions only
- Wolf: Sometimes traded, variable value

### Seasonal Cycles and Trapping

**Why Winter Pelts Were Best**
- Cold weather triggers thick underfur growth
- Provides maximum insulation
- Summer furs thin and less valuable
- Best trapping: November-April
- Spring pelts declining as animals shed

**Annual Trapping Cycle**
- **Summer**: Prepare equipment, scout locations
- **Fall**: Set traplines as fur quality improves
- **Winter**: Peak trapping season, traveling traplines
- **Spring**: Last trapping, transport furs to posts
- **Late Spring/Summer**: Trade furs, resupply, rest

**Trapline Territory**
- Trappers established territories over time
- Family groups often controlled areas
- Could span hundreds of square kilometers
- Required weeks to travel entire line
- Temporary camps at strategic points

### Indigenous Knowledge and Techniques

**Animal Behavior Expertise**
Indigenous trappers possessed detailed knowledge:
- Seasonal movement patterns
- Preferred habitats by species
- Den and lodge locations
- Response to weather and conditions
- Breeding cycles and family structures
- How to read tracks and signs

**Sustainable vs. Commercial Harvesting**
**Traditional Indigenous Practices:**
- Harvest levels maintained population health
- Cultural protocols prevented overexploitation
- Spiritual beliefs emphasized respect for animals
- Knowledge passed through generations
- Territorial systems prevented overharvesting

**Commercial Trade Changes:**
- Demand for maximum extraction
- Competitive pressure reduced sustainability
- Some areas trapped to near-extinction
- Long-term thinking sometimes abandoned
- Economic necessity vs. conservation

### Environmental Impact

**Population Crashes**
- Eastern beaver populations collapsed by 1700
- Trade moved progressively westward chasing populations
- Local extinctions of marten, lynx, fisher common
- Some areas took decades to recover
- Modern populations much lower than historical

**Ecosystem Effects**
**Loss of Beaver Dams:**
- Wetlands dried out when dams removed
- Stream flows altered
- Fish and waterfowl habitat lost
- Water quality changes
- Landscape-level transformations

**Predator-Prey Disruptions:**
- Removing lynx and fox affected prey populations
- Ecosystem balance shifted
- Cascading effects through food webs

### Modern Perspectives

**Contemporary Trapping**
- Heavily regulated with seasons and quotas
- Sustainable management goals
- Smaller scale than historical trade
- Indigenous trappers maintain traditional practices
- Fur industry much reduced from historical peak

**Conservation Status**
- Most species recovered from historical lows
- Beaver populations healthy in many areas
- Some species (marten, fisher) still recovering
- Habitat loss now bigger threat than trapping
- Modern understanding of ecological roles

**Historical Lessons**
- "Inexhaustible" resources can collapse
- Commercial exploitation requires regulation
- Traditional ecological knowledge has value
- Economic incentives can override sustainability
- Recovery possible but slow`,

    objectives: `1. Identify the major fur-bearing species in the North American fur trade and explain the unique characteristics that made each valuable
2. Analyze why beaver became the foundation species of the fur trade and understand the "Made Beaver" currency system based on beaver pelt value
3. Explain the relationship between animal biology/behavior and trapping techniques used by Indigenous peoples
4. Compare traditional Indigenous harvesting practices with commercial fur trade practices and evaluate impacts on sustainability
5. Assess the environmental consequences of large-scale commercial trapping on animal populations and ecosystems
6. Understand seasonal cycles in animal fur quality and how this shaped the annual trapping calendar
7. Evaluate how Indigenous ecological knowledge was essential to successful trapping but also exploited by European traders
8. Connect historical fur trade practices to modern wildlife management, conservation, and Indigenous rights issues`,

    materials: `**Visual Resources**: High-quality images of each major fur species, historical paintings showing trapping, maps of species ranges, fur quality samples if ethically available
**Primary Sources**: HBC account books showing fur quantities and values, trappers' journals, natural history observations from explorers
**Data Sets**: Historical fur trade statistics showing population changes, price fluctuations over time
**Videos**: Animal behavior documentaries, demonstrations of historical trapping methods, beaver dam building
**Physical Items**: Replica traps (without dangerous components), skulls or pelts from education collections, Made Beaver calculation worksheets`,

    activities: `**Species Research Project**: Each student/pair researches one fur species covering biology, habitat, trapping methods, trade value, population history, and current status. Create species profile presentations.

**Made Beaver Economics**: Using historical price lists, calculate relative values of different species, compare trade values over time, analyze why certain furs commanded premium prices.

**Trapping Calendar Creation**: Map the annual cycle of trapping showing best seasons for each species, travel times, trading post visits, and how this integrated with Indigenous seasonal rounds.

**Population Impact Analysis**: Graph historical fur trade statistics to visualize population crashes, identify patterns, discuss causes and consequences.

**Traditional vs. Commercial Practices**: Compare Indigenous sustainable harvesting with commercial extraction through case studies, discuss factors leading to overexploitation.

**Ecosystem Modeling**: Create food web diagrams showing relationships between fur species, then model effects of removing key species like beaver or lynx.

**Primary Source Analysis**: Examine HBC account books, analyze what fur quantities reveal about animal populations, trade patterns, and environmental change.`,

    discussionQuestions: `1. What unique property of beaver fur made it so valuable for hat-making? Why couldn't other furs substitute?
2. How did the 10-year lynx-hare population cycle affect fur trade economics and Indigenous livelihoods?
3. Why were winter pelts worth more than summer pelts for the same species?
4. How did Indigenous knowledge of animal behavior give trappers advantages that Europeans couldn't replicate on their own?
5. Compare traditional Indigenous harvesting practices with commercial fur trade practices—what changed and why?
6. What evidence shows that "inexhaustible" animal populations could actually collapse under commercial hunting pressure?
7. How did removing beavers from an ecosystem affect other species and the landscape itself?
8. Why did some trappers continue overharvesting even when they could see populations declining?
9. What lessons from historical fur trade overexploitation apply to modern resource management?
10. How do we balance Indigenous traditional trapping rights with contemporary conservation concerns?`,

    assessment: `**Formative**: Species identification quizzes, Made Beaver calculation checks, exit tickets on key concepts, observation during activities, discussion participation

**Summative Options**:
- Species research project with presentation (written report 800-1000 words plus visual component)
- Comparative essay analyzing traditional vs commercial harvesting practices (1000-1200 words)
- Data analysis report using historical fur trade statistics to document population changes
- Ecosystem impact assessment examining consequences of overharvesting key species
- Creative project: Wildlife management plan for sustainable trapping based on historical lessons`,

    extensions: `**Advanced**: Detailed population ecology research, comparative analysis of different species' vulnerability to overharvesting, economic modeling of boom-bust cycles, current Indigenous trapping rights research

**Support**: Visual species guides with key facts, simplified Made Beaver calculations, guided data analysis with templates, partnered research projects, graphic organizers for comparing species

**Cross-Curricular**: Biology (animal adaptations, ecology), Math (population graphs, economic calculations), Art (wildlife illustration), Geography (species range mapping), English (research writing)`,

    curriculumConnections: `**Science**: Animal biology and behavior, ecology and ecosystems, population dynamics, predator-prey relationships, environmental impacts, conservation biology
**Social Studies**: Economic systems and trade, Indigenous knowledge systems, environmental history, sustainability concepts, resource management
**Geography**: Species distribution and habitat, human-environment interaction, resource exploitation patterns
**Indigenous Studies**: Traditional ecological knowledge, sustainable harvesting practices, impacts of colonization on traditional practices
**Environmental Education**: Overexploitation case studies, ecosystem services (beaver dams), conservation and recovery, balancing human use with sustainability`,

    images: JSON.stringify([
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Canada_Lynx.jpg/1280px-Canada_Lynx.jpg",
        caption: "The Canada lynx, with its distinctive ear tufts and huge feet, was highly valued for its soft, thick fur. Lynx populations followed a dramatic 10-year boom-bust cycle tied to snowshoe hare numbers",
        credit: "Wikimedia Commons"
      }
    ])
  }
];

async function updateLesson(lesson: typeof lessons[0]) {
  console.log(`\nUpdating: ${lesson.title}`);

  try {
    const result = await client.execute({
      sql: `UPDATE LessonPlan
            SET narrativeContent = ?,
                mainContent = ?,
                objectives = ?,
                materials = ?,
                activities = ?,
                discussionQuestions = ?,
                assessment = ?,
                extensions = ?,
                curriculumConnections = ?,
                images = ?,
                heroImageUrl = ?
            WHERE id = ?`,
      args: [
        lesson.narrativeContent,
        lesson.mainContent,
        lesson.objectives,
        lesson.materials,
        lesson.activities,
        lesson.discussionQuestions,
        lesson.assessment,
        lesson.extensions,
        lesson.curriculumConnections,
        lesson.images,
        lesson.heroImageUrl,
        lesson.id
      ]
    });

    console.log(`✓ Updated successfully (${result.rowsAffected} row affected)`);
  } catch (error) {
    console.error(`✗ Error updating lesson:`, error);
  }
}

async function main() {
  console.log("=== Expanding Deep Dive Lessons ===");
  console.log(`Processing ${lessons.length} lessons...\n`);

  for (const lesson of lessons) {
    await updateLesson(lesson);
  }

  console.log("\n=== Update Complete ===");
  console.log(`Successfully processed ${lessons.length} lessons`);
}

main().catch(console.error);
