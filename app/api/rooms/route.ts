import { NextRequest, NextResponse } from "next/server";
import { Room, GameStatus, PlayerStatus } from "@/types/game";
import { db } from "@/server/db/db";
import { rooms, players } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const roomsLocal = new Map<string, Room>();

export async function POST(req: NextRequest) {
  const { playerName } = await req.json();
  console.log(playerName, "playerName");

  // const [room] = await db
  //   .insert(rooms)
  //   .values({
  //     status: GameStatus.WAITING,
  //     currentRound: 0,
  //   })
  //   .returning();

  // await db.insert(players).values({
  //   roomId: room.id,
  //   name: playerName,
  //   status: PlayerStatus.ACTIVE,
  // });

  return NextResponse.json({ roomId: 'room.id' });
}

export async function GET() {
  return NextResponse.json(Array.from(roomsLocal.values()));
}
