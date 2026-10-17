// Primary-source pointers for the New France to the Gulf story (2026-10-17).
//   bun run prisma/turso-migrations/2026-10-17-primary-sources-new-france.ts [--apply]
//
// Each PrimarySourceDocument row here tells a reader what the source is, who made it and
// when, what it covers, and exactly where it can be read today: the holding archive and the
// edition, with URLs only where this session confirmed the page answers. No transcription
// is quoted; none was checked against an edition here. Rows link to the explorer, waterway
// and location they belong to and carry a grade band, so they open from those records and
// answer the Documents grade filter. Idempotent: an existing title is skipped.
import { db } from "../../src/db";
import { APPLY, writeBackup, report } from "./lib/migration";

const IA = (id: string) => `https://archive.org/details/${id}`;
const JR = (vol: number) => `https://moses.creighton.edu/kripke/jesuitrelations/relations_${vol}.html`;
const commons = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1280`;

interface Doc {
  title: string; documentType: "journal" | "report" | "letter" | "map" | "treaty";
  author: string; originalDate: string; originalYear: number;
  whatItIs: string; whereToReadIt: string[]; // each entry: "Holder or edition — URL"
  vocabulary: { word: string; definition: string }[]; discussionQuestions: string[];
  gradeLevel: "4-6" | "7-9" | "10-12"; explorer?: string; waterway?: string; location?: string; image?: string;
}

const DOCS: Doc[] = [
  {
    title: "Marquette's Journal of the Mississippi Voyage, 1673", documentType: "journal", author: "Jacques Marquette", originalDate: "1673-1674", originalYear: 1673,
    whatItIs: "Father Marquette's own account of the voyage he and Louis Jolliet made from the mission at the mouth of the Fox River, over the portage to the Wisconsin, down the Mississippi to the Arkansas, and home by the Illinois. He describes the Menominee, the Illinois and the Quapaw, the calumet ceremony, the mouths of the Missouri and the Ohio, and the moment on 17 June 1673 when the canoes entered the great river. It is the only first-hand narrative of the expedition, because Jolliet's papers were lost at Lachine in 1674.",
    whereToReadIt: [
      "Manuscript: Archives des Jésuites au Canada, Montreal (the 'Récit des voyages et des découvertes du P. Jacques Marquette').",
      `English and French side by side: The Jesuit Relations and Allied Documents, vol. 59 (Thwaites, 1900), pp. 86-163 — ${IA("jesuitrelationsa0059jesu")}`,
      `Same volume as searchable text, Creighton University — ${JR(59)}`,
      `First printing: Melchisédech Thévenot, Recueil de voyages (Paris, 1681); John Gilmary Shea's 1852 edition with the Thévenot text — ${IA("discoveryexplora00shea_3")}`,
    ],
    vocabulary: [{ word: "calumet", definition: "The ceremonial pipe whose presentation guaranteed safe passage among the nations of the Mississippi valley" }, { word: "portage", definition: "A carrying place between two waters; the Fox–Wisconsin portage was less than two kilometres" }, { word: "Relation", definition: "The annual report the Jesuits of New France sent to Paris, printed for the public from 1632 to 1673" }],
    discussionQuestions: ["Why does Marquette say the calumet was the most important thing they carried?", "Which peoples does he name along the river, and what does he record about each?", "What did the two men decide at the Arkansas River, and why?"],
    gradeLevel: "7-9", explorer: "Jacques Marquette", waterway: "Mississippi River", location: "Prairie du Chien", image: "Marquette and jolliet map 1681.jpg",
  },
  {
    title: "Marquette's Map of the Mississippi, 1673-1674", documentType: "map", author: "Jacques Marquette", originalDate: "1674", originalYear: 1674,
    whatItIs: "The manuscript map Marquette drew of the river he and Jolliet had followed, with the villages of the Illinois, the Missouri ('Pekitanoui') and the Ohio marked and the course of the Mississippi carried toward the Gulf. Thévenot's engraved version of 1681 made it the first printed map of the river. Jolliet's own maps, drawn from memory after his papers were lost, survive in copies in Paris.",
    whereToReadIt: [
      "Manuscript: Archives des Jésuites au Canada, Montreal.",
      `Facsimile in The Jesuit Relations and Allied Documents, vol. 59 (Thwaites, 1900) — ${IA("jesuitrelationsa0059jesu")}`,
      `Thévenot's 1681 engraving, on Wikimedia Commons — ${commons("Marquette and jolliet map 1681.jpg")}`,
    ],
    vocabulary: [{ word: "Pekitanoui", definition: "Marquette's name for the Missouri River, from the Illinois word for muddy water" }, { word: "engraving", definition: "A printed picture made from a cut metal plate; how maps were published before photography" }],
    discussionQuestions: ["What did Marquette draw from his own observation, and what from what he was told?", "Compare the 1674 map with a modern one: what is right, and what is missing?"],
    gradeLevel: "4-6", explorer: "Jacques Marquette", waterway: "Mississippi River", image: "Land and volk-ontdekking in't Noorder gedeelte van America - door P. Marquette en Joliet gedaan in't jaar 1673 - btv1b8596041k.jpg",
  },
  {
    title: "Dablon's Account of Jolliet's Report, 1674", documentType: "report", author: "Claude Dablon, Superior of the Jesuit missions", originalDate: "1 August 1674", originalYear: 1674,
    whatItIs: "Louis Jolliet lost his journal and maps when his canoe overturned in the Lachine Rapids in the summer of 1674, within sight of Montreal. Father Dablon interviewed him and wrote down what Jolliet remembered: the route, the nations, the Illinois country 'the most beautiful' he had seen, and the short portage that would let a vessel pass from Lake Michigan to the Mississippi. It is the closest thing to Jolliet's own account that survives.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, vol. 58 (Thwaites, 1899), the 'Relation of the discovery of the Mississippi' — ${JR(58)}`,
      "Jolliet's maps of 1674-75, drawn from memory: copies at the Service historique de la Défense (Vincennes) and the Bibliothèque nationale de France.",
    ],
    vocabulary: [{ word: "Lachine Rapids", definition: "The rapids above Montreal that stopped every boat on the St. Lawrence and where Jolliet's papers were lost" }, { word: "Superior", definition: "The head of a religious order's missions in a colony" }],
    discussionQuestions: ["How reliable is a report written from someone else's memory?", "What did Jolliet think was the most important result of the voyage?"],
    gradeLevel: "7-9", explorer: "Louis Jolliet", waterway: "Illinois River", location: "Lachine",
  },
  {
    title: "La Salle's Act of Possession of Louisiana, 9 April 1682", documentType: "report", author: "Jacques de La Métairie, notary, for René-Robert Cavelier de La Salle", originalDate: "9 April 1682", originalYear: 1682,
    whatItIs: "The formal record (procès-verbal) drawn up at the mouth of the Mississippi when La Salle raised a cross and a column bearing the arms of France and claimed, in the name of Louis XIV, the river and every land it drained, naming the whole 'Louisiane'. It lists the men present, French and Indigenous, and the words proclaimed. The claim on paper covered a third of the continent; French control on the ground never matched it.",
    whereToReadIt: [
      `English translation in B. F. French, Historical Collections of Louisiana, Part I (New York, 1846) — ${IA("historicalcolle01frengoog")}`,
      "French text in Pierre Margry, Découvertes et établissements des Français dans l'ouest et dans le sud de l'Amérique septentrionale, vol. 2 (Paris, 1877).",
      "Original: Archives nationales d'outre-mer, Aix-en-Provence, Fonds des Colonies.",
    ],
    vocabulary: [{ word: "procès-verbal", definition: "A notary's formal written record of an act, signed by witnesses" }, { word: "possession", definition: "In European law of the time, the claim of a territory for a crown by a public ceremony" }, { word: "Louisiane", definition: "The name La Salle gave the Mississippi basin, after Louis XIV" }],
    discussionQuestions: ["What exactly did the ceremony claim, and for whom?", "What did the nations living along the river think of a claim they were not asked about?", "Why did France need a written record of the act?"],
    gradeLevel: "10-12", explorer: "Rene-Robert Cavelier, Sieur de La Salle", waterway: "Mississippi River", image: "Le 9 avril 1682 - Rene-Robert de La Salle erige une croix.jpg",
  },
  {
    title: "Henri de Tonti's Relation of La Salle's Explorations, 1693", documentType: "report", author: "Henri de Tonti", originalDate: "1693", originalYear: 1693,
    whatItIs: "The memoir Tonti wrote for the French minister about his years with La Salle, from the building of the Griffon on the Niagara in 1679 through Fort Crèvecoeur, the Iroquois attack on the Illinois, Fort Saint-Louis on the rock, the 1682 voyage to the Gulf, and his own search for La Salle's lost colony in 1686. Plain, exact and from the man who held the Illinois Country for France for twenty years.",
    whereToReadIt: [
      `English: Relation of Henri de Tonty concerning the explorations of La Salle from 1678 to 1683 (Caxton Club, Chicago, 1898) — ${IA("relationofhenrid00tont")}`,
      `Also in Louise Phelps Kellogg, Early Narratives of the Northwest, 1634-1699 (1917) — ${IA("earlynarrativeso0014kell")}`,
      "French original in Margry, Découvertes et établissements, vol. 1.",
    ],
    vocabulary: [{ word: "memoir", definition: "A written account addressed to a superior, here the Minister of Marine" }, { word: "Griffon", definition: "La Salle's sailing ship, built above Niagara Falls in 1679 and lost on its first voyage" }],
    discussionQuestions: ["Where does Tonti's account differ in tone from Hennepin's?", "Why did Tonti keep thousands of Illinois and Miami around Fort Saint-Louis?"],
    gradeLevel: "10-12", explorer: "Henri de Tonti", waterway: "Illinois River", location: "Fort Saint-Louis (Starved Rock)",
  },
  {
    title: "Hennepin's Description de la Louisiane, 1683", documentType: "journal", author: "Louis Hennepin", originalDate: "1683", originalYear: 1683,
    whatItIs: "The Récollet friar's book about La Salle's expedition of 1678-1680: the first published description of Niagara Falls, the Griffon, the Illinois country, and his own capture by the Dakota and journey up the Mississippi to the Falls of St. Anthony. It sold across Europe and made the Mississippi famous. His later books of 1697 and 1698 added a descent of the river to the Gulf that never happened; readers must compare the 1683 text with the later ones.",
    whereToReadIt: [
      `French first edition (Paris, 1683) — ${IA("descriptiondelal00henn")}`,
      `English: A New Discovery of a Vast Country in America (London, 1698; Thwaites edition, Chicago, 1903), which includes the Niagara and Mississippi chapters — ${IA("newdiscoveryofva02hennuoft")}`,
    ],
    vocabulary: [{ word: "Récollet", definition: "A branch of the Franciscan order that sent missionaries to New France from 1615" }, { word: "Falls of St. Anthony", definition: "The falls on the upper Mississippi at present Minneapolis, named by Hennepin in 1680" }, { word: "primary source", definition: "A record made by someone who was there; it can still be mistaken or dishonest" }],
    discussionQuestions: ["Which parts of Hennepin's story do other witnesses confirm?", "Why might a writer add adventures he did not have? How can a historian tell?"],
    gradeLevel: "7-9", explorer: "Louis Hennepin", waterway: "Niagara River",
  },
  {
    title: "Robert Juet's Journal of the Half Moon, 1609", documentType: "journal", author: "Robert Juet, mate of the Half Moon", originalDate: "April to November 1609", originalYear: 1609,
    whatItIs: "The day-by-day log kept by Henry Hudson's mate on the voyage that took the Dutch East India Company's Half Moon up the river now named for Hudson, from 11 September to the head of navigation near present Albany and back. It records soundings, weather, trade with the Lenape and Mahican, and the first violence between the ship and the people of the river. Hudson's own journal does not survive.",
    whereToReadIt: [
      "First printed in Samuel Purchas, Purchas His Pilgrimes (London, 1625).",
      `G. M. Asher, Henry Hudson the Navigator: the original documents (Hakluyt Society, 1860) — ${IA("henryhudsonnavig27ashe")}`,
      `Juet's Journal: the voyage of the Half Moon (1959 edition) — ${IA("juetsjournalvoya00juet")}`,
    ],
    vocabulary: [{ word: "sounding", definition: "Measuring the water's depth with a weighted line; Juet records one at almost every anchorage" }, { word: "Dutch East India Company", definition: "The trading company that hired Hudson in 1609 to find a northern route to Asia" }],
    discussionQuestions: ["What was Hudson looking for, and what did he find instead?", "How does Juet describe the people he met, and what does that tell us about him?"],
    gradeLevel: "7-9", explorer: "Henry Hudson", waterway: "Hudson River", location: "Fort Orange",
  },
  {
    title: "Champlain's Voyages: the Expedition to Lake Champlain, 1609", documentType: "journal", author: "Samuel de Champlain", originalDate: "1613 (events of July 1609)", originalYear: 1609,
    whatItIs: "Champlain's own narrative, published in Paris in 1613, of the journey up the Richelieu with his Innu, Algonquin and Wendat allies, the lake he named for himself, and the fight with the Mohawk near Ticonderoga on 30 July 1609 in which his arquebus killed two chiefs at the first shot. His engraving of the battle is the best-known image of early New France.",
    whereToReadIt: [
      `The Works of Samuel de Champlain, vol. 2 (Champlain Society, 1925; H. P. Biggar, ed.), French and English — ${IA("worksofsamueldec02chamuoft")}`,
      "The Champlain Society's digital collection carries the whole six-volume edition (champlainsociety.utpjournals.press).",
    ],
    vocabulary: [{ word: "arquebus", definition: "The matchlock gun Champlain carried; it had never been used in a battle on the lake before" }, { word: "Haudenosaunee", definition: "The Five Nations of the Iroquois, of which the Mohawk were the easternmost" }],
    discussionQuestions: ["Why did Champlain agree to fight alongside his allies?", "What does his engraving show, and what does it leave out?", "How did this day shape the next hundred years?"],
    gradeLevel: "7-9", explorer: "Samuel de Champlain", waterway: "Lake Champlain", location: "Fort Carillon",
  },
  {
    title: "Champlain's Voyages: the Ottawa River, 1613, and the Road to Huronia, 1615", documentType: "journal", author: "Samuel de Champlain", originalDate: "1613 and 1619 (events of 1613 and 1615)", originalYear: 1613,
    whatItIs: "Champlain's accounts of his two journeys up the Ottawa: the 1613 trip to Tessouat's island, where the Kichesipirini refused him guides and Vignau's story of a northern sea collapsed, and the 1615 journey by the Mattawa, Lake Nipissing and the French River to the Wendat towns on Georgian Bay. Together they describe the canoe road that every traveller to the west would follow for two centuries.",
    whereToReadIt: [
      `The Works of Samuel de Champlain, vol. 2 (the 1613 voyage) — ${IA("worksofsamueldec02chamuoft")}`,
      `The Works of Samuel de Champlain, vol. 3 (the 1615-1618 voyages) — ${IA("worksofsamueldec03chamuoft")}`,
    ],
    vocabulary: [{ word: "Kichesipirini", definition: "The 'people of the great river', the Algonquin band on Allumette Island who controlled the Ottawa" }, { word: "Huronia", definition: "The Wendat homeland between Georgian Bay and Lake Simcoe" }],
    discussionQuestions: ["Why did Tessouat refuse Champlain, and why could Champlain not go on without him?", "Trace the 1615 route on the map: where are the portages?"],
    gradeLevel: "7-9", explorer: "Samuel de Champlain", waterway: "Lake Nipissing", location: "Allumette Island",
  },
  {
    title: "The Voyages of Jacques Cartier, 1534-1536", documentType: "journal", author: "Jacques Cartier (and an unnamed companion)", originalDate: "1545 (first printing of the second voyage)", originalYear: 1535,
    whatItIs: "The narratives of Cartier's first two voyages: the cross at Gaspé and the meeting with Donnacona in 1534, and the 1535 voyage up the St. Lawrence to Stadacona and Hochelaga, the winter of scurvy, the cedar remedy, and the seizure of Donnacona in May 1536. The second voyage was printed in Paris in 1545; the first survives through Ramusio's Italian (1556) and Hakluyt's English (1580).",
    whereToReadIt: [
      `H. P. Biggar, The Voyages of Jacques Cartier (Public Archives of Canada, 1924), French and English with notes — ${IA("voyagesofjacques0000hpbi")}`,
      "Manuscripts: Bibliothèque nationale de France, Paris.",
    ],
    vocabulary: [{ word: "Stadacona", definition: "The St. Lawrence Iroquoian town at Quebec where Cartier wintered" }, { word: "annedda", definition: "The tree, probably white cedar, whose bark and leaves the Stadaconans brewed to cure scurvy" }, { word: "Saguenay", definition: "The rich kingdom Donnacona described to the French, never found" }],
    discussionQuestions: ["Who is speaking in these narratives, and who is not?", "What did Cartier's men owe to the people of Stadacona by the spring of 1536, and what did they do?"],
    gradeLevel: "7-9", explorer: "Jacques Cartier", waterway: "St. Lawrence River", location: "Stadacona",
  },
  {
    title: "Journal of the Chevalier de Troyes, 1686", documentType: "journal", author: "Pierre de Troyes", originalDate: "March to August 1686", originalYear: 1686,
    whatItIs: "De Troyes' daily journal of the overland expedition from Montreal to James Bay: the ascent of the Ottawa in the thaw, Lake Timiskaming, the Abitibi and Moose rivers, and the capture of Moose Factory, Rupert House and Fort Albany from the Hudson's Bay Company, with Iberville first over the palisade. It is the first detailed record of that route and of the James Bay posts as the English had built them.",
    whereToReadIt: [
      `French text edited by Ivanhoë Caron: Journal de l'expédition du chevalier de Troyes à la baie d'Hudson, en 1686 (Beauceville, 1918) — ${IA("journaldelexpd00troy")}`,
      "Manuscript: Archives nationales d'outre-mer, Aix-en-Provence, Fonds des Colonies, série C11A.",
    ],
    vocabulary: [{ word: "Troupes de la Marine", definition: "The colonial regular soldiers of New France, under the Ministry of Marine" }, { word: "palisade", definition: "A wall of upright logs; the defence of every Hudson's Bay Company post" }],
    discussionQuestions: ["Why did the French attack in peacetime?", "What does the journal show about how the Canadians travelled compared with the soldiers from France?"],
    gradeLevel: "10-12", explorer: "Pierre de Troyes", waterway: "James Bay", location: "Moose Factory",
  },
  {
    title: "Lahontan's Dialogues with Adario (Kondiaronk), 1703", documentType: "journal", author: "Louis-Armand de Lom d'Arce, Baron de Lahontan", originalDate: "1703", originalYear: 1703,
    whatItIs: "In the second volume of his New Voyages to North-America, Lahontan, a French officer who served in the Great Lakes country in the 1680s, printed a set of dialogues between himself and 'Adario', a Wendat sage modelled on Kondiaronk, in which Adario picks apart European religion, law and money. The book was read across Europe and shaped the Enlightenment's idea of the 'noble savage'. How much is Kondiaronk's and how much is Lahontan's is the question every reader must ask.",
    whereToReadIt: [
      `New Voyages to North-America (London, 1703), English first edition — ${IA("newvoyagestonort11703laho")}`,
      `The 1905 reprint edited by Reuben Gold Thwaites, vol. 2 (the Dialogues) — ${IA("agd5973.0002.001.umich.edu")}`,
    ],
    vocabulary: [{ word: "Adario", definition: "Lahontan's name for the Wendat speaker in the Dialogues, based on Kondiaronk" }, { word: "Enlightenment", definition: "The European movement of the 1700s that questioned authority with reason; Lahontan's book was one of its sources" }],
    discussionQuestions: ["What arguments does Adario make, and which of them match what we know of Kondiaronk's politics?", "Why would a French officer put such criticism in an Indigenous mouth?"],
    gradeLevel: "10-12", waterway: "Lake Huron", location: "Michilimackinac",
  },
  {
    title: "The Great Peace of Montreal, 4 August 1701", documentType: "treaty", author: "Louis-Hector de Callière, Governor of New France, and the delegates of some forty nations", originalDate: "4 August 1701", originalYear: 1701,
    whatItIs: "The treaty signed at Montreal by the governor of New France, the Haudenosaunee and the nations of the Great Lakes and beyond, ending nearly a century of war. The document carries the pictographic signatures of the chiefs, each drawing the animal of his clan. Kondiaronk, its chief Indigenous architect, died during the council two days before it was signed.",
    whereToReadIt: [
      "Original: Archives nationales d'outre-mer, Aix-en-Provence, Fonds des Colonies, série C11A, vol. 19.",
      "Full text, images of the signatures and the story of the council: Gilles Havard, The Great Peace of Montreal of 1701 (McGill-Queen's University Press, 2001).",
      "The Canadian Encyclopedia article 'Great Peace of Montreal, 1701' reproduces the signatures page (thecanadianencyclopedia.ca).",
    ],
    vocabulary: [{ word: "pictograph", definition: "A drawn sign standing for a name; the chiefs signed with their clan animals" }, { word: "neutrality", definition: "What the Haudenosaunee promised in any future war between France and England" }],
    discussionQuestions: ["What did each party give up, and what did each gain?", "Why are the signatures as important as the words?"],
    gradeLevel: "7-9", waterway: "St. Lawrence River", location: "Montreal",
  },
  {
    title: "The Treaty of Paris, 10 February 1763", documentType: "treaty", author: "Great Britain, France and Spain", originalDate: "10 February 1763", originalYear: 1763,
    whatItIs: "The treaty that ended the Seven Years' War. Article IV gave Canada to Britain; Article VII drew the new boundary down the middle of the Mississippi, leaving the east bank British and the west bank, with New Orleans, in French hands for Spain to receive. The French water road from the St. Lawrence to the Gulf was cut in two by a line on a map.",
    whereToReadIt: [
      `Full English text, Avalon Project, Yale Law School — https://avalon.law.yale.edu/18th_century/paris763.asp`,
      `A 1763 London printing of the treaty — ${IA("cihm_48439")}`,
    ],
    vocabulary: [{ word: "cession", definition: "The handing over of territory by treaty" }, { word: "article", definition: "A numbered clause of a treaty" }],
    discussionQuestions: ["Find the Mississippi in Article VII: what exactly was divided?", "Who was not at the table in Paris, and what did the treaty mean for them?"],
    gradeLevel: "7-9", waterway: "Mississippi River", location: "New Orleans",
  },
  {
    title: "Radisson's Voyages, written about 1668", documentType: "journal", author: "Pierre-Esprit Radisson", originalDate: "about 1668-1669", originalYear: 1668,
    whatItIs: "Radisson's narratives, written in English for his new English backers, of his captivity among the Mohawk and of the journeys he and Des Groseilliers made to Lake Superior and the country beyond it in the 1650s and 1660s. They are the earliest first-hand descriptions of the western Great Lakes and the fur country that the Hudson's Bay Company, founded on their advice in 1670, set out to reach from the north.",
    whereToReadIt: [
      `Voyages of Peter Esprit Radisson (Prince Society, Boston, 1885), the first printing — ${IA("voyagespeteresp01radigoog")}`,
      "Manuscripts: Bodleian Library, Oxford, and the British Library, London.",
    ],
    vocabulary: [{ word: "coureur des bois", definition: "An unlicensed French trader who went to the Indigenous nations instead of waiting for them at Montreal" }, { word: "Hudson's Bay Company", definition: "Chartered in London in 1670 to trade into the bay Radisson and Des Groseilliers had told the English about" }],
    discussionQuestions: ["Why did Radisson write in English?", "What does he notice about the lands around Lake Superior, and why would a trader care?"],
    gradeLevel: "10-12", explorer: "Pierre-Esprit Radisson", waterway: "Lake Superior",
  },
  {
    title: "Hudson's Bay Company Post Journals, James Bay", documentType: "report", author: "Factors and clerks of the Hudson's Bay Company", originalDate: "from the 1670s", originalYear: 1686,
    whatItIs: "The daily journals kept at Moose Factory, Fort Albany and Rupert House, recording weather, arrivals of canoes, furs traded, food, sickness and attacks, including the French capture of 1686. Together with account books and correspondence they form the largest body of day-to-day evidence for the fur trade anywhere, and the Hudson's Bay Company Archives were placed on the UNESCO Memory of the World register in 2007.",
    whereToReadIt: [
      `Hudson's Bay Company Archives, Archives of Manitoba, Winnipeg; post journals are series B (Moose Factory B.135/a, Albany B.3/a, Rupert House B.186/a); the Keystone online catalogue describes every file — https://www.gov.mb.ca/chc/archives/hbca/`,
      `Microfilm of many post journals is digitized in the Héritage collection at canadiana.ca — https://www.canadiana.ca/`,
    ],
    vocabulary: [{ word: "factor", definition: "The officer in charge of a Hudson's Bay Company post" }, { word: "made beaver", definition: "The unit of account: the value of one prime beaver pelt" }],
    discussionQuestions: ["What can a daily weather and trade log tell us that a traveller's narrative cannot?", "Who is missing from these records, and how might their side be recovered?"],
    gradeLevel: "10-12", waterway: "James Bay", location: "Moose Factory",
  },
  {
    title: "The Jesuit Relation of 1643 on Jean Nicolet", documentType: "report", author: "Barthélemy Vimont, Superior of the Jesuit missions", originalDate: "1643", originalYear: 1643,
    whatItIs: "Nicolet left no writings. Everything known about his 1634 voyage to Green Bay, including the Chinese damask robe he wore to meet the Ho-Chunk and the peace he made between them and the Wendat, comes from the obituary notice Father Vimont wrote after Nicolet drowned in the St. Lawrence in 1642, printed in the Relation of 1643.",
    whereToReadIt: [
      `The Jesuit Relations and Allied Documents, vol. 23 (Thwaites, 1898), searchable text at Creighton University — ${JR(23)}`,
    ],
    vocabulary: [{ word: "damask", definition: "A patterned silk; Nicolet's robe was meant for the court of China he expected to find" }, { word: "obituary", definition: "A notice written at someone's death, here the only record of a life" }],
    discussionQuestions: ["How much of Nicolet's story rests on one paragraph written nine years later?", "Why did Nicolet expect to meet Asians at Green Bay?"],
    gradeLevel: "7-9", explorer: "Jean Nicolet", waterway: "Lake Michigan", location: "La Baye (Green Bay)",
  },
];

