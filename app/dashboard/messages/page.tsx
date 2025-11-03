"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, QrCode, MessageCircle, Clock, MapPin, Reply, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScanHeader } from "@/components/scan-header"

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  // Mock data - in real app, this would be fetched from API
  const messages = [
    {
      id: "1",
      tagId: "1",
      tagName: "Luna",
      tagCode: "SB-ABC123",
      senderName: "John Smith",
      senderPhone: "+1 (555) 987-6543",
      message: "Hi! I found Luna at Central Park. She seems scared but friendly. Please call me ASAP!",
      timestamp: "2024-01-20T10:30:00Z",
      location: "Central Park, New York",
      status: "unread",
      isUrgent: true,
    },
    {
      id: "2",
      tagId: "2",
      tagName: "House Keys",
      tagCode: "SB-DEF456",
      senderName: "Maria Garcia",
      senderPhone: null,
      message: "Found your keys near the subway station. Let me know how to return them.",
      timestamp: "2024-01-18T14:15:00Z",
      location: "Brooklyn Bridge Station",
      status: "read",
      isUrgent: false,
    },
    {
      id: "3",
      tagId: "1",
      tagName: "Luna",
      tagCode: "SB-ABC123",
      senderName: "Anonymous",
      senderPhone: null,
      message: "Saw your dog near Times Square around 2 PM. Tried to approach but she ran away.",
      timestamp: "2024-01-15T14:00:00Z",
      location: "Times Square, New York",
      status: "resolved",
      isUrgent: false,
    },
  ]

  const unreadMessages = messages.filter((msg) => msg.status === "unread")
  const readMessages = messages.filter((msg) => msg.status === "read")
  const resolvedMessages = messages.filter((msg) => msg.status === "resolved")

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      // Use consistent date formatting to avoid hydration mismatch
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${day}/${month}/${year} ${hours}:${minutes}`
    }
  }

  const handleReply = async (messageId: string) => {
    setIsReplying(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsReplying(false)
    setReplyText("")
    alert("Reply sent successfully!")
  }

  const handleMarkResolved = (messageId: string) => {
    alert(`Message ${messageId} marked as resolved`)
  }

  const handleReportSpam = (messageId: string) => {
    if (confirm("Report this message as spam?")) {
      alert(`Message ${messageId} reported as spam`)
    }
  }

  const MessageCard = ({ message }: { message: any }) => (
    <Card
      className={`cursor-pointer transition-colors ${
        message.status === "unread" ? "border-blue-200 bg-blue-50" : "hover:bg-gray-50"
      } ${message.isUrgent ? "border-red-200 bg-red-50" : ""}`}
      onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm sm:text-base">{message.tagName}</span>
              <Badge variant="outline" className="text-xs">
                {message.tagCode}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {message.isUrgent && <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>}
              {message.status === "unread" && <Badge className="bg-blue-100 text-blue-800 text-xs">New</Badge>}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{formatDateTime(message.timestamp)}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">From: {message.senderName}</span>
          {message.location && (
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
              <MapPin className="h-3 w-3" />
              <span>{message.location}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 mb-3 text-sm sm:text-base">{message.message}</p>
        {message.senderPhone && <p className="text-xs sm:text-sm text-gray-600 mb-3">Contact: {message.senderPhone}</p>}

        {selectedMessage === message.id && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button size="sm" onClick={() => handleMarkResolved(message.id)} className="text-xs">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Mark Resolved</span>
                <span className="sm:hidden">Resolved</span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleReportSpam(message.id)} className="text-xs">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Report Spam</span>
                <span className="sm:hidden">Spam</span>
              </Button>
              {message.senderPhone && (
                <Button size="sm" variant="outline" asChild className="text-xs">
                  <a href={`tel:${message.senderPhone}`}>
                    <Reply className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Call Back</span>
                    <span className="sm:hidden">Call</span>
                  </a>
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium">Send Reply:</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply message..."
                rows={3}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => handleReply(message.id)}
                disabled={!replyText.trim() || isReplying}
                className="w-full text-xs sm:text-sm"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <ScanHeader />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Message Center</h1>
          <p className="text-sm sm:text-base text-gray-600">Messages from people who found your items</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Unread Messages</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">{unreadMessages.length}</p>
                </div>
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{messages.length}</p>
                </div>
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 md:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{resolvedMessages.length}</p>
                </div>
                <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Tabs */}
        <Tabs defaultValue="unread" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unread" className="text-xs sm:text-sm">Unread ({unreadMessages.length})</TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">All ({messages.length})</TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs sm:text-sm">Resolved ({resolvedMessages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            {unreadMessages.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No unread messages</h3>
                  <p className="text-xs sm:text-sm text-gray-600">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              unreadMessages.map((message) => <MessageCard key={message.id} message={message} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedMessages.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Check className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No resolved messages</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Resolved messages will appear here</p>
                </CardContent>
              </Card>
            ) : (
              resolvedMessages.map((message) => <MessageCard key={message.id} message={message} />)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
