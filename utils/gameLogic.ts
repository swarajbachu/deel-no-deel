import { db } from "@/server/db/db";
import { PairInsert, pairs, players, rooms } from "@/server/db/schema";
import { CaseType, GameStatus, PlayerStatus } from "@/types/game";
import { eq } from "drizzle-orm";
import { GAME_CONFIG } from "@/config/gameConfig";

export async function startGame(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room) throw new Error("Room not found");

  await db
    .update(rooms)
    .set({
      roomStatus: GameStatus.ONGOING,
      currentRound: 1,
    })
    .where(eq(rooms.id, roomId));

  const shuffledPlayers = shuffleArray([...room.players]);
  const pairsToInsert: PairInsert[] = [];

  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    pairsToInsert.push({
      roomId: room.id,
      player1Id: shuffledPlayers[i].id,
      player2Id: shuffledPlayers[i + 1].id,
      completed: false,
      caseType: CaseType.SAFE,
      pairStatus: i === 0 ? "ongoing" : "pending",
    });
  }

  await db.insert(pairs).values(pairsToInsert);

  const firstPair = pairsToInsert[0];
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

  await db
    .update(pairs)
    .set({
      caseHolderId: caseHolder,
      caseType: caseType,
    })
    .where(eq(pairs.id, pairId));
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

  const eliminatedPlayerId =
    pair.caseType === CaseType.SAFE
      ? decision
        ? nonCaseHolder.id
        : pair.caseHolder.id
      : decision
      ? nonCaseHolder.id
      : pair.caseHolder.id;

  // Update player status
  await db
    .update(players)
    .set({ playerStatus: PlayerStatus.IDLE })
    .where(eq(players.id, eliminatedPlayerId));

  // Mark pair as completed
  await db.update(pairs).set({ completed: true }).where(eq(pairs.id, pairId));
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
