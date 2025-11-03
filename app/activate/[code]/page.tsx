"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin, Bell, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import PhoneInput from "@/components/phone-input"
import { QRLogo } from "@/components/qr-logo"
import { ScanHeader } from "@/components/scan-header"

interface ActivateTagPageProps {
  params: Promise<{
    code: string
  }>
}

export default function ActivateTagPage({ params }: ActivateTagPageProps) {
  const { code } = React.use(params)
  const router = useRouter()

  // Form state
  const [primary, setPrimary] = useState("")
  const [primaryCountry, setPrimaryCountry] = useState("ZA")
  const [backup, setBackup] = useState("")
  const [backupCountry, setBackupCountry] = useState("ZA")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("If this is my item, please WhatsApp me here.")
  const [allowLocation, setAllowLocation] = useState(true)
  const [notifyInstantly, setNotifyInstantly] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate activation latency
      await new Promise((r) => setTimeout(r, 900))
      
      // Send welcome communications
      const welcomeResponse = await fetch("/api/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "User",
          phone: primary.trim(),
          email: email.trim(),
          code: code,
          tagId: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }),
      })

      if (welcomeResponse.ok) {
        console.log("Welcome communications sent successfully")
      } else {
        console.log("Welcome communications failed, but tag is still activated")
      }
      
      setIsSubmitting(false)
      setDone(true)
    } catch (error) {
      console.error("Error during activation:", error)
      setIsSubmitting(false)
      setDone(true) // Still show success even if welcome communications fail
    }
  }

  // Success screen
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ScanHeader />

        <div className="container mx-auto px-4 py-10 max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-navy-900">Your ScanBack tag is active!</h1>
            <p className="text-sm text-gray-600 mt-2">Finders can now contact you instantly via WhatsApp.</p>

            {/* Welcome message */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                Welcome to ScanBack! You'll receive a welcome message with your "Manage My Tags" link.
              </p>
            </div>

            {/* Communication sent confirmation */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-800">
                ✅ Welcome message sent to your WhatsApp and email (if provided)
              </p>
            </div>

            {/* Mini animation strip */}
            <div className="mt-6 space-y-2">
              <div className="grid grid-cols-3 gap-2 items-center text-center">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-xs font-medium text-blue-800">Finder scans</div>
                </div>
                <ChevronRight className="mx-auto text-blue-400 h-4 w-4" />
                <div className="p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="text-xs font-medium text-green-800">You're notified</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center text-center">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-xs font-medium text-blue-800">Arrange return</div>
                </div>
                <ChevronRight className="mx-auto text-blue-400 h-4 w-4" />
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-medium text-emerald-800">Item back</div>
                </div>
              </div>
            </div>

            {/* Management instructions */}
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-700">
                You can always manage this tag later by logging in at{" "}
                <span className="font-mono text-navy-900">scanback.co.za/manage</span>
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <Button asChild className="w-full rounded-xl bg-navy-900 hover:bg-navy-800">
                <Link href={`/scan/${code}`}>Preview Finder Screen</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 bg-transparent"
              >
                <Link href="/dashboard">Edit My Tag</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Activation form
  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 pt-6 pb-10 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Activate your ScanBack tag</h1>
          <p className="text-lg text-gray-600">One scan. One chance to get it back.</p>
          <p className="mt-2 text-xs text-gray-500 font-mono">Code: {code}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Sarah Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl mt-1"
                  autoComplete="name"
                  required
                />
              </div>

              <PhoneInput
                id="primary"
                label="WhatsApp (+ country dropdown, SA default)"
                required
                value={primary}
                onChange={setPrimary}
                countryCode={primaryCountry}
                onCountryChange={setPrimaryCountry}
              />

              <PhoneInput
                id="backup"
                label="Backup number (optional)"
                value={backup}
                onChange={setBackup}
                countryCode={backupCountry}
                onCountryChange={setBackupCountry}
              />

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email (optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl mt-1"
                  autoComplete="email"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-navy-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-green-600" />
                Finder Message & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="message" className="text-gray-700">
                  Finder message (editable)
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="If this is my item, please WhatsApp me here."
                  className="rounded-xl"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Keep it friendly and concise. This message will be shown to anyone who finds your item.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-blue-900">Location toggle</p>
                  <p className="text-xs text-blue-700">
                    Allow finders to share their location with you
                  </p>
                </div>
                <Switch
                  id="loc"
                  checked={allowLocation}
                  onCheckedChange={setAllowLocation}
                  aria-label="Allow location sharing"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-green-900">Instant alerts toggle (ON)</p>
                  <p className="text-xs text-green-700">Real-time WhatsApp alert when your tag is scanned</p>
                </div>
                <Switch
                  id="notify"
                  checked={notifyInstantly}
                  onCheckedChange={setNotifyInstantly}
                  aria-label="Notify instantly"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-lg py-6 shadow-lg"
            disabled={isSubmitting || primary.trim() === "" || !name.trim()}
          >
            {isSubmitting ? "Activating..." : "Activate My Tag"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              After activation, you'll receive a welcome message with your "Manage My Tags" link.
            </p>
            <Link href="/auth/register" className="text-sm text-gray-600 underline">
              Create full account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
