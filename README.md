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
   - Each pair plays the suitcase game
   - Winners advance, losers are eliminated
   - New rounds start with remaining players
   - Final round determines the winner

3. Suitcase Game Rules
   - One player holds a suitcase (randomly assigned)
   - Suitcase contains either SAFE or ELIMINATE card
   - Non-holder decides to take or leave the case
   - Elimination depends on case type and decision:
     * SAFE case + Take decision = Holder continues
     * SAFE case + Leave decision = Non-holder continues
     * ELIMINATE case + Take decision = Holder continues
     * ELIMINATE case + Leave decision = Non-holder continues

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