"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Settings, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScanHeader } from "@/components/scan-header"

const mockTags = [
  {
    id: "SB-ABC123",
    name: "Luna",
    type: "Pet",
    status: "active",
    lastScan: "2 days ago",
  },
  {
    id: "SB-DEF456",
    name: "House Keys",
    type: "General",
    status: "active",
    lastScan: "Never",
  },
  {
    id: "SB-GHI789",
    name: "iPhone 15",
    type: "General",
    status: "active",
    lastScan: "1 week ago",
  },
]

const stickerDesigns = [
  {
    id: "classic",
    name: "Classic",
    description: "Simple black circular design",
    image: "/stickers/circular-variants.png",
  },
  {
    id: "premium-gold",
    name: "Premium Gold",
    description: "Elegant gold square design",
    image: "/stickers/gold-rectangular.png",
  },
  {
    id: "brushed-silver",
    name: "Brushed Silver",
    description: "Rounded silver rectangle",
    image: "/stickers/mixed-variants.png",
  },
]

export default function StickersPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState("standard")
  const [selectedDesign, setSelectedDesign] = useState("classic")

  const handleTagSelect = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tagId])
    } else {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    }
  }

  const handleSelectAll = () => {
    if (selectedTags.length === mockTags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(mockTags.map((tag) => tag.id))
    }
  }

  const handleDownload = () => {
    // Simulate download
    alert(`Downloading ${selectedTags.length} sticker(s) in ${selectedSize} size with ${selectedDesign} design`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Download Stickers</h1>
          <p className="text-gray-600">Quick, print-ready stickers for your tags.</p>
        </div>

        {/* Admin Generator Link */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-900">
                Need bulk exports, batching (100, 200, custom), and multi-format ZIPs?
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
            >
              <Link href="/admin/generator">
                Open Admin Generator
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Select Tags */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Tags</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedTags.length === mockTags.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={tag.id}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={(checked) => handleTagSelect(tag.id, !!checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{tag.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {tag.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{tag.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Last scan</div>
                      <div className="text-sm text-gray-700">{tag.lastScan}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Choose Design */}
            <Card className="border-0 shadow-lg rounded-2xl mt-6">
              <CardHeader>
                <CardTitle>Choose Design</CardTitle>
                <p className="text-sm text-gray-600">Professional designs, print-ready</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {stickerDesigns.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDesign === design.id
                          ? "border-navy-900 bg-navy-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <Image
                          src={design.image || "/placeholder.svg"}
                          alt={design.name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm">{design.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{design.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Options & Download */}
          <div>
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle>Options & Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Size:</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl">
                    <button
                      onClick={() => setSelectedSize("small")}
                      className={`px-3 py-2 text-sm rounded-lg transition-all ${
                        selectedSize === "small"
                          ? "bg-white text-navy-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Small (2cm)
                    </button>
                    <button
                      onClick={() => setSelectedSize("standard")}
                      className={`px-3 py-2 text-sm rounded-lg transition-all ${
                        selectedSize === "standard"
                          ? "bg-white text-navy-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Standard (4cm)
                    </button>
                    <button
                      onClick={() => setSelectedSize("large")}
                      className={`px-3 py-2 text-sm rounded-lg transition-all ${
                        selectedSize === "large"
                          ? "bg-white text-navy-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Large (6cm)
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={selectedTags.length === 0}
                  className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-white"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• PDF format optimized for printing</p>
                  <p>• High resolution (300 DPI), cut lines included</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-xs text-gray-600">
                    Admins can generate advanced batches, multi-format exports, and layouts in the{" "}
                    <Link href="/admin/generator" className="text-navy-900 underline">
                      Admin Generator
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customize Your Scan Page */}
            <Card className="border-0 shadow-lg rounded-2xl mt-6">
              <CardHeader>
                <CardTitle>Customize Your Scan Page</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Update finder-facing message and contact visibility per tag.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 bg-transparent"
                >
                  <Link href="/dashboard/customize">
                    <Settings className="h-4 w-4 mr-2" />
                    Open customizer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
