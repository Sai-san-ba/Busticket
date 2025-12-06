"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, MapPin, Clock, Users, CreditCard } from "lucide-react"

interface BookingConfirmationProps {
  bookingData: {
    bookingId: string
    route: string
    date: string
    time: string
    operator: string
    busType: string
    seats: string[]
    passengers: Array<{
      name: string
      age: number
      gender: string
    }>
    totalAmount: number
    paymentMethod: string
  }
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert("Ticket download started!")
  }

  const handleTrackBus = () => {
    window.location.href = `/track-bus?booking=${bookingData.bookingId}`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Booking Confirmed!</h2>
          <p className="text-green-700 dark:text-green-300">
            Your bus ticket has been successfully booked. A confirmation email has been sent to your registered email
            address.
          </p>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <Badge variant="default">Confirmed</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-bold text-lg">{bookingData.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {bookingData.route}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {bookingData.date} at {bookingData.time}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Operator</p>
                <p className="font-semibold">{bookingData.operator}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bus Type</p>
                <p className="font-semibold">{bookingData.busType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seats</p>
                <p className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {bookingData.seats.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div>
            <h3 className="font-semibold mb-3">Passenger Details</h3>
            <div className="space-y-2">
              {bookingData.passengers.map((passenger, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{passenger.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {passenger.age} years, {passenger.gender}
                    </p>
                  </div>
                  <Badge variant="outline">{bookingData.seats[index]}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {bookingData.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span>Rs {bookingData.totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button onClick={handleDownloadTicket} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>
        <Button variant="outline" onClick={handleTrackBus} className="flex items-center gap-2 bg-transparent">
          <MapPin className="h-4 w-4" />
          Track Bus
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/profile")}>
          View All Bookings
        </Button>
      </div>

      {/* Important Information */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardContent className="p-4">
          <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Information</h4>
          <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <li>• Please arrive at the boarding point 15 minutes before departure</li>
            <li>• Carry a valid ID proof during travel</li>
            <li>• Keep your ticket handy for verification</li>
            <li>• You can track your bus in real-time using the Track Bus feature</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
