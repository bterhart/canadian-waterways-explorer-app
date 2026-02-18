// Location Reading Guide Entry type (same as Explorer reading guide)
export interface LocationReadingGuideEntry {
  authorSource?: string;
  title: string;
  publisher?: string;
  year?: string;
  url?: string;
  description?: string;
}

// Reading guide data mapped by location ID
export const locationReadingGuideData: Record<string, LocationReadingGuideEntry[]> = {
  'atikokan-river-waterway': [
    {
      authorSource: 'Hudson\\',
      title: 'Atikokan River Area Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Atikokan River as part of the Rainy Lake–Lake Superior watershed in early fur trade canoe routes.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Atikokan River in connecting Rainy Lake to Lake Superior and NWC/HBC operations.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Atikokan River',
      url: 'https://en.wikipedia.org/wiki/Atikokan_River',
      description: 'Historic waterway significance in northwestern Ontario.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1939',
      description: 'Historical mention of Atikokan River in Lake Superior interior trade corridors.',
    }
  ],
  'back-river-waterway': [
    {
      authorSource: 'Franklin John',
      title: 'Narrative of a Journey to the Shores of the Polar Sea in the Years 1819 20 21 and 22',
      publisher: 'John Murray',
      year: '1823',
      description: 'Primary account referencing Back River (Hanninyuaq) during Arctic exploration and Dene-guided surveys.',
    },
    {
      authorSource: 'McGoogan Ken',
      title: 'Lady Franklin\\',
      publisher: 'HarperCollins',
      year: '2005',
      description: 'Context on Back River in Franklin search expeditions and Inuit knowledge.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Back River',
      url: 'https://en.wikipedia.org/wiki/Back_River_(Nunavut)',
      description: 'Historic Arctic waterway significance.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Back River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/back-river',
      description: 'Overview of the river in Arctic exploration history.',
    }
  ],
  'baffin-bay-waterway': [
    {
      authorSource: 'Markham Clements R. ed.',
      title: 'The Voyages of William Baffin 1612-1622',
      publisher: 'Hakluyt Society',
      year: '1881',
      description: 'Primary accounts of Baffin\\',
    },
    {
      authorSource: 'Mancall Peter C.',
      title: 'Fatal Journey: The Final Expedition of Henry Hudson – A Tale of Mutiny and Murder in the Arctic',
      publisher: 'Basic Books',
      year: '2009',
      description: 'Broader context on early English Arctic exploration including Baffin Bay.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Baffin Bay',
      url: 'https://en.wikipedia.org/wiki/Baffin_Bay',
      description: 'Historic significance in Northwest Passage searches.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Baffin Bay',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/baffin-bay',
      description: 'Significance in Northwest Passage searches.',
    }
  ],
  'bellot-strait-waterway': [
    {
      authorSource: 'McClure Robert',
      title: 'The Discovery of the North-West Passage by H.M.S. Investigator ed. Sherard Osborn',
      publisher: 'Longman Brown Green Longmans & Roberts',
      year: '1856',
      description: 'Primary narrative referencing Bellot Strait (Tallurutiup Imanga) during McClure\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Bellot Strait',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/bellot-strait',
      description: 'Overview of the strait in Arctic exploration and Franklin search efforts.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bellot Strait',
      url: 'https://en.wikipedia.org/wiki/Bellot_Strait',
      description: 'Historic significance in Northwest Passage navigation.',
    }
  ],
  'bloody_falls_location': [
    {
      authorSource: 'Hearne Samuel',
      title: 'A Journey from Prince of Wales\\',
      publisher: 'Champlain Society',
      year: '1958 (reprint of 1795)',
      description: 'Primary narrative of Hearne\\',
    },
    {
      authorSource: 'McGoogan Ken',
      title: 'Ancient Mariner: The Amazing Adventures of Samuel Hearne the Sailor Who Inspired Coleridge\\',
      publisher: 'Carroll & Graf',
      year: '2004',
      description: 'Modern biography with detailed analysis of the Bloody Falls event and Dene oral perspectives.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Bloody Falls',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/bloody-falls',
      description: 'Overview of the site its historical event and significance on the Coppermine River.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bloody Falls',
      url: 'https://en.wikipedia.org/wiki/Bloody_Falls',
      description: 'Description of the location the 1771 massacre and archaeological context.',
    }
  ],
  'chesterfield-inlet-waterway': [
    {
      authorSource: 'Franklin John',
      title: 'Narrative of a Second Expedition to the Shores of the Polar Sea in the Years 1825 26 27 and 1828',
      publisher: 'John Murray',
      year: '1828',
      description: 'Primary account referencing Chesterfield Inlet (Igluligaarjuk) during Arctic coastal exploration.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Chesterfield Inlet',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/chesterfield-inlet',
      description: 'Overview of the inlet in Inuit history and Hudson Bay exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Chesterfield Inlet',
      url: 'https://en.wikipedia.org/wiki/Chesterfield_Inlet',
      description: 'Historic significance in Nunavut.',
    }
  ],
  'cml_marble_island': [
    {
      authorSource: 'Eber Dorothy Harley',
      title: 'When the Whalers Were Up North: Inuit Memories from the Eastern Arctic',
      publisher: 'McGill-Queen\\',
      year: '1989',
      description: 'Inuit oral histories and memories of Marble Island as a whaling harbour and site of the 1719 Knight expedition shipwreck.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Marble Island (Inuit Possession)',
      url: 'https://www.pc.gc.ca (related Nunavut sites)',
      description: 'Interpretive information on Marble Island\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Marble Island',
      url: 'https://en.wikipedia.org/wiki/Marble_Island',
      description: 'Historic significance in Hudson Bay whaling and Inuit legend.',
    }
  ],
  'cmlhaslql000km2zhocxl8zbv': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to St. Lawrence River (Kaniatarowanenneh) as the main corridor for early French exploration and Algonquin/Haudenosaunee relations.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of St. Lawrence River as the primary artery for New France fur trade from Montreal to the Great Lakes.',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on St. Lawrence River in early French settlement and Indigenous alliances.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'St. Lawrence River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/st-lawrence-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'St. Lawrence River',
      url: 'https://en.wikipedia.org/wiki/St._Lawrence_River',
      description: 'Historic waterway significance in eastern Canada.',
    }
  ],
  'cmlhaslqp000mm2zh1z4uc8lw': [
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal on the River St. Laurence through the Continent of North America to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Primary narrative of Mackenzie\\',
    },
    {
      authorSource: 'Hudson\\',
      title: 'Mackenzie River District Records',
      publisher: 'HBCA B.200/a series',
      description: 'Company records referencing Mackenzie River posts like Fort Good Hope and Fort Norman in HBC trade.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Dene (Slavey/Gwich\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Mackenzie River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/mackenzie-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Mackenzie River',
      url: 'https://en.wikipedia.org/wiki/Mackenzie_River',
      description: 'Historic significance as Canada\\',
    }
  ],
  'cmlhaslqs000om2zh7u6tr7m8': [
    {
      authorSource: 'Fraser Simon',
      title: 'The Letters and Journals of Simon Fraser 1806–1808 ed. W. Kaye Lamb',
      publisher: 'Macmillan of Canada',
      year: '1960',
      description: 'Primary journal entries on Fraser\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Analysis of Fraser River as a central corridor in New Caledonia fur trade and Stó:lō relations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fraser River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fraser-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fraser River',
      url: 'https://en.wikipedia.org/wiki/Fraser_River',
      description: 'Historic waterway significance.',
    }
  ],
  'cmlhaslqu000qm2zh7ssejohe': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Ottawa River (Kichi Sibi) during Champlain\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Ottawa River as the main Montreal–Lake Nipissing–Lake Huron fur trade corridor.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Ottawa River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/ottawa-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Ottawa River',
      url: 'https://en.wikipedia.org/wiki/Ottawa_River',
      description: 'Historic waterway significance in eastern Canada.',
    }
  ],
  'cmlhaslqy000sm2zhxfks60fd': [
    {
      authorSource: 'Hudson\\',
      title: 'Saskatchewan River Post Journals (Fort Carlton/Edmonton)',
      publisher: 'HBCA B.27/a and B.60/a series',
      description: 'Primary records from key Saskatchewan River (Kisiskāciwani-sīpiy) posts documenting HBC operations and Plains Cree trade.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Hunters Trappers Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical analysis of Saskatchewan River as a pemmican provisioning corridor and Cree/Assiniboine networks.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Saskatchewan River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/saskatchewan-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Saskatchewan River',
      url: 'https://en.wikipedia.org/wiki/Saskatchewan_River',
      description: 'Historic waterway significance in western Canada.',
    }
  ],
  'cmlhaslr1000um2zh1ohr52f9': [
    {
      authorSource: 'Hudson\\',
      title: 'Churchill River (Saskatchewan) Records',
      publisher: 'HBCA B.42/a series (related)',
      description: 'Primary references to Churchill River (Missinipi) as a key fur trade corridor linking Reindeer Lake to Hudson Bay.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree and Dene use of Churchill River in northern trade networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Churchill River (Saskatchewan)',
      url: 'https://en.wikipedia.org/wiki/Churchill_River_(Saskatchewan)',
      description: 'Historic river significance.',
    }
  ],
  'cmlhaslr7000wm2zhi88te1r4': [
    {
      authorSource: 'Thompson David',
      title: 'David Thompson\\',
      publisher: 'Champlain Society',
      year: '1916',
      description: 'Primary journal entries on Thompson\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Analysis of Columbia River as a central HBC corridor from Rocky Mountains to Pacific.',
    },
    {
      authorSource: 'Nisbet Jack',
      title: 'The Mapmaker\\',
      publisher: 'University of Oklahoma Press',
      year: '2005',
      description: 'Chapter on Thompson\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Columbia River',
      url: 'https://en.wikipedia.org/wiki/Columbia_River',
      description: 'Historic waterway significance in fur trade and Indigenous history.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Columbia River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/columbia-river',
      description: 'Overview of the river\\',
    }
  ],
  'cmlhaslra000ym2zh4pyu55je': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary references to Lake Superior (Gichigami) during early French exploration and Ojibwe/Anishinaabe relations.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Lake Superior as the gateway to the western interior via Grand Portage and Kaministiquia routes.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Superior',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-superior',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Superior',
      url: 'https://en.wikipedia.org/wiki/Lake_Superior',
      description: 'Historic significance in Great Lakes fur trade.',
    }
  ],
  'cmlhaslrc0010m2zhzbcapn1v': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary accounts of Champlain\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Lake Huron as a key Great Lakes fur trade corridor linking to Ottawa River routes.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Huron',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-huron',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Huron',
      url: 'https://en.wikipedia.org/wiki/Lake_Huron',
      description: 'Historic waterway significance in Great Lakes system.',
    }
  ],
  'cmlhaslre0012m2zhg9f595d4': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary accounts of Champlain\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Analysis of Lake Ontario as a strategic corridor in early French fur trade and St. Lawrence connections.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Ontario',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-ontario',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Ontario',
      url: 'https://en.wikipedia.org/wiki/Lake_Ontario',
      description: 'Historic waterway significance in Great Lakes.',
    }
  ],
  'cmlhaslri0014m2zhlrrx8pqe': [
    {
      authorSource: 'Hudson\\',
      title: 'Lake Winnipeg Records',
      publisher: 'HBCA B.239/a series (related York Factory)',
      description: 'Primary references to Lake Winnipeg (Win-nipi) as a key HBC inland lake connecting York Factory to the Saskatchewan River system.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical context for Cree and Ojibwe trade networks on Lake Winnipeg.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Winnipeg',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-winnipeg',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Winnipeg',
      url: 'https://en.wikipedia.org/wiki/Lake_Winnipeg',
      description: 'Historic waterway significance.',
    }
  ],
  'cmlhaslrl0016m2zh71casjqv': [
    {
      authorSource: 'Hudson\\',
      title: 'Great Slave Lake Records (Fort Resolution/Providence)',
      publisher: 'HBCA B.181/a and B.200/a series',
      description: 'Primary references to Great Slave Lake (Tu Nedhé) as a major HBC Mackenzie District lake and trading hub.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade community and life around Great Slave Lake.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Great Slave Lake',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/great-slave-lake',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Great Slave Lake',
      url: 'https://en.wikipedia.org/wiki/Great_Slave_Lake',
      description: 'Historic significance in Northwest Territories.',
    }
  ],
  'cmlhaslro0018m2zh54ssf898': [
    {
      authorSource: 'Hudson\\',
      title: 'Great Bear Lake Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Great Bear Lake (Sahtu) as a northern HBC outpost and Sahtu Dene trade area.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Sahtu Dene trade and life around Great Bear Lake.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Great Bear Lake',
      url: 'https://en.wikipedia.org/wiki/Great_Bear_Lake',
      description: 'Historic significance in northern Canada.',
    }
  ],
  'cmlhaslrq001am2zhud0snm8t': [
    {
      authorSource: 'Hudson\\',
      title: 'Lake Athabasca Records (Fort Chipewyan)',
      publisher: 'HBCA B.39/a series',
      description: 'Primary records from Fort Chipewyan on Lake Athabasca (Desnethché) as a key HBC post in the Athabasca–Mackenzie district.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Chipewyan (Dene) trade and community at Lake Athabasca.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Athabasca',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-athabasca',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Athabasca',
      url: 'https://en.wikipedia.org/wiki/Lake_Athabasca',
      description: 'Historic significance in northern Alberta/Saskatchewan.',
    }
  ],
  'cmlhaslrt001cm2zh9tknhhbe': [
    {
      authorSource: 'Hudson\\',
      title: 'Hudson Bay Records (York Factory/Prince of Wales Fort)',
      publisher: 'HBCA B.239/a and B.42/a series',
      description: 'Primary references to Hudson Bay (Wînipekw Kihci-kâmiy) as the central HBC maritime gateway and depot for inland trade.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Comprehensive history of Hudson Bay posts and Cree/Inuit trade networks.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Hudson Bay',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/hudson-bay',
      description: 'Overview of the bay\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Hudson Bay',
      url: 'https://en.wikipedia.org/wiki/Hudson_Bay',
      description: 'Historic significance in northern Canada.',
    }
  ],
  'cmlhaslrv001em2zheht25x94': [
    {
      authorSource: 'Hudson\\',
      title: 'James Bay Records (Fort Rupert/Moose Factory)',
      publisher: 'HBCA B.135/a and B.135/a series',
      description: 'Primary records from James Bay (Wînipekw) posts documenting early HBC trade with Cree communities.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Historical study of James Bay as the original HBC focus area.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'James Bay',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/james-bay',
      description: 'Overview of the bay in early fur trade and Cree history.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'James Bay',
      url: 'https://en.wikipedia.org/wiki/James_Bay',
      description: 'Historic significance in northern Quebec/Ontario.',
    }
  ],
  'cmlhasls4001zm2zhg7ahjwlx': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Quebec City (Kébec) as Champlain\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Detailed chapter on Quebec City\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Quebec City',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/quebec-city',
      description: 'Overview of the city\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Quebec City',
      url: 'https://en.wikipedia.org/wiki/Quebec_City',
      description: 'Historic settlement on the St. Lawrence River.',
    }
  ],
  'cmlhasls40021m2zhu35xikyc': [
    {
      authorSource: 'Hudson\\',
      title: 'York Factory / Kichiwasinahikan Journals',
      publisher: 'HBCA B.239/a series',
      description: 'Primary records from York Factory (Kichiwasinahikan) on Hudson Bay as the main HBC depot for over two centuries.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Comprehensive history of York Factory as the gateway to the interior fur trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'York Factory',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/york-factory',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'York Factory',
      url: 'https://en.wikipedia.org/wiki/York_Factory',
      description: 'Historic significance as HBC headquarters on Hudson Bay.',
    }
  ],
  'cmlhasls40022m2zhaovlkwt2': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Churchill Post Journals',
      publisher: 'HBCA B.42/a series',
      description: 'Primary records from Fort Churchill on Hudson Bay as a major early HBC post and gateway to the interior.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Historical study of Fort Churchill\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Churchill',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-churchill',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Churchill',
      url: 'https://en.wikipedia.org/wiki/Fort_Churchill',
      description: 'Historic fort and Hudson Bay location.',
    }
  ],
  'cmlhasls40024m2zhk53dsecy': [
    {
      authorSource: 'Hudson\\',
      title: 'Grand Portage Journals',
      publisher: 'HBCA B.105/a series (related)',
      description: 'Primary records from Grand Portage (Gichi-Onigaming) on Lake Superior as the major NWC/HBC transshipment point before Fort William.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1939',
      description: 'Detailed history of Grand Portage as the gateway to the west via the Pigeon River route.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Grand Portage\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Grand Portage National Monument (U.S. side but related)',
      url: 'https://www.nps.gov/grpo/index.htm',
      description: 'Interpretive history and Ojibwe cultural significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Grand Portage',
      url: 'https://en.wikipedia.org/wiki/Grand_Portage',
      description: '_Minnesota',
    }
  ],
  'cmlhasls40025m2zh8ceyw7jl': [
    {
      authorSource: 'Hudson\\',
      title: 'Cumberland House Post Journals',
      publisher: 'HBCA B.49/a series',
      description: 'Primary daily records from Cumberland House (Wāskahikanihk) on the Saskatchewan River as the first inland HBC post established in 1774.',
    },
    {
      authorSource: 'Rich E.E.',
      title: 'The History of the Hudson\\',
      publisher: 'Hudson\\',
      year: '1958',
      description: 'Company history detailing Cumberland House\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'Yale University Press',
      year: '1974',
      description: 'Ethnohistorical case study of Cumberland House and Indigenous provisioning networks.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Cumberland House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/cumberland-house',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Cumberland House',
      url: 'https://en.wikipedia.org/wiki/Cumberland_House',
      description: '_Saskatchewan',
    }
  ],
  'cmlhasls40026m2zhpi43jsew': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Edmonton Post Journals',
      publisher: 'HBCA B.60/a series',
      description: 'Primary records of Fort Edmonton (Amiskwacîwâskahikan) as the principal HBC post on the North Saskatchewan River after 1821.',
    },
    {
      authorSource: 'Reeves Brian O.K.',
      title: 'Edmonton House and Fort Augustus: An Archaeological and Historical Study',
      publisher: 'National Historic Parks and Sites Branch',
      year: '1974',
      description: 'Comparative archaeological report on successive forts at the Edmonton site.',
    },
    {
      authorSource: 'Kiefer Eric',
      title: 'Fort Edmonton: A Story of People and Place',
      publisher: 'Fort Edmonton Park',
      year: '2005',
      description: 'Historical synthesis of the forts\\',
    },
    {
      authorSource: 'Moffat Leah',
      title: 'Cree Cosmology and Fort Edmonton Place Names',
      publisher: 'Ethnohistory vol. 56 no. 4',
      year: '2009',
      description: 'Indigenous (Cree) perspectives on the site\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Edmonton',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-edmonton',
      description: 'Overview of its importance as HBC western headquarters.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Edmonton',
      url: 'https://en.wikipedia.org/wiki/Fort_Edmonton',
      description: 'Chronology of the forts and Saskatchewan River trade role.',
    }
  ],
  'cmlhasls40027m2zhq13ab7xs': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Chipewyan Post Journals',
      publisher: 'HBCA B.39/a series',
      description: 'Primary records from Fort Chipewyan (K\\',
    },
    {
      authorSource: 'Glover Richard ed.',
      title: 'Samuel Hearne\\',
      publisher: 'Champlain Society',
      year: '1958',
      description: 'Early context for the region and Athabasca trade routes before Fort Chipewyan\\',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Chipewyan (Dene) trade and community at Fort Chipewyan.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Chipewyan',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-chipewyan',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Chipewyan',
      url: 'https://en.wikipedia.org/wiki/Fort_Chipewyan',
      description: 'Historic trading post and community on Lake Athabasca.',
    }
  ],
  'cmlhasls40028m2zh4aji898k': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Good Hope Post Journals',
      publisher: 'HBCA B.80/a series',
      description: 'Primary daily records from Fort Good Hope (Rádeyı̨lı̨kǫ́ę́) on the Mackenzie River documenting HBC operations in the far north and Dene (Slavey) trade.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade, community, and life around Fort Good Hope.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Good Hope',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-good-hope',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Good Hope',
      url: 'https://en.wikipedia.org/wiki/Fort_Good_Hope',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhasls40029m2zhhfgaamg9': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Langley Journals',
      publisher: 'HBCA B.113/a series',
      description: 'Primary daily records from Fort Langley on the lower Fraser River as the first HBC post on the Pacific Slope and key salmon trade centre.',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Chapter on Fort Langley\\',
    },
    {
      authorSource: 'Harris Cole',
      title: 'The Resettlement of British Columbia: Essays on Colonialism and Geographical Change',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Context on Fort Langley as a bridge between interior fur trade and Pacific maritime networks.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort Langley National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/langley',
      description: 'Interpretive history reconstruction and Stó:lō Indigenous relations.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Langley',
      url: 'https://en.wikipedia.org/wiki/Fort_Langley',
      description: 'Significance as birthplace of British Columbia colony and Fraser River post.',
    }
  ],
  'cmlhasls4002am2zhut4b7lsm': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Témiscamingue / Obadjiwan Journals',
      publisher: 'HBCA B.216/a series',
      description: 'Primary records from Fort Témiscamingue (Obadjiwan) on Lake Timiskaming / Ottawa River as a strategic HBC post linking Montreal to the west.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Fort Témiscamingue\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Témiscamingue',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-temiscamingue',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Témiscamingue',
      url: 'https://en.wikipedia.org/wiki/Fort_T%C3%A9miscamingue',
      description: 'Historic site and Ottawa River portage importance.',
    }
  ],
  'cmlhbjrpt0001m2mb70w5ub4a': [
    {
      authorSource: 'Hudson\\',
      title: 'Nelson River Records',
      publisher: 'HBCA B.239/a series (related York Factory)',
      description: 'Primary references to Nelson River (Sipiwesk) as a major HBC inland corridor linking York Factory to Lake Winnipeg and Saskatchewan systems.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical analysis of Nelson River trade networks and Cree middleman roles.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Nelson River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/nelson-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Nelson River',
      url: 'https://en.wikipedia.org/wiki/Nelson_River',
      description: 'Historic waterway significance.',
    }
  ],
  'cmlhbjrpw0003m2mbmmpa8102': [
    {
      authorSource: 'Hudson\\',
      title: 'Athabasca River Records',
      publisher: 'HBCA B.39/a series (related Fort Chipewyan)',
      description: 'Primary references to Athabasca River (Ayaskatawa-sipi) as a key corridor linking Lake Athabasca to the Mackenzie system and fur trade posts.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Chipewyan and other Dene trade along the Athabasca River.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Athabasca River',
      url: 'https://en.wikipedia.org/wiki/Athabasca_River',
      description: 'Historic significance in northern Alberta fur trade.',
    },
    {
      authorSource: 'Hudson\\',
      title: 'Moose Factory Post Journals',
      publisher: 'HBCA B.135/a series',
      description: 'Primary daily records from Moose Factory on the Moose River as one of the original HBC James Bay posts established in 1673 and a key Cree trade centre.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Historical study of Moose Factory\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Moose Factory',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/moose-factory',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Moose Factory',
      url: 'https://en.wikipedia.org/wiki/Moose_Factory',
      description: 'Historic significance as one of the oldest HBC posts.',
    }
  ],
  'cmlhbjrpy0005m2mbsanafmlo': [
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal... to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Primary account of Mackenzie\\',
    },
    {
      authorSource: 'Hudson\\',
      title: 'Peace River Records',
      publisher: 'HBCA various series',
      description: 'References to Peace River in HBC/NWC trade networks and posts like Fort Vermilion.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Peace River',
      url: 'https://en.wikipedia.org/wiki/Peace_River_(Canada)',
      description: 'Historic significance in northern BC/Alberta fur trade.',
    }
  ],
  'cmlhbjrq10007m2mb166687ob': [
    {
      authorSource: 'Hudson\\',
      title: 'Red River Records',
      publisher: 'HBCA B.235/a series',
      description: 'Primary references to Red River (Miskosipi) as the central corridor for Red River Settlement and Fort Garry operations.',
    },
    {
      authorSource: 'Bumsted J.M.',
      title: 'The Red River Settlement and the Lord Selkirk Papers',
      publisher: 'Manitoba Historical Society',
      year: '1999',
      description: 'Historical analysis of Red River in Métis society fur trade and colony development.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Red River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/red-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Red River of the North',
      url: 'https://en.wikipedia.org/wiki/Red_River_of_the_North',
      description: 'Historic waterway significance.',
    }
  ],
  'cmlhbjrq30009m2mbjvc52rym': [
    {
      authorSource: 'Hudson\\',
      title: 'Assiniboine River Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Assiniboine River as a key fur trade and pemmican provisioning corridor for Red River and Fort Garry.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'Yale University Press',
      year: '1974',
      description: 'Ethnohistorical analysis of Assiniboine River trade networks and Plains Cree/Assiniboine roles.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Assiniboine River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/assiniboine-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Assiniboine River',
      url: 'https://en.wikipedia.org/wiki/Assiniboine_River',
      description: 'Historic waterway significance in Manitoba/Saskatchewan.',
    }
  ],
  'cmlhbjrq5000bm2mbpbrh6i7v': [
    {
      authorSource: 'Hudson\\',
      title: 'Yukon River Records',
      publisher: 'HBCA B.240/a series (related Fort Yukon)',
      description: 'Primary references to Yukon River (Kwanlin) as a northern HBC corridor linking Fort Yukon to the Mackenzie system.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Gwich\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Yukon River',
      url: 'https://en.wikipedia.org/wiki/Yukon_River',
      description: 'Historic waterway significance in northern Canada.',
    }
  ],
  'cmlhbjrqa000dm2mb7n6w7y4w': [
    {
      authorSource: 'Hearne Samuel',
      title: 'A Journey from Prince of Wales\\',
      publisher: 'Champlain Society',
      year: '1958 (reprint of 1795)',
      description: 'Primary account of Hearne\\',
    },
    {
      authorSource: 'McGoogan Ken',
      title: 'Ancient Mariner: The Amazing Adventures of Samuel Hearne',
      publisher: 'Carroll & Graf',
      year: '2004',
      description: 'Modern analysis of Coppermine River exploration and Dene oral perspectives.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Coppermine River',
      url: 'https://en.wikipedia.org/wiki/Coppermine_River',
      description: 'Historic significance in Arctic exploration.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Coppermine River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/coppermine-river',
      description: 'Overview of the river in Arctic exploration history.',
    }
  ],
  'cmlhbjrqd000fm2mb9j2kl8w0': [
    {
      authorSource: 'Franklin John',
      title: 'Narrative of a Journey to the Shores of the Polar Sea in the Years 1819 20 21 and 22',
      publisher: 'John Murray',
      year: '1823',
      description: 'Primary account referencing Thelon River during Arctic overland exploration.',
    },
    {
      authorSource: 'McGoogan Ken',
      title: 'Ancient Mariner: The Amazing Adventures of Samuel Hearne',
      publisher: 'Carroll & Graf',
      year: '2004',
      description: 'Broader context on Thelon River in northern exploration and Dene/Inuit knowledge.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Thelon River',
      url: 'https://en.wikipedia.org/wiki/Thelon_River',
      description: 'Historic significance in Nunavut.',
    }
  ],
  'cmlhbjrqg000hm2mbrxd1csg3': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Saguenay River (Saguenay) as an early French trading corridor linking Tadoussac to the interior.',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Saguenay River in early French trade and Innu (Montagnais) relations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Saguenay River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/saguenay-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Saguenay River',
      url: 'https://en.wikipedia.org/wiki/Saguenay_River',
      description: 'Historic significance in eastern Canada.',
    }
  ],
  'cmlhbjrqk000jm2mbu4c80xzn': [
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Saint John River (Wolastoq) in early French Acadian settlement and Wolastoqiyik (Maliseet) relations.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Saint John River as a key Acadian fur trade corridor.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Saint John River',
      url: 'https://en.wikipedia.org/wiki/Saint_John_River',
      description: 'Historic significance in New Brunswick.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Saint John River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/saint-john-river',
      description: 'Overview of the river\\',
    }
  ],
  'cmlhbjrqm000lm2mb54fxoup5': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary references to Lake Erie (Erielhonan) during Champlain\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Lake Erie in early fur trade networks and connections to Niagara and Detroit River routes.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Erie',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-erie',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Erie',
      url: 'https://en.wikipedia.org/wiki/Lake_Erie',
      description: 'Historic significance in Great Lakes trade.',
    }
  ],
  'cmlhbjrqo000nm2mb16337n49': [
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Lake Michigan (Michi-gami) in early French fur trade networks and connections to Lake Huron.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Michigan',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-michigan (related Great Lakes)',
      description: 'Overview of the lake\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Michigan',
      url: 'https://en.wikipedia.org/wiki/Lake_Michigan',
      description: 'Historic significance in Great Lakes system.',
    }
  ],
  'cmlhbjrqs000pm2mb2n5b8ozi': [
    {
      authorSource: 'Hudson\\',
      title: 'Reindeer Lake Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Reindeer Lake (Atik Sakahikan) as a northern HBC post and lake in the Churchill River system.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree and Dene trade around Reindeer Lake.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Reindeer Lake',
      url: 'https://en.wikipedia.org/wiki/Reindeer_Lake',
      description: 'Historic significance in northern Saskatchewan/Manitoba.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Reindeer Lake',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/reindeer-lake',
      description: 'Overview of the lake\\',
    }
  ],
  'cmlhbjrqu000rm2mb2jzjv5dc': [
    {
      authorSource: 'Hudson\\',
      title: 'Lake Nipigon Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Lake Nipigon (Animbiigoo Zaaga\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Lake Nipigon in early western fur trade routes.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Nipigon',
      url: 'https://en.wikipedia.org/wiki/Lake_Nipigon',
      description: 'Historic significance in northwestern Ontario.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lake Nipigon',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lake-nipigon',
      description: 'Overview of the lake\\',
    }
  ],
  'cmlhbjrqx000tm2mb8efa6a4y': [
    {
      authorSource: 'Hudson\\',
      title: 'Lesser Slave Lake Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Lesser Slave Lake (Utikuma) as a key HBC post and portage point on the Peace River route.',
    },
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal... to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Context on Lesser Slave Lake during Mackenzie\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lesser Slave Lake',
      url: 'https://en.wikipedia.org/wiki/Lesser_Slave_Lake',
      description: 'Historic significance in northern Alberta fur trade.',
    }
  ],
  'cmlhbjrr2000vm2mb4xb3au6o': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort William (Thunder Bay) Journals',
      publisher: 'HBCA B.105/a series',
      description: 'Primary records from Fort William on Lake Superior as HBC headquarters after 1821 merger.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1939',
      description: 'Detailed history of Fort William\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort William National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/on/fortwilliam',
      description: 'Reconstruction archaeology and interpretive programming.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort William Historical Park',
      url: 'https://en.wikipedia.org/wiki/Fort_William_Historical_Park',
      description: 'Modern reconstruction of the fur trade legacy.',
    }
  ],
  'cmlhbjrr5000xm2mbkhf0cqiw': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Garry Post Journals',
      publisher: 'HBCA B.235/a series',
      description: 'Primary records from Fort Garry on the Red River as the main HBC administrative centre in the Red River Settlement.',
    },
    {
      authorSource: 'Bumsted J.M.',
      title: 'The Red River Settlement and the Lord Selkirk Papers',
      publisher: 'Manitoba Historical Society',
      year: '1999',
      description: 'Historical analysis of Fort Garry\\',
    },
    {
      authorSource: 'Sprague D.N. and Frye R.P.',
      title: 'The Genealogy of the First Métis Nation',
      publisher: 'Pemmican Publications',
      year: '1983',
      description: 'Demographic study of Métis population at Fort Garry.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'The Forks / Fort Garry National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/mb/forks',
      description: 'Interpretive history and Métis heritage at the site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Garry',
      url: 'https://en.wikipedia.org/wiki/Fort_Garry',
      description: 'Historic significance on the Red River.',
    }
  ],
  'cmlhbjrr8000zm2mbjknynnon': [
    {
      authorSource: 'Hudson\\',
      title: 'Methye Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Methye Portage (La Loche) as the critical watershed divide between Hudson Bay and Arctic drainage on the Churchill River.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Methye Portage\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree use of Methye Portage in northern trade networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Methye Portage',
      url: 'https://en.wikipedia.org/wiki/Methye_Portage',
      description: 'Historic portage significance in Saskatchewan.',
    }
  ],
  'cmlhbjrrd0013m2mbr25pwdi0': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Albany Post Journals',
      publisher: 'HBCA B.3/a series',
      description: 'Primary daily records of Fort Albany (Kashechewan) on James Bay including Albany River trade with Cree communities.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Historical study of Fort Albany as one of the oldest HBC establishments.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Albany',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-albany',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Albany First Nation',
      url: 'https://en.wikipedia.org/wiki/Fort_Albany_First_Nation',
      description: 'Community and historic fort site.',
    }
  ],
  'cmlhbjrrf0015m2mbj2bojm5s': [
    {
      authorSource: 'Hudson\\',
      title: 'Norway House Post Journals',
      publisher: 'HBCA B.154/a series',
      description: 'Primary records from Norway House (Kinosew Sipi) on Lake Winnipeg as a major HBC provisioning and transshipment post.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical context for Cree trade networks and pemmican provisioning at Norway House.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Norway House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/norway-house',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Norway House',
      url: 'https://en.wikipedia.org/wiki/Norway_House',
      description: 'Historic significance in Manitoba fur trade.',
    }
  ],
  'cmlhbjrrk0019m2mbo76o9uph': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Tadoussac (Totouskak) as an early French trading post on the St. Lawrence River.',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Tadoussac as the first permanent French trading site and Montagnais/Innu relations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Tadoussac',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/tadoussac',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Tadoussac',
      url: 'https://en.wikipedia.org/wiki/Tadoussac',
      description: 'Historic trading post and early New France site.',
    }
  ],
  'cmlhbjrrn001bm2mbmbhxd2wx': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort St. James / Nak\\',
      publisher: 'HBCA B.188/a series',
      description: 'Primary records from Fort St. James (Nak\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Detailed history of Fort St. James\\',
    },
    {
      authorSource: 'Fraser Simon',
      title: 'The Letters and Journals of Simon Fraser 1806–1808 ed. W. Kaye Lamb',
      publisher: 'Macmillan of Canada',
      year: '1960',
      description: 'Primary journal references to early establishment and operations at the site.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort St. James National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/stjames',
      description: 'Reconstruction interpretive history and Nak\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort St. James',
      url: 'https://en.wikipedia.org/wiki/Fort_St._James',
      description: 'Longest-operating fur post in BC on Fraser River system.',
    }
  ],
  'cmlhbjrrri0017m2mbfts7d8is': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Simpson Post Journals',
      publisher: 'HBCA B.200/a series',
      description: 'Primary records from Fort Simpson (Łíídlįį Kųę́) on the Mackenzie River as the administrative centre for the Mackenzie District.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade and life around Fort Simpson.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Simpson',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-simpson',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Simpson (Northwest Territories)',
      url: 'https://en.wikipedia.org/wiki/Fort_Simpson',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhci06g0003m2rxvk2z3kyo': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Baie des Chaleurs (Mawiomi\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Baie des Chaleurs in early French exploration and Acadian history.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Baie des Chaleurs',
      url: 'https://www.pc.gc.ca (related Gaspé sites)',
      description: 'Interpretive information on cultural and historic significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Chaleur Bay',
      url: 'https://en.wikipedia.org/wiki/Chaleur_Bay',
      description: 'Historic bay in Gulf of St. Lawrence.',
    }
  ],
  'cmlhci06l0005m2rxruhm0g4o': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Gaspé Bay (Gespeg) during Cartier\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Gaspé Bay in early French exploration and Acadian history.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Gaspé Bay',
      url: 'https://www.pc.gc.ca (related Cartier sites)',
      description: 'Interpretive information on cultural site and early European landings.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Gaspé Bay',
      url: 'https://en.wikipedia.org/wiki/Gasp%C3%A9_Bay',
      description: 'Historic bay significance in Quebec.',
    }
  ],
  'cmlhci06o0007m2rx0b9040b1': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Strait of Belle Isle during Champlain\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Strait of Belle Isle in early European fishing and Basque whaling history.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Strait of Belle Isle',
      url: 'https://www.pc.gc.ca (related Newfoundland/Labrador sites)',
      description: 'Interpretive information on cultural and historic significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Strait of Belle Isle',
      url: 'https://en.wikipedia.org/wiki/Strait_of_Belle_Isle',
      description: 'Historic strait significance in Atlantic Canada.',
    }
  ],
  'cmlhci06q0009m2rx52k6015h': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Bonavista Bay during Champlain\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Bonavista Bay in early European fishing and contact history.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Cape Bonavista Provincial Historic Site',
      url: 'https://www.pc.gc.ca (related Newfoundland sites)',
      description: 'Interpretive information on Bonavista Bay cultural sites.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bonavista Bay',
      url: 'https://en.wikipedia.org/wiki/Bonavista_Bay',
      description: 'Historic bay significance in Newfoundland.',
    }
  ],
  'cmlhci06u000bm2rx0mhic71i': [
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Placentia Bay in early French Newfoundland settlement and fishing.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Placentia Bay',
      url: 'https://www.pc.gc.ca (related Newfoundland sites)',
      description: 'Interpretive information on cultural and historic significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Placentia Bay',
      url: 'https://en.wikipedia.org/wiki/Placentia_Bay',
      description: 'Historic bay significance in Newfoundland.',
    }
  ],
  'cmlhci06w000dm2rx3bn9gj7e': [
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Nootka Sound (Yuquot) as a major site of early European–Nuu-chah-nulth contact and Spanish/British claims.',
    },
    {
      authorSource: 'Beaglehole J.C. ed.',
      title: 'The Journals of Captain James Cook Vol. III',
      publisher: 'Hakluyt Society',
      year: '1967',
      description: 'Primary entries on Cook\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Nootka Sound National Historic Sites',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/nootka',
      description: 'Interpretive information on the sound cultural site and Nuu-chah-nulth heritage.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Nootka Sound',
      url: 'https://en.wikipedia.org/wiki/Nootka_Sound',
      description: 'Historic significance in early Pacific Northwest exploration.',
    }
  ],
  'cmlhci06z000fm2rx9a0q3kpo': [
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Annotations on Vancouver\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Broader context on Burrard Inlet in Pacific Northwest exploration.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Burrard Inlet',
      url: 'https://www.pc.gc.ca (related Vancouver sites)',
      description: 'Interpretive information on Tsleil-Waututh cultural site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Burrard Inlet',
      url: 'https://en.wikipedia.org/wiki/Burrard_Inlet',
      description: 'Historic inlet significance in BC.',
    }
  ],
  'cmlhci072000hm2rxsiy2pofi': [
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Annotations on Vancouver\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Broader context on English Bay in Pacific Northwest exploration.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'English Bay',
      url: 'https://www.pc.gc.ca (related Vancouver sites)',
      description: 'Interpretive information on cultural site and Indigenous heritage.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'English Bay',
      url: 'https://en.wikipedia.org/wiki/English_Bay',
      description: 'Historic bay significance in Vancouver.',
    }
  ],
  'cmlhci075000jm2rxv7atyc59': [
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Friendly Cove (Yuquot) as a major site of early European–Nuu-chah-nulth contact.',
    },
    {
      authorSource: 'Beaglehole J.C. ed.',
      title: 'The Journals of Captain James Cook Vol. III',
      publisher: 'Hakluyt Society',
      year: '1967',
      description: 'Primary entries on Cook\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Yuquot / Friendly Cove',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/nootka',
      description: 'Interpretive information on cultural site and Nuu-chah-nulth heritage.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Yuquot',
      url: 'https://en.wikipedia.org/wiki/Yuquot',
      description: 'Historic significance in Nootka Sound.',
    }
  ],
  'cmlhci078000lm2rxus8do5zj': [
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Annotations on Vancouver\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Context on Juan de Fuca Strait in HBC coastal operations.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Strait of Juan de Fuca',
      url: 'https://en.wikipedia.org/wiki/Strait_of_Juan_de_Fuca',
      description: 'Historic significance in Pacific Northwest.',
    }
  ],
  'cmlhci07b000nm2rxfad3b0er': [
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Annotations on Vancouver\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Georgia Strait in early European–Salish contact.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Strait of Georgia',
      url: 'https://en.wikipedia.org/wiki/Strait_of_Georgia',
      description: 'Historic significance in BC coastal exploration.',
    }
  ],
  'cmlhci07e000pm2rxpaiz59r9': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Context on Queen Charlotte Sound (Hecate) in HBC coastal operations and Haida/Heiltsuk relations.',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Broader context on Queen Charlotte Sound in early Pacific Northwest exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Queen Charlotte Sound',
      url: 'https://en.wikipedia.org/wiki/Queen_Charlotte_Sound_(Canada)',
      description: 'Historic sound significance in BC.',
    }
  ],
  'cmlhci07g000rm2rxgqu76lmi': [
    {
      authorSource: 'Dunmore John ed.',
      title: 'The Journal of Jean-François de Galaup comte de La Pérouse',
      publisher: 'Hakluyt Society',
      year: '1994–1995',
      description: 'Primary journal entries on La Pérouse\\',
    },
    {
      authorSource: 'Engstrand Iris H.W.',
      title: 'Spanish Scientists in the New World: The Eighteenth-Century Expeditions',
      publisher: 'University of Washington Press',
      year: '1981',
      description: 'Context on La Pérouse\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'La Pérouse Memorial (Lituya Bay)',
      url: 'https://www.pc.gc.ca (related Pacific sites)',
      description: 'Interpretive information on the memorial and cultural site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lituya Bay',
      url: 'https://en.wikipedia.org/wiki/Lituya_Bay',
      description: 'Historical significance of La Pérouse\\',
    }
  ],
  'cmlhci08p0017m2rxhlfgplt0': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Champlain\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on early European contact and Bonavista Bay in Newfoundland exploration history.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Cape Bonavista Provincial Historic Site',
      url: 'https://www.pc.gc.ca (related Newfoundland sites)',
      description: 'Interpretive information on the cultural site and early European landings.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Cape Bonavista',
      url: 'https://en.wikipedia.org/wiki/Cape_Bonavista',
      description: 'Historical significance and potential Cabot/early explorer associations.',
    }
  ],
  'cmlhci08s0019m2rx3b2ipe6i': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Voyages of Jacques Cartier',
      publisher: 'Public Archives of Canada',
      year: '1924',
      description: 'Scholarly edition of Cartier\\',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Contextual chapter on Cartier\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Cartier\\',
      url: 'https://www.pc.gc.ca (related Cartier sites)',
      description: 'Interpretive information on the cultural site and 1534 event.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Jacques Cartier',
      url: 'https://en.wikipedia.org/wiki/Jacques_Cartier#First_voyage',
      description: 'Section on Gaspé Bay landing and cross erection.',
    }
  ],
  'cmlhci08v001bm2rx1qzcbb7o': [
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Port-Royal (Habitation) as the first permanent French settlement in Acadia on the St. Lawrence River.',
    },
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Port-Royal Habitation and early Acadian trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Port-Royal',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/port-royal',
      description: 'Overview of the habitation\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Port-Royal',
      url: 'https://en.wikipedia.org/wiki/Port-Royal',
      description: '_Nova_Scotia',
    }
  ],
  'cmlhci08x001dm2rxttfhbqjr': [
    {
      authorSource: 'Barkham Selma Huxley',
      title: 'The Basque Whaling Stations of Labrador: A Preliminary Report',
      publisher: 'Arctic Institute of North America',
      year: '1984',
      description: 'Scholarly report on Red Bay Basque operations and archaeological findings.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Red Bay Basque Whaling Station National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/nl/redbay',
      description: 'Interpretive history and Basque cultural significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Red Bay',
      url: 'https://en.wikipedia.org/wiki/Red_Bay',
      description: '_Newfoundland_and_Labrador',
    }
  ],
  'cmlhci092001fm2rxed77jk9j': [
    {
      authorSource: 'Beaglehole J.C. ed.',
      title: 'The Journals of Captain James Cook Vol. III',
      publisher: 'Hakluyt Society',
      year: '1967',
      description: 'Primary entries on Cook\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Friendly Cove as a key site of early European–Nuu-chah-nulth contact.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Yuquot / Friendly Cove',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/nootka',
      description: 'Interpretive information on cultural site and Cook\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Yuquot',
      url: 'https://en.wikipedia.org/wiki/Yuquot',
      description: 'Historic significance in Nootka Sound.',
    }
  ],
  'cmlhci095001hm2rxh06cgnow': [
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Spanish Banks Beach as a site of early European–Indigenous contact in English Bay.',
    },
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Annotations on Vancouver\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Spanish Banks',
      url: 'https://www.pc.gc.ca (related Vancouver sites)',
      description: 'Interpretive information on cultural site and early exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Spanish Banks',
      url: 'https://en.wikipedia.org/wiki/Spanish_Banks',
      description: 'Historical significance in English Bay.',
    }
  ],
  'cmlhci098001jm2rxi0if729k': [
    {
      authorSource: 'Wagner Henry R.',
      title: 'The Spanish Explorations in the Strait of Juan de Fuca',
      publisher: 'Fine Arts Press',
      year: '1933',
      description: 'Primary Spanish documents on Fort San Miguel establishment at Nootka Sound in 1789.',
    },
    {
      authorSource: 'Cook Warren L.',
      title: 'Flood Tide of Empire: Spain and the Pacific Northwest 1543–1819',
      publisher: 'Yale University Press',
      year: '1973',
      description: 'Chapter on Spanish fortification at Nootka and Fort San Miguel during the Nootka Crisis.',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on Fort San Miguel and Nuu-chah-nulth contact at Nootka Sound.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Nootka Sound National Historic Sites',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/nootka',
      description: 'Interpretive information on the Spanish fort site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Nootka Sound',
      url: 'https://en.wikipedia.org/wiki/Nootka_Sound#Spanish_settlement',
      description: 'Details on Fort San Miguel history.',
    }
  ],
  'cmlhci09b001lm2rxun86l1q7': [
    {
      authorSource: 'Beaglehole J.C. ed.',
      title: 'The Journals of Captain James Cook Vol. III: The Voyage of the Resolution and Discovery 1776–1780',
      publisher: 'Hakluyt Society',
      year: '1967',
      description: 'Primary journal entries documenting Cook\\',
    },
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795 (4 vols)',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Scholarly edition with annotations on Vancouver\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Historical analysis of early European contact at Nootka Sound including Bligh Island area.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Nootka Sound National Historic Sites',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/bc/nootka',
      description: 'Interpretive information on Bligh Island Friendly Cove and Nuu-chah-nulth cultural context.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Nootka Sound',
      url: 'https://en.wikipedia.org/wiki/Nootka_Sound',
      description: 'Overview of European exploration history and Bligh Island association.',
    }
  ],
  'cmlhci09d001nm2rxalbz2n3h': [
    {
      authorSource: 'Dunmore John ed.',
      title: 'The Journal of Jean-François de Galaup comte de La Pérouse',
      publisher: 'Hakluyt Society',
      year: '1994–1995',
      description: 'Primary journal entries documenting La Pérouse\\',
    },
    {
      authorSource: 'Engstrand Iris H.W.',
      title: 'Spanish Scientists in the New World: The Eighteenth-Century Expeditions',
      publisher: 'University of Washington Press',
      year: '1981',
      description: 'Context on La Pérouse\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'La Pérouse Memorial (Lituya Bay)',
      url: 'https://www.pc.gc.ca (related Pacific historic sites)',
      description: 'Interpretive information on the La Pérouse memorial and cultural site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lituya Bay',
      url: 'https://en.wikipedia.org/wiki/Lituya_Bay',
      description: 'Historical significance of La Pérouse\\',
    }
  ],
  'cmlhci09l001rm2rxtlpntiw8': [
    {
      authorSource: 'Beaglehole J.C. ed.',
      title: 'The Journals of Captain James Cook Vol. III',
      publisher: 'Hakluyt Society',
      year: '1967',
      description: 'Primary entries on Cook\\',
    },
    {
      authorSource: 'Lamb W. Kaye ed.',
      title: 'The Voyage of George Vancouver 1791–1795',
      publisher: 'Hakluyt Society',
      year: '1984',
      description: 'Scholarly edition with notes on Vancouver\\',
    },
    {
      authorSource: 'Pethick Derek',
      title: 'The Nootka Connection: Europe and the First Nations of Vancouver Island 1790–1798',
      publisher: 'Heritage House',
      year: '1980',
      description: 'Context on early European contact in Klahoose Territory and Desolation Sound.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Desolation Sound',
      url: 'https://www.pc.gc.ca (related BC marine parks)',
      description: 'Interpretive information on cultural site and Klahoose Indigenous heritage.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Desolation Sound',
      url: 'https://en.wikipedia.org/wiki/Desolation_Sound',
      description: 'Historical exploration context in Georgia Strait.',
    }
  ],
  'cmlhci09p001tm2rx1oek684y': [
    {
      authorSource: 'Thompson David',
      title: 'David Thompson\\',
      publisher: 'Champlain Society',
      year: '1916',
      description: 'Primary journal entries describing Thompson\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Analysis of early European contact at the Columbia estuary including Chinook Point as a key trade and cultural site.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Hunters Trappers Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical context for Chinook trade networks at the river mouth and Wimahl.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Columbia River Mouth (Chinook Point)',
      url: 'https://www.pc.gc.ca (related Pacific sites)',
      description: 'Interpretive information on the cultural site and Indigenous significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Columbia River',
      url: 'https://en.wikipedia.org/wiki/Columbia_River#Estuary',
      description: 'Overview of the river mouth history and Chinook Point.',
    }
  ],
  'cmlhcpxjt0005m2a3yptljq2u': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Churchill (HBC) Journals',
      publisher: 'HBCA B.42/a series',
      description: 'Primary records from the HBC-era Fort Churchill on the Churchill River (Saskatchewan) as a key northern depot.',
    },
    {
      authorSource: 'Rich E.E.',
      title: 'The History of the Hudson\\',
      publisher: 'Hudson\\',
      year: '1958',
      description: 'Company history detailing Fort Churchill\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Churchill River (Manitoba)',
      url: 'https://en.wikipedia.org/wiki/Churchill_River_(Manitoba)',
      description: 'Context on the river and associated fort.',
    }
  ],
  'cmlhcpxk40009m2a3ly9irieb': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Carlton Post Journals',
      publisher: 'HBCA B.27/a series',
      description: 'Primary journals documenting Fort Carlton\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Hunters Trappers Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Case study of Fort Carlton within the pemmican triangle and Plains Cree–Assiniboine trade networks.',
    },
    {
      authorSource: 'Ens Jean Peterson',
      title: 'The Geography of the Hudson\\',
      publisher: 'MA thesis University of Manitoba',
      year: '1989',
      description: 'Spatial analysis of trade flows provisioning and Indigenous interactions at Fort Carlton.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Carlton',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-carlton',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Carlton',
      url: 'https://en.wikipedia.org/wiki/Fort_Carlton',
      description: 'Historic site and Treaty 6 signing location.',
    }
  ],
  'cmlhcpxks000fm2a34uekbxty': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Resolution Journals',
      publisher: 'HBCA B.181/a series',
      description: 'Primary journals from Fort Resolution (Deninu Kųę́) on Great Slave Lake as one of the oldest HBC Mackenzie District posts.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade and community at Fort Resolution.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Resolution',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-resolution',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Resolution',
      url: 'https://en.wikipedia.org/wiki/Fort_Resolution',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhcpxl2000hm2a35zf7u98t': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Norman / Tulita Journals',
      publisher: 'HBCA B.181/a series',
      description: 'Primary records from Fort Norman (Tulı́t\\',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade and life around Fort Norman.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Norman',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-norman (related Mackenzie posts)',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Tulita',
      url: 'https://en.wikipedia.org/wiki/Tulita',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhcpxlh000pm2a37jv1ad25': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Qu\\',
      publisher: 'HBCA B.159/a series',
      description: 'Primary journals from Fort Qu\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'Yale University Press',
      year: '1974',
      description: 'Context for Fort Qu\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Qu\\',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-quappelle',
      description: 'Significance for Treaty 4 and Qu\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Qu\\',
      url: 'https://en.wikipedia.org/wiki/Fort_Qu%27Appelle',
      description: 'History of the post and valley importance.',
    }
  ],
  'cmlhcpxlo000rm2a3z56bctdt': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Vancouver Journals',
      publisher: 'HBCA B.223/a series',
      description: 'Primary records from Fort Vancouver on the Columbia River as HBC Pacific headquarters 1825–1846.',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Definitive study of Fort Vancouver\\',
    },
    {
      authorSource: 'Franchère Gabriel',
      title: 'Narrative of a Voyage to the Northwest Coast of America',
      publisher: 'Champlain Society',
      year: '1854',
      description: 'Early primary account referencing Columbia River and Astoria/Vancouver transition.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort Vancouver (related U.S. historic site)',
      url: 'https://www.nps.gov/fova/index.htm',
      description: 'Interpretive history and archaeology of the HBC post.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Vancouver',
      url: 'https://en.wikipedia.org/wiki/Fort_Vancouver',
      description: 'Long history as HBC Columbia Department centre.',
    }
  ],
  'cmlhcpxm4000tm2a3h0q903om': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Victoria / Camosack Journals',
      publisher: 'HBCA B.226/a series',
      description: 'Primary records from Fort Victoria (Camosack) on Vancouver Island as HBC coastal headquarters after 1843.',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Analysis of Fort Victoria\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Victoria',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-victoria',
      description: 'Significance as precursor to Victoria city.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Victoria',
      url: 'https://en.wikipedia.org/wiki/Fort_Victoria',
      description: 'History of the post and colonial beginnings.',
    }
  ],
  'cmlhcpxmo000vm2a3n43nxs5n': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Kamloops / Tk\\',
      publisher: 'HBCA B.97/a series',
      description: 'Primary records from Fort Kamloops (Tk\\',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Chapter on Fort Kamloops\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Kamloops',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-kamloops',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Kamloops',
      url: 'https://en.wikipedia.org/wiki/Fort_Kamloops',
      description: 'Historic HBC post and Tk\\',
    }
  ],
  'cmlhcpxmr000xm2a3xopobi8t': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Nez Percés / Fort Walla Walla Journals',
      publisher: 'HBCA B.146/a series',
      description: 'Primary records from Fort Nez Percés (Fort Walla Walla) on the Columbia River documenting HBC operations Snake River trade and Cayuse/Nez Perce relations.',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Analysis of Fort Nez Percés as a key interior Columbia Plateau post for horse pemmican and fur brigades.',
    },
    {
      authorSource: 'Parker Samuel',
      title: 'Journal of an Exploring Tour Beyond the Rocky Mountains',
      publisher: 'A. Skinner',
      year: '1838',
      description: 'Early missionary account describing the post and Columbia River trade dynamics.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Nez Percés',
      url: 'https://en.wikipedia.org/wiki/Fort_Nez_Perc%C3%A9s',
      description: 'History timeline and significance at the Columbia–Snake confluence.',
    }
  ],
  'cmlhcpxmu000zm2a30yaasx30': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Chapter on Fort Colville as a major upper Columbia River post linking to the interior plateau.',
    },
    {
      authorSource: 'Teit James A.',
      title: 'The Salishan Tribes of the Western Plateaus',
      publisher: 'Bureau of American Ethnology',
      year: '1930',
      description: 'Ethnographic context for Indigenous (Colville/Okanagan) trade at Kettle Falls and Fort Colville.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Colvile',
      url: 'https://en.wikipedia.org/wiki/Fort_Colvile',
      description: 'History on the Columbia River.',
    }
  ],
  'cmlhcpxmx0011m2a3ip116duw': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Yukon Journals',
      publisher: 'HBCA B.240/a series',
      description: 'Primary records from Fort Yukon (Gwichyaa Zhee) on the Yukon River as an HBC post in the far northwest.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Gwich\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Yukon',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-yukon (related northern posts)',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Yukon',
      url: 'https://en.wikipedia.org/wiki/Fort_Yukon',
      description: '_Alaska',
    }
  ],
  'cmlhcpxn40015m2a37q2atmqk': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort William (NWC) Journals',
      publisher: 'HBCA B.105/a series',
      description: 'Primary records from the NWC period at Fort William on Lake Superior as the western headquarters.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Fort William\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort William (Ontario)',
      url: 'https://en.wikipedia.org/wiki/Fort_William',
      description: '_Ontario',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1939',
      description: 'Detailed history of Fort William as NWC depot and its significance in the fur trade rivalry.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort William National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/on/fortwilliam',
      description: 'Interpretive reconstruction archaeology and NWC heritage.',
    }
  ],
  'cmlhcpxnr001fm2a3urmu7hn2': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Vermilion (NWC) Journals',
      publisher: 'HBCA B.224/a series',
      description: 'Primary records from Fort Vermilion on the Peace River as an early NWC post later HBC.',
    },
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal... to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Primary context for Peace River exploration leading to Fort Vermilion.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Vermilion',
      url: 'https://en.wikipedia.org/wiki/Fort_Vermilion',
      description: 'Historic Peace River fur post.',
    }
  ],
  'cmlhcpxnw001hm2a3vu8g9i5h': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Dunvegan Post Journals',
      publisher: 'HBCA B.56/a series',
      description: 'Primary journals from Fort Dunvegan on the Peace River documenting HBC operations and Beaver/Dene trade.',
    },
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal... to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Early context for the Peace River route explored by Mackenzie and later used for Fort Dunvegan.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Dunvegan',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-dunvegan',
      description: 'Overview of the post as a major Peace River fur trade centre.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Dunvegan',
      url: 'https://en.wikipedia.org/wiki/Fort_Dunvegan',
      description: 'Long operational history on the Peace River.',
    }
  ],
  'cmlhcpxob001nm2a3t1ddlxuc': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Chapter on Fort Alexandria as an early New Caledonia post on the Fraser River.',
    },
    {
      authorSource: 'Fraser Simon',
      title: 'The Letters and Journals of Simon Fraser 1806–1808 ed. W. Kaye Lamb',
      publisher: 'Macmillan of Canada',
      year: '1960',
      description: 'Primary journal references to early exploration near modern Alexandria on the Fraser.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Alexandria',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-alexandria',
      description: 'Significance in early BC interior fur trade.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Alexandria',
      url: 'https://en.wikipedia.org/wiki/Fort_Alexandria',
      description: '_British_Columbia',
    }
  ],
  'cmlhcpxoi001rm2a3o6bx74af': [
    {
      authorSource: 'Hudson\\',
      title: 'Kootenay House Records',
      publisher: 'HBCA B.146/a series (related Columbia)',
      description: 'Primary references to Kootenay House as David Thompson\\',
    },
    {
      authorSource: 'Thompson David',
      title: 'David Thompson\\',
      publisher: 'Champlain Society',
      year: '1916',
      description: 'Primary journal entries on Kootenay House establishment and Columbia River exploration.',
    },
    {
      authorSource: 'Nisbet Jack',
      title: 'The Mapmaker\\',
      publisher: 'University of Oklahoma Press',
      year: '2005',
      description: 'Chapter on Thompson\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Kootenay House',
      url: 'https://en.wikipedia.org/wiki/Kootenay_House',
      description: 'Historic NWC post significance on the Columbia River.',
    }
  ],
  'cmlhcpxol001tm2a3z4iparrf': [
    {
      authorSource: 'Hudson\\',
      title: 'Spokane House Records',
      publisher: 'HBCA B.146/a series (related Columbia)',
      description: 'Primary references to Spokane House as David Thompson\\',
    },
    {
      authorSource: 'Thompson David',
      title: 'David Thompson\\',
      publisher: 'Champlain Society',
      year: '1916',
      description: 'Primary journal entries on Spokane House establishment and Spokane River trade.',
    },
    {
      authorSource: 'Nisbet Jack',
      title: 'The Mapmaker\\',
      publisher: 'University of Oklahoma Press',
      year: '2005',
      description: 'Chapter on Spokane House and interior plateau exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Spokane House',
      url: 'https://en.wikipedia.org/wiki/Spokane_House',
      description: 'Historic NWC post on the Spokane River.',
    }
  ],
  'cmlhcpxoq001vm2a398m9wqo1': [
    {
      authorSource: 'Franchère Gabriel',
      title: 'Narrative of a Voyage to the Northwest Coast of America in the years 1811 1812 1813 and 1814',
      publisher: 'Champlain Society',
      year: '1854',
      description: 'Primary eyewitness account of Fort Astoria\\',
    },
    {
      authorSource: 'Ronda James P.',
      title: 'Astoria & Empire',
      publisher: 'University of Nebraska Press',
      year: '1990',
      description: 'Scholarly history of Fort Astoria / Fort George on the Columbia River.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort Astoria National Historic Event',
      url: 'https://www.pc.gc.ca/apps/dfhd/page_nhpe_e.asp?id=106',
      description: 'Interpretive designation and historical context.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Astoria',
      url: 'https://en.wikipedia.org/wiki/Fort_Astoria',
      description: 'Timeline from Astor to HBC control.',
    }
  ],
  'cmlhcpxoy001zm2a304m2lgbl': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Pembina Post Journals',
      publisher: 'HBCA B.156/a series',
      description: 'Primary records from Fort Pembina on the Red River near the international boundary as an HBC post supporting Red River Settlement trade.',
    },
    {
      authorSource: 'Bumsted J.M.',
      title: 'The Red River Settlement and the Lord Selkirk Papers',
      publisher: 'Manitoba Historical Society',
      year: '1999',
      description: 'Context on Fort Pembina\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Pembina',
      url: 'https://en.wikipedia.org/wiki/Fort_Pembina',
      description: 'History of the post and Red River significance.',
    }
  ],
  'cmlhcpxp60023m2a3nk6v0ile': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Alexander (Bas-de-la-Rivière) Post Journals',
      publisher: 'HBCA B.4/a series',
      description: 'Primary daily operational records from Bas-de-la-Rivière / Fort Alexander on Lake Winnipeg during HBC-NWC competition and Red River Settlement era.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Hunters Trappers Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Ethnohistorical analysis of Indigenous (primarily Cree and Ojibwe) trade networks and middleman roles at Lake Winnipeg posts including Bas-de-la-Rivière.',
    },
    {
      authorSource: 'Ens Jean Peterson',
      title: 'The Geography of the Hudson\\',
      publisher: 'MA thesis University of Manitoba',
      year: '1989',
      description: 'Spatial and economic study of trade hinterlands Indigenous interactions and provisioning at Fort Alexander.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Alexander',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-alexander (related Red River forts)',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bas-de-la-Rivière',
      url: 'https://en.wikipedia.org/wiki/Bas-de-la-Rivière',
      description: 'Concise entry on the fort\\',
    }
  ],
  'cmlhcpxpb0025m2a3u22bcmrn': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Pelly Post Journals',
      publisher: 'HBCA B.159/a series',
      description: 'Primary journals from Fort Pelly on the Assiniboine River as a key HBC provisioning post in the Swan River District.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Fort Pelly\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Pelly',
      url: 'https://en.wikipedia.org/wiki/Fort_Pelly',
      description: 'History of the post and Assiniboine River location.',
    }
  ],
  'cmlhcpxpf0027m2a3vq60ln3h': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Pitt Post Journals',
      publisher: 'HBCA B.165/a series',
      description: 'Primary records from Fort Pitt on the North Saskatchewan River documenting HBC operations Plains Cree trade and 1885 North-West Rebellion context.',
    },
    {
      authorSource: 'Beal Bob and Macleod Rod',
      title: 'Prairie Fire: The North-West Rebellion of 1885',
      publisher: 'McClelland & Stewart',
      year: '1984',
      description: 'Analysis of Fort Pitt\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Pitt',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-pitt',
      description: 'Overview of the post Treaty 6 negotiations and river trade significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Pitt (Saskatchewan)',
      url: 'https://en.wikipedia.org/wiki/Fort_Pitt',
      description: '_Saskatchewan',
    }
  ],
  'cmlhcpxpp002dm2a3enfqyhkk': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Rae / Behchokǫ̀ Journals',
      publisher: 'HBCA B.200/a series',
      description: 'Primary records from Fort Rae (Behchokǫ̀) on Great Slave Lake as a central Tłı̨chǫ (Dogrib) Dene HBC trading post.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical analysis of Tłı̨chǫ trade patterns community and interactions at Fort Rae.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Rae',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-rae',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Behchokǫ̀',
      url: 'https://en.wikipedia.org/wiki/Behchokǫ̀',
      description: 'Community and historic trading post on Great Slave Lake.',
    }
  ],
  'cmlhcpxpt002fm2a3f9j5lnfo': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Providence Post Journals',
      publisher: 'HBCA B.200/a series',
      description: 'Primary records from Fort Providence (Zhahti Kų́ę́) on Great Slave Lake as a key Mackenzie District HBC trading post.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Ethnohistorical context for Slavey Dene trade community and life around Fort Providence.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Providence',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-providence',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Providence',
      url: 'https://en.wikipedia.org/wiki/Fort_Providence',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhcpxpx002hm2a3etw7eega': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Reliance Journals',
      publisher: 'HBCA B.200/a series',
      description: 'Primary records from Fort Reliance on the east arm of Great Slave Lake as a seasonal HBC outpost.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canada\\',
      publisher: 'McGill-Queen\\',
      year: '2000',
      description: 'Context for Yellowknives Dene trade and seasonal use around Fort Reliance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort Reliance',
      url: 'https://en.wikipedia.org/wiki/Fort_Reliance',
      description: '_Northwest_Territories',
    }
  ],
  'cmlhcpxq0002jm2a3phk4pbzy': [
    {
      authorSource: 'Hudson\\',
      title: 'Fort Rupert / Waskaganish Journals',
      publisher: 'HBCA B.135/a series',
      description: 'Primary records from Fort Rupert (Waskaganish) on James Bay as one of the original HBC posts established in 1668.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Historical study of Fort Rupert\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Rupert',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-rupert',
      description: 'Overview of the post\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Waskaganish',
      url: 'https://en.wikipedia.org/wiki/Waskaganish',
      description: 'Community and historic post at the mouth of the Rupert River.',
    }
  ],
  'cmligbkuz0003m20z3seyhxbw': [
    {
      authorSource: 'Hudson\\',
      title: 'Moose River Records',
      publisher: 'HBCA B.135/a series (related Moose Factory)',
      description: 'Primary references to Moose River as the trade route for Moose Factory and James Bay HBC posts.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Context on Moose River in early HBC Cree trade and Moose Factory operations.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Moose River',
      url: 'https://en.wikipedia.org/wiki/Moose_River_(Ontario)',
      description: 'Historic significance in James Bay region.',
    }
  ],
  'cmligbkv20005m20zmpiyg4ag': [
    {
      authorSource: 'Hudson\\',
      title: 'Albany River Records',
      publisher: 'HBCA B.3/a series (related Fort Albany)',
      description: 'Primary references to Albany River as the trade route for Fort Albany and James Bay HBC posts.',
    },
    {
      authorSource: 'Francis Daniel',
      title: 'History of the Hudson\\',
      publisher: 'Canadian Circumpolar Institute',
      year: '1983',
      description: 'Context on Albany River in early HBC Cree trade.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Albany River',
      url: 'https://en.wikipedia.org/wiki/Albany_River',
      description: 'Historic significance in James Bay region.',
    }
  ],
  'cmligbkv50007m20z56lg1di6': [
    {
      authorSource: 'Hudson\\',
      title: 'Abitibi River Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Abitibi River as a fur trade corridor linking James Bay to the Ottawa River system.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Abitibi River in early French and HBC trade networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Abitibi River',
      url: 'https://en.wikipedia.org/wiki/Abitibi_River',
      description: 'Historic waterway significance in northern Ontario.',
    }
  ],
  'cmligbl0q002cm20z7q06luf5': [
    {
      authorSource: 'Hudson\\',
      title: 'Upper Fort Garry Journals',
      publisher: 'HBCA B.235/a series',
      description: 'Primary records from Upper Fort Garry at The Forks on the Red River as the main HBC administrative and commercial centre after 1835.',
    },
    {
      authorSource: 'Bumsted J.M.',
      title: 'Lord Selkirk\\',
      publisher: 'Watson & Dwyer',
      year: '1995',
      description: 'Historical analysis of Upper Fort Garry\\',
    },
    {
      authorSource: 'Sprague D.N. and Frye R.P.',
      title: 'The Genealogy of the First Métis Nation',
      publisher: 'Pemmican Publications',
      year: '1983',
      description: 'Demographic and social study of Métis population at The Forks and Upper Fort Garry.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'The Forks / Upper Fort Garry National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/mb/forks',
      description: 'Interpretive plan archaeology and Métis heritage.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Upper Fort Garry',
      url: 'https://en.wikipedia.org/wiki/Upper_Fort_Garry',
      description: 'Distinction from Lower Fort Garry and role in Red River Settlement.',
    }
  ],
  'cmligbl0s002em20zgl2s057e': [
    {
      authorSource: 'Payment Diane',
      title: '\\',
      publisher: 'Golden Dog Press',
      year: '1990',
      description: 'Essays examining Métis society governance and resistance at Batoche along the South Saskatchewan River.',
    },
    {
      authorSource: 'Stanley George F.G.',
      title: 'The Birth of Western Canada: A History of the Riel Rebellions',
      publisher: 'Longmans Green',
      year: '1936',
      description: 'Classic account of Batoche as the 1885 provisional government headquarters and site of key North-West Rebellion engagements.',
    },
    {
      authorSource: 'Bumsted J.M.',
      title: 'The Riel Rebellions: A History in Documents',
      publisher: 'University of Toronto Press',
      year: '2003',
      description: 'Primary document collection including Batoche battle reports dispatches and Saskatchewan River Métis community records.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Batoche National Historic Site',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/sk/batoche',
      description: 'Archaeological interpretive history and Métis cultural heritage at the site.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Batoche',
      url: 'https://en.wikipedia.org/wiki/Batoche_Saskatchewan',
      description: 'Timeline of the settlement battle site and national historic importance.',
    }
  ],
  'cmlizphiu0003m2ybn31j3yf2': [
    {
      authorSource: 'Hudson\\',
      title: 'Great Dog Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Great Dog Portage (Animikie-wiikwedong) on the Kaministiquia River as part of the Grand Portage–Fort William route.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1939',
      description: 'Context on Great Dog Portage in the Lake Superior–Rainy Lake canoe system.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Kaministiquia River',
      url: 'https://en.wikipedia.org/wiki/Kaministiquia_River',
      description: 'Historic portage significance in the fur trade corridor.',
    }
  ],
  'cmlk1ohsr0001m2atdr81i0k0': [
    {
      authorSource: 'Hudson\\',
      title: 'Hauteur des Terres Records',
      publisher: 'HBCA various series',
      description: 'Primary documents referencing Hauteur des Terres (Ishpadinaa) as the height-of-land portage dividing Atlantic and Hudson Bay watersheds on the Ottawa route.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Analysis of Hauteur des Terres as a key divide in the Ottawa–Mattawa–Lake Nipissing canoe route.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Height of Land Portage',
      url: 'https://en.wikipedia.org/wiki/Height_of_Land_Portage',
      description: 'Historic significance in early Canadian exploration and trade.',
    },
    {
      authorSource: 'Hudson\\',
      title: 'Hauteur des Terres Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Hauteur des Terres (Ishpadinaa) as the height-of-land portage dividing Atlantic and Hudson Bay watersheds on the Ottawa–Mattawa route.',
    },
    {
      authorSource: 'Kennedy Patricia',
      title: 'The Portages of the Ottawa River',
      publisher: 'Ottawa Historical Society',
      year: '1985',
      description: 'Historical study of Hauteur des Terres portage in early French and Indigenous travel.',
    }
  ],
  'cmlk1oht20007m2at0bcedeyz': [
    {
      authorSource: 'Hudson\\',
      title: 'Frog Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Frog Portage (Athapapuskow) as the critical watershed divide between Saskatchewan and Churchill River systems.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Frog Portage\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree use of Frog Portage in northern trade networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Frog Portage',
      url: 'https://en.wikipedia.org/wiki/Frog_Portage',
      description: 'Historic portage significance in Saskatchewan.',
    }
  ],
  'cmlk1oht8000bm2atj8bjogev': [
    {
      authorSource: 'Hudson\\',
      title: 'Echimamish Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Echimamish Portage as a vital link in the Hudson Bay–Lake Winnipeg–Saskatchewan River canoe route.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of Echimamish Portage\\',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree use of Echimamish Portage in connecting watersheds.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Echimamish River',
      url: 'https://en.wikipedia.org/wiki/Echimamish_River',
      description: 'Historic portage significance.',
    }
  ],
  'cmlk1ohtb000dm2ati96rxt36': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary accounts of Champlain\\',
    },
    {
      authorSource: 'Kennedy Patricia',
      title: 'The Portages of the Ottawa River',
      publisher: 'Ottawa Historical Society',
      year: '1985',
      description: 'Historical study of French Portage as a key carry in the Ottawa–Georgian Bay corridor.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Ottawa River Portages',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/ottawa-river (related routes)',
      description: 'Context on French Portage in early fur trade and Indigenous travel.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'French River (Ontario)',
      url: 'https://en.wikipedia.org/wiki/French_River_(Ontario)',
      description: 'Description of the river and associated portages.',
    }
  ],
  'cmlk1ohth000hm2atid2o0cto': [
    {
      authorSource: 'Hudson\\',
      title: 'The Pas Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary documents referencing The Pas Portage (Opaskwayak) on the Saskatchewan River as a key carry in northern Manitoba trade routes.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'Yale University Press',
      year: '1974',
      description: 'Context for Cree use of The Pas Portage connecting Cumberland House and Norway House areas.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'The Pas',
      url: 'https://en.wikipedia.org/wiki/The_Pas',
      description: 'Historic portage and community significance on the Saskatchewan River.',
    }
  ],
  'cmlk1ohtm000jm2atwndo0iu1': [
    {
      authorSource: 'Hudson\\',
      title: 'Slave Falls Portage Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Slave Falls Portage (Awakanish) on Lake Winnipeg as part of the northern Manitoba canoe route system.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context for Cree and Ojibwe use of Slave Falls Portage in Lake Winnipeg trade networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake Winnipeg',
      url: 'https://en.wikipedia.org/wiki/Lake_Winnipeg',
      description: 'Overview of historic portages including Slave Falls.',
    }
  ],
  'cmlk1ohtp000lm2at4e9n5kau': [
    {
      authorSource: 'Biggar H.P. ed.',
      title: 'The Works of Samuel de Champlain Vol. 1',
      publisher: 'Champlain Society',
      year: '1922',
      description: 'Primary references to Grande Décharge (Gashkanagamong) on the St. Lawrence River during early French exploration.',
    },
    {
      authorSource: 'Trudel Marcel',
      title: 'The Beginnings of New France 1524–1663',
      publisher: 'McClelland & Stewart',
      year: '1973',
      description: 'Context on Grande Décharge as part of St. Lawrence River portage and early trade routes.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'St. Lawrence River',
      url: 'https://en.wikipedia.org/wiki/St._Lawrence_River',
      description: 'Overview of historic portages including Grande Décharge.',
    }
  ],
  'cmlk2w3jm0002m2636jrqvptl': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Appleton-Century-Crofts',
      year: '1931',
      description: 'Historical context on Lake of the Woods (Lake of the Island of the Golden Sands) and La Vérendrye family posts including Fort St. Charles.',
    },
    {
      authorSource: 'Burpee Lawrence J.',
      title: 'Journals and Letters of La Vérendrye and His Sons',
      publisher: 'Champlain Society',
      year: '1927',
      description: 'Primary La Vérendrye documents referencing Lake of the Woods explorations and Ojibwe relations.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Lake of the Woods (related historic sites)',
      url: 'https://www.pc.gc.ca (search La Vérendrye)',
      description: 'Interpretive information on cultural and exploration significance.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake of the Woods',
      url: 'https://en.wikipedia.org/wiki/Lake_of_the_Woods',
      description: 'Historic significance in fur trade and border history.',
    }
  ],
  'cumberland-sound-waterway': [
    {
      authorSource: 'Markham Clements R. ed.',
      title: 'The Voyages of William Baffin 1612-1622',
      publisher: 'Hakluyt Society',
      year: '1881',
      description: 'Primary accounts referencing Cumberland Sound (Tiniqqivik) during Baffin\\',
    },
    {
      authorSource: 'Mancall Peter C.',
      title: 'Fatal Journey: The Final Expedition of Henry Hudson – A Tale of Mutiny and Murder in the Arctic',
      publisher: 'Basic Books',
      year: '2009',
      description: 'Broader context on early English exploration including Cumberland Sound in Baffin Bay region.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Cumberland Sound',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/cumberland-sound',
      description: 'Overview of the sound in Inuit history and Arctic exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Cumberland Sound',
      url: 'https://en.wikipedia.org/wiki/Cumberland_Sound',
      description: 'Historic significance in Baffin Island.',
    }
  ],
  'davis-strait-waterway': [
    {
      authorSource: 'Markham Clements R. ed.',
      title: 'The Voyages of William Baffin 1612-1622',
      publisher: 'Hakluyt Society',
      year: '1881',
      description: 'Primary accounts of Baffin\\',
    },
    {
      authorSource: 'Mancall Peter C.',
      title: 'Fatal Journey: The Final Expedition of Henry Hudson – A Tale of Mutiny and Murder in the Arctic',
      publisher: 'Basic Books',
      year: '2009',
      description: 'Context on early English Arctic exploration including Davis Strait.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Davis Strait',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/davis-strait',
      description: 'Significance in Northwest Passage searches and Inuit history.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Davis Strait',
      url: 'https://en.wikipedia.org/wiki/Davis_Strait',
      description: 'Historic strait between Baffin Island and Greenland.',
    }
  ],
  'dean-channel-waterway': [
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal on the River St. Laurence through the Continent of North America to the Frozen and Pacific Oceans',
      publisher: 'T. Cadell & W. Davies',
      year: '1801',
      description: 'Primary narrative of Mackenzie\\',
    },
    {
      authorSource: 'Nisbet Jack',
      title: 'The Mapmaker\\',
      publisher: 'University of Oklahoma Press',
      year: '2005',
      description: 'Context on Mackenzie\\',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Mackenzie\\',
      url: 'https://www.pc.gc.ca (related Mackenzie sites)',
      description: 'Interpretive information on the cultural site and Mackenzie\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Dean Channel',
      url: 'https://en.wikipedia.org/wiki/Dean_Channel',
      description: 'Historic significance as Mackenzie\\',
    }
  ],
  'fort_st_charles_location': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Appleton-Century-Crofts',
      year: '1931',
      description: 'Historical context on Fort St. Charles (Lake of the Woods) established by La Vérendrye family as a key western fur trade outpost.',
    },
    {
      authorSource: 'Burpee Lawrence J.',
      title: 'Journals and Letters of La Vérendrye and His Sons',
      publisher: 'Champlain Society',
      year: '1927',
      description: 'Primary La Vérendrye documents referencing Fort St. Charles construction and Lake of the Woods operations.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort St. Charles (related La Vérendrye sites)',
      url: 'https://www.pc.gc.ca (search La Vérendrye)',
      description: 'Interpretive information on the fort site and early French exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Fort St. Charles',
      url: 'https://en.wikipedia.org/wiki/Fort_St._Charles_(Minnesota)',
      description: 'History of the post on Lake of the Woods.',
    }
  ],
  'foxe-basin-waterway': [
    {
      authorSource: 'Christy Miller ed.',
      title: 'The Voyages of Captain Luke Foxe of Hull and Captain Thomas James of Bristol',
      publisher: 'Hakluyt Society',
      year: '1894',
      description: 'Primary accounts of Foxe\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Foxe Basin',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/foxe-basin',
      description: 'Overview of the basin in early Arctic exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Foxe Basin',
      url: 'https://en.wikipedia.org/wiki/Foxe_Basin',
      description: 'Historic significance in Hudson Bay region.',
    }
  ],
  'french-river-waterway': [
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain Vol. 2 ed. H.P. Biggar',
      publisher: 'Champlain Society',
      year: '1925',
      description: 'Primary accounts of Champlain\\',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Economic analysis of French River as a key Great Lakes–Ottawa River route.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'French River (Ontario)',
      url: 'https://en.wikipedia.org/wiki/French_River_(Ontario)',
      description: 'Historic waterway and portage significance.',
    }
  ],
  'frobisher-bay-waterway': [
    {
      authorSource: 'McGhee Robert',
      title: 'The Arctic Voyages of Martin Frobisher: An Elizabethan Adventure',
      publisher: 'Canadian Museum of Civilization / McGill-Queen\\',
      year: '2001',
      description: 'Definitive scholarly account of Martin Frobisher\\',
    },
    {
      authorSource: 'Best George',
      title: 'A True Discourse of the Late Voyages of Discoverie',
      publisher: 'for the Finding of the Northweast Passage',
      year: 'Henry Middleton',
      url: '1578 (modern reprint 1963)',
    },
    {
      authorSource: 'Quinn David Beers',
      title: 'England and the Discovery of America 1481–1620',
      publisher: 'Alfred A. Knopf',
      year: '1974',
      description: 'Scholarly chapter on Frobisher\\',
    },
    {
      authorSource: 'McGhee Robert',
      title: 'The Arctic Voyages of Martin Frobisher',
      publisher: 'Canadian Museum of Civilization',
      year: '2001',
      description: 'Detailed archaeological and historical synthesis of Frobisher Bay sites, including Kodlunarn Island base camp and Inuit–English encounters.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Martin Frobisher',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/martin-frobisher',
      description: 'Overview of Frobisher\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Martin Frobisher',
      url: 'https://en.wikipedia.org/wiki/Martin_Frobisher',
      description: 'Timeline and references to voyages and Frobisher Bay discovery.',
    }
  ],
  'lancaster-sound-waterway': [
    {
      authorSource: 'Parry William Edward',
      title: 'Journal of a Voyage for the Discovery of a North-West Passage from the Atlantic to the Pacific',
      publisher: 'John Murray',
      year: '1821',
      description: 'Primary narrative of Parry\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lancaster Sound',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lancaster-sound',
      description: 'Overview of the sound in Arctic exploration and Northwest Passage attempts.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lancaster Sound',
      url: 'https://en.wikipedia.org/wiki/Lancaster_Sound',
      description: 'Historic significance in Canadian Arctic.',
    }
  ],
  'massacre_island_location': [
    {
      authorSource: 'La Vérendrye Pierre Gaultier de Varennes',
      title: 'Journal of La Vérendrye (1736 entries)',
      publisher: 'Champlain Society (Burpee ed.)',
      year: '1927',
      description: 'Primary La Vérendrye family documents referencing the 1736 massacre of Jean-Baptiste de La Vérendrye, Father Aulneau, and 19 men on an island in Lake of the Woods (likely Massacre Island).',
    },
    {
      authorSource: 'Moreau Bill',
      title: 'The Death of Père Aulneau, 1736: The Development of Myth in the Northwest',
      publisher: 'Canadian Catholic Historical Association',
      year: '2003',
      description: 'Scholarly analysis of the Lake of the Woods massacre, primary sources, and its mythic development in fur trade history.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Jean-Baptiste de La Vérendrye',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/jean-baptiste-de-la-verendrye (related)',
      description: 'Context on the 1736 massacre and its impact on French western exploration.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Lake of the Woods massacre',
      url: 'https://en.wikipedia.org/wiki/Lake_of_the_Woods_massacre',
      description: 'Overview of the 1736 event and Massacre Island location.',
    }
  ],
  'mercy-bay-waterway': [
    {
      authorSource: 'McClure Robert',
      title: 'The Discovery of the North-West Passage by H.M.S. Investigator ed. Sherard Osborn',
      publisher: 'Longman Brown Green Longmans & Roberts',
      year: '1856',
      description: 'Primary narrative of McClure\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Sir Robert McClure',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/sir-robert-mcclure',
      description: 'Overview of the expedition and Mercy Bay wintering site.',
    },
    {
      authorSource: 'Beattie Owen and Geiger John',
      title: 'Frozen in Time: Unlocking the Secrets of the Franklin Expedition',
      publisher: 'Western Producer Prairie Books',
      year: '1987',
      description: 'Context on Mercy Bay in Arctic exploration and Franklin-era searches.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Mercy Bay',
      url: 'https://en.wikipedia.org/wiki/Mercy_Bay',
      description: 'Historic bay significance in Banks Island and Northwest Passage history.',
    }
  ],
  'parry-channel-waterway': [
    {
      authorSource: 'Parry William Edward',
      title: 'Journal of a Voyage for the Discovery of a North-West Passage from the Atlantic to the Pacific',
      publisher: 'John Murray',
      year: '1821',
      description: 'Primary narrative of Parry\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Parry Channel',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/parry-channel',
      description: 'Overview of the channel in Arctic exploration history.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Parry Channel',
      url: 'https://en.wikipedia.org/wiki/Parry_Channel',
      description: 'Historic significance in Canadian Arctic.',
    }
  ],
  'queen-maud-gulf-waterway': [
    {
      authorSource: 'Amundsen Roald',
      title: 'The North West Passage: Being the Record of a Voyage of Exploration of the Ship \\',
      publisher: 'A. Constable',
      year: '1908',
      description: 'Primary narrative referencing Queen Maud Gulf (Uquqtuuq) during Amundsen\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Queen Maud Gulf',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/queen-maud-gulf',
      description: 'Overview of the gulf in Arctic exploration and Inuit history.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Queen Maud Gulf',
      url: 'https://en.wikipedia.org/wiki/Queen_Maud_Gulf',
      description: 'Historic significance in Canadian Arctic.',
    }
  ],
  'red-deer-river-alberta-waterway': [
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context on Red Deer River (Waskasoo Seepee) in early Plains Cree trade and provisioning networks.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Red Deer River',
      url: 'https://en.wikipedia.org/wiki/Red_Deer_River_(Alberta)',
      description: 'Historic significance in Alberta waterways.',
    }
  ],
  'seine-river-ontario-waterway': [
    {
      authorSource: 'Hudson\\',
      title: 'Seine River Area Records',
      publisher: 'HBCA various series',
      description: 'Primary references to Seine River as part of the Rainy Lake–Lake Superior watershed in early fur trade canoe routes.',
    },
    {
      authorSource: 'Innis Harold A.',
      title: 'The Fur Trade in Canada',
      publisher: 'Yale University Press',
      year: '1930',
      description: 'Context on Seine River in connecting Rainy Lake to Lake Superior and NWC/HBC operations.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Seine River',
      url: 'https://en.wikipedia.org/wiki/Seine_River_(Ontario)',
      description: 'Historic waterway significance in northwestern Ontario.',
    }
  ],
  'souris-river-waterway': [
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: 'Context on Souris River (Mouse River) in early Plains Cree/Assiniboine trade and provisioning networks for Assiniboine River posts.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Souris River',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/souris-river',
      description: 'Overview of the river\\',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Souris River',
      url: 'https://en.wikipedia.org/wiki/Souris_River',
      description: 'Historic significance in prairie waterways.',
    }
  ],
  'terror-bay-waterway': [
    {
      authorSource: 'Amundsen Roald',
      title: 'The North West Passage: Being the Record of a Voyage of Exploration of the Ship \\',
      publisher: 'A. Constable',
      year: '1908',
      description: 'Primary narrative referencing Terror Bay during Amundsen\\',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Terror Bay',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/terror-bay (related Arctic sites)',
      description: 'Overview of the bay in Franklin search and Inuit history.',
    },
    {
      authorSource: 'Wikipedia',
      title: 'Terror Bay',
      url: 'https://en.wikipedia.org/wiki/Terror_Bay',
      description: 'Historic significance in Canadian Arctic.',
    }
  ]
};
