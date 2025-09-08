"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Power, Trash2, Heart, Package, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { QRLogo } from "@/components/qr-logo"
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
  params: Promise<{
    id: string
  }>
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = React.use(params)
  const router = useRouter()

  // Mock data - in real app, this would be fetched based on the ID
  const [formData, setFormData] = useState({
    itemName: "Luna",
    tagType: "pet",
    customMessage: "Hi! Thanks for finding Luna. She's very friendly but might be scared. Please call me immediately!",
    showPhone: true,
    showEmail: true,
    scanAlerts: true,
    emailAlerts: true,
    smsAlerts: true,
    status: "active",
    // Pet-specific fields
    breed: "Golden Retriever",
    color: "Golden/Cream",
    age: "3 years old",
    medicalNotes: "Takes daily medication for allergies. Please contact vet if found injured.",
    vetName: "Dr. Smith - Happy Paws Clinic",
    vetPhone: "+1 (555) 987-6543",
    emergencyContact: "John Johnson (husband) - +1 (555) 123-4568",
  })

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>("/placeholder.svg?height=200&width=200&text=Luna")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tagInfo = {
    code: "SB-ABC123",
    createdAt: "2024-01-15",
    scans: 3,
    lastScan: "2024-01-20T10:30:00Z",
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

  const formatLastScan = (lastScan: string | null) => {
    if (!lastScan) return "Never"
    const date = new Date(lastScan)
    // Use consistent date formatting to avoid hydration mismatch
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-sm">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <QRLogo />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Tag</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">{tagInfo.code}</span>
              <Badge
                className={formData.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {formData.status}
              </Badge>
              <div className="flex items-center space-x-1">
                {formData.tagType === "pet" ? (
                  <Heart className="h-4 w-4 text-red-500" />
                ) : (
                  <Package className="h-4 w-4 text-blue-500" />
                )}
                <span className="capitalize">{formData.tagType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tag Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Tag Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{tagInfo.scans}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Scans</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatLastScan(tagInfo.lastScan)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Last Scan</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {(() => {
                    const date = new Date(tagInfo.createdAt)
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const day = String(date.getDate()).padStart(2, '0')
                    return `${day}/${month}/${year}`
                  })()}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="itemName">{formData.tagType === "pet" ? "Pet Name" : "Item Name"} *</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  placeholder={
                    formData.tagType === "pet" ? "e.g., Luna, Max, Buddy" : "e.g., House Keys, iPhone, Wallet"
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="customMessage">Custom Message for Finder *</Label>
                <Textarea
                  id="customMessage"
                  value={formData.customMessage}
                  onChange={(e) => handleInputChange("customMessage", e.target.value)}
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

          {/* Pet-specific information */}
          {formData.tagType === "pet" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Pet Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => handleInputChange("breed", e.target.value)}
                      placeholder="e.g., Golden Retriever"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., Golden/Cream"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="e.g., 3 years old"
                  />
                </div>

                <div>
                  <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
                  <Textarea
                    id="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                    placeholder="Any medical conditions, medications, or special care instructions"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="vetName">Veterinarian Name (Optional)</Label>
                  <Input
                    id="vetName"
                    value={formData.vetName}
                    onChange={(e) => handleInputChange("vetName", e.target.value)}
                    placeholder="Dr. Smith - Happy Paws Clinic"
                  />
                </div>

                <div>
                  <Label htmlFor="vetPhone">Vet Phone Number (Optional)</Label>
                  <Input
                    id="vetPhone"
                    type="tel"
                    value={formData.vetPhone}
                    onChange={(e) => handleInputChange("vetPhone", e.target.value)}
                    placeholder="+1 (555) 987-6543"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="John Doe (spouse) - +1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact & Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Contact Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPhone"
                      checked={formData.showPhone}
                      onCheckedChange={(checked) => handleInputChange("showPhone", checked as boolean)}
                    />
                    <Label htmlFor="showPhone" className="text-sm">
                      Show my phone number to finders
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showEmail"
                      checked={formData.showEmail}
                      onCheckedChange={(checked) => handleInputChange("showEmail", checked as boolean)}
                    />
                    <Label htmlFor="showEmail" className="text-sm">
                      Show my email address to finders
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Scan Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scanAlerts"
                      checked={formData.scanAlerts}
                      onCheckedChange={(checked) => handleInputChange("scanAlerts", checked as boolean)}
                    />
                    <Label htmlFor="scanAlerts" className="text-sm">
                      Enable scan alerts for this tag
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
                        <Label htmlFor="emailAlerts" className="text-sm">
                          Email notifications
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="smsAlerts"
                          checked={formData.smsAlerts}
                          onCheckedChange={(checked) => handleInputChange("smsAlerts", checked as boolean)}
                        />
                        <Label htmlFor="smsAlerts" className="text-sm">
                          SMS notifications
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Photo</CardTitle>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Upload a photo of your {formData.tagType}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" variant="outline" asChild size="sm" className="text-sm">
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
                    className="w-full h-32 sm:h-48 object-cover rounded-lg"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              disabled={isSubmitting || !formData.itemName || !formData.customMessage}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
              <Save className="h-4 w-4 ml-2" />
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleToggleStatus}
                className="w-full bg-transparent text-sm sm:text-base"
              >
                <Power className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {formData.status === "active" ? "Deactivate Tag" : "Activate Tag"}
                </span>
                <span className="sm:hidden">
                  {formData.status === "active" ? "Deactivate" : "Activate"}
                </span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="w-full text-sm sm:text-base">
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Delete Tag</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
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
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Want to see how your tag looks to finders?</p>
          <Button variant="link" asChild className="text-sm sm:text-base">
            <Link href={`/scan/${tagInfo.code}`}>Preview Tag</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
