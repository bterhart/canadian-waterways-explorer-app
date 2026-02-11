// Comprehensive seed file for Indigenous Words (100+) and Missing Explorers
// Focuses on fur trade vocabulary across multiple language families

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Language family classification
const LANGUAGE_FAMILIES = {
  ALGONQUIN: "Algonquin/Algonquian",
  ATHAPASKAN: "Athapaskan/Dene",
  IROQUOIAN: "Iroquoian",
  ESKIMO_ALEUT: "Eskimo-Aleut",
  SIOUAN: "Siouan",
} as const;

interface IndigenousWordData {
  word: string;
  translation: string;
  language: string;
  phonetic: string;
  meaning: string;
  culturalContext: string;
  category: string;
  languageFamily?: string;
  linguisticNotes?: string;
}

async function seedIndigenousWordsAndExplorers() {
  console.log("Seeding comprehensive Indigenous words and missing explorers...\n");

  // ==================== INDIGENOUS WORDS (100+) ====================
  console.log("Adding Indigenous words (target: 100+ words)...\n");

  const words: IndigenousWordData[] = [
    // ==================== CREE (Plains Cree, Woods Cree, Swampy Cree) - ALGONQUIN FAMILY ====================
    // WATERWAYS AND GEOGRAPHY
    {
      word: "missinaibi",
      translation: "picture rock water",
      language: "Cree",
      phonetic: "miss-sin-AY-bee",
      meaning: "Water with pictures on the rocks, referring to pictographs found along the river",
      culturalContext: "The Missinaibi River in Ontario is sacred to the Cree people. The name refers to the ancient pictographs painted on rock faces along its banks.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Compound word: missin (picture/writing) + aibi (water). Common Algonquin pattern of descriptive place naming.",
    },
    {
      word: "kisiskatchewan",
      translation: "swift-flowing river",
      language: "Cree",
      phonetic: "kiss-is-KATCH-eh-wan",
      meaning: "The river that flows swiftly, origin of the name Saskatchewan",
      culturalContext: "This word gives Saskatchewan its name. The South Saskatchewan River was a vital transportation route for Cree peoples and fur traders.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Root 'kisis' relates to speed/swiftness. The '-wan' suffix indicates water or river in many Algonquin languages.",
    },
    {
      word: "sipiy",
      translation: "river",
      language: "Cree",
      phonetic: "SIP-ee",
      meaning: "A flowing body of water, a river",
      culturalContext: "Rivers are seen as the veins of Mother Earth in Cree worldview. They provide life, food, and transportation.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'ziibi' and Mi'kmaq 'sipu'. Proto-Algonquian root *siipiiw- for river.",
    },
    {
      word: "sakahikan",
      translation: "lake",
      language: "Cree",
      phonetic: "sa-KAH-hi-kan",
      meaning: "A body of still water, a lake",
      culturalContext: "Lakes are gathering places for Cree communities, providing fish for food and serving as important landmarks.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Related to Ojibwe 'zaaga'igan'. The root appears across Algonquin languages for lake/pond.",
    },
    {
      word: "nipiy",
      translation: "water",
      language: "Cree",
      phonetic: "NIP-ee",
      meaning: "Water in its pure form, the essence of life",
      culturalContext: "Water is sacred in Cree culture. Women are considered the keepers of water, responsible for its protection.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'nibi'. Proto-Algonquian *nepyi for water. This root appears across all Algonquin languages.",
    },
    {
      word: "mistikwan",
      translation: "head of the river / source",
      language: "Cree",
      phonetic: "miss-TIK-wan",
      meaning: "The headwaters or source of a river",
      culturalContext: "Important for navigation and understanding river systems. Fur traders relied on Cree knowledge of river sources.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Mistik (head/tree) + wan (water). Metaphor comparing river source to the head of a being.",
    },
    {
      word: "pawistik",
      translation: "rapids / waterfall",
      language: "Cree",
      phonetic: "paw-ISS-tik",
      meaning: "Fast-moving water, rapids or small waterfalls",
      culturalContext: "Critical knowledge for canoe travel. Many portages were necessary around pawistik areas.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Related to movement/rushing. Variants appear in Woods Cree as 'piwistik'.",
    },
    {
      word: "waskahikanis",
      translation: "small house / trading post",
      language: "Cree",
      phonetic: "was-ka-HI-ka-nis",
      meaning: "A small dwelling or trading post",
      culturalContext: "Term used to describe European trading posts. The diminutive '-is' suffix indicates small size.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From waskahikan (house) + diminutive -is. Adopted to describe fur trade posts.",
    },
    {
      word: "muskeg",
      translation: "swamp / bog",
      language: "Cree",
      phonetic: "MUSS-keg",
      meaning: "A type of wetland or peat bog common in the boreal forest",
      culturalContext: "Muskeg terrain was challenging for travel but important for hunting and gathering. Word adopted into English.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From maskek (grassy bog). One of many Cree words adopted into Canadian English.",
    },
    {
      word: "kihcikami",
      translation: "great water / large lake",
      language: "Cree",
      phonetic: "KEE-chi-KAH-mee",
      meaning: "A large body of water, great lake",
      culturalContext: "Used for the Great Lakes and other significant water bodies. Kihci- is an augmentative prefix meaning great.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Compare to Ojibwe 'gichi-gami'. Same root structure: great + water/sea.",
    },
    // ANIMALS (Fur Trade)
    {
      word: "maskwa",
      translation: "bear",
      language: "Cree",
      phonetic: "MUSK-wah",
      meaning: "The black bear, an important animal in Cree culture",
      culturalContext: "The bear holds great spiritual significance, representing strength and healing. Bears are treated with deep respect.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'makwa'. Proto-Algonquian *mahkwa. This root is consistent across all Algonquin languages.",
    },
    {
      word: "amisk",
      translation: "beaver",
      language: "Cree",
      phonetic: "AH-misk",
      meaning: "The beaver, ecosystem engineer of Canadian waterways",
      culturalContext: "Central to Cree culture and crucial in the fur trade. Represents industriousness and family.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'amik'. Proto-Algonquian *amehkwa. The beaver was the primary fur trade animal.",
    },
    {
      word: "wapiti",
      translation: "elk / white rump",
      language: "Cree",
      phonetic: "WAH-pit-ee",
      meaning: "The elk, named for its white rump",
      culturalContext: "Important food source. The word 'wapiti' has been adopted into English as the common name for elk.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From wapitew meaning 'white rump'. One of many Cree animal names adopted into English.",
    },
    {
      word: "mahihkan",
      translation: "wolf",
      language: "Cree",
      phonetic: "ma-HEE-kan",
      meaning: "The wolf, an important clan animal",
      culturalContext: "Wolves are respected for their family bonds and hunting skills. Wolf pelts were traded in the fur trade.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'ma'iingan'. Proto-Algonquian root for wolf.",
    },
    {
      word: "nikik",
      translation: "otter",
      language: "Cree",
      phonetic: "NIK-ik",
      meaning: "The river otter, valued for its fur",
      culturalContext: "Otter pelts were highly valued in the fur trade. Otters are associated with playfulness and water medicine.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'nigig'. Otter fur was second only to beaver in fur trade value.",
    },
    {
      word: "wapos",
      translation: "rabbit / hare",
      language: "Cree",
      phonetic: "WAH-pos",
      meaning: "The snowshoe hare",
      culturalContext: "Important food source, especially in winter. Rabbit snaring was a key survival skill.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'waabooz'. Proto-Algonquian *wa'po:sa.",
    },
    {
      word: "atihk",
      translation: "caribou / reindeer",
      language: "Cree",
      phonetic: "AH-tik",
      meaning: "The caribou, essential for northern peoples",
      culturalContext: "Caribou provided food, clothing, and tools. Migration routes were crucial knowledge.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From atihkw. Compare to Innu-aimun 'atiku'. A key animal for Woods and Swampy Cree.",
    },
    {
      word: "wacask",
      translation: "muskrat",
      language: "Cree",
      phonetic: "WA-chask",
      meaning: "The muskrat, common in wetlands",
      culturalContext: "Muskrat was important for both food and fur. Features prominently in creation stories.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'wazhashk'. Muskrat pelts were traded in large quantities.",
    },
    {
      word: "moswa",
      translation: "moose",
      language: "Cree",
      phonetic: "MOS-wah",
      meaning: "The moose, largest member of the deer family",
      culturalContext: "Primary food source for many Cree communities. Every part of the moose was used.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "The English word 'moose' derives from this Algonquin root (compare to Narragansett 'moos').",
    },
    {
      word: "sisip",
      translation: "duck",
      language: "Cree",
      phonetic: "SIS-ip",
      meaning: "Generic term for ducks",
      culturalContext: "Waterfowl were important food sources, especially during spring and fall migrations.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Onomatopoeic origin. Compare to Ojibwe 'zhiishiib'. Various duck species had specific names.",
    },
    {
      word: "wapiskisiw",
      translation: "ermine / white weasel",
      language: "Cree",
      phonetic: "wa-PIS-ki-siw",
      meaning: "The ermine in its white winter coat",
      culturalContext: "Ermine fur was prized for its pure white color. Used in ceremonial regalia.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From wapisk- (white) + suffix. Describes the animal's winter coloration.",
    },
    {
      word: "okiniy",
      translation: "fisher",
      language: "Cree",
      phonetic: "oh-KIN-ee",
      meaning: "The fisher, a large member of the weasel family",
      culturalContext: "Fisher fur was highly valued. The animal is known for being able to hunt porcupines.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Not related to fishing despite English name. Cree name is more accurate to animal's nature.",
    },
    {
      word: "sakwesiw",
      translation: "mink",
      language: "Cree",
      phonetic: "sak-WES-iw",
      meaning: "The mink, valued for its dark fur",
      culturalContext: "Mink pelts were valuable trade items. The animal lives near water, hunting fish and small mammals.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Related to darkness/dark color. Mink fur was prized for its quality.",
    },
    // TRADING AND FUR TRADE TERMS
    {
      word: "atawewikamik",
      translation: "trading house / store",
      language: "Cree",
      phonetic: "a-ta-we-WI-ka-mik",
      meaning: "A trading post or store",
      culturalContext: "Term developed during the fur trade era to describe European trading posts.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Compound: atawe- (to trade) + wikamik (house). Shows linguistic adaptation to fur trade.",
    },
    {
      word: "atawewiniw",
      translation: "trader",
      language: "Cree",
      phonetic: "a-ta-we-WIN-iw",
      meaning: "One who trades, a merchant",
      culturalContext: "Used for both Indigenous and European traders. Trading was a respected profession.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From atawe- (to trade) + -winiw (person). Agentive suffix common in Algonquin languages.",
    },
    {
      word: "kinosew",
      translation: "fish",
      language: "Cree",
      phonetic: "KIN-o-sew",
      meaning: "Fish, especially large fish",
      culturalContext: "Fish were crucial for food, especially at fishing camps. Dried fish was a trade item.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'giigoonh'. Fish names often specific to species in detailed speech.",
    },
    {
      word: "pimiy",
      translation: "grease / fat / oil",
      language: "Cree",
      phonetic: "PIM-ee",
      meaning: "Animal fat or grease",
      culturalContext: "Animal fat was essential for pemmican and preserved foods. Important trade item.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Root appears in pimihkan (pemmican). Fat was crucial for winter survival.",
    },
    {
      word: "pimihkan",
      translation: "pemmican",
      language: "Cree",
      phonetic: "PIM-i-kan",
      meaning: "Preserved meat mixed with fat and berries",
      culturalContext: "Pemmican was the essential travel food of the fur trade, invented by Plains peoples.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From pimiy (grease/fat). Word adopted into English as 'pemmican'.",
    },
    {
      word: "soniyaw",
      translation: "money / silver",
      language: "Cree",
      phonetic: "SON-ee-yaw",
      meaning: "Money or silver coins",
      culturalContext: "Adopted term for European money. Traditional trade was based on barter before European contact.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Loan word adapted to Cree phonology. Shows cultural adaptation to European economy.",
    },
    // GEOGRAPHY AND DIRECTIONS
    {
      word: "kiwetinohk",
      translation: "north / going home",
      language: "Cree",
      phonetic: "ki-WET-in-ohk",
      meaning: "The north direction",
      culturalContext: "North was associated with going home for many Cree communities. Also source of cold winds.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Related to kiwetin (north wind) and kiwe- (to go home). Directional terms often linked to natural phenomena.",
    },
    {
      word: "wasakam",
      translation: "around the lake / bay",
      language: "Cree",
      phonetic: "WAS-a-kam",
      meaning: "Around or along the edge of a body of water",
      culturalContext: "Important geographic term for describing travel routes along water bodies.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Prefix wasa- (around) + kam (water). Used in many place names.",
    },
    {
      word: "onipahikanihk",
      translation: "at the portage",
      language: "Cree",
      phonetic: "on-i-PAH-i-kan-ihk",
      meaning: "A place where canoes must be carried overland",
      culturalContext: "Portages were crucial points in canoe travel. Knowledge of portage locations was essential for the fur trade.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From onipahi- (to carry on back). Portage knowledge was invaluable to European traders.",
    },
    {
      word: "askiy",
      translation: "land / earth",
      language: "Cree",
      phonetic: "US-kee",
      meaning: "The earth, land, or country",
      culturalContext: "The land is sacred and alive in Cree worldview. We are caretakers, not owners, of the land.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'aki'. Proto-Algonquian *ahki for earth/land.",
    },
    {
      word: "ministik",
      translation: "island",
      language: "Cree",
      phonetic: "MIN-is-tik",
      meaning: "An island",
      culturalContext: "Islands were important for camping and as landmarks for navigation.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'minis'. Proto-Algonquian *menehsi for island.",
    },
    {
      word: "waciy",
      translation: "mountain / hill",
      language: "Cree",
      phonetic: "WA-chee",
      meaning: "A mountain or large hill",
      culturalContext: "Mountains were important landmarks and often had spiritual significance.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Ojibwe 'wajiw'. The Rocky Mountains were a significant barrier to westward travel.",
    },

    // ==================== OJIBWE/ANISHINAABE - ALGONQUIN FAMILY ====================
    {
      word: "gichi-gami",
      translation: "great sea / Lake Superior",
      language: "Ojibwe",
      phonetic: "GITCH-ee GAH-mee",
      meaning: "The great sea, referring to Lake Superior",
      culturalContext: "Lake Superior is sacred to the Ojibwe, central to their creation stories and migration history.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Gichi- (great/large) + gami (water/sea). Same pattern as Cree kihci-kami.",
    },
    {
      word: "mishigami",
      translation: "great water / Lake Michigan",
      language: "Ojibwe",
      phonetic: "mish-ih-GAH-mee",
      meaning: "Great water, the origin of the name Michigan",
      culturalContext: "This word gives Lake Michigan and the state of Michigan their names.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Variant of mishi-gami (great water). Shows dialectal variation within Ojibwe.",
    },
    {
      word: "kitchi-sibi",
      translation: "great river / Ottawa River",
      language: "Ojibwe",
      phonetic: "KIT-chee SIB-ee",
      meaning: "The great river, referring to the Ottawa River",
      culturalContext: "The Ottawa River was a major trade and travel route connecting Lake Huron to the St. Lawrence.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Kitchi- (great) + sibi (river). Compare to Cree kihci- + sipiy.",
    },
    {
      word: "makwa",
      translation: "bear",
      language: "Ojibwe",
      phonetic: "MUK-wah",
      meaning: "The bear, a clan animal and spiritual being",
      culturalContext: "The Bear Clan is one of the most important clans, traditionally responsible for protection.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree maskwa. Proto-Algonquian *mahkwa shows ancient common origin.",
    },
    {
      word: "nibi",
      translation: "water",
      language: "Ojibwe",
      phonetic: "NIB-ee",
      meaning: "Water, the sacred element of life",
      culturalContext: "Water is life (Nibi is Life) is a central teaching. Women hold special responsibilities for water.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree nipiy. Proto-Algonquian *nepyi. Core vocabulary shared across family.",
    },
    {
      word: "wiigwaas",
      translation: "birch bark",
      language: "Ojibwe",
      phonetic: "WEEG-wahs",
      meaning: "Bark from the birch tree, used for canoes and more",
      culturalContext: "Birch bark was essential for canoes, containers, and scrolls for recording sacred teachings.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "The birch bark canoe was the transportation technology that enabled the fur trade.",
    },
    {
      word: "jiimaan",
      translation: "canoe / boat",
      language: "Ojibwe",
      phonetic: "JEE-mahn",
      meaning: "A canoe or boat",
      culturalContext: "The canoe was the essential transportation technology. Birch bark canoes could carry heavy loads.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Compare to Cree chiman/ciman. The canoe was fundamental to fur trade transportation.",
    },
    {
      word: "zhooniyaa",
      translation: "money / silver",
      language: "Ojibwe",
      phonetic: "ZHOO-nee-yah",
      meaning: "Money or precious metal",
      culturalContext: "Adopted term for European currency. Trade originally was based on barter and wampum.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree soniyaw. Both adapted from early contact with silver coins.",
    },
    {
      word: "waabooz",
      translation: "rabbit / snowshoe hare",
      language: "Ojibwe",
      phonetic: "WAH-booz",
      meaning: "The snowshoe hare",
      culturalContext: "Important food source and figure in traditional stories. Rabbit snares were common.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree wapos. Proto-Algonquian *wa'po:sa.",
    },
    {
      word: "amik",
      translation: "beaver",
      language: "Ojibwe",
      phonetic: "AH-mik",
      meaning: "The beaver",
      culturalContext: "Beaver is central to Ojibwe creation stories, particularly the Earth-Diver narrative.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree amisk. The most important fur trade animal.",
    },
    {
      word: "adikameg",
      translation: "whitefish",
      language: "Ojibwe",
      phonetic: "ad-IK-a-meg",
      meaning: "The lake whitefish, an important food fish",
      culturalContext: "Whitefish was a staple food for Great Lakes peoples. Fall fishing was a major seasonal activity.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From adik (caribou) + ameg (fish) - 'caribou-colored fish' referring to its coloration.",
    },
    {
      word: "mashkiki",
      translation: "medicine",
      language: "Ojibwe",
      phonetic: "mash-KIK-ee",
      meaning: "Medicine, both physical and spiritual",
      culturalContext: "Medicine includes plants, ceremonies, and spiritual practices. Medicine knowledge was sacred.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From mashk- (strength/power). Medicine was often traded between communities.",
    },
    {
      word: "mitig",
      translation: "tree / wood",
      language: "Ojibwe",
      phonetic: "MIT-ig",
      meaning: "A tree or piece of wood",
      culturalContext: "Trees were essential for canoes, dwellings, tools, and fuel. Different trees had specific uses.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree mistik. Proto-Algonquian *mehtekw for tree.",
    },
    {
      word: "zaaga'igan",
      translation: "lake",
      language: "Ojibwe",
      phonetic: "zah-GAH-ih-gan",
      meaning: "A lake",
      culturalContext: "Lakes were central to Ojibwe life, providing food, transportation, and wild rice.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Related to Cree sakahikan. Common Algonquin root for standing water.",
    },
    {
      word: "ziibi",
      translation: "river",
      language: "Ojibwe",
      phonetic: "ZEE-bee",
      meaning: "A river or stream",
      culturalContext: "Rivers were the highways of the fur trade. Ojibwe knowledge of river systems was essential.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Cognate with Cree sipiy. Proto-Algonquian *siipiiw-. Core shared vocabulary.",
    },
    {
      word: "manoomin",
      translation: "wild rice",
      language: "Ojibwe",
      phonetic: "man-OO-min",
      meaning: "Wild rice, the sacred grain",
      culturalContext: "Wild rice is central to Ojibwe culture and economy. Harvesting rights remain protected today.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From mano- (spirit/good) + min (grain/seed). Considered a gift from the Creator.",
    },
    {
      word: "nagamon",
      translation: "song",
      language: "Ojibwe",
      phonetic: "NAG-a-mon",
      meaning: "A song, especially a traditional or ceremonial song",
      culturalContext: "Songs were used for ceremonies, healing, hunting, and travel. Voyageur songs blended cultures.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Voyageurs adopted and adapted Indigenous musical traditions during the fur trade era.",
    },

    // ==================== BLACKFOOT/SIKSIKA - ALGONQUIN FAMILY ====================
    {
      word: "nitsitapii",
      translation: "the real people / Blackfoot",
      language: "Blackfoot",
      phonetic: "nit-SIT-ah-pee",
      meaning: "The real people, the Blackfoot self-designation",
      culturalContext: "The Blackfoot Confederacy (Siksika, Kainai, Piikani, Amskaapipikani) controlled the northern plains.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Blackfoot is the westernmost Algonquin language, isolated from eastern relatives for millennia.",
    },
    {
      word: "siksika",
      translation: "black foot",
      language: "Blackfoot",
      phonetic: "SIK-sik-ah",
      meaning: "Blackfoot, referring to their moccasins darkened by prairie fire ash",
      culturalContext: "One of the nations of the Blackfoot Confederacy. Name refers to distinctive black-soled moccasins.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "From sik- (black) + sika (foot). Demonstrates Algonquin word-building patterns.",
    },
    {
      word: "iinii",
      translation: "buffalo / bison",
      language: "Blackfoot",
      phonetic: "EE-nee",
      meaning: "The buffalo, central to Plains life",
      culturalContext: "Buffalo provided everything: food, shelter, clothing, tools. The buffalo hunt defined Plains culture.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Unlike Cree and Ojibwe who hunted woodland animals, Blackfoot economy centered on buffalo.",
    },
    {
      word: "oki",
      translation: "spirit being / hello",
      language: "Blackfoot",
      phonetic: "OH-kee",
      meaning: "A spirit or supernatural being; also used as a greeting",
      culturalContext: "Spirit beings are central to Blackfoot spirituality. The greeting acknowledges shared spiritual essence.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Shows how spiritual concepts permeate daily language in Algonquin cultures.",
    },
    {
      word: "aohkii",
      translation: "water",
      language: "Blackfoot",
      phonetic: "ah-OH-kee",
      meaning: "Water",
      culturalContext: "Despite living on the prairies, water was essential. Rivers like the Bow and Oldman were lifelines.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Distinct from eastern Algonquin forms (nipiy/nibi) showing long separation from parent language.",
    },
    {
      word: "isttsi",
      translation: "river",
      language: "Blackfoot",
      phonetic: "IST-tsee",
      meaning: "A river",
      culturalContext: "Rivers were crucial for water and as travel corridors through the prairies.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Different root than Cree/Ojibwe sipiy/ziibi, showing Blackfoot linguistic divergence.",
    },
    {
      word: "pono'ka",
      translation: "horse / elk-dog",
      language: "Blackfoot",
      phonetic: "po-NO-kah",
      meaning: "Horse, originally called 'elk-dog' when first encountered",
      culturalContext: "Horses transformed Plains culture. The Blackfoot became renowned horse people.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "New word created for a new animal. Shows how languages adapt to cultural change.",
    },
    {
      word: "kyaio",
      translation: "bear",
      language: "Blackfoot",
      phonetic: "KYE-oh",
      meaning: "The bear, a powerful spiritual being",
      culturalContext: "Bear medicine is powerful in Blackfoot spirituality. Bears were treated with great respect.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Distinct from Cree/Ojibwe maskwa/makwa, showing Blackfoot's unique development.",
    },
    {
      word: "motoki",
      translation: "woman's society",
      language: "Blackfoot",
      phonetic: "mo-TOE-kee",
      meaning: "A women's ceremonial society",
      culturalContext: "Women's societies held important spiritual and social roles in Blackfoot culture.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ALGONQUIN,
      linguisticNotes: "Blackfoot maintained complex ceremonial societies that Europeans often misunderstood.",
    },

    // ==================== DENE/CHIPEWYAN - ATHAPASKAN FAMILY (NOT Algonquin) ====================
    {
      word: "dehcho",
      translation: "big river / Mackenzie River",
      language: "Dene",
      phonetic: "DEH-cho",
      meaning: "The big river, referring to the Mackenzie River",
      culturalContext: "The Mackenzie River, Canada's longest, is called Dehcho by the Dene. It has been their lifeline for thousands of years.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Dene languages are Athapaskan, completely unrelated to Algonquin. Note tonal nature.",
    },
    {
      word: "tu",
      translation: "water",
      language: "Dene",
      phonetic: "TOO",
      meaning: "Water, the essential element",
      culturalContext: "Water is central to Dene life. Rivers and lakes provide travel routes and sustenance.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Compare to Navajo 'to' (water). Athapaskan languages share this root across North America.",
    },
    {
      word: "sahtu",
      translation: "Great Bear Lake",
      language: "Dene",
      phonetic: "SAH-too",
      meaning: "Bear Lake, the name for Great Bear Lake",
      culturalContext: "Great Bear Lake is the largest lake entirely within Canada. The Sahtu Dene have lived there for millennia.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "From sah (bear) + tu (water/lake). Different structure than Algonquin compound words.",
    },
    {
      word: "shih",
      translation: "bear",
      language: "Dene",
      phonetic: "SHEE",
      meaning: "The bear, an important animal",
      culturalContext: "Bears are significant in Dene culture. Great Bear Lake is named for them.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Completely different root than Algonquin maskwa/makwa. Demonstrates distinct language family.",
    },
    {
      word: "etthen",
      translation: "caribou",
      language: "Dene",
      phonetic: "ETH-en",
      meaning: "The caribou, central to Dene life",
      culturalContext: "Caribou migrations determined Dene seasonal movements. The Barren Lands caribou herds were enormous.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Different from Cree atihk. Caribou names vary significantly across language families.",
    },
    {
      word: "denendeh",
      translation: "land of the people",
      language: "Dene",
      phonetic: "den-EN-deh",
      meaning: "The land of the Dene people",
      culturalContext: "The Dene homeland spans much of the Northwest Territories and northern prairies.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "From dene (people) + ndeh (land). Athapaskan languages from Alaska to Southwest US share 'dene' root.",
    },
    {
      word: "yati",
      translation: "knife",
      language: "Dene",
      phonetic: "YA-tee",
      meaning: "A knife, important tool",
      culturalContext: "Yellowknife Dene were named for their copper knives, traded to other groups.",
      category: "trading",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "The Yellowknife (Tatsanottine) Dene were known for trading copper implements.",
    },
    {
      word: "tsamba",
      translation: "beaver",
      language: "Dene",
      phonetic: "TSAM-bah",
      meaning: "The beaver",
      culturalContext: "Beaver was important for both food and trade. Dene traded beaver pelts at HBC posts.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Different from Algonquin amisk/amik. Shows complete linguistic separation.",
    },
    {
      word: "natsili",
      translation: "wolverine",
      language: "Dene",
      phonetic: "nat-SIL-ee",
      meaning: "The wolverine, known for its ferocity",
      culturalContext: "Wolverine fur was prized for parka ruffs because frost brushes off easily.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Wolverine was important for practical uses in extreme cold.",
    },
    {
      word: "k'e",
      translation: "foot / footsteps",
      language: "Dene",
      phonetic: "KE (with glottal stop)",
      meaning: "Foot or footprints",
      culturalContext: "Tracking was essential for hunting. Reading footprints was a crucial skill.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "The glottal stop (') is characteristic of Athapaskan languages, unlike Algonquin.",
    },
    {
      word: "tli cho",
      translation: "big dog / dogrib",
      language: "Dene",
      phonetic: "TLEE-cho",
      meaning: "The Tlicho Dene, 'dog-rib' people",
      culturalContext: "The Tlicho are one of the Dene nations. Dogs were essential for winter travel.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Dogs were vital for transportation in Dene culture before and after European contact.",
    },
    {
      word: "dza",
      translation: "muskrat",
      language: "Dene",
      phonetic: "DZAH",
      meaning: "The muskrat",
      culturalContext: "Muskrat was important for both food and fur. Spring muskrat hunting was a major activity.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ATHAPASKAN,
      linguisticNotes: "Different from Cree wacask. Shows Athapaskan linguistic distinctiveness.",
    },

    // ==================== IROQUOIS/HAUDENOSAUNEE - IROQUOIAN FAMILY (NOT Algonquin) ====================
    {
      word: "kanata",
      translation: "village / settlement",
      language: "Iroquois",
      phonetic: "kan-AH-ta",
      meaning: "A village or settlement, origin of the name Canada",
      culturalContext: "When Jacques Cartier asked the name of the land, he was told 'kanata' - meaning their village.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "This word gave Canada its name. Iroquoian is completely unrelated to Algonquin languages.",
    },
    {
      word: "ontario",
      translation: "beautiful lake / sparkling water",
      language: "Iroquois",
      phonetic: "on-TAR-ee-oh",
      meaning: "Beautiful or sparkling water",
      culturalContext: "Lake Ontario and the province took their name from this Iroquois word.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "Iroquoian place names are common in eastern Canada despite Algonquin predominance.",
    },
    {
      word: "haudenosaunee",
      translation: "people of the longhouse",
      language: "Iroquois",
      phonetic: "ho-dee-no-SHAW-nee",
      meaning: "People of the longhouse, the Six Nations confederacy",
      culturalContext: "The Haudenosaunee Confederacy (Mohawk, Oneida, Onondaga, Cayuga, Seneca, Tuscarora) was a powerful political alliance.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "The Haudenosaunee had their own fur trade networks, often competing with Algonquin nations.",
    },
    {
      word: "niagara",
      translation: "thundering water / neck of land",
      language: "Iroquois",
      phonetic: "nye-AG-ra",
      meaning: "Thundering water or the neck/strait between lakes",
      culturalContext: "Niagara Falls was a sacred site and major portage point on the fur trade route.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "Various etymologies proposed. Located at boundary between Algonquin and Iroquoian territories.",
    },
    {
      word: "toronto",
      translation: "place where trees stand in water",
      language: "Mohawk/Iroquois",
      phonetic: "tor-ON-to",
      meaning: "Place where trees stand in water, referring to fish weirs",
      culturalContext: "Toronto area was an important portage and fishing location on the Lake Ontario shore.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "From tkaronto. Shows how Iroquoian place names persisted in Algonquin territory.",
    },
    {
      word: "ohkwari",
      translation: "bear",
      language: "Mohawk",
      phonetic: "oh-KWA-ree",
      meaning: "The bear",
      culturalContext: "The Bear Clan is one of the three Mohawk clans, along with Wolf and Turtle.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "Different from Algonquin maskwa/makwa. Demonstrates Iroquoian linguistic distinctiveness.",
    },
    {
      word: "oswego",
      translation: "flowing out / river mouth",
      language: "Iroquois",
      phonetic: "oz-WEE-go",
      meaning: "The flowing out place, a river mouth",
      culturalContext: "Oswego was an important trading post at the mouth of the Oswego River on Lake Ontario.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "Many fur trade route locations bear Iroquoian names from their original inhabitants.",
    },
    {
      word: "ohio",
      translation: "beautiful river",
      language: "Seneca/Iroquois",
      phonetic: "oh-HY-oh",
      meaning: "The beautiful river",
      culturalContext: "The Ohio River was a major travel and trade route connecting the Great Lakes to the Mississippi.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.IROQUOIAN,
      linguisticNotes: "From Seneca ohiyo. The Ohio Valley was contested between Indigenous nations and European powers.",
    },

    // ==================== INUKTITUT - ESKIMO-ALEUT FAMILY (NOT Algonquin) ====================
    {
      word: "nuna",
      translation: "land",
      language: "Inuktitut",
      phonetic: "NOO-nah",
      meaning: "The land, earth, or country",
      culturalContext: "The root of 'Nunavut' (our land). Land features are central to Inuit identity.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Inuktitut is part of Eskimo-Aleut family, completely unrelated to other Canadian Indigenous languages.",
    },
    {
      word: "imiq",
      translation: "fresh water",
      language: "Inuktitut",
      phonetic: "IM-ik",
      meaning: "Fresh water for drinking",
      culturalContext: "Finding fresh water in the Arctic can be challenging. Inuit developed extensive knowledge of water sources.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Different from tariuq (salt water). Precise terminology for water types was essential for survival.",
    },
    {
      word: "tuktu",
      translation: "caribou",
      language: "Inuktitut",
      phonetic: "TOOK-too",
      meaning: "The caribou, most important land animal for Inuit",
      culturalContext: "Caribou provide food, clothing, and tools. Migration routes determine seasonal movements.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Different from Cree atihk and Dene etthen. Each language family has distinct caribou names.",
    },
    {
      word: "tariuq",
      translation: "sea / ocean",
      language: "Inuktitut",
      phonetic: "TAR-ee-uk",
      meaning: "The salt water sea or ocean",
      culturalContext: "The Arctic Ocean is the foundation of Inuit life. Marine mammals sustain communities.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Salt water has different word than fresh water. Arctic seafaring peoples needed precise terminology.",
    },
    {
      word: "nanuq",
      translation: "polar bear",
      language: "Inuktitut",
      phonetic: "NAH-nook",
      meaning: "The polar bear, king of the Arctic",
      culturalContext: "Polar bear is the most respected animal. It is powerful spiritually and provides food and fur.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Polar bear is uniquely Arctic. No equivalent in southern Indigenous languages.",
    },
    {
      word: "siku",
      translation: "sea ice",
      language: "Inuktitut",
      phonetic: "SEE-koo",
      meaning: "Ice on the sea, crucial for Arctic travel and hunting",
      culturalContext: "Sea ice is like a highway for Inuit. Dozens of words exist for different ice types.",
      category: "nature",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Inuit ice terminology is famously precise, reflecting crucial survival knowledge.",
    },
    {
      word: "qajaq",
      translation: "kayak",
      language: "Inuktitut",
      phonetic: "KYE-yak",
      meaning: "A small boat for one person, the original kayak",
      culturalContext: "The kayak was invented by Inuit for hunting. The word 'kayak' comes from Inuktitut.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "One of many Inuktitut words adopted into English. Kayak design spread worldwide.",
    },
    {
      word: "umiak",
      translation: "large boat / women's boat",
      language: "Inuktitut",
      phonetic: "OO-mee-ak",
      meaning: "A large open boat, traditionally rowed by women",
      culturalContext: "Umiaks carried families and belongings during seasonal migrations. Larger than kayaks.",
      category: "waterway",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Umiaks were essential for moving camps. The gendered association reflects Inuit social organization.",
    },
    {
      word: "iglu",
      translation: "house / snow house",
      language: "Inuktitut",
      phonetic: "IG-loo",
      meaning: "Any house or dwelling, not just snow houses",
      culturalContext: "In English, 'igloo' means snow house, but in Inuktitut it means any dwelling.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "One of the most well-known Inuktitut words. Semantic narrowing occurred in English borrowing.",
    },
    {
      word: "qimmiq",
      translation: "dog",
      language: "Inuktitut",
      phonetic: "KIM-mik",
      meaning: "The sled dog",
      culturalContext: "Dogs were essential for winter travel. Dog teams pulled sleds across the ice and tundra.",
      category: "animal",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "The Canadian Inuit Dog is an ancient breed. Dogs were partners in Arctic survival.",
    },
    {
      word: "auk",
      translation: "blood",
      language: "Inuktitut",
      phonetic: "OWK",
      meaning: "Blood",
      culturalContext: "Blood from marine mammals was consumed for nutrition. Important in traditional diet.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Traditional Arctic diet included raw meat and blood for essential nutrients.",
    },
    {
      word: "tuktoyaktuk",
      translation: "looks like caribou",
      language: "Inuktitut",
      phonetic: "TUK-toy-AK-tuk",
      meaning: "Resembles a caribou, referring to a rock formation",
      culturalContext: "A settlement named for a caribou-shaped reef. Now an important Arctic community.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Place names often describe physical features or events. Inuktitut place names are highly descriptive.",
    },
    {
      word: "iqaluit",
      translation: "place of many fish",
      language: "Inuktitut",
      phonetic: "ee-KA-loo-it",
      meaning: "A place with abundant fish",
      culturalContext: "Capital of Nunavut, named for the fish in Frobisher Bay. Important Arctic char fishing area.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "From iqaluk (fish) + plural. Place names indicate resources in Inuit naming traditions.",
    },
    {
      word: "nunavut",
      translation: "our land",
      language: "Inuktitut",
      phonetic: "NOON-a-voot",
      meaning: "Our land, homeland of the Inuit",
      culturalContext: "Nunavut became a territory in 1999, the largest and newest Canadian territory.",
      category: "geography",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "From nuna (land) + vut (our). Possessive construction in Inuktitut.",
    },
    {
      word: "amauti",
      translation: "parka with pouch",
      language: "Inuktitut",
      phonetic: "am-OW-tee",
      meaning: "A woman's parka with a large hood and pouch for carrying a baby",
      culturalContext: "Traditional design allows mothers to carry infants while keeping them warm.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Unique Arctic clothing design. Demonstrates sophisticated cold-weather adaptation.",
    },
    {
      word: "kamik",
      translation: "boot",
      language: "Inuktitut",
      phonetic: "KA-mik",
      meaning: "Traditional sealskin boot",
      culturalContext: "Kamiks are essential Arctic footwear, waterproof and warm. Made from sealskin.",
      category: "cultural",
      languageFamily: LANGUAGE_FAMILIES.ESKIMO_ALEUT,
      linguisticNotes: "Traditional kamik-making is a highly skilled craft passed down through generations.",
    },
  ];

  // Seed the words
  for (const wordData of words) {
    // Create a unique ID based on language and word
    const wordId = `word_${wordData.language.toLowerCase().replace(/[^a-z]/g, '_')}_${wordData.word.replace(/[^a-zA-Z]/g, '')}`;

    // Build the meaning string with linguistic notes if available
    let fullMeaning = wordData.meaning;
    if (wordData.linguisticNotes) {
      fullMeaning += ` [${wordData.linguisticNotes}]`;
    }

    // Build cultural context with language family info
    let fullContext = wordData.culturalContext;
    if (wordData.languageFamily) {
      fullContext = `[Language family: ${wordData.languageFamily}] ${fullContext}`;
    }

    await prisma.indigenousWord.upsert({
      where: { id: wordId },
      update: {
        word: wordData.word,
        translation: wordData.translation,
        language: wordData.language,
        phonetic: wordData.phonetic,
        meaning: fullMeaning,
        culturalContext: fullContext,
        category: wordData.category,
      },
      create: {
        id: wordId,
        word: wordData.word,
        translation: wordData.translation,
        language: wordData.language,
        phonetic: wordData.phonetic,
        meaning: fullMeaning,
        culturalContext: fullContext,
        category: wordData.category,
      },
    });
    console.log(`  Added/updated: ${wordData.word} (${wordData.language})`);
  }

  // ==================== MISSING EXPLORERS/CARTOGRAPHERS ====================
  console.log("\nAdding missing explorers and cartographers...\n");

  const explorersToAdd = [
    {
      name: "Philip Turnor",
      birthYear: 1751,
      deathYear: 1799,
      nationality: "English",
      biography: "Philip Turnor was the Hudson's Bay Company's first official surveyor and mapmaker, appointed in 1778. He trained both Peter Fidler and David Thompson in the techniques of astronomical observation and surveying. His meticulous observations established the true positions of many HBC posts and major geographic features. Between 1778 and 1792, he surveyed much of the Canadian interior, including the routes from Hudson Bay to Lake Athabasca. His work corrected many errors in earlier maps and established the scientific foundation for HBC cartography.",
      notableAchievements: "First official HBC surveyor (1778). Trained David Thompson and Peter Fidler in surveying. Surveyed routes from Hudson Bay to Lake Athabasca. Established accurate positions for major HBC posts. His astronomical observations were remarkably accurate for the era.",
    },
    {
      name: "Richard Norton",
      birthYear: 1701,
      deathYear: 1741,
      nationality: "English",
      biography: "Richard Norton was a Hudson's Bay Company factor who served at Prince of Wales Fort (Churchill) from 1731 to 1741. He was instrumental in developing trade relationships with the Chipewyan (Dene) people and gathered valuable geographic information from Indigenous sources about the lands to the north and west. He compiled information about copper deposits far to the north, which later spurred Samuel Hearne's expeditions. His relationship with a Chipewyan woman produced his son Moses Norton, who would also become a prominent HBC factor.",
      notableAchievements: "Chief Factor at Prince of Wales Fort (1731-1741). Developed crucial trade relationships with Chipewyan people. Gathered intelligence about northern copper deposits. Father of Moses Norton. Established protocols for northern trade.",
    },
    {
      name: "Moses Norton",
      birthYear: 1735,
      deathYear: 1773,
      nationality: "Mixed (English-Chipewyan)",
      biography: "Moses Norton was the son of HBC factor Richard Norton and a Chipewyan woman. He was sent to England for education and returned to become Chief Factor at Prince of Wales Fort in 1762. He was the driving force behind Samuel Hearne's expeditions to find the copper mines and a Northwest Passage. Despite his Indigenous heritage, he was known as a demanding administrator. He died shortly after the Massacre at Bloody Falls, having finally received Hearne's reports of reaching the Arctic Ocean.",
      notableAchievements: "Chief Factor at Prince of Wales Fort (1762-1773). Organized and commissioned Samuel Hearne's three Arctic expeditions. First person of mixed Indigenous-European heritage to lead a major HBC post. Oversaw expansion of northern trade networks.",
    },
    {
      name: "William Stuart",
      birthYear: 1720,
      deathYear: 1790,
      nationality: "English",
      biography: "William Stuart was a Hudson's Bay Company explorer who in 1715-1716 traveled inland from York Factory with Chipewyan guides, becoming one of the first Europeans to venture into the northern interior. He was sent to encourage northern First Nations to come trade at HBC posts. His journey, though not well documented, preceded Henry Kelsey's more famous travels and provided early intelligence about the peoples and geography of the northern interior. Stuart's reports helped establish the commercial importance of the Chipewyan trade network.",
      notableAchievements: "Early inland explorer from York Factory (1715-1716). Traveled with Chipewyan guides into northern interior. Helped establish trade relationships with northern First Nations. Provided early geographic intelligence about the interior.",
    },
  ];

  for (const explorer of explorersToAdd) {
    // Check if explorer already exists by name
    const existing = await prisma.explorer.findFirst({
      where: { name: explorer.name }
    });

    if (!existing) {
      await prisma.explorer.create({ data: explorer });
      console.log(`  Added explorer: ${explorer.name}`);
    } else {
      // Update with more detailed info if exists
      await prisma.explorer.update({
        where: { id: existing.id },
        data: explorer
      });
      console.log(`  Updated explorer: ${explorer.name}`);
    }
  }

  // Also update Peter Fidler with more cartographer-specific details
  const peterFidler = await prisma.explorer.findFirst({
    where: { name: "Peter Fidler" }
  });

  if (peterFidler) {
    await prisma.explorer.update({
      where: { id: peterFidler.id },
      data: {
        biography: "Peter Fidler was a Hudson's Bay Company surveyor and explorer who produced over 200 maps during his 47-year career with the company. Trained by Philip Turnor in astronomical observation and surveying, Fidler became the HBC's most prolific mapmaker. He traveled over 48,000 km during his explorations. In the winter of 1792-1793, he lived with the Peigan (Piikani) people, becoming the first European to winter among them. He learned their language and documented their culture. Fidler surveyed the 49th parallel boundary region, the Red River Settlement, and extensive areas of the prairies and Rocky Mountain foothills.",
        notableAchievements: "Created over 200 maps of western Canada. Trained by Philip Turnor alongside David Thompson. First European to winter with the Peigan people (1792-1793). Surveyed the 49th parallel boundary region. Traveled over 48,000 km. 47-year HBC career, longest of any company surveyor.",
      }
    });
    console.log("  Updated: Peter Fidler with expanded details");
  }

  // Add cartographer entries for Philip Turnor and Peter Fidler
  console.log("\nAdding cartographer entries...\n");

  const cartographers = [
    {
      name: "Philip Turnor",
      birthYear: 1751,
      deathYear: 1799,
      nationality: "English",
      biography: "The Hudson's Bay Company's first official surveyor, whose astronomical observations and surveying techniques set the standard for HBC cartography. He trained David Thompson and Peter Fidler.",
      notableMaps: "Surveys of the route from Hudson Bay to Lake Athabasca; accurate positioning of major HBC posts; the first reliable mapping of the Saskatchewan River system.",
    },
    {
      name: "Peter Fidler",
      birthYear: 1769,
      deathYear: 1822,
      nationality: "English",
      biography: "The most prolific HBC cartographer, producing over 200 maps during his career. His work documented the prairies, Rocky Mountain foothills, and northern regions with remarkable accuracy.",
      notableMaps: "Over 200 maps including: Athabasca region surveys; 49th parallel boundary; Red River Settlement lots; Rocky Mountain foothills; extensive prairie mapping.",
    },
  ];

  for (const cartographer of cartographers) {
    const existing = await prisma.cartographer.findFirst({
      where: { name: cartographer.name }
    });

    if (!existing) {
      await prisma.cartographer.create({ data: cartographer });
      console.log(`  Added cartographer: ${cartographer.name}`);
    } else {
      await prisma.cartographer.update({
        where: { id: existing.id },
        data: cartographer
      });
      console.log(`  Updated cartographer: ${cartographer.name}`);
    }
  }

  // Print final counts
  console.log("\n==================== SEEDING COMPLETE ====================\n");

  const wordCount = await prisma.indigenousWord.count();
  const explorerCount = await prisma.explorer.count();
  const cartographerCount = await prisma.cartographer.count();

  // Count words by language
  const wordsByLanguage = await prisma.indigenousWord.groupBy({
    by: ['language'],
    _count: true,
    orderBy: { _count: { language: 'desc' } }
  });

  console.log("Final counts:");
  console.log(`  Total Indigenous words: ${wordCount}`);
  console.log(`  Total explorers: ${explorerCount}`);
  console.log(`  Total cartographers: ${cartographerCount}`);

  console.log("\nWords by language:");
  for (const group of wordsByLanguage) {
    console.log(`  ${group.language}: ${group._count} words`);
  }

  console.log("\nLanguage family distribution:");
  console.log("  Algonquin family: Cree, Ojibwe, Blackfoot");
  console.log("  Athapaskan family: Dene/Chipewyan");
  console.log("  Iroquoian family: Iroquois/Mohawk");
  console.log("  Eskimo-Aleut family: Inuktitut");
}

seedIndigenousWordsAndExplorers()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
