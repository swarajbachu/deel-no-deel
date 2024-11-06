import { db } from "@/server/db/db";
import { players, rooms } from "@/server/db/schema";
import { PlayerStatus } from "@/types/game";
import { startGame } from "@/utils/gameLogic";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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

  if (room.players.length >= 8) {
    return NextResponse.json({ error: "Room is full" }, { status: 400 });
  }

  await db.insert(players).values({
    roomId: room.id,
    name: playerName,
    status: PlayerStatus.ACTIVE,
  });

  if (room.players.length === 8) {
    startGame(room.id);
  }

  return NextResponse.json(room);
}
