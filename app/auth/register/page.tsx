"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    emailNotifications: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    setIsSubmitting(true)

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-navy-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-navy-900">Create Your Account</CardTitle>
            <p className="text-gray-600">Start protecting your valuables today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="border-gray-200 focus:border-gray-400 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+27 82 123 4567"
                  className="border-gray-200 focus:border-gray-400 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a strong password"
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    className="border-gray-200 focus:border-gray-400 rounded-xl"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-navy-900 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-navy-900 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, emailNotifications: checked as boolean }))
                    }
                  />
                  <Label htmlFor="emailNotifications" className="text-sm text-gray-600">
                    Send me WhatsApp notifications when my tags are scanned
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-navy-900 hover:bg-navy-800 text-white rounded-xl"
                disabled={isSubmitting || !formData.agreeToTerms}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-navy-900 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold text-navy-900 mb-4">What you'll get:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Unlimited QR tag registration</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Instant WhatsApp notifications</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Downloadable sticker templates</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Pet-specific profiles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
