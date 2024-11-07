import { db } from "@/server/db/db";
import { players, rooms } from "@/server/db/schema";
import { PlayerStatus } from "@/types/game";
import { startGame } from "@/utils/gameLogic";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/config/gameConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { playerId, playerName } = await req.json();
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, params.roomId),
    with: {
      players: true,
      pairs: true,
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.players.length >= GAME_CONFIG.PLAYERS_PER_ROOM) {
    return NextResponse.json({ error: "Room is full" }, { status: 400 });
  }

  await db
    .update(players)
    .set({
      roomId: room.id,
      name: playerName,
      playerStatus: PlayerStatus.ACTIVE,
    })
    .where(eq(players.id, playerId));

  if (room.players.length === GAME_CONFIG.PLAYERS_PER_ROOM - 1) {
    await startGame(room.id);
  }

  return NextResponse.json(room);
}
