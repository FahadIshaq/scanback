"use client"

import React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  AlertTriangle,
  Send,
  MapPin,
  Shield,
  LifeBuoy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRLogo } from "@/components/qr-logo"

interface ScanPageProps {
  params: Promise<{
    code: string
  }>
}

export default function ScanPage({ params }: ScanPageProps) {
  const { code } = React.use(params)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [showLocationPrompt, setShowLocationPrompt] = useState(true)
  const [locationShared, setLocationShared] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [messageData, setMessageData] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagData, setTagData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch tag data
    setTimeout(() => {
      if (code === "demo-pet-001") {
        setTagData({
          isActive: true,
          tagType: "pet",
          ownerName: "Sarah Johnson",
          itemName: "Luna",
          customMessage:
            "Hi! Thanks for finding Luna. She's friendly but might be scared. Please call me immediately if you find her!",
          phone: "+27 82 123 4567",
          backupPhone: "+27 11 234 5678",
          email: "sarah.j@email.com",
          showPhone: true,
          showEmail: true,
          image: "/placeholder.svg?height=300&width=300",
          hasImage: true,
          breed: "Golden Retriever",
          color: "Golden/Cream",
          age: "3 years old",
          medicalNotes: "Takes daily medication for allergies. Please contact vet if found injured.",
          vetName: "Dr. Smith - Happy Paws Clinic",
          vetPhone: "+27 11 234 5678",
          emergencyContact: "John Johnson (husband) - +27 82 123 4568",
          hasMedicalNeeds: true,
        })
      } else if (code === "demo-general-001") {
        setTagData({
          isActive: true,
          tagType: "general",
          ownerName: "Mike Chen",
          itemName: "House Keys",
          customMessage:
            "Thanks for finding my keys! Please contact me so we can arrange a return. I really appreciate your help!",
          phone: "+27 82 234 5678",
          backupPhone: "+27 10 555 0000",
          showPhone: true,
          showEmail: false,
          hasImage: false,
        })
      } else if (code.startsWith("unregistered")) {
        setTagData({
          isActive: false,
          reason: "unregistered",
        })
      } else if (code.startsWith("inactive")) {
        setTagData({
          isActive: false,
          reason: "inactive",
        })
      } else {
        setTagData({
          isActive: false,
          reason: "not_found",
        })
      }
      setLoading(false)
    }, 600)
  }, [code])

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationShared(true)
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
          setShowLocationPrompt(false)
          console.log("Location shared:", position.coords)
        },
        (error) => {
          console.error("Error getting location:", error)
          setShowLocationPrompt(false)
        },
      )
    }
  }

  const handleSendWhatsApp = () => {
    const message = `Hi ${tagData.ownerName}, I found your ${tagData.tagType === "pet" ? "pet" : "item"} "${tagData.itemName}". Please let me know how we can arrange the return.`
    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = tagData.phone.replace(/\D/g, "")
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

  const handleCall = () => {
    window.open(`tel:${tagData.phone}`, "_blank")
  }

  const handleSecureMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          to: { phone: tagData.phone, email: tagData.email },
          channels: ["whatsapp"],
          message: messageData.message || `Finder reached out about ${tagData.itemName}`,
          location: coords || undefined,
          from: { name: messageData.senderName, email: messageData.senderEmail },
        }),
      })
      setIsSubmitting(false)
      setShowMessageForm(false)
      alert("Message sent successfully! The owner will receive your message and can respond directly.")
    } catch {
      setIsSubmitting(false)
      alert("Failed to send. Please try another option.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tag information...</p>
        </div>
      </div>
    )
  }

  if (!tagData?.isActive) {
    const getError = () => {
      switch (tagData?.reason) {
        case "inactive":
          return { title: "Tag Inactive", message: "This QR tag has been temporarily disabled by the owner." }
        case "unregistered":
          return { title: "Tag Unregistered", message: "This QR tag has not been registered yet." }
        default:
          return { title: "Tag Not Found", message: "This QR tag is not recognized in our system." }
      }
    }
    const error = getError()

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
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

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">{error.title}</h1>
          <p className="text-gray-600 mb-6">{error.message}</p>

          {tagData?.reason === "unregistered" ? (
            <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl" asChild>
              <Link href={`/activate/${code}`}>Activate this Tag</Link>
            </Button>
          ) : (
            <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl" asChild>
              <Link href="/">Learn About ScanBack™</Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-3">
              <QRLogo />
              <span className="font-semibold text-navy-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Success Alert */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              {tagData.tagType === "pet" ? (
                <Heart className="h-4 w-4 text-green-600" />
              ) : (
                <MessageCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-green-900">{tagData.tagType === "pet" ? "Pet Found!" : "Item Found!"}</h3>
              <p className="text-sm text-green-700">You've successfully scanned a ScanBack™ tag</p>
            </div>
          </div>
        </div>

        {/* Location Sharing Prompt */}
        {showLocationPrompt && (
          <Card className="mb-6 border-blue-200 bg-blue-50 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Share your location?</h4>
                    <p className="text-sm text-blue-700">Help the owner find you faster</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleShareLocation} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Share my location
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowLocationPrompt(false)}>
                    Skip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Item/Pet Info Card */}
        <Card className="mb-6 border-0 shadow-lg rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center space-x-2">
                {tagData.tagType === "pet" && <Heart className="h-5 w-5 text-red-500" />}
                <span>"{tagData.itemName}"</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="capitalize bg-gray-100 text-gray-800">
                  {tagData.tagType}
                </Badge>
                {tagData.tagType === "pet" && tagData.hasMedicalNeeds && (
                  <Badge className="bg-red-100 text-red-800">Medical Needs</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tagData.hasImage && (
              <div className="flex justify-center">
                <Image
                  src={tagData.image || "/placeholder.svg?height=300&width=300&query=item"}
                  alt={tagData.itemName}
                  width={240}
                  height={240}
                  className="rounded-xl object-cover"
                />
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Message from {tagData.ownerName}:</h4>
              <p className="text-blue-800">{tagData.customMessage}</p>
            </div>

            {/* Pet-specific information */}
            {tagData.tagType === "pet" && (
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-medium text-red-900 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Pet Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Breed:</strong> {tagData.breed}
                    </div>
                    <div>
                      <strong>Color:</strong> {tagData.color}
                    </div>
                    <div>
                      <strong>Age:</strong> {tagData.age}
                    </div>
                    {tagData.medicalNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                        <strong className="text-yellow-800">Medical Notes:</strong>
                        <p className="text-yellow-700 mt-1">{tagData.medicalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {tagData.vetName && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <h5 className="font-medium text-green-900 mb-2">Veterinarian Contact</h5>
                    <div className="text-sm text-green-800">
                      <div>{tagData.vetName}</div>
                      <div>{tagData.vetPhone}</div>
                    </div>
                  </div>
                )}

                {tagData.emergencyContact && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <h5 className="font-medium text-orange-900 mb-2">Emergency Contact</h5>
                    <div className="text-sm text-orange-800">{tagData.emergencyContact}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Options - Updated to match specifications */}
        <Card className="mb-6 border-0 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Contact Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Line 1: "Hi, I'm [Name]." */}
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-700">
                <span className="font-medium">Hi, I'm {tagData.ownerName}.</span>
              </p>
            </div>

            {/* Finder message */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 text-center">{tagData.customMessage}</p>
            </div>

            {/* Buttons in order: WhatsApp (primary), Call, SMS, Email */}
            <div className="space-y-3">
              {tagData.showPhone && (
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-6 text-lg shadow-lg"
                  size="lg"
                >
                  <MessageSquare className="h-6 w-6 mr-3" />
                  WhatsApp
                </Button>
              )}

              {tagData.showPhone && (
                <Button
                  onClick={handleCall}
                  variant="outline"
                  size="lg"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl py-6 text-lg"
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Call
                </Button>
              )}

              {tagData.showPhone && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-6 text-lg"
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  SMS
                </Button>
              )}

              {tagData.showEmail && tagData.email && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-6 text-lg"
                  asChild
                >
                  <a
                    href={`mailto:${tagData.email}?subject=Found your ${tagData.tagType}: ${tagData.itemName}&body=Hi ${tagData.ownerName}, I found your ${tagData.tagType}. Please let me know how we can arrange the return.`}
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    Email
                  </a>
                </Button>
              )}
            </div>

            {/* Share my location if enabled */}
            {tagData.allowLocation && (
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 text-sm">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Share my location if enabled
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {tagData.tagType === "pet"
              ? "Thank you for helping reunite this pet with their family!"
              : "Thank you for being honest and helping return this item!"}
          </p>
          <Button variant="link" asChild className="text-navy-900 hover:text-navy-700">
            <Link href="/">Learn more about ScanBack™</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
