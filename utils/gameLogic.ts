import { db } from "@/server/db/db";
import { PairInsert, pairs, players, rooms } from "@/server/db/schema";
import { CaseType, GameStatus, PlayerStatus } from "@/types/game";
import { eq, sql } from "drizzle-orm";
import { GAME_CONFIG } from "@/config/gameConfig";

export async function startGame(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room) throw new Error("Room not found");

  // Validate player count matches config
  if (room.players.length !== GAME_CONFIG.PLAYERS_PER_ROOM) {
    throw new Error("Invalid player count");
  }

  await db
    .update(rooms)
    .set({
      roomStatus: GameStatus.ONGOING,
      currentRound: 1,
    })
    .where(eq(rooms.id, roomId));

  const shuffledPlayers = shuffleArray([...room.players]);
  const pairsToInsert: PairInsert[] = [];
  const pairsPerRound = GAME_CONFIG.PLAYERS_PER_ROOM / 2;

  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    pairsToInsert.push({
      roomId: room.id,
      player1Id: shuffledPlayers[i].id,
      player2Id: shuffledPlayers[i + 1].id,
      completed: false,
      roundId: 1,
      caseType: Math.random() < 0.5 ? CaseType.SAFE : CaseType.ELIMINATE,
      pairStatus: i === 0 ? "ongoing" : "pending",
    });
  }

  const pairsPushed = await db.insert(pairs).values(pairsToInsert).returning();
  
  const firstPair = pairsPushed[0];
  if (!firstPair.id) throw new Error("No pairs found");
  await assignCase(firstPair.id);
}
export async function assignCase(pairId: string) {
  const pair = await db.query.pairs.findFirst({
    where: eq(pairs.id, pairId),
    with: {
      player1: true,
      player2: true,
    },
  });

  if (!pair) throw new Error("Pair not found");
  if (!pair.player1 || !pair.player2) throw new Error("Invalid pair state");

  const caseHolder = Math.random() < 0.5 ? pair.player1.id : pair.player2.id;
  const caseType = Math.random() < 0.5 ? CaseType.SAFE : CaseType.ELIMINATE;

  const finalPair = await db
    .update(pairs)
    .set({
      caseHolderId: caseHolder,
      caseType: caseType,
    })
    .where(eq(pairs.id, pairId));

  console.log("finalPair", finalPair);
}

export async function processPairResult(pairId: string, decision: boolean) {
  const pair = await db.query.pairs.findFirst({
    where: eq(pairs.id, pairId),
    with: {
      player1: true,
      player2: true,
      caseHolder: true,
    },
  });

  if (!pair || !pair.caseHolder) throw new Error("Invalid pair state");
  if (!pair.player1 || !pair.player2) throw new Error("Invalid pair state");

  const nonCaseHolder =
    pair.player1.id === pair.caseHolder.id ? pair.player2 : pair.player1;

  // Determine winner based on case type and decision
  let winnerId: string;
  
  if (pair.caseType === CaseType.SAFE) {
    // For SAFE case:
    // If non-holder takes the case (decision=true) and it's safe, non-holder wins
    // If non-holder leaves the case (decision=false) and it's safe, case-holder wins
    winnerId = decision ? nonCaseHolder.id : pair.caseHolder.id;
  } else {
    // For ELIMINATE case:
    // If non-holder takes the case (decision=true) and it's eliminate, case-holder wins
    // If non-holder leaves the case (decision=false) and it's eliminate, non-holder wins
    winnerId = decision ? pair.caseHolder.id : nonCaseHolder.id;
  }

  // Update eliminated player status
  const eliminatedId = winnerId === pair.player1.id ? pair.player2.id : pair.player1.id;
  await db
    .update(players)
    .set({ playerStatus: PlayerStatus.IDLE })
    .where(eq(players.id, eliminatedId));

  // Update winner status
  await db
    .update(players)
    .set({ playerStatus: PlayerStatus.ACTIVE })
    .where(eq(players.id, winnerId));

  // Mark pair as completed
  await db
    .update(pairs)
    .set({
      completed: true,
      winnerId: winnerId,
      pairStatus: "ended",
    })
    .where(eq(pairs.id, pairId));

  // Check if round is complete
  if (!pair.roomId) throw new Error("Invalid pair state");
  await checkAndStartNextRound(pair.roomId);
}

