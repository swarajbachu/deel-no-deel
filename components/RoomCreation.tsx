'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

export default function CreateRoomForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateRoom = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create room')
      }

      const data = await response.json()
      router.push(`/room/${data.roomId}`) // Redirect to the newly created room
    } catch (err) {
      setError('An error occurred while creating the room. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a New Room</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleCreateRoom} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </Button>
        {error && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}