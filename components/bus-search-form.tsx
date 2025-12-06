"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ArrowRightLeftIcon, SearchIcon } from "lucide-react"

interface BusSearchFormProps {
  onSearch: (data: any) => void
  isLoading: boolean
}

export function BusSearchForm({ onSearch, isLoading }: BusSearchFormProps) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(formData)
  }

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Selection */}
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-sm font-medium">
                From
              </Label>
              <Input
                id="from"
                placeholder="e.g. Colombo"
                value={formData.from}
                onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={swapLocations}
                className="h-12 w-12 rounded-full bg-transparent"
              >
                <ArrowRightLeftIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-medium">
                To
              </Label>
              <Input
                id="to"
                placeholder="e.g. Kandy"
                value={formData.to}
                onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
                className="h-12"
                required
              />
            </div>
          </div>

          {/* Date and Passenger Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate" className="text-sm font-medium">
                Departure Date
              </Label>
              <div className="relative">
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                  className="h-12"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDate" className="text-sm font-medium">
                Return Date (Optional)
              </Label>
              <div className="relative">
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                  className="h-12"
                  min={formData.departureDate || new Date().toISOString().split("T")[0]}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-sm font-medium">
                Passengers
              </Label>
              <select
                id="passengers"
                value={formData.passengers}
                onChange={(e) => setFormData((prev) => ({ ...prev, passengers: e.target.value }))}
                className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button type="submit" size="lg" className="px-12 h-12 text-base font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search Buses
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
