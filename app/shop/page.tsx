"use client"

import { useState } from "react"
import Link from "next/link"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Bell, ArrowRight, Handshake, CheckCircle, Loader2 } from "lucide-react"

export default function ShopPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    // Simulate API call - replace with actual endpoint when ready
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-16 pt-12">
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight mb-6">
              ScanBack is launching soon
            </h1>

            {/* Divider */}
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6" />

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-gray-600 font-light">
              Available soon at selected retail stores and online partners
            </p>
          </div>

          {/* Body Copy */}
          <div className="text-center mb-16">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ScanBack is currently in final production, and we're onboarding select retail and online partners.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We're making sure everything is perfect before our first official release — because your peace of mind deserves nothing less.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In the meantime, explore how ScanBack works, register your interest, or get in touch for bulk, partner, or white-label enquiries.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            
            {/* Primary Button - How It Works */}
            <Link href="/how-it-works">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-full"
              >
                How ScanBack Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Notify Me Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center mb-12">
            <Bell className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-medium text-black mb-4">
              Notify Me When Available
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Be the first to know when ScanBack launches. No pressure, no commitment.
            </p>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-black mb-2">You're on the list!</h3>
                <p className="text-gray-600">
                  We'll notify you as soon as ScanBack is available.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-center sm:text-left"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Signing up...
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-red-600 text-sm mt-3">{error}</p>
                )}
              </form>
            )}
          </div>

          {/* Partner Enquiries Section */}
          <div className="border border-gray-200 rounded-2xl p-8 md:p-12 text-center mb-12">
            <Handshake className="h-12 w-12 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-medium text-black mb-4">
              Wholesale & Partner Enquiries
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Interested in retailing ScanBack, bulk orders, or white-label opportunities? Let's talk.
            </p>
            <Link href="/contact?topic=partners">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg rounded-full"
              >
                Partner With Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ScanBack will be available through selected retail and online partners.
              <br />
              Availability may vary by location.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
