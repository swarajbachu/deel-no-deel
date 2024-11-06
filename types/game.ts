export interface Room {
  id: string;
  players: Player[];
  currentRound: number;
  status: GameStatus;
  currentPair?: PlayerPair;
  pairs: PlayerPair[];
}

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
}

export interface PlayerPair {
  player1: Player;
  player2: Player;
  caseHolder?: Player;
  caseType?: CaseType;
  decision?: boolean;
  completed: boolean;
}

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