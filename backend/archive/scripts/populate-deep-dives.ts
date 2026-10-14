import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Red River Cart Lesson Plan
const redRiverCartContent = {
  id: "cmliiajcq000am2u2h58ck1el",
  narrativeContent: `The distinctive sound of the Red River cart was unmistakable across the prairies of 19th-century North America. A high-pitched shriek, audible from miles away, announced the approach of these remarkable vehicles that would become one of the most iconic symbols of Metis ingenuity and the fur trade era. This sound, often described as unearthly or even ghostly, was not a defect but a design feature - the wooden wheels were deliberately left ungreased because lubricating them with animal fat would attract dust and grit that would quickly wear down the wooden components.

The Red River cart emerged in the early 1800s as a practical solution to a pressing transportation challenge. The Metis people, born of the union between Indigenous mothers and European fur traders, had developed a unique culture that blended the best of both worlds. They needed a vehicle that could traverse the vast distances between settlements, navigate the unforgiving terrain of the prairies, cross rivers and marshlands, and carry the heavy loads of pemmican, furs, and trade goods that were the lifeblood of their economy.

The genius of the Red River cart lay in its simplicity and adaptability. Constructed entirely of wood and leather, without a single piece of metal, these carts could be built and repaired anywhere using locally available materials. A skilled craftsman could fashion one in a matter of days using oak, ash, or even poplar for the frame, and rawhide strips called "shaganappi" to bind the components together. The large wheels, typically standing five to six feet in diameter, allowed the cart to roll over prairie grasses, through muddy trails, and across shallow streams without becoming mired.

When deeper water presented itself, the ingenious design revealed another advantage. The entire cart could be disassembled and the parts arranged to form a raft, with the wheels serving as flotation devices when wrapped in animal hides. The Metis drivers, known for their remarkable skill and endurance, would swim their horses across while the cargo floated safely on these improvised rafts. Once on the other side, the cart would be reassembled and the journey would continue.

The carts typically hauled loads weighing between 800 and 1,000 pounds, though some accounts speak of loads exceeding 1,200 pounds when the trails were dry and firm. A single ox or horse would pull each cart, and the animals were changed regularly to prevent exhaustion on the longer journeys. The carts moved at a walking pace of about two to three miles per hour, but what they lacked in speed they made up for in reliability and carrying capacity.

The great Metis cart trains that traversed the prairies were impressive spectacles. During the peak years of the mid-19th century, brigades of several hundred carts would travel together, stretching for miles across the landscape. The trail from Red River Settlement (present-day Winnipeg) to St. Paul, Minnesota, became known as the Red River Trail, and it was worn so deeply into the prairie by countless cart wheels that traces of it can still be seen today in some areas.

Life on the cart trails was both arduous and communal. The Metis drivers developed elaborate social customs and protocols for the journey. Each morning would begin with prayers and a shared meal before the long day's travel. The cart trains would spread out during the day to avoid the worst of the dust kicked up by the leading vehicles, then reconvene each evening to form a protective circle - a configuration that offered defense against potential threats and created a social space for the evening's activities.

These evening gatherings were occasions for storytelling, music, and dance. The Metis are famous for their fiddle music and the distinctive Red River jig, and the cart trains provided regular opportunities for these cultural expressions. Young people would court, elders would share wisdom, and the community bonds that held Metis society together would be strengthened with each journey.

The economic importance of the Red River cart cannot be overstated. These vehicles were the trucks of their era, the essential infrastructure that connected the fur trade posts of the interior with the markets of the wider world. Without them, the vast quantities of pemmican needed to provision the voyageur brigades could never have been transported. Without them, the furs that were the currency of the northern economy would have languished in remote posts, unable to reach the ships that carried them to European markets.

The pemmican trade was particularly significant. This concentrated food, made from dried buffalo meat pounded with fat and sometimes berries, was the perfect provision for long journeys. It was lightweight, nutritious, and nearly imperishable. The Metis became expert pemmican producers, and their Red River carts were the means by which this essential commodity reached the fur trade posts throughout the Northwest. A single cart could carry enough pemmican to feed a crew of voyageurs for weeks.

The Metis women played crucial roles in this economy. They were the primary producers of pemmican, overseeing every step of the process from the initial buffalo hunt to the final packing of the dried meat into leather bags. They also manufactured the shaganappi that held the carts together, prepared the hides that were traded, and managed the domestic economy that sustained the cart brigades during their long journeys.

The era of the Red River cart began to wane in the 1870s with the arrival of steamboats on the Red River and, more decisively, with the completion of railway lines that connected the prairies to the outside world. By the 1880s, the great cart trains had largely disappeared, replaced by the speed and efficiency of steam transportation. But the carts had served their purpose, facilitating the development of an entire region and sustaining a people through a crucial period of their history.

Today, the Red River cart stands as a powerful symbol of Metis identity and achievement. Replicas can be found in museums and heritage sites across Canada and the northern United States, and the distinctive design is instantly recognizable to anyone familiar with the history of the fur trade era. The Metis flag often incorporates imagery associated with the carts, and the phrase "Red River cart" evokes an entire way of life that flourished on the prairies for the better part of a century.

The legacy of the Red River cart extends beyond its immediate historical context. It represents a triumph of practical engineering, a solution born of necessity that proved remarkably effective for its intended purpose. It demonstrates the creativity and adaptability of the Metis people, who drew upon both Indigenous and European traditions to create something entirely new. And it reminds us that the development of North America was not the work of any single culture, but the product of countless interactions and collaborations between peoples of different backgrounds.

When we hear about the screaming wheels of the Red River carts, we should imagine not just the sound itself, but the entire world it represented: the vast prairies stretching to the horizon, the great buffalo herds that still roamed the land, the communities of Metis families traveling together in their annual rounds, and the intricate networks of trade and kinship that connected people across enormous distances. The Red River cart was more than a vehicle; it was a civilization on wheels.`,
  heroImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Red_River_ox_cart.jpg/1280px-Red_River_ox_cart.jpg",
  images: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Metis_-_Red_River_cart.jpg/1280px-Metis_-_Red_River_cart.jpg",
      caption: "A preserved Red River cart showing the distinctive large wooden wheels",
      credit: "Wikimedia Commons"
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Red_River_Trails_map.png/800px-Red_River_Trails_map.png",
      caption: "Map showing the major Red River cart trails connecting settlements",
      credit: "Wikimedia Commons"
    }
  ],
  keyFigures: [
    {
      name: "Jean-Baptiste Lagimodiere",
      role: "Early Metis Settler",
      years: "1778-1855",
      description: "One of the first European settlers in the Red River area, whose family became prominent in Metis society. His grandson was Louis Riel."
    },
    {
      name: "Cuthbert Grant",
      role: "Metis Leader",
      years: "1793-1854",
      description: "A prominent Metis leader who organized and led many of the great cart brigades. He became the first Warden of the Plains and played a key role in establishing Metis political identity."
    },
    {
      name: "Marie-Anne Gaboury",
      role: "Pioneer Woman",
      years: "1780-1875",
      description: "The first European woman to travel to the Canadian Northwest, she became an important figure in early Red River Settlement and grandmother to Louis Riel."
    }
  ],
  timeline: [
    {
      year: 1801,
      title: "First Red River Carts",
      description: "The earliest Red River carts are developed by Metis craftsmen at the confluence of the Red and Assiniboine rivers."
    },
    {
      year: 1820,
      title: "Cart Trails Established",
      description: "Regular cart trails begin connecting Red River Settlement to trading posts throughout the region."
    },
    {
      year: 1844,
      title: "Peak of Pemmican Trade",
      description: "The pemmican trade reaches its height, with hundreds of carts transporting the essential provision to fur trade posts."
    },
    {
      year: 1858,
      title: "St. Paul Trail at Peak",
      description: "The trail to St. Paul, Minnesota sees over 600 carts in a single brigade, marking the peak of the Red River cart era."
    },
    {
      year: 1871,
      title: "Steamboat Competition",
      description: "Regular steamboat service on the Red River begins to compete with cart transportation."
    },
    {
      year: 1878,
      title: "Railway Arrives",
      description: "The first railway reaches Winnipeg, effectively ending the era of the Red River cart as the primary means of transportation."
    }
  ],
  readingTimeMinutes: 12,
  teacherObjectives: [
    "Students will understand the engineering principles behind the Red River cart design and explain why specific design choices were made",
    "Students will analyze the economic role of the Red River cart in the fur trade system",
    "Students will recognize the contributions of Metis culture to Canadian history and identity",
    "Students will evaluate how technology and transportation shaped the development of the Canadian prairies",
    "Students will identify the roles of different community members in the cart brigade system"
  ],
  teacherActivities: [
    {
      title: "Build a Model Cart",
      description: "Students work in groups to construct a small-scale model of a Red River cart using only wooden sticks, string, and cardboard. Challenge them to make it functional while following the 'no metal' rule.",
      materials: "Wooden popsicle sticks, string, cardboard, scissors, rulers",
      duration: "45-60 minutes"
    },
    {
      title: "Sound Engineering Experiment",
      description: "Investigate why the carts squeaked by experimenting with friction. Students rub wooden blocks together dry vs. with different lubricants and discuss the trade-offs the Metis faced.",
      materials: "Wooden blocks, vegetable oil, sand, recording device",
      duration: "30 minutes"
    },
    {
      title: "Trade Route Mapping",
      description: "Students use historical maps to trace Red River cart routes and calculate distances, travel times, and the amount of goods that could be transported in a season.",
      materials: "Historical maps, calculators, graph paper",
      duration: "40 minutes"
    },
    {
      title: "Pemmican Making Demonstration",
      description: "Prepare a modified version of pemmican using dried fruit, nuts, and coconut oil to understand the preservation techniques used by the Metis.",
      materials: "Dried fruit, nuts, coconut oil, mixing bowls",
      duration: "30 minutes"
    }
  ],
  teacherQuestions: [
    "Why did the Metis choose not to use metal in their cart construction? What advantages and disadvantages did this create?",
    "How did the Red River cart reflect the blending of Indigenous and European knowledge?",
    "What role did women play in the economy supported by the Red River carts?",
    "How might the daily life of a cart brigade compare to a modern road trip?",
    "Why did the Red River cart era end, and what does this tell us about technological change?",
    "How does the Red River cart serve as a symbol of Metis identity today?",
    "What modern transportation challenges might benefit from the design principles of the Red River cart?"
  ],
  teacherNotes: `This lesson connects well to curriculum outcomes related to Indigenous contributions to Canadian society, technological innovation, and the fur trade era.

Key teaching points:
- Emphasize that the Red River cart was a Metis innovation, reflecting their unique cultural position between Indigenous and European worlds
- The "shrieking" sound was not a flaw but a conscious design choice - use this to discuss engineering trade-offs
- Connect to geography by examining how the terrain of the prairies influenced cart design
- The communal nature of cart brigades offers opportunities to discuss social organization and community

Sensitive considerations:
- The decline of the cart era coincided with significant challenges for Metis communities, including the Red River Resistance
- Present Metis history as living history - many Metis communities continue to celebrate and maintain these traditions
- Avoid presenting the cart era as simply "in the past" - connect to ongoing Metis cultural revival

Extension opportunities:
- Connect to Louis Riel and the Red River Resistance
- Explore the role of the Hudson's Bay Company and North West Company
- Investigate modern Metis communities and cultural practices
- Compare to other historical transportation systems worldwide`
};

async function updateRedRiverCart() {
  console.log("Updating Red River Cart lesson plan...");

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
        redRiverCartContent.narrativeContent,
        redRiverCartContent.heroImageUrl,
        JSON.stringify(redRiverCartContent.images),
        JSON.stringify(redRiverCartContent.keyFigures),
        JSON.stringify(redRiverCartContent.timeline),
        redRiverCartContent.readingTimeMinutes,
        JSON.stringify(redRiverCartContent.teacherObjectives),
        JSON.stringify(redRiverCartContent.teacherActivities),
        JSON.stringify(redRiverCartContent.teacherQuestions),
        redRiverCartContent.teacherNotes,
        redRiverCartContent.id
      ]
    });

    console.log("Red River Cart update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating Red River Cart:", error);
    throw error;
  }
}

// Run the update
updateRedRiverCart()
  .then(() => {
    console.log("Successfully updated Red River Cart lesson plan");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to update:", error);
    process.exit(1);
  });
