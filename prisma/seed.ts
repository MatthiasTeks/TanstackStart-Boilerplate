import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { addDays, subDays } from "date-fns";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in the correct order to respect foreign key constraints
  await prisma.drinkEntry.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.votingResult.deleteMany();
  await prisma.fish.deleteMany();
  await prisma.galleryPhoto.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.fishType.deleteMany();

  console.log("Database cleared");

  const fishTypes = await Promise.all([
    prisma.fishType.create({
      data: {
        name: "Carpe commune",
        coefficient: 1.0,
      },
    }),
    prisma.fishType.create({
      data: {
        name: "Carpe miroir",
        coefficient: 1,
      },
    }),
    prisma.fishType.create({
      data: {
        name: "Carpe koi",
        coefficient: 2,
      },
    }),
    prisma.fishType.create({
      data: {
        name: "Amour blanc",
        coefficient: 1,
      },
    }),
    prisma.fishType.create({
      data: {
        name: "Esturgeon",
        coefficient: 1,
      },
    }),
  ]);

  console.log("Fish types created:", fishTypes);

  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Lils & Matt",
      },
    }),
    prisma.team.create({
      data: {
        name: "Nath & Liam",
      },
    }),
    prisma.team.create({
      data: {
        name: "Flow et Pabli",
      },
    }),
  ]);

  console.log("Teams created:", teams);

  const saltRounds = 10;
  const pepper = process.env.PEPPER?.toString();
  if (!pepper)
    throw new Error(
      "Authentication is not configured. PEPPER environment variable is missing.",
    );

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "nath",
        password: await bcrypt.hash("nath18" + pepper, saltRounds),
        teamId: teams[1].id, // Nath & Liam
      },
    }),
    prisma.user.create({
      data: {
        username: "liam",
        password: await bcrypt.hash("liam18" + pepper, saltRounds),
        teamId: teams[1].id, // Nath & Liam
      },
    }),
    prisma.user.create({
      data: {
        username: "math",
        password: await bcrypt.hash("math18" + pepper, saltRounds),
        teamId: teams[0].id, // Lils & Matt
      },
    }),
    prisma.user.create({
      data: {
        username: "lils",
        password: await bcrypt.hash("lils18" + pepper, saltRounds),
        teamId: teams[0].id, // Lils & Matt
      },
    }),
    prisma.user.create({
      data: {
        username: "flow",
        password: await bcrypt.hash("flow18" + pepper, saltRounds),
        teamId: teams[2].id, // Flow et Pabli
      },
    }),
    prisma.user.create({
      data: {
        username: "pabli",
        password: await bcrypt.hash("pabli18" + pepper, saltRounds),
        teamId: teams[2].id, // Flow et Pabli
      },
    }),
  ]);

  console.log("Users created:", users);

  // Create fish entries for the past 7 days
  const today = new Date();
  const allFishTypes = await prisma.fishType.findMany();
  
  // Create fish for each team over the past week
  const fishEntries = [];
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    // Each team catches 2-5 fish over the week
    const fishCount = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < fishCount; j++) {
      // Random day in the past week
      const daysAgo = Math.floor(Math.random() * 7);
      const catchDate = subDays(today, daysAgo);
      
      // Random fish type
      const fishType = allFishTypes[Math.floor(Math.random() * allFishTypes.length)];
      
      // Random weight between 1kg and 15kg
      const weight = Math.floor(Math.random() * 14000) + 1000;
      
      // Calculate points based on weight and coefficient
      const points = Math.floor(weight * fishType.coefficient / 1000);
      
      const fish = await prisma.fish.create({
        data: {
          weight,
          points,
          typeId: fishType.id,
          teamId: team.id,
          createdAt: catchDate,
          updatedAt: catchDate,
          image: null,
          boosted: false,
        }
      });
      
      fishEntries.push(fish);
    }
  }
  
  console.log(`Created ${fishEntries.length} fish entries`);
  
  // Ensure we have fish specifically for April 29, 2025 (yesterday) for voting
  const yesterday = new Date('2025-04-29T12:00:00');
  
  // Create one fish for each team on April 29
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    // Random fish type
    const fishType = allFishTypes[Math.floor(Math.random() * allFishTypes.length)];
    
    // Random weight between 5kg and 20kg to make them interesting catches
    const weight = Math.floor(Math.random() * 15000) + 5000;
    
    // Calculate points based on weight and coefficient
    const points = Math.floor(weight * fishType.coefficient / 1000);
    
    const fish = await prisma.fish.create({
      data: {
        weight,
        points,
        typeId: fishType.id,
        teamId: team.id,
        createdAt: yesterday,
        updatedAt: yesterday,
        image: null,
        boosted: false,
      }
    });
    
    fishEntries.push(fish);
    console.log(`Created fish for team ${team.name} on April 29, 2025: ${weight}g ${fishType.name}`);
  }
  
  
  // Create drink entries for the past 7 days
  const drinkEntries = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // Each user has 1-10 drink entries over the week
    const drinkCount = Math.floor(Math.random() * 10) + 1;
    
    for (let j = 0; j < drinkCount; j++) {
      // Random day in the past week
      const daysAgo = Math.floor(Math.random() * 7);
      const drinkDate = subDays(today, daysAgo);
      
      // Random count between 1 and 3 drinks per entry
      const count = Math.floor(Math.random() * 3) + 1;
      
      const drinkEntry = await prisma.drinkEntry.create({
        data: {
          count,
          userId: user.id,
          teamId: user.teamId,
          createdAt: drinkDate,
          date: drinkDate,
        }
      });
      
      drinkEntries.push(drinkEntry);
    }
  }
  
  console.log(`Created ${drinkEntries.length} drink entries`);
  
  // Create some specific entries to ensure interesting data patterns
  
  // Heavy drinker
  const heavyDrinker = users[0]; // nath
  await prisma.drinkEntry.create({
    data: {
      count: 5,
      userId: heavyDrinker.id,
      teamId: heavyDrinker.teamId,
      createdAt: subDays(today, 1),
      date: subDays(today, 1),
    }
  });
  
  // Efficient team (more fish than drinks)
  const efficientTeam = teams[0]; // Lils & Matt
  const efficientFishType = allFishTypes.find(ft => ft.name === "Carpe koi");
  if (efficientFishType) {
    await prisma.fish.create({
      data: {
        weight: 12000, // 12kg
        points: Math.floor(12000 * efficientFishType.coefficient / 1000),
        typeId: efficientFishType.id,
        teamId: efficientTeam.id,
        createdAt: subDays(today, 2),
        updatedAt: subDays(today, 2),
        image: null,
        boosted: false,
      }
    });
  }
  
  // Inefficient team (more drinks than fish)
  const inefficientTeam = teams[2]; // Flow et Pabli
  const inefficientTeamUsers = users.filter(u => u.teamId === inefficientTeam.id);
  for (const user of inefficientTeamUsers) {
    await prisma.drinkEntry.create({
      data: {
        count: 4,
        userId: user.id,
        teamId: user.teamId,
        createdAt: subDays(today, 1),
        date: subDays(today, 1),
      }
    });
  }

  // Create votes for the fish entries
  console.log('Creating votes for fish entries...');
  
  // Get all fish entries
  const allFish = await prisma.fish.findMany();
  
  // Specifically handle April 29, 2025 (yesterday) for voting
  const yesterdayDate = new Date('2025-04-29');
  
  // Find fish from April 29, 2025
  const yesterdayFish = allFish.filter(fish => {
    const fishDate = new Date(fish.createdAt);
    return fishDate.toDateString() === yesterdayDate.toDateString();
  });
  
  if (yesterdayFish.length > 0) {
    console.log(`Found ${yesterdayFish.length} fish from April 29, 2025 for voting`);
    
    // Distribute votes among all fish from yesterday
    for (const fish of yesterdayFish) {
      // Create 5-15 votes for each fish
      const voteCount = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < voteCount; i++) {
        // Generate a random IP address
        const ipAddress = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        
        try {
          await prisma.vote.create({
            data: {
              fishId: fish.id,
              ipAddress,
              createdAt: yesterdayDate,
              votingDay: yesterdayDate,
            }
          });
        } catch (error) {
          // Skip duplicate IP addresses for the same day
          console.log(`Skipping duplicate vote for IP ${ipAddress} on ${yesterdayDate.toDateString()}`);
        }
      }
      
      console.log(`Created ${voteCount} votes for fish ID ${fish.id} (team: ${fish.teamId}) on April 29, 2025`);
    }
    
    // Don't create a voting result for yesterday yet, as it should be still open for voting
  }
  
  // Create votes and results for earlier days (processed votes)
  for (let daysAgo = 2; daysAgo < 5; daysAgo++) {
    const votingDay = subDays(today, daysAgo);
    
    // Skip April 29 as we've already handled it
    if (votingDay.toDateString() === yesterdayDate.toDateString()) {
      continue;
    }
    
    // Select a random fish from each day to receive votes
    const fishForDay = allFish.filter(fish => {
      const fishDate = new Date(fish.createdAt);
      return fishDate.toDateString() === votingDay.toDateString();
    });
    
    if (fishForDay.length > 0) {
      // Choose a random fish to be the winner for this day
      const winningFish = fishForDay[Math.floor(Math.random() * fishForDay.length)];
      
      // Create 10-20 votes for the winning fish
      const voteCount = Math.floor(Math.random() * 11) + 10;
      
      for (let i = 0; i < voteCount; i++) {
        // Generate a random IP address
        const ipAddress = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        
        try {
          await prisma.vote.create({
            data: {
              fishId: winningFish.id,
              ipAddress,
              createdAt: votingDay,
              votingDay,
            }
          });
        } catch (error) {
          // Skip duplicate IP addresses for the same day
          console.log(`Skipping duplicate vote for IP ${ipAddress} on ${votingDay.toDateString()}`);
        }
      }
      
      // Create a voting result for this day (all are processed since they're older than yesterday)
      await prisma.votingResult.create({
        data: {
          fishId: winningFish.id,
          teamId: winningFish.teamId,
          voteCount,
          votingDay,
          processed: true, // Mark as processed since it's an older day
          createdAt: votingDay,
        }
      });
      
      // Update the team's voting wins
      await prisma.team.update({
        where: { id: winningFish.teamId },
        data: { votingWins: { increment: 1 } }
      });
      
      console.log(`Created ${voteCount} votes for fish ID ${winningFish.id} on ${votingDay.toDateString()} (processed)`);
    }
  }
  
  console.log('Vote seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
