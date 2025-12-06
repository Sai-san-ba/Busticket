"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from "lucide-react"

// Mock bus data
const mockBuses = [
  {
    id: "1",
    operator: "Express Lines",
    busNumber: "MH12AB1234",
    busType: "AC Sleeper",
    totalSeats: 40,
    facilities: ["AC", "WiFi", "Charging Port", "Blanket"],
    status: "active",
  },
  {
    id: "2",
    operator: "Comfort Travels",
    busNumber: "DL01CD5678",
    busType: "AC Semi-Sleeper",
    totalSeats: 35,
    facilities: ["AC", "Charging Port", "Water Bottle"],
    status: "active",
  },
  {
    id: "3",
    operator: "Royal Coaches",
    busNumber: "KA03EF9012",
    busType: "Volvo Multi-Axle",
    totalSeats: 45,
    facilities: ["AC", "WiFi", "Entertainment", "Meals", "Blanket"],
    status: "maintenance",
  },
]

export function BusManagement() {
  const [buses, setBuses] = useState(mockBuses)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBus, setNewBus] = useState({
    operator: "",
    busNumber: "",
    busType: "",
    totalSeats: "",
    facilities: [],
  })

  const filteredBuses = buses.filter(
    (bus) =>
      bus.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddBus = () => {
    const bus = {
      id: (buses.length + 1).toString(),
      ...newBus,
      totalSeats: Number.parseInt(newBus.totalSeats),
      status: "active",
    }
    setBuses([...buses, bus])
    setNewBus({ operator: "", busNumber: "", busType: "", totalSeats: "", facilities: [] })
    setShowAddForm(false)
  }

  const handleDeleteBus = (id: string) => {
    setBuses(buses.filter((bus) => bus.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
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
        <h3 className="text-2xl font-bold text-foreground">Bus Management</h3>
        <Button onClick={() => setShowAddForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Bus
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Add Bus Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operator">Operator Name</Label>
                <Input
                  id="operator"
                  value={newBus.operator}
                  onChange={(e) => setNewBus({ ...newBus, operator: e.target.value })}
                  placeholder="Enter operator name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  value={newBus.busNumber}
                  onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                  placeholder="Enter bus number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="busType">Bus Type</Label>
                <select
                  id="busType"
                  value={newBus.busType}
                  onChange={(e) => setNewBus({ ...newBus, busType: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select bus type</option>
                  <option value="AC Sleeper">AC Sleeper</option>
                  <option value="AC Semi-Sleeper">AC Semi-Sleeper</option>
                  <option value="Non-AC Sleeper">Non-AC Sleeper</option>
                  <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total Seats</Label>
                <Input
                  id="totalSeats"
                  type="number"
                  value={newBus.totalSeats}
                  onChange={(e) => setNewBus({ ...newBus, totalSeats: e.target.value })}
                  placeholder="Enter total seats"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBus}>Add Bus</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bus List */}
      <div className="space-y-4">
        {filteredBuses.map((bus) => (
          <Card key={bus.id}>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-6 gap-4 items-center">
                <div>
                  <p className="font-semibold text-foreground">{bus.operator}</p>
                  <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{bus.busType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-medium">{bus.totalSeats}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Facilities</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bus.facilities.slice(0, 2).map((facility, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {bus.facilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{bus.facilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Badge className={getStatusColor(bus.status)} variant="secondary">
                    {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteBus(bus.id)}>
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
