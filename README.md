# Deal or No Deal: World ID Edition

A multiplayer elimination game where players compete in pairs with suitcases containing either SAFE or ELIMINATE cards. Verify your humanity, compete for crypto rewards, and become the ultimate champion!

## Why Play With Us?

### Unique Features
- **Sybil-Resistant Gaming**: World ID verification ensures each player is unique and human, preventing multi-accounting and maintaining fair play
- **Crypto Rewards**: Win and withdraw your crypto prizes instantly - no delays, no complications
- **Mini App Experience**: Quick to load, easy to play with our optimized mini app architecture
- **Flexible Lobbies**: Create or join rooms with 2, 4, or 8 players - more players mean more rounds and bigger prizes!
- **Secure & Transparent**: Every game action is verified and secured through World ID's proof of personhood protocol
- **Fair Competition**: Everyone plays on equal terms - no bots, no duplicate accounts, just pure strategy and skill

## Game Flow

### 1. Room Creation & Joining
- Players can create or join rooms
- Flexible room sizes: 2, 4, or 8 players
- Game starts automatically when room is full

### 2. Round Structure
- Players are randomly paired (up to 4 pairs per round)
- Each pair plays the case game
- Winners advance, losers are eliminated
- New rounds start with remaining players
- Final round determines the champion

### 3. Case Game Rules
- One player is randomly assigned as case holder
- Case holder declares case content (SAFE/ELIMINATE)
- Non-holder decides to take or leave case

## Win Conditions

### SAFE Case Scenarios:
- Take Decision: Case holder wins
- Leave Decision: Non-holder wins

### ELIMINATE Case Scenarios:
- Take Decision: Non-holder wins
- Leave Decision: Case holder wins

## How to Play

1. **Join a Room**
   - Enter a game room with your preferred player count
   - Verify your humanity through World ID
   - Wait for room to fill up

2. **Face Your Opponent**
   - Get paired randomly with another player
   - Engage in an intense case showdown
   - Use strategy and psychology to outmaneuver your opponent

3. **Survive & Advance**
   - Win your duel to advance to the next round
   - Lose and you're eliminated
   - Last player standing wins the crypto prize pool

## Setup Instructions

1. Clone repository
2. Copy environment variables: `cp .env.example .env`
3. Install dependencies: `pnpm install`
4. Run migrations: `pnpm db:migrate`
5. Start development server: `pnpm dev`
