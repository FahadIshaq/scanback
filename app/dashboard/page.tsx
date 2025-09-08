"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, QrCode, Eye, Edit, Power, MoreHorizontal, Search, Download, Heart, Package, Bell, BellOff, Trash2, MessageCircle, Filter, SortAsc, Settings, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { QRLogo } from "@/components/qr-logo"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  // Mock data - in real app, this would be fetched from API
  const tags = [
    {
      id: "1",
      code: "SB-ABC123",
      name: "Luna",
      type: "pet",
      status: "active",
      scans: 3,
      lastScan: "2024-01-20T10:30:00Z",
      createdAt: "2024-01-15",
      breed: "Golden Retriever",
      hasImage: true,
      scanAlerts: true,
      showPhone: true,
      showEmail: true,
    },
    {
      id: "2",
      code: "SB-DEF456",
      name: "House Keys",
      type: "general",
      status: "active",
      scans: 1,
      lastScan: "2024-01-18T14:15:00Z",
      createdAt: "2024-01-10",
      hasImage: false,
      scanAlerts: true,
      showPhone: true,
      showEmail: false,
    },
    {
      id: "3",
      code: "SB-GHI789",
      name: "iPhone 15",
      type: "general",
      status: "active",
      scans: 0,
      lastScan: null,
      createdAt: "2024-01-22",
      hasImage: true,
      scanAlerts: false,
      showPhone: false,
      showEmail: true,
    },
    {
      id: "4",
      code: "SB-JKL012",
      name: "Max",
      type: "pet",
      status: "inactive",
      scans: 5,
      lastScan: "2024-01-19T09:45:00Z",
      createdAt: "2024-01-05",
      breed: "Labrador Mix",
      hasImage: true,
      scanAlerts: true,
      showPhone: true,
      showEmail: true,
    },
  ]

  const filteredTags = tags.filter((tag) => {
    const matchesSearch = 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || tag.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const sortedTags = [...filteredTags].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      case "scans":
        return b.scans - a.scans
      default:
        return 0
    }
  })

  const activeTags = sortedTags.filter((tag) => tag.status === "active")
  const petTags = sortedTags.filter((tag) => tag.type === "pet")
  const generalTags = sortedTags.filter((tag) => tag.type === "general")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pet":
        return <Heart className="h-4 w-4 text-red-500" />
      case "general":
        return <Package className="h-4 w-4 text-gray-600" />
      default:
        return <QrCode className="h-4 w-4 text-gray-500" />
    }
  }

  const formatLastScan = (lastScan: string | null) => {
    if (!lastScan) return "Never"
    const date = new Date(lastScan)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      // Use consistent date formatting to avoid hydration mismatch
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${day}/${month}/${year}`
    }
  }

  const handleTagSelection = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags((prev) => [...prev, tagId])
    } else {
      setSelectedTags((prev) => prev.filter((id) => id !== tagId))
    }
  }

  const handleSelectAll = () => {
    if (selectedTags.length === sortedTags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(sortedTags.map((tag) => tag.id))
    }
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "export":
        router.push(`/dashboard/stickers?tags=${selectedTags.join(",")}`)
        break
      case "activate":
        alert(`Activating ${selectedTags.length} tags`)
        setSelectedTags([])
        break
      case "deactivate":
        alert(`Deactivating ${selectedTags.length} tags`)
        setSelectedTags([])
        break
      case "delete":
        if (confirm(`Delete ${selectedTags.length} tags permanently?`)) {
          alert(`Deleting ${selectedTags.length} tags`)
          setSelectedTags([])
        }
        break
    }
  }

  const TagCard = ({ tag }: { tag: any }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md rounded-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Checkbox
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={(checked) => handleTagSelection(tag.id, checked as boolean)}
              className="mt-1"
            />
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl">
              {getTypeIcon(tag.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h3 className="font-semibold text-navy-900 text-base sm:text-lg truncate">{tag.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="capitalize border-gray-200 text-gray-600 text-xs">
                    {tag.type}
                  </Badge>
                  <Badge className={`${getStatusColor(tag.status)} text-xs`}>{tag.status}</Badge>
                  {tag.scanAlerts ? (
                    <Bell className="h-3 w-3 text-green-500" />
                  ) : (
                    <BellOff className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-mono mb-2 break-all">{tag.code}</p>
              {tag.type === "pet" && tag.breed && <p className="text-xs text-gray-500 mb-2">{tag.breed}</p>}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{tag.scans} scans</span>
                </span>
                <span>Last: {formatLastScan(tag.lastScan)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span>
                  Contact:{" "}
                  {[tag.showPhone && "Phone", tag.showEmail && "Email"].filter(Boolean).join(", ") ||
                    "Secure form only"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-xs"
              asChild
            >
              <Link href={`/scan/${tag.code}`}>
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                View
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-xs"
                >
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/edit/${tag.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Tag
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/history/${tag.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Scan History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/stickers?tag=${tag.id}`}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Sticker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Power className="h-4 w-4 mr-2" />
                  {tag.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <QRLogo />
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-semibold text-navy-900">My Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl hidden sm:flex"
                asChild
              >
                <Link href="/dashboard/messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl"
                  >
                    <User className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm sm:text-base" asChild>
                <Link href="/dashboard/register">
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  {/* <span className="hidden sm:inline">Add New Tag</span> */}
                  <span className="sm:hidden">Add</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-md rounded-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tags</p>
                  <p className="text-2xl sm:text-3xl font-bold text-navy-900">{tags.length}</p>
                </div>
                <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Tags</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {tags.filter((tag) => tag.status === "active").length}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Power className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pet Tags</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">{tags.filter((tag) => tag.type === "pet").length}</p>
                </div>
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md rounded-xl">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-2xl sm:text-3xl font-bold text-navy-900">{tags.reduce((sum, tag) => sum + tag.scans, 0)}</p>
                </div>
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-navy-900" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-0 shadow-md rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tags by name, code, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-400 rounded-xl"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Tags</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Only</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Only</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-sm">
                      <SortAsc className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl">
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>Name A-Z</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("scans")}>Most Scanned</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTags.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200 rounded-xl">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <span className="text-sm font-medium text-blue-900 text-center sm:text-left">
                  {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("export")}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Download Stickers</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("activate")}
                    className="border-blue-300 text-blue-700 rounded-xl text-xs"
                  >
                    <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Activate</span>
                    <span className="sm:hidden">Activate</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("deactivate")}
                    className="border-blue-300 text-blue-700 rounded-xl text-xs"
                  >
                    <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Deactivate</span>
                    <span className="sm:hidden">Deactivate</span>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} className="rounded-xl text-xs">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                    <span className="sm:hidden">Delete</span>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedTags([])} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <TabsList className="grid w-full grid-cols-4 rounded-xl">
              <TabsTrigger value="all" className="rounded-xl text-xs sm:text-sm">All Tags ({sortedTags.length})</TabsTrigger>
              <TabsTrigger value="active" className="rounded-xl text-xs sm:text-sm">Active ({activeTags.length})</TabsTrigger>
              <TabsTrigger value="pets" className="rounded-xl text-xs sm:text-sm">Pets ({petTags.length})</TabsTrigger>
              <TabsTrigger value="general" className="rounded-xl text-xs sm:text-sm">General ({generalTags.length})</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-xs sm:text-sm"
            >
              {selectedTags.length === sortedTags.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4">
            {sortedTags.length === 0 ? (
              <Card className="border-0 shadow-md rounded-xl">
                <CardContent className="p-8 text-center">
                  <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-navy-900 mb-2">
                    {searchTerm ? "No tags found" : "No tags yet"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "Try adjusting your search terms" : "Get started by registering your first QR tag"}
                  </p>
                  {!searchTerm && (
                    <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl" asChild>
                      <Link href="/dashboard/register">
                        <Plus className="h-4 w-4 mr-2" />
                        Register First Tag
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              sortedTags.map((tag) => <TagCard key={tag.id} tag={tag} />)
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </TabsContent>

          <TabsContent value="pets" className="space-y-4">
            {petTags.length === 0 ? (
              <Card className="border-0 shadow-md rounded-xl">
                <CardContent className="p-8 text-center">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-navy-900 mb-2">No pet tags yet</h3>
                  <p className="text-gray-600 mb-4">Create a special tag for your beloved pet</p>
                  <Button className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl" asChild>
                    <Link href="/dashboard/register?type=pet">
                      <Heart className="h-4 w-4 mr-2" />
                      Add Pet Tag
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              petTags.map((tag) => <TagCard key={tag.id} tag={tag} />)
            )}
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            {generalTags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="font-semibold text-navy-900 mb-4 text-base sm:text-lg">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-sm"
              asChild
            >
              <Link href="/dashboard/stickers">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download All Stickers</span>
                <span className="sm:hidden">Download Stickers</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-sm"
              asChild
            >
              <Link href="/dashboard/messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Message Center</span>
                <span className="sm:hidden">Messages</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent rounded-xl text-sm"
              asChild
            >
              <Link href="/contact">
                <span className="hidden sm:inline">Contact Support</span>
                <span className="sm:hidden">Support</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
