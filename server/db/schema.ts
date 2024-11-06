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
export const roomStatusEnum = pgEnum("status", ["pending", "ongoing", "ended"]);
export const rooms = pgTable("rooms", {
  id: varchar('id')
  .$default(() => nanoid(6))
  .primaryKey(),
  status: roomStatusEnum("status").notNull().default("pending"),
  entryPrice: integer("entry_price").notNull().default(0),
  humanTouch: boolean("human_touch").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  players: many(players),
  pairs: many(pairs),
}));

export const roomsSelect = createSelectSchema(rooms);
export const roomsInsert = createInsertSchema(rooms);



export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: varchar("room_id").references(() => rooms.id),
  name: text("name").notNull(),
  status: text("status").notNull(),
  externalId: text("external_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playersSelect = createSelectSchema(players);
export const playersInsert = createInsertSchema(players);

export const playersRelations = relations(players, ({ one }) => ({
  room: one(rooms, {
    fields: [players.roomId],
    references: [rooms.id],
  }),
}));

export const pairs = pgTable("pairs", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: varchar("room_id").references(() => rooms.id),
  player1Id: uuid("player1_id").references(() => players.id),
  player2Id: uuid("player2_id").references(() => players.id),
  caseHolderId: uuid("case_holder_id").references(() => players.id),
  caseType: text("case_type"),
  completed: boolean("completed").default(false),
  round: integer("round").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  pairs: z.array(pairsSelect) ,
});

export type RoomWithPlayerAndPairs = z.infer<typeof roomWithPlayerAndPairs>;
