"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Game Room</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
        />
        <Button 
          onClick={createRoom}
          className="w-full"
          disabled={!playerName.trim()}
        >
          <Users className="mr-2 h-4 w-4" />
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
}; 