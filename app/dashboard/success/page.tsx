"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, QrCode, ArrowRight, Download, Eye, PawPrint, Tag, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import {ScanHeader} from "@/components/scan-header"
import { MedicalCross } from "@/components/MedicalCross"
interface QRData {
  code: string
  type: 'item' | 'pet' | 'emergency' | 'any'
  isActivated: boolean
  details: {
    name: string
    description?: string
    [key: string]: any
  }
  contact: {
    name: string
    phone?: string
    email?: string
    [key: string]: any
  }
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const qrCode = searchParams.get("code") || "SB-ABC123"
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQRData = async () => {
      try {
        console.log('Fetching QR data for code:', qrCode)
        const response = await fetch(`https://scanback-backend.vercel.app/api/qr/${qrCode}`)
        const data = await response.json()
        console.log('QR data response:', data)
        if (data.success) {
          console.log('QR data received:', data.data)
          setQrData(data.data)
        } else {
          console.log('QR data fetch failed:', data.message)
        }
      } catch (error) {
        console.error('Error fetching QR data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (qrCode) {
      fetchQRData()
    }
  }, [qrCode])

  const getTagIcon = (type: string) => {
    switch (type) {
      case 'pet':
        return <PawPrint className="h-5 w-5 text-yellow-500" />
      case 'emergency':
        return <MedicalCross className="h-5 w-5 text-red-600" size={16} />
      case 'item':
        return <Tag className="h-5 w-5 text-blue-600 flex items-center justify-center" />
      default:
        return <Tag className="h-5 w-5 text-blue-600 flex items-center justify-center" />
    }
  }

  const getTagTypeLabel = (type: string) => {
    switch (type) {
      case 'pet':
        return 'Pet Tag'
      case 'emergency':
        return 'Emergency Tag'
      case 'item':
        return 'Item Tag'
      default:
        return 'QR Tag'
    }
  }

  const getSuccessMessage = (type: string) => {
    switch (type) {
      case 'pet':
        return 'Your pet tag has been registered and is now active'
      case 'emergency':
        return 'Your emergency tag has been registered and is now active'
      case 'item':
        return 'Your item tag has been registered and is now active'
      default:
        return 'Your QR tag has been registered and is now active'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Fallback data if QR data is not available
  const registeredTag = qrData ? {
    code: qrData.code,
    tagType: qrData.type,
    itemName: qrData.details?.name || 'Unknown',
    customMessage: qrData.details?.description || 'Thank you for finding my item!',
    ownerName: qrData.contact?.name || 'Unknown',
    showPhone: qrData.contact?.phone ? true : false,
    showEmail: qrData.contact?.email ? true : false,
    scanAlerts: true,
  } : {
    code: qrCode,
    tagType: "item",
    itemName: "Unknown",
    customMessage: "Thank you for finding my item!",
    ownerName: "Unknown",
    showPhone: false,
    showEmail: false,
    scanAlerts: true,
  }

  console.log('Success page - qrData:', qrData)
  console.log('Success page - registeredTag:', registeredTag)

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Registration Successful!</h1>
          <p className="text-lg text-gray-600">{getSuccessMessage(registeredTag.tagType)}</p>
        </div>

        {/* Tag Preview */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {getTagIcon(registeredTag.tagType)}
                <span>Your {getTagTypeLabel(registeredTag.tagType)}</span>
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tag Code:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{registeredTag.code}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {getTagTypeLabel(registeredTag.tagType)}
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="text-sm font-medium">"{registeredTag.itemName}"</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Contact Methods:</span>
                <span className="text-sm">
                  {[registeredTag.showPhone && "Phone", registeredTag.showEmail && "Email"]
                    .filter(Boolean)
                    .join(", ") || "Secure messaging only"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-navy-900 mb-2">Finder Message:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-blue-800 text-sm">{registeredTag.customMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-navy-900">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-navy-900">Download Your Sticker</h4>
                <p className="text-sm text-gray-600">Get a printable sticker with your QR code</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-navy-900">Attach Your QR Sticker</h4>
                <p className="text-sm text-gray-600">
                  {registeredTag.tagType === 'pet' ? 'Place the sticker on your pet\'s collar or harness' :
                   registeredTag.tagType === 'emergency' ? 'Place the sticker on your emergency contact card or medical bracelet' :
                   'Place the sticker on your item in a visible location'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-navy-900">Test Your Tag</h4>
                <p className="text-sm text-gray-600">Scan the QR code to make sure it works properly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button size="lg" className="w-full bg-navy-900 hover:bg-navy-800 text-white rounded-xl" asChild>
            <Link href="/dashboard">
              Go to My Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" variant="outline" className="w-full bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl" asChild>
              <Link href={`/dashboard/stickers?tag=${registeredTag.code}`}>
                <Download className="h-4 w-4 mr-2" />
                Download Sticker
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="w-full bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl" asChild>
              <Link href={`/scan/${registeredTag.code}`}>
                <Eye className="h-4 w-4 mr-2" />
                Test QR Tag
              </Link>
            </Button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Need help or have questions?</p>
          <Button variant="link" asChild className="text-navy-900 hover:text-navy-700">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
