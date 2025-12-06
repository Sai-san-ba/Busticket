"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BookingDetailsProps {
  bus: any
  selectedSeats: string[]
  onContinue?: () => void
}

// Format date to a readable format
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (error) {
    return dateString
  }
}

export function BookingDetails({ bus, selectedSeats, onContinue }: BookingDetailsProps) {
  const totalAmount = selectedSeats.length * bus.price
  const taxes = Math.round(totalAmount * 0.05) // 5% tax
  const finalAmount = totalAmount + taxes

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trip Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Route</span>
            <span className="font-medium">{bus.route}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(bus.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">
              {bus.departureTime} - {bus.arrivalTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bus</span>
            <span className="font-medium">{bus.operator}</span>
          </div>
        </div>

        <Separator />

        {/* Selected Seats */}
        <div className="space-y-2">
          <h4 className="font-medium">Selected Seats</h4>
          {selectedSeats.length > 0 ? (
            <div className="space-y-1">
              {selectedSeats.map((seatId) => (
                <div key={seatId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seat {seatId}</span>
                  <span className="font-medium">Rs {bus.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No seats selected</p>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <>
            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Base Fare ({selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""})
                </span>
                <span className="font-medium">Rs {totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="font-medium">Rs {taxes}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span className="text-lg">Rs {finalAmount}</span>
            </div>
          </>
        )}

        {onContinue && (
          <Button onClick={onContinue} className="w-full mt-6" disabled={selectedSeats.length === 0}>
            Continue to Passenger Details
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
