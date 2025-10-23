"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Scan,
  Settings,
  X,
  PawPrint,
  Luggage,
  CheckCircle,
  Camera,
  Upload,
  Image as ImageIcon
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import Link from "next/link"

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
    image?: string
    emergencyDetails?: string
    pedigreeInfo?: string
  }
  contact?: {
    name: string
    phone: string
    countryCode: string
    backupPhone?: string
    backupCountryCode?: string
    email: string
    message?: string
  }
  settings?: {
    instantAlerts: boolean
    locationSharing: boolean
    showContactOnFinderPage?: boolean
  }
  status: string
  isActivated: boolean
  createdAt: string
  scanCount: number
  lastScanned?: string
  qrImageUrl?: string
  metadata?: {
    scanHistory: Array<{
      scannedAt: string
      ipAddress: string
      userAgent: string
      location: string
    }>
  }
}

// Country codes for phone number selection
const countryCodes = [
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+39", country: "Vatican City", flag: "🇻🇦" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+39", country: "Vatican City", flag: "🇻🇦" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" }
]

// Phone validation function
const validatePhoneNumber = (phone: string, countryCode: string) => {
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" }
  }

  // Remove any non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Basic validation - at least 7 digits, max 15 digits
  if (cleanPhone.length < 7) {
    return { isValid: false, error: "Phone number too short" }
  }
  
  if (cleanPhone.length > 15) {
    return { isValid: false, error: "Phone number too long" }
  }

  return { isValid: true, error: "" }
}

