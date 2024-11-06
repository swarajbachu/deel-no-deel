import { NextRequest, NextResponse } from "next/server";
import { Room, GameStatus, PlayerStatus } from "@/types/game";
import { db } from "@/server/db/db";
import { rooms, players } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const roomsLocal = new Map<string, Room>();

export async function POST(req: NextRequest) {
  const { playerExternalId, } = await req.json();
  console.log(playerExternalId, "playerName");
  
  return NextResponse.json({ roomId: room.id });
}
  
export async function GET() {
  return NextResponse.json(Array.from(roomsLocal.values()));
}
