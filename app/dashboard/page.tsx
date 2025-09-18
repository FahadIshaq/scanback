"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Package,
  QrCode,
  User,
  Scan
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"

interface QRCode {
  _id: string
  code: string
  type: 'item' | 'pet'
  details: {
    name: string
    description?: string
    category?: string
    color?: string
    brand?: string
    model?: string
    species?: string
    breed?: string
    age?: number
  }
  status: string
  isActivated: boolean
  createdAt: string
  scanCount: number
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingQR, setEditingQR] = useState<QRCode | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    color: "",
    brand: "",
    model: "",
    species: "",
    breed: "",
    age: ""
  })
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      loadUserQRCodes()
    }
  }, [user, authLoading, router])

  const loadUserQRCodes = async () => {
    try {
      const response = await apiClient.getUserQRCodes()
      if (response.success) {
        setQrCodes(response.data)
      } else {
        setError(response.message || "Failed to load QR codes")
      }
    } catch (error: any) {
      setError(error.message || "Failed to load QR codes")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (qr: QRCode) => {
    setEditingQR(qr)
    setEditForm({
      name: qr.details.name || "",
      description: qr.details.description || "",
      category: qr.details.category || "",
      color: qr.details.color || "",
      brand: qr.details.brand || "",
      model: qr.details.model || "",
      species: qr.details.species || "",
      breed: qr.details.breed || "",
      age: qr.details.age?.toString() || ""
    })
  }

  const cancelEdit = () => {
    setEditingQR(null)
    setEditForm({
      name: "",
      description: "",
      category: "",
      color: "",
      brand: "",
      model: "",
      species: "",
      breed: "",
      age: ""
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQR) return

    try {
      const response = await apiClient.updateQRCode(editingQR.code, {
        details: {
          ...editForm,
          age: editForm.age ? parseInt(editForm.age) : undefined
        }
      })
      
      if (response.success) {
        setQrCodes(prev => prev.map(qr => 
          qr._id === editingQR._id 
            ? { ...qr, details: { ...qr.details, ...editForm, age: editForm.age ? parseInt(editForm.age) : undefined } }
            : qr
        ))
        setEditingQR(null)
        setEditForm({
          name: "",
          description: "",
          category: "",
          color: "",
          brand: "",
          model: "",
          species: "",
          breed: "",
          age: ""
        })
    } else {
        setError(response.message || "Failed to update QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to update QR code")
    }
  }

  const deleteQRCode = async (qrId: string, qrCode: string) => {
    if (!confirm("Are you sure you want to delete this QR code? This action cannot be undone.")) {
      return
    }

    try {
      const response = await apiClient.deleteQRCode(qrCode)
      
      if (response.success) {
        setQrCodes(prev => prev.filter(qr => qr._id !== qrId))
    } else {
        setError(response.message || "Failed to delete QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete QR code")
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
  )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-blue-600">ScanBack Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{qrCodes.length}</div>
              <div className="text-gray-600">Total QR Codes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {qrCodes.filter(qr => qr.type === 'item').length}
              </div>
              <div className="text-gray-600">Items</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {qrCodes.filter(qr => qr.type === 'pet').length}
              </div>
              <div className="text-gray-600">Pets</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
              </div>
              <div className="text-gray-600">Total Scans</div>
            </CardContent>
          </Card>
        </div>

        {/* QR Codes List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Your QR Codes</CardTitle>
              <span className="text-gray-500 text-sm">
                {qrCodes.length} {qrCodes.length === 1 ? 'code' : 'codes'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {qrCodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-gray-400" />
              </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
                <p className="text-gray-600 mb-4">
                  Scan a QR code to register your first item or pet.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="/">Get Started</a>
                    </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {qrCodes.map((qr) => (
                  <div key={qr._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="capitalize">
                            {qr.type === 'pet' ? (
                              <>
                                <Heart className="h-3 w-3 mr-1" />
                                Pet
                              </>
                            ) : (
                              <>
                                <Package className="h-3 w-3 mr-1" />
                                Item
                              </>
                            )}
                          </Badge>
                          <Badge 
                            variant={qr.status === 'active' ? 'default' : 'secondary'}
                            className={qr.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {qr.status}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {qr.details.name}
                        </h3>
                        {qr.details.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {qr.details.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Code: {qr.code}</span>
                          <span>Scans: {qr.scanCount}</span>
                          <span>Created: {new Date(qr.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
                      <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                          variant="outline"
                          onClick={() => window.open(`http://192.168.0.104:3001/scan/${qr.code}`, '_blank')}
                  >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                          onClick={() => startEdit(qr)}
                  >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                          onClick={() => deleteQRCode(qr._id, qr.code)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                  </Button>
                </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </CardContent>
          </Card>

        {/* Edit Modal */}
        {editingQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  Edit {editingQR.type === 'pet' ? 'Pet' : 'Item'} Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Name *</Label>
                    <Input
                      id="editName"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
          </div>

                  {editingQR.type === 'item' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editCategory">Category</Label>
                          <Input
                            id="editCategory"
                            value={editForm.category}
                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editColor">Color</Label>
                          <Input
                            id="editColor"
                            value={editForm.color}
                            onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editBrand">Brand</Label>
                          <Input
                            id="editBrand"
                            value={editForm.brand}
                            onChange={(e) => setEditForm(prev => ({ ...prev, brand: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editModel">Model</Label>
                          <Input
                            id="editModel"
                            value={editForm.model}
                            onChange={(e) => setEditForm(prev => ({ ...prev, model: e.target.value }))}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="editSpecies">Species</Label>
                          <Input
                            id="editSpecies"
                            value={editForm.species}
                            onChange={(e) => setEditForm(prev => ({ ...prev, species: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="editBreed">Breed</Label>
                          <Input
                            id="editBreed"
                            value={editForm.breed}
                            onChange={(e) => setEditForm(prev => ({ ...prev, breed: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editAge">Age (years)</Label>
                        <Input
                          id="editAge"
                          type="number"
                          value={editForm.age}
                          onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                          min="0"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Save Changes
                  </Button>
                  </div>
                </form>
                </CardContent>
              </Card>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}