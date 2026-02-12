/**
 * Seed file to add Creative Commons and Public Domain images to Virtual Field Trip stops
 *
 * All images are sourced from Wikimedia Commons with appropriate licenses:
 * - Public Domain (PD)
 * - CC BY-SA 4.0/3.0/2.0
 * - CC BY 4.0/3.0/2.0
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface FieldTripImageData {
  tripTitle: string;
  coverImageUrl: string;
  stops: {
    title: string;
    imageUrl: string;
  }[];
}

const fieldTripImages: FieldTripImageData[] = [
  // ==================== FORT WILLIAM ====================
  {
    tripTitle: "Fort William: North West Company Rendezvous",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Old_Fort_William_-_panoramio.jpg/1280px-Old_Fort_William_-_panoramio.jpg",
    stops: [
      {
        title: "Arrival at the Great Hall",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Fort_William_Historical_Park_%286021299353%29.jpg/1280px-Fort_William_Historical_Park_%286021299353%29.jpg",
      },
      {
        title: "The Canoe Yard",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Canoe_brigade_-_Old_Fort_William.jpg/1280px-Canoe_brigade_-_Old_Fort_William.jpg",
      },
      {
        title: "The Trade Warehouse",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Fort_William_Historical_Park_%286021855298%29.jpg/1280px-Fort_William_Historical_Park_%286021855298%29.jpg",
      },
      {
        title: "The Voyageur Encampment",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/FortWilliamRenactors.jpg/1280px-FortWilliamRenactors.jpg",
      },
      {
        title: "The Council Chamber",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Fort_William_Historical_Park_%286021291735%29.jpg/1280px-Fort_William_Historical_Park_%286021291735%29.jpg",
      },
      {
        title: "Indigenous Partnership",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg/1280px-Voyageurs_at_Dawn_by_Frances_Anne_Hopkins.jpg",
      },
    ],
  },

  // ==================== L'ANSE AUX MEADOWS ====================
  {
    tripTitle: "L'Anse aux Meadows: Norse Settlement in the New World",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/L%27Anse_aux_Meadows%2C_recreated_long_house.jpg/1280px-L%27Anse_aux_Meadows%2C_recreated_long_house.jpg",
    stops: [
      {
        title: "The Viking Landing",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/L%27Anse_aux_Meadows_overview.jpg/1280px-L%27Anse_aux_Meadows_overview.jpg",
      },
      {
        title: "The Great Hall",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/L%27Anse_aux_Meadows%2C_recreated_long_house.jpg/1280px-L%27Anse_aux_Meadows%2C_recreated_long_house.jpg",
      },
      {
        title: "The Forge",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/L%27Anse_aux_Meadows_inside_a_recreation_of_a_Viking_building.jpg/1280px-L%27Anse_aux_Meadows_inside_a_recreation_of_a_Viking_building.jpg",
      },
      {
        title: "Boat Repair",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Anse_aux_Meadows_coast.jpg/1280px-Anse_aux_Meadows_coast.jpg",
      },
      {
        title: "Meeting the Skrælings",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/L%27Anse_aux_Meadows_2017.jpg/1280px-L%27Anse_aux_Meadows_2017.jpg",
      },
      {
        title: "Archaeological Discovery",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/L%27Anse_aux_Meadows_-_Recreation_of_a_Viking_site_-_01.jpg/1280px-L%27Anse_aux_Meadows_-_Recreation_of_a_Viking_site_-_01.jpg",
      },
    ],
  },

  // ==================== PRINCE OF WALES FORT ====================
  {
    tripTitle: "Prince of Wales Fort: Stone Fortress on Hudson Bay",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
    stops: [
      {
        title: "The Star Fort",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg/1280px-Prince_of_Wales_Fort%2C_Manitoba%2C_Canada.jpg",
      },
      {
        title: "The Cannon Batteries",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Prince_of_Wales_Fort_Cannon.jpg/1280px-Prince_of_Wales_Fort_Cannon.jpg",
      },
      {
        title: "The 1782 Surrender",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Samuel_Hearne.jpg/800px-Samuel_Hearne.jpg",
      },
      {
        title: "The Trade Post",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/HBC_point_blanket_postcard.jpg/1280px-HBC_point_blanket_postcard.jpg",
      },
      {
        title: "Samuel Hearne's Expeditions",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/A_Journey_from_Prince_of_Wales%27s_Fort_in_Hudson%27s_Bay_to_the_Northern_Ocean_1769%2C_1770%2C_1771%2C_1772_%28IA_journeyfromPrinc00hear%29.pdf/page1-423px-A_Journey_from_Prince_of_Wales%27s_Fort_in_Hudson%27s_Bay_to_the_Northern_Ocean_1769%2C_1770%2C_1771%2C_1772_%28IA_journeyfromPrinc00hear%29.pdf.jpg",
      },
      {
        title: "Visiting Today",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Churchill_polar_bears.jpg/1280px-Churchill_polar_bears.jpg",
      },
    ],
  },

  // ==================== YORK FACTORY ====================
  {
    tripTitle: "York Factory: Gateway to the West",
    coverImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
    stops: [
      {
        title: "Arriving by Ship from England",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/A_Ship_of_the_Hudson%27s_Bay_Company_in_the_Ice.jpg/1280px-A_Ship_of_the_Hudson%27s_Bay_Company_in_the_Ice.jpg",
      },
      {
        title: "The Depot Building",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/York_Factory.jpg/1280px-York_Factory.jpg",
      },
      {
        title: "The Trading Room",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/A_Beaver_Lodge_in_Canada.jpg/1280px-A_Beaver_Lodge_in_Canada.jpg",
      },
      {
        title: "The Warehouse",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/York_Factory_Depot_Building_1.jpg/1280px-York_Factory_Depot_Building_1.jpg",
      },
      {
        title: "The Cemetery",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/York_Factory_Graveyard.jpg/1280px-York_Factory_Graveyard.jpg",
      },
      {
        title: "Departure by York Boat",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/York_boat_on_river.jpg/1280px-York_boat_on_river.jpg",
      },
    ],
  },
];

async function seedFieldTripImages(): Promise<void> {
  console.log("Starting seed for Virtual Field Trip images...\n");

  let tripsUpdated = 0;
  let stopsUpdated = 0;

  for (const tripData of fieldTripImages) {
    // Find the field trip
    const trip = await prisma.virtualFieldTrip.findFirst({
      where: { title: tripData.tripTitle },
      include: { stops: true },
    });

    if (!trip) {
      console.log(`  ⚠ Skipping: "${tripData.tripTitle}" not found`);
      continue;
    }

    // Update the trip cover image
    await prisma.virtualFieldTrip.update({
      where: { id: trip.id },
      data: { coverImageUrl: tripData.coverImageUrl },
    });
    console.log(`  ✓ Updated cover image for: ${tripData.tripTitle}`);
    tripsUpdated++;

    // Update each stop's image
    for (const stopData of tripData.stops) {
      const stop = trip.stops.find((s) => s.title === stopData.title);
      if (stop) {
        await prisma.fieldTripStop.update({
          where: { id: stop.id },
          data: { imageUrl: stopData.imageUrl },
        });
        console.log(`    → Updated image for stop: ${stopData.title}`);
        stopsUpdated++;
      } else {
        console.log(`    ⚠ Stop not found: ${stopData.title}`);
      }
    }
  }

  console.log(`\n=== Seed Complete ===`);
  console.log(`Trips updated: ${tripsUpdated}`);
  console.log(`Stops updated: ${stopsUpdated}`);
}

// Run seed
seedFieldTripImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
