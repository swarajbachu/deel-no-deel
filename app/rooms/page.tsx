"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Room, Player, PlayerPair } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Game Room</CardTitle>
        </CardHeader>
        <CardContent>
          {!room ? (
            <div className="flex gap-4">
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
              <Button onClick={joinRoom}>
                Join Game
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <Badge variant="secondary">Round: {room.currentRound}</Badge>
                <Badge variant="outline">Status: {room.status}</Badge>
              </div>
              
              {room.currentPair && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Pair</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Player 1</Badge>
                        <span>{room.currentPair.player1.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Player 2</Badge>
                        <span>{room.currentPair.player2.name}</span>
                      </div>
                    </div>
                    
                    {room.currentPair.caseHolder && (
                      <div className="flex gap-4">
                        <Button 
                          onClick={() => handleDecision(true)}
                          variant="default"
                          className="w-full"
                        >
                          Accept
                        </Button>
                        <Button 
                          onClick={() => handleDecision(false)}
                          variant="destructive"
                          className="w-full"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
