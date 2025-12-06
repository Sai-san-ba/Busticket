"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"

export function QuickTrack() {
  const [bookingId, setBookingId] = useState("")

  const handleQuickTrack = () => {
    if (bookingId.trim()) {
      window.location.href = `/track-bus?booking=${bookingId}`
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Quick Track</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && handleQuickTrack()}
              />
              <Button onClick={handleQuickTrack} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
