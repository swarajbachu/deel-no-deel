import { useState, useEffect } from "react";
import DealOrNoDeal from "./round";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { PairSelect, PairsWithPlayerAndCaseHolder } from "@/server/db/schema";
import { CaseType } from "@/types/game";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { makeDecision } from "@/server/actions/round";

interface ActivePairProps {
  pair: PairsWithPlayerAndCaseHolder;
}

export default function ActivePair({ pair }: ActivePairProps) {
  const [gameCompleted, setGameCompleted] = useState(false);

  const session = useSession();
  const queryClient = useQueryClient();

  const isActivePlayer =
    pair.player1?.id === session.data?.user?.id ||
    pair.player2?.id === session.data?.user?.id;

  const handleDecision = async (decision: boolean) => {
    await makeDecision(pair.id, decision);
    queryClient.invalidateQueries({ queryKey: ["room", pair.roomId] });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Pair</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6" />
              <span>{pair.player1?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{pair.player2?.name}</span>
              <User className="w-6 h-6" />
            </div>
          </div>

          {!gameCompleted && (
            <DealOrNoDeal
              caseHolder={pair.caseHolder}
              caseType={pair.caseType as CaseType}
              activePlayer={isActivePlayer}
              onDecision={handleDecision}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
