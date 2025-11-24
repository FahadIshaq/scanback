"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, CheckCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    agreed: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      topic: "",
      message: "",
      agreed: false,
    })
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-white text-2xl font-bold tracking-wide">
                SB
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight">
                Contact Us
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-light">
              We're here to help
            </p>
            <p className="text-lg text-gray-600 mt-4">
              Questions about tags, activation, orders, or partnerships? Reach out — we usually reply within 1 business day.
            </p>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-black mx-auto mb-4" />
                <h3 className="font-medium text-black mb-2">Support</h3>
                <a href="mailto:support@scanback.co.za" className="text-blue-600 hover:underline text-sm">
                  support@scanback.co.za
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-black mx-auto mb-4" />
                <h3 className="font-medium text-black mb-2">Sales</h3>
                <a href="mailto:sales@scanback.co.za" className="text-blue-600 hover:underline text-sm">
                  sales@scanback.co.za
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-black mx-auto mb-4" />
                <h3 className="font-medium text-black mb-2">Partners/Wholesale</h3>
                <a href="mailto:partners@scanback.co.za" className="text-blue-600 hover:underline text-sm">
                  partners@scanback.co.za
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600">
              <strong>Business hours:</strong> Mon–Fri, 09:00–16:00 SAST (South Africa)
            </p>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center mb-12 px-2 sm:px-4">
            <h3 className="text-lg sm:text-xl font-medium text-black mb-4">
              Chat to us on WhatsApp
            </h3>
            <a
              href="https://wa.me/27626363108"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp className="h-8 w-8 sm:h-10 sm:w-10" />
            </a>
            
          </div>

          {/* Contact Form */}
          <Card className="mx-2 sm:mx-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Contact Form</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-black mb-2">Thank you — your message has been sent.</h3>
                  <p className="text-gray-700">
                    We'll get back to you within 1 business day (Mon–Fri, 09:00–16:00 SAST).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">Full name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="text-sm sm:text-base"
                    />
                    {!formData.name && <p className="text-xs sm:text-sm text-red-600 mt-1">Please enter your name.</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm sm:text-base">Email address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="text-sm sm:text-base"
                    />
                    {formData.email && !formData.email.includes("@") && (
                      <p className="text-xs sm:text-sm text-red-600 mt-1">A valid email is required.</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone/WhatsApp (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+27 12 345 6789"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="topic" className="text-sm sm:text-base">Topic *</Label>
                    <Select value={formData.topic} onValueChange={(value) => handleInputChange("topic", value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="order">Order question</SelectItem>
                        <SelectItem value="activation">Activation help</SelectItem>
                        <SelectItem value="partners">Partners/Wholesale</SelectItem>
                        <SelectItem value="press">Press/Media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please describe your question or issue..."
                      rows={6}
                      required
                      className="text-sm sm:text-base resize-none"
                    />
                    {!formData.message && <p className="text-xs sm:text-sm text-red-600 mt-1">Message can't be empty.</p>}
                  </div>

                  <div>
                    <Label htmlFor="file" className="text-sm sm:text-base">Attach a file (optional – image of sticker/item)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer text-xs sm:text-sm"
                    />
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 pt-2">
                    <Checkbox
                      id="consent"
                      checked={formData.agreed}
                      onCheckedChange={(checked) => handleInputChange("agreed", checked as boolean)}
                      required
                      className="mt-0.5 sm:mt-1 flex-shrink-0"
                    />
                    <Label htmlFor="consent" className="text-xs sm:text-sm leading-relaxed cursor-pointer flex-1 break-words">
                      I agree to the <Link href="/terms" className="text-blue-600 hover:underline break-all">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline break-all">Privacy Policy</Link>.
                    </Label>
                  </div>
                  {!formData.agreed && <p className="text-xs sm:text-sm text-red-600 ml-6 sm:ml-7">Please agree to continue.</p>}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-6 sm:py-6"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.topic || !formData.message || !formData.agreed}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Email Signup */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mt-12 text-center">
            <h3 className="text-xl sm:text-2xl font-medium text-black mb-4">Stay Connected</h3>
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Join the ScanBack™ community for updates, new tag releases, and exclusive offers.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-3">
                No spam — just smart ways to protect what matters.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
