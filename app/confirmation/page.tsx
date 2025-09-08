import Link from "next/link"
import { CheckCircle, QrCode, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ConfirmationPage() {
  // Mock data - in real app, this would come from the registration
  const registeredTag = {
    code: "SB-ABC123",
    tagType: "pet",
    nickname: "Luna",
    message: "Hi! Thanks for finding Luna. She's very friendly but might be scared. Please call me immediately!",
    ownerName: "Sarah Johnson",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-gray-900">ScanBack™</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-lg text-gray-600">Your QR tag has been registered and is now active</p>
        </div>

        {/* Tag Preview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span>Your QR Tag</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tag Code:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{registeredTag.code}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <Badge variant="outline" className="capitalize">
                  {registeredTag.tagType}
                </Badge>
              </div>
              {registeredTag.nickname && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <span className="text-sm font-medium">"{registeredTag.nickname}"</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Finder Message:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">{registeredTag.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Attach Your QR Sticker</h4>
                <p className="text-sm text-gray-600">Place the QR sticker on your item in a visible location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Test Your Tag</h4>
                <p className="text-sm text-gray-600">Scan the QR code with your phone to make sure it works</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Your Tags</h4>
                <p className="text-sm text-gray-600">Use your dashboard to edit details or add more tags</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/dashboard">
              Go to My Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
            <Link href={`/scan/${registeredTag.code}`}>Test My QR Tag</Link>
          </Button>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Need help or have questions?</p>
          <Button variant="link" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
