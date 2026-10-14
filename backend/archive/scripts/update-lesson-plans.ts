import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface LessonPlanUpdate {
  id: string;
  mainContent?: string;
  objectives?: string[];
  materials?: string[];
  activities?: Array<{
    title: string;
    description: string;
    duration: string;
    materials: string[];
  }>;
  discussionQuestions?: string[];
  curriculumConnections?: Array<{
    subject: string;
    strand: string;
    expectation: string;
  }>;
}

// Update for "Voyageur Routes of Canada"
const voyageurRoutesUpdate: LessonPlanUpdate = {
  id: 'cmlheagqq0006m28u7nkab8us',
  mainContent: `# Voyageur Routes of Canada: The Great Highway System of the Fur Trade

## Introduction

Long before highways and railways crisscrossed Canada, there existed an intricate network of waterways that served as the primary transportation system for one of North America's most significant economic enterprises: the fur trade. The voyageurs, French-Canadian paddlers renowned for their strength, endurance, and skill, navigated these routes for over two centuries, creating a legacy that shaped Canadian geography, culture, and identity.

## The Main Routes

### The Grand Portage Route

The Grand Portage route began at Montreal, the commercial hub of the fur trade, and extended westward to the rich fur territories of the interior. Voyageurs would paddle up the St. Lawrence River, through the Ottawa River system, across Lake Nipissing, down the French River to Georgian Bay, and along the northern shore of Lake Superior to Grand Portage (later Fort William). This journey of approximately 1,400 kilometers took about six weeks to complete.

The route was divided into two segments, each served by different types of voyageurs. The "mangeurs de lard" (pork eaters) paddled the canots de maitre (Montreal canoes) from Montreal to the western posts. The "hommes du nord" (men of the north) paddled the smaller canots du nord through the intricate waterways of the Northwest.

### The Hudson Bay Route

The Hudson's Bay Company utilized a different approach, establishing posts along the shores of Hudson Bay and James Bay. Indigenous trappers and middlemen would bring furs directly to these coastal posts, reducing the need for extensive inland travel. However, as competition with the North West Company intensified, the HBC expanded inland, establishing posts along major river systems including the Nelson, Hayes, and Albany rivers.

### The Athabasca Route

Extending beyond the traditional Great Lakes routes, the Athabasca country (present-day northern Alberta and Saskatchewan) represented the most remote and lucrative fur territory. Voyageurs traveling to this region faced an additional 2,000 kilometers of paddling through the intricate river systems connecting Lake Superior to Lake Athabasca. The journey was so demanding that hivernants (winterers) would spend the entire season in the Northwest, unable to make the round trip in a single open-water season.

## The Voyageur Experience

Life on these routes was extraordinarily demanding. Voyageurs typically paddled 14-18 hours per day, maintaining a pace of 40-55 paddle strokes per minute. They carried loads of up to 180 kilograms (400 pounds) over portages - places where canoes and cargo had to be carried overland around obstacles such as rapids or waterfalls.

The Grand Portage, for which the western headquarters was named, was a brutal 14-kilometer trek over rough terrain. Yet despite the hardship, voyageurs developed a vibrant culture of songs, stories, and traditions that sustained their spirits on these grueling journeys.

## Economic Significance

These routes carried enormous economic value. At the peak of the fur trade in the late 18th century, annual fur exports from Canada were worth approximately £200,000 - a fortune in that era. The routes were so commercially important that both the North West Company and Hudson's Bay Company invested heavily in maintaining and improving key portages, establishing supply posts, and recruiting the best voyageurs.

## Geographic Knowledge

The voyageurs and their Indigenous guides accumulated vast geographic knowledge of the Canadian interior. This knowledge proved invaluable for later explorers, surveyors, and cartographers. David Thompson, the great mapmaker, traveled extensively with voyageur brigades, and his detailed maps of the Canadian West owe much to the geographic knowledge accumulated over generations of travel along these routes.

## Legacy

The voyageur routes left an indelible mark on Canadian geography and culture. Many modern highways follow the approximate paths of these historic waterways. Place names across Canada - from Lachine (the name a reference to the failed search for a route to China) to Portage la Prairie to countless lakes, rivers, and rapids - commemorate the voyageur era. The routes also established patterns of settlement and commerce that persist to this day, with many major Canadian cities located along former fur trade routes.

Understanding these routes helps us appreciate the remarkable achievement of the voyageurs who, armed only with paddles, ingenuity, and extraordinary physical endurance, created a continental transportation network that linked the Canadian interior to global markets for over two centuries.`,
  objectives: [
    'Identify and map the major voyageur routes across Canada, including the Grand Portage, Hudson Bay, and Athabasca routes',
    'Analyze the physical and geographical challenges that shaped route selection and travel patterns',
    'Evaluate the economic, cultural, and geographical significance of these routes in Canadian history',
    'Compare and contrast different voyageur routes and the companies that used them',
    'Connect historical transportation routes to modern Canadian geography and infrastructure'
  ],
  materials: [
    'Large map of Canada showing major waterways',
    'Voyageur route overlay transparencies or digital mapping tools',
    'Primary source excerpts from voyageur journals and company records',
    'Photographs or illustrations of voyageur canoes and portaging',
    'Distance and timeline calculation worksheets',
    'Video clips or documentaries about voyageur travel'
  ],
  activities: [
    {
      title: 'Route Mapping Challenge',
      description: 'Students work in groups to trace major voyageur routes on blank maps of Canada, identifying key waypoints, portages, and trading posts. Groups then compare their routes with historical maps and calculate distances traveled.',
      duration: '45 minutes',
      materials: ['Blank maps of Canada', 'Colored pencils', 'Historical route references', 'Rulers for distance calculation']
    },
    {
      title: 'Voyageur Journey Simulation',
      description: 'Students simulate planning a voyageur expedition by calculating travel times, supply needs, and identifying challenges along a chosen route. They must consider weather patterns, portage locations, and trading post locations.',
      duration: '50 minutes',
      materials: ['Route planning worksheets', 'Supply lists', 'Calendar/timing charts', 'Portage difficulty ratings']
    },
    {
      title: 'Primary Source Analysis',
      description: 'Students examine excerpts from voyageur journals, company records, and traveler accounts to understand the daily experiences of those who traveled these routes. They identify geographical features, challenges, and cultural practices mentioned in the sources.',
      duration: '40 minutes',
      materials: ['Primary source excerpts', 'Analysis guide questions', 'Historical context handouts']
    },
    {
      title: 'Then and Now Comparison',
      description: 'Students research how historical voyageur routes compare to modern transportation corridors (highways, railways, shipping lanes). They create visual presentations showing the relationship between historical routes and contemporary infrastructure.',
      duration: '55 minutes',
      materials: ['Modern transportation maps', 'Historical route maps', 'Presentation materials', 'Internet access for research']
    }
  ],
  discussionQuestions: [
    'Why did the voyageurs choose water routes rather than overland trails for transporting furs? What advantages did waterways offer?',
    'How did geographical features like the Canadian Shield, the Great Lakes, and major river systems shape the development of fur trade routes?',
    'What role did Indigenous peoples play in establishing and maintaining these transportation networks?',
    'How did competition between the Hudson\'s Bay Company and North West Company influence route development and expansion?',
    'In what ways do the historical voyageur routes continue to influence Canadian geography, settlement patterns, and transportation today?',
    'What physical and mental qualities would a person need to successfully travel these routes? Would you have been able to be a voyageur?'
  ],
  curriculumConnections: [
    {
      subject: 'Social Studies',
      strand: 'Canada and World Connections',
      expectation: 'Analyze the historical development of transportation systems in Canada and their impact on economic and cultural development'
    },
    {
      subject: 'Geography',
      strand: 'Physical Geography',
      expectation: 'Understand how physical features of the Canadian landscape influenced historical patterns of movement and settlement'
    },
    {
      subject: 'History',
      strand: 'New France and British North America',
      expectation: 'Examine the economic and social systems of the fur trade and their lasting impact on Canadian society'
    }
  ]
};

