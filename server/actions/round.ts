"use server";

import { db } from "@/server/db/db";
import { pairs, players, rooms } from "@/server/db/schema";
import { PlayerStatus } from "@/types/game";
import { startGame } from "@/utils/gameLogic";
import { eq } from "drizzle-orm";
import { GAME_CONFIG } from "@/config/gameConfig";

export async function getRoom({ roomId }: { roomId: string }) {
  console.log(roomId, "roomId");
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      winner: true,
      players: true,
      pairs: {
        with: {
          caseHolder: true,
          player1: true,
          player2: true,
        },
      },
    },
  });
  console.log(room, "room");
  return room;
}

export async function joinRoom(roomId: string, playerId: string) {
  console.log(roomId, playerId, "roomId, playerId");
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });
  console.log(room, "room generated");

  if (!room) {
    return { error: "Room not found" };
  }

  if (room.players.length >= GAME_CONFIG.PLAYERS_PER_ROOM) {
    return { error: "Room is full" };
  }

  await db
    .update(players)
    .set({
      roomId: room.id,
      playerStatus: PlayerStatus.ACTIVE,
    })
    .where(eq(players.id, playerId));

  if (room.players.length === GAME_CONFIG.PLAYERS_PER_ROOM - 1) {
    startGame(room.id);
  }

  return room;
}
