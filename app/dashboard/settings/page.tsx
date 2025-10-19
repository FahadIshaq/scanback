"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, QrCode, User, Bell, Shield, Trash2, Save, Eye, EyeOff, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { Footer } from "@/components/footer"
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

export default function SettingsPage() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(true)

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    globalEmailToggle: true,
    globalSmsToggle: true,
    defaultShowPhone: true,
    defaultShowEmail: false,
    defaultScanAlerts: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Split the name into first and last name
          const nameParts = user.name ? user.name.split(' ') : ['', '']
          setProfileData({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
          })
        } catch (error) {
          console.error('Error loading user data:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProfileError("")
    setProfileMessage("")
    
    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim()
      
      // Update user profile
      const profileResponse = await apiClient.updateProfile({
        name: fullName,
        email: profileData.email,
        phone: profileData.phone
      })
      
      if (profileResponse.success) {
        // Get all user's QR codes to update them
        const qrCodesResponse = await apiClient.getUserQRCodes()
        
        if (qrCodesResponse.success && qrCodesResponse.data.length > 0) {
          // Update each QR code with new contact information
          const updatePromises = qrCodesResponse.data.map((qr: any) => 
            apiClient.updateQRCode(qr.code, {
              contact: {
                name: fullName,
                email: profileData.email,
                phone: profileData.phone,
                backupPhone: qr.contact?.backupPhone || '', // Keep existing backup phone
                message: qr.contact?.message || '' // Keep existing message
              }
            })
          )
          
          // Wait for all QR code updates to complete
          const qrUpdateResults = await Promise.allSettled(updatePromises)
          
          // Check if any QR updates failed
          const failedUpdates = qrUpdateResults.filter(result => 
            result.status === 'rejected' || 
            (result.status === 'fulfilled' && !result.value.success)
          )
          
          if (failedUpdates.length > 0) {
            console.warn('Some QR codes failed to update:', failedUpdates)
            setProfileMessage(`Profile updated successfully! However, ${failedUpdates.length} QR code(s) failed to update. Please check your QR codes in the dashboard.`)
          } else {
            setProfileMessage(`Profile updated successfully! All ${qrCodesResponse.data.length} QR code(s) have been updated with the new information.`)
          }
        } else {
          setProfileMessage("Profile updated successfully!")
        }
      } else {
        setProfileError(profileResponse.message || "Failed to update profile")
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      setProfileError(error.message || "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert("Notification settings updated!")
  }

  const handleDeleteAccount = () => {
    alert("Account deletion requested. You will receive a confirmation email.")
  }

  // Password validation function
  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) {
      errors.push("At least 8 characters")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter")
    }
    if (!/\d/.test(password)) {
      errors.push("One number")
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("One special character")
    }
    return errors
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    const passwordErrors = validatePassword(passwordData.newPassword)
    if (passwordErrors.length > 0) {
      setPasswordError(`Password must contain: ${passwordErrors.join(", ")}`)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (response.success) {
        setPasswordMessage("Password changed successfully!")
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setShowChangePassword(false)
      } else {
        setPasswordError(response.message || "Failed to change password")
      }
    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black">ScanBack™</span>
                <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl min-h-[calc(100vh-80px)]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading profile data...</div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {profileError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{profileError}</p>
                      </div>
                    )}
                    
                    {profileMessage && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800">{profileMessage}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Updating..." : "Update Profile"}
                      <Save className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Global Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="globalEmailToggle"
                      checked={notificationSettings.globalEmailToggle}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, globalEmailToggle: checked as boolean }))
                      }
                    />
                    <Label htmlFor="globalEmailToggle">Enable email notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="globalSmsToggle"
                      checked={notificationSettings.globalSmsToggle}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, globalSmsToggle: checked as boolean }))
                      }
                    />
                    <Label htmlFor="globalSmsToggle">Enable SMS notifications</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Settings for New Tags</CardTitle>
                  <p className="text-sm text-gray-600">These settings will be applied to newly registered tags</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Contact Visibility</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="defaultShowPhone"
                        checked={notificationSettings.defaultShowPhone}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, defaultShowPhone: checked as boolean }))
                        }
                      />
                      <Label htmlFor="defaultShowPhone">Show phone number by default</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="defaultShowEmail"
                        checked={notificationSettings.defaultShowEmail}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, defaultShowEmail: checked as boolean }))
                        }
                      />
                      <Label htmlFor="defaultShowEmail">Show email address by default</Label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Scan Alerts</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="defaultScanAlerts"
                        checked={notificationSettings.defaultScanAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, defaultScanAlerts: checked as boolean }))
                        }
                      />
                      <Label htmlFor="defaultScanAlerts">Enable scan alerts by default</Label>
                    </div>
                  </div>

                  <Button onClick={handleNotificationUpdate} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Updating..." : "Save Notification Settings"}
                    <Save className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Password & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download My Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <Trash2 className="h-5 w-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. All your tags will be deactivated and your
                    data will be permanently deleted.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you absolutely sure? This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Yes, Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{passwordError}</p>
                  </div>
                )}

                {passwordMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800">{passwordMessage}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className={`flex items-center ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{passwordData.newPassword.length >= 8 ? '✓' : '○'}</span>
                        At least 8 characters
                      </li>
                      <li className={`flex items-center ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{/[A-Z]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                        One uppercase letter
                      </li>
                      <li className={`flex items-center ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{/[a-z]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                        One lowercase letter
                      </li>
                      <li className={`flex items-center ${/\d/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{/\d/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                        One number
                      </li>
                      <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? '✓' : '○'}</span>
                        One special character
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowChangePassword(false)
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                        setPasswordError("")
                        setPasswordMessage("")
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || passwordData.newPassword !== passwordData.confirmPassword || validatePassword(passwordData.newPassword).length > 0}
                      className="flex-1 bg-black hover:bg-gray-800 text-white"
                    >
                      {isSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
