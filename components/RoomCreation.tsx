"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const RoomCreation = () => {
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const createRoom = async () => {
    if (!playerName.trim()) return;
    
    const playerId = crypto.randomUUID();
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, playerName })
    });
    
    const { roomId } = await response.json();
    router.push(`/rooms/${roomId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
        className="p-2 border rounded"
      />
      <button 
        onClick={createRoom}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Room
      </button>
    </div>
  );
}; 