async function checkUrl(url: string, problems: string[]) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; CanadianWaterwaysExplorer/1.0)" } });
      if (res.ok) return;
      if (res.status === 429) { await new Promise((r) => setTimeout(r, 15_000)); continue; }
      problems.push(`${res.status} ${url}`); return;
    } catch (e) { problems.push(`${String(e).slice(0, 50)} ${url}`); return; }
  }
  problems.push(`rate-limited ${url}`);
}

async function main() {
  const [explorers, waterways, locations, existing] = await Promise.all([
    db.explorer.findMany({ select: { id: true, name: true } }),
    db.waterway.findMany({ select: { id: true, name: true } }),
    db.location.findMany({ select: { id: true, name: true } }),
    db.primarySourceDocument.findMany({ select: { title: true } }),
  ]);
  const ex = new Map(explorers.map((e) => [e.name, e.id])); const ww = new Map(waterways.map((w) => [w.name, w.id])); const loc = new Map(locations.map((l) => [l.name, l.id]));
  const need = (m: Map<string, string>, k: string, what: string) => { const v = m.get(k); if (!v) throw new Error(`${what} not found: ${k}`); return v; };
  const problems: string[] = [];
  const urls = new Set<string>();
  for (const d of DOCS) { for (const w of d.whereToReadIt) { const m = w.match(/https?:\/\/\S+/); if (m) urls.add(m[0]); } if (d.image) urls.add(commons(d.image)); }
  for (const u of urls) await checkUrl(u, problems);

  const rows = DOCS.filter((d) => !existing.some((e) => e.title === d.title)).map((d, i) => ({
    id: `psd_nf_${String(i + 1).padStart(2, "0")}`, title: d.title, documentType: d.documentType, author: d.author, originalDate: d.originalDate, originalYear: d.originalYear,
    originalText: null, transcription: null, imageUrl: d.image ? commons(d.image) : null,
    historicalContext: `${d.whatItIs}\n\nWhere to read it:\n${d.whereToReadIt.map((w) => `• ${w}`).join("\n")}`,
    annotations: null, vocabulary: JSON.stringify(d.vocabulary), discussionQuestions: JSON.stringify(d.discussionQuestions),
    explorerId: d.explorer ? need(ex, d.explorer, "explorer") : null, waterwayId: d.waterway ? need(ww, d.waterway, "waterway") : null, locationId: d.location ? need(loc, d.location, "location") : null,
    gradeLevel: d.gradeLevel, isPublished: true,
  }));

  const backupFile = writeBackup("2026-10-17-primary-sources-new-france-plan", { rows });
  report("primary sources: New France to the Gulf", { toInsert: rows.map((r) => `${r.gradeLevel} | ${r.documentType} | ${r.title}`), skippedExisting: DOCS.length - rows.length, urlsChecked: urls.size, problems, backupFile });
  if (problems.length) throw new Error("Fix the URLs above before applying.");
  if (!APPLY) return;
  await db.$transaction(async (tx) => { for (const r of rows) await tx.primarySourceDocument.create({ data: r }); });
  report("verify", { documents: await db.primarySourceDocument.count(), byGrade: await db.primarySourceDocument.groupBy({ by: ["gradeLevel"], _count: true }), byType: await db.primarySourceDocument.groupBy({ by: ["documentType"], _count: true }), withExplorer: await db.primarySourceDocument.count({ where: { explorerId: { not: null } } }), withWaterway: await db.primarySourceDocument.count({ where: { waterwayId: { not: null } } }), withLocation: await db.primarySourceDocument.count({ where: { locationId: { not: null } } }) });
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
