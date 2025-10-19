"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Power, Trash2, Heart, Package, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { QRLogo } from "@/components/qr-logo"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
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

interface QRCode {
  _id: string
  code: string
  type: 'item' | 'pet'
  details: {
    name: string
    description?: string
    category?: string
    color?: string
    brand?: string
    model?: string
    image?: string
    emergencyDetails?: string
    pedigreeInfo?: string
  }
  contact?: {
    name: string
    phone: string
    countryCode: string
    backupPhone?: string
    backupCountryCode?: string
    email: string
    message?: string
  }
  settings?: {
    instantAlerts: boolean
    locationSharing: boolean
    showContactOnFinderPage?: boolean
  }
  status: string
  isActivated: boolean
  createdAt: string
  scanCount: number
  lastScanned?: string
}

export default function EditPage({ params }: EditPageProps) {
  const { id } = React.use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [qrCode, setQrCode] = useState<QRCode | null>(null)

  const [formData, setFormData] = useState({
    itemName: "",
    tagType: "item" as 'item' | 'pet',
    customMessage: "",
    showPhone: true,
    showEmail: true,
    showContactOnFinderPage: true,
    scanAlerts: true,
    emailAlerts: true,
    smsAlerts: true,
    status: "active",
    // Pet-specific fields
    breed: "",
    color: "",
    age: "",
    medicalNotes: "",
    vetName: "",
    vetPhone: "",
    emergencyContact: "",
    emergencyDetails: "",
    pedigreeInfo: "",
    showEmergencyDetails: false,
    showPedigreeInfo: false,
  })

  // Load QR code data
  useEffect(() => {
    const loadQRCode = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getUserQRCodes()
        const qr = response.data.find((q: QRCode) => q._id === id)
        
        if (!qr) {
          setError("QR code not found")
          return
        }

        setQrCode(qr)
        setFormData({
          itemName: qr.details.name || "",
          tagType: qr.type,
          customMessage: qr.contact?.message || "",
          showPhone: true, // Always show phone
          showEmail: true, // Always show email
          showContactOnFinderPage: qr.settings?.showContactOnFinderPage ?? true,
          scanAlerts: qr.settings?.instantAlerts ?? true,
          emailAlerts: qr.settings?.instantAlerts ?? true,
          smsAlerts: qr.settings?.instantAlerts ?? true,
          status: qr.isActivated ? "active" : "inactive",
          // Pet-specific fields
          breed: "",
          color: "",
          age: "",
          medicalNotes: qr.details.emergencyDetails || "",
          vetName: "",
          vetPhone: "",
          emergencyContact: "",
          emergencyDetails: qr.details.emergencyDetails || "",
          pedigreeInfo: qr.details.pedigreeInfo || "",
          showEmergencyDetails: !!qr.details.emergencyDetails,
          showPedigreeInfo: !!qr.details.pedigreeInfo,
        })
      } catch (err: any) {
        console.error('Error loading QR code:', err)
        setError(err.message || "Failed to load QR code")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadQRCode()
    }
  }, [id])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!qrCode) return

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      // Prepare update data
      const updateData = {
        contact: {
          ...qrCode.contact,
          message: formData.customMessage
        },
        details: {
          ...qrCode.details,
          name: formData.itemName,
          // Clear emergency details if toggle is disabled
          emergencyDetails: formData.showEmergencyDetails ? formData.emergencyDetails : '',
          // Clear pedigree info if toggle is disabled
          pedigreeInfo: formData.showPedigreeInfo ? formData.pedigreeInfo : ''
        },
        settings: {
          instantAlerts: formData.scanAlerts,
          locationSharing: formData.scanAlerts, // Using same value for simplicity
          showContactOnFinderPage: formData.showContactOnFinderPage
        }
      }

      const response = await apiClient.updateQRCode(qrCode.code, updateData)
      
      if (response.success) {
        setSuccess("QR code updated successfully!")
        // Update local state
        setQrCode(prev => prev ? { ...prev, ...response.data } : null)
        
        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(response.message || "Failed to update QR code")
      }
    } catch (err: any) {
      console.error('Error updating QR code:', err)
      setError(err.message || "Failed to update QR code")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!qrCode) return

    try {
      setSaving(true)
      const newStatus = formData.status === "active" ? "inactive" : "active"
      
      const response = await apiClient.updateQRCode(qrCode.code, {
        isActivated: newStatus === "active"
      })
      
      if (response.success) {
        setFormData(prev => ({ ...prev, status: newStatus }))
        setQrCode(prev => prev ? { ...prev, isActivated: newStatus === "active" } : null)
        setSuccess(`QR code ${newStatus === "active" ? "activated" : "deactivated"} successfully!`)
      } else {
        setError(response.message || "Failed to update QR code status")
      }
    } catch (err: any) {
      console.error('Error toggling QR code status:', err)
      setError(err.message || "Failed to update QR code status")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!qrCode) return

    try {
      setSaving(true)
      const response = await apiClient.deleteQRCode(qrCode.code)
      
      if (response.success) {
        setSuccess("QR code deleted successfully!")
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(response.message || "Failed to delete QR code")
      }
    } catch (err: any) {
      console.error('Error deleting QR code:', err)
      setError(err.message || "Failed to delete QR code")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading QR code...</p>
        </div>
      </div>
    )
  }

  if (error && !qrCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <QRLogo />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                {formData.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
              </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
              </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">{success}</p>
              </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {formData.tagType === "pet" ? (
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                ) : (
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                )}
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="itemName" className="text-sm font-medium">
                  {formData.tagType === "pet" ? "Pet Name" : "Item Name"}
                </Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  className="mt-1"
                  placeholder={formData.tagType === "pet" ? "Enter pet name" : "Enter item name"}
                />
              </div>

              <div>
                <Label htmlFor="customMessage" className="text-sm font-medium">
                  Custom Message for Finders
                </Label>
                <Textarea
                  id="customMessage"
                  value={formData.customMessage}
                  onChange={(e) => handleInputChange("customMessage", e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="Enter a message that will be shown to people who find your item..."
                />
              </div>

              {/* Pet-specific fields */}
          {formData.tagType === "pet" && (
                <>
                  <div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black">Emergency Details</Label>
                        <p className="text-xs text-gray-600 mt-1">Add medical info, special needs, or emergency contacts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange("showEmergencyDetails", !formData.showEmergencyDetails)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          formData.showEmergencyDetails ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.showEmergencyDetails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    {formData.showEmergencyDetails && (
                      <div className="mt-3">
                        <Textarea
                          value={formData.emergencyDetails}
                          onChange={(e) => handleInputChange("emergencyDetails", e.target.value)}
                          placeholder="e.g., Allergic to penicillin, needs medication twice daily, emergency vet contact..."
                          rows={3}
                      className="text-sm"
                    />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black">Pedigree Information</Label>
                        <p className="text-xs text-gray-600 mt-1">Add breeding, registration, or lineage details</p>
                  </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange("showPedigreeInfo", !formData.showPedigreeInfo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          formData.showPedigreeInfo ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.showPedigreeInfo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                </div>
                    {formData.showPedigreeInfo && (
                      <div className="mt-3">
                  <Textarea
                          value={formData.pedigreeInfo}
                          onChange={(e) => handleInputChange("pedigreeInfo", e.target.value)}
                          placeholder="e.g., AKC registered, champion bloodline, microchip #123456789..."
                    rows={3}
                          className="text-sm"
                  />
                </div>
                    )}
                </div>
                </>
              )}
              </CardContent>
            </Card>

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

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showContactOnFinderPage"
                      checked={formData.showContactOnFinderPage}
                      onCheckedChange={(checked) => handleInputChange("showContactOnFinderPage", checked as boolean)}
                    />
                    <Label htmlFor="showContactOnFinderPage" className="text-sm">
                      Show contact information on finder page
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
                      Instant scan alerts
                    </Label>
                  </div>

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
              </div>
            </CardContent>
          </Card>
                </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <div className="flex gap-3">
            <Button
              onClick={handleToggleStatus}
              variant={formData.status === "active" ? "destructive" : "default"}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Power className="h-4 w-4 mr-2" />
              )}
                  {formData.status === "active" ? "Deactivate" : "Activate"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={saving}>
                    <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                  </Button>
                </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your QR code.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}