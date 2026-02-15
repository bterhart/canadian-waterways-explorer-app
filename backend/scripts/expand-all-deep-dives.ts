import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Lesson 1: A Day at the Trading Post
const tradingPostContent = {
  id: "cmliiajbw0004m2u260srsthb",
  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/York_Factory_1853.jpg/1280px-York_Factory_1853.jpg",
  narrativeContent: `The sun had barely risen over Hudson Bay when the morning cannon fired at York Factory, the Hudson's Bay Company's most important trading post. The boom echoed across the water and through the wooden palisades, signaling the start of another busy day in the summer of 1820. This was the height of the fur trade season, and the post was alive with activity—a small city of commerce at the edge of the known world.

Inside the fort's walls, the scene was one of organized chaos. Indigenous traders from the interior had arrived in their birchbark canoes after weeks of travel, their vessels laden with beaver pelts, marten furs, and lynx hides. Metis voyageurs, having paddled thousands of miles from the interior posts, were unloading their freight canoes on the rocky shore. Company clerks hurried between buildings with ledgers and manifests. Blacksmiths hammered at their forges. Carpenters repaired buildings damaged by the previous winter's brutal cold. The smell of woodsmoke, tobacco, and cooking food hung in the air.

The day's routine at a trading post like York Factory followed patterns established over generations. Shortly after dawn, the Factor—the chief officer of the post—would emerge from the Big House, the largest building in the fort. He was the representative of the Hudson's Bay Company's London Committee, wielding absolute authority over this remote outpost. His word was law for hundreds of miles in every direction.

The Factor's first task each morning was to meet with his officers: the accountant who kept the post's books, the warehouse keeper who managed the valuable inventory of furs and trade goods, and the master of the boats who organized the complex logistics of canoe brigades. Together, they would review the previous day's trading, plan the day's work, and discuss any problems that had arisen.

For the Indigenous and Metis traders who came to the post, the experience was both familiar and fraught with complexity. These were not simple exchanges but elaborate ceremonies of trade that required skill, patience, and deep cultural knowledge on both sides. A Cree hunter arriving with a season's worth of beaver pelts knew exactly what he wanted in return: perhaps a new gun, powder and shot, a steel axe, woolen blankets, tobacco, and kettles for his family. But he also knew that the negotiation was a delicate dance.

The trading room, or shop, was where these negotiations took place. It was a wooden building with a counter separating the traders from the Company's goods, which were stored on shelves and in chests behind the counter. A clerk, often fluent in Cree or other Indigenous languages, would greet arriving traders with elaborate courtesy. Tea would be served. Pipes would be smoked. News would be exchanged about conditions in the interior, the health of family members, the movements of game animals.

Only after these social preliminaries would the actual trading begin. The clerk would examine each pelt carefully, assessing its quality, the time of year it was trapped, and its condition. The Hudson's Bay Company's system of value was based on the "Made Beaver"—one prime adult beaver pelt in perfect condition became the unit against which all other furs and all trade goods were measured. A large bear skin might be worth five Made Beaver. A fine marten pelt might be worth one-half Made Beaver.

The trader would then select his goods. A gun might cost twelve Made Beaver. A three-point blanket (named for the short lines or "points" woven into it to indicate size and quality) might cost six Made Beaver. A pound of tobacco, two Made Beaver. Powder and shot, kettles, knives, beads, cloth—each item had its price in the elaborate currency of the fur trade.

But this was not simply a cold economic transaction. For Indigenous traders, maintaining relationships was as important as the goods exchanged. A trader who had dealt with the same post for years expected to be treated with respect and generosity. The Company, for its part, wanted to ensure that traders would return next year rather than take their furs to rival North West Company posts. This meant that credit was often extended, gifts were given, and disputes were resolved diplomatically.

Throughout the trading post, other work continued. In the cooperage, workers built the barrels that would be packed with furs for shipment to England. Each barrel had to be perfectly made—leaking barrels meant ruined furs and lost profits. In the provisions store, workers prepared pemmican, dried fish, and other foodstuffs that would be needed by the canoe brigades heading back into the interior. In the blacksmith shop, guns were repaired, axes were sharpened, and iron tools were manufactured or mended.

Women's work was equally essential, though often less visible in the Company's official records. Indigenous and Metis women married to Company servants prepared food, made and repaired clothing, tanned hides, made snowshoes and moccasins, and served as cultural interpreters and diplomats. Their knowledge of Indigenous languages and customs was invaluable. Their skill at preserving and preparing food often meant the difference between survival and starvation during long winters.

The post's gardens were tended carefully during the short growing season. Potatoes, turnips, cabbage, and other hardy vegetables supplemented the diet of salt pork, flour, and wild game. The post's livestock—a few cows, pigs, and chickens—required constant attention. Nothing could be wasted in this harsh environment where supplies arrived only once per year by ship from England.

Midday brought a break for dinner, the main meal of the day. In the officers' mess, the Factor and his gentlemen dined on relatively fine fare: fresh or salt meat, bread, vegetables from the garden, and perhaps some delicacies from England that had survived the long voyage. The common servants ate more plainly: pemmican, bannock (a type of flatbread), and whatever fish or game could be procured locally.

Afternoon activities varied with the season. In summer, when the ships from England arrived, the entire post mobilized to unload supplies and load furs. Everyone, from the Factor to the youngest apprentice, worked to move thousands of pounds of goods before the brief ice-free shipping season ended. The arrival of the annual supply ship was the year's most important event, bringing not only trade goods but letters from home, newspapers months out of date, and occasionally new servants recruited in Scotland's Orkney Islands.

In other seasons, afternoons might be spent preparing for winter: cutting and stacking firewood (an enormous task, as heating the post's buildings required vast quantities of wood), repairing buildings, sewing warm clothing, or preserving food. The post had to be absolutely prepared for winter's arrival, which came early and stayed late in this subarctic climate.

As evening approached, the post's rhythm changed. Trading for the day would conclude. The valuable furs would be counted, recorded in the post's books, and locked in the fur warehouse. Tools would be returned to storage. Animals would be fed and secured for the night. Sentries would take their posts on the wooden palisades, watching for any sign of trouble.

For the officers, evenings might bring a few hours of leisure: reading by candlelight, writing letters that wouldn't be sent until the next year's ship departed, or keeping journals. Many Company servants were literate, and their journals and letters provide our most vivid accounts of fur trade life. They wrote of the bitter cold, the strange beauty of the northern lights, encounters with bears and other wildlife, conflicts with rivals, and the deep loneliness of being so far from home.

The common servants had their own entertainment: card games, storytelling, music on fiddles or pipes, dancing, and, when available, drinking. Company regulations officially discouraged "disorderly conduct," but in practice, officers often looked the other way as long as work was completed and no serious fights erupted.

For Indigenous families camped near the post, evenings were times for their own social activities: repairing equipment, preparing food, caring for children, telling stories, and discussing the next stage of their travels. Many would depart the next day or within a few days, heading back to their traditional territories with their new supplies. Others might remain near the post for weeks, socializing, trading gradually, and waiting for favorable conditions for their journey.

The evening cannon fired at sunset, marking the official end of the working day. Guards would lock the post's main gates. The fort would not reopen until dawn brought another day of this endless cycle of trade, work, and survival at the edge of empire. This routine would continue year after year, season after season, binding together Indigenous peoples, European and Canadian servants, and distant London merchants in a complex web of economic exchange, cultural encounter, and mutual dependence that shaped the history of northern North America.`,

  mainContent: `## A Day at the Trading Post: Understanding Fur Trade Life

### Overview
This lesson explores daily life at a Hudson's Bay Company trading post during the height of the fur trade era (1780-1870). Students will understand the complex social, economic, and cultural dynamics that shaped these frontier communities.

### The Physical Layout
Trading posts were fortified communities:
- **Palisades**: Wooden walls for protection
- **Big House**: Factor's residence and administrative center
- **Trade Shop**: Where exchanges occurred
- **Warehouses**: For furs and trade goods
- **Workshops**: Blacksmith, cooperage, carpentry
- **Living Quarters**: For employees
- **Gardens and livestock areas**: For food production

### Key Personnel and Their Roles

**The Factor (Chief Officer)**
- Represented the Hudson's Bay Company
- Had absolute authority over the post
- Managed all trade relationships
- Kept detailed records
- Made all major decisions

**Clerks and Accountants**
- Maintained financial records
- Conducted daily trading
- Learned Indigenous languages
- Served as interpreters

**Skilled Tradesmen**
- Blacksmiths repaired guns and tools
- Coopers made barrels for shipping furs
- Carpenters maintained buildings
- Boat builders and repairers

**Common Laborers**
- Loaded and unloaded goods
- Maintained buildings and grounds
- Hunted and fished for food
- Cut firewood for heating

**Indigenous and Metis Women**
- Prepared and preserved food
- Made clothing and moccasins
- Tanned hides
- Served as cultural interpreters
- Maintained diplomatic relationships

### The Trading Process

**Opening Ceremonies**
1. Greeting and welcoming
2. Sharing tobacco and tea
3. Exchanging news and information
4. Building relationship and trust

**The Exchange**
1. Clerk examines furs for quality
2. Value assessed in "Made Beaver" units
3. Trader selects desired goods
4. Prices negotiated based on relationship
5. Credit sometimes extended

**Trade Goods**
- **Weapons**: Guns, powder, shot
- **Tools**: Axes, knives, kettles
- **Textiles**: Blankets, cloth
- **Luxury Items**: Tobacco, beads, decorative items

### Daily Schedule

**Dawn**
- Morning cannon fired
- Factor meets with officers
- Work assignments given
- Trading begins

**Midday**
- Main meal served
- Brief rest period
- Different meals for officers vs. laborers

**Afternoon**
- Continued trading
- Maintenance and repair work
- Seasonal activities (summer: shipping, winter: preparation)

**Evening**
- Evening cannon at sunset
- Gates locked
- Leisure time for entertainment
- Next day's planning

### Seasonal Variations

**Summer**
- Arrival of supply ships from England
- Intensive loading and unloading
- Garden cultivation
- Major construction projects

**Winter**
- Reduced trading activity
- Survival focus: heating, food preservation
- Equipment repair and preparation
- Isolation and harsh conditions

### Cultural Complexity
Trading posts were sites of:
- Economic exchange
- Cultural encounter and adaptation
- Formation of new communities (Metis)
- Diplomatic relationships between nations
- Personal relationships and family formation

### Historical Impact
Trading posts served as:
- Economic hubs for vast territories
- Sites of cultural mixing
- Centers of political power
- Starting points for European expansion
- Places where Indigenous peoples exercised economic and diplomatic power`,

  objectives: `1. Analyze the complex daily operations of fur trade posts and understand how multiple cultural groups interacted in these frontier communities
2. Evaluate the different roles and responsibilities of various people at trading posts, including factors, clerks, laborers, traders, and Indigenous and Metis women
3. Examine the trading process and understand how the "Made Beaver" system functioned as currency in the fur trade economy
4. Compare the experiences of different groups at trading posts (Indigenous traders, Company officers, common laborers, women)
5. Assess how trading posts served as sites of both cultural exchange and economic exploitation
6. Connect fur trade post operations to larger themes of colonialism, Indigenous resistance, and cultural adaptation
7. Use primary sources (journals, ledgers, archaeological evidence) to reconstruct historical daily life`,

  materials: `**Primary Sources:**
- Trading post journals and daily logs
- Company correspondence and account books
- Archaeological reports from excavated trading posts
- Paintings by Paul Kane and other fur trade era artists
- Indigenous oral histories about trading experiences

**Visual Materials:**
- Floor plans of typical trading posts (York Factory, Fort William, etc.)
- Historical paintings showing trading scenes
- Photographs of reconstructed trading posts
- Maps showing trading post locations and canoe routes
- Images of trade goods and artifacts

**Multimedia Resources:**
- Virtual tours of restored trading posts
- Documentary footage about fur trade life
- Audio recordings of stories from Indigenous elders
- Re-enactment videos showing trading processes

**Physical Materials:**
- Replica trade goods (if available)
- Fur samples (ethically sourced)
- Maps for student annotations
- Timeline materials
- Role-play cards for simulation activities`,

  activities: `**Activity 1: Trading Post Simulation (90 minutes)**
Students role-play a day at a trading post with assigned roles:
- Factor and officers
- Clerks conducting trades
- Indigenous traders with specific needs
- Skilled tradesmen
- Women workers
Create realistic scenarios including:
- Trading negotiations
- Resource management decisions
- Cultural misunderstandings to resolve
- Unexpected challenges (weather, supply shortages, disputes)

Debrief: Discuss what students learned about:
- Power dynamics
- Cultural differences
- Economic complexity
- Daily challenges

**Activity 2: Trading Post Design Project**
In groups, design a trading post for a specific location considering:
- Geographic advantages/disadvantages
- Local Indigenous nations and their needs
- Seasonal challenges
- Defense requirements
- Food production capacity

Present designs with justifications for choices.

**Activity 3: Primary Source Analysis**
Provide excerpts from trading post journals. Students analyze for:
- Daily routines and activities
- Relationships between different groups
- Economic transactions
- Cultural encounters
- Attitudes and biases of writers

Compare accounts from Company servants vs. Indigenous perspectives (from oral histories).

**Activity 4: "A Day in the Life" Writing**
Students write first-person narratives from perspectives of:
- A Factor managing the post
- An Indigenous trader arriving with furs
- A Metis woman married to a Company servant
- An Orkney laborer in their first year
- A young apprentice clerk

Share and discuss different perspectives on the same day.

**Activity 5: Trade Goods Economics**
Using historical "Made Beaver" values:
- Calculate costs of various goods
- Analyze profit margins for the Company
- Compare values over time
- Discuss fairness and exploitation
- Connect to modern economic systems

**Activity 6: Archaeological Investigation**
Examine artifact photographs from trading post excavations:
- Identify objects and their uses
- Infer information about daily life
- Compare material culture of different groups at posts
- Create archaeological reports

**Activity 7: Mapping Activity**
Create maps showing:
- Trading post locations
- Canoe routes connecting posts
- Indigenous territories
- Seasonal movement patterns
- Trade good flows

**Activity 8: Cultural Exchange Timeline**
Document how trading posts facilitated:
- Technology transfer (both directions)
- Food exchange (European and Indigenous foods)
- Language mixing
- Formation of Metis culture
- Marriage patterns and family formation`,

  discussionQuestions: `**Level 1: Understanding**
1. What were the main buildings in a typical trading post and what function did each serve?
2. Who were the different groups of people at a trading post and what were their roles?
3. What was the "Made Beaver" system and how did it work as currency?
4. Describe the typical daily schedule at a trading post during summer vs. winter.

**Level 2: Analysis**
5. How did power relationships work at trading posts between the Company, Indigenous traders, and employees?
6. Why was the opening ceremony before trading so important? What purpose did it serve?
7. What skills were most valuable at a trading post and why?
8. How did women's work support trading post operations, even though it was often not recorded in official Company documents?

**Level 3: Evaluation and Synthesis**
9. Trading posts have been called sites of both cultural exchange and colonial exploitation. Do you agree? Explain with specific examples.
10. How did Indigenous peoples maintain their autonomy and negotiating power at trading posts despite European attempts at control?
11. Why did the fur trade require cooperation between Indigenous peoples and Europeans? What did each group provide that the other needed?
12. Compare trading posts to modern businesses. What similarities and differences do you see in their operations?

**Level 4: Critical Thinking**
13. Many historians argue that Indigenous women married to Company servants wielded significant informal power. What evidence supports this interpretation?
14. How did the physical isolation of trading posts affect social relationships and daily life?
15. What aspects of trading post life might primary sources (Company journals) hide or misrepresent? How can we recover those hidden stories?
16. If you were an Indigenous leader deciding whether to trade at a post, what factors would influence your decision?

**Connection Questions**
17. How do trading post interactions compare to modern cross-cultural business relationships?
18. What lessons from fur trade economics apply to today's global trade systems?
19. How did trading posts contribute to the later settlement and development of Canada?
20. What is the legacy of trading posts in modern Canadian communities, especially in the North?`,

  assessment: `**Formative Assessment:**

**Observation During Simulation**
- Participation in role-play
- Understanding of assigned role
- Application of historical knowledge
- Collaboration with classmates

**Concept Checks**
- Quick writes: "Explain Made Beaver system in 3 sentences"
- Exit tickets: "What surprised you most about trading post life?"
- Think-pair-share responses to discussion questions

**Primary Source Analysis Rubric**
- Identification of key information
- Understanding of historical context
- Recognition of bias and perspective
- Connections to larger themes

**Summative Assessment:**

**Research Project (Individual or Pair)**
Students research a specific trading post:
- Geographic location and strategic importance
- History and key events
- People who lived/worked there
- Daily operations
- Cultural interactions
- Legacy and significance

Present findings as:
- Research paper (1500-2000 words)
- Digital presentation
- Museum exhibit panel design
- Documentary-style video
- Podcast episode

**Evaluation Criteria:**
- Historical accuracy and detail
- Use of primary sources
- Multiple perspectives included
- Analysis of significance
- Quality of presentation
- Critical thinking demonstrated

**Creative Assessment Option**
Create a detailed journal covering one month at a trading post from a chosen perspective:
- Minimum 15 entries
- Historically accurate details
- Authentic voice and perspective
- Integration of learned concepts
- Bibliography of sources consulted

**Comparative Essay**
Compare and contrast:
- Different trading posts (geographic variation)
- Company servant vs. Indigenous trader experiences
- Summer vs. winter operations
- Early fur trade vs. later periods
- Hudson's Bay Company vs. North West Company posts

**Group Project Assessment**
Trading Post Design Project:
- Historical appropriateness of design
- Consideration of geographic factors
- Understanding of functional needs
- Quality of presentation
- Group collaboration

**Performance Task**
Conduct a mock trade negotiation demonstrating:
- Understanding of trading protocols
- Knowledge of goods and values
- Ability to consider multiple perspectives
- Appropriate cultural sensitivity
- Historical accuracy

**Self-Assessment Component**
Students reflect on:
- What they learned about fur trade life
- How their understanding changed
- Connections to modern issues
- Questions they still have
- Most significant insights gained`,

  extensions: `**For Advanced Students:**

**1. Archaeological Research Project**
Investigate a specific trading post archaeological site:
- Study published excavation reports
- Analyze artifact distributions
- Compare material culture of different groups
- Present findings to class

**2. Comparative Colonial Systems**
Compare Hudson's Bay Company trading posts to:
- Spanish missions in California
- Dutch trading posts in New Netherland
- French coureurs de bois system
- Russian America fur trade
Analyze similarities and differences in approaches to Indigenous relations and economic organization.

**3. Economic Analysis**
Deep dive into fur trade economics:
- Track profitability of specific posts over time
- Analyze account books and ledgers
- Calculate profit margins
- Study boom and bust cycles
- Connect to modern economic concepts

**4. Women's History Research**
Focus on women's roles and experiences:
- Country marriages and their significance
- Women's economic contributions
- Cultural mediation roles
- Metis identity formation
- Compare representations in Company records vs. oral histories

**5. Indigenous Perspectives Project**
Research how specific Indigenous nations view fur trade history:
- Interview community members (with appropriate permissions)
- Study oral histories
- Examine Indigenous-authored histories
- Present findings respectfully

**For Students Needing Support:**

**1. Simplified Trading Simulation**
- Fewer roles and simpler scenarios
- Visual supports (picture cards for trade goods)
- Step-by-step trading process guide
- Partnership with peer mentor

**2. Graphic Organizer Activities**
- Venn diagrams comparing different groups
- Flow charts showing trading process
- Timeline creation with teacher support
- Labeled diagram of trading post layout

**3. Supported Primary Source Analysis**
- Pre-selected shorter excerpts
- Guided questions provided
- Vocabulary support
- Option to work with partner

**4. Visual Learning Projects**
- Create illustrated trading post map
- Design trade goods catalog with pictures
- Photo story depicting a day at the post
- Diorama or 3D model creation

**5. Scaffolded Writing**
- Sentence starters provided
- Outline templates
- Word banks of key terms
- Option for oral presentation instead of written

**Cross-Curricular Extensions:**

**Mathematics**
- Calculate currency conversions (Made Beaver to modern dollars)
- Analyze profit margins and business costs
- Create graphs showing seasonal trade patterns
- Study supply chain logistics

**Geography**
- Map trading post locations and routes
- Analyze geographic factors affecting post placement
- Study transportation challenges
- Create topographic models

**Art**
- Recreate trading post scenes in style of period artists
- Design trade goods (blanket patterns, etc.)
- Create museum exhibit displays
- Photography project at reconstructed posts

**Language Arts**
- Read historical fiction set at trading posts
- Write from multiple perspectives
- Analyze journals as literature
- Create dramatic presentations

**Science**
- Study fur-bearing animals and their ecology
- Investigate preservation techniques (pemmican, tanning)
- Analyze environmental impacts of trapping
- Research climate and its effects on trade

**Technology**
- Create virtual tours using 360° photos
- Design databases of trade goods and values
- Build digital maps with GIS software
- Develop educational games about trading

**Field Trip Opportunities:**
- Visit reconstructed or preserved trading posts
- Tour museums with fur trade collections
- Meet with Indigenous cultural educators
- Explore Hudson's Bay Company archives`,

  curriculumConnections: `**Social Studies Standards:**

**History:**
- Analyze interactions between Indigenous peoples and European newcomers
- Understand economic systems and trade networks
- Examine daily life in historical periods
- Compare different perspectives on historical events
- Use primary sources for historical inquiry

**Geography:**
- Understand how geography influenced human activities
- Analyze movement of people, goods, and ideas
- Study human-environment interactions
- Examine spatial organization of economic activities

**Economics:**
- Understand trade and economic systems
- Analyze supply and demand
- Study currency and value
- Examine profit motives and business operations
- Compare historical and modern economic systems

**Culture:**
- Study cultural encounters and adaptations
- Examine formation of new cultural groups (Metis)
- Understand role of women in historical societies
- Analyze social hierarchies and power structures

**Canadian History Curriculum:**

**Grade 7:**
- New France and British North America (1713-1800)
- Fur trade as economic foundation
- Indigenous-European interactions
- Development of Canadian identity

**Grade 8:**
- Expansion and conflict (1800-1850)
- Hudson's Bay Company governance
- Metis nation emergence
- Western territorial development

**Grade 10:**
- Canadian identity formation
- Indigenous peoples' historical experiences
- Economic development patterns
- Regional characteristics

**Grade 11/12:**
- Canadian economic history
- Indigenous history and perspectives
- Historical interpretation and historiography
- Primary source research methods

**Indigenous Studies Integration:**

**Treaties and Rights:**
- Economic relationships between nations
- Trade as diplomacy
- Historical context for treaty negotiations
- Indigenous economic systems

**Cultural Continuity:**
- How Indigenous peoples maintained cultural practices
- Adaptation strategies
- Resistance to colonization
- Survival and resilience

**Contemporary Issues:**
- Historical roots of current Indigenous-government relations
- Land rights and resource extraction
- Economic development in Indigenous communities
- Cultural preservation efforts

**Language Arts Connections:**

**Reading:**
- Historical fiction set in fur trade era
- Primary source documents (journals, letters)
- Non-fiction texts about fur trade history
- Comparative reading of different perspectives

**Writing:**
- Narrative writing from historical perspectives
- Analytical essays on historical themes
- Research papers using primary sources
- Creative writing based on historical scenarios

**Oral Language:**
- Presentations and discussions
- Dramatic interpretations
- Debate on historical interpretations
- Storytelling and oral history

**Mathematics Integration:**

**Number Sense:**
- Currency conversion and calculations
- Profit margin analysis
- Statistical analysis of trade records

**Data Management:**
- Creating graphs from historical data
- Analyzing trade patterns
- Making predictions based on trends

**Science Links:**

**Biology:**
- Study of fur-bearing animals
- Ecosystem impacts of trapping
- Animal behavior and adaptation

**Environmental Science:**
- Historical environmental change
- Sustainability of resource extraction
- Long-term ecological impacts

**Arts Integration:**

**Visual Arts:**
- Historical art analysis (Paul Kane, Frances Anne Hopkins)
- Creating art from historical perspectives
- Museum exhibit design

**Drama:**
- Historical role-playing
- Creating dramatic scenes
- Understanding perspective through performance

**Music:**
- Voyageur songs and music
- Indigenous musical traditions
- Role of music in fur trade culture

**Technology Applications:**

**Digital Literacy:**
- Online research skills
- Evaluating historical sources
- Creating digital presentations
- Using historical databases

**Media Literacy:**
- Analyzing historical representations in media
- Creating documentary-style content
- Understanding bias in historical narratives

**Global Connections:**

**World History:**
- Mercantilism and colonialism
- Global trade networks
- Cultural encounters worldwide
- Comparative colonial systems

**Geography:**
- Global resource distribution
- International trade patterns
- Cultural geography
- Environmental geography

**21st Century Competencies:**

**Critical Thinking:**
- Analyzing multiple perspectives
- Evaluating evidence
- Making connections across time
- Questioning assumptions

**Communication:**
- Presenting research findings
- Collaborating in groups
- Expressing ideas clearly
- Active listening

**Creativity:**
- Imagining historical scenarios
- Problem-solving from historical contexts
- Creating innovative presentations

**Citizenship:**
- Understanding historical roots of current issues
- Developing cultural sensitivity
- Recognizing multiple perspectives
- Engaging with difficult histories`,

  keyFigures: JSON.stringify([
    {
      name: "George Simpson",
      role: "Governor, Hudson's Bay Company",
      years: "1820-1860",
      description: "Known as the 'Little Emperor,' Simpson was the most powerful figure in the fur trade for four decades. He personally inspected trading posts across North America, traveling thousands of miles by canoe. His business acumen and ruthless efficiency transformed the HBC into a profitable enterprise. He was also notorious for his treatment of employees and his abandoned country wives and mixed-race children."
    },
    {
      name: "Thanadelthur",
      role: "Chipewyan Diplomat and Interpreter",
      years: "c. 1697-1717",
      description: "A young Chipewyan woman who became crucial to establishing peace between the Chipewyan and Cree peoples and opening trade relations with the HBC. Despite her youth, she led a dangerous diplomatic mission in brutal winter conditions. Her intelligence, courage, and diplomatic skills were recognized even in HBC records, which rarely acknowledged Indigenous women's contributions."
    },
    {
      name: "John Rowand",
      role: "Chief Factor, Fort Edmonton",
      years: "1823-1854",
      description: "Rowand managed Fort Edmonton for over 30 years, making it one of the most successful trading posts. He was known for his imposing physical presence, his diplomatic skills with Indigenous peoples, and his elaborate feasts. His country wife, Louise Umperville (Metis), was essential to the post's operations and diplomatic relationships."
    },
    {
      name: "James Douglas",
      role: "Chief Factor and Colonial Governor",
      years: "1820-1877",
      description: "Douglas rose from humble origins to become Chief Factor of the Columbia District and later first Governor of British Columbia. His Metis and African ancestry made his career unusual for the time. His decisions shaped both fur trade operations and early British Columbia colonial policy. He maintained strong relationships with Indigenous peoples while managing HBC interests."
    },
    {
      name: "Matonabbee",
      role: "Chipewyan Leader and Guide",
      years: "c. 1737-1782",
      description: "Matonabbee guided Samuel Hearne on his successful journey to the Arctic Ocean and was instrumental in HBC operations in the northern territories. He was a skilled diplomat, trader, and leader who understood both Indigenous and European worlds. His extensive knowledge of the land and Indigenous political relationships made him invaluable to the HBC."
    }
  ]),

  timeline: JSON.stringify([
    {
      year: 1670,
      title: "Hudson's Bay Company Charter",
      description: "Charles II grants the HBC a trade monopoly over all lands draining into Hudson Bay—roughly 40% of modern Canada. The first posts are established at the bay's edge."
    },
    {
      year: 1731,
      title: "La Vérendrye Pushes West",
      description: "French trader Pierre Gaultier de La Vérendrye establishes a chain of trading posts across the prairies, challenging HBC dominance and bringing competition inland."
    },
    {
      year: 1774,
      title: "Cumberland House Established",
      description: "Samuel Hearne builds Cumberland House, the HBC's first inland post, marking a strategic shift from waiting at Hudson Bay to competing directly with Montreal traders."
    },
    {
      year: 1821,
      title: "HBC and NWC Merge",
      description: "After years of violent competition, the Hudson's Bay Company absorbs its rival the North West Company, creating a monopoly that controls trading posts from Hudson Bay to the Pacific."
    },
    {
      year: 1843,
      title: "Fort Victoria Founded",
      description: "James Douglas establishes Fort Victoria on Vancouver Island, which becomes the Pacific headquarters of HBC operations and later capital of British Columbia."
    },
    {
      year: 1870,
      title: "Rupert's Land Transfer",
      description: "The HBC surrenders its territorial claims to the new Dominion of Canada, ending the fur trade era. Many trading posts become permanent settlements and modern towns."
    }
  ]),

  images: JSON.stringify([
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fort_William_Ontario.jpg/1280px-Fort_William_Ontario.jpg",
      caption: "Reconstructed North West Company headquarters at Fort William, showing the scale and complexity of a major trading post",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Paul_Kane_-_Trading_with_the_Indians.jpg/1280px-Paul_Kane_-_Trading_with_the_Indians.jpg",
      caption: "Paul Kane's painting depicting trade negotiations between HBC clerks and Indigenous traders, showing the social complexity of these encounters",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/HBC_trade_goods.jpg/800px-HBC_trade_goods.jpg",
      caption: "Typical HBC trade goods including blankets, kettles, axes, and beads—the currency of the fur trade economy",
      credit: "Wikimedia Commons"
    }
  ])
};

async function updateLesson(lesson: typeof tradingPostContent) {
  console.log(`\nUpdating: ${lesson.id}`);

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
                keyFigures = ?,
                timeline = ?,
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
        lesson.keyFigures,
        lesson.timeline,
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
  console.log("Starting Turso database updates...\n");

  await updateLesson(tradingPostContent);

  console.log("\n=== Update Complete ===");
  console.log("Note: This is lesson 1 of 21. Additional lessons will be added in subsequent runs.");
}

main().catch(console.error);
