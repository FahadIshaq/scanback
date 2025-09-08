"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Settings, FileText, ImageIcon, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export default function AdminGeneratorPage() {
  const [batchSize, setBatchSize] = useState("100")
  const [customBatchSize, setCustomBatchSize] = useState("")
  const [stickersPerPage, setStickersPerPage] = useState("12")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeQRCodes, setIncludeQRCodes] = useState(true)
  const [includeCutLines, setIncludeCutLines] = useState(true)
  const [includeLabels, setIncludeLabels] = useState(false)

  const handleGenerate = () => {
    const finalBatchSize = batchSize === "custom" ? customBatchSize : batchSize
    alert(
      `Generating ${finalBatchSize} stickers in ${exportFormat.toUpperCase()} format with ${stickersPerPage} per page`,
    )
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
              <span className="font-semibold text-navy-900">ScanBack™ Admin Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Bulk Sticker Generator</h1>
          <p className="text-gray-600">Advanced batch generation with multi-format exports and custom layouts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch Configuration */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Batch Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Select value={batchSize} onValueChange={setBatchSize}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select batch size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 stickers</SelectItem>
                    <SelectItem value="100">100 stickers</SelectItem>
                    <SelectItem value="200">200 stickers</SelectItem>
                    <SelectItem value="500">500 stickers</SelectItem>
                    <SelectItem value="custom">Custom amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {batchSize === "custom" && (
                <div>
                  <Label htmlFor="customBatch">Custom Batch Size</Label>
                  <Input
                    id="customBatch"
                    type="number"
                    placeholder="Enter number of stickers"
                    value={customBatchSize}
                    onChange={(e) => setCustomBatchSize(e.target.value)}
                    className="rounded-xl"
                    min="1"
                    max="10000"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="stickersPerPage">Stickers per Page</Label>
                <Select value={stickersPerPage} onValueChange={setStickersPerPage}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 per page (Large)</SelectItem>
                    <SelectItem value="12">12 per page (Standard)</SelectItem>
                    <SelectItem value="24">24 per page (Small)</SelectItem>
                    <SelectItem value="48">48 per page (Mini)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        PDF (Print Ready)
                      </div>
                    </SelectItem>
                    <SelectItem value="png">
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        PNG (High Resolution)
                      </div>
                    </SelectItem>
                    <SelectItem value="svg">
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        SVG (Vector)
                      </div>
                    </SelectItem>
                    <SelectItem value="zip">
                      <div className="flex items-center">
                        <Archive className="h-4 w-4 mr-2" />
                        ZIP (All Formats)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Advanced Options</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="qrcodes"
                    checked={includeQRCodes}
                    onCheckedChange={(checked) => setIncludeQRCodes(!!checked)}
                  />
                  <Label htmlFor="qrcodes" className="text-sm">
                    Include QR codes
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cutlines"
                    checked={includeCutLines}
                    onCheckedChange={(checked) => setIncludeCutLines(!!checked)}
                  />
                  <Label htmlFor="cutlines" className="text-sm">
                    Include cut lines
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="labels"
                    checked={includeLabels}
                    onCheckedChange={(checked) => setIncludeLabels(!!checked)}
                  />
                  <Label htmlFor="labels" className="text-sm">
                    Include code labels
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-0 shadow-lg rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle>Batch Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-xl p-6 text-center">
                <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                  {Array.from({ length: Math.min(Number.parseInt(stickersPerPage), 12) }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center"
                    >
                      <div className="w-6 h-6 bg-navy-900 rounded text-white text-xs flex items-center justify-center">
                        QR
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Preview: {stickersPerPage} stickers per page in {exportFormat.toUpperCase()} format
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Generate */}
          <div className="lg:col-span-2">
            <Button
              onClick={handleGenerate}
              className="w-full rounded-xl bg-navy-900 hover:bg-navy-800 text-white"
              size="lg"
              disabled={batchSize === "custom" && !customBatchSize}
            >
              <Download className="h-5 w-5 mr-2" />
              Generate Batch
            </Button>

            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Large batches may take a few minutes to process.</p>
              <p>You'll receive a download link when ready.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
