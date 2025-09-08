"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { QRLogo } from "@/components/qr-logo"

export default function MagicLinkPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const tagId = searchParams.get("tag")

    if (!token || !tagId) {
      setStatus("error")
      return
    }

    // Validate magic link token
    validateMagicLink(token, tagId)
  }, [searchParams])

  const validateMagicLink = async (token: string, tagId: string) => {
    try {
      // Simulate API call to validate token
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, we'll simulate a successful validation
      // In production, this would validate against your backend
      const isValid = token.length === 32 // Simple validation for demo
      
      if (isValid) {
        setUserData({
          name: "Demo User",
          tagId: tagId,
          email: "demo@example.com"
        })
        setStatus("success")
        
        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } else {
        setStatus("expired")
      }
    } catch (error) {
      console.error("Error validating magic link:", error)
      setStatus("error")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-navy-900 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Validating Magic Link</h2>
            <p className="text-gray-600">Please wait while we verify your access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Invalid Magic Link</h2>
            <p className="text-gray-600 mb-6">This magic link is invalid or has expired.</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">Login with Password</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Magic Link Expired</h2>
            <p className="text-gray-600 mb-6">This magic link has expired. Please request a new one.</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">Login with Password</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Welcome back, {userData?.name}!</h2>
            <p className="text-gray-600 mb-6">Your magic link is valid. Redirecting to dashboard...</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard Now</Link>
              </Button>
              <p className="text-sm text-gray-500">Auto-redirecting in 3 seconds...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
