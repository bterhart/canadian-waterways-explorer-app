import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAchievements() {
  console.log("Seeding achievements...");

  const achievements = [
    // Explorer Category - visiting waterways/locations
    {
      name: "First Steps",
      description: "Explore your first waterway",
      iconName: "compass",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "waterways_explored", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Waterway Wanderer",
      description: "Explore 5 different waterways",
      iconName: "map",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "waterways_explored", count: 5 }),
      sortOrder: 2,
    },
    {
      name: "River Runner",
      description: "Explore 10 different waterways",
      iconName: "river",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "waterways_explored", count: 10 }),
      sortOrder: 3,
    },
    {
      name: "Master Cartographer",
      description: "Explore 25 different waterways",
      iconName: "globe",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "waterways_explored", count: 25 }),
      sortOrder: 4,
    },
    {
      name: "Location Scout",
      description: "Visit 5 historic locations",
      iconName: "pin",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "locations_visited", count: 5 }),
      sortOrder: 5,
    },
    {
      name: "Fort Finder",
      description: "Visit 15 historic locations",
      iconName: "fort",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "locations_visited", count: 15 }),
      sortOrder: 6,
    },

    // Scholar Category - completing quizzes
    {
      name: "Quiz Beginner",
      description: "Complete your first quiz",
      iconName: "pencil",
      category: "scholar",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "quizzes_completed", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Knowledge Seeker",
      description: "Complete 5 quizzes",
      iconName: "book-open",
      category: "scholar",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "quizzes_completed", count: 5 }),
      sortOrder: 2,
    },
    {
      name: "Quiz Champion",
      description: "Complete 10 quizzes",
      iconName: "trophy",
      category: "scholar",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "quizzes_completed", count: 10 }),
      sortOrder: 3,
    },
    {
      name: "History Scholar",
      description: "Complete 25 quizzes",
      iconName: "graduation-cap",
      category: "scholar",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "quizzes_completed", count: 25 }),
      sortOrder: 4,
    },

    // Voyageur Category - completing field trips
    {
      name: "First Voyage",
      description: "Complete your first virtual field trip",
      iconName: "canoe",
      category: "voyageur",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "field_trips_completed", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Seasoned Paddler",
      description: "Complete 5 virtual field trips",
      iconName: "paddle",
      category: "voyageur",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "field_trips_completed", count: 5 }),
      sortOrder: 2,
    },
    {
      name: "Trail Blazer",
      description: "Complete 10 virtual field trips",
      iconName: "trail",
      category: "voyageur",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "field_trips_completed", count: 10 }),
      sortOrder: 3,
    },

    // Scribe Category - writing journal entries
    {
      name: "First Entry",
      description: "Write your first journal entry",
      iconName: "feather",
      category: "scribe",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "journal_entries", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Thoughtful Recorder",
      description: "Write 5 journal entries",
      iconName: "journal",
      category: "scribe",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "journal_entries", count: 5 }),
      sortOrder: 2,
    },
    {
      name: "Master Chronicler",
      description: "Write 15 journal entries",
      iconName: "scroll",
      category: "scribe",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "journal_entries", count: 15 }),
      sortOrder: 3,
    },

    // Linguist Category - learning pronunciations
    {
      name: "First Words",
      description: "Learn your first pronunciation",
      iconName: "speech",
      category: "linguist",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "pronunciations_learned", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Language Learner",
      description: "Learn 10 pronunciations",
      iconName: "language",
      category: "linguist",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "pronunciations_learned", count: 10 }),
      sortOrder: 2,
    },
    {
      name: "Polyglot",
      description: "Learn 25 pronunciations",
      iconName: "translate",
      category: "linguist",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "pronunciations_learned", count: 25 }),
      sortOrder: 3,
    },

    // Historian Category - reading documents
    {
      name: "First Discovery",
      description: "Read your first primary source document",
      iconName: "document",
      category: "historian",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "documents_read", count: 1 }),
      sortOrder: 1,
    },
    {
      name: "Document Detective",
      description: "Read 5 primary source documents",
      iconName: "magnifying-glass",
      category: "historian",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "documents_read", count: 5 }),
      sortOrder: 2,
    },
    {
      name: "Archive Master",
      description: "Read 15 primary source documents",
      iconName: "archive",
      category: "historian",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "documents_read", count: 15 }),
      sortOrder: 3,
    },

    // Points-based achievements
    {
      name: "Rising Star",
      description: "Earn 100 total points",
      iconName: "star",
      category: "explorer",
      pointsRequired: 100,
      criteria: JSON.stringify({ type: "total_points", points: 100 }),
      sortOrder: 10,
    },
    {
      name: "Point Collector",
      description: "Earn 500 total points",
      iconName: "stars",
      category: "explorer",
      pointsRequired: 500,
      criteria: JSON.stringify({ type: "total_points", points: 500 }),
      sortOrder: 11,
    },
    {
      name: "Point Master",
      description: "Earn 1000 total points",
      iconName: "crown",
      category: "explorer",
      pointsRequired: 1000,
      criteria: JSON.stringify({ type: "total_points", points: 1000 }),
      sortOrder: 12,
    },

    // Streak achievements
    {
      name: "Consistent Explorer",
      description: "Maintain a 3-day streak",
      iconName: "flame",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "daily_streak", count: 3 }),
      sortOrder: 20,
    },
    {
      name: "Dedicated Learner",
      description: "Maintain a 7-day streak",
      iconName: "fire",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "daily_streak", count: 7 }),
      sortOrder: 21,
    },
    {
      name: "Unstoppable",
      description: "Maintain a 30-day streak",
      iconName: "lightning",
      category: "explorer",
      pointsRequired: 0,
      criteria: JSON.stringify({ type: "daily_streak", count: 30 }),
      sortOrder: 22,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement,
    });
  }

  console.log(`Seeded ${achievements.length} achievements`);
}

