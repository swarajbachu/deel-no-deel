"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Room, Player, PlayerPair } from '@/types/game';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Users, Crown } from "lucide-react";

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
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Game Room</h1>
      
      {!room ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Join Game</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
            <Button 
              onClick={joinRoom}
              className="w-full"
              disabled={!playerName.trim()}
            >
              <Users className="mr-2 h-4 w-4" />
              Join Game
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Round</p>
                  <p className="text-2xl font-semibold">{room.currentRound}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-semibold">{room.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {room.currentPair && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Current Pair
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Player 1</p>
                    <p className="font-medium">{room.currentPair.player1.name}</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Player 2</p>
                    <p className="font-medium">{room.currentPair.player2.name}</p>
                  </div>
                </div>
                
                {room.currentPair.caseHolder && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleDecision(true)}
                      className="flex-1"
                      variant="default"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDecision(false)}
                      className="flex-1"
                      variant="destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
