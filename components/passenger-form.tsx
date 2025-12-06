"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"

interface PassengerFormProps {
  selectedSeats: string[]
  onSubmit: (data: any) => void
  onBack: () => void
}

export function PassengerForm({ selectedSeats, onSubmit, onBack }: PassengerFormProps) {
  const [passengers, setPassengers] = useState(
    selectedSeats.map((seatId) => ({
      seatId,
      name: "",
      age: "",
      gender: "male",
      phone: "",
      email: "",
    })),
  )

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setPassengers((prev) => prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(passengers)
  }

  const isFormValid = passengers.every((passenger) => passenger.name && passenger.age && passenger.phone)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Passenger Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={passenger.seatId} className="space-y-4 p-4 border border-border rounded-lg">
              <h4 className="font-medium text-foreground">
                Passenger {index + 1} - Seat {passenger.seatId}
              </h4>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Full Name *</Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`age-${index}`}>Age *</Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`gender-${index}`}>Gender</Label>
                  <select
                    id={`gender-${index}`}
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, "gender", e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, "phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              {index === 0 && (
                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`}>Email Address</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="Email for booking confirmation"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, "email", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Booking confirmation will be sent to this email</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={!isFormValid}>
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
