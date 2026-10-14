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

### Environmental Impact: A Case Study

The beaver's ecological role extends far beyond the animal itself. As ecosystem engineers, beavers create and maintain wetland habitats supporting hundreds of other species. Their dams slow water flow, reduce erosion, filter pollutants, and create biodiversity hotspots.

When beaver populations crashed in eastern North America (roughly 1650-1700), the environmental impact was profound: wetlands drained, fish populations declined, water tables dropped, and stream flows became more variable.

### Teaching Strategies

Use primary source analysis with Hudson's Bay Company account books. Have students calculate trade good values and discuss economic systems. Create ecological models showing beaver population impacts. Use perspective-taking exercises from multiple viewpoints.

### Assessment Ideas

Have students create infographics comparing sustainable Indigenous practices with commercial extraction, or design museum exhibits explaining environmental impact.`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET mainContent = ? WHERE id = ?",
    args: [animalsMainContent, "cmliiajbo0001m2u2lltp5xgn"]
  });
  console.log("✓ Updated Animals of the Fur Trade mainContent");

  // A Day at the Trading Post - Expanded Teacher Content
  const tradingPostMainContent = `## Teaching Context

The fur trading post represents a unique social space where Indigenous and European cultures intersected, negotiated, and transformed each other. This lesson helps students understand the complexity of cultural contact.

### Historical Background for Teachers

York Factory, established in 1684, served as the Hudson's Bay Company's principal post for over 200 years. At its peak, it handled millions of pounds worth of furs annually and employed hundreds of workers. The Factor wielded tremendous authority—essentially governing a territory the size of Western Europe.

### Social Structure and Daily Life

The trading post had a complex social hierarchy: The Factor and officers lived in the Big House with servants and luxuries. Clerks and tradesmen had private rooms. Voyageurs and laborers lived in crowded bunkhouses. Indigenous traders occupied a unique position—economically essential but socially marginalized.

### The Trading Ceremony: Cultural Negotiation

The elaborate trading ceremony represents cultural adaptation. Europeans learned they couldn't simply purchase furs like buying goods at a London market. Indigenous trading traditions required welcome hospitality, news sharing, relationship building, and gradual negotiation. This wasn't inefficiency—it was Indigenous business protocol.

### The Made Beaver Standard

One prime beaver pelt equaled 1 Made Beaver. Standard prices: Gun (12 MB), Blanket (6 MB), Tobacco (2 MB per pound). Have students calculate how many beaver pelts a hunter needed for essential supplies.

### Women's Essential Labor

Indigenous and Métis women prepared food, made clothing, tanned hides, served as interpreters, and provided diplomatic connections. Country marriages created crucial economic and political alliances. Children from these unions formed the Métis nation.

### Primary Source Opportunities

HBC Archives contain factor journals, account books, and letters. Have students analyze these to understand daily activities, economic relationships, and how Indigenous traders were described.

### Teaching Strategies

Use role-playing simulations with different perspectives (Factor, Indigenous trader, clerk, voyageur). Analyze economic data from historical records. Compare trading posts to other cultural contact zones.

### Modern Connections

Hudson's Bay Company still exists as The Bay department stores. Many Canadian cities began as fur trading posts. Indigenous communities continue traditional trapping and wildlife management today.`;

  await turso.execute({
    sql: "UPDATE LessonPlan SET mainContent = ? WHERE id = ?",
    args: [tradingPostMainContent, "cmliiajbw0004m2u260srsthb"]
  });
  console.log("✓ Updated A Day at the Trading Post mainContent");
}

expandContent().catch(console.error);
