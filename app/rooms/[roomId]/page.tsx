"use client";

import { notFound, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Users, Crown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoom, joinRoom } from "@/server/actions/round";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import ActivePair from "@/components/game/ActivePair";
import { GAME_CONFIG } from "@/config/gameConfig";

export default function RoomPage() {
  const params = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const { data: room, isPending } = useQuery({
    queryKey: ["room", params.roomId],
    queryFn: () => getRoom({ roomId: params.roomId as string }),
  });

  const { mutateAsync: joinRoomMutation, isPending: joiningRoom } = useMutation(
    {
      mutationFn: ({
        roomId,
        playerId,
      }: {
        roomId: string;
        playerId: string;
      }) => joinRoom(roomId, playerId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["room", params.roomId] });
      },
      onError: (error) => {
        console.log(error, "error");
      },
    }
  );

  const handleDecision = async (decision: boolean) => {
    const currentPair = room?.pairs.find((p) => p.pairStatus === "ongoing");
    if (!currentPair) return;
    const response = await fetch(`/api/rooms/${params.roomId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const updatedRoom = await response.json();
  };
  console.log(session.data?.user, "session.data.user");

  if (!session.data?.user.id) {
    return <div>Please login to join the game</div>;
  }
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!room) return notFound();

  const player = room.players.find((p) => p.id === session.data?.user.id);

  if (player?.roomId !== room.id) {
    if (room.players.length === GAME_CONFIG.PLAYERS_PER_ROOM) {
      return <div>Room is full</div>;
    }
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Game</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={async () =>
              await joinRoomMutation({
                roomId: params.roomId as string,
                playerId: session.data.user.id,
              })
            }
            disabled={joiningRoom}
            className="w-full"
          >
            <Users className="mr-2 h-4 w-4" />
            Join Game
          </Button>
        </CardContent>
      </Card>
    );
  }

  const activePair = room.pairs.find((p) => p.pairStatus === "ongoing");

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Game Room</h1>

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
                <Badge>{room.roomStatus}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {room.roomStatus === "ongoing" &&
          activePair?.player1 &&
          activePair?.player2 && (
            <ActivePair
              pair={{
                ...activePair,
                player1: activePair.player1 || undefined,
                player2: activePair.player2 || undefined,
                caseHolder: activePair.caseHolder || undefined,
              }}
              onDecision={async (decision) => {
                await handleDecision(decision);
                queryClient.invalidateQueries({
                  queryKey: ["room", params.roomId],
                });
              }}
            />
          )}
      </div>
    </div>
  );
}
