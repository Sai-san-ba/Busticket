"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
  Search,
  CreditCard,
  MapPin,
  Shield,
} from "lucide-react"

const faqData = [
  {
    category: "Booking",
    icon: <Search className="h-4 w-4" />,
    questions: [
      {
        q: "How do I book a bus ticket?",
        a: "Simply enter your departure and destination cities, select your travel date, choose from available buses, select your seats, fill in passenger details, and complete the payment.",
      },
      {
        q: "Can I book tickets for multiple passengers?",
        a: "Yes, you can book up to 6 tickets in a single booking. Just select the number of passengers during the search and choose seats for each passenger.",
      },
      {
        q: "How far in advance can I book tickets?",
        a: "You can book tickets up to 90 days in advance. We recommend booking early for popular routes and during peak seasons.",
      },
    ],
  },
  {
    category: "Payment",
    icon: <CreditCard className="h-4 w-4" />,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, online banking, and digital wallets like FriMi, eZ Cash, mCash, and LANKAQR.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all payments are processed through secure, encrypted gateways. We never store your payment information on our servers.",
      },
      {
        q: "What if my payment fails?",
        a: "If your payment fails, the amount will be automatically refunded to your account within 3-5 business days. You can try booking again with a different payment method.",
      },
    ],
  },
  {
    category: "Cancellation",
    icon: <Shield className="h-4 w-4" />,
    questions: [
      {
        q: "How do I cancel my booking?",
        a: 'You can cancel your booking from the "My Bookings" section in your profile. Cancellation charges may apply based on the time of cancellation.',
      },
      {
        q: "What are the cancellation charges?",
        a: "Cancellation charges vary by operator and time of cancellation. Generally, cancellations made 24+ hours before departure have lower charges.",
      },
      {
        q: "How long does it take to get a refund?",
        a: "Refunds are processed within 5-7 business days after cancellation. The amount will be credited to your original payment method.",
      },
    ],
  },
  {
    category: "Travel",
    icon: <MapPin className="h-4 w-4" />,
    questions: [
      {
        q: "How can I track my bus?",
        a: 'Use the "Track Bus" feature with your booking ID to see real-time location, estimated arrival time, and route progress of your bus.',
      },
      {
        q: "What documents do I need for travel?",
        a: "You need a valid government-issued photo ID (National Identity Card, Driving License, Passport) and your ticket (digital or printed).",
      },
      {
        q: "What if I miss my bus?",
        a: "Unfortunately, if you miss your bus, the ticket becomes invalid. We recommend arriving at the boarding point at least 15 minutes before departure.",
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to a support system
    alert("Your message has been sent! We will get back to you within 24 hours.")
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
            <p className="text-muted-foreground">
              Find answers to your questions or get in touch with our support team
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-3">24/7 Customer Support</p>
                <p className="font-semibold">1800-123-4567</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">Get response within 24 hours</p>
                <p className="font-semibold">support@busbooker.com</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
                <Badge variant="default" className="mb-3">
                  Online
                </Badge>
                <br />
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq" className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Contact Us</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <div className="space-y-6">
                {/* Search Bar */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Categories */}
                <div className="space-y-6">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {category.icon}
                          {category.category}
                          <Badge variant="secondary">{category.questions.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible>
                          {category.questions.map((item, index) => (
                            <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {searchQuery && filteredFAQs.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No results found</h3>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find any answers matching your search. Try different keywords or contact our support
                        team.
                      </p>
                      <Button variant="outline">Contact Support</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <p className="text-muted-foreground">
                    Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Support Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Phone Support</h4>
                      <p className="text-sm text-muted-foreground">24/7 - All days</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
