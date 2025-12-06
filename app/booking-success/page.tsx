"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircleIcon, DownloadIcon, ShareIcon, CalendarIcon, MapPinIcon } from "lucide-react"

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get booking ID from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const bookingId = urlParams.get("id")

    if (bookingId) {
      // Get booking from localStorage (in a real app, this would be from API)
      const userBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
      const foundBooking = userBookings.find((b) => b.id === bookingId)

      if (foundBooking) {
        setBooking(foundBooking)
      }
    }

    setIsLoading(false)
  }, [])

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert("Ticket download functionality would be implemented here")
  }

  const handleShareBooking = () => {
    // In a real app, this would share booking details
    if (navigator.share) {
      navigator.share({
        title: "Bus Booking Confirmation",
        text: `My bus booking ${booking?.id} is confirmed!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Booking link copied to clipboard!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Booking not found</p>
            <Button className="mt-4" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">EazyGo</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/profile")}>
                My Bookings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-4">
                Your bus ticket has been booked successfully. A confirmation email has been sent to your registered
                email address.
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Booking ID: {booking.id}
              </Badge>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trip Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Route</span>
                  </div>
                  <p className="font-semibold text-lg">{booking.bus.route}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Travel Date</span>
                  </div>
                  <p className="font-semibold">{booking.bus.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.bus.departureTime} - {booking.bus.arrivalTime}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Bus Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Bus Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Operator: </span>
                    <span className="font-medium">{booking.bus.operator}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bus Type: </span>
                    <span className="font-medium">{booking.bus.busType}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Passenger Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Passenger Details</h4>
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{passenger.name}</span>
                      <span className="text-muted-foreground ml-2">
                        (Age: {passenger.age}, {passenger.gender})
                      </span>
                    </div>
                    <Badge variant="outline">Seat {booking.selectedSeats[index]}</Badge>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Payment Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span>Rs{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span>Rs{booking.taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Paid</span>
                    <span>Rs{booking.finalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="capitalize">{booking.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleDownloadTicket} className="flex-1">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
            <Button variant="outline" onClick={handleShareBooking} className="flex-1 bg-transparent">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Booking
            </Button>
          </div>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Please arrive at the boarding point at least 15 minutes before departure time</p>
              <p>• Carry a valid photo ID proof during travel</p>
              <p>• SMS and email alerts will be sent for any schedule changes</p>
              <p>• For cancellations, visit our website or contact customer support</p>
              <p>• Customer Support: 1800-123-4567 (24/7)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
