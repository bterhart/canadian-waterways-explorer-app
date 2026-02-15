import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function expandContent() {
  // Animals of the Fur Trade - Expanded Teacher Content
  const animalsMainContent = `## Teaching Context

The fur trade provides an ideal lens for exploring economic systems, ecological change, Indigenous-European relations, and environmental history. This lesson connects directly to broader themes of colonialism, resource extraction, and sustainability that remain relevant today.

### Historical Background for Teachers

The beaver pelt trade drove European exploration more than gold or glory. European hat fashion—specifically beaver felt hats—created insatiable demand. The felting process required beaver underfur with its unique microscopic barbs. No other animal possessed this quality, making beaver pelts extraordinarily valuable. A skilled London craftsman might spend three weeks' wages on a single beaver hat.

By 1600, European beaver populations had collapsed from centuries of hunting. This scarcity drove merchants to North America, where beaver populations remained abundant. The economic incentive was enormous: a single successful trading voyage could make a merchant wealthy for life.

### Indigenous Knowledge Systems

Indigenous peoples possessed sophisticated wildlife management practices developed over millennia. Their seasonal hunting patterns, territorial systems, and spiritual beliefs about animal populations created sustainable harvest levels. European commercial pressure disrupted these systems.

When discussing Indigenous trapping expertise, help students understand this represents deep ecological knowledge—understanding beaver behavior, habitat requirements, population dynamics, and seasonal patterns. This knowledge equals or exceeds modern wildlife biology in practical application.

### Economic Systems and Trade Networks

The Made Beaver standard created North America's first commodity currency system. Everything had a price in beaver pelts: one gun = 12 Made Beaver, one blanket = 6 Made Beaver, one pound of tobacco = 2 Made Beaver. This system integrated Indigenous economies into global capitalism.

Discuss with students how this represented economic transformation. Indigenous communities shifted from subsistence economies focused on community needs to market economies focused on European trade goods. This fundamentally altered social structures, gender roles, and inter-tribal relations.

### Environmental Impact: A Case Study

The beaver's ecological role extends far beyond the animal itself. As ecosystem engineers, beavers create and maintain wetland habitats supporting hundreds of other species. Their dams slow water flow, reduce erosion, filter pollutants, and create biodiversity hotspots.

When beaver populations crashed in eastern North America (roughly 1650-1700), the environmental impact was profound:
- Wetlands drained, becoming meadows or forests
- Fish populations declined without beaver pond habitats
- Water tables dropped
- Stream flows became more variable (flooding and drought)
- Bird populations dependent on wetlands declined

This provides an excellent opportunity to discuss cascade effects in ecosystems. Use it to connect historical events to modern environmental science.

### Connections to Modern Issues

The fur trade offers parallels to contemporary resource extraction and environmental debates:
- Overfishing of cod on Atlantic Canada's Grand Banks
- Decline of old-growth forests in British Columbia
- Climate change and resource sustainability
- Indigenous land rights and resource management
- Economic development versus environmental protection

### Teaching Strategies

**Primary Source Analysis**: Show students historical Hudson's Bay Company account books with Made Beaver valuations. Have them calculate the relative value of trade goods and discuss what this reveals about economic systems.

**Ecological Modeling**: Create a simple predator-prey population model showing how removing beavers affects wetland ecosystems. Students can identify cascade effects.

**Perspective-Taking**: Have students write from multiple viewpoints: an HBC factor, a Cree trapper, a beaver (creative writing), an English hat maker. This develops historical empathy and understanding of different stakeholder interests.

**Map Analysis**: Trace the westward movement of the fur trade as eastern beaver populations collapsed. Connect this geographic shift to exploration, fort construction, and Indigenous-European contact.

### Common Misconceptions to Address

**Misconception**: "Indigenous people caused beaver population collapse by overtrapping."
**Reality**: Indigenous harvesting was sustainable for millennia. Commercial demand from European markets drove overharvesting. Economic pressure to acquire European goods (guns, metal tools, cloth) made refusing trade economically disadvantageous.

**Misconception**: "The fur trade was just buying and selling furs."
**Reality**: It represented cultural exchange, economic transformation, political alliances, territorial competition, and environmental change. It fundamentally reshaped North American societies and landscapes.

### Assessment Ideas

- Have students create infographics comparing sustainable Indigenous harvesting practices with commercial extraction
- Design a museum exhibit panel explaining the fur trade's environmental impact
- Write a letter from an HBC Factor to London explaining why beaver populations have declined in their territory
- Create a concept map linking economic, social, political, and environmental aspects of the fur trade

### Extension Opportunities

- Research modern beaver reintroduction programs and their ecological benefits
- Investigate how Indigenous communities today are reclaiming traditional resource management practices
- Compare historical fur trade to modern wildlife trafficking and conservation efforts
- Explore the role of fashion and consumer demand in driving environmental change`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET mainContent = ? WHERE id = ?",
    args: [animalsMainContent, "cmliiajbo0001m2u2lltp5xgn"]
  });
  console.log("✓ Updated Animals of the Fur Trade mainContent");

  // A Day at the Trading Post - Expanded Teacher Content
  const tradingPostMainContent = `## Teaching Context

The fur trading post represents a unique social space where Indigenous and European cultures intersected, negotiated, and transformed each other. This lesson helps students understand the complexity of cultural contact, moving beyond simplified narratives of exploitation or cooperation to examine how different societies adapted to and influenced each other.

### Historical Background for Teachers

York Factory, established in 1684, served as the Hudson's Bay Company's principal post on Hudson Bay for over 200 years. At its peak, it handled millions of pounds worth of furs annually and employed hundreds of workers. The post was essentially a small town with its own social hierarchy, economy, and cultural norms.

The Factor (chief officer) wielded tremendous authority—essentially governing a territory the size of Western Europe with minimal oversight from London. Understanding this power dynamic is crucial: factors could make or break Indigenous traders through credit decisions, price manipulation, or favoritism. Yet factors also depended entirely on Indigenous traders for furs and survival skills in the harsh environment.

### Social Structure and Daily Life

The trading post's social hierarchy was complex and rigid:

**Top Tier**: The Factor and chief officers lived in the "Big House" with servants, fine furniture, and imported luxuries. They dined on china with silver utensils while workers ate from wooden bowls.

**Middle Tier**: Clerks, tradesmen (blacksmiths, coopers, carpenters), and skilled workers had small private rooms and ate separately from laborers.

**Bottom Tier**: Voyageurs, laborers, and servants lived in crowded bunkhouses, performed manual labor, and received minimal wages.

**Indigenous Traders**: Occupied a unique position—economically essential but socially marginalized. They camped outside the post's walls but were treated with diplomatic courtesy during trading because the Company needed their business.

### The Trading Ceremony: Cultural Negotiation

The elaborate trading ceremony represents cultural adaptation. European traders learned they couldn't simply purchase furs like buying goods at a London market. Indigenous trading traditions required:

1. **Welcome and hospitality**: Tea, tobacco, and gifts before discussing business
2. **News and storytelling**: Updates from the interior, discussion of conditions and game populations
3. **Relationship building**: Inquiries about family, acknowledgment of past dealings
4. **Gradual negotiation**: Only after these rituals would actual trading begin

This wasn't inefficiency—it was Indigenous business protocol. Europeans who ignored these customs failed as traders. Successful factors learned to work within Indigenous cultural frameworks while maintaining HBC profit margins.

### The Made Beaver Standard: Understanding Historical Economics

The Made Beaver system provides an excellent opportunity to teach economic concepts:

**Currency**: One prime beaver pelt = 1 Made Beaver (MB)
**Standard Prices** (circa 1790s):
- Gun: 10-14 MB
- Blanket (point): 6-8 MB
- Kettle (brass): 1-2 MB per pound
- Tobacco: 1 MB per pound
- Ammunition: 1 MB for powder and shot
- Knife: 1-2 MB
- Hatchet: 1-2 MB

Have students calculate: How many beaver pelts must a hunter trap to obtain a gun, blanket, kettle, and ammunition? (Answer: roughly 20-25 pelts) How many days of trapping might this represent? This helps students understand the labor involved and economic relationships.

### Women's Essential but Invisible Labor

Historical records focus overwhelmingly on male factors, traders, and voyageurs. Yet posts couldn't function without women's labor:

**Indigenous and Métis women**:
- Prepared and preserved food (especially pemmican for voyageur brigades)
- Made and repaired clothing, snowshoes, and other essential equipment
- Tanned hides and prepared furs for shipping
- Served as interpreters and cultural intermediaries
- Provided diplomatic connections between posts and Indigenous communities
- Gathered plant foods, medicines, and materials

**Country Marriages**: Many HBC employees formed long-term partnerships with Indigenous women ("country marriages"). These relationships weren't just personal—they created crucial economic and political alliances. Children from these unions formed the Métis nation, a distinct cultural and political group.

Discussing this topic requires sensitivity. Avoid romanticizing these relationships (power dynamics were often unequal) but also recognize Indigenous women's agency in forming strategic alliances that benefited their families and communities.

### Teaching the Post as a Complete Community

Help students understand the trading post as a functioning community with:

**Economic functions**: Trading, manufacturing (barrels, boats, tools), agriculture (gardens, livestock)

**Social functions**: Celebrations, marriages, births, deaths, religious services, hierarchies

**Political functions**: Negotiations, alliances, disputes, governance

**Survival functions**: Food production, firewood collection (vast quantities needed), building maintenance, preparing for winter

### Primary Source Opportunities

HBC Archives contain excellent accessible materials:
- Factor's journals detailing daily activities
- Account books showing trade values and transactions
- Letters between factors and London headquarters
- Illustrations and photographs of posts

Have students analyze these sources to answer questions:
- What does the factor spend time on?
- How are Indigenous traders described?
- What concerns does the factor express to London?
- What do account books reveal about economic relationships?

### Comparative Analysis

Compare York Factory to other cultural contact zones:
- Spanish missions in California
- French trading posts in the St. Lawrence Valley
- Russian posts in Alaska
- Dutch trading posts in New York

What patterns emerge? How did different European powers approach trade and cultural interaction?

### Addressing Difficult Topics

**Alcohol**: The HBC used alcohol in trade despite knowing its destructive effects. Discuss corporate ethics, profit motives, and exploitation. Note: Some Indigenous communities banned alcohol trade; others regulated it through their own leaders.

**Disease**: European diseases devastated Indigenous populations at posts and beyond. Trading posts served as disease vectors even when this wasn't intentional.

**Dependency**: The trade created economic dependency on European goods, particularly guns, metal tools, and cloth. Once Indigenous communities adopted these technologies, returning to stone tools became impossible.

Don't avoid these topics, but present them with nuance. Acknowledge exploitation while recognizing Indigenous agency and adaptability.

### Modern Connections

- Hudson's Bay Company still exists as a department store chain (The Bay)
- Many Canadian towns and cities began as fur trading posts
- Indigenous communities today continue traditional trapping and are involved in modern wildlife management
- Questions about resource extraction, corporate responsibility, and Indigenous rights remain central to Canadian politics

### Assessment Strategies

**Role-playing**: Students take roles (Factor, Indigenous trader, clerk, Indigenous woman, voyageur) and simulate a trading day. This builds empathy and understanding of different perspectives.

**Economic analysis**: Calculate trade values, create price lists, analyze profit margins from historical data.

**Comparative essays**: Compare trading post social structures to other historical communities (medieval manors, colonial plantations, frontier towns).

**Creative projects**: Design a museum exhibit, create a "day in the life" video script, or write historical fiction based on research.`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET mainContent = ? WHERE id = ?",
    args: [tradingPostMainContent, "cmliiajbw0004m2u260srsthb"]
  });
  console.log("✓ Updated A Day at the Trading Post mainContent");
}

expandContent().catch(console.error);
