import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/db";
import { rooms, pairs, players } from "@/server/db/schema";
import { processPairResult } from "@/utils/gameLogic";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { decision } = await req.json();

  // Fetch current room state
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, params.roomId),
    with: {
      players: true,
      pairs: true,
    },
  });

  if (!room || !room.pairs) {
    return NextResponse.json({ error: "Invalid room state" }, { status: 400 });
  }

  // Process the decision
  processPairResult(room.pairs[0].id, decision);

  // Update the database with the results
  // ... implement the database updates

  return NextResponse.json(room);
}
