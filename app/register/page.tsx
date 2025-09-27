"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Heart, Package, CheckCircle, QrCode } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function RegisterPage() {
  const [type, setType] = useState<'item' | 'pet'>('item')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [qrCode, setQrCode] = useState("")

  const [formData, setFormData] = useState({
    details: {
      name: "",
      description: "",
      category: "",
      color: "",
      brand: "",
      model: "",
      species: "",
      breed: "",
      age: ""
    },
    contact: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // First, generate a QR code
      const qrResponse = await fetch('http://localhost:5001/api/admin/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      })

      const qrData = await qrResponse.json()
      
      if (qrData.success) {
        const qrCode = qrData.data.qrCode.code
        
        // Then activate it with the form data
        const activateResponse = await apiClient.activateQRCode(qrCode, formData)
        
        if (activateResponse.success) {
          setQrCode(qrCode)
          setSuccess(true)
        } else {
          setError(activateResponse.message || "Failed to register item")
        }
      } else {
        setError(qrData.message || "Failed to generate QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to register item")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
             
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black">ScanBack</span>
                  <p className="text-xs text-gray-600">QR Code Service</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your {type} has been registered successfully with QR code: <strong>{qrCode}</strong>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. Print or save the QR code image</li>
              <li>2. Attach it to your {type}</li>
              <li>3. If someone finds your {type}, they can scan the QR code to contact you</li>
            </ol>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/register">Register Another Item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
           
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black">ScanBack</span>
                <p className="text-xs text-gray-600">QR Code Service</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Item</h1>
          <p className="text-gray-600">
            Fill in the details below to create a QR code for your item or pet
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What are you registering?</Label>
                <RadioGroup value={type} onValueChange={(value: 'item' | 'pet') => setType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="item" id="item" />
                    <Label htmlFor="item" className="flex items-center space-x-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span>Item (keys, phone, luggage, etc.)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pet" id="pet" />
                    <Label htmlFor="pet" className="flex items-center space-x-2 cursor-pointer">
                      <Heart className="h-4 w-4" />
                      <span>Pet (dog, cat, etc.)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.details.name}
                    onChange={(e) => handleInputChange('details.name', e.target.value)}
                    placeholder={`Enter your ${type} name`}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.details.description}
                    onChange={(e) => handleInputChange('details.description', e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                  />
                </div>

                {type === 'item' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.details.category} onValueChange={(value) => handleInputChange('details.category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="keys">Keys</SelectItem>
                            <SelectItem value="luggage">Luggage</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="documents">Documents</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          value={formData.details.color}
                          onChange={(e) => handleInputChange('details.color', e.target.value)}
                          placeholder="e.g., Black, Silver"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={formData.details.brand}
                          onChange={(e) => handleInputChange('details.brand', e.target.value)}
                          placeholder="e.g., Apple, Samsung"
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={formData.details.model}
                          onChange={(e) => handleInputChange('details.model', e.target.value)}
                          placeholder="e.g., iPhone 14, Galaxy S23"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="species">Species</Label>
                        <Select value={formData.details.species} onValueChange={(value) => handleInputChange('details.species', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="rabbit">Rabbit</SelectItem>
                            <SelectItem value="hamster">Hamster</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="breed">Breed</Label>
                        <Input
                          id="breed"
                          value={formData.details.breed}
                          onChange={(e) => handleInputChange('details.breed', e.target.value)}
                          placeholder="e.g., Golden Retriever"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.details.age}
                        onChange={(e) => handleInputChange('details.age', e.target.value)}
                        placeholder="e.g., 3"
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                
                <div>
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contact.name}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder="+27 82 123 4567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message for Finders</Label>
                  <Textarea
                    id="message"
                    value={formData.contact.message}
                    onChange={(e) => handleInputChange('contact.message', e.target.value)}
                    placeholder="Add a message that will be shown to people who find your item..."
                    rows={3}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? 'Registering...' : `Register ${type === 'pet' ? 'Pet' : 'Item'}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