// Get phone placeholder based on country code
const getPhonePlaceholder = (countryCode: string) => {
  const placeholders: { [key: string]: string } = {
    "+27": "123456789",
    "+1": "1234567890",
    "+44": "1234567890",
    "+49": "123456789",
    "+33": "123456789",
    "+39": "123456789",
    "+34": "123456789",
    "+31": "123456789",
    "+32": "123456789",
    "+41": "123456789",
    "+43": "123456789",
    "+45": "123456789",
    "+46": "123456789",
    "+47": "123456789",
    "+358": "123456789",
    "+48": "123456789",
    "+420": "123456789",
    "+36": "123456789",
    "+40": "123456789",
    "+359": "123456789",
    "+385": "123456789",
    "+386": "123456789",
    "+421": "123456789",
    "+370": "123456789",
    "+371": "123456789",
    "+372": "123456789",
    "+353": "123456789",
    "+351": "123456789",
    "+30": "123456789",
    "+357": "123456789",
    "+356": "123456789",
    "+352": "123456789",
    "+377": "123456789",
    "+378": "123456789",
    "+423": "123456789"
  }
  
  return placeholders[countryCode] || "123456789"
}

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth()
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingQR, setEditingQR] = useState<QRCode | null>(null)
  const [editForm, setEditForm] = useState({
    contact: {
    name: "",
      phone: "",
      countryCode: "+27",
      backupPhone: "",
      backupCountryCode: "+27",
      email: "",
      message: ""
    },
    details: {
      name: "",
      image: "",
      emergencyDetails: "",
      pedigreeInfo: "",
      showEmergencyDetails: false,
      showPedigreeInfo: false
    },
    settings: {
      instantAlerts: true,
      locationSharing: true,
      showContactOnFinderPage: true
    }
  })
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null)
  const [phoneErrors, setPhoneErrors] = useState({ main: "", backup: "" })
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [updatedQR, setUpdatedQR] = useState<QRCode | null>(null)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null)
  const [originalContact, setOriginalContact] = useState<any>(null)
  const [showScanHistoryModal, setShowScanHistoryModal] = useState(false)
  const [showFilteredListModal, setShowFilteredListModal] = useState(false)
  const [filteredListType, setFilteredListType] = useState<'pet' | 'item' | null>(null)
  const [expandedScanHistory, setExpandedScanHistory] = useState<Set<string>>(new Set())
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
      contact: {
        name: qr.contact?.name || "",
        phone: qr.contact?.phone?.replace(qr.contact?.countryCode || "+27", "") || "",
        countryCode: qr.contact?.countryCode || "+27",
        backupPhone: qr.contact?.backupPhone?.replace(qr.contact?.backupCountryCode || "+27", "") || "",
        backupCountryCode: qr.contact?.backupCountryCode || "+27",
        email: qr.contact?.email || "",
        message: qr.contact?.message || ""
      },
      details: {
        name: qr.details.name,
        image: qr.details.image || "",
        emergencyDetails: qr.details.emergencyDetails || "",
        pedigreeInfo: qr.details.pedigreeInfo || "",
        showEmergencyDetails: !!qr.details.emergencyDetails,
        showPedigreeInfo: !!qr.details.pedigreeInfo
      },
      settings: {
        instantAlerts: qr.settings?.instantAlerts ?? true,
        locationSharing: qr.settings?.locationSharing ?? true,
        showContactOnFinderPage: qr.settings?.showContactOnFinderPage ?? true
      }
    })
  }

  const cancelEdit = () => {
    setEditingQR(null)
    setEditForm({
      contact: {
      name: "",
        phone: "",
        countryCode: "+27",
        backupPhone: "",
        backupCountryCode: "+27",
        email: "",
        message: ""
      },
      details: {
        name: "",
        image: "",
        emergencyDetails: "",
        pedigreeInfo: "",
        showEmergencyDetails: false,
        showPedigreeInfo: false
      },
      settings: {
        instantAlerts: true,
        locationSharing: true,
        showContactOnFinderPage: true
      }
    })
    setPhoneErrors({ main: "", backup: "" })
  }

  const openQRModal = (qr: QRCode) => {
    setSelectedQR(qr)
    setShowQRModal(true)
  }

  const closeQRModal = () => {
    setShowQRModal(false)
    setSelectedQR(null)
  }

  const handleTotalScansClick = () => {
    setShowScanHistoryModal(true)
  }

  const handlePetsClick = () => {
    setFilteredListType('pet')
    setShowFilteredListModal(true)
  }

  const handleItemsClick = () => {
    setFilteredListType('item')
    setShowFilteredListModal(true)
  }

  const closeScanHistoryModal = () => {
    setShowScanHistoryModal(false)
  }

  const closeFilteredListModal = () => {
    setShowFilteredListModal(false)
    setFilteredListType(null)
  }

  const toggleScanHistoryExpansion = (qrId: string) => {
    setExpandedScanHistory(prev => {
      const newSet = new Set(prev)
      if (newSet.has(qrId)) {
        newSet.delete(qrId)
      } else {
        newSet.add(qrId)
      }
      return newSet
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      // Convert to base64 data URL directly
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        handleEditInputChange('details.image', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const closeUpdateSuccess = () => {
    setShowUpdateSuccess(false)
    setUpdatedQR(null)
  }

  // Handle input changes for edit form
  const handleEditInputChange = (field: string, value: string | boolean) => {
    const [section, key] = field.split('.')
    
    if (section === 'contact' || section === 'details' || section === 'settings') {
      setEditForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: value
        }
      }))
    }

    // Validate phone numbers in real-time
    if (field === 'contact.phone' && typeof value === 'string') {
      const validation = validatePhoneNumber(value, editForm.contact.countryCode)
      setPhoneErrors(prev => ({
        ...prev,
        main: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.countryCode' && typeof value === 'string') {
      // Re-validate main phone when country changes
      const validation = validatePhoneNumber(editForm.contact.phone, value)
      setPhoneErrors(prev => ({
        ...prev,
        main: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.backupPhone' && typeof value === 'string') {
      const validation = validatePhoneNumber(value, editForm.contact.backupCountryCode)
      setPhoneErrors(prev => ({
        ...prev,
        backup: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.backupCountryCode' && typeof value === 'string') {
      // Re-validate backup phone when country changes
      const validation = validatePhoneNumber(editForm.contact.backupPhone, value)
      setPhoneErrors(prev => ({
        ...prev,
        backup: validation.isValid ? "" : validation.error
      }))
    }
  }

  // Form validation for edit
  const isEditFormValid = () => {
    const { contact, details } = editForm
    
    // Check required fields
    const hasRequiredFields = 
      contact.name.trim() !== '' &&
      contact.email.trim() !== '' &&
      contact.phone.trim() !== '' &&
      details.name.trim() !== ''
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(contact.email)
    
    // Check phone validation
    const mainPhoneValidation = validatePhoneNumber(contact.phone, contact.countryCode)
    const backupPhoneValidation = contact.backupPhone ? 
      validatePhoneNumber(contact.backupPhone, contact.backupCountryCode) : 
      { isValid: true }
    
    return hasRequiredFields && isEmailValid && mainPhoneValidation.isValid && backupPhoneValidation.isValid
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQR) return

    // Final validation check
    const mainPhoneValidation = validatePhoneNumber(editForm.contact.phone, editForm.contact.countryCode)
    const backupPhoneValidation = editForm.contact.backupPhone ? 
      validatePhoneNumber(editForm.contact.backupPhone, editForm.contact.backupCountryCode) : 
      { isValid: true, error: "" }

    if (!mainPhoneValidation.isValid || !backupPhoneValidation.isValid) {
      setPhoneErrors({
        main: mainPhoneValidation.error,
        backup: backupPhoneValidation.error
      })
      return
    }

    // Check if any fields have changed
    const emailChanged = editForm.contact.email !== editingQR.contact?.email
    const phoneChanged = `${editForm.contact.countryCode}${editForm.contact.phone}` !== editingQR.contact?.phone
    const detailsChanged = editForm.details.name !== editingQR.details.name ||
                          editForm.details.image !== editingQR.details.image ||
                          editForm.details.emergencyDetails !== editingQR.details.emergencyDetails ||
                          editForm.details.pedigreeInfo !== editingQR.details.pedigreeInfo
    const settingsChanged = editForm.settings.instantAlerts !== editingQR.settings?.instantAlerts ||
                           editForm.settings.locationSharing !== editingQR.settings?.locationSharing ||
                           editForm.settings.showContactOnFinderPage !== editingQR.settings?.showContactOnFinderPage

    console.log('Change detection:', { 
      emailChanged, 
      phoneChanged,
      detailsChanged,
      settingsChanged,
      currentEmail: editingQR.contact?.email, 
      newEmail: editForm.contact.email,
      currentPhone: editingQR.contact?.phone,
      newPhone: `${editForm.contact.countryCode}${editForm.contact.phone}`
    });

    if (emailChanged || phoneChanged || detailsChanged || settingsChanged) {
      // Prepare update data
      const updateData = {
        contact: {
          ...editForm.contact,
          phone: `${editForm.contact.countryCode}${editForm.contact.phone}`,
          backupPhone: editForm.contact.backupPhone ? `${editForm.contact.backupCountryCode}${editForm.contact.backupPhone}` : undefined
        },
        details: {
          ...editForm.details,
          // Clear emergency details if toggle is disabled
          emergencyDetails: editForm.details.showEmergencyDetails ? editForm.details.emergencyDetails : '',
          // Clear pedigree info if toggle is disabled
          pedigreeInfo: editForm.details.showPedigreeInfo ? editForm.details.pedigreeInfo : ''
        },
        settings: editForm.settings
      }
      
      // Only require OTP verification for contact changes
      if (emailChanged || phoneChanged) {
        // Store original contact for comparison
        setOriginalContact(editingQR.contact)
        setPendingUpdateData(updateData)
        
        // Send OTP for verification
        try {
          setOtpLoading(true)
          setOtpError("")
        
          const otpParams = {
            code: editingQR.code,
            newEmail: emailChanged ? editForm.contact.email : undefined,
            newPhone: phoneChanged ? `${editForm.contact.countryCode}${editForm.contact.phone}` : undefined
          };
          
          console.log('Sending OTP request:', otpParams);
          
          const otpResponse = await apiClient.sendUpdateOTP(
            editingQR.code,
            emailChanged ? editForm.contact.email : undefined,
            phoneChanged ? `${editForm.contact.countryCode}${editForm.contact.phone}` : undefined
          )
          
          console.log('OTP response:', otpResponse);
          
          if (otpResponse.success) {
            setShowOTPVerification(true)
          } else {
            console.error('OTP send failed:', otpResponse);
            setOtpError(otpResponse.message || "Failed to send OTP")
          }
        } catch (error: any) {
          console.error('OTP send error:', error);
          setOtpError(error.message || "Failed to send OTP")
        } finally {
          setOtpLoading(false)
        }
      } else {
        // No contact changes, proceed with direct update
        console.log('No contact changes, proceeding with direct update');
        await performUpdate(updateData)
      }
    } else {
      // No changes detected
      console.log('No changes detected');
    }
  }

  const performUpdate = async (updateData?: any) => {
    const dataToUse = updateData || pendingUpdateData;
    
    if (!editingQR || !dataToUse) {
      return;
    }

    try {
      const response = await apiClient.updateQRCode(editingQR.code, dataToUse)
      
      if (response.success) {
        const updatedQRData = {
          ...editingQR,
          contact: response.data.contact,
          details: response.data.details,
          settings: response.data.settings
        }
        
        setQrCodes(prev => prev.map(qr => 
          qr._id === editingQR._id ? updatedQRData : qr
        ))
        
        // Show success screen with updated QR data
        setUpdatedQR(updatedQRData)
        setShowUpdateSuccess(true)
        setEditingQR(null)
        cancelEdit()
        setShowOTPVerification(false)
        setPendingUpdateData(null)
        setOriginalContact(null)
    } else {
        setError(response.message || "Failed to update QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to update QR code")
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQR || !pendingUpdateData) return

    try {
      setOtpLoading(true)
      setOtpError("")
      
      const response = await apiClient.verifyUpdateOTP(editingQR.code, otpCode, pendingUpdateData)
      
      if (response.success) {
        await performUpdate()
      } else {
        setOtpError(response.message || "Invalid OTP")
      }
    } catch (error: any) {
      setOtpError(error.message || "Failed to verify OTP")
    } finally {
      setOtpLoading(false)
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

  const toggleQRCodeStatus = async (qrId: string, qrCode: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate'
    const confirmMessage = `Are you sure you want to ${action} this QR code?`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await apiClient.toggleQRCodeStatus(qrCode)
      
      if (response.success) {
        setQrCodes(prev => prev.map(qr => 
          qr._id === qrId 
            ? { ...qr, status: response.data.status }
            : qr
        ))
      } else {
        setError(response.message || `Failed to ${action} QR code`)
      }
    } catch (error: any) {
      setError(error.message || `Failed to ${action} QR code`)
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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-black rounded-lg">
                <QrCode className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black text-sm sm:text-base">ScanBack™</span>
                <p className="text-xs text-gray-600 hidden sm:block">Smart Lost & Found QR Tag</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="outline" size="sm" asChild className="px-2 sm:px-3">
                  <Link href="/dashboard/settings">
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Settings</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="px-2 sm:px-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{qrCodes.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total QR Codes</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleItemsClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                {qrCodes.filter(qr => qr.type === 'item').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Items</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handlePetsClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                {qrCodes.filter(qr => qr.type === 'pet').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Pets</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleTotalScansClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Scans</div>
            </CardContent>
          </Card>
        </div>

        {/* QR Codes List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">Your QR Codes</CardTitle>
              <span className="text-gray-500 text-sm">
                {qrCodes.length} {qrCodes.length === 1 ? 'code' : 'codes'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {qrCodes.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No QR Codes Yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                  Scan a QR code to register your first item or pet.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="/">Get Started</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {qrCodes.map((qr) => (
                  <div key={qr._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openQRModal(qr)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <Badge variant="secondary" className="capitalize text-xs">
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
                            className={`text-xs ${qr.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                          >
                            {qr.status}
                          </Badge>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                          {qr.details.name}
                        </h3>
                        
                        {/* Pet Image Display */}
                        {qr.type === 'pet' && qr.details.image && (
                          <div className="mb-2">
                            <img 
                              src={qr.details.image} 
                              alt={qr.details.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        
                        {qr.details.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                            {qr.details.description}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span className="truncate">Code: {qr.code}</span>
                          <span>Scans: {qr.scanCount}</span>
                          <span className="hidden sm:inline">Created: {new Date(qr.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          Created: {new Date(qr.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQRModal(qr);
                          }}
                          className="text-xs px-2 sm:px-3"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(qr);
                          }}
                          className="text-xs px-2 sm:px-3"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQRCodeStatus(qr._id, qr.code, qr.status);
                          }}
                          className={`text-xs px-2 sm:px-3 ${
                            qr.status === 'active' 
                              ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                              : "text-green-600 hover:text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {qr.status === 'active' ? (
                            <>
                              <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Deactivate</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Activate</span>
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQRCode(qr._id, qr.code);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 sm:px-3"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal - Comprehensive Form */}
        {editingQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-black rounded-lg flex-shrink-0">
                    <QrCode className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      Edit {editingQR.type === 'pet' ? 'Pet' : 'Item'} Details
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                      Update all information for this QR code
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6">
                <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                  {/* Contact Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h4>
                    
                    <div>
                      <Label htmlFor="editContactName" className="text-sm">Full Name *</Label>
                      <Input
                        id="editContactName"
                        value={editForm.contact.name}
                        onChange={(e) => handleEditInputChange('contact.name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editPhone" className="text-sm">Phone Number *</Label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Select value={editForm.contact.countryCode} onValueChange={(value) => handleEditInputChange('contact.countryCode', value)}>
                          <SelectTrigger className="w-full sm:w-32 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {countryCodes.map((country) => (
                              <SelectItem key={`main-${country.code}-${country.country}`} value={country.code} className="text-sm">
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span className="font-medium">{country.country}</span>
                                  <span className="font-mono text-gray-500">{country.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Input
                            id="editPhone"
                            type="tel"
                            value={editForm.contact.phone}
                            onChange={(e) => handleEditInputChange('contact.phone', e.target.value)}
                            placeholder={getPhonePlaceholder(editForm.contact.countryCode)}
                            required
                            className={`flex-1 text-sm ${phoneErrors.main ? 'border-red-500 focus:border-red-500' : ''}`}
                          />
                          {phoneErrors.main && (
                            <p className="text-red-500 text-xs mt-1">{phoneErrors.main}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="editBackupPhone" className="text-sm">+ Backup Phone Number (Optional)</Label>
                      <div className="flex flex-col sm:flex-row gap-2 mt-1">
                        <Select value={editForm.contact.backupCountryCode} onValueChange={(value) => handleEditInputChange('contact.backupCountryCode', value)}>
                          <SelectTrigger className="w-full sm:w-32 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {countryCodes.map((country) => (
                              <SelectItem key={`backup-${country.code}-${country.country}`} value={country.code} className="text-sm">
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span className="font-medium">{country.country}</span>
                                  <span className="font-mono text-gray-500">{country.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex-1">
                          <Input
                            id="editBackupPhone"
                            type="tel"
                            value={editForm.contact.backupPhone}
                            onChange={(e) => handleEditInputChange('contact.backupPhone', e.target.value)}
                            placeholder={getPhonePlaceholder(editForm.contact.backupCountryCode)}
                            className={`flex-1 text-sm ${phoneErrors.backup ? 'border-red-500 focus:border-red-500' : ''}`}
                          />
                          {phoneErrors.backup && (
                            <p className="text-red-500 text-xs mt-1">{phoneErrors.backup}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="editEmail" className="text-sm">Email *</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editForm.contact.email}
                        onChange={(e) => handleEditInputChange('contact.email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  {/* Item/Pet Name */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="editName" className="text-sm">{editingQR.type === 'pet' ? 'Pet Name' : 'Item Name'} *</Label>
                      <Input
                        id="editName"
                        value={editForm.details.name}
                        onChange={(e) => handleEditInputChange('details.name', e.target.value)}
                        placeholder={`Enter your ${editingQR.type === 'pet' ? 'pet' : 'item'} name`}
                        required
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editMessage" className="text-sm">Finder Message (Optional)</Label>
                      <Textarea
                        id="editMessage"
                        value={editForm.contact.message}
                        onChange={(e) => handleEditInputChange('contact.message', e.target.value)}
                        placeholder={editForm.details.name ? `Hi! Thanks for finding my ${editForm.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!"}
                        rows={3}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  {/* Pet-specific fields */}
                  {editingQR.type === 'pet' && (
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b pb-2">Pet Details</h4>
                      
                      {/* Pet Image Upload */}
                      <div>
                        <Label className="text-sm">Pet Photo (Optional)</Label>
                        <div className="mt-2">
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            onClick={() => document.getElementById('edit-pet-image-upload')?.click()}
                          >
                            <input
                              id="edit-pet-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            {editForm.details.image ? (
                              <div className="space-y-3">
                                <img 
                                  src={editForm.details.image} 
                                  alt="Pet" 
                                  className="w-24 h-24 object-cover rounded-lg mx-auto"
                                />
                                <p className="text-sm text-gray-600">Click to change photo</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                                  <Camera className="h-8 w-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Upload Image</p>
                                  <p className="text-xs text-gray-500">Tap to select from camera or gallery</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Emergency Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Emergency Details</Label>
                            <p className="text-xs text-gray-600 mt-1">Add medical info, special needs, or emergency contacts</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newValue = !editForm.details.showEmergencyDetails
                              handleEditInputChange('details.showEmergencyDetails', newValue)
                              if (!newValue) {
                                handleEditInputChange('details.emergencyDetails', '')
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              editForm.details.showEmergencyDetails ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            aria-pressed={editForm.details.showEmergencyDetails}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                editForm.details.showEmergencyDetails ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        {editForm.details.showEmergencyDetails && (
                          <div>
                            <Label htmlFor="editEmergencyDetails" className="text-sm">Emergency Details</Label>
                            <Textarea
                              id="editEmergencyDetails"
                              value={editForm.details.emergencyDetails || ''}
                              onChange={(e) => handleEditInputChange('details.emergencyDetails', e.target.value)}
                              placeholder="e.g., Allergic to penicillin, needs medication twice daily, emergency vet contact..."
                              rows={3}
                              className="mt-1 text-sm"
                            />
                          </div>
                        )}
                      </div>

                      {/* Pedigree Information */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Pedigree Information</Label>
                            <p className="text-xs text-gray-600 mt-1">Add breeding, registration, or lineage details</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newValue = !editForm.details.showPedigreeInfo
                              handleEditInputChange('details.showPedigreeInfo', newValue)
                              if (!newValue) {
                                handleEditInputChange('details.pedigreeInfo', '')
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              editForm.details.showPedigreeInfo ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            aria-pressed={editForm.details.showPedigreeInfo}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                editForm.details.showPedigreeInfo ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        {editForm.details.showPedigreeInfo && (
                          <div>
                            <Label htmlFor="editPedigreeInfo" className="text-sm">Pedigree Information</Label>
                            <Textarea
                              id="editPedigreeInfo"
                              value={editForm.details.pedigreeInfo || ''}
                              onChange={(e) => handleEditInputChange('details.pedigreeInfo', e.target.value)}
                              placeholder="e.g., AKC registered, champion bloodline, breeder information..."
                              rows={3}
                              className="mt-1 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toggle Settings */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black">Instant Alerts</Label>
                        <p className="text-xs text-gray-600 mt-1">Get notified on Email when someone finds your item</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditInputChange('settings.instantAlerts', !editForm.settings.instantAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          editForm.settings.instantAlerts ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={editForm.settings.instantAlerts}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editForm.settings.instantAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black">Location Sharing</Label>
                        <p className="text-xs text-gray-600 mt-1">Allow finders to see your approximate location</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditInputChange('settings.locationSharing', !editForm.settings.locationSharing)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          editForm.settings.locationSharing ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={editForm.settings.locationSharing}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editForm.settings.locationSharing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black">Show Contact Information</Label>
                        <p className="text-xs text-gray-600 mt-1">Display your contact details on the finder page</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditInputChange('settings.showContactOnFinderPage', !editForm.settings.showContactOnFinderPage)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                          editForm.settings.showContactOnFinderPage ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={editForm.settings.showContactOnFinderPage}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            editForm.settings.showContactOnFinderPage ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <Button type="button" variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={!isEditFormValid()}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && selectedQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-black rounded-lg flex-shrink-0">
                    <QrCode className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {selectedQR.details.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedQR.type === 'pet' ? 'Pet Tag' : 'Item Tag'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeQRModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6">
                {selectedQR.qrImageUrl ? (
                  <div className="text-center">
                    <img
                      src={selectedQR.qrImageUrl}
                      alt={`QR Code for ${selectedQR.details.name}`}
                      className="mx-auto max-w-full h-auto border border-gray-200 rounded-lg"
                    />
                    <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                      Scan this QR code to view the {selectedQR.type === 'pet' ? 'pet' : 'item'} details
                    </p>
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">QR Code URL:</p>
                      <p className="text-xs sm:text-sm font-mono break-all">
                        {`${process.env.NEXT_PUBLIC_BASE_URL || 'https://scanback.vercel.app'}/scan/${selectedQR.code}`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <QrCode className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">QR Code image not available</p>
                    <p className="text-xs sm:text-sm text-gray-500 break-all">
                      QR Code URL: {`${process.env.NEXT_PUBLIC_BASE_URL || 'https://scanback.vercel.app'}/scan/${selectedQR.code}`}
                    </p>
                  </div>
                )}

                {/* Pet-specific information display */}
                {selectedQR.type === 'pet' && (
                  <div className="mt-4 sm:mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <PawPrint className="h-4 w-4 text-orange-600" />
                      Pet Details
                    </h4>
                    
                    {/* Pet Image */}
                    {selectedQR.details.image && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <Label className="text-xs font-semibold text-gray-700 mb-2 block">Pet Photo</Label>
                        <img 
                          src={selectedQR.details.image} 
                          alt={selectedQR.details.name}
                          className="w-24 h-24 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}


                    {/* Emergency Details */}
                    {selectedQR.details.emergencyDetails && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <Label className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-2">
                          <X className="h-3 w-3" />
                          Emergency Information
                        </Label>
                        <p className="text-red-800 text-xs leading-relaxed">{selectedQR.details.emergencyDetails}</p>
                      </div>
                    )}

                    {/* Pedigree Information */}
                    {selectedQR.details.pedigreeInfo && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Label className="text-xs font-semibold text-blue-700 mb-2 block">Pedigree Information</Label>
                        <p className="text-blue-800 text-xs leading-relaxed">{selectedQR.details.pedigreeInfo}</p>
                      </div>
                    )}

                    {/* Contact Visibility Setting */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">Finder Page Settings</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show contact details to finders</span>
                        <div className={`w-4 h-4 rounded-full ${selectedQR.settings?.showContactOnFinderPage !== false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/scan/${selectedQR.code}`, '_blank')}
                    className="flex-1 text-sm"
                  >
                    <Scan className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Open Scan Page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://scanback.vercel.app'}/scan/${selectedQR.code}`)
                      // You could add a toast notification here
                    }}
                    className="flex-1 text-sm"
                  >
                    Copy URL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTP Verification Modal */}
        {showOTPVerification && editingQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Verify Contact Update</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Enter the OTP sent to your new contact information</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowOTPVerification(false)
                    setOtpCode("")
                    setOtpError("")
                    setPendingUpdateData(null)
                    setOriginalContact(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 sm:p-6">
                <form onSubmit={handleOTPVerification} className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="otp" className="text-sm">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-base sm:text-lg tracking-widest font-mono mt-1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {otpLoading ? "Sending verification code..." : "Check your email for the verification code"}
                    </p>
                  </div>

                  {otpError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                      <p className="text-xs sm:text-sm text-red-600">{otpError}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowOTPVerification(false)
                        setOtpCode("")
                        setOtpError("")
                        setPendingUpdateData(null)
                        setOriginalContact(null)
                      }}
                      className="flex-1 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        if (!editingQR || !pendingUpdateData) return;
                        
                        setOtpLoading(true);
                        setOtpError("");
                        
                        try {
                          const emailChanged = editForm.contact.email !== editingQR.contact?.email;
                          const phoneChanged = `${editForm.contact.countryCode}${editForm.contact.phone}` !== editingQR.contact?.phone;
                          
                          const otpResponse = await apiClient.sendUpdateOTP(
                            editingQR.code,
                            emailChanged ? editForm.contact.email : undefined,
                            phoneChanged ? `${editForm.contact.countryCode}${editForm.contact.phone}` : undefined
                          );
                          
                          if (otpResponse.success) {
                            setOtpError("");
                          } else {
                            setOtpError(otpResponse.message || "Failed to resend OTP");
                          }
                        } catch (error: any) {
                          setOtpError(error.message || "Failed to resend OTP");
                        } finally {
                          setOtpLoading(false);
                        }
                      }}
                      disabled={otpLoading}
                      className="flex-1 text-sm"
                    >
                      {otpLoading ? "Resending..." : "Resend OTP"}
                    </Button>
                    <Button
                      type="submit"
                      disabled={otpLoading || otpCode.length !== 6}
                      className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {otpLoading ? "Verifying..." : "Verify & Update"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Update Success Modal */}
        {showUpdateSuccess && updatedQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">QR Code Updated Successfully!</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Your {updatedQR.type} tag has been updated</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeUpdateSuccess}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Updated QR Code Info */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    {updatedQR.type === 'pet' ? (
                      <PawPrint className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    ) : (
                      <Luggage className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{updatedQR.details.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{updatedQR.type === 'pet' ? 'Pet Tag' : 'Item Tag'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-600">Owner:</span>
                      <span className="ml-2 font-medium">{updatedQR.contact?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium break-all">{updatedQR.contact?.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium break-all">{updatedQR.contact?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Updated Finder Message */}
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">Updated Finder Message</span>
                    <span className="text-xs text-gray-400 hidden sm:inline">Will be shown to finders</span>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                      "{updatedQR.contact?.message || `Hi! Thanks for finding my ${updatedQR.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`}"
                    </p>
                  </div>
                </div>

                {/* Updated Settings */}
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 sm:mb-3">Notification Settings</h4>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-700">Instant Alerts</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${updatedQR.settings?.instantAlerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {updatedQR.settings?.instantAlerts ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-700">Location Sharing</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${updatedQR.settings?.locationSharing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {updatedQR.settings?.locationSharing ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-700">Show Contact Information</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${updatedQR.settings?.showContactOnFinderPage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {updatedQR.settings?.showContactOnFinderPage ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <Button
                    onClick={closeUpdateSuccess}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold text-sm"
                  >
                    Continue to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/scan/${updatedQR.code}`, '_blank')}
                    className="flex-1 text-sm"
                  >
                    <Scan className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View Scan Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan History Modal */}
        {showScanHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Scan className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Scan History & Locations</h3>
                    <p className="text-sm text-gray-600">Track all scans across your QR codes</p>
                  </div>
                </div>
                <button
                  onClick={closeScanHistoryModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {qrCodes.map((qr) => (
                    <div key={qr._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {qr.type === 'pet' ? (
                            <PawPrint className="h-5 w-5 text-orange-600" />
                          ) : (
                            <Luggage className="h-5 w-5 text-green-600" />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900">{qr.details.name}</h4>
                            <p className="text-sm text-gray-600">{qr.type === 'pet' ? 'Pet Tag' : 'Item Tag'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{qr.scanCount}</div>
                          <div className="text-xs text-gray-500">scans</div>
                        </div>
                      </div>
                      
                      {qr.scanCount > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-3 font-medium">Scan History:</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {qr.metadata?.scanHistory && qr.metadata.scanHistory.length > 0 ? (
                              <>
                                {qr.metadata.scanHistory
                                  .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
                                  .slice(0, expandedScanHistory.has(qr._id) ? qr.metadata.scanHistory.length : 5)
                                  .map((scan, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700">
                                          {new Date(scan.scannedAt).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="text-gray-500">
                                        {scan.location !== 'unknown' ? scan.location : 'Unknown location'}
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : (
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Last scanned: {qr.lastScanned ? new Date(qr.lastScanned).toLocaleString() : 'Recently'}</span>
                              </div>
                            )}
                          </div>
                          {qr.metadata?.scanHistory && qr.metadata.scanHistory.length > 5 && (
                            <button
                              onClick={() => toggleScanHistoryExpansion(qr._id)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium transition-colors"
                            >
                              {expandedScanHistory.has(qr._id) 
                                ? 'Show less' 
                                : `+${qr.metadata.scanHistory.length - 5} more scans`
                              }
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-sm text-gray-500">No scans yet</p>
                          <p className="text-xs text-gray-400 mt-1">
                            This QR code hasn't been scanned by anyone yet
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtered List Modal */}
        {showFilteredListModal && filteredListType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${filteredListType === 'pet' ? 'bg-orange-100' : 'bg-green-100'}`}>
                    {filteredListType === 'pet' ? (
                      <PawPrint className="h-6 w-6 text-orange-600" />
                    ) : (
                      <Luggage className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {filteredListType === 'pet' ? 'Pet Tags' : 'Item Tags'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {qrCodes.filter(qr => qr.type === filteredListType).length} {filteredListType === 'pet' ? 'pets' : 'items'} registered
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeFilteredListModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {qrCodes
                    .filter(qr => qr.type === filteredListType)
                    .map((qr) => (
                      <div key={qr._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${qr.isActivated ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {qr.type === 'pet' ? (
                                <PawPrint className={`h-5 w-5 ${qr.isActivated ? 'text-green-600' : 'text-gray-400'}`} />
                              ) : (
                                <Luggage className={`h-5 w-5 ${qr.isActivated ? 'text-green-600' : 'text-gray-400'}`} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{qr.details.name}</h4>
                              <p className="text-sm text-gray-600">
                                {qr.details.description || 'No description'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm px-2 py-1 rounded-full ${
                              qr.isActivated 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {qr.isActivated ? 'Active' : 'Inactive'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {qr.scanCount} scans
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {qrCodes.filter(qr => qr.type === filteredListType).length === 0 && (
                    <div className="text-center py-8">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        filteredListType === 'pet' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {filteredListType === 'pet' ? (
                          <PawPrint className="h-8 w-8 text-orange-600" />
                        ) : (
                          <Luggage className="h-8 w-8 text-green-600" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No {filteredListType === 'pet' ? 'Pet Tags' : 'Item Tags'} Yet
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}