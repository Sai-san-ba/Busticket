"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, WifiIcon, ZapIcon, CoffeeIcon } from "lucide-react"

interface Bus {
  id: string
  operator: string
  busType: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  availableSeats: number
  totalSeats: number
  facilities: string[]
  rating: number
}

interface BusResultsProps {
  buses: Bus[]
  searchData?: {
    from: string
    to: string
    departureDate: string
  }
}

const facilityIcons: Record<
  "AC" | "WiFi" | "Charging Port" | "Entertainment" | "Meals" | "Blanket" | "Water Bottle",
  string | JSX.Element
> = {
  AC: "❄️",
  WiFi: <WifiIcon className="h-3 w-3" />,
  "Charging Port": <ZapIcon className="h-3 w-3" />,
  Entertainment: "📺",
  Meals: <CoffeeIcon className="h-3 w-3" />,
  Blanket: "🛏️",
  "Water Bottle": "💧",
}

export function BusResults({ buses, searchData }: BusResultsProps) {
  const handleSelectSeats = (busId: string) => {
    // Store search data in sessionStorage to pass to seat-selection page
    if (searchData) {
      sessionStorage.setItem('searchData', JSON.stringify(searchData))
    }
    window.location.href = "/seat-selection?busId=" + busId
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Available Buses ({buses.length})</h3>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option>Sort by: Departure Time</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
            <option>Sort by: Duration</option>
            <option>Sort by: Rating</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {buses.map((bus) => (
          <Card key={bus.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-12 gap-4 items-center">
                {/* Bus Info */}
                <div className="md:col-span-3">
                  <h4 className="font-semibold text-foreground text-lg">{bus.operator}</h4>
                  <p className="text-sm text-muted-foreground">{bus.busType}</p>
                  <div className="flex items-center mt-1">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground ml-1">{bus.rating}</span>
                  </div>
                </div>

                {/* Timing */}
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-foreground">{bus.departureTime}</p>
                      <p className="text-xs text-muted-foreground">Departure</p>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-px bg-border relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-background px-2 text-xs text-muted-foreground">{bus.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-foreground">{bus.arrivalTime}</p>
                      <p className="text-xs text-muted-foreground">Arrival</p>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="md:col-span-3">
                  {bus.facilities.slice(0, 4).map((facility, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <span className="mr-1">{facilityIcons[facility as keyof typeof facilityIcons] || "✓"}</span>
                      {facility}
                    </Badge>
                  ))}
                  {bus.facilities.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{bus.facilities.length - 4} more
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">{bus.availableSeats} seats available</p>
                </div>

                {/* Price and Action */}
                <div className="md:col-span-3 text-right">
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-foreground">Rs {bus.price}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  <Button
                    onClick={() => handleSelectSeats(bus.id)}
                    className="w-full md:w-auto px-6"
                    disabled={bus.availableSeats === 0}
                  >
                    {bus.availableSeats === 0 ? "Sold Out" : "Select Seats"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
