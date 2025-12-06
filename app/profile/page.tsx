"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { UserIcon, TicketIcon, SettingsIcon, LogOutIcon } from "lucide-react"

// Mock booking data
const mockBookings = [
  {
    id: "BK001",
    route: "Colombo → Kandy",
    date: "2025-01-15",
    time: "22:30 - 04:00",
    operator: "Express Lines",
    seats: ["U1A", "U1B"],
    status: "confirmed",
    amount: 1600,
  },
  {
    id: "BK002",
    route: "Colombo → Galle",
    date: "2025-01-20",
    time: "08:00 - 10:30",
    operator: "Royal Coaches",
    seats: ["L2C"],
    status: "completed",
    amount: 600,
  },
  {
    id: "BK003",
    route: "Kandy → Nuwara Eliya",
    date: "2025-01-25",
    time: "07:00 - 09:30",
    operator: "Comfort Travels",
    seats: ["U3A", "U3B"],
    status: "cancelled",
    amount: 900,
  },
]

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    // Get user from localStorage (in a real app, this would be from an API)
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone,
      })
    } else {
      window.location.href = "/auth/login"
    }
  }, [])

  const handleSaveProfile = () => {
    if (!user) return
    const updatedUser = { ...user as any, ...formData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
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
            <div className="flex items-center space-x-2">
              <img 
                src="/newlogo.svg" 
                alt="BusBooker Logo" 
                className="h-14 w-14 rounded-lg object-cover"
              />
              <h1 className="text-xl font-bold text-foreground">EazyGo</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/track-bus")}>
                Track Bus
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">My Account</h2>
            <p className="text-muted-foreground">Manage your profile and view your bookings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center space-x-2">
                <TicketIcon className="h-4 w-4" />
                <span>My Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    >
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Booking History</h3>
                  <Badge variant="secondary">{mockBookings.length} bookings</Badge>
                </div>

                {mockBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-semibold text-foreground">{booking.route}</p>
                          <p className="text-sm text-muted-foreground">{booking.operator}</p>
                          <p className="text-xs text-muted-foreground">Booking ID: {booking.id}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-medium">{booking.date}</p>
                          <p className="text-sm text-muted-foreground">{booking.time}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Seats</p>
                          <p className="font-medium">{booking.seats.join(", ")}</p>
                          <Badge className={getStatusColor(booking.status)} variant="secondary">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">₹{booking.amount}</p>
                          <div className="space-y-1 mt-2">
                            {booking.status === "confirmed" && (
                              <>
                                <Button size="sm" variant="outline" className="w-full bg-transparent">
                                  View Ticket
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="w-full"
                                  onClick={() => (window.location.href = `/track-bus?booking=${booking.id}`)}
                                >
                                  Track Bus
                                </Button>
                                <Button size="sm" variant="ghost" className="w-full text-destructive">
                                  Cancel
                                </Button>
                              </>
                            )}
                            {booking.status === "completed" && (
                              <Button size="sm" variant="outline" className="w-full bg-transparent">
                                Download Receipt
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border border-input" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive booking reminders and alerts</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border border-input" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-transparent">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Enable Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
