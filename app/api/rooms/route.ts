import { NextRequest, NextResponse } from "next/server";
import { Room, GameStatus, PlayerStatus } from "@/types/game";
import { db } from "@/server/db/db";
import { rooms, players } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";

const roomsLocal = new Map<string, Room>();

export async function POST(req: NextRequest) {
  const { playerName } = await req.json();
  console.log(playerName, "playerName");
  const session = await getServerSession(authOptions);

  const [room] = await db
    .insert(rooms)
    .values({
      roomStatus: GameStatus.PENDING,
      currentRound: 0,
    })
    .returning();

  await db
    .update(players)
    .set({
      roomId: room.id,
      name: playerName,
      playerStatus: PlayerStatus.ACTIVE,
    })
    .where(eq(players.id, "playerId"));

  return NextResponse.json({ roomId: room.id });
}

export async function GET() {
  return NextResponse.json(Array.from(roomsLocal.values()));
}
