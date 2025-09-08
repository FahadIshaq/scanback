"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Eye, MessageCircle, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const mockTags = [
  {
    id: "SB-ABC123",
    name: "Luna",
    type: "pet",
    message: "Hi! Thanks for finding Luna. She's friendly but might be scared. Please call me immediately!",
    showPhone: true,
    showEmail: true,
    showWhatsApp: true,
  },
  {
    id: "SB-DEF456",
    name: "House Keys",
    type: "general",
    message: "Thanks for finding my keys! Please contact me so we can arrange a return.",
    showPhone: true,
    showEmail: false,
    showWhatsApp: true,
  },
]

export default function CustomizePage() {
  const [selectedTag, setSelectedTag] = useState(mockTags[0])
  const [message, setMessage] = useState(selectedTag.message)
  const [showPhone, setShowPhone] = useState(selectedTag.showPhone)
  const [showEmail, setShowEmail] = useState(selectedTag.showEmail)
  const [showWhatsApp, setShowWhatsApp] = useState(selectedTag.showWhatsApp)
  const [showPreview, setShowPreview] = useState(false)

  const handleTagChange = (tagId: string) => {
    const tag = mockTags.find((t) => t.id === tagId)
    if (tag) {
      setSelectedTag(tag)
      setMessage(tag.message)
      setShowPhone(tag.showPhone)
      setShowEmail(tag.showEmail)
      setShowWhatsApp(tag.showWhatsApp)
    }
  }

  const handleSave = () => {
    alert("Scan page customization saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
              <Link href="/dashboard/stickers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stickers
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Customize Your Scan Page</h1>
          <p className="text-gray-600">Update finder-facing message and contact visibility per tag.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customization Form */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>Select Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTag.id} onValueChange={handleTagChange}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose a tag to customize" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center space-x-2">
                          <span>{tag.name}</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {tag.type}
                          </Badge>
                          <span className="text-xs text-gray-500">({tag.id})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>Finder Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="message">Custom message shown to finders</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message to finders..."
                    className="rounded-xl mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep it friendly and include clear instructions for contact.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>Contact Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Show WhatsApp button</p>
                    <p className="text-xs text-gray-500">Primary contact method (recommended)</p>
                  </div>
                  <Switch checked={showWhatsApp} onCheckedChange={setShowWhatsApp} aria-label="Show WhatsApp" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Show phone call button</p>
                    <p className="text-xs text-gray-500">Direct calling option</p>
                  </div>
                  <Switch checked={showPhone} onCheckedChange={setShowPhone} aria-label="Show phone" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Show email button</p>
                    <p className="text-xs text-gray-500">Alternative contact method</p>
                  </div>
                  <Switch checked={showEmail} onCheckedChange={setShowEmail} aria-label="Show email" />
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button onClick={handleSave} className="flex-1 rounded-xl bg-navy-900 hover:bg-navy-800 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 bg-transparent"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Hide" : "Preview"}
              </Button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-24">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Finder Preview</CardTitle>
                  <p className="text-sm text-gray-600">How finders will see your scan page</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock finder view */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Message from Owner:</h4>
                    <p className="text-blue-800 text-sm">{message}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Contact Options</h4>

                    {showWhatsApp && (
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}

                    {showPhone && (
                      <Button
                        variant="outline"
                        className="w-full border-gray-200 text-gray-700 rounded-xl bg-transparent"
                        size="sm"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    )}

                    {showEmail && (
                      <Button
                        variant="outline"
                        className="w-full border-gray-200 text-gray-700 rounded-xl bg-transparent"
                        size="sm"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    )}

                    {!showWhatsApp && !showPhone && !showEmail && (
                      <p className="text-sm text-gray-500 text-center py-4">No contact methods enabled</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
