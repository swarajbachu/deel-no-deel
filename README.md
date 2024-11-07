# Deal or No Deal - Elimination Game

## Game Overview

A multiplayer elimination game where players compete in pairs with suitcases containing either SAFE or ELIMINATE cards.

### Game Flow

1. Room Creation & Joining
   - Players can create or join rooms
   - Each room requires exactly 8 players to start
   - Game starts automatically when 8 players join

2. Round Structure
   - Players are randomly paired (4 pairs per round)
   - Each pair plays the case game
   - Winners advance, losers are eliminated
   - New rounds start with remaining players
   - Final round determines the winner

3. Case Game Rules
   - One player is randomly assigned as case holder
   - Case holder declares case content (SAFE/ELIMINATE)
   - Non-holder decides to take or leave case
   - Winner is determined by:
     - If case is SAFE:
       - Take decision: Case holder wins
       - Leave decision: Non-holder wins
     - If case is ELIMINATE:
       - Take decision: Non-holder wins
       - Leave decision: Case holder wins

## Technical Architecture

- Next.js 13+ with App Router
- PostgreSQL with Drizzle ORM
- WebSocket for real-time updates
- WebRTC for peer-to-peer communication

## Setup Instructions

1. Clone repository
2. Copy environment variables: `cp .env.example .env`
3. Install dependencies: `pnpm install`
4. Run migrations: `pnpm db:migrate`
5. Start development server: `pnpm dev`

## API Routes

- `/api/rooms` - Room management
- `/api/rooms/[roomId]/join` - Join room
- `/api/rooms/[roomId]/decision` - Handle game decisions
  