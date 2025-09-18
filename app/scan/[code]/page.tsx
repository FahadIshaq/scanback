"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, AlertCircle, Heart, Package } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface QRData {
    code: string
  type: 'item' | 'pet'
  isActivated: boolean
  details: {
    name: string
    description?: string
    category?: string
    color?: string
    brand?: string
    model?: string
    species?: string
    breed?: string
    age?: string
  }
  contact: {
    name: string
    email: string
    phone: string
    message?: string
  }
  settings?: {
    instantAlerts: boolean
    locationSharing: boolean
  }
  status: string
  createdAt: string
}

export default function ScanPage() {
  const params = useParams()
  const code = params.code as string
  
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tempPassword, setTempPassword] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [existingPassword, setExistingPassword] = useState("")

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
      backupPhone: "",
      countryCode: "+27",
      backupCountryCode: "+27",
      message: ""
    },
    settings: {
      instantAlerts: true,
      locationSharing: true
    }
  })

  useEffect(() => {
    if (code) {
      loadQRCode()
    }
  }, [code])

  const loadQRCode = async () => {
    try {
      const response = await apiClient.getQRCode(code)
      if (response.success) {
        setQrData(response.data)
      } else {
        setError(response.message || "QR code not found")
      }
    } catch (error: any) {
      setError(error.message || "Failed to load QR code")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
    setSubmitting(true)
    setError("")

    try {
      // Combine country code with phone number
      const submissionData = {
        ...formData,
        contact: {
          ...formData.contact,
          phone: `${formData.contact.countryCode}${formData.contact.phone}`,
          backupPhone: formData.contact.backupPhone ? `${formData.contact.backupCountryCode}${formData.contact.backupPhone}` : undefined
        }
      }

      const response = await apiClient.activateQRCode(code, submissionData)
      
      if (response.success) {
        setSuccess(true)
        setTempPassword(response.data.tempPassword || "")
        setUserEmail(response.data.user.email)
        setIsNewUser(response.data.isNewUser || false)
        setExistingPassword(response.data.user.existingPassword || "")
      } else {
        setError(response.message || "Failed to activate QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to activate QR code")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR code...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="font-semibold text-blue-600">ScanBack</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="font-semibold text-blue-600">ScanBack</span>
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
            Your QR tag has been registered and is now active
          </p>
          
          {isNewUser && tempPassword ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Login Credentials:</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> {userEmail}
                </p>
                <p className="text-gray-700">
                  <strong>Temporary Password:</strong> 
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-2">{tempPassword}</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Check your email for confirmation. Use these credentials to login and manage your items.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Welcome Back!</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong> {userEmail}
                </p>
                <p className="text-gray-700">
                  <strong>Password:</strong> 
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-2">{existingPassword}</span>
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Your new QR code has been added to your existing account. Use these credentials to login and manage all your items.
              </p>
            </div>
          )}

          {/* QR Tag Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your QR Tag</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Tag Code:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">SB-{code?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="text-sm text-gray-900">{qrData?.type === 'pet' ? 'Pet' : 'Item'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Name:</span>
                <span className="text-sm text-gray-900">"{formData.details.name}"</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Contact Methods:</span>
                <span className="text-sm text-gray-900">Phone, Email</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">Finder Message:</span>
                <span className="text-sm text-gray-900 text-right max-w-xs">
                  {formData.contact.message || `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If QR code is already activated, show the information display
  if (qrData && qrData.isActivated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <span className="font-semibold text-blue-600">ScanBack</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {qrData.type === 'pet' ? (
                <Heart className="h-8 w-8 text-blue-600" />
              ) : (
                <Package className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Found {qrData.type === 'pet' ? 'Pet' : 'Item'}
            </h1>
            <p className="text-gray-600">
              This {qrData.type === 'pet' ? 'pet' : 'item'} belongs to someone. Help return it!
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {qrData.type === 'pet' ? (
                  <Heart className="h-5 w-5 text-orange-500" />
                ) : (
                  <Package className="h-5 w-5 text-blue-500" />
                )}
                {qrData.details.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Item/Pet Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Details</h3>
                
                {qrData.details.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <p className="text-gray-600">{qrData.details.description}</p>
                  </div>
                )}

                {qrData.type === 'item' ? (
                  <div className="grid grid-cols-2 gap-4">
                    {qrData.details.category && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Category</Label>
                        <p className="text-gray-600">{qrData.details.category}</p>
                      </div>
                    )}
                    {qrData.details.color && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Color</Label>
                        <p className="text-gray-600">{qrData.details.color}</p>
                      </div>
                    )}
                    {qrData.details.brand && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Brand</Label>
                        <p className="text-gray-600">{qrData.details.brand}</p>
                      </div>
                    )}
                    {qrData.details.model && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Model</Label>
                        <p className="text-gray-600">{qrData.details.model}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {qrData.details.species && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Species</Label>
                        <p className="text-gray-600">{qrData.details.species}</p>
                      </div>
                    )}
                    {qrData.details.breed && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Breed</Label>
                        <p className="text-gray-600">{qrData.details.breed}</p>
                      </div>
                    )}
                    {qrData.details.age && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Age</Label>
                        <p className="text-gray-600">{qrData.details.age} years old</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Owner</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-blue-900">Owner Name</Label>
                      <p className="text-blue-800 font-medium">{qrData.contact.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-blue-900">Phone Number</Label>
                      <p className="text-blue-800 font-medium">
                        <a href={`tel:${qrData.contact.phone}`} className="hover:underline">
                          {qrData.contact.phone}
                        </a>
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-blue-900">Email</Label>
                      <p className="text-blue-800 font-medium">
                        <a href={`mailto:${qrData.contact.email}`} className="hover:underline">
                          {qrData.contact.email}
                        </a>
                      </p>
                    </div>
                    
                    {qrData.contact.message && (
                      <div>
                        <Label className="text-sm font-medium text-blue-900">Message from Owner</Label>
                        <p className="text-blue-800 italic">"{qrData.contact.message}"</p>
                      </div>
                    )}
                    
                    {/* Instant Alerts Status */}
                    {qrData.settings?.instantAlerts && (
                      <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-600">💬</span>
                        <span className="text-sm text-green-800 font-medium">WhatsApp messaging available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <a href={`tel:${qrData.contact.phone}`}>
                      📞 Call Owner
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`mailto:${qrData.contact.email}`}>
                      ✉️ Email Owner
                    </a>
                  </Button>
                </div>
                
               
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <a 
                      href={`https://wa.me/${qrData.contact.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                        `Hi ${qrData.contact.name}! I found your ${qrData.type === 'pet' ? 'pet' : 'item'} "${qrData.details.name}". ${qrData.contact.message || 'Please let me know how to return it to you. Thank you!'}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>💬</span>
                      <span>Message on WhatsApp</span>
                    </a>
                  </Button>
              
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Thank you for helping return this {qrData.type === 'pet' ? 'pet' : 'item'} to its owner!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-blue-600">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-blue-600">ScanBack</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {qrData?.type === 'pet' ? (
              <Heart className="h-8 w-8 text-blue-600" />
            ) : (
              <Package className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Activate Your Tag
          </h1>
          <p className="text-gray-600">
            Fill in the details below to activate your QR tag
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contact.name}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2 mt-1">
                    <Select value={formData.contact.countryCode} onValueChange={(value) => handleInputChange('contact.countryCode', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
  <SelectItem value="+93">🇦🇫 Afghanistan +93</SelectItem>
  <SelectItem value="+355">🇦🇱 Albania +355</SelectItem>
  <SelectItem value="+213">🇩🇿 Algeria +213</SelectItem>
  <SelectItem value="+376">🇦🇩 Andorra +376</SelectItem>
  <SelectItem value="+244">🇦🇴 Angola +244</SelectItem>
  <SelectItem value="+1-268">🇦🇬 Antigua and Barbuda +1-268</SelectItem>
  <SelectItem value="+54">🇦🇷 Argentina +54</SelectItem>
  <SelectItem value="+374">🇦🇲 Armenia +374</SelectItem>
  <SelectItem value="+61">🇦🇺 Australia +61</SelectItem>
  <SelectItem value="+43">🇦🇹 Austria +43</SelectItem>
  <SelectItem value="+994">🇦🇿 Azerbaijan +994</SelectItem>
  <SelectItem value="+1-242">🇧🇸 Bahamas +1-242</SelectItem>
  <SelectItem value="+973">🇧🇭 Bahrain +973</SelectItem>
  <SelectItem value="+880">🇧🇩 Bangladesh +880</SelectItem>
  <SelectItem value="+1-246">🇧🇧 Barbados +1-246</SelectItem>
  <SelectItem value="+375">🇧🇾 Belarus +375</SelectItem>
  <SelectItem value="+32">🇧🇪 Belgium +32</SelectItem>
  <SelectItem value="+501">🇧🇿 Belize +501</SelectItem>
  <SelectItem value="+229">🇧🇯 Benin +229</SelectItem>
  <SelectItem value="+975">🇧🇹 Bhutan +975</SelectItem>
  <SelectItem value="+591">🇧🇴 Bolivia +591</SelectItem>
  <SelectItem value="+387">🇧🇦 Bosnia and Herzegovina +387</SelectItem>
  <SelectItem value="+267">🇧🇼 Botswana +267</SelectItem>
  <SelectItem value="+55">🇧🇷 Brazil +55</SelectItem>
  <SelectItem value="+673">🇧🇳 Brunei +673</SelectItem>
  <SelectItem value="+359">🇧🇬 Bulgaria +359</SelectItem>
  <SelectItem value="+226">🇧🇫 Burkina Faso +226</SelectItem>
  <SelectItem value="+257">🇧🇮 Burundi +257</SelectItem>
  <SelectItem value="+855">🇰🇭 Cambodia +855</SelectItem>
  <SelectItem value="+237">🇨🇲 Cameroon +237</SelectItem>
  <SelectItem value="+1">🇨🇦 Canada +1</SelectItem>
  <SelectItem value="+238">🇨🇻 Cape Verde +238</SelectItem>
  <SelectItem value="+236">🇨🇫 Central African Republic +236</SelectItem>
  <SelectItem value="+235">🇹🇩 Chad +235</SelectItem>
  <SelectItem value="+56">🇨🇱 Chile +56</SelectItem>
  <SelectItem value="+86">🇨🇳 China +86</SelectItem>
  <SelectItem value="+57">🇨🇴 Colombia +57</SelectItem>
  <SelectItem value="+269">🇰🇲 Comoros +269</SelectItem>
  <SelectItem value="+506">🇨🇷 Costa Rica +506</SelectItem>
  <SelectItem value="+385">🇭🇷 Croatia +385</SelectItem>
  <SelectItem value="+53">🇨🇺 Cuba +53</SelectItem>
  <SelectItem value="+357">🇨🇾 Cyprus +357</SelectItem>
  <SelectItem value="+420">🇨🇿 Czech Republic +420</SelectItem>
  <SelectItem value="+243">🇨🇩 DR Congo +243</SelectItem>
  <SelectItem value="+45">🇩🇰 Denmark +45</SelectItem>
  <SelectItem value="+253">🇩🇯 Djibouti +253</SelectItem>
  <SelectItem value="+1-767">🇩🇲 Dominica +1-767</SelectItem>
  <SelectItem value="+1-809">🇩🇴 Dominican Republic +1-809</SelectItem>
  <SelectItem value="+593">🇪🇨 Ecuador +593</SelectItem>
  <SelectItem value="+20">🇪🇬 Egypt +20</SelectItem>
  <SelectItem value="+503">🇸🇻 El Salvador +503</SelectItem>
  <SelectItem value="+240">🇬🇶 Equatorial Guinea +240</SelectItem>
  <SelectItem value="+291">🇪🇷 Eritrea +291</SelectItem>
  <SelectItem value="+372">🇪🇪 Estonia +372</SelectItem>
  <SelectItem value="+251">🇪🇹 Ethiopia +251</SelectItem>
  <SelectItem value="+679">🇫🇯 Fiji +679</SelectItem>
  <SelectItem value="+358">🇫🇮 Finland +358</SelectItem>
  <SelectItem value="+33">🇫🇷 France +33</SelectItem>
  <SelectItem value="+241">🇬🇦 Gabon +241</SelectItem>
  <SelectItem value="+220">🇬🇲 Gambia +220</SelectItem>
  <SelectItem value="+995">🇬🇪 Georgia +995</SelectItem>
  <SelectItem value="+49">🇩🇪 Germany +49</SelectItem>
  <SelectItem value="+233">🇬🇭 Ghana +233</SelectItem>
  <SelectItem value="+30">🇬🇷 Greece +30</SelectItem>
  <SelectItem value="+1-473">🇬🇩 Grenada +1-473</SelectItem>
  <SelectItem value="+502">🇬🇹 Guatemala +502</SelectItem>
  <SelectItem value="+224">🇬🇳 Guinea +224</SelectItem>
  <SelectItem value="+245">🇬🇼 Guinea-Bissau +245</SelectItem>
  <SelectItem value="+592">🇬🇾 Guyana +592</SelectItem>
  <SelectItem value="+509">🇭🇹 Haiti +509</SelectItem>
  <SelectItem value="+504">🇭🇳 Honduras +504</SelectItem>
  <SelectItem value="+36">🇭🇺 Hungary +36</SelectItem>
  <SelectItem value="+354">🇮🇸 Iceland +354</SelectItem>
  <SelectItem value="+91">🇮🇳 India +91</SelectItem>
  <SelectItem value="+62">🇮🇩 Indonesia +62</SelectItem>
  <SelectItem value="+98">🇮🇷 Iran +98</SelectItem>
  <SelectItem value="+964">🇮🇶 Iraq +964</SelectItem>
  <SelectItem value="+353">🇮🇪 Ireland +353</SelectItem>
  <SelectItem value="+972">🇮🇱 Israel +972</SelectItem>
  <SelectItem value="+39">🇮🇹 Italy +39</SelectItem>
  <SelectItem value="+1-876">🇯🇲 Jamaica +1-876</SelectItem>
  <SelectItem value="+81">🇯🇵 Japan +81</SelectItem>
  <SelectItem value="+962">🇯🇴 Jordan +962</SelectItem>
  <SelectItem value="+7">🇰🇿 Kazakhstan +7</SelectItem>
  <SelectItem value="+254">🇰🇪 Kenya +254</SelectItem>
  <SelectItem value="+686">🇰🇮 Kiribati +686</SelectItem>
  <SelectItem value="+965">🇰🇼 Kuwait +965</SelectItem>
  <SelectItem value="+996">🇰🇬 Kyrgyzstan +996</SelectItem>
  <SelectItem value="+856">🇱🇦 Laos +856</SelectItem>
  <SelectItem value="+371">🇱🇻 Latvia +371</SelectItem>
  <SelectItem value="+961">🇱🇧 Lebanon +961</SelectItem>
  <SelectItem value="+266">🇱🇸 Lesotho +266</SelectItem>
  <SelectItem value="+231">🇱🇷 Liberia +231</SelectItem>
  <SelectItem value="+218">🇱🇾 Libya +218</SelectItem>
  <SelectItem value="+423">🇱🇮 Liechtenstein +423</SelectItem>
  <SelectItem value="+370">🇱🇹 Lithuania +370</SelectItem>
  <SelectItem value="+352">🇱🇺 Luxembourg +352</SelectItem>
  <SelectItem value="+853">🇲🇴 Macao +853</SelectItem>
  <SelectItem value="+389">🇲🇰 North Macedonia +389</SelectItem>
  <SelectItem value="+261">🇲🇬 Madagascar +261</SelectItem>
  <SelectItem value="+265">🇲🇼 Malawi +265</SelectItem>
  <SelectItem value="+60">🇲🇾 Malaysia +60</SelectItem>
  <SelectItem value="+960">🇲🇻 Maldives +960</SelectItem>
  <SelectItem value="+223">🇲🇱 Mali +223</SelectItem>
  <SelectItem value="+356">🇲🇹 Malta +356</SelectItem>
  <SelectItem value="+692">🇲🇭 Marshall Islands +692</SelectItem>
  <SelectItem value="+222">🇲🇷 Mauritania +222</SelectItem>
  <SelectItem value="+230">🇲🇺 Mauritius +230</SelectItem>
  <SelectItem value="+52">🇲🇽 Mexico +52</SelectItem>
  <SelectItem value="+691">🇫🇲 Micronesia +691</SelectItem>
  <SelectItem value="+373">🇲🇩 Moldova +373</SelectItem>
  <SelectItem value="+377">🇲🇨 Monaco +377</SelectItem>
  <SelectItem value="+976">🇲🇳 Mongolia +976</SelectItem>
  <SelectItem value="+382">🇲🇪 Montenegro +382</SelectItem>
  <SelectItem value="+212">🇲🇦 Morocco +212</SelectItem>
  <SelectItem value="+258">🇲🇿 Mozambique +258</SelectItem>
  <SelectItem value="+95">🇲🇲 Myanmar +95</SelectItem>
  <SelectItem value="+264">🇳🇦 Namibia +264</SelectItem>
  <SelectItem value="+674">🇳🇷 Nauru +674</SelectItem>
  <SelectItem value="+977">🇳🇵 Nepal +977</SelectItem>
  <SelectItem value="+31">🇳🇱 Netherlands +31</SelectItem>
  <SelectItem value="+64">🇳🇿 New Zealand +64</SelectItem>
  <SelectItem value="+505">🇳🇮 Nicaragua +505</SelectItem>
  <SelectItem value="+227">🇳🇪 Niger +227</SelectItem>
  <SelectItem value="+234">🇳🇬 Nigeria +234</SelectItem>
  <SelectItem value="+850">🇰🇵 North Korea +850</SelectItem>
  <SelectItem value="+47">🇳🇴 Norway +47</SelectItem>
  <SelectItem value="+968">🇴🇲 Oman +968</SelectItem>
  <SelectItem value="+92">🇵🇰 Pakistan +92</SelectItem>
  <SelectItem value="+680">🇵🇼 Palau +680</SelectItem>
  <SelectItem value="+970">🇵🇸 Palestine +970</SelectItem>
  <SelectItem value="+507">🇵🇦 Panama +507</SelectItem>
  <SelectItem value="+675">🇵🇬 Papua New Guinea +675</SelectItem>
  <SelectItem value="+595">🇵🇾 Paraguay +595</SelectItem>
  <SelectItem value="+51">🇵🇪 Peru +51</SelectItem>
  <SelectItem value="+63">🇵🇭 Philippines +63</SelectItem>
  <SelectItem value="+48">🇵🇱 Poland +48</SelectItem>
  <SelectItem value="+351">🇵🇹 Portugal +351</SelectItem>
  <SelectItem value="+974">🇶🇦 Qatar +974</SelectItem>
  <SelectItem value="+40">🇷🇴 Romania +40</SelectItem>
  <SelectItem value="+7">🇷🇺 Russia +7</SelectItem>
  <SelectItem value="+250">🇷🇼 Rwanda +250</SelectItem>
  <SelectItem value="+590">🇧🇱 Saint Barthélemy +590</SelectItem>
  <SelectItem value="+1-869">🇰🇳 Saint Kitts and Nevis +1-869</SelectItem>
  <SelectItem value="+1-758">🇱🇨 Saint Lucia +1-758</SelectItem>
  <SelectItem value="+590">🇲🇫 Saint Martin +590</SelectItem>
  <SelectItem value="+508">🇵🇲 Saint Pierre and Miquelon +508</SelectItem>
  <SelectItem value="+1-784">🇻🇨 Saint Vincent and the Grenadines +1-784</SelectItem>
  <SelectItem value="+685">🇼🇸 Samoa +685</SelectItem>
  <SelectItem value="+378">🇸🇲 San Marino +378</SelectItem>
  <SelectItem value="+239">🇸🇹 Sao Tome and Principe +239</SelectItem>
  <SelectItem value="+966">🇸🇦 Saudi Arabia +966</SelectItem>
  <SelectItem value="+221">🇸🇳 Senegal +221</SelectItem>
  <SelectItem value="+381">🇷🇸 Serbia +381</SelectItem>
  <SelectItem value="+248">🇸🇨 Seychelles +248</SelectItem>
  <SelectItem value="+232">🇸🇱 Sierra Leone +232</SelectItem>
  <SelectItem value="+65">🇸🇬 Singapore +65</SelectItem>
  <SelectItem value="+421">🇸🇰 Slovakia +421</SelectItem>
  <SelectItem value="+386">🇸🇮 Slovenia +386</SelectItem>
  <SelectItem value="+677">🇸🇧 Solomon Islands +677</SelectItem>
  <SelectItem value="+252">🇸🇴 Somalia +252</SelectItem>
  <SelectItem value="+27">🇿🇦 South Africa +27</SelectItem>
  <SelectItem value="+82">🇰🇷 South Korea +82</SelectItem>
  <SelectItem value="+34">🇪🇸 Spain +34</SelectItem>
  <SelectItem value="+94">🇱🇰 Sri Lanka +94</SelectItem>
  <SelectItem value="+249">🇸🇩 Sudan +249</SelectItem>
  <SelectItem value="+597">🇸🇷 Suriname +597</SelectItem>
  <SelectItem value="+268">🇸🇿 Eswatini +268</SelectItem>
  <SelectItem value="+46">🇸🇪 Sweden +46</SelectItem>
  <SelectItem value="+41">🇨🇭 Switzerland +41</SelectItem>
  <SelectItem value="+963">🇸🇾 Syria +963</SelectItem>
  <SelectItem value="+886">🇹🇼 Taiwan +886</SelectItem>
  <SelectItem value="+992">🇹🇯 Tajikistan +992</SelectItem>
  <SelectItem value="+255">🇹🇿 Tanzania +255</SelectItem>
  <SelectItem value="+66">🇹🇭 Thailand +66</SelectItem>
  <SelectItem value="+228">🇹🇬 Togo +228</SelectItem>
  <SelectItem value="+676">🇹🇴 Tonga +676</SelectItem>
  <SelectItem value="+1-868">🇹🇹 Trinidad and Tobago +1-868</SelectItem>
  <SelectItem value="+216">🇹🇳 Tunisia +216</SelectItem>
  <SelectItem value="+90">🇹🇷 Turkey +90</SelectItem>
  <SelectItem value="+993">🇹🇲 Turkmenistan +993</SelectItem>
  <SelectItem value="+688">🇹🇻 Tuvalu +688</SelectItem>
  <SelectItem value="+256">🇺🇬 Uganda +256</SelectItem>
  <SelectItem value="+380">🇺🇦 Ukraine +380</SelectItem>
  <SelectItem value="+971">🇦🇪 United Arab Emirates +971</SelectItem>
  <SelectItem value="+44">🇬🇧 United Kingdom +44</SelectItem>
  <SelectItem value="+1">🇺🇸 United States +1</SelectItem>
  <SelectItem value="+598">🇺🇾 Uruguay +598</SelectItem>
  <SelectItem value="+998">🇺🇿 Uzbekistan +998</SelectItem>
  <SelectItem value="+678">🇻🇺 Vanuatu +678</SelectItem>
  <SelectItem value="+379">🇻🇦 Vatican City +379</SelectItem>
  <SelectItem value="+58">🇻🇪 Venezuela +58</SelectItem>
  <SelectItem value="+84">🇻🇳 Vietnam +84</SelectItem>
  <SelectItem value="+967">🇾🇪 Yemen +967</SelectItem>
  <SelectItem value="+260">🇿🇲 Zambia +260</SelectItem>
  <SelectItem value="+263">🇿🇼 Zimbabwe +263</SelectItem>
</SelectContent>

                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.contact.phone}
                      onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                      placeholder="82 123 4567"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                  <div>
                  <Label htmlFor="backupPhone">+ Backup Phone Number (Optional)</Label>
                  <div className="flex gap-2 mt-1">
                    <Select value={formData.contact.backupCountryCode} onValueChange={(value) => handleInputChange('contact.backupCountryCode', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
  <SelectItem value="+93">🇦🇫 Afghanistan +93</SelectItem>
  <SelectItem value="+355">🇦🇱 Albania +355</SelectItem>
  <SelectItem value="+213">🇩🇿 Algeria +213</SelectItem>
  <SelectItem value="+376">🇦🇩 Andorra +376</SelectItem>
  <SelectItem value="+244">🇦🇴 Angola +244</SelectItem>
  <SelectItem value="+1-268">🇦🇬 Antigua and Barbuda +1-268</SelectItem>
  <SelectItem value="+54">🇦🇷 Argentina +54</SelectItem>
  <SelectItem value="+374">🇦🇲 Armenia +374</SelectItem>
  <SelectItem value="+61">🇦🇺 Australia +61</SelectItem>
  <SelectItem value="+43">🇦🇹 Austria +43</SelectItem>
  <SelectItem value="+994">🇦🇿 Azerbaijan +994</SelectItem>
  <SelectItem value="+1-242">🇧🇸 Bahamas +1-242</SelectItem>
  <SelectItem value="+973">🇧🇭 Bahrain +973</SelectItem>
  <SelectItem value="+880">🇧🇩 Bangladesh +880</SelectItem>
  <SelectItem value="+1-246">🇧🇧 Barbados +1-246</SelectItem>
  <SelectItem value="+375">🇧🇾 Belarus +375</SelectItem>
  <SelectItem value="+32">🇧🇪 Belgium +32</SelectItem>
  <SelectItem value="+501">🇧🇿 Belize +501</SelectItem>
  <SelectItem value="+229">🇧🇯 Benin +229</SelectItem>
  <SelectItem value="+975">🇧🇹 Bhutan +975</SelectItem>
  <SelectItem value="+591">🇧🇴 Bolivia +591</SelectItem>
  <SelectItem value="+387">🇧🇦 Bosnia and Herzegovina +387</SelectItem>
  <SelectItem value="+267">🇧🇼 Botswana +267</SelectItem>
  <SelectItem value="+55">🇧🇷 Brazil +55</SelectItem>
  <SelectItem value="+673">🇧🇳 Brunei +673</SelectItem>
  <SelectItem value="+359">🇧🇬 Bulgaria +359</SelectItem>
  <SelectItem value="+226">🇧🇫 Burkina Faso +226</SelectItem>
  <SelectItem value="+257">🇧🇮 Burundi +257</SelectItem>
  <SelectItem value="+855">🇰🇭 Cambodia +855</SelectItem>
  <SelectItem value="+237">🇨🇲 Cameroon +237</SelectItem>
  <SelectItem value="+1">🇨🇦 Canada +1</SelectItem>
  <SelectItem value="+238">🇨🇻 Cape Verde +238</SelectItem>
  <SelectItem value="+236">🇨🇫 Central African Republic +236</SelectItem>
  <SelectItem value="+235">🇹🇩 Chad +235</SelectItem>
  <SelectItem value="+56">🇨🇱 Chile +56</SelectItem>
  <SelectItem value="+86">🇨🇳 China +86</SelectItem>
  <SelectItem value="+57">🇨🇴 Colombia +57</SelectItem>
  <SelectItem value="+269">🇰🇲 Comoros +269</SelectItem>
  <SelectItem value="+506">🇨🇷 Costa Rica +506</SelectItem>
  <SelectItem value="+385">🇭🇷 Croatia +385</SelectItem>
  <SelectItem value="+53">🇨🇺 Cuba +53</SelectItem>
  <SelectItem value="+357">🇨🇾 Cyprus +357</SelectItem>
  <SelectItem value="+420">🇨🇿 Czech Republic +420</SelectItem>
  <SelectItem value="+243">🇨🇩 DR Congo +243</SelectItem>
  <SelectItem value="+45">🇩🇰 Denmark +45</SelectItem>
  <SelectItem value="+253">🇩🇯 Djibouti +253</SelectItem>
  <SelectItem value="+1-767">🇩🇲 Dominica +1-767</SelectItem>
  <SelectItem value="+1-809">🇩🇴 Dominican Republic +1-809</SelectItem>
  <SelectItem value="+593">🇪🇨 Ecuador +593</SelectItem>
  <SelectItem value="+20">🇪🇬 Egypt +20</SelectItem>
  <SelectItem value="+503">🇸🇻 El Salvador +503</SelectItem>
  <SelectItem value="+240">🇬🇶 Equatorial Guinea +240</SelectItem>
  <SelectItem value="+291">🇪🇷 Eritrea +291</SelectItem>
  <SelectItem value="+372">🇪🇪 Estonia +372</SelectItem>
  <SelectItem value="+251">🇪🇹 Ethiopia +251</SelectItem>
  <SelectItem value="+679">🇫🇯 Fiji +679</SelectItem>
  <SelectItem value="+358">🇫🇮 Finland +358</SelectItem>
  <SelectItem value="+33">🇫🇷 France +33</SelectItem>
  <SelectItem value="+241">🇬🇦 Gabon +241</SelectItem>
  <SelectItem value="+220">🇬🇲 Gambia +220</SelectItem>
  <SelectItem value="+995">🇬🇪 Georgia +995</SelectItem>
  <SelectItem value="+49">🇩🇪 Germany +49</SelectItem>
  <SelectItem value="+233">🇬🇭 Ghana +233</SelectItem>
  <SelectItem value="+30">🇬🇷 Greece +30</SelectItem>
  <SelectItem value="+1-473">🇬🇩 Grenada +1-473</SelectItem>
  <SelectItem value="+502">🇬🇹 Guatemala +502</SelectItem>
  <SelectItem value="+224">🇬🇳 Guinea +224</SelectItem>
  <SelectItem value="+245">🇬🇼 Guinea-Bissau +245</SelectItem>
  <SelectItem value="+592">🇬🇾 Guyana +592</SelectItem>
  <SelectItem value="+509">🇭🇹 Haiti +509</SelectItem>
  <SelectItem value="+504">🇭🇳 Honduras +504</SelectItem>
  <SelectItem value="+36">🇭🇺 Hungary +36</SelectItem>
  <SelectItem value="+354">🇮🇸 Iceland +354</SelectItem>
  <SelectItem value="+91">🇮🇳 India +91</SelectItem>
  <SelectItem value="+62">🇮🇩 Indonesia +62</SelectItem>
  <SelectItem value="+98">🇮🇷 Iran +98</SelectItem>
  <SelectItem value="+964">🇮🇶 Iraq +964</SelectItem>
  <SelectItem value="+353">🇮🇪 Ireland +353</SelectItem>
  <SelectItem value="+972">🇮🇱 Israel +972</SelectItem>
  <SelectItem value="+39">🇮🇹 Italy +39</SelectItem>
  <SelectItem value="+1-876">🇯🇲 Jamaica +1-876</SelectItem>
  <SelectItem value="+81">🇯🇵 Japan +81</SelectItem>
  <SelectItem value="+962">🇯🇴 Jordan +962</SelectItem>
  <SelectItem value="+7">🇰🇿 Kazakhstan +7</SelectItem>
  <SelectItem value="+254">🇰🇪 Kenya +254</SelectItem>
  <SelectItem value="+686">🇰🇮 Kiribati +686</SelectItem>
  <SelectItem value="+965">🇰🇼 Kuwait +965</SelectItem>
  <SelectItem value="+996">🇰🇬 Kyrgyzstan +996</SelectItem>
  <SelectItem value="+856">🇱🇦 Laos +856</SelectItem>
  <SelectItem value="+371">🇱🇻 Latvia +371</SelectItem>
  <SelectItem value="+961">🇱🇧 Lebanon +961</SelectItem>
  <SelectItem value="+266">🇱🇸 Lesotho +266</SelectItem>
  <SelectItem value="+231">🇱🇷 Liberia +231</SelectItem>
  <SelectItem value="+218">🇱🇾 Libya +218</SelectItem>
  <SelectItem value="+423">🇱🇮 Liechtenstein +423</SelectItem>
  <SelectItem value="+370">🇱🇹 Lithuania +370</SelectItem>
  <SelectItem value="+352">🇱🇺 Luxembourg +352</SelectItem>
  <SelectItem value="+853">🇲🇴 Macao +853</SelectItem>
  <SelectItem value="+389">🇲🇰 North Macedonia +389</SelectItem>
  <SelectItem value="+261">🇲🇬 Madagascar +261</SelectItem>
  <SelectItem value="+265">🇲🇼 Malawi +265</SelectItem>
  <SelectItem value="+60">🇲🇾 Malaysia +60</SelectItem>
  <SelectItem value="+960">🇲🇻 Maldives +960</SelectItem>
  <SelectItem value="+223">🇲🇱 Mali +223</SelectItem>
  <SelectItem value="+356">🇲🇹 Malta +356</SelectItem>
  <SelectItem value="+692">🇲🇭 Marshall Islands +692</SelectItem>
  <SelectItem value="+222">🇲🇷 Mauritania +222</SelectItem>
  <SelectItem value="+230">🇲🇺 Mauritius +230</SelectItem>
  <SelectItem value="+52">🇲🇽 Mexico +52</SelectItem>
  <SelectItem value="+691">🇫🇲 Micronesia +691</SelectItem>
  <SelectItem value="+373">🇲🇩 Moldova +373</SelectItem>
  <SelectItem value="+377">🇲🇨 Monaco +377</SelectItem>
  <SelectItem value="+976">🇲🇳 Mongolia +976</SelectItem>
  <SelectItem value="+382">🇲🇪 Montenegro +382</SelectItem>
  <SelectItem value="+212">🇲🇦 Morocco +212</SelectItem>
  <SelectItem value="+258">🇲🇿 Mozambique +258</SelectItem>
  <SelectItem value="+95">🇲🇲 Myanmar +95</SelectItem>
  <SelectItem value="+264">🇳🇦 Namibia +264</SelectItem>
  <SelectItem value="+674">🇳🇷 Nauru +674</SelectItem>
  <SelectItem value="+977">🇳🇵 Nepal +977</SelectItem>
  <SelectItem value="+31">🇳🇱 Netherlands +31</SelectItem>
  <SelectItem value="+64">🇳🇿 New Zealand +64</SelectItem>
  <SelectItem value="+505">🇳🇮 Nicaragua +505</SelectItem>
  <SelectItem value="+227">🇳🇪 Niger +227</SelectItem>
  <SelectItem value="+234">🇳🇬 Nigeria +234</SelectItem>
  <SelectItem value="+850">🇰🇵 North Korea +850</SelectItem>
  <SelectItem value="+47">🇳🇴 Norway +47</SelectItem>
  <SelectItem value="+968">🇴🇲 Oman +968</SelectItem>
  <SelectItem value="+92">🇵🇰 Pakistan +92</SelectItem>
  <SelectItem value="+680">🇵🇼 Palau +680</SelectItem>
  <SelectItem value="+970">🇵🇸 Palestine +970</SelectItem>
  <SelectItem value="+507">🇵🇦 Panama +507</SelectItem>
  <SelectItem value="+675">🇵🇬 Papua New Guinea +675</SelectItem>
  <SelectItem value="+595">🇵🇾 Paraguay +595</SelectItem>
  <SelectItem value="+51">🇵🇪 Peru +51</SelectItem>
  <SelectItem value="+63">🇵🇭 Philippines +63</SelectItem>
  <SelectItem value="+48">🇵🇱 Poland +48</SelectItem>
  <SelectItem value="+351">🇵🇹 Portugal +351</SelectItem>
  <SelectItem value="+974">🇶🇦 Qatar +974</SelectItem>
  <SelectItem value="+40">🇷🇴 Romania +40</SelectItem>
  <SelectItem value="+7">🇷🇺 Russia +7</SelectItem>
  <SelectItem value="+250">🇷🇼 Rwanda +250</SelectItem>
  <SelectItem value="+590">🇧🇱 Saint Barthélemy +590</SelectItem>
  <SelectItem value="+1-869">🇰🇳 Saint Kitts and Nevis +1-869</SelectItem>
  <SelectItem value="+1-758">🇱🇨 Saint Lucia +1-758</SelectItem>
  <SelectItem value="+590">🇲🇫 Saint Martin +590</SelectItem>
  <SelectItem value="+508">🇵🇲 Saint Pierre and Miquelon +508</SelectItem>
  <SelectItem value="+1-784">🇻🇨 Saint Vincent and the Grenadines +1-784</SelectItem>
  <SelectItem value="+685">🇼🇸 Samoa +685</SelectItem>
  <SelectItem value="+378">🇸🇲 San Marino +378</SelectItem>
  <SelectItem value="+239">🇸🇹 Sao Tome and Principe +239</SelectItem>
  <SelectItem value="+966">🇸🇦 Saudi Arabia +966</SelectItem>
  <SelectItem value="+221">🇸🇳 Senegal +221</SelectItem>
  <SelectItem value="+381">🇷🇸 Serbia +381</SelectItem>
  <SelectItem value="+248">🇸🇨 Seychelles +248</SelectItem>
  <SelectItem value="+232">🇸🇱 Sierra Leone +232</SelectItem>
  <SelectItem value="+65">🇸🇬 Singapore +65</SelectItem>
  <SelectItem value="+421">🇸🇰 Slovakia +421</SelectItem>
  <SelectItem value="+386">🇸🇮 Slovenia +386</SelectItem>
  <SelectItem value="+677">🇸🇧 Solomon Islands +677</SelectItem>
  <SelectItem value="+252">🇸🇴 Somalia +252</SelectItem>
  <SelectItem value="+27">🇿🇦 South Africa +27</SelectItem>
  <SelectItem value="+82">🇰🇷 South Korea +82</SelectItem>
  <SelectItem value="+34">🇪🇸 Spain +34</SelectItem>
  <SelectItem value="+94">🇱🇰 Sri Lanka +94</SelectItem>
  <SelectItem value="+249">🇸🇩 Sudan +249</SelectItem>
  <SelectItem value="+597">🇸🇷 Suriname +597</SelectItem>
  <SelectItem value="+268">🇸🇿 Eswatini +268</SelectItem>
  <SelectItem value="+46">🇸🇪 Sweden +46</SelectItem>
  <SelectItem value="+41">🇨🇭 Switzerland +41</SelectItem>
  <SelectItem value="+963">🇸🇾 Syria +963</SelectItem>
  <SelectItem value="+886">🇹🇼 Taiwan +886</SelectItem>
  <SelectItem value="+992">🇹🇯 Tajikistan +992</SelectItem>
  <SelectItem value="+255">🇹🇿 Tanzania +255</SelectItem>
  <SelectItem value="+66">🇹🇭 Thailand +66</SelectItem>
  <SelectItem value="+228">🇹🇬 Togo +228</SelectItem>
  <SelectItem value="+676">🇹🇴 Tonga +676</SelectItem>
  <SelectItem value="+1-868">🇹🇹 Trinidad and Tobago +1-868</SelectItem>
  <SelectItem value="+216">🇹🇳 Tunisia +216</SelectItem>
  <SelectItem value="+90">🇹🇷 Turkey +90</SelectItem>
  <SelectItem value="+993">🇹🇲 Turkmenistan +993</SelectItem>
  <SelectItem value="+688">🇹🇻 Tuvalu +688</SelectItem>
  <SelectItem value="+256">🇺🇬 Uganda +256</SelectItem>
  <SelectItem value="+380">🇺🇦 Ukraine +380</SelectItem>
  <SelectItem value="+971">🇦🇪 United Arab Emirates +971</SelectItem>
  <SelectItem value="+44">🇬🇧 United Kingdom +44</SelectItem>
  <SelectItem value="+1">🇺🇸 United States +1</SelectItem>
  <SelectItem value="+598">🇺🇾 Uruguay +598</SelectItem>
  <SelectItem value="+998">🇺🇿 Uzbekistan +998</SelectItem>
  <SelectItem value="+678">🇻🇺 Vanuatu +678</SelectItem>
  <SelectItem value="+379">🇻🇦 Vatican City +379</SelectItem>
  <SelectItem value="+58">🇻🇪 Venezuela +58</SelectItem>
  <SelectItem value="+84">🇻🇳 Vietnam +84</SelectItem>
  <SelectItem value="+967">🇾🇪 Yemen +967</SelectItem>
  <SelectItem value="+260">🇿🇲 Zambia +260</SelectItem>
  <SelectItem value="+263">🇿🇼 Zimbabwe +263</SelectItem>
</SelectContent>

                    </Select>
                    <Input
                      id="backupPhone"
                      type="tel"
                      value={formData.contact.backupPhone}
                      onChange={(e) => handleInputChange('contact.backupPhone', e.target.value)}
                      placeholder="82 123 4567"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Item/Pet Name */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{qrData?.type === 'pet' ? 'Pet Name' : 'Item Name'} *</Label>
                  <Input
                    id="name"
                    value={formData.details.name}
                    onChange={(e) => handleInputChange('details.name', e.target.value)}
                    placeholder={`Enter your ${qrData?.type === 'pet' ? 'pet' : 'item'} name`}
                    required
                    className="mt-1"
                  />
              </div>

                <div>
                  <Label htmlFor="message">Finder Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.contact.message}
                    onChange={(e) => handleInputChange('contact.message', e.target.value)}
                    placeholder={formData.details.name ? `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!"}
                    rows={3}
                    className="mt-1"
                  />
            </div>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                    <Label className="text-sm font-medium text-gray-900">Instant Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified on WhatsApp and Email when someone finds your item</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.instantAlerts', !formData.settings.instantAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.settings.instantAlerts ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.instantAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-900">Location Sharing</Label>
                    <p className="text-xs text-gray-500">Allow finders to see your approximate location</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.locationSharing', !formData.settings.locationSharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.settings.locationSharing ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.locationSharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
            </div>
              )}

                <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {submitting ? 'Activating...' : 'Activate My Tag'}
                </Button>

              <p className="text-xs text-gray-500 text-center">
                By activating you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}