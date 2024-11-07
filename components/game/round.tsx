'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CaseType } from '@/types/game'
import { PlayerSelect } from '@/server/db/schema'

const TIMER_DURATION = 30

interface DealOrNoDealProps {
  onDecision: (decision: boolean) => void
  caseHolder?: PlayerSelect
  caseType?: CaseType
}

export default function DealOrNoDeal({ onDecision, caseHolder, caseType }: DealOrNoDealProps) {
  const [selectedCase, setSelectedCase] = useState<number>(Math.floor(Math.random() * 2) + 1)
  const [isCaseOpened, setIsCaseOpened] = useState(false)
  const [isSafe, setIsSafe] = useState(Math.random() < 0.5)
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [gameState, setGameState] = useState<'waiting' | 'opened' | 'decided'>('waiting')

  useEffect(() => {
    if (timeLeft > 0 && gameState === 'waiting') {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [timeLeft, gameState])

  const handleOpenCase = () => {
    setIsCaseOpened(true)
    setGameState('opened')
  }

  const handleKeepCase = () => {
    setGameState('decided')
    onDecision(true)
  }

  const handleGiveCase = () => {
    setGameState('decided')
    onDecision(false)
  }

  const handleTakeCase = () => {
    setGameState('decided')
  }

  const handleLeaveCase = () => {
    setGameState('decided')
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 flex flex-col justify-between">
      {/* Timer */}
      <div className="w-full max-w-md mx-auto mb-4">
        <Progress value={(timeLeft / TIMER_DURATION) * 100} className="w-full" />
        <p className="text-center mt-2">{timeLeft} seconds left</p>
      </div>

      {/* User 1 Avatar */}
      <div className="flex justify-center mb-4">
        <motion.div
          className={`bg-blue-500 rounded-full p-2 ${selectedCase === 1 ? 'ring-2 ring-yellow-400' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Game Area */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-80 h-64 perspective-1000">
          {/* Table */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-brown-600 rounded-b-lg transform rotateX-10 skew-x-12"></div>
          
          {/* Suitcase */}
          <motion.div
            className="w-full h-full"
            initial={false}
            animate={{ rotateY: -20, rotateX: isCaseOpened ? 15 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Suitcase body */}
            <motion.div
              className="absolute inset-0 bg-yellow-700 rounded-lg shadow-xl"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-20px)' }}
            >
              {/* Suitcase front */}
              <div className="absolute inset-2 bg-yellow-600 rounded border-4 border-yellow-800"></div>
              
              {/* Suitcase side */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-yellow-800 transform -skew-y-45 origin-top-right"></div>
              
              {/* Suitcase handle */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-8">
                <div className="w-full h-full bg-yellow-900 rounded-full transform rotateX-60"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-4 bg-yellow-800 rounded-full"></div>
              </div>
              
              {/* Suitcase lid */}
              <motion.div
                className="absolute inset-0 bg-yellow-700 rounded-lg origin-bottom"
                initial={false}
                animate={{ rotateX: isCaseOpened ? -100 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d', transformOrigin: 'bottom' }}
              >
                <div className="absolute inset-2 bg-yellow-600 rounded border-4 border-yellow-800"></div>
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-yellow-800 transform -skew-y-45 origin-top-right"></div>
              </motion.div>
              
              {/* Sign board inside the suitcase */}
              <motion.div
                className="absolute inset-4 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isCaseOpened ? 1 : 0 }}
                transition={{ delay: 0.3 }}
                style={{ transform: 'translateZ(10px) rotateX(-15deg)' }}
              >
                <div className={`p-4 ${isSafe ? 'bg-green-500' : 'bg-red-500'} rounded-lg shadow-inner`}>
                  <p className="text-3xl font-bold text-white">{isSafe ? 'SAFE' : 'UNSAFE'}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Clickable area */}
          {!isCaseOpened && (
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={handleOpenCase}
            ></div>
          )}
        </div>

        {gameState === 'opened' && selectedCase === 1 && (
          <div className="mt-4 space-x-4">
            <Button onClick={handleKeepCase}>Keep</Button>
            <Button onClick={handleGiveCase}>Give</Button>
          </div>
        )}

        {gameState === 'opened' && selectedCase === 2 && (
          <div className="mt-4 space-x-4">
            <Button onClick={handleTakeCase}>Take</Button>
            <Button onClick={handleLeaveCase}>Leave</Button>
          </div>
        )}

        {gameState === 'decided' && (
          <p className="mt-4 text-xl font-bold">Game Over!</p>
        )}
      </div>

      {/* User 2 Avatar */}
      <div className="flex justify-center mt-4">
        <motion.div
          className={`bg-purple-500 rounded-full p-2 ${selectedCase === 2 ? 'ring-2 ring-yellow-400' : ''}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
      </div>
    </div>
  )
}