async function seedDailyChallenges() {
  console.log("Seeding daily challenges...");

  // Create challenges for the next 30 days
  const challenges = [
    {
      question: "Which explorer is credited with being the first European to reach the Pacific Ocean overland through Canada?",
      options: JSON.stringify([
        { id: "a", text: "Samuel de Champlain" },
        { id: "b", text: "Alexander Mackenzie" },
        { id: "c", text: "David Thompson" },
        { id: "d", text: "Simon Fraser" },
      ]),
      correctAnswer: "b",
      explanation: "Alexander Mackenzie completed the first recorded transcontinental crossing of North America north of Mexico in 1793, reaching the Pacific Ocean at Bella Coola.",
      category: "explorer",
      pointsReward: 10,
    },
    {
      question: "What was the primary fur traded by the Hudson's Bay Company?",
      options: JSON.stringify([
        { id: "a", text: "Fox" },
        { id: "b", text: "Mink" },
        { id: "c", text: "Beaver" },
        { id: "d", text: "Otter" },
      ]),
      correctAnswer: "c",
      explanation: "Beaver pelts were the most valuable and sought-after fur in the trade. They were used to make fashionable felt hats in Europe.",
      category: "fur_trade",
      pointsReward: 10,
    },
    {
      question: "What is the Cree word for 'water'?",
      options: JSON.stringify([
        { id: "a", text: "Nipi" },
        { id: "b", text: "Maskwa" },
        { id: "c", text: "Amisk" },
        { id: "d", text: "Wapiti" },
      ]),
      correctAnswer: "a",
      explanation: "Nipi (or nipiy) is the Cree word for water. Many place names in Canada include this word or variations of it.",
      category: "indigenous",
      pointsReward: 10,
    },
    {
      question: "Which river was known as the 'Voyageur Highway'?",
      options: JSON.stringify([
        { id: "a", text: "St. Lawrence River" },
        { id: "b", text: "Ottawa River" },
        { id: "c", text: "Red River" },
        { id: "d", text: "Mackenzie River" },
      ]),
      correctAnswer: "b",
      explanation: "The Ottawa River was a crucial route for voyageurs transporting furs from the interior to Montreal. It was part of the main fur trade route.",
      category: "waterway",
      pointsReward: 10,
    },
    {
      question: "What year was the Hudson's Bay Company founded?",
      options: JSON.stringify([
        { id: "a", text: "1620" },
        { id: "b", text: "1670" },
        { id: "c", text: "1720" },
        { id: "d", text: "1750" },
      ]),
      correctAnswer: "b",
      explanation: "The Hudson's Bay Company was founded on May 2, 1670, making it one of the oldest commercial corporations in North America.",
      category: "fur_trade",
      pointsReward: 10,
    },
    {
      question: "What does the name 'Saskatchewan' mean in Cree?",
      options: JSON.stringify([
        { id: "a", text: "Land of the living skies" },
        { id: "b", text: "Swift flowing river" },
        { id: "c", text: "Meeting of the waters" },
        { id: "d", text: "Home of the buffalo" },
      ]),
      correctAnswer: "b",
      explanation: "Saskatchewan comes from the Cree word 'kisiskatchewanisipi', meaning 'swift-flowing river', referring to the Saskatchewan River.",
      category: "indigenous",
      pointsReward: 10,
    },
    {
      question: "Who mapped most of western Canada between 1792 and 1812?",
      options: JSON.stringify([
        { id: "a", text: "Peter Pond" },
        { id: "b", text: "David Thompson" },
        { id: "c", text: "Samuel Hearne" },
        { id: "d", text: "George Vancouver" },
      ]),
      correctAnswer: "b",
      explanation: "David Thompson, known as the 'greatest land geographer who ever lived', mapped over 4.9 million square kilometers of North America.",
      category: "explorer",
      pointsReward: 10,
    },
    {
      question: "What was a 'portage' in the fur trade era?",
      options: JSON.stringify([
        { id: "a", text: "A type of canoe" },
        { id: "b", text: "A trading post" },
        { id: "c", text: "Carrying boats and goods overland between waterways" },
        { id: "d", text: "A fur storage building" },
      ]),
      correctAnswer: "c",
      explanation: "A portage was a route between navigable waterways where voyageurs had to carry their canoes and cargo overland to continue their journey.",
      category: "voyageur",
      pointsReward: 10,
    },
    {
      question: "Which lake is the largest lake entirely within Canada?",
      options: JSON.stringify([
        { id: "a", text: "Lake Winnipeg" },
        { id: "b", text: "Great Bear Lake" },
        { id: "c", text: "Great Slave Lake" },
        { id: "d", text: "Lake Athabasca" },
      ]),
      correctAnswer: "b",
      explanation: "Great Bear Lake in the Northwest Territories is the largest lake entirely within Canada and the fourth largest in North America.",
      category: "waterway",
      pointsReward: 10,
    },
    {
      question: "What was the main rival of the Hudson's Bay Company?",
      options: JSON.stringify([
        { id: "a", text: "American Fur Company" },
        { id: "b", text: "Russian-American Company" },
        { id: "c", text: "North West Company" },
        { id: "d", text: "Pacific Fur Company" },
      ]),
      correctAnswer: "c",
      explanation: "The North West Company, based in Montreal, was the main competitor of the Hudson's Bay Company until they merged in 1821.",
      category: "fur_trade",
      pointsReward: 10,
    },
    {
      question: "What does 'Athabasca' mean in Cree?",
      options: JSON.stringify([
        { id: "a", text: "Big water" },
        { id: "b", text: "Where there are reeds" },
        { id: "c", text: "Land of the moose" },
        { id: "d", text: "Cold winds" },
      ]),
      correctAnswer: "b",
      explanation: "Athabasca comes from the Cree word 'aðapaskāw', meaning 'where there are reeds' or 'grass here and there'.",
      category: "indigenous",
      pointsReward: 10,
    },
    {
      question: "Which explorer first reached the Arctic Ocean overland from Hudson Bay?",
      options: JSON.stringify([
        { id: "a", text: "Samuel Hearne" },
        { id: "b", text: "Alexander Mackenzie" },
        { id: "c", text: "John Franklin" },
        { id: "d", text: "Peter Pond" },
      ]),
      correctAnswer: "a",
      explanation: "Samuel Hearne reached the Arctic Ocean via the Coppermine River in 1771, guided by Matonabbee of the Chipewyan people.",
      category: "explorer",
      pointsReward: 10,
    },
    {
      question: "How long were typical voyageur canoes?",
      options: JSON.stringify([
        { id: "a", text: "About 10 feet" },
        { id: "b", text: "About 25 feet" },
        { id: "c", text: "About 36 feet" },
        { id: "d", text: "About 50 feet" },
      ]),
      correctAnswer: "c",
      explanation: "The 'canot du maître' (Montreal canoe) was about 36 feet long and could carry 4 tons of cargo plus 8-12 paddlers.",
      category: "voyageur",
      pointsReward: 10,
    },
    {
      question: "What river did Simon Fraser explore in 1808?",
      options: JSON.stringify([
        { id: "a", text: "Columbia River" },
        { id: "b", text: "Fraser River" },
        { id: "c", text: "Peace River" },
        { id: "d", text: "Mackenzie River" },
      ]),
      correctAnswer: "b",
      explanation: "Simon Fraser explored the river that now bears his name, travelling from the Rocky Mountains to the Pacific Ocean.",
      category: "explorer",
      pointsReward: 10,
    },
    {
      question: "What Indigenous nation guided many early explorers in the western interior?",
      options: JSON.stringify([
        { id: "a", text: "Haudenosaunee" },
        { id: "b", text: "Cree" },
        { id: "c", text: "Mi'kmaq" },
        { id: "d", text: "Haida" },
      ]),
      correctAnswer: "b",
      explanation: "The Cree were essential guides and trading partners in the fur trade, with their territory spanning from Quebec to Alberta.",
      category: "indigenous",
      pointsReward: 10,
    },
  ];

  // Create challenges for the next 30 days, cycling through the questions
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const challengeDate = new Date(today);
    challengeDate.setDate(today.getDate() + i);

    const challengeData = challenges[i % challenges.length]!;

    await prisma.dailyChallenge.upsert({
      where: { date: challengeDate },
      update: {
        question: challengeData.question,
        options: challengeData.options,
        correctAnswer: challengeData.correctAnswer,
        explanation: challengeData.explanation,
        category: challengeData.category,
        pointsReward: challengeData.pointsReward,
      },
      create: {
        date: challengeDate,
        question: challengeData.question,
        options: challengeData.options,
        correctAnswer: challengeData.correctAnswer,
        explanation: challengeData.explanation,
        category: challengeData.category,
        pointsReward: challengeData.pointsReward,
      },
    });
  }

  console.log(`Seeded 30 daily challenges`);
}

async function main() {
  try {
    await seedAchievements();
    await seedDailyChallenges();
    console.log("Gamification seed completed successfully!");
  } catch (error) {
    console.error("Error seeding gamification data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
