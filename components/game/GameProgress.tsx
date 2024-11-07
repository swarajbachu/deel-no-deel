import { PairsWithPlayerAndCaseHolder } from "@/server/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Trophy } from "lucide-react"

interface GameProgressProps {
  currentRound: number
  totalRounds: number
  pairs: PairsWithPlayerAndCaseHolder[]
}

export default function GameProgress({ currentRound, totalRounds, pairs }: GameProgressProps) {
  // Group pairs by round
  const pairsByRound = pairs.reduce((acc, pair) => {
    const round = pair.roundId
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(pair)
    return acc
  }, {} as Record<number, PairsWithPlayerAndCaseHolder[]>)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Progress - Round {currentRound}/{totalRounds}</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(pairsByRound).map(([round, roundPairs]) => (
            <div key={round} className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Round {round}</h3>
              <div className="space-y-4">
                {roundPairs.map((pair) => (
                  <div 
                    key={pair.id} 
                    className={`p-4 rounded-lg border ${
                      pair.pairStatus === 'ongoing' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{pair.player1?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>vs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{pair.player2?.name}</span>
                        <User className="w-4 h-4" />
                      </div>
                      {pair.winnerId && (
                        <div className="ml-4 flex items-center gap-1 text-yellow-600">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm">
                            {pair.winnerId === pair.player1?.id 
                              ? pair.player1?.name 
                              : pair.player2?.name}
                          </span>
                        </div>
                      )}
                    </div>
                    {pair.pairStatus === 'ongoing' && (
                      <div className="mt-2 text-sm text-blue-600">
                        Currently Playing
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}