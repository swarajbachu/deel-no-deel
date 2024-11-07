import { PairSelect, PairsWithPlayerAndCaseHolder } from "@/server/db/schema";



export enum GameStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export enum PlayerStatus {
  ACTIVE = 'active',
  IDLE = 'idle'
}

export enum CaseType {
  SAFE = 'SAFE',
  ELIMINATE = 'ELIMINATE'
} 