"use client";

import { notFound, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoom, joinRoom } from "@/server/actions/round";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase-client";
import ActivePair from "@/components/game/ActivePair";
import { GAME_CONFIG } from "@/config/gameConfig";
import GameProgress from "@/components/game/GameProgress";
import { PairsWithPlayerAndCaseHolder } from "@/server/db/schema";
import { useSupabaseSubscription } from "@/hooks/useSupabaseSubscription";

export default function RoomPage() {
  const params = useParams();
  const session = useSession();
  const queryClient = useQueryClient();
  const { data: room, isPending } = useQuery({
    queryKey: ["room", params.roomId],
    queryFn: () => getRoom({ roomId: params.roomId as string }),
    refetchInterval: 3000,
  });
  const [dailyRoomUrl, setDailyRoomUrl] = useState<string | null>(null);

  useSupabaseSubscription({
    roomId: params.roomId as string,
    table: "rooms",
  });
  useSupabaseSubscription({
    roomId: params.roomId as string,
    table: "pairs",
  });
  useSupabaseSubscription({
    roomId: params.roomId as string,
    table: "players",
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
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ["room", params.roomId] });

        // Snapshot the previous value
        const previousRoom = queryClient.getQueryData(["room", params.roomId]);

        // Optimistically update room
        queryClient.setQueryData(["room", params.roomId], (old: any) => ({
          ...old,
          players: [
            ...old.players,
            {
              id: variables.playerId,
              roomId: variables.roomId,
              name: session.data?.user.name,
              playerStatus: "active",
            },
          ],
        }));

        return { previousRoom };
      },
      onError: (err, variables, context) => {
        // Revert the optimistic update
        if (context?.previousRoom) {
          queryClient.setQueryData(
            ["room", params.roomId],
            context.previousRoom
          );
        }
      },
      onSettled: () => {
        // Refetch to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["room", params.roomId] });
      },
    }
  );

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
                <p className="text-2xl font-semibold">
                  {room.currentRound}/
                  {GAME_CONFIG.ROUNDS_MAP[GAME_CONFIG.PLAYERS_PER_ROOM]}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Players</p>
                <p className="text-2xl font-semibold">
                  {room.players.length}/{GAME_CONFIG.PLAYERS_PER_ROOM}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{room.roomStatus}</Badge>
              </div>
            </div>
            {room.roomStatus === "ended" && room.winner && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">Winner</p>
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <p className="text-xl font-semibold">{room.winner.name}</p>
                </div>
              </div>
            )}
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
            />
          )}

        {room.roomStatus === "ongoing" && (
          <GameProgress
            currentRound={room.currentRound}
            totalRounds={GAME_CONFIG.ROUNDS_MAP[GAME_CONFIG.PLAYERS_PER_ROOM]}
            pairs={room.pairs as PairsWithPlayerAndCaseHolder[]}
            isLoading={isPending}
          />
        )}
      </div>
    </div>
  );
}
