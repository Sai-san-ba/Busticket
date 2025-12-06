"use client"

import { Button } from "@/components/ui/button"

interface SeatMapProps {
  onSeatSelect: (seatId: string) => void
  selectedSeats: string[]
}

// Mock seat data - in a real app, this would come from the API
const seatLayout = [
  // Upper deck
  {
    deck: "Upper",
    rows: [
      {
        rowNumber: 1,
        seats: [
          { id: "U1A", type: "window", status: "available" },
          { id: "U1B", type: "aisle", status: "occupied" },
          null, // aisle gap
          { id: "U1C", type: "aisle", status: "available" },
          { id: "U1D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 2,
        seats: [
          { id: "U2A", type: "window", status: "available" },
          { id: "U2B", type: "aisle", status: "available" },
          null,
          { id: "U2C", type: "aisle", status: "occupied" },
          { id: "U2D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 3,
        seats: [
          { id: "U3A", type: "window", status: "available" },
          { id: "U3B", type: "aisle", status: "available" },
          null,
          { id: "U3C", type: "aisle", status: "available" },
          { id: "U3D", type: "window", status: "occupied" },
        ],
      },
      {
        rowNumber: 4,
        seats: [
          { id: "U4A", type: "window", status: "available" },
          { id: "U4B", type: "aisle", status: "available" },
          null,
          { id: "U4C", type: "aisle", status: "available" },
          { id: "U4D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 5,
        seats: [
          { id: "U5A", type: "window", status: "available" },
          { id: "U5B", type: "aisle", status: "available" },
          null,
          { id: "U5C", type: "aisle", status: "available" },
          { id: "U5D", type: "window", status: "available" },
        ],
      },
    ],
  },
  // Lower deck
  {
    deck: "Lower",
    rows: [
      {
        rowNumber: 1,
        seats: [
          { id: "L1A", type: "window", status: "available" },
          { id: "L1B", type: "aisle", status: "available" },
          null,
          { id: "L1C", type: "aisle", status: "occupied" },
          { id: "L1D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 2,
        seats: [
          { id: "L2A", type: "window", status: "available" },
          { id: "L2B", type: "aisle", status: "available" },
          null,
          { id: "L2C", type: "aisle", status: "available" },
          { id: "L2D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 3,
        seats: [
          { id: "L3A", type: "window", status: "occupied" },
          { id: "L3B", type: "aisle", status: "available" },
          null,
          { id: "L3C", type: "aisle", status: "available" },
          { id: "L3D", type: "window", status: "available" },
        ],
      },
      {
        rowNumber: 4,
        seats: [
          { id: "L4A", type: "window", status: "available" },
          { id: "L4B", type: "aisle", status: "available" },
          null,
          { id: "L4C", type: "aisle", status: "available" },
          { id: "L4D", type: "window", status: "occupied" },
        ],
      },
      {
        rowNumber: 5,
        seats: [
          { id: "L5A", type: "window", status: "available" },
          { id: "L5B", type: "aisle", status: "available" },
          null,
          { id: "L5C", type: "aisle", status: "available" },
          { id: "L5D", type: "window", status: "available" },
        ],
      },
    ],
  },
]

export function SeatMap({ onSeatSelect, selectedSeats }: SeatMapProps) {
  const getSeatButtonClass = (seat: any) => {
    if (!seat) return ""

    const baseClass = "h-8 w-8 rounded text-xs font-medium transition-colors"

    if (seat.status === "occupied") {
      return `${baseClass} bg-destructive text-destructive-foreground cursor-not-allowed`
    }

    if (selectedSeats.includes(seat.id)) {
      return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`
    }

    return `${baseClass} bg-muted hover:bg-muted/80 text-foreground border border-border`
  }

  return (
    <div className="space-y-8">
      {seatLayout.map((deck) => (
        <div key={deck.deck} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{deck.deck} Deck</h3>

          <div className="bg-muted/30 rounded-lg p-6">
            {/* Driver section indicator */}
            <div className="flex justify-end mb-4">
              <div className="bg-muted rounded px-3 py-1 text-xs text-muted-foreground">🚗 Driver</div>
            </div>

            <div className="space-y-3">
              {deck.rows.map((row) => (
                <div key={row.rowNumber} className="flex items-center justify-center space-x-2">
                  <span className="text-xs text-muted-foreground w-6 text-center">{row.rowNumber}</span>

                  <div className="flex items-center space-x-1">
                    {row.seats.map((seat, seatIndex) => {
                      if (!seat) {
                        return <div key={seatIndex} className="w-4" /> // Aisle gap
                      }

                      return (
                        <Button
                          key={seat.id}
                          variant="ghost"
                          size="sm"
                          className={getSeatButtonClass(seat)}
                          onClick={() => seat.status === "available" && onSeatSelect(seat.id)}
                          disabled={seat.status === "occupied"}
                          title={`Seat ${seat.id} - ${seat.type} - ${seat.status}`}
                        >
                          {seat.id.slice(-1)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
