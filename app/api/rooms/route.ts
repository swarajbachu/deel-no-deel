import { NextRequest, NextResponse } from "next/server";
import { Room, GameStatus, PlayerStatus } from "@/types/game";
import { db } from "@/server/db/db";
import { players, rooms } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/config";

const roomsLocal = new Map<string, Room>();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if(!session) {
    return NextResponse.error();
  }
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
      playerStatus: PlayerStatus.ACTIVE,
    })
    .where(eq(players.id, session?.user.id));
  return NextResponse.json({ roomId: room.id });
}

export async function GET() {
  return NextResponse.json(Array.from(roomsLocal.values()));
}
