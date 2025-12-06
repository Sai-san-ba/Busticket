"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react"
import { PaymentMethods } from "@/components/payment-methods"
import { PaymentSummary } from "@/components/payment-summary"

interface User {
  id: string
  [key: string]: any
}

// Mock booking data (in a real app, this would come from the previous step)
const mockBookingData = {
  bus: {
    id: "1",
    operator: "Express Lines",
    busType: "AC Sleeper",
    route: "Colombo → Kandy",
    date: "2025-01-15",
    departureTime: "22:30",
    arrivalTime: "04:00",
    duration: "5h 30m",
    price: 800,
  },
  selectedSeats: ["U1A", "U1B"],
  passengers: [
    { name: "Kasun Perera", age: "30", gender: "male", phone: "+94 777 123 456", email: "kasun@example.com" },
    { name: "Priya Perera", age: "28", gender: "female", phone: "+94 777 123 457", email: "priya@example.com" },
  ],
  totalAmount: 1600,
  taxes: 80,
  finalAmount: 1680,
}

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [bookingData, setBookingData] = useState(mockBookingData)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = "/auth/login"
    }

    // Get booking data from sessionStorage
    const busDataStr = sessionStorage.getItem('busDataForPayment')
    if (busDataStr) {
      try {
        const busData = JSON.parse(busDataStr)
        const totalAmount = busData.selectedSeats.length * busData.price
        const taxes = Math.round(totalAmount * 0.05)
        
        setBookingData({
          bus: {
            id: busData.id,
            operator: busData.operator,
            busType: busData.busType,
            route: busData.route,
            date: busData.date,
            departureTime: busData.departureTime,
            arrivalTime: busData.arrivalTime,
            duration: busData.duration,
            price: busData.price,
          },
          selectedSeats: busData.selectedSeats,
          passengers: busData.passengers || mockBookingData.passengers,
          totalAmount: totalAmount,
          taxes: taxes,
          finalAmount: totalAmount + taxes,
        })
      } catch (error) {
        console.error('Error parsing bus data:', error)
      }
    }
  }, [])

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock successful payment
    const bookingId = `BK${Date.now().toString().slice(-6)}`

    // Store booking in localStorage (in a real app, this would be saved to database)
    const booking = {
      id: bookingId,
      ...bookingData,
      status: "confirmed",
      paymentMethod: selectedPaymentMethod,
      bookingDate: new Date().toISOString().split("T")[0],
      userId: user?.id,
    }

    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]")
    localStorage.setItem("userBookings", JSON.stringify([...existingBookings, booking]))

    setIsProcessing(false)

    // Redirect to success page
    window.location.href = `/booking-success?id=${bookingId}`
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <img 
                  src="/newlogo.svg" 
                  alt="BusBooker Logo" 
                  className="h-12 w-12 rounded object-cover"
                />
                <span className="font-bold text-foreground">EazyGo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="text-sm font-medium text-foreground">Select Seats</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="text-sm font-medium text-foreground">Passenger Details</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-foreground">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  <span>Secure Payment</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
              </CardHeader>
              <CardContent>
                <PaymentMethods
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                  onPayment={handlePayment}
                  isProcessing={isProcessing}
                  amount={mockBookingData.finalAmount}
                />
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <PaymentSummary bookingData={bookingData} />
          </div>
        </div>
      </div>
    </div>
  )
}
