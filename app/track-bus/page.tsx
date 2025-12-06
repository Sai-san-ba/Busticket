"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Navigation, Phone, AlertCircle, ArrowLeft, Bus } from "lucide-react"

interface TrackingData {
  bookingReference: string
  bookingStatus: string
  seats: any
  bus: {
    busNumber: string
    operatorName: string
    busType: string
  }
  route: {
    from: string
    to: string
    distance: number
    departureTime: string
    arrivalTime: string
  }
  tracking: {
    currentLocation: string
    latitude: number
    longitude: number
    speed: number
    heading: number
    status: string
    delayMinutes: number
    nextStop: string
    completedStops: string[]
    upcomingStops: string[]
    driverContact: string
    lastUpdated: string
  } | null
}

export default function TrackBusPage() {
  const [bookingId, setBookingId] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const bookingParam = urlParams.get("booking")
    if (bookingParam) {
      setBookingId(bookingParam)
      handleTrackBus(bookingParam)
    }
  }, [])

  const handleTrackBus = async (id?: string) => {
    const searchId = id || bookingId
    if (!searchId.trim()) {
      setError("Please enter a booking reference")
      return
    }

    setLoading(true)
    setError("")
    setTrackingData(null)

    try {
      const response = await fetch(`/api/track?reference=${encodeURIComponent(searchId.toUpperCase())}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to fetch tracking data")
        setLoading(false)
        return
      }

      setTrackingData(data)
    } catch (err) {
      console.error('Tracking error:', err)
      setError("Failed to connect to tracking service. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh tracking data every 30 seconds
  useEffect(() => {
    if (trackingData && bookingId) {
      const interval = setInterval(() => {
        handleTrackBus(bookingId)
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [trackingData, bookingId])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <img 
                  src="/newlogo.svg" 
                  alt="BusBooker Logo" 
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <h1 className="text-xl font-bold text-foreground">EazyGo</h1>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/profile")}>
                My Bookings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Bus</h1>
            <p className="text-muted-foreground">Enter your booking ID to see real-time bus location</p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter Booking Reference (e.g., BK123456)"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                    className="h-12"
                    onKeyPress={(e) => e.key === "Enter" && handleTrackBus()}
                  />
                </div>
                <Button onClick={() => handleTrackBus()} disabled={loading} className="h-12 px-8">
                  {loading ? "Tracking..." : "Track Bus"}
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-4 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Booking Info */}
              <Card className="bg-primary/5">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Reference</p>
                      <p className="font-bold text-lg">{trackingData.bookingReference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Status</p>
                      <Badge variant={trackingData.bookingStatus === 'confirmed' ? 'default' : 'secondary'}>
                        {trackingData.bookingStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-semibold">
                        {Array.isArray(trackingData.seats) ? trackingData.seats.join(', ') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bus className="h-5 w-5" />
                      Bus Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Bus Number</p>
                        <p className="font-semibold">{trackingData.bus.busNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Operator</p>
                        <p className="font-semibold">{trackingData.bus.operatorName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bus Type</p>
                        <p className="font-semibold">{trackingData.bus.busType}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-semibold">{trackingData.route.from} → {trackingData.route.to}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-semibold">{trackingData.route.distance} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Schedule</p>
                        <p className="font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          {trackingData.route.departureTime} - {trackingData.route.arrivalTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Tracking Status */}
              {trackingData.tracking ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Navigation className="h-5 w-5" />
                          Live Tracking
                        </CardTitle>
                        <Badge variant={
                          trackingData.tracking.status === "on_time" ? "default" :
                          trackingData.tracking.status === "delayed" ? "destructive" :
                          trackingData.tracking.status === "stopped" ? "secondary" : "outline"
                        }>
                          {trackingData.tracking.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Location</p>
                            <p className="font-semibold flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              {trackingData.tracking.currentLocation}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Next Stop</p>
                            <p className="font-semibold">{trackingData.tracking.nextStop || 'Destination'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Current Speed</p>
                            <p className="font-semibold">{trackingData.tracking.speed.toFixed(1)} km/h</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {trackingData.tracking.delayMinutes > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground">Delay</p>
                              <p className="font-semibold text-destructive">{trackingData.tracking.delayMinutes} minutes</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-semibold">{new Date(trackingData.tracking.lastUpdated).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Placeholder */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Location Map</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                        <div className="text-center z-10">
                          <MapPin className="h-12 w-12 text-primary mx-auto mb-2 animate-bounce" />
                          <p className="font-semibold">GPS Coordinates</p>
                          <p className="text-sm text-muted-foreground">
                            Lat: {trackingData.tracking.latitude.toFixed(6)}, Lng: {trackingData.tracking.longitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Heading: {trackingData.tracking.heading.toFixed(1)}°
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => window.open(`https://www.google.com/maps?q=${trackingData.tracking!.latitude},${trackingData.tracking!.longitude}`, '_blank')}
                          >
                            View on Google Maps
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Route Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Route Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trackingData.tracking.completedStops.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-3">Completed Stops</p>
                            <div className="flex flex-wrap gap-2">
                              {trackingData.tracking.completedStops.map((stop: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                                  ✓ {stop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {trackingData.tracking.upcomingStops.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-3">Upcoming Stops</p>
                            <div className="flex flex-wrap gap-2">
                              {trackingData.tracking.upcomingStops.map((stop: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {stop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  {trackingData.tracking.driverContact && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Driver Contact:</span>
                            <span className="font-semibold">{trackingData.tracking.driverContact}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `tel:${trackingData.tracking!.driverContact}`}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call Driver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Tracking Not Available</p>
                    <p className="text-muted-foreground">
                      Live tracking is not currently available for this booking. 
                      The bus may not have departed yet, or tracking has not been activated.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Help Card */}
          {!trackingData && !loading && !error && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">How to Track Your Bus</p>
                <p className="text-muted-foreground mb-4">
                  Enter your booking reference number (e.g., BK123456) that you received after booking your ticket.
                </p>
                <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
                  <p className="text-sm font-semibold mb-2">Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time bus location</li>
                    <li>• Current speed and heading</li>
                    <li>• Completed and upcoming stops</li>
                    <li>• Delay information</li>
                    <li>• Driver contact details</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
