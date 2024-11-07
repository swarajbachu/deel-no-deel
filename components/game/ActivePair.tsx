import { useState, useEffect } from "react";
import DealOrNoDeal from "./round";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { PairSelect, PairsWithPlayerAndCaseHolder } from "@/server/db/schema";
import { CaseType } from "@/types/game";

interface ActivePairProps {
  pair: PairsWithPlayerAndCaseHolder;
  onDecision: (decision: boolean) => void;
}

export default function ActivePair({ pair, onDecision }: ActivePairProps) {
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleGameDecision = (decision: boolean) => {
    setGameCompleted(true);
    onDecision(decision);
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
              onDecision={handleGameDecision}
              caseHolder={pair.caseHolder}
              caseType={pair.caseType as CaseType}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
