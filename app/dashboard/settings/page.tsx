"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, QrCode, User, Bell, Shield, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
  })

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert("Profile updated successfully!")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
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
                <form onSubmit={handleProfileUpdate} className="space-y-4">
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
                  <Button variant="outline" className="w-full bg-transparent">
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
      </div>
    </div>
  )
}
