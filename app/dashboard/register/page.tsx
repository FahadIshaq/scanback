"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, QrCode, Upload, X, Camera, Heart, Package, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRLogo } from "@/components/qr-logo"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const suggestedType = searchParams.get("type") || "general"

  const [step, setStep] = useState(1)
  const [qrMethod, setQrMethod] = useState<"scan" | "manual">("manual")
  const [formData, setFormData] = useState({
    qrCode: "",
    tagType: suggestedType,
    itemName: "",
    customMessage: "",
    showPhone: true,
    showEmail: false,
    scanAlerts: true,
    emailAlerts: true,
    smsAlerts: true,
    // Pet-specific fields
    breed: "",
    color: "",
    age: "",
    medicalNotes: "",
    vetName: "",
    vetPhone: "",
    emergencyContact: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleQRScan = () => {
    // Simulate QR scanning
    const mockQRCode = `SB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setFormData((prev) => ({ ...prev, qrCode: mockQRCode }))
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to success page
    router.push(`/dashboard/success?code=${formData.qrCode}`)
  }

  const getDefaultMessage = (tagType: string, itemName: string) => {
    if (tagType === "pet") {
      return `Hi! Thanks for finding ${itemName}. ${itemName} is very important to me. Please call me as soon as possible so we can arrange a safe return. I really appreciate your help!`
    }
    return `Hi! Thanks for finding my ${itemName}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`
  }

  useEffect(() => {
    if (formData.tagType && formData.itemName && !formData.customMessage) {
      setFormData((prev) => ({
        ...prev,
        customMessage: getDefaultMessage(formData.tagType, formData.itemName),
      }))
    }
  }, [formData.tagType, formData.itemName])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <QRLogo />
              <span className="font-semibold text-navy-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-navy-900 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? "bg-navy-900" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-navy-900 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? "bg-navy-900" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-navy-900 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>QR Code</span>
            <span>Item Details</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Step 1: QR Code Input */}
        {step === 1 && (
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-navy-900">Add Your QR Code</CardTitle>
              <p className="text-gray-600">Scan your QR sticker or enter the code manually</p>
            </CardHeader>
            <CardContent>
              <Tabs value={qrMethod} onValueChange={(value) => setQrMethod(value as "scan" | "manual")}>
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="scan" className="rounded-xl">Scan QR Code</TabsTrigger>
                  <TabsTrigger value="manual" className="rounded-xl">Enter Manually</TabsTrigger>
                </TabsList>

                <TabsContent value="scan" className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-32 h-32 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">Position your QR sticker in front of your camera</p>
                    <Button onClick={handleQRScan} className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl">
                      <Camera className="h-4 w-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div>
                    <Label htmlFor="qrCode" className="text-gray-700">QR Code</Label>
                    <Input
                      id="qrCode"
                      value={formData.qrCode}
                      onChange={(e) => handleInputChange("qrCode", e.target.value)}
                      placeholder="Enter QR code (e.g., SB-ABC123)"
                      className="font-mono border-gray-200 focus:border-gray-400 rounded-xl"
                    />
                    <p className="text-sm text-gray-500 mt-1">Find the code printed on your QR sticker</p>
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white rounded-xl"
                    disabled={!formData.qrCode}
                  >
                    Continue
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Item Details */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(3)
            }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-navy-900">Item Information</CardTitle>
                <p className="text-gray-600">Tell us about what you're protecting</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tagType" className="text-gray-700">Tag Type *</Label>
                  <Select value={formData.tagType} onValueChange={(value) => handleInputChange("tagType", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 rounded-xl">
                      <SelectValue placeholder="Select tag type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="pet">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>Pet (Dog, Cat, etc.)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="general">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          <span>General Item</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="itemName" className="text-gray-700">{formData.tagType === "pet" ? "Pet Name" : "Item Name"} *</Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange("itemName", e.target.value)}
                    placeholder={
                      formData.tagType === "pet" ? "e.g., Luna, Max, Buddy" : "e.g., House Keys, iPhone, Wallet"
                    }
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                </div>

                {/* Pet-specific fields */}
                {formData.tagType === "pet" && (
                  <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <h4 className="font-medium text-red-900 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Pet Details
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="breed" className="text-gray-700">Breed</Label>
                        <Input
                          id="breed"
                          value={formData.breed}
                          onChange={(e) => handleInputChange("breed", e.target.value)}
                          placeholder="e.g., Golden Retriever"
                          className="border-gray-200 focus:border-gray-400 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="color" className="text-gray-700">Color</Label>
                        <Input
                          id="color"
                          value={formData.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          placeholder="e.g., Golden/Cream"
                          className="border-gray-200 focus:border-gray-400 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="age" className="text-gray-700">Age</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="e.g., 3 years old"
                        className="border-gray-200 focus:border-gray-400 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalNotes" className="text-gray-700">Medical Notes (Optional)</Label>
                      <Textarea
                        id="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                        placeholder="Any medical conditions, medications, or special care instructions"
                        rows={3}
                        className="border-gray-200 focus:border-gray-400 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vetName" className="text-gray-700">Veterinarian Name (Optional)</Label>
                      <Input
                        id="vetName"
                        value={formData.vetName}
                        onChange={(e) => handleInputChange("vetName", e.target.value)}
                        placeholder="Dr. Smith - Happy Paws Clinic"
                        className="border-gray-200 focus:border-gray-400 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vetPhone" className="text-gray-700">Vet Phone Number (Optional)</Label>
                      <Input
                        id="vetPhone"
                        type="tel"
                        value={formData.vetPhone}
                        onChange={(e) => handleInputChange("vetPhone", e.target.value)}
                        placeholder="+27 11 234 5678"
                        className="border-gray-200 focus:border-gray-400 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact" className="text-gray-700">Emergency Contact (Optional)</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="John Doe (spouse) - +27 82 123 4567"
                        className="border-gray-200 focus:border-gray-400 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="customMessage" className="text-gray-700">Custom Message for Finder *</Label>
                  <Textarea
                    id="customMessage"
                    value={formData.customMessage}
                    onChange={(e) => handleInputChange("customMessage", e.target.value)}
                    placeholder="What should someone do if they find this item?"
                    rows={4}
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This message will be shown to anyone who scans your QR code
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-gray-700">Photo (Optional)</Label>
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Upload a photo</p>
                      <p className="text-sm text-gray-500 mb-4">
                        {formData.tagType === "pet"
                          ? "Help people identify your pet"
                          : "Help people identify your item"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button type="button" variant="outline" asChild className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          Choose Photo
                        </label>
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-xl"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-navy-900 hover:bg-navy-800 text-white rounded-xl"
              disabled={!formData.itemName || !formData.customMessage}
            >
              Continue to Settings
            </Button>
          </form>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-navy-900">Contact & Privacy Settings</CardTitle>
                <p className="text-gray-600">Choose how finders can contact you</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-700">Contact Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showPhone"
                        checked={formData.showPhone}
                        onCheckedChange={(checked) => handleInputChange("showPhone", checked as boolean)}
                      />
                      <Label htmlFor="showPhone" className="text-sm text-gray-600">
                        Show my phone number (recommended)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showEmail"
                        checked={formData.showEmail}
                        onCheckedChange={(checked) => handleInputChange("showEmail", checked as boolean)}
                      />
                      <Label htmlFor="showEmail" className="text-sm text-gray-600">
                        Show my email address
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-700">Scan Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">Get notified when someone scans your tag</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="scanAlerts"
                        checked={formData.scanAlerts}
                        onCheckedChange={(checked) => handleInputChange("scanAlerts", checked as boolean)}
                      />
                      <Label htmlFor="scanAlerts" className="text-sm text-gray-600">
                        Enable scan alerts
                      </Label>
                    </div>

                    {formData.scanAlerts && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emailAlerts"
                            checked={formData.emailAlerts}
                            onCheckedChange={(checked) => handleInputChange("emailAlerts", checked as boolean)}
                          />
                          <Label htmlFor="emailAlerts" className="text-sm text-gray-600">
                            Email notifications
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="smsAlerts"
                            checked={formData.smsAlerts}
                            onCheckedChange={(checked) => handleInputChange("smsAlerts", checked as boolean)}
                          />
                          <Label htmlFor="smsAlerts" className="text-sm text-gray-600">
                            WhatsApp notifications
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-navy-900">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>QR Code:</strong> {formData.qrCode}
                  </div>
                  <div>
                    <strong>Type:</strong> {formData.tagType === "pet" ? "Pet" : "General Item"}
                  </div>
                  <div>
                    <strong>Name:</strong> {formData.itemName}
                  </div>
                  {formData.tagType === "pet" && formData.breed && (
                    <div>
                      <strong>Breed:</strong> {formData.breed}
                    </div>
                  )}
                  <div>
                    <strong>Contact Methods:</strong>{" "}
                    {[formData.showPhone && "Phone", formData.showEmail && "Email"].filter(Boolean).join(", ") ||
                      "Secure messaging only"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full bg-navy-900 hover:bg-navy-800 text-white rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? "Registering Tag..." : "Register QR Tag"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
