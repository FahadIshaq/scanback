"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, QrCode, MapPin, Clock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QRLogo } from "@/components/qr-logo"
import { ScanHeader } from "@/components/scan-header"

interface HistoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default function HistoryPage({ params }: HistoryPageProps) {
  const { id } = React.use(params)

  // Mock data - in real app, this would be fetched based on the ID
  const tagData = {
    id: id,
    code: "SB-ABC123",
    name: "Luna",
    type: "pet",
    status: "active",
  }

  const scanHistory = [
    {
      id: "1",
      timestamp: "2024-01-20T10:30:00Z",
      location: "Central Park, New York",
      device: "iPhone 15 Pro",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      ipAddress: "192.168.1.1",
      messageSent: true,
    },
    {
      id: "2",
      timestamp: "2024-01-18T14:15:00Z",
      location: "Brooklyn Bridge, New York",
      device: "Samsung Galaxy S24",
      userAgent: "Mozilla/5.0 (Linux; Android 14)",
      ipAddress: "192.168.1.2",
      messageSent: false,
    },
    {
      id: "3",
      timestamp: "2024-01-15T09:45:00Z",
      location: "Times Square, New York",
      device: "iPhone 14",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
      ipAddress: "192.168.1.3",
      messageSent: true,
    },
  ]

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    // Use consistent date formatting to avoid hydration mismatch
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Tag Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>Scan History: "{tagData.name}"</span>
              </CardTitle>
              <Badge variant="outline" className="capitalize">
                {tagData.type}
              </Badge>
            </div>
            <p className="text-gray-600 font-mono">{tagData.code}</p>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-3xl font-bold text-blue-600">{scanHistory.length}</p>
                </div>
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                  <p className="text-3xl font-bold text-green-600">
                    {scanHistory.filter((scan) => scan.messageSent).length}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages Not Sent</p>
                  <p className="text-3xl font-bold text-red-600">
                    {scanHistory.filter((scan) => !scan.messageSent).length}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan History List */}
        <div className="mb-6">
          {scanHistory.map((scan) => (
            <Card key={scan.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-gray-600" />
                  <span>{formatDateTime(scan.timestamp).date}</span>
                  <span>{formatDateTime(scan.timestamp).time}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-6 w-6 text-gray-600" />
                    <span>{scan.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-6 w-6 text-gray-600" />
                    <span>{scan.device}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">IP Address:</span>
                    <span className="font-mono">{scan.ipAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">User Agent:</span>
                    <span className="font-mono">{scan.userAgent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