// Update for "The Hudson's Bay Company: From Fur Trade to Modern Retail" - only needs curriculumConnections
const hbcModernUpdate: LessonPlanUpdate = {
  id: 'cmligbkyc001dm20zsv5hrm6o',
  curriculumConnections: [
    {
      subject: 'Social Studies',
      strand: 'Economics and Society',
      expectation: 'Analyze how historical enterprises adapt to changing economic conditions and consumer needs over time'
    },
    {
      subject: 'History',
      strand: 'Canada: Origins, Histories, and Movement of Peoples',
      expectation: 'Examine the role of major institutions in shaping Canadian economic and cultural development from colonial times to the present'
    },
    {
      subject: 'Business Studies',
      strand: 'Business in the Canadian and Global Context',
      expectation: 'Investigate how established companies evolve their business models to remain relevant in changing markets'
    }
  ]
};

async function updateLessonPlan(update: LessonPlanUpdate) {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (update.mainContent) {
    setClauses.push(`mainContent = ?${paramIndex}`);
    values.push(update.mainContent);
    paramIndex++;
  }

  if (update.objectives) {
    setClauses.push(`objectives = ?${paramIndex}`);
    values.push(JSON.stringify(update.objectives));
    paramIndex++;
  }

  if (update.materials) {
    setClauses.push(`materials = ?${paramIndex}`);
    values.push(JSON.stringify(update.materials));
    paramIndex++;
  }

  if (update.activities) {
    setClauses.push(`activities = ?${paramIndex}`);
    values.push(JSON.stringify(update.activities));
    paramIndex++;
  }

  if (update.discussionQuestions) {
    setClauses.push(`discussionQuestions = ?${paramIndex}`);
    values.push(JSON.stringify(update.discussionQuestions));
    paramIndex++;
  }

  if (update.curriculumConnections) {
    setClauses.push(`curriculumConnections = ?${paramIndex}`);
    values.push(JSON.stringify(update.curriculumConnections));
    paramIndex++;
  }

  setClauses.push(`updatedAt = datetime('now')`);

  const sql = `UPDATE LessonPlan SET ${setClauses.join(', ')} WHERE id = ?${paramIndex}`;
  values.push(update.id);

  console.log(`Updating lesson plan ${update.id}...`);
  await client.execute({ sql, args: values });
  console.log(`Successfully updated lesson plan ${update.id}`);
}

async function main() {
  console.log('Starting lesson plan updates...\n');

  // Update Voyageur Routes of Canada
  await updateLessonPlan(voyageurRoutesUpdate);
  console.log('');

  // Update HBC From Fur Trade to Modern Retail
  await updateLessonPlan(hbcModernUpdate);
  console.log('');

  console.log('All updates completed successfully!');
}

main().catch(console.error);
