"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    shareLocation: false,
    captcha: "",
  })
  const [locationShared, setLocationShared] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationShared(true)
          setFormData((prev) => ({ ...prev, shareLocation: true }))
          console.log("Location shared:", position.coords)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      shareLocation: false,
      captcha: "",
    })
    setLocationShared(false)
    setIsSubmitting(false)

    alert("Message sent successfully! We'll get back to you soon.")
  }

  // Simple math CAPTCHA
  const num1 = 7
  const num2 = 3
  const correctAnswer = num1 + num2

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">Need help? Have questions? We're here to assist you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
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
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle>Your Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="What can we help you with?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please describe your question or issue in detail..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Location (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  If your inquiry is location-specific, you can share your current location to help us assist you
                  better.
                </p>
                {!locationShared ? (
                  <Button
                    type="button"
                    onClick={handleShareLocation}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Share My Location
                  </Button>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium">✓ Location shared</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CAPTCHA */}
          <Card>
            <CardHeader>
              <CardTitle>Security Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    What is {num1} + {num2}?
                  </p>
                  <Input
                    type="number"
                    value={formData.captcha}
                    onChange={(e) => handleInputChange("captcha", e.target.value)}
                    placeholder="Enter the answer"
                    className="w-24 mx-auto text-center"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  This helps us prevent spam and ensure you're a real person.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={
              isSubmitting ||
              !formData.name ||
              !formData.email ||
              !formData.subject ||
              !formData.message ||
              formData.captcha !== correctAnswer.toString()
            }
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        {/* Alternative Contact Methods */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Other Ways to Reach Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
                <p className="text-sm text-gray-600 mb-2">For general inquiries</p>
                <a href="mailto:support@scanback.me" className="text-blue-600 hover:underline">
                  support@scanback.me
                </a>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Emergency</h4>
                <p className="text-sm text-gray-600 mb-2">For urgent lost pet cases</p>
                <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">We typically respond within 24 hours during business days.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
