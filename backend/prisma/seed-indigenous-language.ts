import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedIndigenousLanguage() {
  console.log("Seeding Indigenous language data...");

  // Seed Indigenous Words
  const words = [
    // Cree words
    {
      word: "missinaibi",
      translation: "picture rock water",
      language: "Cree",
      phonetic: "miss-sin-AY-bee",
      meaning: "Water with pictures on the rocks, referring to pictographs found along the river",
      culturalContext: "The Missinaibi River in Ontario is sacred to the Cree people. The name refers to the ancient pictographs painted on rock faces along its banks, representing spiritual teachings and historical records.",
      category: "waterway",
    },
    {
      word: "maskwa",
      translation: "bear",
      language: "Cree",
      phonetic: "MUSK-wah",
      meaning: "The black bear, an important animal in Cree culture",
      culturalContext: "The bear holds great spiritual significance in Cree culture, representing strength, introspection, and healing. Bears are considered to have powerful medicine and are treated with deep respect.",
      category: "animal",
    },
    {
      word: "amisk",
      translation: "beaver",
      language: "Cree",
      phonetic: "AH-misk",
      meaning: "The beaver, ecosystem engineer of Canadian waterways",
      culturalContext: "The beaver is central to Cree culture and was crucial in the fur trade. It represents industriousness and family. The beaver's ponds create wetlands that support many other species.",
      category: "animal",
    },
    {
      word: "kisiskatchewan",
      translation: "swift-flowing river",
      language: "Cree",
      phonetic: "kiss-is-KATCH-eh-wan",
      meaning: "The river that flows swiftly, origin of the name Saskatchewan",
      culturalContext: "This word gives Saskatchewan its name. The South Saskatchewan River was a vital transportation route for Cree peoples and later for fur traders moving goods across the prairies.",
      category: "waterway",
    },
    {
      word: "sipiy",
      translation: "river",
      language: "Cree",
      phonetic: "SIP-ee",
      meaning: "A flowing body of water, a river",
      culturalContext: "Rivers are seen as the veins of Mother Earth in Cree worldview. They provide life, food, and transportation, connecting communities across vast territories.",
      category: "waterway",
    },
    {
      word: "sakahikan",
      translation: "lake",
      language: "Cree",
      phonetic: "sa-KAH-hi-kan",
      meaning: "A body of still water, a lake",
      culturalContext: "Lakes are gathering places for Cree communities, providing fish for food and serving as important landmarks for navigation and seasonal camps.",
      category: "waterway",
    },
    {
      word: "nipiy",
      translation: "water",
      language: "Cree",
      phonetic: "NIP-ee",
      meaning: "Water in its pure form, the essence of life",
      culturalContext: "Water is sacred in Cree culture. Women are considered the keepers of water, responsible for its protection. Water ceremonies are important spiritual practices.",
      category: "nature",
    },
    {
      word: "wapiti",
      translation: "elk",
      language: "Cree",
      phonetic: "WAH-pit-ee",
      meaning: "The elk or wapiti, a large deer",
      culturalContext: "The elk was an important food source and its hide was used for clothing and shelter. The word 'wapiti' has been adopted into English as the common name for this animal.",
      category: "animal",
    },

    // Ojibwe words
    {
      word: "gichi-gami",
      translation: "great sea / Lake Superior",
      language: "Ojibwe",
      phonetic: "GITCH-ee GAH-mee",
      meaning: "The great sea, referring to Lake Superior",
      culturalContext: "Lake Superior is the largest freshwater lake by surface area in the world. To the Ojibwe, it is a sacred body of water central to their creation stories and migration history.",
      category: "waterway",
    },
    {
      word: "mishigami",
      translation: "great water / Lake Michigan",
      language: "Ojibwe",
      phonetic: "mish-ih-GAH-mee",
      meaning: "Great water, the origin of the name Michigan",
      culturalContext: "This word gives Lake Michigan and the state of Michigan their names. The Ojibwe lived along its shores for thousands of years, fishing and traveling its waters.",
      category: "waterway",
    },
    {
      word: "kitchi-sibi",
      translation: "great river / Ottawa River",
      language: "Ojibwe",
      phonetic: "KIT-chee SIB-ee",
      meaning: "The great river, referring to the Ottawa River",
      culturalContext: "The Ottawa River was a major trade and travel route. It connected Lake Huron to the St. Lawrence River and was used by Indigenous peoples for thousands of years before European contact.",
      category: "waterway",
    },
    {
      word: "makwa",
      translation: "bear",
      language: "Ojibwe",
      phonetic: "MUK-wah",
      meaning: "The bear, a clan animal and spiritual being",
      culturalContext: "The Bear Clan is one of the most important clans in Ojibwe society, traditionally responsible for protection and defense of the community. Bears are seen as powerful healers.",
      category: "animal",
    },
    {
      word: "nibi",
      translation: "water",
      language: "Ojibwe",
      phonetic: "NIB-ee",
      meaning: "Water, the sacred element of life",
      culturalContext: "Water is life (Nibi is Life) is a central teaching. Women hold special responsibilities for water in Ojibwe culture, and water ceremonies are important spiritual practices.",
      category: "nature",
    },
    {
      word: "zhiishiib",
      translation: "duck",
      language: "Ojibwe",
      phonetic: "zhee-SHEEB",
      meaning: "A duck, waterfowl",
      culturalContext: "Ducks and other waterfowl are important in Ojibwe stories, particularly in creation narratives where animals dive to bring up earth from beneath the waters.",
      category: "animal",
    },
    {
      word: "ogaa",
      translation: "walleye",
      language: "Ojibwe",
      phonetic: "oh-GAH",
      meaning: "The walleye fish, an important food source",
      culturalContext: "Walleye fishing has sustained Ojibwe communities for millennia. Traditional fishing rights remain important treaty rights that communities continue to exercise today.",
      category: "animal",
    },
    {
      word: "wiigwaas",
      translation: "birch bark",
      language: "Ojibwe",
      phonetic: "WEEG-wahs",
      meaning: "Bark from the birch tree, used for canoes and more",
      culturalContext: "Birch bark was essential for Ojibwe life, used to make canoes, containers, and scrolls for recording sacred teachings. Birch bark canoes enabled travel across vast waterway networks.",
      category: "nature",
    },

    // Inuktitut words
    {
      word: "nuna",
      translation: "land",
      language: "Inuktitut",
      phonetic: "NOO-nah",
      meaning: "The land, earth, or country",
      culturalContext: "The root of 'Nunavut' (our land). Land and its features are central to Inuit identity and way of life. Place names often describe the characteristics of the land.",
      category: "nature",
    },
    {
      word: "imiq",
      translation: "water",
      language: "Inuktitut",
      phonetic: "IM-ik",
      meaning: "Fresh water for drinking",
      culturalContext: "In the Arctic, finding fresh water can be challenging. Inuit developed extensive knowledge of where to find fresh water, including from ice of specific ages and types.",
      category: "nature",
    },
    {
      word: "tuktu",
      translation: "caribou",
      language: "Inuktitut",
      phonetic: "TOOK-too",
      meaning: "The caribou, most important land animal for Inuit",
      culturalContext: "Caribou are central to Inuit survival and culture. Every part of the caribou is used: meat for food, hides for clothing, antlers and bones for tools. Caribou migrations determine seasonal movements of communities.",
      category: "animal",
    },
    {
      word: "tariuq",
      translation: "sea / ocean",
      language: "Inuktitut",
      phonetic: "TAR-ee-uk",
      meaning: "The salt water sea or ocean",
      culturalContext: "The Arctic Ocean and its coastal waters are the foundation of Inuit life. Marine mammals, fish, and sea ice travel routes have sustained Inuit communities for thousands of years.",
      category: "waterway",
    },
    {
      word: "nanuq",
      translation: "polar bear",
      language: "Inuktitut",
      phonetic: "NAH-nook",
      meaning: "The polar bear, king of the Arctic",
      culturalContext: "The polar bear is the most respected animal in Inuit culture. It is seen as almost human in its intelligence and is both a powerful spirit and an important source of food and warm fur.",
      category: "animal",
    },
    {
      word: "siku",
      translation: "sea ice",
      language: "Inuktitut",
      phonetic: "SEE-koo",
      meaning: "Ice on the sea, crucial for Arctic travel and hunting",
      culturalContext: "Sea ice is like a highway for Inuit, enabling travel and hunting. Inuit have dozens of words for different types of ice, reflecting their deep knowledge of ice conditions.",
      category: "nature",
    },
    {
      word: "qajaq",
      translation: "kayak",
      language: "Inuktitut",
      phonetic: "KYE-yak",
      meaning: "A small boat for one person, the original kayak",
      culturalContext: "The kayak was invented by Inuit for hunting on the water. Its design has been adopted worldwide but originated in the Arctic thousands of years ago. The word 'kayak' comes from Inuktitut.",
      category: "waterway",
    },

    // Mi'kmaq words
    {
      word: "sipu",
      translation: "river",
      language: "Mi'kmaq",
      phonetic: "SIP-oo",
      meaning: "A river or stream",
      culturalContext: "Rivers were the highways of Mi'kma'ki (Mi'kmaq territory). The Mi'kmaq had extensive knowledge of river systems throughout Atlantic Canada, using them for travel, fishing, and trade.",
      category: "waterway",
    },
    {
      word: "samqwan",
      translation: "water",
      language: "Mi'kmaq",
      phonetic: "SAM-kwan",
      meaning: "Water in its liquid form",
      culturalContext: "Water is sacred to the Mi'kmaq. Traditional territory includes thousands of rivers, lakes, and the Atlantic coast. Water ceremonies honor this life-giving element.",
      category: "nature",
    },
    {
      word: "mu'in",
      translation: "bear",
      language: "Mi'kmaq",
      phonetic: "MOO-in",
      meaning: "The bear, a powerful animal spirit",
      culturalContext: "The bear is respected in Mi'kmaq culture for its strength and wisdom. Bear grease was an important trade item and bears appear in many traditional stories.",
      category: "animal",
    },
    {
      word: "kopit",
      translation: "beaver",
      language: "Mi'kmaq",
      phonetic: "KO-pit",
      meaning: "The beaver, important for trade and ecology",
      culturalContext: "Beavers were plentiful in Mi'kma'ki and became central to the fur trade with Europeans. The Mi'kmaq were among the first to trade beaver pelts with French and English settlers.",
      category: "animal",
    },

    // Dene words
    {
      word: "dehcho",
      translation: "big river / Mackenzie River",
      language: "Dene",
      phonetic: "DEH-cho",
      meaning: "The big river, referring to the Mackenzie River",
      culturalContext: "The Mackenzie River, Canada's longest river, is called Dehcho by the Dene people. It has been their lifeline for thousands of years, providing fish, transportation, and connecting communities across a vast territory.",
      category: "waterway",
    },
    {
      word: "tu",
      translation: "water",
      language: "Dene",
      phonetic: "TOO",
      meaning: "Water, the essential element",
      culturalContext: "Water is central to Dene life in the northern forests and tundra. Rivers and lakes provide travel routes in summer and frozen highways in winter.",
      category: "nature",
    },
    {
      word: "sahtu",
      translation: "Great Bear Lake",
      language: "Dene",
      phonetic: "SAH-too",
      meaning: "Bear Lake, the name for Great Bear Lake",
      culturalContext: "Great Bear Lake is the largest lake entirely within Canada. The Sahtu Dene have lived around its shores for thousands of years, and it remains central to their identity and way of life.",
      category: "waterway",
    },
    {
      word: "shih",
      translation: "bear",
      language: "Dene",
      phonetic: "SHEE",
      meaning: "The bear, an important animal",
      culturalContext: "Bears are significant in Dene culture and territory. Great Bear Lake is named for them, and bears are treated with great respect as powerful beings.",
      category: "animal",
    },
  ];

  for (const wordData of words) {
    await prisma.indigenousWord.upsert({
      where: {
        id: `word_${wordData.language.toLowerCase()}_${wordData.word.replace(/[^a-zA-Z]/g, '')}`,
      },
      update: wordData,
      create: {
        id: `word_${wordData.language.toLowerCase()}_${wordData.word.replace(/[^a-zA-Z]/g, '')}`,
        ...wordData,
      },
    });
    console.log(`  Created/updated word: ${wordData.word} (${wordData.language})`);
  }

  // Seed Vocabulary Quizzes
  const quizzes = [
    {
      id: "quiz_cree_waterways",
      title: "Cree Waterway Words",
      language: "Cree",
      difficulty: "beginner",
      description: "Learn Cree words for rivers, lakes, and water features",
      questions: JSON.stringify([
        {
          id: "1",
          word: "missinaibi",
          correctAnswer: "picture rock water",
          options: ["swift-flowing river", "picture rock water", "great lake", "beaver pond"],
        },
        {
          id: "2",
          word: "kisiskatchewan",
          correctAnswer: "swift-flowing river",
          options: ["picture rock water", "still water", "swift-flowing river", "great sea"],
        },
        {
          id: "3",
          word: "sipiy",
          correctAnswer: "river",
          options: ["lake", "ocean", "river", "stream"],
        },
        {
          id: "4",
          word: "sakahikan",
          correctAnswer: "lake",
          options: ["river", "lake", "pond", "ocean"],
        },
        {
          id: "5",
          word: "nipiy",
          correctAnswer: "water",
          options: ["ice", "water", "rain", "snow"],
        },
      ]),
    },
    {
      id: "quiz_ojibwe_great_lakes",
      title: "Ojibwe Great Lakes Names",
      language: "Ojibwe",
      difficulty: "beginner",
      description: "Learn the Ojibwe names for the Great Lakes and water features",
      questions: JSON.stringify([
        {
          id: "1",
          word: "gichi-gami",
          correctAnswer: "Lake Superior",
          options: ["Lake Michigan", "Lake Huron", "Lake Superior", "Lake Erie"],
        },
        {
          id: "2",
          word: "mishigami",
          correctAnswer: "Lake Michigan",
          options: ["Lake Superior", "Lake Michigan", "Lake Ontario", "Lake Huron"],
        },
        {
          id: "3",
          word: "kitchi-sibi",
          correctAnswer: "great river",
          options: ["small stream", "great river", "still lake", "frozen water"],
        },
        {
          id: "4",
          word: "nibi",
          correctAnswer: "water",
          options: ["fire", "earth", "water", "air"],
        },
        {
          id: "5",
          word: "wiigwaas",
          correctAnswer: "birch bark",
          options: ["maple sap", "birch bark", "pine needle", "oak leaf"],
        },
      ]),
    },
    {
      id: "quiz_animals_multilang",
      title: "Animals in Indigenous Languages",
      language: "Multiple",
      difficulty: "intermediate",
      description: "Learn animal names across different Indigenous languages",
      questions: JSON.stringify([
        {
          id: "1",
          word: "maskwa (Cree)",
          correctAnswer: "bear",
          options: ["wolf", "bear", "moose", "deer"],
        },
        {
          id: "2",
          word: "amisk (Cree)",
          correctAnswer: "beaver",
          options: ["otter", "beaver", "muskrat", "fox"],
        },
        {
          id: "3",
          word: "tuktu (Inuktitut)",
          correctAnswer: "caribou",
          options: ["caribou", "moose", "elk", "deer"],
        },
        {
          id: "4",
          word: "nanuq (Inuktitut)",
          correctAnswer: "polar bear",
          options: ["seal", "walrus", "polar bear", "arctic fox"],
        },
        {
          id: "5",
          word: "makwa (Ojibwe)",
          correctAnswer: "bear",
          options: ["bear", "wolf", "eagle", "turtle"],
        },
      ]),
    },
    {
      id: "quiz_inuktitut_basics",
      title: "Inuktitut Arctic Words",
      language: "Inuktitut",
      difficulty: "beginner",
      description: "Learn essential Inuktitut words about the Arctic environment",
      questions: JSON.stringify([
        {
          id: "1",
          word: "nuna",
          correctAnswer: "land",
          options: ["water", "ice", "land", "sky"],
        },
        {
          id: "2",
          word: "imiq",
          correctAnswer: "water",
          options: ["ice", "water", "snow", "rain"],
        },
        {
          id: "3",
          word: "tariuq",
          correctAnswer: "sea",
          options: ["lake", "river", "sea", "pond"],
        },
        {
          id: "4",
          word: "siku",
          correctAnswer: "sea ice",
          options: ["snow", "sea ice", "glacier", "iceberg"],
        },
        {
          id: "5",
          word: "qajaq",
          correctAnswer: "kayak",
          options: ["canoe", "kayak", "sled", "boat"],
        },
      ]),
    },
  ];

  for (const quizData of quizzes) {
    await prisma.vocabularyQuiz.upsert({
      where: { id: quizData.id },
      update: quizData,
      create: quizData,
    });
    console.log(`  Created/updated quiz: ${quizData.title}`);
  }

  // Seed Indigenous Stories
  const stories = [
    {
      id: "story_cree_beaver",
      title: "Amisk and the Gift of Water",
      nation: "Cree",
      language: "Cree",
      theme: "water",
      gradeLevel: "4-6",
      summary: "A traditional Cree story about how the beaver was given the responsibility to care for the waterways.",
      content: `# Amisk and the Gift of Water

Long ago, when the world was young, the Creator called all the animals together for an important meeting. The waters were flowing wild and uncontrolled across the land, flooding some areas while leaving others dry.

"Who among you will take responsibility for the waters?" the Creator asked.

Many animals stepped forward. The mighty moose said he would use his great strength. The swift otter said she would guide the waters with her speed. But the humble beaver, amisk, said nothing.

The Creator noticed the quiet beaver. "Amisk, why do you not speak?"

The beaver answered, "I am small and not as fast as otter or as strong as moose. But I notice things. I see where the waters want to flow. I see where they need to rest. Perhaps I could help the waters find their paths."

The Creator smiled. "You have wisdom, amisk. I give you the gift of being the keeper of the waters. You will build homes that create ponds. Your ponds will give homes to fish and ducks. Your dams will slow the rushing waters and let the land drink."

And so the beaver became the caretaker of Canada's waterways. To this day, beaver ponds create wetlands that support countless plants and animals. The beaver's dams filter water and prevent floods.

This is why the Cree people honor the beaver. Amisk teaches us that the smallest creature can have the biggest responsibility, and that caring for water is caring for all life.

## Teaching

The beaver reminds us that:
- Every creature has a role in caring for nature
- Humility and careful observation are valuable gifts
- Water connects all living things
- Small actions can have big effects on the environment`,
    },
    {
      id: "story_ojibwe_nanabozho",
      title: "Nanabozho and the Great Flood",
      nation: "Ojibwe",
      language: "Ojibwe",
      theme: "creation",
      gradeLevel: "4-6",
      summary: "An Ojibwe story about how the Earth was recreated after a great flood, with the help of water animals.",
      content: `# Nanabozho and the Great Flood

This is one of the most important stories of the Ojibwe people, about how the world was renewed through the courage of the smallest creatures.

Long ago, the world became troubled. People had forgotten how to live in harmony with each other and with the Earth. A great flood came and covered all the land. Nanabozho, the Original Man and teacher of the Ojibwe, found himself floating on a log with some animal friends.

"We need land," said Nanabozho. "Who will dive down and bring up some earth?"

First, the loon dove down. She was gone a long time, but came back with nothing. The waters were too deep.

Then the mink tried. He was a strong swimmer, but he too came back empty-handed.

The beaver volunteered next. Amik dove deep into the waters, deeper than the others. He was gone so long everyone worried. When he finally floated back up, he had a small bit of mud on his paw, but he was not breathing.

Finally, little muskrat said, "I will try." The others were doubtful - muskrat was so small! But muskrat dove down, down, down. He was gone for a very long time.

When muskrat floated back up, he was not breathing either. But in his tiny paw was a small ball of earth!

Nanabozho took the earth and placed it on the turtle's back. He began to sing and the earth began to grow. It grew and grew until it became the whole world - Turtle Island, the land we live on today.

Nanabozho breathed life back into muskrat and beaver, honoring their sacrifice. To this day, the muskrat and beaver are honored for their courage in helping create our world.

## Teaching

This story teaches us:
- The smallest among us can do the greatest things
- Courage means trying even when success seems impossible
- Sacrifice for others is the highest form of love
- All creatures, no matter how small, have important roles
- North America sits on Turtle Island, and we must care for it`,
    },
    {
      id: "story_inuit_sedna",
      title: "Sedna, Mother of the Sea",
      nation: "Inuit",
      language: "Inuktitut",
      theme: "water",
      gradeLevel: "7-9",
      summary: "The Inuit story of Sedna, who became the powerful spirit of the ocean and all its creatures.",
      content: `# Sedna, Mother of the Sea

This is one of the most sacred stories of the Inuit people, explaining the origin of the sea mammals that have sustained Arctic peoples for thousands of years.

Sedna was a beautiful young woman who lived with her father in a small village by the sea. Many men wanted to marry her, but she refused them all.

One day, a handsome stranger came in a kayak. He promised Sedna a life of comfort and plenty. Against her father's wishes, she went away with him. But when they reached his island home, she discovered he was not a man at all, but a spirit bird who had disguised himself.

Her new home was miserable - cold, with nothing to eat but raw fish. When her father came to visit and saw her suffering, he helped her escape in his umiak (boat). But the bird spirit flew after them, creating a terrible storm.

Afraid the boat would sink, Sedna's father threw her into the icy water. When she tried to climb back in, he cut off her fingers one by one. Her fingers became the sea creatures: the seals, the walrus, the whales, and all the animals of the Arctic waters.

Sedna sank to the bottom of the ocean, where she became the powerful spirit of the sea. Now she controls all the sea mammals. When people respect the animals and follow the old ways, Sedna releases the animals to be hunted. When people are wasteful or disrespectful, she keeps the animals away.

Shamans would journey to Sedna's underwater home to comb her hair (she has no fingers to do it herself) and to ask her forgiveness for any disrespect shown to the sea animals. This would bring the animals back.

## Teaching

The story of Sedna teaches:
- Respect for all sea creatures who give their lives to feed the people
- The ocean is alive with spirit and must be honored
- Wastefulness and disrespect toward nature has consequences
- Humans and animals are connected through sacred relationships
- Traditional knowledge about treating animals properly ensures survival`,
    },
  ];

  for (const storyData of stories) {
    await prisma.indigenousStory.upsert({
      where: { id: storyData.id },
      update: storyData,
      create: storyData,
    });
    console.log(`  Created/updated story: ${storyData.title}`);
  }

  // Set a word of the day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingWordOfDay = await prisma.wordOfTheDay.findFirst({
    where: {
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  if (!existingWordOfDay) {
    const featuredWord = await prisma.indigenousWord.findFirst({
      where: { word: "gichi-gami" },
    });

    if (featuredWord) {
      await prisma.wordOfTheDay.create({
        data: {
          date: today,
          wordId: featuredWord.id,
        },
      });
      console.log(`  Set word of the day: ${featuredWord.word}`);
    }
  }

  console.log("\nIndigenous language seeding complete!");
}

seedIndigenousLanguage()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
