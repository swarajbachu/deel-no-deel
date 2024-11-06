import { db } from "@/server/db/db";
import { PairInsert, pairs, players, rooms } from "@/server/db/schema";
import {
  CaseType,
  GameStatus,
  PlayerPair,
  PlayerStatus,
  Room,
} from "@/types/game";
import { eq } from "drizzle-orm";

export async function startGame(roomId: string) {
  // Get room with players
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room) throw new Error("Room not found");

  // Update room status
  await db
    .update(rooms)
    .set({
      status: GameStatus.IN_PROGRESS,
      currentRound: 1,
    })
    .where(eq(rooms.id, roomId));

  // Create pairs for round 1
  const shuffledPlayers = shuffleArray([...room.players]);
  const pairsToInsert: PairInsert[] = [];

  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    pairsToInsert.push({
      roomId: room.id,
      player1Id: shuffledPlayers[i].id,
      player2Id: shuffledPlayers[i + 1].id,
      completed: false,
      round: 1,
    });
  }

  // Insert all pairs
  await db.insert(pairs).values(pairsToInsert);

  // Get first pair and set it as current
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
    .set({ status: PlayerStatus.ELIMINATED })
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