async function checkAndStartNextRound(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      pairs: true,
      players: true,
    },
  });

  if (!room) return;

  const currentRoundPairs = room.pairs.filter(p => p.roundId === room.currentRound);
  const uncompletedPairs = currentRoundPairs.filter(p => !p.completed);

  if (uncompletedPairs.length === 0) {
    // All pairs in current round are complete
    const winners = currentRoundPairs
      .filter(p => p.completed && p.winnerId)
      .map(p => p.winnerId);

    if (winners.length >= 2) {
      // Start next round
      const nextRound = room.currentRound + 1;
      const totalRounds = GAME_CONFIG.ROUNDS_MAP[GAME_CONFIG.PLAYERS_PER_ROOM];

      if (nextRound <= totalRounds) {
        await startNextRound(roomId, winners as string[]);
      }
    } else if (winners.length === 1) {
      // Game is complete, we have a winner
      const winnerId = winners[0];
      if (!winnerId) throw new Error("Invalid winner state");

      await db
        .update(rooms)
        .set({ 
          roomStatus: GameStatus.ENDED,
          winnerId: winnerId,
        })
        .where(eq(rooms.id, roomId));

      // Update all players to idle
      await db
        .update(players)
        .set({ playerStatus: PlayerStatus.IDLE })
        .where(eq(players.roomId, roomId));
    }
  } else {
    // Start the next pending pair if any
    const nextPendingPair = currentRoundPairs.find(p => p.pairStatus === "pending");
    if (nextPendingPair) {
      await db
        .update(pairs)
        .set({ pairStatus: "ongoing" })
        .where(eq(pairs.id, nextPendingPair.id));
      
      await assignCase(nextPendingPair.id);
    }
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// export async function joinRoom(roomId: string, playerId: string) {
//   console.log(roomId, playerId, "roomId, playerId");
//   const room = await db.query.rooms.findFirst({
//     where: eq(rooms.id, roomId),
//     with: {
//       players: true,
//     },
//   });
//   console.log(room, "room generated");

//   if (!room) {
//     return { error: "Room not found" };
//   }

//   if (room.players.length >= 8) {
//     return { error: "Room is full" };
//   }

//   await db
//     .update(players)
//     .set({
//       roomId: room.id,
//       playerStatus: PlayerStatus.ACTIVE,
//     })
//     .where(eq(players.id, playerId));
//   if (room.players.length === 8) {
//     startGame(room.id);
//   }

//   return room;
// }

async function startNextRound(roomId: string, winners: string[]) {
  // Increment the round number
  await db
    .update(rooms)
    .set({
      currentRound: sql`${rooms.currentRound} + 1`,
    })
    .where(eq(rooms.id, roomId));

  // Create new pairs from winners
  const shuffledWinners = shuffleArray([...winners]);
  const pairsToInsert: PairInsert[] = [];

  for (let i = 0; i < shuffledWinners.length; i += 2) {
    // If we have an odd number of winners, the last player automatically advances
    if (i + 1 >= shuffledWinners.length) break;

    pairsToInsert.push({
      roomId: roomId,
      player1Id: shuffledWinners[i],
      player2Id: shuffledWinners[i + 1],
      completed: false,
      caseType: CaseType.SAFE, // Will be randomly assigned later
      pairStatus: i === 0 ? "ongoing" : "pending",
    });
  }

  // If we have pairs to create
  if (pairsToInsert.length > 0) {
    const pairsPushed = await db.insert(pairs).values(pairsToInsert).returning();
    
    // Assign case for the first pair
    const firstPair = pairsPushed[0];
    if (!firstPair.id) throw new Error("No pairs created");
    await assignCase(firstPair.id);
  } else {
    // If we have only one winner, end the game
    await db
      .update(rooms)
      .set({ roomStatus: GameStatus.ENDED })
      .where(eq(rooms.id, roomId));
  }
}
