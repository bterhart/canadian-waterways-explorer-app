import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const voyageurLifeContent = {
  id: "cmligbky00019m20z21c6dp3y",
  narrativeContent: `Before dawn breaks over the northern lakes, a sound cuts through the morning mist - the rhythmic splash of paddles and the rise of voices in song. The voyageurs are on the move, beginning another grueling day of what many historians consider the most demanding profession in North American history. These paddlers of the great canoes were the human engines of the fur trade, carrying goods and furs across thousands of miles of rivers, lakes, and portages that linked the interior of the continent to the markets of the world.

The voyageurs emerged as a distinct class of workers in the late 17th century, when the French colonial enterprise in North America expanded westward in search of beaver pelts. The term itself comes from the French word for "traveler," but these men were far more than simple travelers. They were athletes, navigators, and laborers of extraordinary endurance who spent months at a time paddling, portaging, and camping in some of the most challenging terrain on Earth.

To become a voyageur required meeting strict physical requirements. The companies that employed them, primarily the North West Company and later the Hudson's Bay Company, preferred men who were short in stature - ideally no more than five feet six inches tall. This was not discrimination but practical engineering: the canoes had limited space, and shorter men could generate just as much paddling power while taking up less room and adding less weight to already heavily loaded vessels.

The voyageurs were divided into two main groups based on their routes and duties. The mangeurs de lard, or "pork eaters," paddled the larger Montreal canoes between Montreal and the great fur trade rendezvous at Grand Portage or Fort William on Lake Superior. These men earned their somewhat dismissive nickname because their diet on the journey consisted largely of salt pork, peas, and biscuit - provisions that could be carried from the settled areas of the east. The hommes du nord, or "northmen," were the elite of the profession. They paddled the smaller north canoes from the rendezvous points into the interior, wintering at remote posts and subsisting largely on pemmican and whatever food could be obtained locally. The northmen looked down on the pork eaters as soft and inexperienced, and the rivalry between the two groups was fierce.

A typical day for a voyageur began before sunrise, often as early as three or four in the morning. The brigade would wake, pack their camp, load the canoes, and begin paddling while the stars were still visible. They would paddle for hours at a stretch, maintaining a pace of forty to sixty strokes per minute, before stopping briefly to rest and smoke a pipe. These pauses were so regular that distances were often measured in "pipes" rather than miles - a pipe being the distance covered between smoking breaks, typically about five miles.

The paddling rhythm was set and maintained through song. The voyageur songs served multiple purposes: they synchronized the paddle strokes of the crew, lifted spirits during exhausting work, and passed the long hours with entertainment. Many of these songs have survived to the present day, their melodies and lyrics preserved through oral tradition and historical documentation. Songs like "En roulant ma boule" and "Alouette" were favorites, their repetitive structures perfect for the endless rhythm of paddling. The best singers, called the chanteur or canotier, occupied prestigious positions in the crew and were valued almost as highly as the most powerful paddlers.

When water travel was impossible, the voyageurs carried everything overland on portages. These carries, some of which stretched for miles over rough terrain, were perhaps the most grueling aspect of the job. Each voyageur was expected to carry two pieces - bundles weighing ninety pounds each - across the portage at a trot. The fastest and strongest men would make multiple trips while others were still completing their first. Carrying 180 pounds or more while jogging over rocky, root-strewn paths through clouds of mosquitoes and blackflies was considered normal work.

The loads themselves were standardized. Trade goods heading into the interior and furs heading out were packed into ninety-pound pieces, each wrapped in canvas and designed to be carried using a tumpline - a leather strap that passed across the forehead while the load rested on the back. Voyageurs developed characteristic physical marks from their work: bowed legs from constant kneeling in canoes, calloused foreheads from tumplines, and enlarged joints from years of paddling.

The canoes themselves were marvels of Indigenous engineering adopted and adapted by the fur trade. The larger Montreal canoes, called canots du maitre, stretched up to thirty-six feet long and could carry four tons of cargo plus a crew of eight to twelve paddlers. These massive vessels were built from birch bark stretched over a frame of cedar ribs and planking, sewn together with spruce root and waterproofed with spruce gum and bear grease. Despite their size, they were lightweight enough to be portaged, though doing so required the coordinated effort of the entire crew.

The smaller north canoes, or canots du nord, were typically twenty-four to twenty-six feet long and carried about one and a half tons of cargo with a crew of four to six. These more maneuverable vessels were essential for navigating the narrower rivers and smaller lakes of the interior, where the great Montreal canoes simply could not go.

Food for the voyageurs was monotonous but carefully calculated to provide maximum calories for minimum weight and volume. The pork eaters subsisted on salt pork, dried peas or beans, and hardtack biscuits - a diet that became increasingly unappetizing as the weeks wore on. The northmen depended heavily on pemmican, the concentrated food made by Metis and Indigenous women from dried buffalo meat, fat, and sometimes berries. A pound of pemmican could provide over 3,000 calories, making it the perfect fuel for men burning enormous amounts of energy.

The annual cycle of the fur trade structured the voyageurs' year. In spring, the brigades would set out from Montreal laden with trade goods: blankets, knives, axes, beads, cloth, and other items valued by Indigenous trading partners. They would race against time and season to reach the rendezvous points before the brief northern summer ended. At Grand Portage or Fort William, they would meet the northmen bringing furs from the interior, and a great exchange would take place amid days of celebration, trading, and negotiation. Then the pork eaters would hurry back to Montreal with the furs while the northmen returned to their posts to spend another winter in the wilderness.

The social life of the voyageurs was rich and distinctive. They developed their own culture with unique customs, songs, stories, and traditions. Initiations marked important passages: crossing certain geographic thresholds required rituals and celebrations, and a man's first journey into the pays d'en haut (the upper country) was marked by a ceremonial baptism of sorts. The voyageurs were known for their boasting and exaggeration, for their love of bright clothing and decorative sashes, and for their remarkable physical feats - some of which were likely embellished in the telling.

Many voyageurs formed relationships with Indigenous women, and their children became part of the growing Metis population that would play such an important role in the history of western Canada. The culture of the voyageurs blended French Canadian, Indigenous, and frontier influences into something new, and this cultural synthesis was passed down through generations.

The physical toll of voyageur life was severe. Hernias were so common that most men suffered from them. Arthritis crippled joints worn down by decades of paddling. Drowning was an ever-present risk on the rapids and open water. Yet despite these hazards, many men returned year after year, drawn by the camaraderie, the adventure, and the wages that, while not generous, were regular and reliable.

The era of the voyageurs began to fade in the mid-19th century as the fur trade declined and new transportation technologies emerged. The last great brigades paddled in the 1860s, their way of life rendered obsolete by steamboats and railways. But the voyageurs left an indelible mark on the geography, culture, and identity of Canada. Their routes became the paths for later transportation networks. Their songs still echo in Canadian folk music. And their spirit of adventure and endurance remains an inspiration to all who hear their stories.

When we think of the voyageurs, we should imagine not just the physical feats they accomplished, but the entire world they inhabited and helped create. They were the vital link that connected Indigenous peoples of the interior with European markets, the workers who made the fur trade possible, and the cultural pioneers who helped forge the unique identity of Canada's northern regions. Their paddles dipping into cold northern waters, their voices rising in song, their footsteps pounding across portage trails - these sounds are the soundtrack of an era, and they deserve to be remembered.`,
  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg/1280px-Frances_Anne_Hopkins_-_Canoes_in_a_Fog%2C_Lake_Superior_-_Google_Art_Project.jpg",
  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Frances_Anne_Hopkins_-_Voyageurs_at_Dawn%2C_1871.jpg/1280px-Frances_Anne_Hopkins_-_Voyageurs_at_Dawn%2C_1871.jpg",
      caption: "Voyageurs at Dawn by Frances Anne Hopkins, showing the early morning departure of a canoe brigade",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Voyageurs.jpg/800px-Voyageurs.jpg",
      caption: "Depiction of voyageurs carrying canoes and cargo over a portage",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Grand_Portage.jpg/1280px-Grand_Portage.jpg",
      caption: "Grand Portage National Monument, site of the great fur trade rendezvous",
      credit: "Wikimedia Commons"
    }
  ],
  keyFigures: [
    {
      name: "Pierre-Esprit Radisson",
      role: "Explorer and Fur Trader",
      years: "1636-1710",
      description: "One of the earliest and most famous voyageurs, his explorations helped establish the routes that later voyageurs would follow. His adventures and captures by Indigenous peoples became legendary."
    },
    {
      name: "Medard des Groseilliers",
      role: "Explorer and Trader",
      years: "1618-1696",
      description: "Partner of Radisson and co-founder of the fur trade routes to Hudson Bay. Together they helped establish the English-French rivalry in the fur trade."
    },
    {
      name: "Frances Anne Hopkins",
      role: "Artist",
      years: "1838-1919",
      description: "British-Canadian artist who traveled with voyageur brigades and created some of the most detailed and accurate paintings of voyageur life. Her works are invaluable historical documents."
    },
    {
      name: "Jean-Baptiste Cadotte",
      role: "Voyageur and Trader",
      years: "1723-1803",
      description: "A legendary voyageur who rose to become a prominent trader. He married an Ojibwe woman and established important trading relationships with Indigenous communities."
    }
  ],
  timeline: [
    {
      year: 1670,
      title: "Hudson's Bay Company Founded",
      description: "The HBC receives its royal charter, creating competition for the French fur trade and eventually becoming a major employer of voyageurs."
    },
    {
      year: 1731,
      title: "La Verendrye's Expeditions Begin",
      description: "Pierre Gaultier de Varennes, sieur de La Verendrye, begins his explorations westward, establishing posts that would become key voyageur destinations."
    },
    {
      year: 1779,
      title: "North West Company Formed",
      description: "Montreal traders unite to form the NWC, which would become the primary employer of voyageurs and rival to the HBC."
    },
    {
      year: 1784,
      title: "Grand Portage Established",
      description: "The great rendezvous point at Grand Portage becomes the central meeting place for voyageur brigades from Montreal and the interior."
    },
    {
      year: 1803,
      title: "Fort William Built",
      description: "The NWC moves its rendezvous point from Grand Portage to Fort William after boundary changes place Grand Portage in American territory."
    },
    {
      year: 1821,
      title: "HBC-NWC Merger",
      description: "The merger of the two great fur trading companies changes voyageur employment patterns and begins the decline of the profession."
    },
    {
      year: 1870,
      title: "End of Voyageur Era",
      description: "The last major voyageur brigades operate as steamboats and railways make traditional canoe transportation obsolete."
    }
  ],
  readingTimeMinutes: 14,
  teacherObjectives: [
    "Students will describe the daily life and working conditions of voyageurs",
    "Students will analyze the physical demands of voyageur work and explain why specific physical characteristics were valued",
    "Students will understand the role of voyageurs in connecting Indigenous peoples with European markets",
    "Students will recognize the cultural contributions of voyageurs to Canadian identity",
    "Students will evaluate the economic importance of the voyageur system to the fur trade"
  ],
  teacherActivities: [
    {
      title: "Paddle Rhythm Exercise",
      description: "Students use wooden spoons or rulers as paddles while seated and learn a voyageur song. They practice maintaining rhythm while singing and discover how exhausting even simulated paddling becomes.",
      materials: "Wooden spoons or rulers, recordings of voyageur songs, lyrics sheets",
      duration: "30 minutes"
    },
    {
      title: "Portage Challenge",
      description: "Set up a relay course where students carry weighted backpacks (appropriate to their age/size) over obstacles. Calculate total weight moved and compare to historical voyageur loads.",
      materials: "Backpacks with safe weights, obstacle course materials, stopwatch",
      duration: "45 minutes"
    },
    {
      title: "Canoe Design Analysis",
      description: "Students examine diagrams and images of birch bark canoes and analyze why specific design choices were made. They compare to modern canoes and discuss trade-offs.",
      materials: "Canoe diagrams, craft materials for model building, comparison charts",
      duration: "50 minutes"
    },
    {
      title: "Voyageur Menu Planning",
      description: "Students calculate the calories in a voyageur diet and compare to their own daily needs. They research what foods provide maximum nutrition for minimum weight.",
      materials: "Nutrition charts, calculators, food packaging for comparison",
      duration: "35 minutes"
    }
  ],
  teacherQuestions: [
    "Why were shorter men preferred as voyageurs? What does this tell us about the importance of practical considerations in historical labor?",
    "How did voyageur songs serve both practical and social purposes?",
    "What skills would a successful voyageur need to develop, beyond physical strength?",
    "How did the voyageur profession contribute to the development of Metis culture?",
    "Why do you think men continued to work as voyageurs despite the dangerous conditions?",
    "How did the voyageur system depend on Indigenous knowledge and technology?",
    "What modern professions might be compared to the voyageurs in terms of physical demands and lifestyle?"
  ],
  teacherNotes: `This lesson connects to curriculum outcomes related to the fur trade, Canadian economic history, and cultural development.

Key teaching points:
- The voyageurs represent a crucial but often overlooked aspect of Canadian history
- Their profession depended entirely on Indigenous technology (birch bark canoes) and knowledge (routes, portages)
- The voyageur culture was distinct and has influenced Canadian identity, particularly in Quebec
- Songs are an excellent entry point for students and can make the history feel immediate and alive

Sensitive considerations:
- Voyageur relationships with Indigenous women were complex and should be discussed thoughtfully
- The fur trade had significant impacts on Indigenous communities and ecosystems
- Avoid romanticizing what was genuinely dangerous and exploitative labor

Extension opportunities:
- Learn and perform voyageur songs in French and English
- Study the art of Frances Anne Hopkins as primary sources
- Explore the modern recreation of voyageur routes by canoe
- Connect to the story of the Metis Nation
- Investigate the environmental impact of the fur trade

Assessment ideas:
- Create a diary entry from a voyageur's perspective
- Map a historical trade route and calculate distances
- Compare primary sources depicting voyageur life
- Design a recruitment poster for voyageurs`
};

