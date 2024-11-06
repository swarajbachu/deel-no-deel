"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Room, Player, PlayerPair } from '@/types/game';

export default function RoomPage() {
  const params = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [playerName, setPlayerName] = useState('');

  const joinRoom = async () => {
    const playerId = Math.random().toString(36).substring(7);
    const response = await fetch(`/api/rooms/${params.roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, playerName })
    });
    const updatedRoom = await response.json();
    setRoom(updatedRoom);
  };

  const handleDecision = async (decision: boolean) => {
    if (!room?.currentPair) return;
    
    const response = await fetch(`/api/rooms/${params.roomId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision })
    });
    const updatedRoom = await response.json();
    setRoom(updatedRoom);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Game Room</h1>
      
      {!room ? (
        <div className="join-form">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="border p-2 mr-2"
          />
          <button 
            onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join Game
          </button>
        </div>
      ) : (
        <div className="game-state">
          <div>Round: {room.currentRound}</div>
          <div>Status: {room.status}</div>
          
          {room.currentPair && (
            <div className="current-pair mt-4">
              <h2>Current Pair</h2>
              <div>Player 1: {room.currentPair.player1.name}</div>
              <div>Player 2: {room.currentPair.player2.name}</div>
              
              {room.currentPair.caseHolder && (
                <div className="mt-4">
                  <button
                    onClick={() => handleDecision(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
