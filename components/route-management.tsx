"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from "lucide-react"

// Mock route data
const mockRoutes = [
  {
    id: "1",
    from: "Colombo",
    to: "Kandy",
    distance: "115 km",
    duration: "3h 00m",
    price: 800,
    buses: ["Express Lines", "Comfort Travels"],
    status: "active",
  },
  {
    id: "2",
    from: "Colombo",
    to: "Galle",
    distance: "119 km",
    duration: "2h 30m",
    price: 600,
    buses: ["Royal Coaches", "Express Lines"],
    status: "active",
  },
  {
    id: "3",
    from: "Kandy",
    to: "Nuwara Eliya",
    distance: "79 km",
    duration: "2h 30m",
    price: 450,
    buses: ["Comfort Travels"],
    status: "inactive",
  },
]

export function RouteManagement() {
  const [routes, setRoutes] = useState(mockRoutes)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRoute, setNewRoute] = useState({
    from: "",
    to: "",
    distance: "",
    duration: "",
    price: "",
  })

  const filteredRoutes = routes.filter(
    (route) =>
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRoute = () => {
    const route = {
      id: (routes.length + 1).toString(),
      ...newRoute,
      price: Number.parseInt(newRoute.price),
      buses: [],
      status: "active",
    }
    setRoutes([...routes, route])
    setNewRoute({ from: "", to: "", distance: "", duration: "", price: "" })
    setShowAddForm(false)
  }

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Route Management</h3>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Add Route Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From City</Label>
                <Input
                  id="from"
                  value={newRoute.from}
                  onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                  placeholder="Enter departure city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To City</Label>
                <Input
                  id="to"
                  value={newRoute.to}
                  onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                  placeholder="Enter destination city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distance">Distance</Label>
                <Input
                  id="distance"
                  value={newRoute.distance}
                  onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                  placeholder="e.g., 150 km"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={newRoute.duration}
                  onChange={(e) => setNewRoute({ ...newRoute, duration: e.target.value })}
                  placeholder="e.g., 3h 30m"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (Rs)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newRoute.price}
                  onChange={(e) => setNewRoute({ ...newRoute, price: e.target.value })}
                  placeholder="Enter base price"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRoute}>Add Route</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route List */}
      <div className="space-y-4">
        {filteredRoutes.map((route) => (
          <Card key={route.id}>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-6 gap-4 items-center">
                <div>
                  <p className="font-semibold text-foreground">
                    {route.from} → {route.to}
                  </p>
                  <p className="text-sm text-muted-foreground">{route.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{route.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="font-medium">Rs {route.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operators</p>
                  <p className="font-medium">{route.buses.length || 0}</p>
                </div>
                <div>
                  <Badge className={getStatusColor(route.status)} variant="secondary">
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteRoute(route.id)}>
                    <TrashIcon className="h-4 w-4" />
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
