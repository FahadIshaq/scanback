"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Power, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EditPageProps {
  params: {
    id: string
  }
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter()

  // Mock data - in real app, this would be fetched based on the ID
  const [formData, setFormData] = useState({
    name: "Luna",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@email.com",
    tagType: "pet",
    message: "Hi! Thanks for finding Luna. She's very friendly but might be scared. Please call me immediately!",
    nickname: "Luna",
    includeEmail: true,
    includeWhatsApp: true,
    status: "active",
  })

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>("/placeholder.svg?height=200&width=200")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tagInfo = {
    code: "SB-ABC123",
    createdAt: "2024-01-15",
    scans: 0,
    lastScan: null,
  }

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

    // Redirect back to dashboard
    router.push("/dashboard")
  }

  const handleToggleStatus = () => {
    const newStatus = formData.status === "active" ? "inactive" : "active"
    setFormData((prev) => ({ ...prev, status: newStatus }))
  }

  const handleDelete = () => {
    // In real app, this would delete the tag
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-gray-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Tag</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{tagInfo.code}</span>
              <Badge
                className={formData.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {formData.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tag Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tag Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{tagInfo.scans}</p>
                <p className="text-sm text-gray-600">Total Scans</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {tagInfo.lastScan ? new Date(tagInfo.lastScan).toLocaleDateString() : "Never"}
                </p>
                <p className="text-sm text-gray-600">Last Scan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{new Date(tagInfo.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
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
                <Select value={formData.tagType} onValueChange={(value) => handleInputChange("tagType", value)}>
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
                  onChange={(e) => handleInputChange("nickname", e.target.value)}
                  placeholder={formData.tagType === "pet" ? "e.g., Luna, Max, Buddy" : "Give it a name"}
                />
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
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload a photo of your item</p>
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

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || !formData.name || !formData.phone || !formData.tagType || !formData.message}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleToggleStatus}
                className="w-full bg-transparent"
              >
                <Power className="h-4 w-4 mr-2" />
                {formData.status === "active" ? "Deactivate Tag" : "Activate Tag"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Tag
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this tag? This action cannot be undone and the QR code will no
                      longer work.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>

        {/* Preview Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Want to see how your tag looks to finders?</p>
          <Button variant="link" asChild>
            <Link href={`/scan/${tagInfo.code}`}>Preview Tag</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
