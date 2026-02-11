// Sample quiz seed script for RCGS Education
// Creates educational quizzes based on the historical data in the app

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Type for quiz question data
interface QuestionData {
  questionText: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  points: number;
  sourceType?: string;
  sourceId?: string;
}

async function main() {
  console.log("📚 Creating sample quizzes for RCGS Education...\n");

  // ==================== EXPLORERS QUIZ ====================
  console.log("🧭 Creating Explorers of Canada quiz...");

  const explorersQuiz = await prisma.quiz.create({
    data: {
      title: "Famous Canadian Explorers",
      description: "Test your knowledge about the brave explorers who mapped Canada's waterways and wilderness from the 1500s to the 1900s.",
      gradeLevel: "7-9",
      difficulty: "medium",
      category: "Explorers",
      isPublished: true,
    },
  });

  const explorerQuestions: QuestionData[] = [
    {
      questionText: "Which explorer is known as the 'Father of New France' and founded Quebec City in 1608?",
      options: JSON.stringify([
        { id: "a", text: "Jacques Cartier" },
        { id: "b", text: "Samuel de Champlain" },
        { id: "c", text: "Alexander Mackenzie" },
        { id: "d", text: "Henry Hudson" },
      ]),
      correctAnswer: "b",
      explanation: "Samuel de Champlain founded Quebec City in 1608 and is considered the 'Father of New France.' He made over 20 voyages across the Atlantic and explored much of eastern Canada.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "Who was the first European to reach the Arctic Ocean by land, traveling from Hudson Bay in 1771?",
      options: JSON.stringify([
        { id: "a", text: "Samuel Hearne" },
        { id: "b", text: "David Thompson" },
        { id: "c", text: "Simon Fraser" },
        { id: "d", text: "Peter Pond" },
      ]),
      correctAnswer: "a",
      explanation: "Samuel Hearne became the first European to reach the Arctic Ocean overland in 1771, traveling from Prince of Wales Fort on Hudson Bay to the mouth of the Coppermine River.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "Which explorer completed the first recorded transcontinental crossing of North America north of Mexico in 1793?",
      options: JSON.stringify([
        { id: "a", text: "David Thompson" },
        { id: "b", text: "Simon Fraser" },
        { id: "c", text: "Alexander Mackenzie" },
        { id: "d", text: "Peter Fidler" },
      ]),
      correctAnswer: "c",
      explanation: "Alexander Mackenzie reached the Pacific Ocean in 1793, becoming the first European to cross North America north of Mexico. He famously painted on a rock: 'Alexander Mackenzie, from Canada, by land, the twenty-second of July, one thousand seven hundred and ninety-three.'",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "David Thompson is often called 'the greatest land geographer who ever lived.' What did he map?",
      options: JSON.stringify([
        { id: "a", text: "Only the St. Lawrence River" },
        { id: "b", text: "Over 3.9 million square kilometers of North America" },
        { id: "c", text: "Only the Pacific coast" },
        { id: "d", text: "Only Hudson Bay" },
      ]),
      correctAnswer: "b",
      explanation: "David Thompson surveyed and mapped over 3.9 million square kilometers (1.5 million square miles) of North America with remarkable accuracy, including the entire length of the Columbia River.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "What happened to Sir John Franklin's 1845 expedition to find the Northwest Passage?",
      options: JSON.stringify([
        { id: "a", text: "They successfully found the passage and returned to England" },
        { id: "b", text: "All 129 crew members perished after their ships became trapped in ice" },
        { id: "c", text: "They settled in the Arctic and founded a colony" },
        { id: "d", text: "They were rescued by Inuit hunters" },
      ]),
      correctAnswer: "b",
      explanation: "Franklin's expedition ended in tragedy when his ships HMS Erebus and HMS Terror became trapped in ice near King William Island. All 129 men eventually perished. The wrecks were discovered in 2014 and 2016.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "Captain James Cook visited Nootka Sound in 1778. What major trade did his visit spark?",
      options: JSON.stringify([
        { id: "a", text: "The timber trade" },
        { id: "b", text: "The gold trade" },
        { id: "c", text: "The maritime fur trade (sea otters)" },
        { id: "d", text: "The fish trade" },
      ]),
      correctAnswer: "c",
      explanation: "Cook's crew traded for sea otter pelts at Nootka Sound. When these pelts sold for enormous prices in China, it sparked the maritime fur trade that brought dozens of ships to the northwest coast.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "Joseph Tyrrell explored the Barren Lands in 1893 and made an important discovery in Alberta. What did he find?",
      options: JSON.stringify([
        { id: "a", text: "Gold deposits" },
        { id: "b", text: "Dinosaur fossils" },
        { id: "c", text: "Oil reserves" },
        { id: "d", text: "Coal mines" },
      ]),
      correctAnswer: "b",
      explanation: "Joseph Tyrrell discovered dinosaur fossils in Alberta's Red Deer River valley. The Royal Tyrrell Museum in Drumheller is named in his honor and houses one of the world's great dinosaur collections.",
      sourceType: "explorer",
      points: 1,
    },
    {
      questionText: "Who was the first European to see the Canadian prairies and describe bison herds?",
      options: JSON.stringify([
        { id: "a", text: "Anthony Henday" },
        { id: "b", text: "Henry Kelsey" },
        { id: "c", text: "La Vérendrye" },
        { id: "d", text: "Peter Pond" },
      ]),
      correctAnswer: "b",
      explanation: "Henry Kelsey traveled from York Factory into the interior between 1690-1692, becoming the first European to see the Canadian prairies and to document grizzly bears and bison herds.",
      sourceType: "explorer",
      points: 1,
    },
  ];

  for (const [i, question] of explorerQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: explorersQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        sourceType: question.sourceType,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${explorerQuestions.length} questions`);

  // ==================== FUR TRADE QUIZ ====================
  console.log("\n🦫 Creating Fur Trade History quiz...");

  const furTradeQuiz = await prisma.quiz.create({
    data: {
      title: "The Fur Trade Era",
      description: "Learn about the Hudson's Bay Company, the North West Company, and the voyageurs who shaped Canada's history.",
      gradeLevel: "4-6",
      difficulty: "easy",
      category: "Fur Trade",
      isPublished: true,
    },
  });

  const furTradeQuestions: QuestionData[] = [
    {
      questionText: "When was the Hudson's Bay Company founded?",
      options: JSON.stringify([
        { id: "a", text: "1534" },
        { id: "b", text: "1608" },
        { id: "c", text: "1670" },
        { id: "d", text: "1783" },
      ]),
      correctAnswer: "c",
      explanation: "The Hudson's Bay Company (HBC) was founded in 1670 by royal charter from King Charles II. It is one of the oldest companies in the world and still exists today!",
      points: 1,
    },
    {
      questionText: "What animal's fur was the most valuable in the fur trade?",
      options: JSON.stringify([
        { id: "a", text: "Moose" },
        { id: "b", text: "Beaver" },
        { id: "c", text: "Bear" },
        { id: "d", text: "Deer" },
      ]),
      correctAnswer: "b",
      explanation: "Beaver pelts were the most valuable because they were used to make fashionable felt hats in Europe. The underfur of beaver was perfect for this purpose.",
      points: 1,
    },
    {
      questionText: "What was pemmican, and why was it important to the fur trade?",
      options: JSON.stringify([
        { id: "a", text: "A type of canoe used by voyageurs" },
        { id: "b", text: "A preserved food made from dried meat, fat, and berries" },
        { id: "c", text: "A trading currency made of shells" },
        { id: "d", text: "A type of fur hat" },
      ]),
      correctAnswer: "b",
      explanation: "Pemmican was a high-energy preserved food made by Indigenous peoples from dried bison meat, fat, and berries. It could last for years and was essential for feeding voyageurs on their long journeys.",
      points: 1,
    },
    {
      questionText: "What was Fort William (now Thunder Bay) famous for?",
      options: JSON.stringify([
        { id: "a", text: "It was the headquarters of the Hudson's Bay Company" },
        { id: "b", text: "It was where the North West Company held its annual meeting" },
        { id: "c", text: "It was the first European settlement in Canada" },
        { id: "d", text: "It was where gold was discovered" },
      ]),
      correctAnswer: "b",
      explanation: "Fort William was the great inland headquarters of the North West Company. Every summer, partners from Montreal and wintering partners from the interior met here for the annual rendezvous to exchange furs and trade goods.",
      points: 1,
    },
    {
      questionText: "Who were the voyageurs?",
      options: JSON.stringify([
        { id: "a", text: "French soldiers who guarded the forts" },
        { id: "b", text: "Canoe paddlers who transported furs and trade goods" },
        { id: "c", text: "Indigenous chiefs who traded with Europeans" },
        { id: "d", text: "Ship captains who sailed to England" },
      ]),
      correctAnswer: "b",
      explanation: "Voyageurs were skilled canoe paddlers, mostly French-Canadian, who transported furs and trade goods across vast distances. They could paddle up to 16 hours a day and carry heavy packs over portages.",
      points: 1,
    },
    {
      questionText: "What year did the Hudson's Bay Company and North West Company merge?",
      options: JSON.stringify([
        { id: "a", text: "1760" },
        { id: "b", text: "1793" },
        { id: "c", text: "1821" },
        { id: "d", text: "1867" },
      ]),
      correctAnswer: "c",
      explanation: "After years of intense competition that sometimes turned violent, the Hudson's Bay Company and North West Company merged in 1821. The combined company kept the HBC name.",
      points: 1,
    },
  ];

  for (const [i, question] of furTradeQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: furTradeQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${furTradeQuestions.length} questions`);

  // ==================== MARITIME EXPLORATION QUIZ ====================
  console.log("\n⚓ Creating Maritime Exploration quiz...");

  const maritimeQuiz = await prisma.quiz.create({
    data: {
      title: "Explorers of Canada's Coasts",
      description: "Discover the brave mariners who sailed to Canada's Atlantic and Pacific coasts.",
      gradeLevel: "7-9",
      difficulty: "medium",
      category: "Maritime History",
      isPublished: true,
    },
  });

  const maritimeQuestions: QuestionData[] = [
    {
      questionText: "John Cabot reached North America in 1497 sailing for which country?",
      options: JSON.stringify([
        { id: "a", text: "Spain" },
        { id: "b", text: "France" },
        { id: "c", text: "England" },
        { id: "d", text: "Portugal" },
      ]),
      correctAnswer: "c",
      explanation: "John Cabot (Giovanni Caboto) was an Italian navigator who sailed under the flag of England's King Henry VII. His 1497 voyage to Newfoundland established England's claim to North America.",
      points: 1,
    },
    {
      questionText: "What did Jacques Cartier do at Gaspé Bay in 1534?",
      options: JSON.stringify([
        { id: "a", text: "Built the first French settlement" },
        { id: "b", text: "Erected a cross claiming the land for France" },
        { id: "c", text: "Discovered gold deposits" },
        { id: "d", text: "Made peace with the Iroquois" },
      ]),
      correctAnswer: "b",
      explanation: "On July 24, 1534, Cartier erected a 30-foot wooden cross at Gaspé, claiming the land for King Francis I of France. Chief Donnacona of the Stadaconans protested this claim.",
      points: 1,
    },
    {
      questionText: "Why did Captain George Vancouver name 'Spanish Banks' in what is now Vancouver?",
      options: JSON.stringify([
        { id: "a", text: "Spanish pirates had attacked there" },
        { id: "b", text: "He found Spanish treasure buried there" },
        { id: "c", text: "He met Spanish explorers Galiano and Valdés there" },
        { id: "d", text: "Spanish missionaries had built a church there" },
      ]),
      correctAnswer: "c",
      explanation: "On June 22, 1792, Vancouver met Spanish explorers Dionisio Alcalá Galiano and Cayetano Valdés at Point Grey. He named the beaches 'Spanish Banks' to honor this friendly meeting between rival imperial powers.",
      points: 1,
    },
    {
      questionText: "What tragedy occurred during La Pérouse's visit to Lituya Bay in 1786?",
      options: JSON.stringify([
        { id: "a", text: "His ships sank in a storm" },
        { id: "b", text: "21 sailors drowned in treacherous tidal currents" },
        { id: "c", text: "His crew was attacked by bears" },
        { id: "d", text: "His expedition caught a deadly disease" },
      ]),
      correctAnswer: "b",
      explanation: "On July 13, 1786, 21 French sailors drowned when their boats were caught in Lituya Bay's extreme tidal currents. La Pérouse erected a memorial on Cenotaph Island in their honor.",
      points: 1,
    },
    {
      questionText: "Who was the first European to enter the Columbia River?",
      options: JSON.stringify([
        { id: "a", text: "Captain George Vancouver" },
        { id: "b", text: "Juan de Fuca" },
        { id: "c", text: "Robert Gray" },
        { id: "d", text: "James Cook" },
      ]),
      correctAnswer: "c",
      explanation: "American captain Robert Gray crossed the dangerous bar and entered the Columbia River on May 11, 1792. He named it after his ship, the Columbia Rediviva. His discovery strengthened American claims to the Oregon Territory.",
      points: 1,
    },
    {
      questionText: "The 'Nootka Crisis' of 1789-1794 nearly caused a war between which two countries?",
      options: JSON.stringify([
        { id: "a", text: "Britain and France" },
        { id: "b", text: "Britain and Spain" },
        { id: "c", text: "Russia and Britain" },
        { id: "d", text: "America and Britain" },
      ]),
      correctAnswer: "b",
      explanation: "In 1789, Spanish commandant Esteban José Martínez seized British trading ships at Nootka Sound, nearly triggering a war. The crisis was resolved by the Nootka Conventions (1790-1794), which opened the coast to British trade.",
      points: 1,
    },
  ];

  for (const [i, question] of maritimeQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: maritimeQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${maritimeQuestions.length} questions`);

  // ==================== INDIGENOUS HERITAGE QUIZ ====================
  console.log("\n🪶 Creating Indigenous Heritage quiz...");

  const indigenousQuiz = await prisma.quiz.create({
    data: {
      title: "Indigenous Peoples & Canadian Waterways",
      description: "Learn about the First Nations who have lived along Canada's waterways for thousands of years.",
      gradeLevel: "4-6",
      difficulty: "easy",
      category: "Indigenous Heritage",
      isPublished: true,
    },
  });

  const indigenousQuestions: QuestionData[] = [
    {
      questionText: "What does the Cree name 'Missinaibi' mean?",
      options: JSON.stringify([
        { id: "a", text: "Big water" },
        { id: "b", text: "Fast river" },
        { id: "c", text: "Picture water" },
        { id: "d", text: "Cold stream" },
      ]),
      correctAnswer: "c",
      explanation: "Missinaibi means 'picture water' in Cree, referring to the pictographs (rock paintings) along the river's shores. These pictographs are thousands of years old.",
      points: 1,
    },
    {
      questionText: "The Mackenzie River is called 'Deh Cho' in the Dene language. What does this mean?",
      options: JSON.stringify([
        { id: "a", text: "Frozen river" },
        { id: "b", text: "Big river" },
        { id: "c", text: "Sacred water" },
        { id: "d", text: "Fish river" },
      ]),
      correctAnswer: "b",
      explanation: "'Deh Cho' means 'big river' in the South Slavey (Dene) language. The Dene peoples have lived along this great river for thousands of years.",
      points: 1,
    },
    {
      questionText: "What Indigenous peoples taught European explorers how to build and paddle canoes?",
      options: JSON.stringify([
        { id: "a", text: "Only the Inuit" },
        { id: "b", text: "Many nations including Algonquin, Cree, and Ojibwe" },
        { id: "c", text: "No one taught them - Europeans invented canoes" },
        { id: "d", text: "Only the Haudenosaunee" },
      ]),
      correctAnswer: "b",
      explanation: "The birchbark canoe was developed by Indigenous peoples including the Algonquin, Cree, and Ojibwe. Europeans could never have explored Canada's waterways without learning canoe-building and paddling skills from First Nations.",
      points: 1,
    },
    {
      questionText: "What does 'Yuquot' mean in the Nuu-chah-nulth language?",
      options: JSON.stringify([
        { id: "a", text: "Good fishing" },
        { id: "b", text: "Where the wind blows from all directions" },
        { id: "c", text: "Meeting place" },
        { id: "d", text: "Sacred waters" },
      ]),
      correctAnswer: "b",
      explanation: "Yuquot means 'where the wind blows from all directions' in the Nuu-chah-nulth language. The Mowachaht people have lived at Yuquot (Friendly Cove) for over 4,000 years.",
      points: 1,
    },
    {
      questionText: "The St. Lawrence River is called 'Kaniatarowanenneh' in the Mohawk language. What does this mean?",
      options: JSON.stringify([
        { id: "a", text: "River of the north" },
        { id: "b", text: "Big waterway" },
        { id: "c", text: "Father of waters" },
        { id: "d", text: "Trading river" },
      ]),
      correctAnswer: "b",
      explanation: "'Kaniatarowanenneh' means 'big waterway' in the Mohawk (Kanien'kehá:ka) language. The Haudenosaunee (Iroquois) peoples have lived along the St. Lawrence for thousands of years.",
      points: 1,
    },
  ];

  for (const [i, question] of indigenousQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: indigenousQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${indigenousQuestions.length} questions`);

  // ==================== GEOGRAPHY QUIZ ====================
  console.log("\n🗺️ Creating Canadian Geography quiz...");

  const geographyQuiz = await prisma.quiz.create({
    data: {
      title: "Canada's Waterways Geography",
      description: "Test your knowledge of Canada's rivers, lakes, and coastal features.",
      gradeLevel: "K-3",
      difficulty: "easy",
      category: "Geography",
      isPublished: true,
    },
  });

  const geographyQuestions: QuestionData[] = [
    {
      questionText: "Which is the longest river in Canada?",
      options: JSON.stringify([
        { id: "a", text: "St. Lawrence River" },
        { id: "b", text: "Fraser River" },
        { id: "c", text: "Mackenzie River" },
        { id: "d", text: "Saskatchewan River" },
      ]),
      correctAnswer: "c",
      explanation: "The Mackenzie River is Canada's longest river at about 4,241 km. It flows north through the Northwest Territories to the Arctic Ocean.",
      points: 1,
    },
    {
      questionText: "Which Great Lake is entirely within Canada?",
      options: JSON.stringify([
        { id: "a", text: "Lake Superior" },
        { id: "b", text: "Lake Erie" },
        { id: "c", text: "Lake Ontario" },
        { id: "d", text: "None - they all border the US" },
      ]),
      correctAnswer: "d",
      explanation: "All five Great Lakes (Superior, Michigan, Huron, Erie, and Ontario) are shared between Canada and the United States. However, Lake Michigan is the only one entirely within the US.",
      points: 1,
    },
    {
      questionText: "What is the largest lake entirely within Canada?",
      options: JSON.stringify([
        { id: "a", text: "Lake Winnipeg" },
        { id: "b", text: "Great Bear Lake" },
        { id: "c", text: "Great Slave Lake" },
        { id: "d", text: "Lake Athabasca" },
      ]),
      correctAnswer: "b",
      explanation: "Great Bear Lake in the Northwest Territories is the largest lake entirely within Canada at about 31,000 square kilometers. It is also the 8th largest lake in the world!",
      points: 1,
    },
    {
      questionText: "Hudson Bay is connected to what ocean?",
      options: JSON.stringify([
        { id: "a", text: "Pacific Ocean" },
        { id: "b", text: "Atlantic Ocean" },
        { id: "c", text: "Arctic Ocean" },
        { id: "d", text: "Indian Ocean" },
      ]),
      correctAnswer: "c",
      explanation: "Hudson Bay is connected to the Arctic Ocean through Foxe Basin and Hudson Strait. Despite being relatively far south, it is part of the Arctic watershed.",
      points: 1,
    },
    {
      questionText: "What river flows through the city of Vancouver?",
      options: JSON.stringify([
        { id: "a", text: "Columbia River" },
        { id: "b", text: "Fraser River" },
        { id: "c", text: "Thompson River" },
        { id: "d", text: "Peace River" },
      ]),
      correctAnswer: "b",
      explanation: "The Fraser River flows through the Vancouver area, entering the Pacific Ocean at the Strait of Georgia. It was named after explorer Simon Fraser who descended it in 1808.",
      points: 1,
    },
  ];

  for (const [i, question] of geographyQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: geographyQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${geographyQuestions.length} questions`);

  // ==================== ARCHAEOLOGICAL DISCOVERIES QUIZ ====================
  console.log("\n🔍 Creating Archaeological Discoveries quiz...");

  const archaeologyQuiz = await prisma.quiz.create({
    data: {
      title: "Lost & Found: Archaeological Discoveries",
      description: "Learn about the amazing discoveries that have helped us understand Canada's exploration history.",
      gradeLevel: "10-12",
      difficulty: "hard",
      category: "Explorers",
      isPublished: true,
    },
  });

  const archaeologyQuestions: QuestionData[] = [
    {
      questionText: "In what year was Franklin's ship HMS Erebus discovered?",
      options: JSON.stringify([
        { id: "a", text: "2008" },
        { id: "b", text: "2014" },
        { id: "c", text: "2016" },
        { id: "d", text: "2020" },
      ]),
      correctAnswer: "b",
      explanation: "HMS Erebus was discovered by Parks Canada in September 2014 in Queen Maud Gulf. The sister ship HMS Terror was found two years later in 2016.",
      points: 1,
    },
    {
      questionText: "Where was the L'Anse aux Meadows Norse settlement discovered?",
      options: JSON.stringify([
        { id: "a", text: "Nova Scotia" },
        { id: "b", text: "Labrador" },
        { id: "c", text: "Northern Newfoundland" },
        { id: "d", text: "Baffin Island" },
      ]),
      correctAnswer: "c",
      explanation: "L'Anse aux Meadows was discovered in 1960 at the northern tip of Newfoundland by Norwegian explorers Helge and Anne Stine Ingstad. It is the only confirmed Norse site in North America.",
      points: 1,
    },
    {
      questionText: "What artifact believed to belong to Samuel de Champlain was found near the Ottawa River in 1867?",
      options: JSON.stringify([
        { id: "a", text: "His compass" },
        { id: "b", text: "His astrolabe" },
        { id: "c", text: "His sword" },
        { id: "d", text: "His journal" },
      ]),
      correctAnswer: "b",
      explanation: "A brass astrolabe dated 1603 was found by 14-year-old Edward Lee near Green Lake, Ontario. Champlain recorded losing equipment in this area during his 1613 expedition. The astrolabe is now at the Canadian Museum of History.",
      points: 1,
    },
    {
      questionText: "What did Dr. Owen Beattie's 1984 exhumation of Franklin expedition graves reveal?",
      options: JSON.stringify([
        { id: "a", text: "The crew died of scurvy" },
        { id: "b", text: "The crew had high levels of lead poisoning" },
        { id: "c", text: "The crew was killed by polar bears" },
        { id: "d", text: "The crew had smallpox" },
      ]),
      correctAnswer: "b",
      explanation: "The remarkably preserved bodies showed extremely high lead levels, likely from poorly soldered tinned food. This lead poisoning may have contributed to the expedition's failure by causing mental impairment and physical weakness.",
      points: 1,
    },
    {
      questionText: "Who found the remains of James Knight's 1719 expedition on Marble Island?",
      options: JSON.stringify([
        { id: "a", text: "John Franklin" },
        { id: "b", text: "David Thompson" },
        { id: "c", text: "Samuel Hearne" },
        { id: "d", text: "Alexander Mackenzie" },
      ]),
      correctAnswer: "c",
      explanation: "In 1767, Inuit guides led Samuel Hearne to Marble Island where he found the remains of Knight's expedition. Inuit oral history described watching the last survivors perish while waiting for rescue ships that never came.",
      points: 1,
    },
  ];

  for (const [i, question] of archaeologyQuestions.entries()) {
    await prisma.quizQuestion.create({
      data: {
        quizId: archaeologyQuiz.id,
        questionText: question.questionText,
        questionType: "multiple_choice",
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        orderIndex: i,
        points: question.points,
      },
    });
  }
  console.log(`  ✅ Created ${archaeologyQuestions.length} questions`);

  console.log("\n🎉 Quiz creation complete!");

  // Print summary
  const quizCount = await prisma.quiz.count();
  const questionCount = await prisma.quizQuestion.count();

  console.log(`\nSummary:`);
  console.log(`  - ${quizCount} quizzes created`);
  console.log(`  - ${questionCount} total questions`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
