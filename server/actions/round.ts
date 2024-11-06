"use server";

import { db } from "@/server/db/db";
import { pairs, rooms } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getRoom({ roomId }: { roomId: string }) {
  console.log(roomId, "roomId");
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
      pairs: true,
    },
  });
  console.log(room, "room");
  return room;
}
