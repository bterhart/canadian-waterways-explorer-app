import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const womenFurTradeContent = {
  id: "cmligbky5001bm20zjl63dkn9",
  narrativeContent: `The history books of an earlier generation told the story of the fur trade as a tale of men - explorers, voyageurs, traders, and company officials whose names and deeds filled the pages. Women, when they appeared at all, were background figures, footnotes to the main narrative. But this telling was incomplete, and in recent decades historians have worked to recover the vital roles that women - Indigenous, Metis, and European - played in building the fur trade economy and the societies that grew from it.

The fur trade was never simply about furs. It was a complex system of relationships, negotiations, and cultural exchanges that depended fundamentally on women's labor, knowledge, and social connections. Without women, the trade would have been impossible.

At the center of this story are the Indigenous women who became wives and partners to European traders. These relationships, known as marriages "a la facon du pays" (according to the custom of the country), were far more than romantic attachments. They were strategic alliances that created the kinship ties essential to trade. When a trader married an Indigenous woman, he gained not just a wife but access to her entire family network - a network that could provide furs, food, information, and safe passage through territories that would otherwise be closed to him.

Indigenous women brought to these marriages an astonishing range of skills essential to survival in the northern wilderness. They knew how to make moccasins, snowshoes, and clothing suitable for the brutal winters - knowledge that could mean the difference between life and death for traders unused to the climate. They understood which plants could be eaten, which could heal, and which could harm. They could prepare and preserve food, make pemmican, tan hides, and perform the countless other tasks that kept the trading posts functioning.

Perhaps most importantly, these women served as interpreters and cultural brokers. They spoke Indigenous languages and understood Indigenous protocols. They could navigate the complex social expectations of both European and Indigenous cultures, smoothing over misunderstandings and facilitating the negotiations upon which the trade depended. A skilled trader's wife could transform a tense encounter into a profitable partnership, or warn her husband away from a situation that might end in disaster.

The children of these unions became the Metis people, a new nation that embodied the blending of European and Indigenous worlds. But the mothers of the Metis were not merely biological vessels - they were the primary educators of the next generation, transmitting skills, languages, and cultural knowledge that would prove essential to the survival of their communities.

The production of pemmican, the concentrated food that fueled the voyageurs and sustained the trading posts, was almost entirely women's work. The process was laborious and skilled. Buffalo meat had to be cut into thin strips and dried in the sun or over fires. The dried meat was then pounded into a powder and mixed with rendered fat and sometimes berries. The result was a food that could last for years, was easy to transport, and provided the calories needed for the grueling work of the trade. Without pemmican, the voyageur brigades could not have paddled their canoes across the continent. Without the women who made it, the trade would have ground to a halt.

The tanning and preparation of hides - both for trade and for the countless leather goods needed in daily life - was also women's work. A single hide required days of scraping, stretching, smoking, and softening before it was ready for use. The quality of this work affected the price the furs would fetch in European markets and the durability of the goods made from them.

As the fur trade matured, women's roles evolved. At some trading posts, certain women became important figures in their own right - not merely wives of traders but independent actors in the trade economy. Some ran their own small trading operations. Others became essential intermediaries, their reputations and relationships making them indispensable to company operations.

The story of Thanadelthur, a Chipewyan woman who lived in the early 18th century, illustrates the power that an individual woman could wield. Captured by the Cree as a young woman, she escaped and made her way to the Hudson's Bay Company post at York Factory. There she convinced the company to send an expedition to make peace between the Cree and the Chipewyan and to open trade with her people. She led the expedition as guide and interpreter, and when negotiations seemed about to collapse, she harangued both sides until they agreed to peace. Without Thanadelthur, the HBC's expansion into the interior would have been delayed by decades. The company governor called her "the chief promoter and actor" of the peace that opened the northern trade.

Another remarkable woman was Marie-Anne Gaboury, who in 1806 became the first European woman to make the journey into the Canadian Northwest. She traveled from Quebec to Red River with her voyageur husband, Jean-Baptiste Lagimodiere, enduring the same hardships as any voyageur - the endless paddling, the portages, the insects, the weather. She gave birth to her children in the wilderness and raised them in a world where European women were virtually unknown. Her grandson would be Louis Riel.

As European women began to arrive in the fur trade territories in the 19th century, the social dynamics shifted. The Hudson's Bay Company, under pressure from evangelical Christianity and Victorian morality, began to discourage marriages to Indigenous women and encourage the presence of European wives. This transition was often painful, as traders who had lived for years with Indigenous families were pressured to abandon them in favor of "proper" marriages.

Some traders resisted these pressures and remained devoted to their Indigenous wives and Metis children. Others did not, and the personal tragedies that resulted - women and children abandoned, families divided - represented a darker chapter in the fur trade story. The phrase "turned off" was used to describe Indigenous wives who were dismissed by traders seeking to improve their social standing, a euphemism that concealed real suffering.

Yet Indigenous and Metis women continued to be essential to the fur trade economy even as social attitudes shifted. Their labor remained necessary, their knowledge still valuable. And in the Metis communities that formed along the rivers of the Northwest, women occupied positions of importance and respect that reflected their essential contributions to community survival.

The women of the fur trade left few written records in their own voices. Unlike the company officers who kept journals and wrote memoirs, most of these women could not write, and their stories survive mainly in the records kept by others. But their influence is visible everywhere in the history of the period - in the mixed communities that grew up around trading posts, in the Metis nation that emerged from the fur trade, in the very survival of the traders who depended on them.

Today, the descendants of these women are working to recover and honor their stories. Genealogists trace family trees that connect modern Metis and First Nations people to the women who shaped the fur trade era. Historians examine records for glimpses of women's lives and experiences. And Indigenous communities preserve the knowledge and skills that their ancestors developed - knowledge that remains valuable and honored.

When we tell the story of the fur trade, we must tell the story of its women. They were not passive witnesses to history but active creators of it. They worked, negotiated, taught, healed, translated, and mediated. They raised children who would become a new nation. They made possible the trade that shaped a continent. Their names may be less famous than those of the men who signed the company records, but their contributions were no less essential.`,
  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Frances_Anne_Hopkins_-_Voyageurs_at_Dawn.jpg/1280px-Frances_Anne_Hopkins_-_Voyageurs_at_Dawn.jpg",
  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Metis_women_scraping_a_buffalo_hide.jpg/1280px-Metis_women_scraping_a_buffalo_hide.jpg",
      caption: "Metis women working together to scrape and prepare a buffalo hide",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Making_Pemmican.jpg/800px-Making_Pemmican.jpg",
      caption: "Women preparing pemmican, the essential food of the fur trade",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Woman_making_snowshoes.jpg/800px-Woman_making_snowshoes.jpg",
      caption: "Indigenous woman crafting snowshoes, essential equipment for winter travel",
      credit: "Wikimedia Commons"
    }
  ],
  keyFigures: [
    {
      name: "Thanadelthur",
      role: "Interpreter and Diplomat",
      years: "c.1697-1717",
      description: "A Chipewyan woman who escaped captivity and led Hudson's Bay Company expeditions to establish peace between the Cree and Chipewyan, opening the northern fur trade. Called 'the chief promoter and actor' of the peace by HBC governor James Knight."
    },
    {
      name: "Marie-Anne Gaboury",
      role: "Pioneer",
      years: "1780-1875",
      description: "The first European woman to travel to the Canadian Northwest. She journeyed from Quebec to Red River with her voyageur husband and raised her family in the wilderness. She was the grandmother of Louis Riel."
    },
    {
      name: "Nahoway (Margaret Taylor)",
      role: "Metis Matriarch",
      years: "c.1780-1860",
      description: "Wife of HBC official George Taylor and later Thomas Taylor. She was known for her management skills at trading posts and her role in raising a large and influential Metis family."
    },
    {
      name: "Charlotte Small",
      role: "Explorer's Wife",
      years: "c.1785-1857",
      description: "Cree-Metis wife of explorer David Thompson. She traveled with him on his mapping expeditions and was mother to their thirteen children. Thompson credited her with saving his life multiple times."
    },
    {
      name: "Amelia Connolly Douglas",
      role: "First Lady of British Columbia",
      years: "1812-1890",
      description: "Daughter of a Cree woman and HBC trader. She married James Douglas, future governor of British Columbia, making her essentially the first First Lady of the province despite facing discrimination for her Indigenous heritage."
    }
  ],
  timeline: [
    {
      year: 1714,
      title: "Thanadelthur's Peace Mission",
      description: "Thanadelthur leads an HBC expedition to establish peace between the Cree and Chipewyan, opening vast new territories to the fur trade."
    },
    {
      year: 1806,
      title: "Marie-Anne Gaboury's Journey",
      description: "The first European woman travels to the Canadian Northwest, enduring the same hardships as voyageurs to reach Red River."
    },
    {
      year: 1821,
      title: "HBC-NWC Merger Changes Social Landscape",
      description: "The merger of the two companies begins a period of changing attitudes toward Indigenous wives, with increasing pressure on traders to form 'respectable' marriages."
    },
    {
      year: 1830,
      title: "European Wives Arrive",
      description: "The first significant numbers of European women arrive in the fur trade territories, changing social dynamics at trading posts."
    },
    {
      year: 1840,
      title: "Metis Women's Economic Role Peaks",
      description: "Metis women dominate pemmican production and the preparation of trade goods, their labor essential to the fur trade economy."
    },
    {
      year: 1870,
      title: "End of Company Rule",
      description: "The transfer of Rupert's Land to Canada marks the end of an era for fur trade society and the women who shaped it."
    }
  ],
  readingTimeMinutes: 13,
  teacherObjectives: [
    "Students will identify the specific contributions of Indigenous and Metis women to the fur trade economy",
    "Students will analyze how gender roles shaped the fur trade and were shaped by it",
    "Students will understand the concept of cultural brokers and the importance of women in this role",
    "Students will evaluate how historical narratives have changed to include previously marginalized voices",
    "Students will recognize the ongoing relevance of recovering women's histories"
  ],
  teacherActivities: [
    {
      title: "Skills Inventory",
      description: "Students create a detailed inventory of all the skills Indigenous women brought to the fur trade, then research and demonstrate one skill (making cordage, food preservation, etc.).",
      materials: "Research materials, craft supplies for demonstrations",
      duration: "60 minutes across multiple sessions"
    },
    {
      title: "Hidden Figures Research",
      description: "Students research one woman from fur trade history and create a presentation, poster, or digital story about her life and contributions.",
      materials: "Research materials, presentation supplies or technology",
      duration: "Multiple class periods for research and presentation"
    },
    {
      title: "Letters Home",
      description: "Students write letters from the perspective of a fur trade woman - perhaps to a relative back home, or as a diary entry reflecting on daily life.",
      materials: "Historical context information, writing supplies, period-appropriate stationary templates",
      duration: "40 minutes"
    },
    {
      title: "Economic Analysis",
      description: "Students calculate the economic value of women's unpaid labor to the fur trade (pemmican production, hide preparation, etc.) and discuss how this labor was valued or devalued.",
      materials: "Historical records, calculators, comparison data",
      duration: "45 minutes"
    }
  ],
  teacherQuestions: [
    "Why do you think women's contributions to the fur trade were overlooked in early historical accounts?",
    "What does the term 'cultural broker' mean, and why was this role so important?",
    "How did the arrival of European women change life at trading posts, and who benefited or suffered from these changes?",
    "What skills did Indigenous women possess that European traders lacked?",
    "How did marriages 'a la facon du pays' benefit both Indigenous communities and European traders?",
    "Why was pemmican so important, and what does its production tell us about women's economic roles?",
    "How can we work to recover and tell the stories of people who left few written records?"
  ],
  teacherNotes: `This lesson addresses the often-overlooked contributions of women to Canadian history. It connects to curriculum outcomes related to gender roles, Indigenous history, and historical thinking skills.

Key teaching points:
- Women's labor was economically essential, not supplementary
- Marriage alliances were strategic and mutually beneficial, not simply romantic
- The recovery of women's history is ongoing and incomplete
- Indigenous and Metis women had agency and power, though often exercised differently than men's

Sensitive considerations:
- Discuss the practice of 'turning off' Indigenous wives with appropriate sensitivity
- Avoid presenting Indigenous women solely as victims; emphasize their agency and contributions
- Be aware that some students may have personal connections to this history
- The topic of arranged or strategic marriages requires thoughtful handling

Avoid common misconceptions:
- Indigenous women were not 'sold' to traders; marriages followed Indigenous protocols and often served Indigenous family interests
- These women were not passive; they actively negotiated their roles and their families' positions
- Their knowledge was not primitive but sophisticated and adapted to the environment

Extension opportunities:
- Research modern Indigenous women's roles in their communities
- Explore how women's contributions are recognized (or not) in heritage sites
- Connect to contemporary discussions of unpaid labor and its value
- Investigate genealogical resources for tracing fur trade families

Assessment ideas:
- Biographical research project on a fur trade woman
- Analysis of how a heritage site represents (or fails to represent) women's contributions
- Creative writing from multiple perspectives
- Comparison of women's roles across different time periods or cultures`
};

async function updateWomenFurTrade() {
  console.log("Updating Women of the Fur Trade lesson plan...");

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
        womenFurTradeContent.narrativeContent,
        womenFurTradeContent.heroImageUrl,
        JSON.stringify(womenFurTradeContent.images),
        JSON.stringify(womenFurTradeContent.keyFigures),
        JSON.stringify(womenFurTradeContent.timeline),
        womenFurTradeContent.readingTimeMinutes,
        JSON.stringify(womenFurTradeContent.teacherObjectives),
        JSON.stringify(womenFurTradeContent.teacherActivities),
        JSON.stringify(womenFurTradeContent.teacherQuestions),
        womenFurTradeContent.teacherNotes,
        womenFurTradeContent.id
      ]
    });

    console.log("Women of the Fur Trade update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating Women of the Fur Trade:", error);
    throw error;
  }
}

updateWomenFurTrade()
  .then(() => {
    console.log("Successfully updated Women of the Fur Trade lesson plan");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