async function updateVoyageurLife() {
  console.log("Updating Voyageur Life lesson plan...");

  try {
    const result = await client.execute({
      sql: `UPDATE LessonPlan SET
        narrativeContent = ?,
        heroImageUrl = ?,
        images = ?,
        keyFigures = ?,
        timeline = ?,
        readingTimeMinutes = ?,
        teacherObjectives = ?,
        teacherActivities = ?,
        teacherQuestions = ?,
        teacherNotes = ?
      WHERE id = ?`,
      args: [
        voyageurLifeContent.narrativeContent,
        voyageurLifeContent.heroImageUrl,
        JSON.stringify(voyageurLifeContent.images),
        JSON.stringify(voyageurLifeContent.keyFigures),
        JSON.stringify(voyageurLifeContent.timeline),
        voyageurLifeContent.readingTimeMinutes,
        JSON.stringify(voyageurLifeContent.teacherObjectives),
        JSON.stringify(voyageurLifeContent.teacherActivities),
        JSON.stringify(voyageurLifeContent.teacherQuestions),
        voyageurLifeContent.teacherNotes,
        voyageurLifeContent.id
      ]
    });

    console.log("Voyageur Life update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating Voyageur Life:", error);
    throw error;
  }
}

updateVoyageurLife()
  .then(() => {
    console.log("Successfully updated Voyageur Life lesson plan");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
