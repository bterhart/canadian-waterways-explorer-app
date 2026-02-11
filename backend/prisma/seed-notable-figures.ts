import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NotableFigureData {
  name: string;
  alternateNames?: string;
  birthYear?: number;
  deathYear?: number;
  nation?: string;
  birthPlace?: string;
  figureType: string;
  role: string;
  biography: string;
  significance: string;
  associatedExplorers?: { name: string; relationship: string }[];
  achievements?: string[];
  associatedLocations?: string[];
  activePeriodStart?: number;
  activePeriodEnd?: number;
  imageUrl?: string;
  isFeatured: boolean;
}

const notableFigures: NotableFigureData[] = [
  // ==================== WOMEN ====================
  {
    name: "Charlotte Small",
    alternateNames: "Charlotte Small Thompson",
    birthYear: 1785,
    deathYear: 1857,
    nation: "Metis",
    birthPlace: "Ile-a-la-Crosse, Saskatchewan",
    figureType: "woman",
    role: "Partner of David Thompson, interpreter, and expedition companion",
    biography:
      "Charlotte Small was a Metis woman who became the wife and lifelong partner of the renowned cartographer and explorer David Thompson. Born at Ile-a-la-Crosse to Patrick Small, a North West Company partner, and a Cree woman, Charlotte married Thompson in 1799 when she was just fourteen. She accompanied her husband on many of his most significant journeys, traveling thousands of miles through uncharted wilderness while pregnant or with young children. Charlotte was instrumental in Thompson's success, serving as an interpreter and helping maintain vital relationships with Indigenous peoples. Together they had thirteen children, many born during expeditions in remote locations. After Thompson's death in 1857, Charlotte passed away just three months later, a testament to their enduring bond.",
    significance:
      "Charlotte Small represents the crucial but often unrecognized role that Indigenous and Metis women played in the fur trade and exploration of Canada. Her linguistic skills, cultural knowledge, and resilience enabled David Thompson to complete some of the most important cartographic work in North American history. She traveled over 10,000 miles with Thompson, including the arduous journey across the Rocky Mountains.",
    associatedExplorers: [
      { name: "David Thompson", relationship: "Wife and travel companion" },
    ],
    achievements: [
      "Traveled over 10,000 miles through Canadian wilderness with David Thompson",
      "Served as interpreter between English traders and Indigenous peoples",
      "Raised 13 children, many born during wilderness expeditions",
      "Crossed the Rocky Mountains multiple times",
      "Maintained vital diplomatic relationships with Indigenous nations",
    ],
    associatedLocations: [
      "Ile-a-la-Crosse",
      "Rocky Mountain House",
      "Columbia River",
      "Kootenay House",
      "Montreal",
    ],
    activePeriodStart: 1799,
    activePeriodEnd: 1812,
    isFeatured: true,
  },
  {
    name: "Thanadelthur",
    alternateNames: "Slave Woman, Ambassador of Peace",
    birthYear: 1697,
    deathYear: 1717,
    nation: "Chipewyan",
    birthPlace: "Northern Canada (near present-day Northwest Territories)",
    figureType: "woman",
    role: "Peacemaker, guide, and interpreter for Hudson's Bay Company",
    biography:
      "Thanadelthur was a remarkable Chipewyan woman who played a pivotal role in establishing peace between the Chipewyan (Dene) and Cree nations, and in expanding the Hudson's Bay Company's trade into the Canadian interior. In 1713, she was captured by a Cree raiding party along with other Chipewyan people. After nearly two years of captivity, she escaped during a winter hunt and eventually made her way to York Factory, arriving in November 1714. There she met Governor James Knight, who recognized her exceptional abilities. In 1715-1716, she led an expedition with William Stuart to broker peace between the Cree and Chipewyan peoples. Her forceful diplomacy succeeded where others had failed, enabling the Chipewyan to safely trade at York Factory. Tragically, she died of illness at York Factory in February 1717, at approximately twenty years of age.",
    significance:
      "Thanadelthur's diplomatic achievements had lasting consequences for the fur trade and Indigenous relations in northern Canada. Her successful peace mission opened the northern fur trade to the Chipewyan people and led directly to the establishment of Fort Churchill. James Knight wrote that she had 'a Divellish Spirit' and was 'the Chief promoter and Acter' of the peace - high praise that reveals her extraordinary leadership abilities in an era when women's contributions were rarely acknowledged. She demonstrated exceptional courage, intelligence, and diplomatic skill.",
    associatedExplorers: [
      { name: "James Knight", relationship: "HBC Governor who sponsored her mission" },
      { name: "William Stuart", relationship: "Led expedition with her" },
    ],
    achievements: [
      "Brokered historic peace between Cree and Chipewyan nations",
      "Led Hudson's Bay Company expedition into unknown territory",
      "Opened northern fur trade routes for Chipewyan people",
      "Paved the way for establishment of Fort Churchill",
      "Escaped captivity and survived winter journey to York Factory",
    ],
    associatedLocations: [
      "York Factory",
      "Fort Churchill",
      "Barren Lands",
      "Northwest Territories",
    ],
    activePeriodStart: 1714,
    activePeriodEnd: 1717,
    isFeatured: true,
  },
  {
    name: "Marie-Anne Gaboury",
    alternateNames: "Marie-Anne Lagimodiere",
    birthYear: 1780,
    deathYear: 1875,
    nation: undefined,
    birthPlace: "Maskinonge, Quebec",
    figureType: "woman",
    role: "First European woman to travel to the Canadian Northwest",
    biography:
      "Marie-Anne Gaboury holds the distinction of being the first European woman to travel to the Canadian Northwest, making the arduous journey in 1806 when she was twenty-six years old. Born in Quebec, she married Jean-Baptiste Lagimodiere, a fur trader and voyageur. Against all conventions of the time, she insisted on accompanying her husband west rather than remaining in Quebec. She traveled by canoe and on foot through the wilderness, eventually settling near present-day Pembina and later Red River. She lived among the Metis and Indigenous peoples, adapting to life on the prairies. Marie-Anne gave birth to several children in the west, including Julie, who would become the mother of Louis Riel, the famous Metis leader. Marie-Anne lived to the remarkable age of 95, witnessing the transformation of the Northwest from fur trade territory to Canadian provinces.",
    significance:
      "Marie-Anne Gaboury's journey west broke new ground for European women in Canada and demonstrated the possibilities for family life in the fur trade territories. Her decision to accompany her husband challenged the norms of her era and showed remarkable courage and determination. As the grandmother of Louis Riel, she is connected to one of the most significant figures in Canadian history. Her long life (1780-1875) spanned the entire era of western Canadian fur trade and early settlement.",
    associatedExplorers: [
      { name: "Jean-Baptiste Lagimodiere", relationship: "Husband, voyageur and fur trader" },
    ],
    achievements: [
      "First European woman to travel to the Canadian Northwest",
      "Survived multiple journeys through wilderness by canoe and on foot",
      "Grandmother of Louis Riel",
      "Adapted to life among Indigenous and Metis peoples",
      "Lived to age 95, witnessing transformation of the West",
    ],
    associatedLocations: [
      "Maskinonge, Quebec",
      "Pembina",
      "Red River Settlement",
      "St. Boniface",
    ],
    activePeriodStart: 1806,
    activePeriodEnd: 1875,
    isFeatured: false,
  },
  {
    name: "Isabel Gunn",
    alternateNames: "John Fubbister, Mary Fubbister",
    birthYear: 1780,
    deathYear: 1861,
    nation: undefined,
    birthPlace: "Orkney Islands, Scotland",
    figureType: "woman",
    role: "First European woman in Rupert's Land (disguised as a man)",
    biography:
      "Isabel Gunn was a Scottish woman from the Orkney Islands who disguised herself as a man named 'John Fubbister' to work for the Hudson's Bay Company. In 1806, she arrived at Moose Factory and later transferred to Pembina, performing the same arduous labor as male employees for nearly two years. Her secret was revealed on December 29, 1807, when she gave birth to a son at the Pembina post. The incident caused considerable scandal in the company. She was sent back to York Factory and eventually to Albany Factory, where she worked as a washerwoman before being sent back to Scotland in 1809. Despite the scandal, Gunn's story reveals the lengths some women went to in order to escape limited opportunities at home and seek adventure and employment in the New World.",
    significance:
      "Isabel Gunn's extraordinary deception highlights the rigid gender barriers of her era and the determination of some women to overcome them. She is considered the first European woman to have lived in Rupert's Land (the vast territory controlled by the Hudson's Bay Company), though this was only possible through her disguise. Her story challenges our understanding of gender roles in the fur trade and demonstrates that women could and did perform the same physically demanding work as men when given the opportunity.",
    associatedExplorers: [],
    achievements: [
      "First European woman to live in Rupert's Land",
      "Successfully disguised herself as a man for nearly two years",
      "Performed demanding physical labor as an HBC employee",
      "Challenged gender norms of the early 19th century",
    ],
    associatedLocations: [
      "Orkney Islands",
      "Moose Factory",
      "Pembina",
      "York Factory",
      "Albany Factory",
    ],
    activePeriodStart: 1806,
    activePeriodEnd: 1809,
    isFeatured: false,
  },
  {
    name: "Sacagawea",
    alternateNames: "Sakakawea, Sacajawea, Bird Woman",
    birthYear: 1788,
    deathYear: 1812,
    nation: "Lemhi Shoshone",
    birthPlace: "Near present-day Salmon, Idaho",
    figureType: "woman",
    role: "Guide and interpreter for the Lewis and Clark Expedition",
    biography:
      "Sacagawea was a Lemhi Shoshone woman who is best known for her role in the Lewis and Clark Expedition (1804-1806). Though primarily associated with American exploration, her story connects to the broader North American fur trade networks that linked the United States and British North America. Around 1800, she was captured by a Hidatsa raiding party and taken to their village near present-day Bismarck, North Dakota. There she was purchased by (or gambled away to) French-Canadian fur trader Toussaint Charbonneau, who made her his wife. When Lewis and Clark arrived in 1804, they hired Charbonneau as an interpreter, and Sacagawea accompanied the expedition. She proved invaluable as an interpreter, guide, and symbol of peaceful intentions. She gave birth to her son Jean Baptiste during the journey. The details of her later life and death are debated, with some accounts suggesting she died in 1812 and others that she lived until 1884.",
    significance:
      "Sacagawea's contributions to the Lewis and Clark Expedition were immense. Her presence with an infant signaled to Indigenous peoples that the expedition was not a war party. She provided crucial geographic knowledge when the expedition reached Shoshone territory, and she helped negotiate the acquisition of horses that were essential for crossing the Rocky Mountains. Her story illustrates the interconnected nature of Indigenous and European exploration and trade networks across North America.",
    associatedExplorers: [
      { name: "Meriwether Lewis", relationship: "Expedition co-leader" },
      { name: "William Clark", relationship: "Expedition co-leader" },
      { name: "Toussaint Charbonneau", relationship: "Husband and interpreter" },
    ],
    achievements: [
      "Served as guide and interpreter for Lewis and Clark Expedition",
      "Helped negotiate vital horse acquisitions from Shoshone people",
      "Traveled from North Dakota to the Pacific Ocean and back",
      "Provided crucial geographic and cultural knowledge",
      "Symbol of peaceful intentions for the expedition",
    ],
    associatedLocations: [
      "Fort Mandan",
      "Rocky Mountains",
      "Columbia River",
      "Pacific Ocean",
    ],
    activePeriodStart: 1804,
    activePeriodEnd: 1806,
    isFeatured: false,
  },

  // ==================== INDIGENOUS LEADERS & GUIDES ====================
  {
    name: "Matonabbee",
    alternateNames: undefined,
    birthYear: 1737,
    deathYear: 1782,
    nation: "Chipewyan",
    birthPlace: "Near Prince of Wales Fort (Fort Churchill)",
    figureType: "indigenous_leader",
    role: "Chipewyan leader, guide, and diplomat",
    biography:
      "Matonabbee was one of the most influential Chipewyan (Dene) leaders of the 18th century and served as the guide for Samuel Hearne's successful journey to the Arctic Ocean in 1770-1772. Born near Prince of Wales Fort, Matonabbee was raised in part by the Hudson's Bay Company and became fluent in both Cree and English, making him an invaluable intermediary. He rose to become a leading trading chief, commanding respect among both Indigenous peoples and European traders. After two failed attempts to reach the Arctic, Samuel Hearne recognized that his expeditions needed proper Indigenous leadership. Matonabbee offered to guide him, and under his leadership, the third expedition succeeded in reaching the Coppermine River and Arctic Ocean in July 1771. Tragically, when the French captured and destroyed Prince of Wales Fort in 1782, Matonabbee took his own life, devastated by the loss of the trading relationship he had worked so hard to build.",
    significance:
      "Matonabbee's guidance was essential to one of the most important explorations in Canadian history - the first European journey to the Arctic Ocean by land. His leadership abilities, diplomatic skills, and geographic knowledge made the expedition possible. He exemplified the crucial role that Indigenous leaders played in European exploration, often serving as the true decision-makers while European explorers followed their guidance. His tragic death symbolizes the devastating impact that colonial conflicts had on Indigenous peoples who had invested in relationships with European traders.",
    associatedExplorers: [
      { name: "Samuel Hearne", relationship: "Led Hearne to the Arctic Ocean" },
      { name: "Moses Norton", relationship: "HBC factor who knew Matonabbee" },
    ],
    achievements: [
      "Led Samuel Hearne to the Arctic Ocean (1770-1772)",
      "Served as master diplomat between Chipewyan, Cree, and HBC",
      "Rose to become leading Chipewyan trading chief",
      "Fluent in Chipewyan, Cree, and English",
      "Ensured success of one of Canada's most important explorations",
    ],
    associatedLocations: [
      "Prince of Wales Fort",
      "Coppermine River",
      "Arctic Ocean",
      "Great Slave Lake",
      "Barren Lands",
    ],
    activePeriodStart: 1770,
    activePeriodEnd: 1782,
    isFeatured: true,
  },
  {
    name: "Saukamappee",
    alternateNames: "Saukamappe, Young Man",
    birthYear: 1700,
    deathYear: 1790,
    nation: "Cree (adopted by Piikani/Blackfoot)",
    birthPlace: "Cree territory (present-day Manitoba/Saskatchewan)",
    figureType: "indigenous_leader",
    role: "Cree warrior, Piikani elder, and oral historian",
    biography:
      "Saukamappee was a Cree man who was adopted by the Piikani (Peigan) nation of the Blackfoot Confederacy and lived to become one of the most important oral historians of the pre-contact and early contact period on the northern Plains. In 1787-1788, when he was approximately 85-90 years old, Saukamappee hosted the young David Thompson and Peter Fidler at a Piikani camp and shared extensive accounts of his life and the history of his adopted people. His narratives described the introduction of horses and guns to the Plains, early warfare between the Blackfoot Confederacy and their enemies, and the devastating impact of smallpox epidemics. Thompson carefully recorded these accounts, which remain among the most valuable primary sources for understanding Indigenous life on the Plains before and during early European contact.",
    significance:
      "Saukamappee's oral histories, as recorded by David Thompson, provide an irreplaceable window into Indigenous life on the northern Plains during a period of dramatic transformation. His accounts of the first encounters with horses, the adoption of firearms, and the arrival of epidemic diseases are among the earliest and most detailed narratives from an Indigenous perspective. His willingness to share this knowledge with Thompson demonstrated the tradition of oral history and the importance of preserving collective memory. His narratives remain essential sources for historians and anthropologists studying Plains Indigenous peoples.",
    associatedExplorers: [
      { name: "David Thompson", relationship: "Recorded Saukamappee's oral histories" },
      { name: "Peter Fidler", relationship: "Present during Thompson's interviews" },
    ],
    achievements: [
      "Provided invaluable oral histories of Plains Indigenous life",
      "Witnessed and described introduction of horses to the Plains",
      "Documented early warfare and smallpox epidemics",
      "Lived approximately 90 years, spanning era of great change",
      "Served as bridge between Cree and Blackfoot peoples",
    ],
    associatedLocations: [
      "Piikani territory",
      "Northern Great Plains",
      "Rocky Mountains foothills",
    ],
    activePeriodStart: 1730,
    activePeriodEnd: 1790,
    isFeatured: true,
  },
  {
    name: "Akaitcho",
    alternateNames: "Big Foot",
    birthYear: 1786,
    deathYear: 1838,
    nation: "Yellowknife Dene",
    birthPlace: "Northern Canada (near Great Slave Lake)",
    figureType: "indigenous_leader",
    role: "Yellowknife Dene chief and guide for John Franklin's expedition",
    biography:
      "Akaitcho was a prominent chief of the Yellowknife Dene people who played a critical role in John Franklin's first Arctic expedition (1819-1822). When Franklin's poorly supplied expedition arrived in the North, Akaitcho and his band provided essential assistance, including guides, hunters, and local knowledge. Despite his warnings about the dangers of winter travel and the inadequacy of British supplies, Franklin proceeded with his ill-fated journey to the Arctic coast. Akaitcho's predictions proved tragically accurate - eleven of Franklin's twenty men died of starvation and exposure on the return journey. Akaitcho later assisted in rescuing the survivors and provided food and shelter during their recovery. He continued to lead his people and maintain relationships with European traders and explorers until his death in 1838. The community of N'Dilo near Yellowknife and Akaitcho Bay are named in his honor.",
    significance:
      "Akaitcho's story illustrates both the essential contributions of Indigenous peoples to Arctic exploration and the tragic consequences when their advice was ignored. His warnings about Franklin's expedition were proven correct, yet his people still provided crucial assistance that saved lives. His leadership and diplomatic skills helped maintain peaceful relations between the Yellowknife Dene and European newcomers during a period of significant change. Modern recognition of his contributions, including place names and the Akaitcho Territory Government, acknowledges his historical importance.",
    associatedExplorers: [
      { name: "John Franklin", relationship: "Guided Franklin's first expedition" },
      { name: "John Richardson", relationship: "Member of Franklin expedition" },
      { name: "George Back", relationship: "Member of Franklin expedition" },
    ],
    achievements: [
      "Provided essential support for Franklin's first Arctic expedition",
      "Warned Franklin about dangers of winter travel",
      "Led rescue efforts for surviving expedition members",
      "Maintained peace between Yellowknife Dene and Europeans",
      "Honored by place names including Akaitcho Bay",
    ],
    associatedLocations: [
      "Great Slave Lake",
      "Yellowknife area",
      "Coppermine River",
      "Fort Providence",
      "Winter Lake",
    ],
    activePeriodStart: 1819,
    activePeriodEnd: 1838,
    isFeatured: true,
  },
  {
    name: "Tattannoeuck",
    alternateNames: "Augustus",
    birthYear: 1800,
    deathYear: 1834,
    nation: "Inuit",
    birthPlace: "Near Churchill, Hudson Bay",
    figureType: "interpreter",
    role: "Inuit interpreter for John Franklin's Arctic expeditions",
    biography:
      "Tattannoeuck, known to Europeans as Augustus, was an Inuit man who served as interpreter for John Franklin's Arctic expeditions in the 1820s. He was raised near Churchill and learned English, which made him invaluable for communication with Inuit groups during Franklin's coastal explorations. During Franklin's first expedition (1819-1822), Augustus and another Inuit interpreter named Junius were crucial for obtaining food and information from local Inuit people. On Franklin's second expedition (1825-1827), Augustus again served as primary interpreter. His skills helped prevent conflicts and facilitated the peaceful encounters that were essential for the expedition's survival and success. Augustus was deeply respected by the expedition members, who recorded their admiration for his intelligence, courage, and good humor. He died around 1834, before Franklin's final and fatal expedition.",
    significance:
      "Tattannoeuck's role as interpreter was essential to the limited success of Franklin's Arctic expeditions. His ability to communicate with coastal Inuit groups allowed the expeditions to obtain food, local knowledge, and safe passage through territories that would otherwise have been hostile or inaccessible. His story highlights the dependence of European Arctic exploration on Indigenous knowledge and assistance, and the remarkable individuals who served as cultural bridges between worlds. The warm regard in which he was held by Franklin and his men speaks to his exceptional personal qualities.",
    associatedExplorers: [
      { name: "John Franklin", relationship: "Interpreter for both expeditions" },
      { name: "John Richardson", relationship: "Expedition member" },
      { name: "George Back", relationship: "Expedition member" },
    ],
    achievements: [
      "Served as interpreter on Franklin's first expedition (1819-1822)",
      "Served as interpreter on Franklin's second expedition (1825-1827)",
      "Facilitated peaceful contacts with Inuit groups",
      "Helped obtain crucial food and supplies for expeditions",
      "Earned deep respect of British expedition members",
    ],
    associatedLocations: [
      "Churchill",
      "Arctic coast",
      "Coppermine River",
      "Great Bear Lake",
      "Mackenzie River delta",
    ],
    activePeriodStart: 1819,
    activePeriodEnd: 1827,
    isFeatured: false,
  },
  {
    name: "Keskarrah",
    alternateNames: undefined,
    birthYear: undefined,
    deathYear: undefined,
    nation: "Yellowknife Dene",
    birthPlace: "Northern Canada",
    figureType: "guide",
    role: "Yellowknife leader who assisted Samuel Hearne",
    biography:
      "Keskarrah was a Yellowknife (Tatsanottine) Dene leader who provided assistance to Samuel Hearne during his expeditions in the 1770s. While less documented than Matonabbee, Keskarrah played an important role in supporting European exploration of the northern territories. The Yellowknife people, named for the copper knives they made from native copper found near the Coppermine River, had long-standing knowledge of the northern lands that European explorers sought to map. Leaders like Keskarrah served as intermediaries and guides, sharing knowledge accumulated over generations of living in one of the world's most challenging environments.",
    significance:
      "Keskarrah represents the many Indigenous leaders whose contributions to exploration were not fully recorded in historical documents but who nonetheless played essential roles in enabling European journeys through northern Canada. The Yellowknife Dene's traditional knowledge of the land, resources, and seasonal patterns was indispensable for survival in the North, and leaders like Keskarrah served as keepers and transmitters of this knowledge.",
    associatedExplorers: [
      { name: "Samuel Hearne", relationship: "Provided assistance to Hearne" },
    ],
    achievements: [
      "Assisted Samuel Hearne's northern expeditions",
      "Shared traditional knowledge of northern territories",
      "Served as leader of Yellowknife people",
    ],
    associatedLocations: [
      "Great Slave Lake region",
      "Coppermine River area",
    ],
    activePeriodStart: 1770,
    activePeriodEnd: 1775,
    isFeatured: false,
  },
];

