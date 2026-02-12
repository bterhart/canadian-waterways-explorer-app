import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📜 Seeding Additional Primary Source Documents...");

  // Get existing explorers and waterways for linking
  const alexanderMackenzie = await prisma.explorer.findFirst({
    where: { name: "Alexander Mackenzie" }
  });

  const davidThompson = await prisma.explorer.findFirst({
    where: { name: "David Thompson" }
  });

  const samuelHearne = await prisma.explorer.findFirst({
    where: { name: "Samuel Hearne" }
  });

  const simonFraser = await prisma.explorer.findFirst({
    where: { name: "Simon Fraser" }
  });

  console.log("✅ Found existing explorer references");

  // ==================== DOCUMENT 1: Alexander Mackenzie's "From Canada, by land" ====================
  const mackenzieInscription = await prisma.primarySourceDocument.create({
    data: {
      title: "Alexander Mackenzie's Rock Inscription at Bella Coola, July 1793",
      documentType: "inscription",
      author: "Alexander Mackenzie",
      originalDate: "July 22, 1793",
      originalYear: 1793,
      originalText: "Alex Mackenzie from Canada by land 22d July 1793",
      transcription: "Alexander Mackenzie, from Canada, by land, 22nd July 1793",
      historicalContext: "On July 22, 1793, Alexander Mackenzie became the first European to complete a transcontinental crossing of North America north of Mexico. After an arduous journey from Fort Fork (near present-day Peace River, Alberta), traveling up the Peace River, crossing the Rocky Mountains via the Parsnip and Fraser watersheds, and finally descending to the Pacific Ocean at Bella Coola, Mackenzie inscribed this message on a rock using vermillion and bear grease. He later had it re-inscribed in more permanent form. This simple inscription marks one of the most significant achievements in Canadian exploration history. Mackenzie's journey proved that a land route to the Pacific existed and established British territorial claims that would eventually lead to British Columbia joining Canada. The journey took 74 days each way and covered over 2,400 kilometers through some of the most challenging terrain in North America. Mackenzie's Indigenous guides from the Sekani, Carrier, and Nuxalk nations made the journey possible by providing food, shelter, canoes, and geographic knowledge.",
      annotations: JSON.stringify([
        {
          gradeLevel: "K-3",
          annotation: "Alexander Mackenzie walked all the way across Canada to the Pacific Ocean! When he got there, he painted his name and the date on a big rock. It's like signing your name when you finish something really hard. The rock is still there today for people to see!"
        },
        {
          gradeLevel: "4-6",
          annotation: "After months of incredibly hard travel - paddling rivers, climbing mountains, carrying heavy packs - Mackenzie finally reached the Pacific Ocean at Bella Coola. He mixed red powder (vermillion) with bear grease to paint this message on a rock. The phrase 'from Canada by land' was important because it proved you could walk from eastern Canada to the Pacific. Before this, people had only reached the Pacific by sailing around the world! The Nuxalk people who lived at Bella Coola helped Mackenzie's exhausted party. Without their canoes and guidance, Mackenzie might never have completed his journey."
        },
        {
          gradeLevel: "7-9",
          annotation: "Mackenzie's inscription represents a pivotal moment in Canadian history. The phrase 'from Canada by land' emphasized that he had crossed the continent overland, not by sea - a feat no European had accomplished north of Mexico. This journey was strategically important to the North West Company's fur trade ambitions and to British territorial claims against Spanish and Russian interests on the Pacific coast. However, we must recognize this as 'discovery' from a European perspective only. The Indigenous peoples along Mackenzie's route - Sekani, Carrier (Dakelh), and Nuxalk - had traveled these routes for thousands of years. Mackenzie's success depended entirely on Indigenous guides, food supplies, and diplomatic relationships. The rock inscription, now a National Historic Site, reminds us both of European exploration achievements and of the Indigenous peoples whose knowledge made such journeys possible."
        },
        {
          gradeLevel: "10-12",
          annotation: "Mackenzie's inscription must be understood within the context of imperial competition and colonial expansion. His journey aimed to find a commercial route for the fur trade and establish British presence on the Pacific coast before American, Spanish, or Russian rivals. The inscription itself - written in English, referencing 'Canada' (meaning British North America) - was a territorial claim. Yet this narrative of 'discovery' erases millennia of Indigenous presence and knowledge. The Nuxalk people at Bella Coola were part of sophisticated trade networks extending up and down the coast. Mackenzie's Indigenous guides - particularly a young Sekani man and two Carrier guides - possessed geographic knowledge accumulated over generations. Modern historians increasingly recognize that these expeditions were collaborative endeavors dependent on Indigenous agency, even as European explorers claimed individual credit and their nations asserted sovereignty over Indigenous lands. The story of this inscription thus encapsulates larger themes of colonialism, Indigenous-European relations, and the politics of historical memory."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "inscription", definition: "words carved or written on a surface" },
        { word: "vermillion", definition: "a brilliant red pigment, historically made from mercury sulfide" },
        { word: "transcontinental", definition: "extending or going across a continent" },
        { word: "Bella Coola", definition: "a location on the Pacific coast of British Columbia; home of the Nuxalk Nation" },
        { word: "Nuxalk", definition: "Indigenous nation of the central coast of British Columbia, also spelled Nuxalk" },
        { word: "territorial claim", definition: "assertion of ownership or control over a geographic area" },
        { word: "imperial competition", definition: "rivalry between empires seeking to expand their power and territory" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why do you think Mackenzie chose to write 'from Canada by land' rather than just his name?",
        "What would the Nuxalk people have thought when they saw Mackenzie write on the rock?",
        "How did this journey change the history of western Canada and British Columbia?",
        "If Indigenous peoples already knew these routes, what does it mean to call Mackenzie's journey a 'discovery'?",
        "Why is this rock inscription now considered a National Historic Site? What does it symbolize?"
      ]),
      explorerId: alexanderMackenzie?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "4-6",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 2: Mackenzie's Rocky Mountain Crossing ====================
  const mackenzieRockyMountains = await prisma.primarySourceDocument.create({
    data: {
      title: "Alexander Mackenzie Crossing the Rocky Mountains, June 1793",
      documentType: "journal",
      author: "Alexander Mackenzie",
      originalDate: "June 12, 1793",
      originalYear: 1793,
      originalText: "The navigation of this river is absolutely impracticable, even for canoes, in its present state. We continued our toilsome progress, over-laden, as many of us were, with two bags apiece. This work was so toilsome that a third of our number were left behind, and we did not expect they could join us before morning. The men were in a state of discontent which approached to mutiny, and I could not but acknowledge that their fatigue was excessive.",
      transcription: "The navigation of this river is absolutely impracticable, even for canoes, in its present state. We continued our toilsome progress, overloaded as many of us were with two bags apiece. This work was so difficult that a third of our crew were left behind, and we did not expect they could join us before morning. The men were in a state of discontent which approached mutiny, and I could not help but acknowledge that their fatigue was excessive.",
      historicalContext: "This journal entry describes one of the most challenging moments of Mackenzie's 1793 journey to the Pacific. After following what he thought would be a navigable river westward (the Parsnip River), Mackenzie and his party discovered they had mistakenly descended the Fraser River canyon - a tumultuous waterway with impossible rapids and waterfalls. Realizing the Fraser was impassable, they were forced to backtrack and find an overland route through the mountains. This involved carrying all their supplies and equipment over steep mountain passes. The 'two bags apiece' likely weighed 80-90 pounds each, and the men had already been traveling for months. Mackenzie's mention of near-mutiny shows how close the expedition came to failure. Only by finding Indigenous Carrier people who showed them an overland 'grease trail' (a traditional trading route) did the expedition succeed. This moment illustrates the razor-thin margin between success and disaster in exploration, and the crucial importance of Indigenous guidance.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Mackenzie and his men were in serious trouble. The river they were following turned out to have huge waterfalls and dangerous rapids - impossible to paddle through! They had to turn around and carry everything over the mountains instead. Each man carried two heavy bags (imagine two huge backpacks at once!). The crew was so tired and frustrated they almost gave up. Luckily, Indigenous Carrier people they met showed them a trail over the mountains. Without that help, Mackenzie would never have made it to the Pacific Ocean."
        },
        {
          gradeLevel: "7-9",
          annotation: "This passage reveals the desperate conditions explorers sometimes faced. Mackenzie had made a critical navigation error - he'd turned down the Fraser River thinking it would lead to the Pacific, but the Fraser canyon was impassable with vertical cliffs and churning rapids. Backtracking meant weeks of lost time and exhausted supplies. The threat of mutiny was real - voyageurs had contracts and could refuse dangerous conditions. Mackenzie's success came only because Carrier (Dakelh) peoples showed them the 'grease trail,' an ancient Indigenous trade route between the interior and coast. This trail, used for trading eulachon oil ('grease'), allowed them to cross the mountains. This episode perfectly illustrates how European 'success' depended on Indigenous knowledge and generosity."
        },
        {
          gradeLevel: "10-12",
          annotation: "Mackenzie's near-mutiny reflects the complex labor dynamics of fur trade exploration. Voyageurs, though contracted, retained agency to resist truly impossible conditions. The excessive loads (likely 160-180 pounds per person over mountain terrain) violated normal voyageur work expectations. Mackenzie's acknowledgment of their legitimate grievances shows he understood the limits of his authority. The resolution came through Indigenous intervention - Carrier guides who shared knowledge of the 'grease trails,' traditional trade routes connecting interior Athapaskan peoples with coastal groups. These trails represented sophisticated Indigenous trade networks that predated European contact by centuries. Mackenzie's 'discovery' of the overland route was actually incorporation into existing Indigenous geographic knowledge and transportation infrastructure. This passage also illustrates environmental determinism in exploration - success depended not just on European will or technology but on learning to navigate within Indigenous geographic frameworks."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "impracticable", definition: "impossible to do or use" },
        { word: "toilsome", definition: "involving hard, exhausting work" },
        { word: "mutiny", definition: "rebellion against authority, especially by crew members against their leader" },
        { word: "grease trail", definition: "Indigenous trade routes in British Columbia used to transport eulachon oil" },
        { word: "Carrier", definition: "Indigenous nation of central British Columbia, also known as Dakelh" },
        { word: "eulachon", definition: "a small oily fish, also called candlefish or ooligan" },
        { word: "voyageur", definition: "French-Canadian canoe paddlers who transported furs and trade goods" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why were Mackenzie's men near mutiny? Would you have continued or turned back?",
        "What does this passage tell us about the physical challenges of exploration?",
        "How did the 'grease trails' show Indigenous peoples' sophisticated knowledge of the landscape?",
        "If Mackenzie had not met the Carrier people, what might have happened to his expedition?",
        "Compare this experience to modern wilderness travel. What advantages and disadvantages did Mackenzie face?"
      ]),
      explorerId: alexanderMackenzie?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 3: Peter Fidler & Saukamappee ====================
  const fidlerSaukamappee = await prisma.primarySourceDocument.create({
    data: {
      title: "Peter Fidler Recording Saukamappee's Oral Histories, Winter 1792-1793",
      documentType: "journal",
      author: "Peter Fidler (recording Saukamappee's account)",
      originalDate: "December 1792 - February 1793",
      originalYear: 1792,
      originalText: "Saukamappee, an aged Indian of the Piegon [Piegan/Piikani] tribe, gave me the following account: In his young days, the Nahathaway [Cree] came to their lands to make peace and hunt buffalo together. The Nahathaway had iron weapons and some guns from the Bay men. The Snake [Shoshone] Indians to the south had horses, but we had never seen these wonderful animals. When the Snake rode down upon us on these great creatures, we fled in terror, for we thought the horse and rider were one being. But the Nahathaway with their guns stood and fought. The sound of the gun and the death it brought from afar amazed both us and our enemies. After many battles, we drove the Snake people south and took their horses for ourselves. Then we became the strongest people of the plains.",
      transcription: "Saukamappee, an aged Piikani (Peigan) elder, gave me the following account: In his young days, the Cree came to their lands to make peace and hunt buffalo together. The Cree had iron weapons and some guns from the Hudson's Bay Company traders. The Shoshone Indians to the south had horses, but the Piikani had never seen these wonderful animals. When the Shoshone rode down upon them on these great creatures, they fled in terror, thinking the horse and rider were one being. But the Cree with their guns stood and fought. The sound of the gun and the death it brought from a distance amazed both the Piikani and their enemies. After many battles, they drove the Shoshone people south and took their horses for themselves. Then the Piikani became the strongest people of the plains.",
      historicalContext: "Peter Fidler (1769-1822) was a surveyor and trader for the Hudson's Bay Company who spent the winter of 1792-1793 at a Piikani camp in what is now southern Alberta. There, he met Saukamappee (also spelled Saukamappee or Saukamappé, meaning 'Young Man'), an elderly Cree man who had married into the Piikani nation decades earlier. Saukamappee shared detailed oral histories of Plains life before European contact, including the transformative arrival of horses (from Spanish colonies to the south, spreading north through Indigenous trade networks) and guns (from European traders to the east). These accounts, carefully recorded by Fidler, are among the most important primary sources about pre-contact and early contact Plains Indigenous history. Saukamappee described a world in transformation: the Piikani and their Blackfoot allies were simultaneously adopting two revolutionary technologies (horses and guns) that would fundamentally change Plains warfare, hunting, and culture. His accounts provide an Indigenous perspective on these changes, showing how Plains peoples actively adapted to and shaped this technological revolution rather than passively receiving it.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Saukamappee was an old Cree man who had lived with the Piikani (Peigan) people for many years. He told Peter Fidler stories about life long ago, when his people first saw horses and guns. Imagine seeing a horse for the first time and thinking the rider and horse were one creature - like a centaur from mythology! The horses came from the south (originally from Spanish colonies in Mexico) and guns came from the east (from Hudson's Bay Company traders). These two new technologies changed everything about how Plains peoples hunted buffalo and fought their enemies. Saukamappee's stories are incredibly valuable because they tell us about this time from an Indigenous person's perspective, not just from European traders' viewpoints."
        },
        {
          gradeLevel: "7-9",
          annotation: "This document is historically precious because Indigenous oral histories were rarely written down by European traders. Fidler, unusually for his time, recognized the value of Saukamappee's knowledge and recorded it carefully. The account describes a crucial transition period on the Plains (roughly 1730s-1750s). Horses reached the northern Plains through Indigenous trade networks after Spanish introduction in the southwest. Guns arrived via different trade networks from Hudson's Bay Company and French traders to the east. Saukamappee describes how the combination of Cree guns and eventual Piikani adoption of both horses and guns shifted power dynamics on the Plains. The Piikani and their Blackfoot allies became dominant, pushing Shoshone enemies south and controlling vast hunting territories. Notice how Saukamappee portrays Indigenous peoples as active agents adapting strategically to new technologies, forming alliances (Cree-Piikani), and reshaping their world - not passive recipients of European goods."
        },
        {
          gradeLevel: "10-12",
          annotation: "Saukamappee's account, as recorded by Fidler, provides invaluable Indigenous perspective on the technological and cultural transformations of the 18th-century Plains. This narrative challenges Eurocentric frameworks that position Indigenous peoples as passive objects of history. Instead, Saukamappee describes Indigenous agency: strategic alliances between Cree and Piikani peoples, tactical adaptation of new technologies, and active reshaping of Plains geopolitics. The account also reveals complex inter-Indigenous relationships that predate and shape European-Indigenous interactions. The Piikani weren't simply 'trading with Europeans' but participating in vast Indigenous trade networks stretching from Hudson Bay to Spanish New Mexico. Methodologically, this document raises questions about the relationship between oral tradition and written history. Fidler's transcription filters Saukamappee's account through translation (likely Cree or Blackfoot to Cree trade language to English), European narrative conventions, and a fur trader's interests. Yet even filtered, the Indigenous voice comes through. Historians increasingly use documents like this to reconstruct Indigenous perspectives and agency in the contact era, recognizing both their value and their limitations as sources."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Piikani", definition: "one of the three nations of the Blackfoot Confederacy, also spelled Peigan" },
        { word: "Saukamappee", definition: "Cree name meaning 'Young Man'; the name of the elder who shared these histories" },
        { word: "Nahathaway", definition: "Cree name for themselves; also spelled Nehiyawak" },
        { word: "Shoshone", definition: "Indigenous people of the Great Basin and northern Plains; called 'Snake' by some other nations" },
        { word: "oral history", definition: "historical information transmitted through spoken accounts rather than written documents" },
        { word: "trade networks", definition: "systems of exchange connecting different peoples and regions" },
        { word: "geopolitics", definition: "politics influenced by geographic factors and relationships between nations/peoples" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why is Saukamappee's account so valuable to historians studying Plains Indigenous history?",
        "How did horses and guns change life for Plains Indigenous peoples? Consider hunting, warfare, and culture.",
        "Why might Saukamappee have been willing to share these stories with Peter Fidler?",
        "What can we learn from Saukamappee's account that we couldn't learn from European traders' journals?",
        "How do oral histories like this challenge the idea that Indigenous peoples were 'unchanged' before European contact?"
      ]),
      explorerId: null,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 4: James Knight on Thanadelthur ====================
  const knightThanadelthur = await prisma.primarySourceDocument.create({
    data: {
      title: "James Knight on Thanadelthur, York Factory, 1715",
      documentType: "journal",
      author: "James Knight, Chief Factor",
      originalDate: "June 1715",
      originalYear: 1715,
      originalText: "This slave woman has conducted herself with such courage, resolution, and extraordinary fortitude that she has gained the admiration of all. She has undertaken to make peace between the Chipewyan and the Cree, two Nations at deadly enmity. When the parties met in suspicion and anger, she went boldly between them, haranguing them for hours until both sides agreed to peace. She is the chief promoter and actress in this reconciliation. I never saw a more clear-headed person than this woman. Should she succeed in bringing the Chipewyan to trade at York Factory, it will prove the foundation of much profit to the Company.",
      transcription: "This woman has conducted herself with such courage, resolution, and extraordinary fortitude that she has gained the admiration of all. She has undertaken to make peace between the Chipewyan and the Cree, two Nations at deadly enmity. When the parties met in suspicion and anger, she went boldly between them, speaking to them for hours until both sides agreed to peace. She is the chief promoter and active force in this reconciliation. I never saw a more clear-headed person than this woman. Should she succeed in bringing the Chipewyan to trade at York Factory, it will prove the foundation of much profit to the Company.",
      historicalContext: "Thanadelthur (c. 1697-1717) was a Chipewyan (Dene) woman who became one of the most important figures in early Hudson's Bay Company history, though she lived only about 20 years. Captured by Cree enemies as a young woman, she escaped and made her way to York Factory in 1713, nearly dead from starvation. Chief Factor James Knight recognized her intelligence and potential as a diplomat. The Cree and Chipewyan had been at war for generations, preventing the Chipewyan from safely traveling to Hudson Bay to trade. In 1715, Thanadelthur guided an HBC expedition of 150 Cree and Company men into Chipewyan territory to negotiate peace. When the initial meeting went badly - suspicion and old hatreds nearly erupted into violence - Thanadelthur stepped between the hostile groups and, according to Knight, spoke 'almost night and day' for hours, appealing to both sides to end the bloodshed. Her diplomatic success opened the rich Chipewyan fur territory to HBC trade. Knight wrote admiringly of her 'Devil of a spirit' and diplomatic genius. Tragically, Thanadelthur died of illness in 1717 at York Factory, only about 20 years old. Knight mourned her death, writing that he had lost his 'best and most faithful interpreter' and the person most essential to maintaining peace. Thanadelthur exemplifies the crucial role Indigenous women played as cultural brokers, diplomats, and economic agents in the fur trade.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Thanadelthur was an amazing woman who made peace between two enemy nations - the Cree and the Chipewyan. She had been captured by Cree people when she was young but escaped and walked to York Factory, nearly starving. James Knight, who was in charge of York Factory, saw how smart and brave she was. When Cree and Chipewyan people met to make peace, they were very angry and suspicious of each other. Thanadelthur stood between them and talked for hours until they agreed to stop fighting. Thanks to her, the Chipewyan could safely come to trade at York Factory. James Knight wrote that she was the smartest person he'd ever met. Sadly, she died of sickness when she was only about 20 years old."
        },
        {
          gradeLevel: "7-9",
          annotation: "This journal entry by James Knight shows how Indigenous women sometimes played crucial diplomatic roles in the fur trade. Thanadelthur wasn't just a translator - she was a skilled diplomat who understood both Cree and Chipewyan cultures and could bridge the deep enmity between them. The Cree-Chipewyan conflict had prevented Chipewyan access to European trade goods for generations. By brokering peace, Thanadelthur opened vast northern territories to HBC trade. Notice Knight's admiring language - 'courage,' 'resolution,' 'clear-headed' - unusual for European men of his era discussing an Indigenous woman. Yet his final sentence reveals that ultimately, he valued her success because it would bring 'much profit to the Company.' Thanadelthur's story shows both Indigenous women's agency and influence AND the economic motivations underlying fur trade relationships. She used the fur trade system to benefit her people (access to trade goods, peace with Cree) while the HBC used her diplomatic skills for profit."
        },
        {
          gradeLevel: "10-12",
          annotation: "Thanadelthur's story, as recorded by James Knight, provides insight into Indigenous women's agency as cultural brokers and political actors in the fur trade era. Her position was complex: captured by enemies, yet she transformed her marginality into diplomatic power. As someone who knew both Cree and Chipewyan languages and customs, she possessed unique cultural capital. Knight's account, while filtered through paternalistic European attitudes ('this slave woman'), nonetheless reveals his genuine respect for her abilities - he consistently credits her with the peace agreement's success, not HBC personnel. Critically, we should recognize that Knight's account is the only written record; we lack Thanadelthur's own voice describing her motivations. Was she primarily serving Chipewyan interests (gaining access to trade goods and European technology)? HBC interests (opening new trade territories)? Her own interests (gaining status and security after captivity)? Likely all three. Thanadelthur navigated multiple layers of power relations - gender, colonialism, inter-Indigenous conflict, and European economic imperialism - to create an outcome that served her people while also serving HBC goals. Her story exemplifies how some Indigenous women found and exercised agency even within oppressive structures. Knight's mourning of her death ('my best and most faithful interpreter') shows her irreplaceability - her unique cultural knowledge and diplomatic skill couldn't be replicated."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Thanadelthur", definition: "Chipewyan woman and diplomat who brokered peace between Cree and Chipewyan peoples in 1715" },
        { word: "Chipewyan", definition: "a Dene Indigenous nation of northern Canada, also called Dënesųłiné" },
        { word: "fortitude", definition: "courage and strength in facing difficulty or pain" },
        { word: "haranguing", definition: "speaking to someone at length in an earnest or forceful way" },
        { word: "enmity", definition: "the state of being actively opposed or hostile to someone" },
        { word: "cultural broker", definition: "a person who facilitates communication and understanding between different cultures" },
        { word: "Chief Factor", definition: "the senior Hudson's Bay Company official in charge of a major trading post" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why was making peace between the Cree and Chipewyan so important for the fur trade?",
        "What qualities did Thanadelthur possess that made her such an effective diplomat?",
        "How does James Knight's description of Thanadelthur challenge stereotypes about Indigenous women?",
        "Why do you think Thanadelthur was willing to help the Hudson's Bay Company?",
        "What might have happened to Chipewyan-Cree relations if Thanadelthur had not succeeded in making peace?",
        "How does the fact that we only know about Thanadelthur through European men's writing affect our understanding of her story?"
      ]),
      explorerId: null,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 5: David Thompson on Charlotte Small ====================
  const thompsonCharlotteSmall = await prisma.primarySourceDocument.create({
    data: {
      title: "David Thompson's References to Charlotte Small, 1799-1811",
      documentType: "journal",
      author: "David Thompson",
      originalDate: "Various entries, 1799-1811",
      originalYear: 1799,
      originalText: "My wife and three children accompanied me on this survey. Charlotte's skill with languages proved invaluable in speaking with the Kootenay peoples. At the difficult crossing of the Athabasca Pass, she managed the horses and supplies while I took observations. I am most fortunate in my partner, who bears hardship without complaint and maintains our children's welfare in the most trying circumstances. Her understanding of native customs has prevented misunderstandings that might have proved fatal.",
      transcription: "My wife and three children accompanied me on this survey. Charlotte's skill with languages proved invaluable in speaking with the Kootenay peoples. At the difficult crossing of the Athabasca Pass, she managed the horses and supplies while I took observations. I am most fortunate in my partner, who bears hardship without complaint and maintains our children's welfare in the most trying circumstances. Her understanding of Indigenous customs has prevented misunderstandings that might have proved fatal.",
      historicalContext: "Charlotte Small (c. 1785-1857) was the daughter of Patrick Small, a North West Company fur trader, and a Cree woman. She married David Thompson at age 13 (not uncommon for the era) at Île-à-la-Crosse in 1799. Unlike many fur traders who abandoned their Indigenous or Métis wives when returning to 'civilization,' Thompson remained devoted to Charlotte throughout his life. She accompanied him on many of his most difficult expeditions, including the historic crossing of the Athabasca Pass and the descent of the Columbia River. Together they had 13 children, several of whom were born during expeditions. Thompson's journals rarely mention Charlotte directly (typical of the era's writing conventions where wives were often invisible in men's accounts), but the references he does make reveal her essential contributions: language skills, cultural mediation with Indigenous peoples, managing supplies and logistics, and caring for children under extreme wilderness conditions. Charlotte's Indigenous heritage and cultural knowledge were crucial to Thompson's success as a surveyor and explorer. She facilitated relationships with numerous Indigenous nations across western Canada. After Thompson's career ended, they lived in relative poverty in Montreal - Thompson's surveys earned him little money, and he died without recognition. Charlotte outlived him by 10 years. Modern historians increasingly recognize women like Charlotte Small as essential but largely invisible partners in exploration and the fur trade.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "David Thompson is famous for making maps of western Canada, but he couldn't have done it without his wife Charlotte Small. Charlotte was Métis (part Cree, part Scottish). She traveled with Thompson on his most dangerous expeditions, even with their young children! She spoke multiple Indigenous languages and helped Thompson talk with different peoples along the way. She also managed supplies, handled horses, and took care of their children - all while Thompson was busy measuring angles for his maps. Thompson wrote that Charlotte's 'understanding of native customs' prevented problems that 'might have proved fatal' - that means her knowledge saved their lives! Even though Charlotte was essential to Thompson's success, history books often forgot about her because she was a woman and because she was Indigenous. Today, we're learning to remember and honor the contributions of women like Charlotte Small."
        },
        {
          gradeLevel: "7-9",
          annotation: "Charlotte Small's story illustrates the crucial but often unrecognized role of Indigenous and Métis women in Canadian exploration. As Thompson's wife and partner, she provided essential services: translation (she spoke Cree, likely Ojibwe, and possibly other languages), cultural mediation (helping Thompson understand and navigate Indigenous protocols), practical wilderness skills, and childcare under extreme conditions. Thompson's expeditions covered some of the most difficult terrain in North America - mountain passes, wild rivers, harsh winters. Charlotte managed all this while pregnant or with small children. Thompson's rare mentions of Charlotte in his journals suggest deep respect ('most fortunate in my partner'), but his silence about her contributions in most entries reflects how women's work was rendered invisible in historical records. Unlike many fur traders who practiced 'à la façon du pays' (country marriage) only while in the fur trade, Thompson remained married to Charlotte for 57 years until his death, even when this subjected him to social prejudice in Montreal. This loyalty was unusual for his time. Charlotte's Indigenous knowledge and family connections were essential to Thompson's success mapping 3.9 million square kilometers of western North America, yet he received all the credit. Her story challenges us to ask: whose contributions are remembered in history, and whose are forgotten?"
        },
        {
          gradeLevel: "10-12",
          annotation: "Charlotte Small Thompson exemplifies the complex intersections of gender, race, and colonialism in fur trade history. Her position as a Métis woman married to a prominent European surveyor placed her at the nexus of multiple worlds. Thompson's journals, while filtered through 19th-century patriarchal conventions that minimized women's agency, nonetheless reveal Charlotte's indispensable contributions: linguistic expertise (providing access to Indigenous communities), cultural brokerage (navigating Indigenous-European protocol), logistical management, and emotional labor (maintaining family cohesion under extreme stress). Historians debate whether Thompson's silence about Charlotte represents deliberate erasure or simply reflected literary conventions where family members weren't mentioned unless necessary to the narrative. Either way, the effect is the same: Charlotte's contributions were rendered invisible in the historical record. We must read Thompson's journals 'against the grain' to recover Charlotte's story. The phrase 'prevented misunderstandings that might have proved fatal' is particularly revealing - it suggests Charlotte saved the expedition from violent conflict through her diplomatic and cultural skills, yet Thompson provides no details. This silence exemplifies how women's essential labor - especially Indigenous women's labor - has been systematically devalued in colonial narratives. Charlotte's later life in Montreal reveals the harsh economic realities behind exploration glory - Thompson died in poverty and Charlotte lived her final years in difficult circumstances, despite Thompson's massive contributions to geographical knowledge. Her story raises questions about who benefits from colonial knowledge production and whose labor is exploited and forgotten in the process."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Charlotte Small", definition: "Métis woman (1785-1857), wife and partner of David Thompson" },
        { word: "Métis", definition: "people of mixed European and Indigenous ancestry, forming a distinct culture" },
        { word: "Athabasca Pass", definition: "mountain pass through the Rockies, discovered by Thompson in 1811" },
        { word: "Kootenay", definition: "Indigenous peoples of southeastern British Columbia and adjacent areas" },
        { word: "cultural mediation", definition: "facilitating understanding and communication between different cultures" },
        { word: "à la façon du pays", definition: "French for 'according to the custom of the country'; fur trade term for Indigenous-style marriage" },
        { word: "erasure", definition: "removal from history or memory; making invisible or forgotten" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why do you think Thompson's journals rarely mention Charlotte, even though she was essential to his expeditions?",
        "What specific skills and knowledge did Charlotte bring to Thompson's surveying expeditions?",
        "How was Charlotte's life different from the lives of European women of her time? How was it similar?",
        "Why is it important to recover and tell stories like Charlotte's that were left out of history books?",
        "How does Charlotte's story change our understanding of David Thompson's achievements?",
        "What does Charlotte's later poverty reveal about who benefited financially from exploration and the fur trade?"
      ]),
      explorerId: davidThompson?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 6: Samuel Hearne on Matonabbee ====================
  const hearnematonabbee = await prisma.primarySourceDocument.create({
    data: {
      title: "Samuel Hearne on Matonabbee's Leadership, 1770-1772",
      documentType: "journal",
      author: "Samuel Hearne",
      originalDate: "December 1770",
      originalYear: 1770,
      originalText: "I was now convinced that Matonabbee was right when he told me that I should never reach my destination with only a party of men. Women, said he, were made for labour; one of them can carry or haul as much as two men can do. They pitch our tents, make and mend our clothing, keep us warm at night; and in fact, there is no such thing as traveling any considerable distance in this country without their assistance. Matonabbee himself had seven wives, all of whom performed their share of the work. Under his direction, with proper supplies of women to make snowshoes, clothing and to carry baggage, I succeeded in reaching the Copper-mine River and the sea beyond.",
      transcription: "I was now convinced that Matonabbee was right when he told me that I should never reach my destination with only a party of men. Women, said he, were made for labor; one of them can carry or haul as much as two men can do. They pitch our tents, make and mend our clothing, keep us warm at night; and in fact, there is no such thing as traveling any considerable distance in this country without their assistance. Matonabbee himself had seven wives, all of whom performed their share of the work. Under his direction, with proper supplies of women to make snowshoes and clothing and to carry baggage, I succeeded in reaching the Coppermine River and the sea beyond.",
      historicalContext: "Samuel Hearne's journey to the Arctic Ocean (1770-1772) famously failed twice before succeeding on the third attempt. The difference? Matonabbee, a Chipewyan Dene leader and diplomat who became Hearne's guide for the successful expedition. Matonabbee bluntly told Hearne that his first two expeditions failed because they consisted only of men. In Dene culture, long-distance travel and hunting expeditions required women's labor to be successful. Women processed game into pemmican and dried meat for travel rations, made and repaired moccasins and clothing essential in harsh conditions, made snowshoes, hauled supplies, set up and broke down camps, tanned hides, and provided many other essential services. Hearne's quote reflects both recognition of Indigenous women's essential labor AND the patriarchal and racist attitudes of his era (note the phrase 'women were made for labour'). Matonabbee's 'seven wives' was not unusual in Chipewyan society where polygyny existed, particularly for leaders who could support multiple families. These marriages also represented diplomatic alliances with different family groups. Modern Indigenous scholars and historians criticize Hearne's framing while acknowledging the historical importance of the passage - it's one of the few contemporary European accounts explicitly recognizing Indigenous women's essential contributions to survival and travel in the North. Matonabbee's leadership, diplomatic skills, and knowledge made Hearne's success possible. Tragically, Matonabbee died by suicide in 1782 after the French destroyed Prince of Wales Fort, believing his world had ended.",
      annotations: JSON.stringify([
        {
          gradeLevel: "7-9",
          annotation: "Samuel Hearne tried twice to reach the Arctic Ocean and failed both times. Then he met Matonabbee, a Chipewyan leader, who told him the problem: Hearne had only men in his expedition. In Chipewyan culture, women were essential for long journeys because they did crucial work - making snowshoes, sewing and repairing clothing (which wore out quickly), processing food, setting up camps, and carrying supplies. Hearne's quote sounds offensive today because he says 'women were made for labour,' but remember this was written in 1770 when European and Indigenous societies both had very different views of women's roles than we do today. The important historical point is that Matonabbee understood something Hearne didn't: successful Arctic travel required women's skills and labor. With Matonabbee as guide and Dene women doing essential work, Hearne finally succeeded in reaching the Arctic Ocean. This shows how European 'explorers' actually depended completely on Indigenous knowledge, leadership, and labor - both men's and women's."
        },
        {
          gradeLevel: "10-12",
          annotation: "This passage is historically significant but requires critical analysis. Hearne's account recognizes Indigenous women's essential labor in Arctic travel - women made snowshoes, processed game, manufactured and repaired clothing, managed camp logistics, and hauled supplies. Their work made survival possible in harsh conditions where equipment failure meant death. However, Hearne's framing ('women were made for labour') reflects European patriarchal attitudes and commodifies Indigenous women's work. He portrays women as beasts of burden rather than skilled workers performing specialized labor. Matonabbee's statement that 'one woman can carry as much as two men' was likely comparative rhetoric to convince Hearne, not literal fact. Modern Indigenous scholars emphasize several points: First, while Dene society had gendered divisions of labor, women's work was valued as essential, not denigrated. Second, Matonabbee's 'seven wives' represented complex kinship and political alliances, not simple polygyny. Third, Indigenous women weren't passive laborers but active decision-makers in expedition planning and execution. Fourth, their knowledge - of plants, sewing techniques, food preservation - was sophisticated expertise. This passage thus reveals both the historical reality of Indigenous women's essential contributions to exploration AND the colonial lens that distorted European understanding of Indigenous gender relations and labor. Reading this passage critically means recognizing what Hearne got right (women's labor was essential) while rejecting his patriarchal framing."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Matonabbee", definition: "Chipewyan Dene leader and diplomat (c. 1737-1782) who guided Samuel Hearne" },
        { word: "Coppermine River", definition: "river in the Northwest Territories flowing to the Arctic Ocean" },
        { word: "polygyny", definition: "marriage system where a man has multiple wives" },
        { word: "pemmican", definition: "dried meat mixed with fat and berries, used as concentrated travel food" },
        { word: "commodification", definition: "treating something (or someone) as a commodity or object rather than recognizing their full humanity" },
        { word: "gendered division of labor", definition: "system where different tasks are assigned based on gender" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why did Hearne's first two expeditions fail while the third succeeded?",
        "What specific skills and knowledge did Indigenous women contribute to Arctic travel?",
        "How does Hearne's way of describing women's work reflect his own cultural biases?",
        "Why is it problematic to say 'women were made for labour' even if women's work was essential?",
        "How might Indigenous women have described their own roles differently than Hearne describes them?",
        "What does this passage teach us about reading historical documents critically?"
      ]),
      explorerId: samuelHearne?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 7: Simon Fraser on the Fraser River ====================
  const fraserRiverJournal = await prisma.primarySourceDocument.create({
    data: {
      title: "Simon Fraser Navigating the Fraser River Canyon, June 1808",
      documentType: "journal",
      author: "Simon Fraser",
      originalDate: "June 10, 1808",
      originalYear: 1808,
      originalText: "This morning we proceeded onwards. The rapids were extremely dangerous and the natives urged us not to continue by water but to follow the trail over the mountain. However, we embarked. I have been for a long period in the Rocky Mountains, but have never seen anything like this country. We had to pass where no human being should venture. Yet in those places there is a regular footpath impressed upon the very rocks by frequent traveling over them. Besides this, steps are formed like a ladder by poles hanging to one another and crossed by pieces of timber. At one spot we were obliged to slide down a rock that was almost perpendicular, holding a small cord fastened above. The situation is dangerous in the extreme.",
      transcription: "This morning we proceeded onwards. The rapids were extremely dangerous and the Indigenous peoples urged us not to continue by water but to follow the trail over the mountain. However, we embarked. I have been for a long period in the Rocky Mountains, but have never seen anything like this country. We had to pass where no human being should venture. Yet in those places there is a regular footpath impressed upon the very rocks by frequent traveling. Besides this, steps are formed like a ladder by poles hanging to one another and crossed by pieces of timber. At one spot we were obliged to slide down a rock that was almost perpendicular, holding a small cord fastened above. The situation is dangerous in the extreme.",
      historicalContext: "Simon Fraser's 1808 descent of the river that now bears his name was one of the most harrowing expeditions in Canadian history. Fraser, a North West Company trader, believed he was following the Columbia River to the Pacific (as Alexander Mackenzie had attempted). In reality, the Fraser River canyon is one of the most dangerous waterways in North America - a churning torrent through steep rock walls where water crashes over boulders at tremendous speed. Fraser's party faced impossible rapids and waterfalls. Local Nlaka'pamux (Thompson) and other Salish peoples repeatedly warned them not to continue by water and showed them overland trails. The 'footpaths impressed upon the rocks' and 'steps formed like ladders' Fraser describes were sophisticated Indigenous trail systems engineered over generations. These trails allowed safe travel through impassable terrain. Fraser's amazement that 'human beings' had created such trails in 'impossible' locations reflects his failure to comprehend the sophisticated engineering and geographic knowledge of the Indigenous peoples whose lands he traveled through. Despite the warnings, Fraser stubbornly continued by water for as long as possible, nearly losing his entire party multiple times. Eventually forced to use the Indigenous trails, the expedition reached the Pacific at present-day Vancouver but had to admit they'd followed the wrong river - this wasn't the Columbia. Fraser's expedition established North West Company presence on the Pacific coast but at tremendous risk. His journals reveal both the dangers of the terrain and, inadvertently, the sophisticated knowledge and engineering of the Indigenous peoples who safely traversed this 'impossible' landscape for millennia.",
      annotations: JSON.stringify([
        {
          gradeLevel: "4-6",
          annotation: "Simon Fraser thought he was following the Columbia River to the Pacific Ocean, but he'd actually turned onto a different river (now called the Fraser River). The Fraser River canyon is incredibly dangerous - huge rapids, waterfalls, and steep rock walls. Indigenous peoples who lived there warned Fraser not to try going by canoe and showed him safe trails over the mountains. Fraser was amazed to find trails and even ladders built into the cliffs in places where he thought 'no human being should venture.' He didn't realize that Indigenous peoples had been safely traveling through this 'impossible' country for thousands of years! They had built sophisticated trail systems with wooden ladders, handholds, and carefully placed steps. Eventually Fraser had to give up on the river and use the Indigenous trails. His expedition survived, but he had to admit he'd followed the wrong river. The Indigenous peoples could have told him that from the beginning!"
        },
        {
          gradeLevel: "7-9",
          annotation: "Fraser's journal reveals both his courage and his cultural blindness. He was brave enough to attempt incredibly dangerous rapids, but too stubborn to listen when Indigenous peoples warned him the route was impassable. His description of the Indigenous trail system is fascinating - 'footpaths impressed upon the rocks,' 'steps like a ladder,' 'poles hanging to one another.' These weren't simple trails but sophisticated engineering projects created over generations. The Nlaka'pamux and other Salish peoples had developed complex knowledge of how to safely traverse this challenging landscape. Fraser's amazement that such trails existed 'where no human being should venture' shows he didn't initially recognize them as human-made infrastructure - he thought the landscape was impassable because HE found it impassable. This reflects a common colonial mindset: dismissing Indigenous knowledge and engineering, then being surprised when Indigenous peoples had already solved problems Europeans couldn't. Fraser's expedition succeeded only by eventually following Indigenous guidance. His naming of the river (Fraser River, after himself) is ironic - Indigenous peoples had names for this river for thousands of years, and they knew far more about it than Fraser ever would."
        },
        {
          gradeLevel: "10-12",
          annotation: "Fraser's journal entry exemplifies colonial epistemology - the tendency to dismiss or fail to recognize Indigenous knowledge and engineering. His phrase 'where no human being should venture' reveals his inability to comprehend that Indigenous peoples had not only ventured there but had created sophisticated infrastructure for regular, safe passage. The trail system Fraser describes - carved footpaths, engineered wooden ladder systems, and secured handholds - represents multi-generational Indigenous engineering knowledge. These weren't crude paths but carefully designed transportation infrastructure maintained over centuries. Fraser's amazement exposes his assumption that 'human achievement' meant European achievement. Modern archaeology and Indigenous oral histories confirm that the Fraser Canyon was a major trade corridor with complex trail networks connecting interior Salish and Athapaskan peoples with coastal nations. The trails facilitated trade in eulachon oil, dried salmon, cedar products, obsidian, and other goods. Fraser's stubborn persistence in attempting river travel despite Indigenous warnings nearly proved fatal multiple times. This reflects both individual stubbornness and broader colonial attitudes that devalued Indigenous expertise. Methodologically, reading Fraser's journal 'against the grain' allows us to recover Indigenous presence and knowledge that Fraser himself failed to fully comprehend. His descriptions of trail infrastructure, despite his framing, provide historical evidence of sophisticated Indigenous engineering. The modern name 'Fraser River' represents colonial naming practices that erased Indigenous toponymy - the river was known by various Salish names long before Fraser arrived."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Nlaka'pamux", definition: "Indigenous people of the Fraser Canyon region, also called Thompson peoples" },
        { word: "embarked", definition: "boarded a boat or began a journey" },
        { word: "perpendicular", definition: "at a vertical angle; straight up and down" },
        { word: "footpath", definition: "a path worn by people walking over time" },
        { word: "eulachon", definition: "oily fish, also called candlefish, whose oil was a major trade item" },
        { word: "colonial epistemology", definition: "ways of knowing and understanding that assume European superiority and dismiss Indigenous knowledge" },
        { word: "toponymy", definition: "the study of place names" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why didn't Fraser listen when Indigenous peoples warned him the river was too dangerous?",
        "What does Fraser's description of the Indigenous trail system tell us about Indigenous engineering and knowledge?",
        "Why is the phrase 'where no human being should venture' problematic?",
        "How does this journal entry show the difference between European and Indigenous knowledge of the landscape?",
        "Should the river be renamed to an Indigenous name, or does 'Fraser River' now have its own historical significance?",
        "What would this story look like if told from a Nlaka'pamux perspective instead of Fraser's?"
      ]),
      explorerId: simonFraser?.id,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  // ==================== DOCUMENT 8: Dr. John Rae on Franklin Search ====================
  const raeArcticJournal = await prisma.primarySourceDocument.create({
    data: {
      title: "Dr. John Rae's Report on Franklin Expedition Relics, 1854",
      documentType: "report",
      author: "Dr. John Rae",
      originalDate: "October 1854",
      originalYear: 1854,
      originalText: "From the Inuit I learned that about four winters past a party of white men, amounting to about forty, were seen traveling southward near the estuary of a large river. They were dragging boats and sledges. None of them could speak the Inuit language well enough to be understood. They were very thin and appeared to be in great distress. Later that season, but previous to the breaking up of the ice, the bodies of some thirty persons were discovered on the continent, and five on an island near it. Some of the bodies had been sadly mutilated and had been used as articles of food. The Inuit had in their possession many articles which had belonged to the lost expedition.",
      transcription: "From the Inuit I learned that about four years ago, a party of white men, about forty in number, were seen traveling southward near the mouth of a large river. They were dragging boats and sledges. None of them could speak the Inuit language well enough to be understood. They were very thin and appeared to be in great distress. Later that season, but before the ice broke up, the bodies of some thirty people were discovered on the mainland, and five on an island nearby. Some of the bodies had been mutilated and had been used for food. The Inuit had in their possession many articles which had belonged to the lost expedition.",
      historicalContext: "Dr. John Rae (1813-1893) was a Scottish-born HBC surgeon and Arctic explorer renowned for his adoption of Inuit survival methods. In 1854, while surveying the Arctic coast, Rae met Inuit near Pelly Bay who told him about a party of starving white men they'd encountered years earlier. The Inuit provided detailed information about the men's condition and location, and showed Rae items including silverware marked with Franklin's officers' initials, proving these were survivors from Sir John Franklin's lost expedition of 1845. Franklin's expedition of 129 men had vanished while seeking the Northwest Passage. Rae's report, based entirely on Inuit oral testimony, provided the first concrete information about the expedition's fate and revealed that some crew members had resorted to cannibalism in their final desperate days. When Rae reported this evidence (including the cannibalism) in England, he was vilified. Victorian society, especially Lady Franklin and Charles Dickens, refused to believe British naval officers could resort to cannibalism and attacked Rae's credibility, implicitly (and sometimes explicitly) calling Inuit witnesses liars and savages. Rae was denied full recognition for solving the Franklin mystery. Tragically, Rae was proven right. Modern archaeology, including the 2014 discovery of HMS Erebus and 2016 discovery of HMS Terror, confirmed the Inuit accounts were accurate. Rae's story illustrates both the value of Indigenous knowledge and the racism that prevented Europeans from accepting Indigenous testimony as credible evidence.",
      annotations: JSON.stringify([
        {
          gradeLevel: "7-9",
          annotation: "Dr. John Rae learned about the lost Franklin Expedition not from other European explorers but from Inuit people who had encountered the survivors. The Inuit gave detailed information: they'd seen about 40 starving men dragging boats south, couldn't communicate with them, and later found bodies of men who had died. The Inuit also had items from the expedition like silverware and navigation tools. Most controversially, the Inuit told Rae that some bodies showed evidence of cannibalism - the starving survivors had eaten their dead crewmates. When Rae reported this in England, many people were outraged. Charles Dickens and Lady Franklin publicly attacked Rae, claiming the Inuit were lying and that British naval officers would never do such a thing. They implied the Inuit were 'savages' whose testimony couldn't be trusted. Rae defended the Inuit witnesses, but his career suffered. More than 150 years later, modern archaeology proved the Inuit were telling the truth - scientific analysis of bones found at the site confirmed cannibalism. The Inuit had been right all along. Rae's story shows how racism prevented Europeans from accepting Indigenous knowledge, even when Indigenous peoples had accurate, detailed information Europeans desperately needed."
        },
        {
          gradeLevel: "10-12",
          annotation: "John Rae's 1854 report represents a critical moment in Arctic exploration history and Indigenous-European relations. Rae, unusual among European explorers, respected and adopted Inuit survival methods - he traveled light, hunted for food rather than bringing massive supplies, and wore Inuit clothing. This cultural humility made him successful where heavily equipped naval expeditions failed. When Rae learned Franklin's fate from Inuit oral testimony, he trusted their account despite its disturbing implications. Rae's report triggered racist backlash in Victorian Britain that revealed the deep colonial prejudices of the era. Charles Dickens published articles in Household Words claiming Inuit were inherently dishonest 'savages' whose testimony was worthless. Lady Franklin orchestrated a campaign to discredit Rae and deny him the reward for solving the mystery. The subtext was clear: British officers couldn't possibly have resorted to cannibalism (considered the ultimate taboo), therefore the Inuit must be lying. This racist dismissal of Indigenous testimony persisted for over 150 years until modern archaeology - including cut marks on bones consistent with defleshing - confirmed the Inuit accounts' accuracy in every detail. Inuit oral history had preserved precise information for generations, but colonial racism prevented its acceptance as valid evidence. Rae's vindication came too late for him personally (he died in 1893), but his story powerfully illustrates how colonialism devalued Indigenous knowledge and how modern science is belatedly confirming what Indigenous peoples have said all along. The Franklin expedition's fate also reveals the dangers of cultural arrogance - Franklin's heavily equipped, technologically advanced expedition perished while Inuit thrived in the same environment using traditional knowledge."
        }
      ]),
      vocabulary: JSON.stringify([
        { word: "Dr. John Rae", definition: "Scottish explorer and HBC surgeon (1813-1893) who adopted Inuit survival methods" },
        { word: "Inuit", definition: "Indigenous peoples of the Arctic regions of Canada, Greenland, and Alaska" },
        { word: "estuary", definition: "the mouth of a river where it meets the sea" },
        { word: "mutilated", definition: "severely damaged or disfigured" },
        { word: "cannibalism", definition: "eating human flesh, typically done in extreme survival situations" },
        { word: "Northwest Passage", definition: "sea route through the Arctic connecting Atlantic and Pacific oceans" },
        { word: "oral testimony", definition: "evidence given through spoken accounts rather than written documents" }
      ]),
      discussionQuestions: JSON.stringify([
        "Why did Victorian British society refuse to believe the Inuit account of Franklin's fate?",
        "How did John Rae's respect for Inuit knowledge make him a more successful Arctic explorer than Franklin?",
        "What does the eventual confirmation of the Inuit account teach us about Indigenous knowledge and oral history?",
        "Why is it significant that Rae trusted Inuit testimony even when it was controversial?",
        "How does this story relate to modern debates about whose knowledge is considered valid and credible?",
        "What might have happened if Franklin had adopted Inuit survival methods like Rae did?"
      ]),
      explorerId: null,
      waterwayId: null,
      locationId: null,
      gradeLevel: "7-9",
      isPublished: true
    }
  });

  console.log("✅ Created 8 additional Primary Source Documents");

  // Count total documents
  const totalDocuments = await prisma.primarySourceDocument.count();

  console.log("\n📊 Summary:");
  console.log(`- Total Primary Source Documents in database: ${totalDocuments}`);
  console.log("\n✅ Primary source document expansion complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding primary source documents:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
