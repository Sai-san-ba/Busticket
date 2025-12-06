"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BusManagement } from "@/components/bus-management"
import { BookingManagement } from "@/components/booking-management"
import { RouteManagement } from "@/components/route-management"
import { AdminStats } from "@/components/admin-stats"
import { LogOut, TrendingUp, Bus, Ticket, Users } from "lucide-react"

interface Admin {
  name: string
  email?: string
  id?: string
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    // Check if admin is logged in (in a real app, this would verify admin role)
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // For demo purposes, assume any logged-in user can access admin
      setAdmin(parsedUser)
    } else {
      // Redirect to login if not logged in
      window.location.href = "/auth/login"
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  if (!admin) {
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
              <div className="flex items-center space-x-2 mr-8">
                <img 
                  src="/newlogo.svg" 
                  alt="BusBooker Logo" 
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <h1 className="text-xl font-bold text-foreground"> EazyGo Admin</h1>
              </div>
              <Badge variant="secondary">Administrator</Badge>
            </div>
            <nav className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {admin?.name}</span>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                View Site
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your bus booking system</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="buses" className="flex items-center space-x-2">
              <Bus className="h-4 w-4" />
              <span>Buses</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center space-x-2">
              <Bus className="h-4 w-4" />
              <span>Routes</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Ticket className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>

          <TabsContent value="buses">
            <BusManagement />
          </TabsContent>

          <TabsContent value="routes">
            <RouteManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