async function seedNotableFigures() {
  console.log("Seeding notable figures...");

  for (const figure of notableFigures) {
    const existing = await prisma.notableFigure.findFirst({
      where: { name: figure.name },
    });

    if (existing) {
      console.log(`  Updating: ${figure.name}`);
      await prisma.notableFigure.update({
        where: { id: existing.id },
        data: {
          ...figure,
          associatedExplorers: figure.associatedExplorers
            ? JSON.stringify(figure.associatedExplorers)
            : null,
          achievements: figure.achievements
            ? JSON.stringify(figure.achievements)
            : null,
          associatedLocations: figure.associatedLocations
            ? JSON.stringify(figure.associatedLocations)
            : null,
        },
      });
    } else {
      console.log(`  Creating: ${figure.name}`);
      await prisma.notableFigure.create({
        data: {
          ...figure,
          associatedExplorers: figure.associatedExplorers
            ? JSON.stringify(figure.associatedExplorers)
            : null,
          achievements: figure.achievements
            ? JSON.stringify(figure.achievements)
            : null,
          associatedLocations: figure.associatedLocations
            ? JSON.stringify(figure.associatedLocations)
            : null,
        },
      });
    }
  }

  console.log(`Seeded ${notableFigures.length} notable figures.`);
}

// Run if executed directly
seedNotableFigures()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedNotableFigures };
