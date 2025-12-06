"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, EyeIcon, XIcon, CheckIcon } from "lucide-react"

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    user: "Kasun Perera",
    email: "kasun@example.com",
    phone: "+94 777 123 456",
    route: "Colombo → Kandy",
    date: "2025-01-15",
    time: "22:30 - 06:00",
    operator: "Express Lines",
    seats: ["U1A", "U1B"],
    passengers: 2,
    amount: 1600,
    status: "confirmed",
    bookingDate: "2025-01-10",
  },
  {
    id: "BK002",
    user: "Nimal Silva",
    email: "nimal@example.com",
    phone: "+94 777 123 457",
    route: "Colombo → Galle",
    date: "2025-01-20",
    time: "08:00 - 13:30",
    operator: "Royal Coaches",
    seats: ["L2C"],
    passengers: 1,
    amount: 600,
    status: "pending",
    bookingDate: "2025-01-12",
  },
  {
    id: "BK003",
    user: "Priya Fernando",
    email: "priya@example.com",
    phone: "+94 777 123 458",
    route: "Kandy → Nuwara Eliya",
    date: "2025-01-25",
    time: "23:45 - 07:15",
    operator: "Comfort Travels",
    seats: ["U3A", "U3B"],
    passengers: 2,
    amount: 900,
    status: "cancelled",
    bookingDate: "2025-01-08",
  },
]

export function BookingManagement() {
  const [bookings, setBookings] = useState(mockBookings)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Booking Management</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredBookings.length} bookings</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-8 gap-4 items-center">
                <div>
                  <p className="font-semibold text-foreground">{booking.id}</p>
                  <p className="text-sm text-muted-foreground">{booking.bookingDate}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground">{booking.user}</p>
                  <p className="text-sm text-muted-foreground">{booking.phone}</p>
                </div>

                <div>
                  <p className="font-medium">{booking.route}</p>
                  <p className="text-sm text-muted-foreground">{booking.operator}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Travel Date</p>
                  <p className="font-medium">{booking.date}</p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-medium">{booking.seats.join(", ")}</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.passengers} passenger{booking.passengers > 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-foreground">Rs {booking.amount}</p>
                </div>

                <div>
                  <Badge className={getStatusColor(booking.status)} variant="secondary">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" title="View Details">
                    <EyeIcon className="h-4 w-4" />
                  </Button>

                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(booking.id, "confirmed")}
                        title="Confirm Booking"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(booking.id, "cancelled")}
                        title="Cancel Booking"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {booking.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(booking.id, "cancelled")}
                      title="Cancel Booking"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
