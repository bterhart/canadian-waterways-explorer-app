// Primary-source pointers for The Yukon (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-primary-sources-yukon.ts [--apply]
//
// Same rules as the earlier sets. Run after the yukon pack, which creates several of
// the names used here. Idempotent by title.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;
const JR = (vol: number) => `https://moses.creighton.edu/kripke/jesuitrelations/relations_${vol}.html`;

interface Doc {
  title: string; documentType: "journal" | "report" | "letter" | "map" | "treaty";
  author: string; originalDate: string; originalYear: number;
  whatItIs: string; whereToReadIt: string[];
  vocabulary: { word: string; definition: string }[]; discussionQuestions: string[];
  gradeLevel: "4-6" | "7-9" | "10-12"; explorer?: string; waterway?: string; location?: string;
}

const DOCS: Doc[] = [
  {
    title: "Campbell's Discovery and Exploration of the Youcon, 1840-1852", documentType: "journal", author: "Robert Campbell", originalDate: "1840-1852, written 1883, printed 1885", originalYear: 1885,
    whatItIs: "The old trader's own account, written in retirement, of his years at Dease Lake, Frances Lake and the Pelly: the walk from Frances Lake to the Pelly in 1840, the descent to the Yukon in 1843, the building of Fort Selkirk in 1848, the hunger, the Chilkat traders passing with their furs, the sack of the post in 1852 and his winter walk on snowshoes to Crow Wing, Minnesota, to report. Campbell wanted to be remembered as the discoverer of the Yukon, and the pamphlet is his case; his journals in the company's archives are the sober version.",
    whereToReadIt: [
      `The Discovery and Exploration of the Youcon (Pelly) River (Winnipeg, 1885) — ${IA("cihm_00932")}`,
      "Two Journals of Robert Campbell, Chief Factor, Hudson's Bay Company, 1808 to 1853, the journals themselves; and the Frances Lake and Fort Selkirk post journals, Hudson's Bay Company Archives, Archives of Manitoba.",
      "Kenneth S. Coates, 'Campbell, Robert', Dictionary of Canadian Biography, vol. 12 — https://www.biographi.ca/en/bio/campbell_robert_1808_94_12E.html",
    ],
    vocabulary: [{ word: "Lewes River", definition: "Campbell's name for the upper Yukon above the Pelly, used until the 1940s" }, { word: "Chilkat", definition: "The Tlingit of the Chilkat River who carried the coast trade over the passes to the Tutchone" }, { word: "Fort Selkirk", definition: "Campbell's post of 1848 at the Pelly's mouth, sacked in 1852" }],
    discussionQuestions: ["Why did the company's Yukon posts starve, by Campbell's own account?", "What did the Chilkat want, and why did they get it?", "How does a memoir written thirty years later differ from the journal written at the time?"],
    gradeLevel: "10-12", explorer: "Robert Campbell", waterway: "Pelly River", location: "Fort Selkirk",
  },
  {
    title: "Murray's Journal of the Yukon, 1847-1848", documentType: "journal", author: "Alexander Hunter Murray", originalDate: "1847-1848, published 1910", originalYear: 1847,
    whatItIs: "The daily journal of the founding of Fort Yukon: the journey from Lapierre House down the Bell and the Porcupine in June 1847, the building of the stockaded post, the first winter, the trade, and the Gwich'in of the Yukon flats, whom Murray drew as well as described, with his notes on their dress, dances and dealings and his fear that the Russians would come. Published by the Public Archives of Canada in 1910 with his sketches, it is the first record of the upper Yukon's people by a European who lived among them.",
    whereToReadIt: [
      `Journal of the Yukon, 1847-48, ed. L. J. Burpee (Publications of the Canadian Archives 4, Ottawa, 1910) — ${IA("cu31924028905400")}`,
      "Original: Hudson's Bay Company Archives, Archives of Manitoba, B.240/a/1-8 (Fort Yukon journals).",
    ],
    vocabulary: [{ word: "Kutchin", definition: "The traders' name for the Gwich'in; Murray's Yukonikhotana" }, { word: "Lapierre House", definition: "The outpost on the Bell where Murray left his wife and started for the Yukon" }, { word: "stockade", definition: "The log wall with corner bastions Murray built around the post" }],
    discussionQuestions: ["What did Murray and the company know about whose territory Fort Yukon stood in?", "What do his drawings show that his words do not?", "How did the Gwich'in use the new post, and on what terms?"],
    gradeLevel: "10-12", explorer: "Alexander Hunter Murray", waterway: "Porcupine River", location: "Lapierre House",
  },
  {
    title: "Hardisty's 'The Loucheux Indians', 1867", documentType: "report", author: "William Lucas Hardisty", originalDate: "written 1866, published 1867", originalYear: 1867,
    whatItIs: "The report on the Gwich'in that the Fort Yukon trader wrote for Robert Kennicott and the Smithsonian, printed in the Institution's annual report for 1866: their bands and country, houses, clothing, hunting and fishing, marriage, beliefs and trade, from a man who had kept the posts among them for fifteen years. One of the first ethnographies of a Yukon people, and the start of the long partnership between the company's men and the Smithsonian.",
    whereToReadIt: [
      `'The Loucheux Indians', Annual Report of the Board of Regents of the Smithsonian Institution for 1866 (Washington, 1867), 311-320 — ${IA("annual-report-board-of-regents-smithsonian_1867")}`,
      "Jennifer S. H. Brown, 'Hardisty, William Lucas', Dictionary of Canadian Biography, vol. 11 — https://www.biographi.ca/en/bio/hardisty_william_lucas_11E.html",
    ],
    vocabulary: [{ word: "Loucheux", definition: "The French traders' name for the Gwich'in, 'squinters'" }, { word: "Smithsonian", definition: "The American institution whose collectors reached the Hudson's Bay Company's posts through Kennicott" }, { word: "debt system", definition: "The company's practice of advancing goods against next year's furs, which Hardisty tried to replace with direct trade" }],
    discussionQuestions: ["What did a trader know about the Gwich'in that a passing explorer could not?", "What did Hardisty leave out, and why might he have?", "Why would Hudson's Bay Company men collect for an American museum?"],
    gradeLevel: "10-12", explorer: "William Lucas Hardisty", waterway: "Yukon River",
  },
  {
    title: "Whymper's Travel and Adventure in the Territory of Alaska, 1868", documentType: "journal", author: "Frederick Whymper", originalDate: "1865-1867, published 1868", originalYear: 1868,
    whatItIs: "The telegraph expedition's artist describes the winter at Nulato, the canoe journey up the Yukon to Fort Yukon in the spring of 1867 and the Koyukon and Gwich'in villages on the way, with his own drawings, the first published pictures of the river; four chapters cover his earlier years in British Columbia. William Dall, the expedition's scientist after Kennicott's death, wrote the companion volume, Alaska and its Resources (1870), with the first general description of the Yukon basin.",
    whereToReadIt: [
      `Travel and Adventure in the Territory of Alaska (London, 1868; New York, 1869) — ${IA("traveladventu00whym")}`,
      `William H. Dall, Alaska and its Resources (Boston, 1870) — ${IA("cihm_14842")}`,
    ],
    vocabulary: [{ word: "Russian-American Telegraph", definition: "The Western Union line through British Columbia, Alaska and Siberia, abandoned in 1867 when the Atlantic cable succeeded" }, { word: "Nulato", definition: "The Russian post on the lower Yukon where Whymper wintered and Kennicott died" }, { word: "Koyukon", definition: "The Athabaskan people of the Yukon around Nulato" }],
    discussionQuestions: ["Why was a telegraph line being built through Alaska in 1865?", "What did Whymper's drawings show his readers that no one in London had seen?", "How did the Russians, the company and the Natives share the river in 1867?"],
    gradeLevel: "7-9", explorer: "Frederick Whymper", waterway: "Yukon River",
  },
  {
    title: "Schwatka's Along Alaska's Great River, 1885", documentType: "report", author: "Frederick Schwatka", originalDate: "1883, published 1885", originalYear: 1885,
    whatItIs: "The lieutenant's popular account and his official army report of the 1883 reconnaissance: over the Chilkoot with Tlingit packers, the raft built on the lakes, Miles Canyon and the rapids, Fort Selkirk's ruins, the Hän and Tutchone camps, the traders at Fort Reliance, and the long float to the sea, with his new names for lakes and rapids and his map. The first account of the whole river read widely in the United States, and the book the first Klondikers carried.",
    whereToReadIt: [
      `Along Alaska's Great River (New York, 1885) — ${IA("alongalaskasgrea00schwuoft")}`,
      `Report of a Military Reconnaissance in Alaska, Made in 1883 (Washington, 1885) — ${IA("cihm_15995")}`,
    ],
    vocabulary: [{ word: "reconnaissance", definition: "A military survey of unknown country" }, { word: "Miles Canyon", definition: "The basalt canyon above Whitehorse that Schwatka named" }, { word: "Chilkoot packers", definition: "The Tlingit who carried the expedition's loads over the pass for pay" }],
    discussionQuestions: ["Why did the United States Army want the Yukon surveyed in 1883?", "Whose names did Schwatka replace, and did any of his stick?", "How did the Tlingit control the pass, and how did Schwatka get over it?"],
    gradeLevel: "7-9", explorer: "Frederick Schwatka", waterway: "Yukon River", location: "Miles Canyon",
  },
  {
    title: "Dawson's Report on an Exploration in the Yukon District, 1887", documentType: "report", author: "George Mercer Dawson, Geological Survey of Canada", originalDate: "1887, published 1888", originalYear: 1888,
    whatItIs: "The Geological Survey's report of the Yukon Expedition: Dawson's journey up the Stikine and the Dease to Frances Lake and down the Pelly to the Yukon, then up the river to the lakes and over the Chilkoot, with the geology, the gold-bearing gravels, the first notes on the Tutchone, Tagish and Tlingit trade, and the prediction that paying placer gold would be found in the district. Bound with it are Ogilvie's survey of the Chilkoot and the Yukon and Richard McConnell's of the Liard and Mackenzie. Dawson City was named for its author nine years later.",
    whereToReadIt: [
      `Report on an Exploration in the Yukon District, N.W.T., and Adjacent Northern Portion of British Columbia, 1887 (Geological Survey of Canada, Annual Report, vol. III, part 1; Montreal, 1888) — ${IA("cihm_14884")}`,
      "Dawson's field notebooks and journals: McGill University Archives, G. M. Dawson fonds.",
    ],
    vocabulary: [{ word: "placer", definition: "Gold in gravel, washed out by water, as against gold in rock" }, { word: "Yukon District", definition: "The part of the North-West Territories that became the Yukon Territory in 1898" }, { word: "Alaska boundary", definition: "The 141st meridian, which Ogilvie fixed on the Yukon in 1887-88" }],
    discussionQuestions: ["What made Dawson think there was gold, and where did he think it would be found?", "What did the expedition record about the Indigenous trade across the passes?", "Why did Canada send a geologist and a surveyor to the Yukon in 1887?"],
    gradeLevel: "10-12", explorer: "George Mercer Dawson", waterway: "Pelly River",
  },
  {
    title: "Ogilvie's Information Respecting the Yukon District, 1897, and Early Days on the Yukon, 1913", documentType: "report", author: "William Ogilvie", originalDate: "1897 and 1913", originalYear: 1897,
    whatItIs: "The surveyor's official pamphlet of 1897, written at the start of the rush, describes the Klondike claims he had just surveyed, the routes in, the river and what a stampeder would need; his Early Days on the Yukon (1913) looks back over the river from Campbell's day to the discovery, with his own account of the dispute over who found the gold and his survey of the claims in the winter of 1896-97. Together they are the Canadian government's view of the Yukon before and after the Klondike.",
    whereToReadIt: [
      `Information Respecting the Yukon District (Ottawa, 1897) — ${IA("cihm_15792")}`,
      `Early Days on the Yukon and the Story of its Gold Finds (Ottawa, 1913) — ${IA("earlydaysonyukon00ogiluoft")}`,
    ],
    vocabulary: [{ word: "Dominion land surveyor", definition: "A surveyor licensed to lay out the federal lands of the west and north" }, { word: "claim", definition: "The 500-foot stretch of creek a miner could stake and record" }, { word: "commissioner", definition: "The head of the Yukon's government, which Ogilvie was from 1898" }],
    discussionQuestions: ["What did Ogilvie tell would-be stampeders in 1897, and what did he not tell them?", "Why were the Klondike claims disputed, and how did a survey settle them?", "How does Ogilvie tell the story of the discovery, and whom does he credit?"],
    gradeLevel: "10-12", explorer: "William Ogilvie", waterway: "Klondike River", location: "Bonanza Creek Discovery Claim",
  },
  {
    title: "Hayne's Pioneers of the Klondyke, 1897", documentType: "journal", author: "M. H. E. Hayne, North-West Mounted Police", originalDate: "1895-1897, published 1897", originalYear: 1897,
    whatItIs: "The account of a constable in Constantine's first Yukon detachment: the journey in over the Chilkoot and down the river in 1895, the building of Fort Constantine at Forty Mile, the mining camp before the Klondike, the winter work of the police, and the discovery of 1896 as it reached Forty Mile. Written up by the journalist H. West Taylor from Hayne's notes and printed in London as the rush began, it is the only published account from inside the first police post.",
    whereToReadIt: [
      `The Pioneers of the Klondyke: being an account of two years police service on the Yukon (London, 1897) — ${IA("pioneersklondyk00taylgoog")}`,
      `The police's own record: Report of the North-West Mounted Police, 1898, with Steele's and Constantine's reports — ${IA("reportnorthwest00cangoog")}`,
    ],
    vocabulary: [{ word: "Fort Constantine", definition: "The police post of 1895 at Forty Mile" }, { word: "customs", definition: "The duties on American goods the police collected to assert Canadian authority" }, { word: "Forty Mile", definition: "The mining town of 1886 at the Fortymile's mouth, emptied by the Klondike" }],
    discussionQuestions: ["Why were twenty policemen sent to a town of a few hundred miners?", "What did the police do all winter at Forty Mile?", "How did the news of the Klondike reach Forty Mile, and what happened next?"],
    gradeLevel: "7-9", explorer: "Charles Constantine", waterway: "Fortymile River", location: "Fort Constantine",
  },
  {
    title: "Adney's The Klondike Stampede, 1900", documentType: "journal", author: "Tappan Adney", originalDate: "1897-1898, published 1900", originalYear: 1900,
    whatItIs: "The Harper's Weekly correspondent's account of the rush as he lived it: the Chilkoot and White passes in the autumn of 1897, the boat camp at Bennett, the run down the river, Dawson in the winter of 1897-98 and the creeks in spring, with his own photographs and drawings. Adney hunted with Chief Isaac and the Hän up the Klondike in January 1898 and describes Moosehide; his is the fullest eyewitness account of the stampede and one of the few to notice the people it displaced.",
    whereToReadIt: [
      `The Klondike Stampede (New York, 1900) — ${IA("klondikestamped00adnegoog")}`,
      "Adney's photographs: Library and Archives Canada and the Peabody Museum, Harvard; Adney later became the authority on the bark canoe.",
    ],
    vocabulary: [{ word: "stampede", definition: "The rush of 1897-98; a stampeder was one who went" }, { word: "outfit", definition: "The year's supplies, close to a ton, that the police required of every stampeder" }, { word: "Moosehide", definition: "The Hän village below Dawson that Adney visited in 1898" }],
    discussionQuestions: ["What did a stampeder's outfit weigh, and how did it get over the pass?", "What did Adney see of the Hän that most stampeders did not?", "How does a journalist's account differ from a policeman's or a surveyor's?"],
    gradeLevel: "7-9", waterway: "Klondike River", location: "Dawson City",
  },
  {
    title: "Steele's Forty Years in Canada: the Yukon Chapters, 1898-1899", documentType: "journal", author: "Samuel Benfield Steele", originalDate: "1898-1899, published 1915", originalYear: 1915,
    whatItIs: "The policeman's autobiography covers the Yukon in its middle chapters: the posts at the summits of the White and Chilkoot passes in the winter of 1898, the thirty thousand at Bennett and the rules he made for their boats, the run through Miles Canyon, Dawson's dance halls, gamblers and typhoid, the Sunday closing law and the 'blue ticket' expulsions, and his transfer in 1899. Confident, self-admiring and exact, it is the police's own version of how Canada held the Klondike.",
    whereToReadIt: [
      `Forty Years in Canada: Reminiscences of the Great North-West (Toronto and London, 1915) — ${IA("fortyyearsincana00steerich")}`,
      "Steele's Yukon reports: Report of the North-West Mounted Police for 1898 and 1899 (Sessional Papers), and his papers at the Bruce Peel Special Collections, University of Alberta.",
    ],
    vocabulary: [{ word: "blue ticket", definition: "The police order to leave the Yukon served on undesirables" }, { word: "customs post", definition: "The police stations at the pass summits that marked the border and collected duty" }, { word: "superintendent", definition: "Steele's rank, commanding a division of the force" }],
    discussionQuestions: ["What rules did Steele make at Bennett, and by what authority?", "Whom did the police protect at Dawson, and whom did they expel?", "How does Steele describe the Indigenous people of the Yukon, and what does the omission tell us?"],
    gradeLevel: "10-12", explorer: "Sam Steele", waterway: "Bennett Lake", location: "Bennett",
  },
  {
    title: "Haskell's Two Years in the Klondike and Alaskan Gold-Fields, 1898", documentType: "journal", author: "William B. Haskell", originalDate: "1896-1898, published 1898", originalYear: 1898,
    whatItIs: "An American miner's account of being on the Yukon before the rush: the Fortymile diggings in 1896, the news from Bonanza, staking on the Klondike creeks, the first winter at Dawson and the methods of placer mining in frozen ground, written for the stampeders of 1898 who wanted to know how it was done. One of the few accounts by a working miner rather than an observer.",
    whereToReadIt: [
      `Two Years in the Klondike and Alaskan Gold-Fields (Hartford, 1898) — ${IA("twoyearsinklondi00hask")}`,
    ],
    vocabulary: [{ word: "sinking a shaft", definition: "Thawing and digging down through frozen gravel to bedrock, where the gold lay" }, { word: "sluice", definition: "The wooden trough through which thawed gravel was washed in spring" }, { word: "pay streak", definition: "The band of gravel on bedrock that carried the gold" }],
    discussionQuestions: ["How did miners get gold out of frozen ground?", "What did the men already on the river think when the news of Bonanza came?", "Who got rich in the Klondike, and who did the work?"],
    gradeLevel: "7-9", waterway: "Klondike River", location: "Bonanza Creek Discovery Claim",
  },
  {
    title: "Carmack's My Experiences in the Yukon, 1933", documentType: "journal", author: "George W. Carmack", originalDate: "written before 1922, printed 1933", originalYear: 1933,
    whatItIs: "The short account Carmack left of his years on the Yukon and the discovery of 1896, printed privately by his widow after his death: his version, in which he finds the gold himself and Keish and Káa Goox are his helpers. Read beside the Dictionary of Canadian Biography's entries on Keish, Káa Goox and Shaaw Tláa, built on Tagish oral tradition, it is the written half of a disputed story.",
    whereToReadIt: [
      `My Experiences in the Yukon (privately printed, 1933) — ${IA("myexperiencesiny00carm")}`,
      "The other half: Julie Cruikshank with Angela Sidney, Kitty Smith and Annie Ned, Life Lived Like a Story: Life Stories of Three Yukon Native Elders (Lincoln and Vancouver, 1990), borrowable at the Internet Archive — " + IA("lifelivedlikesto0000crui"),
      "Charlene Porsild, 'Keish', Dictionary of Canadian Biography, vol. 14 — https://www.biographi.ca/en/bio/keish_14E.html",
    ],
    vocabulary: [{ word: "Discovery Claim", definition: "The first claim staked on a creek, with the right to a double length" }, { word: "oral tradition", definition: "History carried by telling, as the Tagish account of the discovery was until Angela Sidney recorded it" }, { word: "brother-in-law", definition: "Carmack to Keish: the tie that made the partnership, and that Carmack broke in 1900" }],
    discussionQuestions: ["Who found the gold, according to Carmack, and who according to the Tagish?", "Why would each side tell it as they do?", "What happened to the four partners, and what does that say about what gold did?"],
    gradeLevel: "10-12", explorer: "George Carmack", waterway: "Klondike River", location: "Bonanza Creek Discovery Claim",
  },
  {
    title: "Zagoskin's Travels in Russian America, 1842-1844", documentType: "report", author: "Lavrenty Zagoskin", originalDate: "1842-1844, published 1847-48", originalYear: 1847,
    whatItIs: "The Russian naval lieutenant's report of the first survey of the lower Yukon and the Kuskokwim for the Russian-American Company: the posts at St. Michael and Nulato, the Yup'ik and Koyukon villages, the trade in furs and the geography of the river from the Bering Sea side, with his ethnographic and natural-history notes. Published in St. Petersburg and translated into English in 1967, it is the Russian beginning of the Yukon's written record.",
    whereToReadIt: [
      "Lieutenant Zagoskin's Travels in Russian America, 1842-1844: The First Ethnographic and Geographic Investigations in the Yukon and Kuskokwim Valleys of Alaska, ed. Henry N. Michael (Arctic Institute of North America, Anthropology of the North 7; Toronto, 1967); in university libraries.",
      "Original: Peshekhodnaia opis' chasti russkikh vladenii v Amerike (St. Petersburg, 1847-48).",
    ],
    vocabulary: [{ word: "Russian-American Company", definition: "The chartered company that governed Alaska for Russia from 1799 to 1867" }, { word: "Kuskokwim", definition: "The great river south of the Yukon that Zagoskin also surveyed" }, { word: "Yup'ik", definition: "The Inuit people of the Yukon delta and the Bering Sea coast" }],
    discussionQuestions: ["Why did the Russians know the lower river and the British the upper one?", "What did Zagoskin want to find out, and for whom?", "How does the Yukon look from the Bering Sea end?"],
    gradeLevel: "10-12", explorer: "Lavrenty Zagoskin", waterway: "Yukon River",
  },
  {
    title: "Martha Black's My Seventy Years, 1938", documentType: "journal", author: "Martha Louise Black", originalDate: "1898-1938, published 1938", originalYear: 1938,
    whatItIs: "The memoir of a Chicago woman who climbed the Chilkoot in 1898, pregnant and abandoned by her husband, ran a sawmill and a mining operation at Dawson, married the Yukon's commissioner George Black, and in 1935 became the second woman elected to the Canadian Parliament, for the Yukon. Her account of the trail, Bennett, the river and Dawson's first years is the fullest by a woman who stayed.",
    whereToReadIt: [
      `My Seventy Years, as told to Elizabeth Bailey Price (London, 1938), borrowable at the Internet Archive — ${IA("myseventyyears0000unse")}`,
      "Martha Black's papers: Yukon Archives, Whitehorse.",
    ],
    vocabulary: [{ word: "Chilkoot", definition: "The pass she climbed in 1898, in a skirt" }, { word: "sawmill", definition: "One of the businesses by which she made her living at Dawson" }, { word: "member of Parliament", definition: "Black sat for the Yukon from 1935 to 1940" }],
    discussionQuestions: ["How was the stampede different for a woman?", "What did Black do at Dawson after the gold was gone?", "Why did she stay when most stampeders left?"],
    gradeLevel: "7-9", waterway: "Bennett Lake", location: "Dawson City",
  },
  {
    title: "The Tagish Account of the Klondike Discovery: Angela Sidney, 1980s", documentType: "report", author: "Angela Sidney, with Julie Cruikshank", originalDate: "recorded 1974-1988, published 1983 and 1990", originalYear: 1990,
    whatItIs: "The Tagish elder Angela Sidney, niece of Káa Goox by Tagish reckoning, told the family's history to the anthropologist Julie Cruikshank over fourteen years: the clans and marriages that bound Keish, Káa Goox and Shaaw Tláa to Carmack, the journey of 1896 to find the sisters who had gone downriver, the finding of the gold as something that happened on the way, and what wealth did to the family afterwards. Published as Haa Shagóon (1983) and in Life Lived Like a Story (1990), it is the account the Dictionary of Canadian Biography's entries rest on.",
    whereToReadIt: [
      `Julie Cruikshank, in collaboration with Angela Sidney, Kitty Smith and Annie Ned, Life Lived Like a Story: Life Stories of Three Yukon Native Elders (University of Nebraska Press and UBC Press, 1990), borrowable at the Internet Archive — ${IA("lifelivedlikesto0000crui")}`,
      "Angela Sidney, Haa Shagóon (Our Family History) (Whitehorse, 1983).",
      "Julie Cruikshank, 'Káa Goox', Dictionary of Canadian Biography, vol. 13 — https://www.biographi.ca/en/bio/kaa_goox_13E.html",
    ],
    vocabulary: [{ word: "matrilineal", definition: "Descent through the mother; a Tagish man's mother's brother was the man most responsible for him" }, { word: "clan crest", definition: "The wolf or beaver on a gravestone that tells a Tagish or Tlingit person which Charlie lies there" }, { word: "oral tradition", definition: "History kept by telling and checked by the community that hears it" }],
    discussionQuestions: ["What was the journey of 1896 for, in the Tagish account?", "Why does it matter whether Keish wanted to be a prospector?", "How do the written and the oral accounts check each other?"],
    gradeLevel: "10-12", waterway: "Klondike River", location: "Carcross",
  },
];

