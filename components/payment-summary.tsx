"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Passenger {
  name: string
}

interface Bus {
  operator: string
  busType: string
  route: string
  date: string
  departureTime: string
  arrivalTime: string
  price: number
}

interface BookingData {
  bus: Bus
  passengers: Passenger[]
  selectedSeats: string[]
  totalAmount: number
  taxes: number
  finalAmount: number
}

interface PaymentSummaryProps {
  bookingData: BookingData
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

export function PaymentSummary({ bookingData }: PaymentSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trip Details */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-foreground">{bookingData.bus.operator}</p>
            <p className="text-sm text-muted-foreground">{bookingData.bus.busType}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium">{bookingData.bus.route}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(bookingData.bus.date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">
                {bookingData.bus.departureTime} - {bookingData.bus.arrivalTime}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Passenger Details */}
        <div className="space-y-2">
          <h4 className="font-medium">Passengers</h4>
          {bookingData.passengers.map((passenger, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {passenger.name} (Seat {bookingData.selectedSeats[index]})
              </span>
              <span className="font-medium">Rs {bookingData.bus.price}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Base Fare ({bookingData.selectedSeats.length} seat{bookingData.selectedSeats.length > 1 ? "s" : ""})
            </span>
            <span className="font-medium">Rs {bookingData.totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes & Service Fee</span>
            <span className="font-medium">Rs {bookingData.taxes}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Convenience Fee</span>
            <span className="font-medium">Rs 0</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span className="text-primary">Rs {bookingData.finalAmount}</span>
        </div>

        {/* Security Badge */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <p className="text-xs text-muted-foreground">Your payment is protected by 256-bit SSL encryption</p>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <h5 className="text-sm font-medium mb-2">Cancellation Policy</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Free cancellation up to 24 hours before departure</li>
            <li>• 50% refund for cancellation within 24 hours</li>
            <li>• No refund for no-show</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
