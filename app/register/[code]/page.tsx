"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScanHeader } from "@/components/scan-header"

interface RegisterPageProps {
  params: {
    code: string
  }
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    tagType: "",
    message: "",
    nickname: "",
    includeEmail: false,
    includeWhatsApp: false,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to confirmation page
    router.push("/confirmation")
  }

  const getDefaultMessage = (tagType: string, nickname: string) => {
    const name = nickname || `my ${tagType}`
    switch (tagType) {
      case "pet":
        return `Hi! Thanks for finding ${name}. Please call me as soon as possible. ${nickname ? `${nickname} is very important to me.` : "My pet is very important to me."}`
      case "keys":
        return `Hi! Thanks for finding my keys. Please contact me so we can arrange a return. I really appreciate your help!`
      case "phone":
        return `Hi! Thanks for finding my phone. Please contact me using the information below so we can arrange a return.`
      case "wallet":
        return `Hi! Thanks for finding my wallet. Please contact me so we can arrange a safe return. I really appreciate your honesty!`
      default:
        return `Hi! Thanks for finding ${name}. Please contact me so we can arrange a return. I really appreciate your help!`
    }
  }

  const updateMessage = (tagType: string, nickname: string) => {
    if (!formData.message || formData.message === getDefaultMessage(formData.tagType, formData.nickname)) {
      setFormData((prev) => ({ ...prev, message: getDefaultMessage(tagType, nickname) }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your QR Tag</h1>
          <p className="text-gray-600">
            Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{params.code}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeEmail"
                    checked={formData.includeEmail}
                    onCheckedChange={(checked) => handleInputChange("includeEmail", checked as boolean)}
                  />
                  <Label htmlFor="includeEmail" className="text-sm">
                    Include email in contact options for finders
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeWhatsApp"
                    checked={formData.includeWhatsApp}
                    onCheckedChange={(checked) => handleInputChange("includeWhatsApp", checked as boolean)}
                  />
                  <Label htmlFor="includeWhatsApp" className="text-sm">
                    Enable WhatsApp contact (uses phone number)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tag Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tag Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tagType">What are you tagging? *</Label>
                <Select
                  value={formData.tagType}
                  onValueChange={(value) => {
                    handleInputChange("tagType", value)
                    updateMessage(value, formData.nickname)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pet">Pet (Dog, Cat, etc.)</SelectItem>
                    <SelectItem value="keys">Keys</SelectItem>
                    <SelectItem value="phone">Phone/Device</SelectItem>
                    <SelectItem value="wallet">Wallet/Purse</SelectItem>
                    <SelectItem value="bag">Bag/Backpack</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => {
                    handleInputChange("nickname", e.target.value)
                    updateMessage(formData.tagType, e.target.value)
                  }}
                  placeholder={formData.tagType === "pet" ? "e.g., Luna, Max, Buddy" : "Give it a name"}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.tagType === "pet" ? "Your pet's name" : "A friendly name for this item"}
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message for Finder *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="What should someone do if they find this item?"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This message will be shown to anyone who scans your QR code
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Add Photo (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload a photo of your item</p>
                  <p className="text-sm text-gray-500 mb-4">Helps finders identify your item more easily</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" variant="outline" asChild>
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
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.tagType || !formData.message}
          >
            {isSubmitting ? "Registering..." : "Register QR Tag"}
          </Button>
        </form>
      </div>
    </div>
  )
}
