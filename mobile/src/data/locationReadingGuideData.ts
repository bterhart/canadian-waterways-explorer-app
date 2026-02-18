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
  // Bas-de-la-Rivière (Fort Alexander)
  'cmlhcpxp60023m2a3nk6v0ile': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Alexander (Bas-de-la-Rivière) Post Journals',
      publisher: 'HBCA B.4/a series',
      description: 'Primary daily records of operations at Bas-de-la-Rivière / Fort Alexander on Lake Winnipeg during the HBC-NWC rivalry and Red River Settlement era.',
    },
    {
      authorSource: 'Ray Arthur J.',
      title: 'Indians in the Fur Trade: Their Role as Trappers Hunters Middlemen and Military Allies 1660–1870',
      publisher: 'University of Toronto Press',
      year: '1974',
      description: "Ethnohistorical context for Indigenous trade networks at Lake Winnipeg posts including Bas-de-la-Rivière.",
    },
    {
      authorSource: 'Ens Jean Peterson',
      title: "The Geography of the Hudson's Bay Company Fort Alexander Trade 1786–1821",
      publisher: 'MA thesis University of Manitoba',
      year: '1989',
      description: 'Spatial analysis of trade flows and Indigenous interactions at the post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Alexander',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-alexander',
      description: "Overview of the post's role in Lake Winnipeg fur trade and Métis history.",
    },
    {
      authorSource: 'Wikipedia',
      title: 'Bas-de-la-Rivière',
      url: 'https://en.wikipedia.org/wiki/Bas-de-la-Rivière',
      description: "Entry on the fort's history location and significance in Manitoba waterways.",
    },
  ],

  // Batoche
  'cmligbl0s002em20zgl2s057e': [
    {
      authorSource: 'Payment Diane',
      title: 'Batoche 1870–1910',
      publisher: 'Canadian Museum of Civilization',
      year: '1983',
      description: 'Comprehensive history of the Métis community at Batoche before and after the 1885 Resistance.',
    },
    {
      authorSource: 'Flanagan Thomas',
      title: 'Riel and the Rebellion: 1885 Reconsidered',
      publisher: 'University of Toronto Press',
      year: '2000',
      description: 'Scholarly analysis of the events leading to and including the Battle of Batoche.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Batoche National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/sk/batoche',
      description: 'Official site with visitor information and historical context for the 1885 battlefield.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Battle of Batoche',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/battle-of-batoche',
      description: 'Overview of the decisive battle of the North-West Resistance.',
    },
  ],

  // Bligh Island (Nootka Sound)
  'cmlhci09b001lm2rxun86l1q7': [
    {
      authorSource: 'Clayton Daniel',
      title: 'Islands of Truth: The Imperial Fashioning of Vancouver Island',
      publisher: 'UBC Press',
      year: '2000',
      description: 'Examines European encounters at Nootka Sound including Bligh Island within colonial mapping traditions.',
    },
    {
      authorSource: 'Fisher Robin',
      title: 'Contact and Conflict: Indian-European Relations in British Columbia 1774–1890',
      publisher: 'UBC Press',
      year: '1977',
      description: 'Foundational work on Indigenous-European contact on the Northwest Coast including Nootka Sound.',
    },
    {
      authorSource: 'BC Parks',
      title: 'Bligh Island Marine Provincial Park',
      url: 'https://bcparks.ca/bligh-island-park/',
      description: 'Park information and natural history of Bligh Island in Nootka Sound.',
    },
  ],

  // Bloody Falls
  'bloody_falls_location': [
    {
      authorSource: 'Hearne Samuel',
      title: 'A Journey from Prince of Wales Fort in Hudsons Bay to the Northern Ocean 1769–1772',
      publisher: 'Champlain Society',
      year: '1911',
      description: 'Primary account of Hearne witnessing the Inuit massacre at Bloody Falls during his overland journey.',
    },
    {
      authorSource: 'McGoogan Ken',
      title: 'Ancient Mariner: The Arctic Adventures of Samuel Hearne',
      publisher: 'Carroll & Graf',
      year: '2003',
      description: 'Modern biography contextualizing Hearne and the tragic events at Bloody Falls.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Kugluk/Bloody Falls Territorial Park',
      url: 'https://nunavutparks.com/parks-special-places/kugluk-bloody-falls-territorial-park/',
      description: 'Official information on the historic site and its cultural significance.',
    },
  ],

  // Cape Bonavista
  'cmlhci08p0017m2rxhlfgplt0': [
    {
      authorSource: 'Pope Peter',
      title: 'Fish into Wine: The Newfoundland Plantation in the Seventeenth Century',
      publisher: 'University of North Carolina Press',
      year: '2004',
      description: 'Economic history of early Newfoundland including the significance of Cape Bonavista.',
    },
    {
      authorSource: 'Rowe Frederick W.',
      title: 'A History of Newfoundland and Labrador',
      publisher: 'McGraw-Hill Ryerson',
      year: '1980',
      description: 'General history covering John Cabot landfall traditions at Cape Bonavista.',
    },
    {
      authorSource: 'Newfoundland and Labrador Tourism',
      title: 'Cape Bonavista Lighthouse',
      url: 'https://www.newfoundlandlabrador.com/trip-ideas/lighthouses/cape-bonavista-lighthouse',
      description: 'Visitor information for the historic lighthouse and Cabot landing site.',
    },
  ],

  // Cartier's Cross at Gaspé
  'cmlhci08s0019m2rx3b2ipe6i': [
    {
      authorSource: 'Cartier Jacques (Biggar H.P. ed.)',
      title: 'The Voyages of Jacques Cartier',
      publisher: 'Public Archives of Canada',
      year: '1924',
      description: 'Primary source translation of Cartier voyages including the 1534 cross-raising at Gaspé.',
    },
    {
      authorSource: 'Trigger Bruce G.',
      title: 'Natives and Newcomers: Canadas Heroic Age Reconsidered',
      publisher: 'McGill-Queens University Press',
      year: '1985',
      description: 'Revisionist history examining Indigenous perspectives on Cartier encounters.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Cartier-Brébeuf National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/qc/cartierbrebeuf',
      description: 'Information on Cartier commemorations and the significance of his voyages.',
    },
  ],

  // Chaudière Portage
  'cmlk1ohsy0005m2atetkkpn26': [
    {
      authorSource: 'Bond Courtney C.J.',
      title: 'City on the Ottawa',
      publisher: 'Queens Printer',
      year: '1961',
      description: 'History of Ottawa including the significance of Chaudière Falls as a portage and gathering place.',
    },
    {
      authorSource: 'Legget Robert',
      title: 'Ottawa Waterway: Gateway to a Continent',
      publisher: 'University of Toronto Press',
      year: '1975',
      description: 'Comprehensive history of the Ottawa River including the Chaudière portage route.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Chaudière Falls',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/chaudiere-falls',
      description: 'Overview of the falls sacred significance to Algonquin peoples and fur trade history.',
    },
  ],

  // Columbia River Mouth (Chinook Point)
  'cmlhci09p001tm2rx1oek684y': [
    {
      authorSource: 'Ronda James P.',
      title: 'Astoria and Empire',
      publisher: 'University of Nebraska Press',
      year: '1990',
      description: 'History of American fur trade at the Columbia River mouth and Fort Astoria.',
    },
    {
      authorSource: 'Boyd Robert',
      title: 'The Coming of the Spirit of Pestilence',
      publisher: 'University of Washington Press',
      year: '1999',
      description: 'Ethnohistory of Chinook peoples at the Columbia River including disease impacts.',
    },
    {
      authorSource: 'National Park Service',
      title: 'Lewis and Clark National Historical Park',
      url: 'https://www.nps.gov/lewi/',
      description: 'Information on the Corps of Discovery arrival at the Columbia River mouth.',
    },
  ],

  // Cumberland House
  'cmlhasls40025m2zh8ceyw7jl': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Cumberland House Post Journals',
      publisher: 'HBCA B.49/a series',
      description: 'Primary records from the first permanent HBC inland post established 1774.',
    },
    {
      authorSource: 'Smythe Terry',
      title: 'Thematic Study of the Fur Trade in the Canadian West 1670–1870',
      publisher: 'Parks Canada',
      year: '1968',
      description: 'Survey of fur trade posts including Cumberland House founding and operations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Cumberland House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/cumberland-house',
      description: 'Overview of Saskatchewans oldest permanent settlement and its fur trade origins.',
    },
  ],

  // Desolation Sound
  'cmlhci09l001rm2rxtlpntiw8': [
    {
      authorSource: 'Vancouver George',
      title: 'A Voyage of Discovery to the North Pacific Ocean 1791–1795',
      publisher: 'G.G. and J. Robinson',
      year: '1798',
      description: 'Primary account of Vancouver naming Desolation Sound during his coastal survey.',
    },
    {
      authorSource: 'Kennedy Dorothy and Bouchard Randy',
      title: 'Sliammon Life Sliammon Lands',
      publisher: 'Talonbooks',
      year: '1983',
      description: 'Ethnography of Tla amin (Sliammon) peoples whose territory includes Desolation Sound.',
    },
    {
      authorSource: 'BC Parks',
      title: 'Desolation Sound Marine Provincial Park',
      url: 'https://bcparks.ca/desolation-sound-park/',
      description: 'Park information and recreational context for this popular cruising destination.',
    },
  ],

  // Echimamish Portage
  'cmlk1oht8000bm2atj8bjogev': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Minnesota Historical Society',
      year: '1931',
      description: 'Classic study of voyageur life including descriptions of the Hayes River-Echimamish route.',
    },
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Detailed guide to historic canoe routes including the Echimamish connection.',
    },
    {
      authorSource: 'Manitoba Historical Society',
      title: 'Echimamish River',
      url: 'http://www.mhs.mb.ca/docs/mb_history/46/echimamishriver.shtml',
      description: 'Historical overview of this crucial portage linking Hudson Bay to interior waters.',
    },
  ],

  // Fort Albany
  'cmlhbjrrd0013m2mbr25pwdi0': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Albany Post Journals',
      publisher: 'HBCA B.3/a series',
      description: 'Primary records from one of the oldest HBC posts on James Bay established 1679.',
    },
    {
      authorSource: 'Francis Daniel and Morantz Toby',
      title: 'Partners in Furs: A History of the Fur Trade in Eastern James Bay 1600–1870',
      publisher: 'McGill-Queens University Press',
      year: '1983',
      description: 'Comprehensive study of the James Bay fur trade centered on Fort Albany.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Albany',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-albany',
      description: 'Overview of the posts history and role in the James Bay fur trade.',
    },
  ],

  // Fort Alexandria
  'cmlhcpxob001nm2a3t1ddlxuc': [
    {
      authorSource: 'Lamb W. Kaye (ed.)',
      title: 'The Letters and Journals of Simon Fraser 1806–1808',
      publisher: 'Macmillan',
      year: '1960',
      description: 'Primary source on Fraser establishing Fort Alexandria on the upper Fraser River.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1973',
      description: 'Comprehensive fur trade history covering NWC expansion including Fort Alexandria.',
    },
    {
      authorSource: 'BC Geographical Names',
      title: 'Fort Alexandria',
      url: 'https://apps.gov.bc.ca/pub/bcgnws/names/21804.html',
      description: 'Official geographic record and brief history of the fort site.',
    },
  ],

  // Fort Astoria / Fort George
  'cmlhcpxoq001vm2a398m9wqo1': [
    {
      authorSource: 'Ronda James P.',
      title: 'Astoria and Empire',
      publisher: 'University of Nebraska Press',
      year: '1990',
      description: 'Definitive history of John Jacob Astors Pacific fur trade venture.',
    },
    {
      authorSource: 'Irving Washington',
      title: 'Astoria or Anecdotes of an Enterprise Beyond the Rocky Mountains',
      publisher: 'Various',
      year: '1836',
      description: 'Classic contemporary account of the Astor expedition and fort establishment.',
    },
    {
      authorSource: 'National Park Service',
      title: 'Fort Astoria',
      url: 'https://www.nps.gov/places/fort-astoria.htm',
      description: 'Historical information on the first American settlement on the Pacific coast.',
    },
  ],

  // Fort Augustus (NWC)
  'cmlhcpxnk001bm2a3bv60prh0': [
    {
      authorSource: 'Johnson Alice M.',
      title: 'Saskatchewan Journals and Correspondence 1795–1802',
      publisher: 'Hudsons Bay Record Society',
      year: '1967',
      description: 'Primary documents from the NWC-HBC rivalry period including Fort Augustus operations.',
    },
    {
      authorSource: 'MacGregor James G.',
      title: 'A History of Alberta',
      publisher: 'Hurtig Publishers',
      year: '1981',
      description: 'Provincial history covering the fur trade era and Fort Augustus founding.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Augustus',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-augustus',
      description: 'Overview of the NWC post that became the basis for Fort Edmonton.',
    },
  ],

  // Fort Battleford
  'cmlhcpxpi0029m2a36jgoptfh': [
    {
      authorSource: 'Parks Canada',
      title: 'Fort Battleford National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/sk/battleford',
      description: 'Official site for the NWMP post and territorial capital.',
    },
    {
      authorSource: 'Macleod R.C.',
      title: 'The North-West Mounted Police and Law Enforcement 1873–1905',
      publisher: 'University of Toronto Press',
      year: '1976',
      description: 'History of the NWMP including Fort Battleford operations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Battleford',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-battleford',
      description: 'Overview of the fort and its role during the 1885 North-West Resistance.',
    },
  ],

  // Fort Carlton
  'cmlhcpxk40009m2a3ly9irieb': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Carlton Post Journals',
      publisher: 'HBCA B.27/a series',
      description: 'Primary records from this key Saskatchewan River trading post.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fort Carlton Provincial Historic Park',
      url: 'https://www.tourismsaskatchewan.com/listings/1082/fort-carlton-provincial-historic-park',
      description: 'Visitor information for the reconstructed fort and treaty signing site.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Carlton',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-carlton',
      description: 'Overview of the HBC post and Treaty 6 negotiations held there.',
    },
  ],

  // Fort Chipewyan
  'cmlhasls40027m2zhq13ab7xs': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Chipewyan Post Journals',
      publisher: 'HBCA B.39/a series',
      description: 'Primary records from the gateway post to the Athabasca and Mackenzie regions.',
    },
    {
      authorSource: 'McCormack Patricia A.',
      title: 'Fort Chipewyan and the Shaping of Canadian History 1788–1920s',
      publisher: 'UBC Press',
      year: '2010',
      description: 'Comprehensive history of Albertas oldest European settlement.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Chipewyan',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-chipewyan',
      description: 'Overview of this crucial Athabasca fur trade hub.',
    },
  ],

  // Fort Churchill
  'cmlhasls40022m2zhaovlkwt2': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Churchill Factory Post Journals',
      publisher: 'HBCA B.42/a series',
      description: 'Primary records from the northern Hudson Bay trading center.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Prince of Wales Fort National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/prince',
      description: 'Information on the stone fort ruins near Churchill.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Churchill',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/churchill',
      description: 'Overview of Churchill including its fur trade and modern significance.',
    },
  ],

  // Fort Churchill (HBC)
  'cmlhcpxjt0005m2a3yptljq2u': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Churchill Factory Correspondence',
      publisher: 'HBCA B.42/b series',
      description: 'Official correspondence from the Churchill post to HBC London headquarters.',
    },
    {
      authorSource: 'Robson Joseph',
      title: 'An Account of Six Years Residence in Hudsons Bay',
      publisher: 'J. Payne and J. Bouquet',
      year: '1752',
      description: 'Early firsthand account of life at Churchill Factory.',
    },
    {
      authorSource: 'Manitoba Historical Society',
      title: 'Fort Churchill',
      url: 'http://www.mhs.mb.ca/docs/mb_history/15/fortchurchill.shtml',
      description: 'Historical overview of the various Churchill trading establishments.',
    },
  ],

  // Fort Colville
  'cmlhcpxmu000zm2a30yaasx30': [
    {
      authorSource: 'Chance David H.',
      title: 'People of the Falls',
      publisher: 'Kettle Falls Historical Center',
      year: '1986',
      description: 'History of Kettle Falls area including Fort Colville operations.',
    },
    {
      authorSource: 'Ross Alexander',
      title: 'The Fur Hunters of the Far West',
      publisher: 'Smith Elder and Co.',
      year: '1855',
      description: 'Primary account of HBC Columbia District operations including Fort Colville.',
    },
    {
      authorSource: 'National Park Service',
      title: 'Fort Colville',
      url: 'https://www.nps.gov/places/fort-colville.htm',
      description: 'Historical information on the HBC post at Kettle Falls.',
    },
  ],

  // Fort Dunvegan
  'cmlhcpxnw001hm2a3vu8g9i5h': [
    {
      authorSource: 'Alberta Culture and Tourism',
      title: 'Fort Dunvegan Provincial Historic Site',
      url: 'https://www.alberta.ca/fort-dunvegan-provincial-historic-site',
      description: 'Official site for the preserved NWC/HBC Peace River post.',
    },
    {
      authorSource: 'Leonard David W.',
      title: 'Delayed Frontier: The Peace River Country to 1909',
      publisher: 'Detselig Enterprises',
      year: '1995',
      description: 'Regional history covering Fort Dunvegan and Peace River fur trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Dunvegan',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-dunvegan',
      description: 'Overview of Albertas oldest fur trade post on the Peace River.',
    },
  ],

  // Fort Edmonton
  'cmlhasls40026m2zhpi43jsew': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Edmonton Post Journals',
      publisher: 'HBCA B.60/a series',
      description: 'Primary records from the major Saskatchewan District headquarters.',
    },
    {
      authorSource: 'MacGregor James G.',
      title: 'Edmonton: A History',
      publisher: 'Hurtig Publishers',
      year: '1967',
      description: 'City history tracing Edmonton from fur trade post to modern capital.',
    },
    {
      authorSource: 'Fort Edmonton Park',
      title: 'Fort Edmonton Park',
      url: 'https://www.fortedmontonpark.ca/',
      description: 'Living history museum recreating the fur trade era fort.',
    },
  ],

  // Fort Edmonton (HBC)
  'cmlhcpxk7000bm2a3aywic3h2': [
    {
      authorSource: 'Johnson Alice M.',
      title: 'Saskatchewan Journals and Correspondence',
      publisher: 'Hudsons Bay Record Society',
      year: '1967',
      description: 'Primary documents covering Fort Edmonton establishment and early operations.',
    },
    {
      authorSource: 'MacEwan Grant',
      title: 'Fifty Mighty Men',
      publisher: 'Modern Press',
      year: '1958',
      description: 'Biographical sketches including fur traders associated with Fort Edmonton.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Edmonton',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-edmonton',
      description: 'Overview of the posts history from 1795 to city founding.',
    },
  ],

  // Fort Ellice
  'cmlhcpxle000nm2a3bogpycqa': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Ellice Post Journals',
      publisher: 'HBCA B.63/a series',
      description: 'Primary records from this key Assiniboine River post.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1973',
      description: 'Comprehensive fur trade history including Fort Ellice.',
    },
    {
      authorSource: 'Manitoba Historical Society',
      title: 'Fort Ellice',
      url: 'http://www.mhs.mb.ca/docs/sites/fortellice.shtml',
      description: 'Historical overview of the Assiniboine River trading post.',
    },
  ],

  // Fort Garry
  'cmlhbjrr5000xm2mbkhf0cqiw': [
    {
      authorSource: 'Bryce George',
      title: 'The Romantic Settlement of Lord Selkirks Colonists',
      publisher: 'Clark and Stuart',
      year: '1909',
      description: 'History of Red River Settlement including Fort Garry.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'The Forks National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/forks',
      description: 'Information on the historic junction where Fort Garry stood.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Garry',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-garry',
      description: 'Overview of the HBC headquarters at Red River.',
    },
  ],

  // Fort Garry (Upper)
  'cmlhcpxl6000jm2a3g5tcl5vu': [
    {
      authorSource: 'Begg Alexander',
      title: 'History of the North-West',
      publisher: 'Hunter Rose and Co.',
      year: '1894',
      description: 'Early history of the region including Upper Fort Garry.',
    },
    {
      authorSource: 'City of Winnipeg',
      title: 'Upper Fort Garry Heritage Provincial Park',
      url: 'https://www.upperfortgarry.com/',
      description: 'Information on the heritage park preserving the fort site.',
    },
    {
      authorSource: 'Manitoba Historical Society',
      title: 'Upper Fort Garry',
      url: 'http://www.mhs.mb.ca/docs/sites/upperfortgarry.shtml',
      description: 'Detailed history of the HBC post that became Winnipeg.',
    },
  ],

  // Fort George (NWC - BC)
  'cmlhcpxo4001lm2a3bv6j547w': [
    {
      authorSource: 'Lamb W. Kaye (ed.)',
      title: 'The Letters and Journals of Simon Fraser 1806–1808',
      publisher: 'Macmillan',
      year: '1960',
      description: 'Primary source on Fraser establishing Fort George at the Fraser-Nechako confluence.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1973',
      description: 'Fur trade history covering NWC expansion into New Caledonia.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Prince George',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/prince-george',
      description: 'City history tracing origins to Fort George.',
    },
  ],

  // Fort George (NWC - Saskatchewan)
  'cmlhcpxno001dm2a3gc40a1u2': [
    {
      authorSource: 'Johnson Alice M.',
      title: 'Saskatchewan Journals and Correspondence',
      publisher: 'Hudsons Bay Record Society',
      year: '1967',
      description: 'Primary documents from the NWC-HBC rivalry on the North Saskatchewan.',
    },
    {
      authorSource: 'Smythe Terry',
      title: 'Thematic Study of the Fur Trade in the Canadian West',
      publisher: 'Parks Canada',
      year: '1968',
      description: 'Survey of fur trade posts including the Saskatchewan Fort George.',
    },
    {
      authorSource: 'Saskatchewan Archives',
      title: 'Fort George Historical Records',
      url: 'https://www.saskarchives.com/',
      description: 'Archival resources for Saskatchewan fur trade posts.',
    },
  ],

  // Fort Gibraltar
  'cmlhcpxot001xm2a3nzh39xs0': [
    {
      authorSource: 'Bryce George',
      title: 'The Remarkable History of the Hudsons Bay Company',
      publisher: 'William Briggs',
      year: '1900',
      description: 'Includes the NWC-Selkirk conflict and Fort Gibraltar destruction.',
    },
    {
      authorSource: 'Festival du Voyageur',
      title: 'Fort Gibraltar',
      url: 'https://www.festivalvoyageur.mb.ca/en/fort-gibraltar/',
      description: 'Information on the reconstructed fort and living history programs.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Gibraltar',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-gibraltar',
      description: 'Overview of the NWC post at the Forks.',
    },
  ],

  // Fort Good Hope
  'cmlhasls40028m2zh4aji898k': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Good Hope Post Journals',
      publisher: 'HBCA B.80/a series',
      description: 'Primary records from this remote Mackenzie River post.',
    },
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene history including perspectives on Fort Good Hope.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Good Hope',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-good-hope',
      description: 'Overview of the Mackenzie River trading post.',
    },
  ],

  // Fort Kaministiquia
  'cmlhcpxnc0017m2a37uwth5fr': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageurs Highway',
      publisher: 'Minnesota Historical Society',
      year: '1941',
      description: 'History of the Grand Portage route including Fort Kaministiquia.',
    },
    {
      authorSource: 'Morrison Jean',
      title: 'Superior Rendezvous Place: Fort William in the Canadian Fur Trade',
      publisher: 'Natural Heritage Books',
      year: '2001',
      description: 'Comprehensive history of the NWC inland headquarters.',
    },
    {
      authorSource: 'Thunder Bay Museum',
      title: 'Fort William Historical Park',
      url: 'https://fwhp.ca/',
      description: 'Living history site recreating the NWC post.',
    },
  ],

  // Fort Kamloops
  'cmlhcpxmo000vm2a3n43nxs5n': [
    {
      authorSource: 'Ignace Marianne and Ignace Ronald',
      title: 'Secwépemc People Land and Laws',
      publisher: 'McGill-Queens University Press',
      year: '2017',
      description: 'Secwépemc perspectives on their territory including Fort Kamloops.',
    },
    {
      authorSource: 'Thomson Duane',
      title: 'A History of the Okanagan: Indians and Whites in the Settlement Era',
      publisher: 'PhD thesis UBC',
      year: '1985',
      description: 'Regional history covering fur trade posts including Kamloops.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Kamloops',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/kamloops',
      description: 'City history from fur trade origins.',
    },
  ],

  // Fort Lac La Pluie (Fort Frances)
  'cmlhcpxp20021m2a32mlrbo8z': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Minnesota Historical Society',
      year: '1931',
      description: 'Classic study including Lac La Pluie on the canoe route.',
    },
    {
      authorSource: 'Podruchny Carolyn',
      title: 'Making the Voyageur World',
      publisher: 'University of Toronto Press',
      year: '2006',
      description: 'Voyageur culture and the boundary waters trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Frances',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-frances',
      description: 'Town history from fur trade post to modern community.',
    },
  ],

  // Fort Langley
  'cmlhasls40029m2zhhfgaamg9': [
    {
      authorSource: 'Parks Canada',
      title: 'Fort Langley National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/bc/langley',
      description: 'Official site for the birthplace of British Columbia.',
    },
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains: The British Fur Trade on the Pacific 1793–1843',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Comprehensive study of Pacific fur trade including Fort Langley.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Langley',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-langley',
      description: 'Overview of the HBC post where BC was proclaimed a colony.',
    },
  ],

  // Fort Liard
  'cmlhcpxpl002bm2a35iiq5vzp': [
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene history including the Liard River region.',
    },
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Liard Post Journals',
      publisher: 'HBCA B.113/a series',
      description: 'Primary records from this remote northern post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Liard',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-liard',
      description: 'Overview of the NWT trading community.',
    },
  ],

  // Fort McLeod (BC)
  'cmlhcpxo0001jm2a36ckmzggi': [
    {
      authorSource: 'Lamb W. Kaye (ed.)',
      title: 'The Letters and Journals of Simon Fraser 1806–1808',
      publisher: 'Macmillan',
      year: '1960',
      description: 'Primary account of Fraser establishing the first permanent European settlement in BC.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1973',
      description: 'Fur trade history covering New Caledonia posts.',
    },
    {
      authorSource: 'BC Geographical Names',
      title: 'Fort McLeod',
      url: 'https://apps.gov.bc.ca/pub/bcgnws/',
      description: 'Geographic information on BCs first fur trade post.',
    },
  ],

  // Fort McLoughlin
  'cmlhcpxq9002nm2a3kn445t0w': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Pacific fur trade including Fort McLoughlin on the central coast.',
    },
    {
      authorSource: 'Fisher Robin',
      title: 'Contact and Conflict: Indian-European Relations in British Columbia',
      publisher: 'UBC Press',
      year: '1977',
      description: 'Indigenous-European interactions including HBC coastal posts.',
    },
    {
      authorSource: 'Heiltsuk Nation',
      title: 'Bella Bella History',
      url: 'https://www.heiltsuknation.ca/',
      description: 'Heiltsuk perspectives on their territory including the fort site.',
    },
  ],

  // Fort McPherson
  'cmlhcpxn10013m2a3zq358xxd': [
    {
      authorSource: 'Coates Kenneth',
      title: 'Best Left as Indians: Native-White Relations in the Yukon Territory',
      publisher: 'McGill-Queens University Press',
      year: '1991',
      description: 'Northern Indigenous history including Fort McPherson region.',
    },
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort McPherson Post Journals',
      publisher: 'HBCA B.121/a series',
      description: 'Primary records from this Peel River post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort McPherson',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-mcpherson',
      description: 'Overview of the Gwich in community and its fur trade origins.',
    },
  ],

  // Fort Nez Percés (Fort Walla Walla)
  'cmlhcpxmr000xm2a3xopobi8t': [
    {
      authorSource: 'Ross Alexander',
      title: 'The Fur Hunters of the Far West',
      publisher: 'Smith Elder and Co.',
      year: '1855',
      description: 'Primary account of NWC/HBC operations in the Columbia Plateau.',
    },
    {
      authorSource: 'Ruby Robert and Brown John',
      title: 'The Cayuse Indians: Imperial Tribesmen of Old Oregon',
      publisher: 'University of Oklahoma Press',
      year: '1972',
      description: 'Cayuse history including relations with Fort Nez Percés.',
    },
    {
      authorSource: 'Washington State Historical Society',
      title: 'Fort Walla Walla',
      url: 'https://www.washingtonhistory.org/',
      description: 'Historical resources on the Columbia River trading post.',
    },
  ],

  // Fort Norman
  'cmlhcpxl2000hm2a35zf7u98t': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Norman Post Journals',
      publisher: 'HBCA B.149/a series',
      description: 'Primary records from this Mackenzie River post.',
    },
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene perspectives on Mackenzie River fur trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Tulita',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/tulita',
      description: 'Modern community at the historic Fort Norman site.',
    },
  ],

  // Fort Pelly
  'cmlhcpxpb0025m2a3u22bcmrn': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Pelly Post Journals',
      publisher: 'HBCA B.159/a series',
      description: 'Primary records from this Swan River District headquarters.',
    },
    {
      authorSource: 'Morton Arthur S.',
      title: 'A History of the Canadian West to 1870–71',
      publisher: 'University of Toronto Press',
      year: '1973',
      description: 'Comprehensive fur trade history including Fort Pelly.',
    },
    {
      authorSource: 'Saskatchewan Archives',
      title: 'Fort Pelly',
      url: 'https://www.saskarchives.com/',
      description: 'Archival resources for this Saskatchewan trading post.',
    },
  ],

  // Fort Pembina
  'cmlhcpxoy001zm2a304m2lgbl': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'Documents Relating to Northwest Missions 1815–1827',
      publisher: 'Minnesota Historical Society',
      year: '1942',
      description: 'Primary sources on the Pembina region missions and trade.',
    },
    {
      authorSource: 'Gilman Rhoda',
      title: 'Henry Hastings Sibley: Divided Heart',
      publisher: 'Minnesota Historical Society Press',
      year: '2004',
      description: 'Biography touching on Pembina fur trade history.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Pembina',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/pembina',
      description: 'Overview of the border region trading post.',
    },
  ],

  // Fort Pitt
  'cmlhcpxpf0027m2a3vq60ln3h': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Pitt Post Journals',
      publisher: 'HBCA B.166/a series',
      description: 'Primary records from this North Saskatchewan River post.',
    },
    {
      authorSource: 'Dempsey Hugh',
      title: 'Big Bear: The End of Freedom',
      publisher: 'Greystone Books',
      year: '1984',
      description: 'Biography covering events at Fort Pitt during 1885.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Pitt',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-pitt',
      description: 'Overview including Treaty 6 and 1885 siege.',
    },
  ],

  // Fort Providence
  'cmlhcpxpt002fm2a3f9j5lnfo': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Providence Post Journals',
      publisher: 'HBCA B.181/a series',
      description: 'Primary records from this Great Slave Lake post.',
    },
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene perspectives on the Mackenzie Valley fur trade.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Providence',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-providence',
      description: 'Overview of this historic Mackenzie River community.',
    },
  ],

  // Fort Qu'Appelle
  'cmlhcpxlh000pm2a37jv1ad25': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Qu Appelle Post Journals',
      publisher: 'HBCA B.186/a series',
      description: 'Primary records from this Qu Appelle Valley post.',
    },
    {
      authorSource: 'Miller J.R.',
      title: 'Compact Contract Covenant: Aboriginal Treaty-Making in Canada',
      publisher: 'University of Toronto Press',
      year: '2009',
      description: 'Treaty history including Treaty 4 signed near Fort Qu Appelle.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Qu Appelle',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-quappelle',
      description: 'Overview of the Saskatchewan trading post and treaty site.',
    },
  ],

  // Fort Rae
  'cmlhcpxpp002dm2a3enfqyhkk': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Rae Post Journals',
      publisher: 'HBCA B.187/a series',
      description: 'Primary records from this Great Slave Lake Tlicho territory post.',
    },
    {
      authorSource: 'Helm June',
      title: 'The People of Denendeh: Ethnohistory of the Indians of Canadas Northwest Territories',
      publisher: 'McGill-Queens University Press',
      year: '2000',
      description: 'Ethnography of Dene peoples including the Fort Rae region.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Behchoko',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/rae-edzo',
      description: 'Modern community at the historic Fort Rae area.',
    },
  ],

  // Fort Reliance
  'cmlhcpxpx002hm2a3etw7eega': [
    {
      authorSource: 'Back George',
      title: 'Narrative of the Arctic Land Expedition 1833–35',
      publisher: 'John Murray',
      year: '1836',
      description: 'Primary account of building Fort Reliance as a base for Back River exploration.',
    },
    {
      authorSource: 'Houston Stuart (ed.)',
      title: 'Arctic Artist: The Journal and Paintings of George Back',
      publisher: 'McGill-Queens University Press',
      year: '1994',
      description: 'Illustrated journal including Fort Reliance construction.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'George Back',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/sir-george-back',
      description: 'Biography of the explorer who established Fort Reliance.',
    },
  ],

  // Fort Resolution
  'cmlhcpxks000fm2a34uekbxty': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Resolution Post Journals',
      publisher: 'HBCA B.181/a series',
      description: 'Primary records from this Great Slave Lake post.',
    },
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene history including Fort Resolution community.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Resolution',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-resolution',
      description: 'Overview of the oldest continuous settlement in NWT.',
    },
  ],

  // Fort Rupert
  'cmlhcpxq0002jm2a3phk4pbzy': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Pacific fur trade including Fort Rupert establishment.',
    },
    {
      authorSource: 'Galois Robert',
      title: 'Kwakwaka wakw Settlements 1775–1920',
      publisher: 'UBC Press',
      year: '1994',
      description: 'Indigenous settlement patterns including Fort Rupert area.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Rupert',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-rupert',
      description: 'Overview of the HBC coal mining and trading venture.',
    },
  ],

  // Fort San Miguel (Spanish Fort at Nootka)
  'cmlhci098001jm2rxi0if729k': [
    {
      authorSource: 'Cook Warren',
      title: 'Flood Tide of Empire: Spain and the Pacific Northwest 1543–1819',
      publisher: 'Yale University Press',
      year: '1973',
      description: 'Comprehensive study of Spanish presence at Nootka including Fort San Miguel.',
    },
    {
      authorSource: 'Clayton Daniel',
      title: 'Islands of Truth: The Imperial Fashioning of Vancouver Island',
      publisher: 'UBC Press',
      year: '2000',
      description: 'Colonial history examining the Nootka Crisis and Spanish claims.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Nootka Sound Controversy',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/nootka-sound-controversy',
      description: 'Overview of the Spanish-British dispute at Nootka.',
    },
  ],

  // Fort Severn
  'cmlhcpxjq0003m2a3mh417co2': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Severn Post Journals',
      publisher: 'HBCA B.198/a series',
      description: 'Primary records from Ontarios northernmost community.',
    },
    {
      authorSource: 'Francis Daniel and Morantz Toby',
      title: 'Partners in Furs',
      publisher: 'McGill-Queens University Press',
      year: '1983',
      description: 'James Bay fur trade including Fort Severn.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Severn',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-severn',
      description: 'Overview of this remote Hudson Bay post.',
    },
  ],

  // Fort Simpson
  'cmlhbjrri0017m2mbfts7d8is': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Simpson Post Journals',
      publisher: 'HBCA B.200/a series',
      description: 'Primary records from this Mackenzie-Liard junction headquarters.',
    },
    {
      authorSource: 'Abel Kerry',
      title: 'Drum Songs: Glimpses of Dene History',
      publisher: 'McGill-Queens University Press',
      year: '1993',
      description: 'Dene history of the Mackenzie Valley.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Simpson',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-simpson',
      description: 'Overview of the Mackenzie District headquarters.',
    },
  ],

  // Fort Simpson (BC)
  'cmlhcpxq5002lm2a353mda50w': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Pacific fur trade including Fort Simpson on the northern coast.',
    },
    {
      authorSource: 'Fisher Robin',
      title: 'Contact and Conflict',
      publisher: 'UBC Press',
      year: '1977',
      description: 'Indigenous-European relations including Tsimshian territory.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Port Simpson',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/port-simpson',
      description: 'Overview of the former HBC post in Tsimshian territory.',
    },
  ],

  // Fort St. Charles
  'fort_st_charles_location': [
    {
      authorSource: 'Burpee Lawrence J.',
      title: 'Journals and Letters of Pierre Gaultier de Varennes de la Vérendrye',
      publisher: 'Champlain Society',
      year: '1927',
      description: 'Primary sources on La Vérendrye establishing Fort St. Charles.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'Caesars of the Wilderness',
      publisher: 'D. Appleton-Century',
      year: '1943',
      description: 'Study of Radisson and Groseilliers with context for later posts.',
    },
    {
      authorSource: 'Minnesota Historical Society',
      title: 'Fort St. Charles',
      url: 'https://www.mnhs.org/fortsnelling/learn/native-americans',
      description: 'Historical context for Lake of the Woods exploration.',
    },
  ],

  // Fort St. James
  'cmlhbjrrn001bm2mbmbhxd2wx': [
    {
      authorSource: 'Parks Canada',
      title: 'Fort St. James National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/bc/stjames',
      description: 'Official site for the preserved New Caledonia headquarters.',
    },
    {
      authorSource: 'Lamb W. Kaye (ed.)',
      title: 'The Letters and Journals of Simon Fraser',
      publisher: 'Macmillan',
      year: '1960',
      description: 'Primary source on Fraser establishing Fort St. James.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort St. James',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-st-james',
      description: 'Overview of the New Caledonia District headquarters.',
    },
  ],

  // Fort Témiscamingue
  'cmlhasls4002am2zhut4b7lsm': [
    {
      authorSource: 'Mitchell Elaine Allan',
      title: 'Fort Timiskaming and the Fur Trade',
      publisher: 'University of Toronto Press',
      year: '1977',
      description: 'Comprehensive history of this strategic Ottawa River post.',
    },
    {
      authorSource: 'Ontario Heritage Trust',
      title: 'Fort Témiscamingue',
      url: 'https://www.heritagetrust.on.ca/',
      description: 'Heritage information on the preserved fort site.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Témiscamingue',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-temiscamingue',
      description: 'Overview of one of the oldest inland posts.',
    },
  ],

  // Fort Vancouver (HBC)
  'cmlhcpxlo000rm2a3z56bctdt': [
    {
      authorSource: 'National Park Service',
      title: 'Fort Vancouver National Historic Site',
      url: 'https://www.nps.gov/fova/',
      description: 'Official site for the reconstructed HBC Columbia Department headquarters.',
    },
    {
      authorSource: 'Hussey John',
      title: 'The History of Fort Vancouver and Its Physical Structure',
      publisher: 'Washington State Historical Society',
      year: '1957',
      description: 'Definitive architectural and operational history.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Vancouver',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-vancouver',
      description: 'Overview of the HBC Pacific headquarters.',
    },
  ],

  // Fort Vermilion (NWC)
  'cmlhcpxnr001fm2a3urmu7hn2': [
    {
      authorSource: 'Leonard David W.',
      title: 'Delayed Frontier: The Peace River Country to 1909',
      publisher: 'Detselig Enterprises',
      year: '1995',
      description: 'Regional history covering Fort Vermilion area.',
    },
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Fort Vermilion Post Journals',
      publisher: 'HBCA B.224/a series',
      description: 'Primary records from this Peace River post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Vermilion',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-vermilion',
      description: 'Overview of Albertas oldest farming settlement.',
    },
  ],

  // Fort Victoria
  'cmlhcpxm4000tm2a3h0q903om': [
    {
      authorSource: 'Mackie Richard Somerset',
      title: 'Trading Beyond the Mountains',
      publisher: 'UBC Press',
      year: '1997',
      description: 'Pacific fur trade including Fort Victoria founding.',
    },
    {
      authorSource: 'Barman Jean',
      title: 'The West Beyond the West: A History of British Columbia',
      publisher: 'University of Toronto Press',
      year: '1991',
      description: 'Provincial history from Fort Victoria to modern BC.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Victoria',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-victoria',
      description: 'Overview of the HBC post that became BCs capital.',
    },
  ],

  // Fort William
  'cmlhbjrr2000vm2mb4xb3au6o': [
    {
      authorSource: 'Morrison Jean',
      title: 'Superior Rendezvous Place: Fort William in the Canadian Fur Trade',
      publisher: 'Natural Heritage Books',
      year: '2001',
      description: 'Definitive history of the NWC inland headquarters.',
    },
    {
      authorSource: 'Fort William Historical Park',
      title: 'Fort William Historical Park',
      url: 'https://fwhp.ca/',
      description: 'Living history site recreating the NWC rendezvous.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort William',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-william',
      description: 'Overview of the NWC summer gathering place.',
    },
  ],

  // Fort William (NWC)
  'cmlhcpxn40015m2a37q2atmqk': [
    {
      authorSource: 'Campbell Marjorie Wilkins',
      title: 'The North West Company',
      publisher: 'Macmillan',
      year: '1957',
      description: 'NWC history including Fort William as the rendezvous center.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageurs Highway',
      publisher: 'Minnesota Historical Society',
      year: '1941',
      description: 'The Grand Portage to Fort William route history.',
    },
    {
      authorSource: 'Thunder Bay Museum',
      title: 'Fort William History',
      url: 'https://thunderbaymuseum.com/',
      description: 'Local museum resources on the NWC post.',
    },
  ],

  // Fort Yukon
  'cmlhcpxmx0011m2a3ip116duw': [
    {
      authorSource: 'Murray Alexander Hunter',
      title: 'Journal of the Yukon 1847–48',
      publisher: 'Publications of the Canadian Archives',
      year: '1910',
      description: 'Primary account of establishing Fort Yukon in Russian territory.',
    },
    {
      authorSource: 'Coates Kenneth',
      title: 'Best Left as Indians',
      publisher: 'McGill-Queens University Press',
      year: '1991',
      description: 'Northern Indigenous history including the upper Yukon.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Fort Yukon',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/fort-yukon',
      description: 'Overview of the HBC post in what became Alaska.',
    },
  ],

  // French Portage
  'cmlk1ohtb000dm2ati96rxt36': [
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Comprehensive guide to historic canoe routes including French Portage.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Minnesota Historical Society',
      year: '1931',
      description: 'Classic study of voyageur life and portaging traditions.',
    },
    {
      authorSource: 'Ontario Parks',
      title: 'French River Provincial Park',
      url: 'https://www.ontarioparks.com/park/frenchriver',
      description: 'Park information for this Canadian Heritage River corridor.',
    },
  ],

  // Friendly Cove Landing (Cook's Landing)
  'cmlhci092001fm2rxed77jk9j': [
    {
      authorSource: 'Beaglehole J.C. (ed.)',
      title: 'The Journals of Captain James Cook: The Voyage of the Resolution and Discovery 1776–1780',
      publisher: 'Cambridge University Press',
      year: '1967',
      description: 'Primary account of Cook at Nootka Sound in 1778.',
    },
    {
      authorSource: 'Fisher Robin and Johnston Hugh (eds.)',
      title: 'From Maps to Metaphors: The Pacific World of George Vancouver',
      publisher: 'UBC Press',
      year: '1993',
      description: 'Essays on Pacific exploration including Nootka Sound encounters.',
    },
    {
      authorSource: 'BC Parks',
      title: 'Friendly Cove',
      url: 'https://www.env.gov.bc.ca/bcparks/',
      description: 'Information on accessing this historic First Contact site.',
    },
  ],

  // Frog Portage
  'cmlk1oht20007m2at0bcedeyz': [
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Detailed guide including Frog Portage on the Churchill system.',
    },
    {
      authorSource: 'Tyrrell J.B.',
      title: 'Journals of Samuel Hearne and Philip Turnor',
      publisher: 'Champlain Society',
      year: '1934',
      description: 'Primary accounts of travel through Frog Portage.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Frog Portage',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/frog-portage',
      description: 'Overview of this key divide crossing.',
    },
  ],

  // Grand Portage
  'cmlhasls40024m2zhk53dsecy': [
    {
      authorSource: 'National Park Service',
      title: 'Grand Portage National Monument',
      url: 'https://www.nps.gov/grpo/',
      description: 'Official site for the reconstructed NWC depot.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageurs Highway',
      publisher: 'Minnesota Historical Society',
      year: '1941',
      description: 'History of the route from Grand Portage westward.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Grand Portage',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/grand-portage',
      description: 'Overview of the NWC summer rendezvous location.',
    },
  ],

  // Grande Décharge
  'cmlk1ohtp000lm2at4e9n5kau': [
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Guide to historic portages including Grande Décharge.',
    },
    {
      authorSource: 'Podruchny Carolyn',
      title: 'Making the Voyageur World',
      publisher: 'University of Toronto Press',
      year: '2006',
      description: 'Voyageur culture and the physical challenges of portaging.',
    },
    {
      authorSource: 'Quebec Tourism',
      title: 'Saguenay-Lac-Saint-Jean Region',
      url: 'https://www.quebecoriginal.com/',
      description: 'Regional tourism including historic canoe routes.',
    },
  ],

  // Great Dog Portage
  'cmlizphiu0003m2ybn31j3yf2': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageurs Highway',
      publisher: 'Minnesota Historical Society',
      year: '1941',
      description: 'Detailed history of the route including Dog Lake portages.',
    },
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Modern canoeist guide to historic portage routes.',
    },
    {
      authorSource: 'Ontario Parks',
      title: 'Quetico Provincial Park',
      url: 'https://www.ontarioparks.com/park/quetico',
      description: 'Wilderness park encompassing historic portage routes.',
    },
  ],

  // Hauteur des Terres
  'cmlk1ohsr0001m2atdr81i0k0': [
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Guide including the height of land portages.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Minnesota Historical Society',
      year: '1931',
      description: 'Classic study describing continental divide crossings.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Height of Land',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/height-of-land',
      description: 'Geographic and historical significance of watershed divides.',
    },
  ],

  // La Vase Portages
  'cmlk1ohte000fm2at6rkrfsdz': [
    {
      authorSource: 'Mackenzie Alexander',
      title: 'Voyages from Montreal through North America',
      publisher: 'T. Cadell Jr. and W. Davies',
      year: '1801',
      description: 'Primary account describing La Vase route to the French River.',
    },
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Detailed description of the Trout Lake to Lake Nipissing portages.',
    },
    {
      authorSource: 'North Bay Museum',
      title: 'La Vase Portages Heritage Trail',
      url: 'https://northbaymuseum.com/',
      description: 'Local heritage trail information.',
    },
  ],

  // Long Sault Portage
  'cmlk1ohsu0003m2atw65xozuc': [
    {
      authorSource: 'Legget Robert',
      title: 'Ottawa Waterway: Gateway to a Continent',
      publisher: 'University of Toronto Press',
      year: '1975',
      description: 'Ottawa River history including Long Sault rapids.',
    },
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain',
      publisher: 'Champlain Society',
      year: '1922–36',
      description: 'Primary accounts of early portaging on the Ottawa.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Ottawa River',
      url: 'https://www.pc.gc.ca/en/lhn-nhs/qc/cartierbrebeuf',
      description: 'Heritage information on the historic waterway.',
    },
  ],

  // Massacre Island (Lake of the Woods)
  'massacre_island_location': [
    {
      authorSource: 'Burpee Lawrence J.',
      title: 'Journals and Letters of Pierre Gaultier de Varennes de la Vérendrye',
      publisher: 'Champlain Society',
      year: '1927',
      description: 'Primary account of the 1736 massacre of La Vérendrye party.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'Caesars of the Wilderness',
      publisher: 'D. Appleton-Century',
      year: '1943',
      description: 'Context for French exploration and the Lake of the Woods tragedy.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'La Vérendrye',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/la-verendrye',
      description: 'Biography including the Massacre Island incident.',
    },
  ],

  // Methye Portage
  'cmlhbjrr8000zm2mbjknynnon': [
    {
      authorSource: 'Tyrrell J.B.',
      title: 'Journals of Samuel Hearne and Philip Turnor',
      publisher: 'Champlain Society',
      year: '1934',
      description: 'Primary accounts of crossing Methye Portage.',
    },
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Detailed description of the longest portage on the main route.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Methye Portage',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/methye-portage',
      description: 'Overview of the gateway to the Athabasca country.',
    },
  ],

  // Montreal
  'cmlhasls40020m2zhz16w8vz5': [
    {
      authorSource: 'Dechêne Louise',
      title: 'Habitants and Merchants in Seventeenth Century Montreal',
      publisher: 'McGill-Queens University Press',
      year: '1992',
      description: 'Social and economic history of early Montreal.',
    },
    {
      authorSource: 'Podruchny Carolyn',
      title: 'Making the Voyageur World',
      publisher: 'University of Toronto Press',
      year: '2006',
      description: 'Montreal as the starting point of the voyageur world.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Montreal',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/montreal',
      description: 'Overview of the fur trade metropolis.',
    },
  ],

  // Moose Factory
  'cmlhbjrrb0011m2mb7wkob1wv': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Moose Factory Post Journals',
      publisher: 'HBCA B.135/a series',
      description: 'Primary records from the second oldest HBC post.',
    },
    {
      authorSource: 'Francis Daniel and Morantz Toby',
      title: 'Partners in Furs',
      publisher: 'McGill-Queens University Press',
      year: '1983',
      description: 'James Bay fur trade including Moose Factory.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Moose Factory',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/moose-factory',
      description: 'Overview of Ontarios oldest English-speaking settlement.',
    },
  ],

  // Norway House
  'cmlhbjrrf0015m2mbj2bojm5s': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Norway House Post Journals',
      publisher: 'HBCA B.154/a series',
      description: 'Primary records from this major inland depot.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Norway House Cree Nation National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/norway',
      description: 'Official site for the preserved trading post.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Norway House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/norway-house',
      description: 'Overview of the strategic HBC distribution center.',
    },
  ],

  // Oxford House
  'cmlhcpxjz0007m2a39z07cplj': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Oxford House Post Journals',
      publisher: 'HBCA B.156/a series',
      description: 'Primary records from this Hayes River post.',
    },
    {
      authorSource: 'Tyrrell J.B.',
      title: 'Journals of Samuel Hearne and Philip Turnor',
      publisher: 'Champlain Society',
      year: '1934',
      description: 'Surveyor accounts including Oxford House region.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Oxford House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/oxford-house',
      description: 'Overview of the Manitoba Cree community.',
    },
  ],

  // Point Grey (Vancouver Meeting Point)
  'cmlhci09i001pm2rx0nywnjr9': [
    {
      authorSource: 'Vancouver George',
      title: 'A Voyage of Discovery to the North Pacific Ocean',
      publisher: 'G.G. and J. Robinson',
      year: '1798',
      description: 'Primary account of meeting Spanish explorers at Point Grey.',
    },
    {
      authorSource: 'Hayes Derek',
      title: 'Historical Atlas of Vancouver and the Lower Fraser Valley',
      publisher: 'Douglas and McIntyre',
      year: '2005',
      description: 'Cartographic history including the Vancouver-Galiano meeting.',
    },
    {
      authorSource: 'City of Vancouver',
      title: 'Point Grey History',
      url: 'https://vancouver.ca/',
      description: 'Local heritage information on the historic meeting site.',
    },
  ],

  // Port-Royal (Habitation)
  'cmlhci08v001bm2rx1qzcbb7o': [
    {
      authorSource: 'Parks Canada',
      title: 'Port-Royal National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/ns/portroyal',
      description: 'Official site for the reconstructed Habitation.',
    },
    {
      authorSource: 'Lescarbot Marc',
      title: 'The History of New France',
      publisher: 'Champlain Society',
      year: '1907–14',
      description: 'Primary account of early Acadian settlement.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Port-Royal',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/port-royal',
      description: 'Overview of the first permanent French settlement in North America.',
    },
  ],

  // Prince of Wales Fort
  'cmlhcpxik0001m2a32ftvmlnd': [
    {
      authorSource: 'Parks Canada',
      title: 'Prince of Wales Fort National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/prince',
      description: 'Official site for the massive stone fort ruins.',
    },
    {
      authorSource: 'Hearne Samuel',
      title: 'A Journey from Prince of Wales Fort in Hudsons Bay to the Northern Ocean',
      publisher: 'Champlain Society',
      year: '1911',
      description: 'Hearne account beginning at Prince of Wales Fort.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Prince of Wales Fort',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/prince-of-wales-fort',
      description: 'Overview of the stone fortress at Churchill.',
    },
  ],

  // Quebec City
  'cmlhasls4001zm2zhg7ahjwlx': [
    {
      authorSource: 'Trudel Marcel',
      title: 'Histoire de la Nouvelle-France',
      publisher: 'Fides',
      year: '1963–83',
      description: 'Comprehensive history of New France centered on Quebec.',
    },
    {
      authorSource: 'Parks Canada',
      title: 'Fortifications of Québec National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/qc/fortifications',
      description: 'Heritage information on the walled city.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Quebec City',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/quebec-city',
      description: 'Overview of the capital of New France.',
    },
  ],

  // Rat Portage
  'cmlk1oht50009m2atw1lxbena': [
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageurs Highway',
      publisher: 'Minnesota Historical Society',
      year: '1941',
      description: 'History of the route including Lake of the Woods area.',
    },
    {
      authorSource: 'Podruchny Carolyn',
      title: 'Making the Voyageur World',
      publisher: 'University of Toronto Press',
      year: '2006',
      description: 'Voyageur culture and the portage experience.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Kenora',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/kenora',
      description: 'Modern city at the historic Rat Portage location.',
    },
  ],

  // Red Bay Basque Whaling Station
  'cmlhci08x001dm2rxttfhbqjr': [
    {
      authorSource: 'Parks Canada',
      title: 'Red Bay National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/nl/redbay',
      description: 'UNESCO World Heritage Site information.',
    },
    {
      authorSource: 'Barkham Selma',
      title: 'The Basque Whaling Establishments in Labrador 1536–1632',
      publisher: 'Arctic Journal',
      year: '1984',
      description: 'Archaeological and historical study of Basque whaling.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Red Bay',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/red-bay',
      description: 'Overview of the sixteenth-century whaling capital.',
    },
  ],

  // Rocky Mountain House
  'cmlhcpxka000dm2a38u2u5e1v': [
    {
      authorSource: 'Parks Canada',
      title: 'Rocky Mountain House National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/ab/rockymountain',
      description: 'Official site for the preserved fur trade post.',
    },
    {
      authorSource: 'Smythe Terry',
      title: 'Thematic Study of the Fur Trade in the Canadian West',
      publisher: 'Parks Canada',
      year: '1968',
      description: 'Survey including Rocky Mountain House operations.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Rocky Mountain House',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/rocky-mountain-house',
      description: 'Overview of the gateway to the mountain passes.',
    },
  ],

  // Rocky Mountain House (NWC)
  'cmlhcpxoe001pm2a35trj97gi': [
    {
      authorSource: 'Johnson Alice M.',
      title: 'Saskatchewan Journals and Correspondence',
      publisher: 'Hudsons Bay Record Society',
      year: '1967',
      description: 'Primary documents from the NWC-HBC rivalry era.',
    },
    {
      authorSource: 'MacGregor James G.',
      title: 'Peter Fidler: Canadas Forgotten Explorer',
      publisher: 'Fifth House',
      year: '1998',
      description: 'Biography of the HBC surveyor who mapped the area.',
    },
    {
      authorSource: 'Alberta Culture',
      title: 'Rocky Mountain House History',
      url: 'https://www.alberta.ca/',
      description: 'Provincial heritage resources on the fur trade posts.',
    },
  ],

  // Rupert House (Fort Charles)
  'cmlhcpxqm002pm2a38i7y4iyx': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Rupert House Post Journals',
      publisher: 'HBCA B.186/a series',
      description: 'Primary records from the first HBC post on James Bay.',
    },
    {
      authorSource: 'Francis Daniel and Morantz Toby',
      title: 'Partners in Furs',
      publisher: 'McGill-Queens University Press',
      year: '1983',
      description: 'James Bay fur trade history including Rupert House.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Waskaganish',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/waskaganish',
      description: 'Modern Cree community at the historic Rupert House site.',
    },
  ],

  // Sault Ste. Marie
  'cmlhasls40023m2zhzrnt7rr9': [
    {
      authorSource: 'White Richard',
      title: 'The Middle Ground: Indians Empires and Republics in the Great Lakes Region',
      publisher: 'Cambridge University Press',
      year: '1991',
      description: 'Foundational work on Great Lakes Indigenous-European relations.',
    },
    {
      authorSource: 'Nute Grace Lee',
      title: 'The Voyageur',
      publisher: 'Minnesota Historical Society',
      year: '1931',
      description: 'Sault Ste. Marie as a key point on voyageur routes.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Sault Ste. Marie',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/sault-ste-marie-ontario',
      description: 'Overview of the strategic rapids portage site.',
    },
  ],

  // Sault Ste. Marie Post
  'cmlhcpxng0019m2a3aeo031li': [
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'Sault Ste. Marie Post Records',
      publisher: 'HBCA B.194/a series',
      description: 'Primary records from this Great Lakes post.',
    },
    {
      authorSource: 'Morrison Jean',
      title: 'Superior Rendezvous Place',
      publisher: 'Natural Heritage Books',
      year: '2001',
      description: 'Context for trade through Sault Ste. Marie.',
    },
    {
      authorSource: 'Sault Ste. Marie Museum',
      title: 'Local History',
      url: 'https://saultmuseum.com/',
      description: 'Regional museum resources on fur trade heritage.',
    },
  ],

  // Slave Falls Portage
  'cmlk1ohtm000jm2atwndo0iu1': [
    {
      authorSource: 'Morse Eric W.',
      title: 'Fur Trade Canoe Routes of Canada: Then and Now',
      publisher: 'University of Toronto Press',
      year: '1969',
      description: 'Guide to historic portages including Slave Falls.',
    },
    {
      authorSource: 'Tyrrell J.B.',
      title: 'Journals of Samuel Hearne and Philip Turnor',
      publisher: 'Champlain Society',
      year: '1934',
      description: 'Surveyor accounts of northern waterways.',
    },
    {
      authorSource: 'Manitoba Hydro',
      title: 'Slave Falls Generating Station',
      url: 'https://www.hydro.mb.ca/',
      description: 'Modern context for the historic portage location.',
    },
  ],

  // Spanish Banks Beach
  'cmlhci095001hm2rxh06cgnow': [
    {
      authorSource: 'Vancouver George',
      title: 'A Voyage of Discovery to the North Pacific Ocean',
      publisher: 'G.G. and J. Robinson',
      year: '1798',
      description: 'Primary account of meeting Spanish explorers in Burrard Inlet.',
    },
    {
      authorSource: 'Hayes Derek',
      title: 'Historical Atlas of Vancouver and the Lower Fraser Valley',
      publisher: 'Douglas and McIntyre',
      year: '2005',
      description: 'Cartographic history including the 1792 encounter.',
    },
    {
      authorSource: 'City of Vancouver',
      title: 'Spanish Banks',
      url: 'https://vancouver.ca/parks-recreation-culture/spanish-bank.aspx',
      description: 'Park information at the historic meeting site.',
    },
  ],

  // Spokane House
  'cmlhcpxol001tm2a3z4iparrf': [
    {
      authorSource: 'Ross Alexander',
      title: 'Adventures of the First Settlers on the Oregon or Columbia River',
      publisher: 'Smith Elder and Co.',
      year: '1849',
      description: 'Primary account of Pacific Fur Company and NWC in Spokane country.',
    },
    {
      authorSource: 'Ruby Robert and Brown John',
      title: 'The Spokane Indians: Children of the Sun',
      publisher: 'University of Oklahoma Press',
      year: '1970',
      description: 'Spokane tribal history including fur trade relations.',
    },
    {
      authorSource: 'Washington State Parks',
      title: 'Spokane House Interpretive Center',
      url: 'https://parks.wa.gov/',
      description: 'State park information on the preserved trading post site.',
    },
  ],

  // Tadoussac
  'cmlhbjrrk0019m2mbo76o9uph': [
    {
      authorSource: 'Trigger Bruce G.',
      title: 'Natives and Newcomers',
      publisher: 'McGill-Queens University Press',
      year: '1985',
      description: 'Early contact history including Tadoussac trading.',
    },
    {
      authorSource: 'Champlain Samuel de',
      title: 'The Works of Samuel de Champlain',
      publisher: 'Champlain Society',
      year: '1922–36',
      description: 'Primary accounts of Tadoussac visits.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Tadoussac',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/tadoussac',
      description: 'Overview of one of North Americas oldest trading posts.',
    },
  ],

  // The Pas Portage
  'cmlk1ohth000hm2atid2o0cto': [
    {
      authorSource: 'Smythe Terry',
      title: 'Thematic Study of the Fur Trade in the Canadian West',
      publisher: 'Parks Canada',
      year: '1968',
      description: 'Survey of fur trade routes including The Pas.',
    },
    {
      authorSource: 'Tyrrell J.B.',
      title: 'Journals of Samuel Hearne and Philip Turnor',
      publisher: 'Champlain Society',
      year: '1934',
      description: 'Surveyor accounts of the Saskatchewan River system.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'The Pas',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/the-pas',
      description: 'Overview of the historic Cree gathering place.',
    },
  ],

  // Upper Fort Garry
  'cmligbl0q002cm20z7q06luf5': [
    {
      authorSource: 'Begg Alexander',
      title: 'History of the North-West',
      publisher: 'Hunter Rose and Co.',
      year: '1894',
      description: 'Red River history including Upper Fort Garry.',
    },
    {
      authorSource: 'Upper Fort Garry Heritage Provincial Park',
      title: 'Upper Fort Garry',
      url: 'https://www.upperfortgarry.com/',
      description: 'Heritage park preserving the fort gate and grounds.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Upper Fort Garry',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/upper-fort-garry',
      description: 'Overview of the HBC post that became Winnipeg.',
    },
  ],

  // York Factory
  'cmlhasls40021m2zhu35xikyc': [
    {
      authorSource: 'Parks Canada',
      title: 'York Factory National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/yorkfactory',
      description: 'Official site for the preserved depot building.',
    },
    {
      authorSource: "Hudson's Bay Company Archives",
      title: 'York Factory Post Journals',
      publisher: 'HBCA B.239/a series',
      description: 'Primary records from the HBC main depot on Hudson Bay.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'York Factory',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/york-factory',
      description: 'Overview of the gateway to the Canadian interior.',
    },
  ],

  // Kootenay House
  'cmlhcpxoi001rm2a3o6bx74af': [
    {
      authorSource: 'Nisbet Jack',
      title: 'Sources of the River: Tracking David Thompson Across North America',
      publisher: 'Sasquatch Books',
      year: '1994',
      description: 'Biography covering Thompson establishing Kootenay House.',
    },
    {
      authorSource: 'Tyrrell J.B. (ed.)',
      title: 'David Thompsons Narrative of his Explorations in Western America',
      publisher: 'Champlain Society',
      year: '1916',
      description: 'Primary account of Thompson crossing the Rockies.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'David Thompson',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/david-thompson',
      description: 'Biography of the explorer who established Kootenay House.',
    },
  ],

  // La Pérouse Memorial (Lituya Bay)
  'cmlhci09d001nm2rxalbz2n3h': [
    {
      authorSource: 'La Pérouse Jean-François de Galaup',
      title: 'Voyage Round the World in the Years 1785–1788',
      publisher: 'Various',
      year: '1797',
      description: 'Primary account of the ill-fated French expedition.',
    },
    {
      authorSource: 'Dunmore John',
      title: 'Pacific Explorer: The Life of Jean-François de la Pérouse',
      publisher: 'Dunmore Press',
      year: '1985',
      description: 'Biography of the French navigator.',
    },
    {
      authorSource: 'National Park Service',
      title: 'Glacier Bay National Park',
      url: 'https://www.nps.gov/glba/',
      description: 'Park information including Lituya Bay history.',
    },
  ],

  // Lower Fort Garry
  'cmlhcpxla000lm2a36zgze0vh': [
    {
      authorSource: 'Parks Canada',
      title: 'Lower Fort Garry National Historic Site',
      url: 'https://parks.canada.ca/lhn-nhs/mb/fgarry',
      description: 'Official site for the best-preserved stone fur trade post.',
    },
    {
      authorSource: 'Newman Peter C.',
      title: 'Company of Adventurers',
      publisher: 'Viking',
      year: '1985',
      description: 'HBC history including Lower Fort Garry.',
    },
    {
      authorSource: 'The Canadian Encyclopedia',
      title: 'Lower Fort Garry',
      url: 'https://www.thecanadianencyclopedia.ca/en/article/lower-fort-garry',
      description: 'Overview of the 1830s stone fort.',
    },
  ],
};
