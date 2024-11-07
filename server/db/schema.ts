import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm/relations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export const roomStatusEnum = pgEnum("room_status", [
  "pending",
  "ongoing",
  "ended",
]);

export const rooms = pgTable("rooms", {
  id: varchar("id")
    .$default(() => nanoid(6))
    .primaryKey(),
  roomStatus: roomStatusEnum().notNull().default("pending"),
  currentRound: integer("current_round").notNull().default(0),
  winnerId: text("winner_id"),
  entryPrice: integer("entry_price").notNull().default(0),
  humanTouch: boolean("human_touch").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roomsRelations = relations(rooms, ({ many, one }) => ({
  players: many(players),
  pairs: many(pairs),
  winner: one(players, {
    fields: [rooms.winnerId],
    references: [players.id],
  }),
}));

export const roomsSelect = createSelectSchema(rooms).extend({
  status: z.enum(["pending", "ongoing", "ended"]),
});
export const roomsInsert = createInsertSchema(rooms);

export const playersStatusEnum = pgEnum("player_status", ["active", "idle"]);

export const players = pgTable("players", {
  id: text("id").primaryKey(),
  roomId: varchar("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  playerStatus: playersStatusEnum().notNull().default("idle"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playersSelect = createSelectSchema(players);
export const playersInsert = createInsertSchema(players);

export type PlayerSelect = z.infer<typeof playersSelect>;
export type PlayerInsert = z.infer<typeof playersInsert>;

export const playersRelations = relations(players, ({ one }) => ({
  room: one(rooms, {
    fields: [players.roomId],
    references: [rooms.id],
  }),
}));

export const caseTypeEnum = pgEnum("caseType", ["SAFE", "ELIMINATE"]);
export const pairStatusEnum = pgEnum("pair_status", [
  "pending",
  "ongoing",
  "ended",
]);

export const pairs = pgTable("pairs", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: varchar("room_id").references(() => rooms.id),
  pairStatus: pairStatusEnum().notNull().default("pending"),
  player1Id: text("player1_id").references(() => players.id),
  player2Id: text("player2_id").references(() => players.id),
  caseHolderId: text("case_holder_id").references(() => players.id),
  caseType: caseTypeEnum().notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  roundId: integer("round_id").notNull().default(1),
  winnerId: text("winner_id").references(() => players.id),
});

export const pairsSelect = createSelectSchema(pairs);
export const pairsInsert = createInsertSchema(pairs);

export type PairInsert = z.infer<typeof pairsInsert>;
export type PairSelect = z.infer<typeof pairsSelect>;

export const pairsRelations = relations(pairs, ({ one }) => ({
  room: one(rooms, {
    fields: [pairs.roomId],
    references: [rooms.id],
  }),
  player1: one(players, {
    fields: [pairs.player1Id],
    references: [players.id],
  }),
  player2: one(players, {
    fields: [pairs.player2Id],
    references: [players.id],
  }),
  caseHolder: one(players, {
    fields: [pairs.caseHolderId],
    references: [players.id],
  }),
}));

export const roomWithPlayerAndPairs = roomsSelect.extend({
  players: z.array(playersSelect),
  pairs: z.array(pairsSelect),
});

export type RoomWithPlayerAndPairs = z.infer<typeof roomWithPlayerAndPairs>;

export const pairsWithPlayerAndCaseHolder = pairsSelect.extend({
  player1: playersSelect.optional(),
  player2: playersSelect.optional(),
  caseHolder: playersSelect.optional(),
});

export type PairsWithPlayerAndCaseHolder = z.infer<
  typeof pairsWithPlayerAndCaseHolder
>;
