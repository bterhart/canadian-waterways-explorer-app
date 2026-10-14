import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const davidThompsonContent = {
  id: "cmligbky9001cm20z3vukcwiq",
  narrativeContent: `In the summer of 1811, a weathered canoe carrying a small party of exhausted travelers emerged from the mountain passes and reached the Pacific Ocean at the mouth of the Columbia River. The leader of this expedition was a slight, unassuming man with one good eye and an obsessive dedication to accuracy. David Thompson had just completed the first recorded journey down the entire length of the Columbia River, adding the final major piece to his life's work: a map of western North America so accurate that it would remain the standard reference for generations.

David Thompson is sometimes called "the greatest land geographer who ever lived," yet for most of his life he labored in obscurity, and even today he remains less famous than many lesser explorers. Perhaps this is because Thompson was more interested in accuracy than in glory, more concerned with getting the details right than with telling dramatic stories about his adventures. But the scope of his achievement is staggering: over the course of his career, he traveled nearly 90,000 kilometers through the wilderness of North America and mapped approximately 3.9 million square kilometers - an area larger than most European countries combined.

Thompson was born in London in 1770, the son of poor Welsh parents. His father died when David was two years old, leaving his mother unable to support her children. At seven years of age, David was placed in the Grey Coat Hospital, a charity school that provided education to poor boys in exchange for eventual service in Britain's colonial enterprises. There he received a basic education that included an introduction to mathematics and navigation - skills that would shape his entire life.

At fourteen, Thompson was apprenticed to the Hudson's Bay Company and shipped across the Atlantic to the wilderness of Rupert's Land. He landed at Churchill, on the western shore of Hudson Bay, and was immediately plunged into a world utterly unlike anything he had known. The harsh northern climate, the vast distances, the Indigenous peoples with their unfamiliar languages and customs - all of this must have been overwhelming for a boy from the London slums. But Thompson adapted, and he began to learn.

His early years with the HBC were spent at various posts in the interior, where he learned the practical skills of the fur trade: canoeing, portaging, trading with Indigenous peoples, surviving in the wilderness. But he also received a remarkable piece of luck. During a winter at Cumberland House, he met Philip Turnor, the HBC's official surveyor, who recognized Thompson's aptitude for mathematics and began teaching him the science of surveying and astronomical observation.

Turnor taught Thompson how to use a sextant to measure the angle between celestial bodies and the horizon, how to consult astronomical tables to determine longitude, how to triangulate positions and calculate distances. These were the cutting-edge techniques of 18th-century geography, and Thompson absorbed them with passionate intensity. He would spend the rest of his life perfecting and applying these skills.

In 1788, Thompson suffered a serious injury when he broke his leg. The long convalescence, though frustrating, gave him time to further develop his surveying skills and to deepen his education through reading. When he recovered, he was no longer content to be simply a fur trader - he wanted to map the world.

The HBC, however, was not particularly interested in systematic exploration. The company's profits came from the fur trade, and surveying expeditions were expensive luxuries. Thompson grew frustrated with what he saw as the company's lack of vision. In 1797, he made the dramatic decision to leave the HBC and join its rival, the North West Company, which was more supportive of exploration.

With the North West Company, Thompson flourished. He was given the freedom and resources to pursue his surveying work, and over the next fifteen years he undertook a series of expeditions that would transform the map of North America. He traveled up the Saskatchewan River system, crossed the Rocky Mountains multiple times, explored the headwaters of the Columbia, and descended to the Pacific.

Throughout these travels, Thompson maintained meticulous records. Every day, often multiple times a day, he would take astronomical observations to fix his position. He recorded distances traveled, compass bearings, the courses of rivers, the locations of mountains and lakes. His journals, cramped with calculations and observations, became the raw data from which he would construct his great map.

His methods were remarkably sophisticated for the time. He understood the limitations of his instruments and developed techniques to minimize errors. He cross-checked his observations against each other, always seeking greater accuracy. When he encountered Indigenous peoples, he carefully interviewed them about the geography of regions he could not visit personally, incorporating their knowledge into his developing picture of the land.

Thompson's relationship with Indigenous peoples was generally respectful and mutually beneficial. Unlike some European explorers who saw Indigenous knowledge as primitive or unreliable, Thompson recognized that people who had lived on the land for generations possessed invaluable geographic information. He learned Indigenous languages, participated in their protocols, and acknowledged his debts to their guidance and hospitality.

His marriage to Charlotte Small, the Metis daughter of a fur trader and a Cree woman, was both a personal and professional partnership. Charlotte accompanied Thompson on many of his expeditions, and their children were born at various points across the wilderness. Thompson's journals mention Charlotte matter-of-factly, recording her presence without elaboration, but her role as guide, interpreter, and companion was clearly essential to his work. In his private writings, he credited her with saving his life on multiple occasions.

The crossing of the Rocky Mountains presented particular challenges. The passes were snow-choked and treacherous, the terrain utterly unfamiliar. Thompson made his first successful crossing in 1807, establishing Kootenae House as a trading post on the western side of the mountains. Over the following years, he explored the Columbia River system, searching for a navigable route to the Pacific.

His final push to the ocean in 1811 was driven in part by competition. American traders, backed by John Jacob Astor, were establishing their own presence at the mouth of the Columbia, and the North West Company wanted to secure British claims to the region. Thompson arrived at the American post of Fort Astoria just weeks after it had been established, too late to claim first arrival for Britain but in time to demonstrate British presence and knowledge of the territory.

After his arrival at the Pacific, Thompson returned east and began the monumental task of compiling his years of observations into a single comprehensive map. Working with his accumulated journals, calculations, and notes, he constructed what he called "the Map of the North-West Territory of the Province of Canada." This extraordinary document, measuring approximately two meters by three meters, showed the entire drainage basin of western Canada with remarkable accuracy.

The map was delivered to the North West Company in 1814, and Thompson expected it would bring him recognition and reward. Instead, the company paid him a modest sum and filed the map away in its archives, where it remained largely unknown for decades. Thompson, who had given his eyesight and his health to creating this masterpiece, found himself facing poverty in his old age.

The following decades were difficult. Thompson tried various business ventures, all of which failed. He worked as a surveyor for the boundary commission that defined the border between British North America and the United States, using his intimate knowledge of the terrain to help establish the line that still separates Canada from its southern neighbor. But he was never adequately compensated for his contributions.

In his final years, Thompson lived in poverty in Montreal, working on his memoirs and trying to complete a revised version of his great map. His eyesight failed completely - the decades of peering through sextants and writing by candlelight had taken their toll. He died in 1857, largely forgotten, his geographical achievements unrecognized by the public that benefited from them.

It was only in the 20th century that Thompson's reputation began to recover. Scholars rediscovered his journals and his maps, recognizing them as extraordinary achievements of scientific exploration. His great map, carefully preserved in the archives of Ontario, was finally published and studied. Today, Thompson is honored with monuments, parks, and educational resources that celebrate his contributions to the understanding of North America.

David Thompson's legacy is written across the landscape of western Canada. Rivers, mountains, and highways bear his name. The accuracy of his surveys established boundaries that remain in effect today. His work provided the foundation for all subsequent mapping of the region. But perhaps his greatest legacy is the example he set: of meticulous attention to accuracy, of respect for Indigenous knowledge, of dedication to understanding the world as it truly is. In an age that often valued drama over precision, Thompson chose truth.`,
  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/David_Thompson_%28explorer%29.jpg/800px-David_Thompson_%28explorer%29.jpg",
  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/David_Thompson_map.jpg/1280px-David_Thompson_map.jpg",
      caption: "A portion of David Thompson's great map of western North America",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Rocky_Mountains_Canada.jpg/1280px-Rocky_Mountains_Canada.jpg",
      caption: "The Rocky Mountains that Thompson crossed multiple times during his explorations",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sextant.jpg/800px-Sextant.jpg",
      caption: "A sextant similar to the one Thompson used for his astronomical observations",
      credit: "Wikimedia Commons"
    }
  ],
  keyFigures: [
    {
      name: "David Thompson",
      role: "Explorer and Cartographer",
      years: "1770-1857",
      description: "The greatest land geographer of his era, Thompson traveled nearly 90,000 kilometers and mapped approximately 3.9 million square kilometers of North America. His great map remained the standard reference for western Canada for generations."
    },
    {
      name: "Charlotte Small Thompson",
      role: "Explorer's Partner",
      years: "c.1785-1857",
      description: "Metis wife of David Thompson who accompanied him on many expeditions. She was mother to their thirteen children and contributed to Thompson's work as interpreter and guide."
    },
    {
      name: "Philip Turnor",
      role: "HBC Surveyor",
      years: "1751-1799",
      description: "The Hudson's Bay Company's official surveyor who recognized Thompson's potential and taught him the skills of astronomical observation and surveying that made his later achievements possible."
    },
    {
      name: "Koo-koo-sint (Finan McDonald)",
      role: "Interpreter and Guide",
      years: "1782-1851",
      description: "A trader and interpreter who worked closely with Thompson during his Rocky Mountain explorations, helping to establish relationships with Indigenous peoples of the region."
    }
  ],
  timeline: [
    {
      year: 1770,
      title: "David Thompson Born",
      description: "David Thompson is born in London to poor Welsh parents. His father dies when David is two years old."
    },
    {
      year: 1784,
      title: "Apprenticed to HBC",
      description: "At age fourteen, Thompson is apprenticed to the Hudson's Bay Company and shipped to Rupert's Land."
    },
    {
      year: 1790,
      title: "Training as Surveyor",
      description: "Thompson receives training in surveying and astronomical observation from Philip Turnor at Cumberland House."
    },
    {
      year: 1797,
      title: "Joins North West Company",
      description: "Frustrated by HBC's lack of interest in exploration, Thompson joins the rival North West Company."
    },
    {
      year: 1799,
      title: "Marriage to Charlotte Small",
      description: "Thompson marries Charlotte Small, who becomes his partner in exploration and life."
    },
    {
      year: 1807,
      title: "First Rocky Mountain Crossing",
      description: "Thompson makes his first successful crossing of the Rocky Mountains and establishes Kootenae House."
    },
    {
      year: 1811,
      title: "Reaches the Pacific",
      description: "Thompson completes his journey down the Columbia River to the Pacific Ocean, arriving at Fort Astoria."
    },
    {
      year: 1814,
      title: "Great Map Completed",
      description: "Thompson delivers his monumental map of western North America to the North West Company."
    },
    {
      year: 1857,
      title: "Thompson Dies",
      description: "David Thompson dies in poverty in Montreal, his achievements largely unrecognized by the public."
    }
  ],
  readingTimeMinutes: 14,
  teacherObjectives: [
    "Students will understand the scientific methods Thompson used for surveying and mapping",
    "Students will analyze the challenges of exploration and mapping in pre-industrial North America",
    "Students will recognize how Indigenous knowledge contributed to Thompson's achievements",
    "Students will evaluate the legacy of Thompson's work in establishing Canadian geography and boundaries",
    "Students will understand how historical recognition can be delayed or denied based on various factors"
  ],
  teacherActivities: [
    {
      title: "Celestial Navigation Basics",
      description: "Introduce students to the principles of celestial navigation. Use a simple sextant model or app to demonstrate how Thompson determined latitude. Discuss why longitude was more challenging.",
      materials: "Sextant model or navigation app, star charts, globe",
      duration: "45 minutes"
    },
    {
      title: "Mapping Without GPS",
      description: "Students work in small groups to create a map of the school grounds using only a compass, a measuring wheel or pacing, and dead reckoning. Compare results to actual maps.",
      materials: "Compasses, measuring wheels or marked pacing distances, graph paper, actual school maps for comparison",
      duration: "60 minutes"
    },
    {
      title: "Primary Source Analysis",
      description: "Students examine excerpts from Thompson's journals, analyzing his writing style, his observations, and what they reveal about his methods and values.",
      materials: "Transcribed excerpts from Thompson's journals, analysis worksheets",
      duration: "40 minutes"
    },
    {
      title: "Comparative Map Study",
      description: "Compare Thompson's map to modern satellite imagery of the same region. Identify what Thompson got right, what he got wrong, and discuss possible reasons for discrepancies.",
      materials: "Copies of Thompson's map sections, Google Earth or similar satellite imagery, overlay tools",
      duration: "50 minutes"
    }
  ],
  teacherQuestions: [
    "Why was accurate mapping important for the fur trade companies and for British North America?",
    "How did Thompson's working-class background affect his career and his eventual recognition?",
    "What role did Indigenous knowledge play in Thompson's mapping achievements?",
    "Why do you think Thompson has been called 'the greatest land geographer who ever lived'?",
    "How did the competition between fur trade companies influence Thompson's work?",
    "What does Thompson's story tell us about how historical achievements are recognized or forgotten?",
    "How do Thompson's methods compare to modern geographic techniques?"
  ],
  teacherNotes: `This lesson connects to curriculum outcomes related to exploration, the fur trade, scientific methods, and the development of Canadian territory.

Key teaching points:
- Thompson's achievements were based on rigorous scientific method, not luck or adventure
- Indigenous peoples were essential partners in exploration, not obstacles to it
- Historical recognition often comes long after the actual achievements
- The boundaries Thompson helped survey are still in effect today

Sensitive considerations:
- Acknowledge that Thompson's mapping facilitated colonization with its impacts on Indigenous peoples
- Discuss the complexity of exploration as both scientific achievement and colonial enterprise
- Charlotte Small's contributions should be highlighted rather than treated as a footnote

Connections to other subjects:
- Mathematics: celestial navigation, triangulation, calculation of distances
- Science: astronomy, geography, meteorology
- Technology: surveying instruments, their capabilities and limitations
- Art: map-making as both science and craft

Extension opportunities:
- Study the history of cartography and how maps have changed over time
- Explore modern satellite mapping and GPS technology
- Investigate how Indigenous peoples created and transmitted geographic knowledge
- Trace the Canada-US border and Thompson's role in establishing it
- Compare Thompson's methods to those of other famous surveyors/cartographers

Assessment ideas:
- Create a map using Thompson's methods (compass and measurement)
- Write a biographical essay on Thompson's life and legacy
- Analyze primary sources from Thompson's journals
- Design a museum exhibit about Thompson's achievements`
};

async function updateDavidThompson() {
  console.log("Updating David Thompson lesson plan...");

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
        davidThompsonContent.narrativeContent,
        davidThompsonContent.heroImageUrl,
        JSON.stringify(davidThompsonContent.images),
        JSON.stringify(davidThompsonContent.keyFigures),
        JSON.stringify(davidThompsonContent.timeline),
        davidThompsonContent.readingTimeMinutes,
        JSON.stringify(davidThompsonContent.teacherObjectives),
        JSON.stringify(davidThompsonContent.teacherActivities),
        JSON.stringify(davidThompsonContent.teacherQuestions),
        davidThompsonContent.teacherNotes,
        davidThompsonContent.id
      ]
    });

    console.log("David Thompson update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating David Thompson:", error);
    throw error;
  }
}

updateDavidThompson()
  .then(() => {
    console.log("Successfully updated David Thompson lesson plan");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
