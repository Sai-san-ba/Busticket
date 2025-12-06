"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCardIcon, SmartphoneIcon, WalletIcon, BanknoteIcon } from "lucide-react"

interface PaymentMethodsProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onPayment: () => void
  isProcessing: boolean
  amount: number
}

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  onPayment,
  isProcessing,
  amount,
}: PaymentMethodsProps) {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const [upiId, setUpiId] = useState("")

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPayment()
  }

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPayment()
  }

  return (
    <Tabs value={selectedMethod} onValueChange={onMethodChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="card" className="flex items-center space-x-2">
          <CreditCardIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Card</span>
        </TabsTrigger>
        <TabsTrigger value="upi" className="flex items-center space-x-2">
          <SmartphoneIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Mobile Pay</span>
        </TabsTrigger>
        <TabsTrigger value="wallet" className="flex items-center space-x-2">
          <WalletIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Wallet</span>
        </TabsTrigger>
        <TabsTrigger value="netbanking" className="flex items-center space-x-2">
          <BanknoteIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Net Banking</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card" className="space-y-4">
        <form onSubmit={handleCardSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <input type="checkbox" id="saveCard" className="h-4 w-4 rounded border border-input" />
            <Label htmlFor="saveCard">Save this card for future payments</Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Processing Payment...
              </>
            ) : (
              `Pay Rs ${amount}`
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="upi" className="space-y-4">
        <form onSubmit={handleUpiSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">Mobile Number</Label>
            <Input
              id="upiId"
              placeholder="07XXXXXXXX"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button type="button" variant="outline" className="flex flex-col items-center p-4 h-auto bg-transparent">
              <div className="w-8 h-8 bg-blue-600 rounded mb-2"></div>
              <span className="text-xs">PhonePe</span>
            </Button>
            <Button type="button" variant="outline" className="flex flex-col items-center p-4 h-auto bg-transparent">
              <div className="w-8 h-8 bg-purple-600 rounded mb-2"></div>
              <span className="text-xs">Google Pay</span>
            </Button>
            <Button type="button" variant="outline" className="flex flex-col items-center p-4 h-auto bg-transparent">
              <div className="w-8 h-8 bg-blue-800 rounded mb-2"></div>
              <span className="text-xs">Paytm</span>
            </Button>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Processing Payment...
              </>
            ) : (
              `Pay Rs ${amount}`
            )}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="wallet" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex flex-col items-center p-6 h-auto bg-transparent">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mb-3"></div>
            <span className="font-medium">FriMi Wallet</span>
            <span className="text-xs text-muted-foreground">Balance: Rs 5,000</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-6 h-auto bg-transparent">
            <div className="w-12 h-12 bg-orange-600 rounded-lg mb-3"></div>
            <span className="font-medium">eZ Cash</span>
            <span className="text-xs text-muted-foreground">Balance: Rs 3,200</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-6 h-auto bg-transparent">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mb-3"></div>
            <span className="font-medium">mCash Wallet</span>
            <span className="text-xs text-muted-foreground">Balance: Rs 1,800</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-6 h-auto bg-transparent">
            <div className="w-12 h-12 bg-green-600 rounded-lg mb-3"></div>
            <span className="font-medium">LANKAQR</span>
            <span className="text-xs text-muted-foreground">Balance: Rs 2,500</span>
          </Button>
        </div>

        <Button onClick={onPayment} className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Processing Payment...
            </>
          ) : (
            `Pay Rs ${amount}`
          )}
        </Button>
      </TabsContent>

      <TabsContent value="netbanking" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank">Select Your Bank</Label>
          <select
            id="bank"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Choose your bank</option>
            <option value="boc">Bank of Ceylon</option>
            <option value="peoplesbank">People's Bank</option>
            <option value="commercial">Commercial Bank</option>
            <option value="hnb">Hatton National Bank</option>
            <option value="sampath">Sampath Bank</option>
            <option value="seylan">Seylan Bank</option>
            <option value="nsb">National Savings Bank</option>
            <option value="dfcc">DFCC Bank</option>
          </select>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            You will be redirected to your bank's secure website to complete the payment.
          </p>
        </div>

        <Button onClick={onPayment} className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Processing Payment...
            </>
          ) : (
            `Pay Rs ${amount}`
          )}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