async function checkUrl(url: string, problems: string[]) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 15_000 * (attempt + 1))); continue; }
      if (res.status === 405 || res.status === 403) { const g = await fetch(url, { headers: { "User-Agent": "CanadianWaterwaysExplorer/1.0 (content check)" } }); if (g.ok) return; problems.push(`${g.status} ${url}`); return; }
      problems.push(`${res.status} ${url}`); return;
    } catch (e) { problems.push(`${String(e).slice(0, 60)} ${url}`); return; }
  }
  problems.push(`rate-limited ${url}`);
}

async function main() {
  const [explorers, waterways, locations, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }), db.waterway.findMany({ select: { id: true, name: true } }), db.location.findMany({ select: { id: true, name: true } }), db.primarySourceDocument.findMany({ select: { title: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id])); const loc = new Map(locations.map((l) => [l.name, l.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const problems: string[] = []; const urls = new Set<string>();
  for (const d of DOCS) for (const w of d.whereToReadIt) { const m = w.match(/https?:\/\/\S+/); if (m) urls.add(m[0]); }
  for (const u of urls) await checkUrl(u, problems);
  const rows = DOCS.filter((d) => !existing.some((e) => e.title === d.title)).map((d, i) => ({
    id: `psd_yukon_${String(i + 1).padStart(2, "0")}`, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear,
    originalText: null, transcription: null, imageUrl: null,
    historicalContext: `${d.whatItIs}\n\nWhere to read it:\n${d.whereToReadIt.map((w) => `• ${w}`).join("\n")}`,
    annotations: null, vocabulary: JSON.stringify(d.vocabulary), discussionQuestions: JSON.stringify(d.discussionQuestions),
    explorerId: d.explorer ? need(ex, d.explorer, "explorer") : null, waterwayId: d.waterway ? need(ww, d.waterway, "waterway") : null, locationId: d.location ? need(loc, d.location, "location") : null,
    gradeLevel: d.gradeLevel, isPublished: true,
  }));
  const backupFile = writeBackup("2026-10-17-primary-sources-yukon-plan", { rows });
  report("primary sources: The Yukon", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
