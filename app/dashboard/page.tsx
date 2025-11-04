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
  QrCode,
  User,
  Scan,
  Settings,
  X,
  PawPrint,
  CheckCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Tag,
  Star,
  Info
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import PhoneInput from "@/components/phone-input"
import { getCountryCallingCode, parsePhoneNumber } from "libphonenumber-js"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface QRCode {
  _id: string
  code: string
  type: 'item' | 'pet' | 'emergency'
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
    // Emergency Details fields
    medicalAidProvider?: string
    medicalAidNumber?: string
    bloodType?: string
    allergies?: string
    medications?: string
    organDonor?: boolean
    iceNote?: string
    emergencyContact1Name?: string
    emergencyContact1Phone?: string
    emergencyContact1CountryCode?: string
    emergencyContact2Name?: string
    emergencyContact2Phone?: string
    emergencyContact2CountryCode?: string
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
      description: "",
      category: "",
      color: "",
      brand: "",
      model: "",
      image: "",
      emergencyDetails: "",
      pedigreeInfo: "",
      // Pet fields
      medicalNotes: "",
      vetName: "",
      vetPhone: "",
      vetCountryCode: "ZA",
      emergencyContact: "",
      emergencyCountryCode: "ZA",
      breed: "",
      age: "",
      registrationNumber: "",
      breederInfo: "",
      // Emergency fields
      medicalAidProvider: "",
      medicalAidNumber: "",
      bloodType: "",
      allergies: "",
      medications: "",
      organDonor: false,
      iceNote: "",
      emergencyContact1Name: "",
      emergencyContact1Phone: "",
      emergencyContact1CountryCode: "ZA",
      emergencyContact1Relation: "",
      emergencyContact2Name: "",
      emergencyContact2Phone: "",
      emergencyContact2CountryCode: "ZA",
      emergencyContact2Relation: "",
      // Toggle states
      showEmergencyDetails: false,
      showPedigreeInfo: false,
      showEmergencyMedicalDetails: false,
      showEmergencyContacts: false
    },
    settings: {
      instantAlerts: true,
      locationSharing: true,
      showContactOnFinderPage: true,
      useBackupNumber: true
    }
  })
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
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
  const [selectedQRForScanHistory, setSelectedQRForScanHistory] = useState<QRCode | null>(null)
  const [showFilteredListModal, setShowFilteredListModal] = useState(false)
  const [filteredListType, setFilteredListType] = useState<'pet' | 'item' | 'emergency' | null>(null)
  const [expandedScanHistory, setExpandedScanHistory] = useState<Set<string>>(new Set())
  const [recentScansCount, setRecentScansCount] = useState<number>(0)
  const [recentScansLoading, setRecentScansLoading] = useState(false)
  const [showRecentScansOnly, setShowRecentScansOnly] = useState(false)
  const [backupPhoneTooltipOpen, setBackupPhoneTooltipOpen] = useState(false)
  const [emergencyContact1TooltipOpen, setEmergencyContact1TooltipOpen] = useState(false)
  const [emergencyContact2TooltipOpen, setEmergencyContact2TooltipOpen] = useState(false)
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false)
  const [showPedigreeInfo, setShowPedigreeInfo] = useState(false)
  const [showEmergencyMedicalDetails, setShowEmergencyMedicalDetails] = useState(false)
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [editMessageClicked, setEditMessageClicked] = useState(false)
  const [vetPhoneError, setVetPhoneError] = useState("")
  const [emergencyPhoneError, setEmergencyPhoneError] = useState("")
  const [emergencyContact1PhoneError, setEmergencyContact1PhoneError] = useState("")
  const [emergencyContact2PhoneError, setEmergencyContact2PhoneError] = useState("")
  const [ageError, setAgeError] = useState("")
  const isMobile = useIsMobile()
  const router = useRouter()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'activate'|'deactivate'>('deactivate')
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; code: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      loadUserQRCodes()
      loadRecentScansCount()
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

  const loadRecentScansCount = async () => {
    try {
      setRecentScansLoading(true)
      const response = await apiClient.getRecentScansCount()
      if (response.success) {
        setRecentScansCount(response.data.count || 0)
      }
    } catch (error: any) {
      console.error('Failed to load recent scans count:', error)
      setRecentScansCount(0)
    } finally {
      setRecentScansLoading(false)
    }
  }

  // Helper function to extract phone number and country code
  const parsePhoneNumberFromStored = (phone: string | undefined): { phone: string; countryCode: string } => {
    if (!phone) return { phone: "", countryCode: "ZA" }
    try {
      const parsed = parsePhoneNumber(phone, "ZA")
      if (parsed) {
        return {
          phone: parsed.nationalNumber,
          countryCode: (parsed as any).countryCode || "ZA"
        }
      }
    } catch (e) {
      // Fallback: try to extract manually
      const match = phone.match(/^\+(\d+)(.+)$/)
      if (match) {
        const countryCode = match[1]
        const nationalNumber = match[2]
        // Find matching country code
        const country = countryCodes.find(c => c.code === `+${countryCode}`)
        if (country) {
          return { phone: nationalNumber, countryCode: country.code }
        }
      }
    }
    // Default fallback
    const withoutPlus = phone.replace(/^\+/, "")
    return { phone: withoutPlus.replace(/^\d{1,3}/, ""), countryCode: "+27" as any }
  }

  const startEdit = (qr: QRCode) => {
    setEditingQR(qr)
    
    // Parse phone numbers
    const mainPhone = parsePhoneNumberFromStored(qr.contact?.phone)
    const backupPhone = parsePhoneNumberFromStored(qr.contact?.backupPhone)
    const vetPhone = parsePhoneNumberFromStored((qr.details as any)?.vetPhone)
    const emergencyContact = parsePhoneNumberFromStored((qr.details as any)?.emergencyContact)
    const emergencyContact1 = parsePhoneNumberFromStored(qr.details?.emergencyContact1Phone)
    const emergencyContact2 = parsePhoneNumberFromStored(qr.details?.emergencyContact2Phone)
    
    setEditForm({
      contact: {
        name: qr.contact?.name || "",
        phone: mainPhone.phone,
        countryCode: qr.contact?.countryCode || mainPhone.countryCode || "+27",
        backupPhone: backupPhone.phone,
        backupCountryCode: qr.contact?.backupCountryCode || backupPhone.countryCode || "+27",
        email: qr.contact?.email || "",
        message: qr.contact?.message || ""
      },
      details: {
        name: qr.details.name || "",
        description: qr.details.description || "",
        category: qr.details.category || "",
        color: qr.details.color || "",
        brand: qr.details.brand || "",
        model: qr.details.model || "",
        image: qr.details.image || "",
        emergencyDetails: qr.details.emergencyDetails || "",
        pedigreeInfo: qr.details.pedigreeInfo || "",
        // Pet fields
        medicalNotes: (qr.details as any).medicalNotes || "",
        vetName: (qr.details as any).vetName || "",
        vetPhone: vetPhone.phone,
        vetCountryCode: (qr.details as any).vetCountryCode || vetPhone.countryCode || "ZA",
        emergencyContact: emergencyContact.phone,
        emergencyCountryCode: (qr.details as any).emergencyCountryCode || emergencyContact.countryCode || "ZA",
        breed: (qr.details as any).breed || "",
        age: (qr.details as any).age || "",
        registrationNumber: (qr.details as any).registrationNumber || "",
        breederInfo: (qr.details as any).breederInfo || "",
        // Emergency fields
        medicalAidProvider: (qr.details as any).medicalAidProvider || "",
        medicalAidNumber: (qr.details as any).medicalAidNumber || "",
        bloodType: (qr.details as any).bloodType || "",
        allergies: (qr.details as any).allergies || "",
        medications: (qr.details as any).medications || "",
        organDonor: (qr.details as any).organDonor || false,
        iceNote: (qr.details as any).iceNote || "",
        emergencyContact1Name: (qr.details as any).emergencyContact1Name || "",
        emergencyContact1Phone: emergencyContact1.phone,
        emergencyContact1CountryCode: (qr.details as any).emergencyContact1CountryCode || emergencyContact1.countryCode || "ZA",
        emergencyContact1Relation: (qr.details as any).emergencyContact1Relation || "",
        emergencyContact2Name: (qr.details as any).emergencyContact2Name || "",
        emergencyContact2Phone: emergencyContact2.phone,
        emergencyContact2CountryCode: (qr.details as any).emergencyContact2CountryCode || emergencyContact2.countryCode || "ZA",
        emergencyContact2Relation: (qr.details as any).emergencyContact2Relation || "",
        // Toggle states are managed separately via state variables
        showEmergencyDetails: false, // Not stored in form
        showPedigreeInfo: false, // Not stored in form
        showEmergencyMedicalDetails: false, // Not stored in form
        showEmergencyContacts: false // Not stored in form
      },
      settings: {
        instantAlerts: qr.settings?.instantAlerts ?? true,
        locationSharing: qr.settings?.locationSharing ?? true,
        showContactOnFinderPage: qr.settings?.showContactOnFinderPage ?? true,
        useBackupNumber: (qr.settings as any)?.useBackupNumber ?? true
      }
    })
    
    // Set toggle states for edit modal
    setShowEmergencyDetails(!!((qr.details as any).emergencyDetails || (qr.details as any).medicalNotes || (qr.details as any).vetName || (qr.details as any).emergencyContact))
    setShowPedigreeInfo(!!(qr.details.pedigreeInfo || (qr.details as any).breed || (qr.details as any).age || (qr.details as any).registrationNumber || (qr.details as any).breederInfo))
    setShowEmergencyMedicalDetails(!!((qr.details as any).medicalAidProvider || (qr.details as any).medicalAidNumber || (qr.details as any).bloodType || (qr.details as any).allergies || (qr.details as any).medications || (qr.details as any).organDonor))
    setShowEmergencyContacts(!!((qr.details as any).emergencyContact1Name || (qr.details as any).emergencyContact2Name))
    setEditMessageClicked(!!qr.contact?.message)
    
    // Set image preview if exists
    setEditImagePreview(qr.details.image || null)
  }

  // Helper to update nested edit form fields
  const updateEditFormField = (path: string, value: any) => {
    setEditForm(prev => {
      const parts = path.split('.')
      if (parts.length === 2) {
        const [section, key] = parts
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [key]: value
          }
        }
      } else if (parts.length === 3 && parts[0] === 'details') {
        // Handle nested details fields like details.emergencyContact1Phone
        return {
          ...prev,
          details: {
            ...prev.details,
            [parts[1] + parts[2].charAt(0).toUpperCase() + parts[2].slice(1)]: value
          }
        }
      }
      return prev
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
        description: "",
        category: "",
        color: "",
        brand: "",
        model: "",
        image: "",
        emergencyDetails: "",
        pedigreeInfo: "",
        medicalNotes: "",
        vetName: "",
        vetPhone: "",
        vetCountryCode: "ZA",
        emergencyContact: "",
        emergencyCountryCode: "ZA",
        breed: "",
        age: "",
        registrationNumber: "",
        breederInfo: "",
        medicalAidProvider: "",
        medicalAidNumber: "",
        bloodType: "",
        allergies: "",
        medications: "",
        organDonor: false,
        iceNote: "",
        emergencyContact1Name: "",
        emergencyContact1Phone: "",
        emergencyContact1CountryCode: "ZA",
        emergencyContact1Relation: "",
        emergencyContact2Name: "",
        emergencyContact2Phone: "",
        emergencyContact2CountryCode: "ZA",
        emergencyContact2Relation: "",
        showEmergencyDetails: false,
        showPedigreeInfo: false,
        showEmergencyMedicalDetails: false,
        showEmergencyContacts: false
      },
      settings: {
        instantAlerts: true,
        locationSharing: true,
        showContactOnFinderPage: true,
        useBackupNumber: true
      }
    })
    setEditImagePreview(null)
    setPhoneErrors({ main: "", backup: "" })
    setShowEmergencyDetails(false)
    setShowPedigreeInfo(false)
    setShowEmergencyMedicalDetails(false)
    setShowEmergencyContacts(false)
    setEditMessageClicked(false)
    setVetPhoneError("")
    setEmergencyPhoneError("")
    setEmergencyContact1PhoneError("")
    setEmergencyContact2PhoneError("")
    setAgeError("")
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
    setSelectedQRForScanHistory(null)
    setShowRecentScansOnly(false)
    setShowScanHistoryModal(true)
  }

  const handleRecentScansClick = () => {
    setSelectedQRForScanHistory(null)
    setShowRecentScansOnly(true)
    setShowScanHistoryModal(true)
  }

  const openScanHistoryForQR = (qr: QRCode) => {
    setSelectedQRForScanHistory(qr)
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

  const handleEmergencyClick = () => {
    setFilteredListType('emergency')
    setShowFilteredListModal(true)
  }

  const closeScanHistoryModal = () => {
    setShowScanHistoryModal(false)
    setSelectedQRForScanHistory(null)
    setShowRecentScansOnly(false)
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
        setEditImagePreview(result) // Also set preview
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
    const parts = field.split('.')
    
    if (parts.length === 2) {
      // Simple two-level nesting (e.g., 'contact.name', 'details.name')
      const [section, key] = parts
    if (section === 'contact' || section === 'details' || section === 'settings') {
      setEditForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [key]: value
        }
      }))
    }
    } else if (parts.length === 1) {
      // Direct field access (shouldn't happen but handle it)
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
    // Note: For deeply nested fields like 'details.emergencyContact1Phone', 
    // we handle them explicitly below in the edit modal with direct state updates

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
      const validation = validatePhoneNumber(value, editForm.contact.backupCountryCode || editForm.contact.countryCode)
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
      validatePhoneNumber(contact.backupPhone, contact.backupCountryCode || contact.countryCode) : 
      { isValid: true }
    
    return hasRequiredFields && isEmailValid && mainPhoneValidation.isValid && backupPhoneValidation.isValid
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQR) {
      console.log('No QR code being edited, aborting submit')
      return
    }

    console.log('handleEditSubmit called', { code: editingQR.code, type: editingQR.type })

    // Final validation check
    const mainPhoneValidation = validatePhoneNumber(editForm.contact.phone, editForm.contact.countryCode)
    const backupPhoneValidation = editForm.contact.backupPhone ? 
      validatePhoneNumber(editForm.contact.backupPhone, editForm.contact.backupCountryCode || editForm.contact.countryCode) : 
      { isValid: true, error: "" }

    if (!mainPhoneValidation.isValid || !backupPhoneValidation.isValid) {
      setPhoneErrors({
        main: mainPhoneValidation.error,
        backup: backupPhoneValidation.error
      })
      return
    }

    // Check if any fields have changed (comprehensive check)
    // Phone and email changes are not allowed - always false
    const emailChanged = false
    const phoneChanged = false
    const detailsChanged = 
      editForm.details.name !== (editingQR.details.name || '') ||
      editForm.details.image !== (editingQR.details.image || '') ||
      editForm.details.description !== (editingQR.details.description || '') ||
      editForm.details.category !== (editingQR.details.category || '') ||
      editForm.details.color !== (editingQR.details.color || '') ||
      editForm.details.brand !== (editingQR.details.brand || '') ||
      editForm.details.model !== (editingQR.details.model || '') ||
      // Pet fields
      editForm.details.breed !== ((editingQR.details as any).breed || '') ||
      editForm.details.age !== ((editingQR.details as any).age || '') ||
      editForm.details.registrationNumber !== ((editingQR.details as any).registrationNumber || '') ||
      editForm.details.breederInfo !== ((editingQR.details as any).breederInfo || '') ||
      editForm.details.medicalNotes !== ((editingQR.details as any).medicalNotes || '') ||
      editForm.details.vetName !== ((editingQR.details as any).vetName || '') ||
      (editForm.details.vetPhone ? `+${getCountryCallingCode(editForm.details.vetCountryCode as any)}${editForm.details.vetPhone}` : '') !== ((editingQR.details as any).vetPhone || '') ||
      (editForm.details.emergencyContact ? `+${getCountryCallingCode(editForm.details.emergencyCountryCode as any)}${editForm.details.emergencyContact}` : '') !== ((editingQR.details as any).emergencyContact || '') ||
      editForm.details.emergencyDetails !== (editingQR.details.emergencyDetails || '') ||
      editForm.details.pedigreeInfo !== (editingQR.details.pedigreeInfo || '') ||
      // Emergency fields
      editForm.details.medicalAidProvider !== ((editingQR.details as any).medicalAidProvider || '') ||
      editForm.details.medicalAidNumber !== ((editingQR.details as any).medicalAidNumber || '') ||
      editForm.details.bloodType !== ((editingQR.details as any).bloodType || '') ||
      editForm.details.allergies !== ((editingQR.details as any).allergies || '') ||
      editForm.details.medications !== ((editingQR.details as any).medications || '') ||
      editForm.details.organDonor !== ((editingQR.details as any).organDonor || false) ||
      editForm.details.iceNote !== ((editingQR.details as any).iceNote || '') ||
      editForm.details.emergencyContact1Name !== ((editingQR.details as any).emergencyContact1Name || '') ||
      (editForm.details.emergencyContact1Phone ? `+${getCountryCallingCode(editForm.details.emergencyContact1CountryCode as any)}${editForm.details.emergencyContact1Phone}` : '') !== ((editingQR.details as any).emergencyContact1Phone || '') ||
      editForm.details.emergencyContact1Relation !== ((editingQR.details as any).emergencyContact1Relation || '') ||
      editForm.details.emergencyContact2Name !== ((editingQR.details as any).emergencyContact2Name || '') ||
      (editForm.details.emergencyContact2Phone ? `+${getCountryCallingCode(editForm.details.emergencyContact2CountryCode as any)}${editForm.details.emergencyContact2Phone}` : '') !== ((editingQR.details as any).emergencyContact2Phone || '') ||
      editForm.details.emergencyContact2Relation !== ((editingQR.details as any).emergencyContact2Relation || '') ||
      editForm.contact.message !== (editingQR.contact?.message || '')

    const settingsChanged = 
      editForm.settings.instantAlerts !== (editingQR.settings?.instantAlerts ?? true) ||
      editForm.settings.locationSharing !== (editingQR.settings?.locationSharing ?? true) ||
      editForm.settings.showContactOnFinderPage !== (editingQR.settings?.showContactOnFinderPage ?? true) ||
      editForm.settings.useBackupNumber !== ((editingQR.settings as any)?.useBackupNumber ?? true)

    // Check for other contact changes (backup phone, name, message) - these are allowed but may need OTP
    // Parse stored backup phone to get national number for comparison
    const storedBackupPhone = parsePhoneNumberFromStored(editingQR.contact?.backupPhone)
    const otherContactChanged = 
      editForm.contact.name !== (editingQR.contact?.name || '') ||
      editForm.contact.message !== (editingQR.contact?.message || '') ||
      editForm.contact.backupPhone !== storedBackupPhone.phone ||
      editForm.contact.backupCountryCode !== (editingQR.contact?.backupCountryCode || storedBackupPhone.countryCode)

    // Include otherContactChanged in the main condition so backup phone changes trigger updates
    console.log('Change detection:', {
      emailChanged,
      phoneChanged,
      detailsChanged,
      settingsChanged,
      otherContactChanged,
      backupPhoneInForm: editForm.contact.backupPhone,
      backupPhoneStored: storedBackupPhone.phone
    })
    
    if (emailChanged || phoneChanged || detailsChanged || settingsChanged || otherContactChanged) {
      console.log('Changes detected, preparing update data')
      // Prepare update data with all fields
      const updateData: any = {
        contact: {
          name: editForm.contact.name,
          message: editForm.contact.message,
          // Phone and email are not updated - they remain unchanged
          // Include backupPhone for all tag types if provided, or explicitly clear it if removed
          ...(editForm.contact.backupPhone ? {
            backupPhone: `+${getCountryCallingCode(editForm.contact.backupCountryCode as any)}${editForm.contact.backupPhone}`,
            backupCountryCode: editForm.contact.backupCountryCode
          } : storedBackupPhone.phone ? {
            // If there was a backup phone before but it's now empty, explicitly clear it
            backupPhone: '',
            backupCountryCode: ''
          } : {})
        },
        details: {
          ...editForm.details,
          vetCountryCode: editForm.details.vetCountryCode,
          emergencyCountryCode: editForm.details.emergencyCountryCode,
          emergencyContact1CountryCode: editForm.details.emergencyContact1CountryCode,
          emergencyContact2CountryCode: editForm.details.emergencyContact2CountryCode,
          // Format phone numbers with country codes and conditionally include based on toggles
          vetPhone: showEmergencyDetails && editForm.details.vetPhone ? `+${getCountryCallingCode(editForm.details.vetCountryCode as any)}${editForm.details.vetPhone}` : undefined,
          emergencyContact: showEmergencyDetails && editForm.details.emergencyContact ? `+${getCountryCallingCode(editForm.details.emergencyCountryCode as any)}${editForm.details.emergencyContact}` : undefined,
          medicalNotes: showEmergencyDetails ? editForm.details.medicalNotes : '',
          vetName: showEmergencyDetails ? editForm.details.vetName : '',
          emergencyDetails: showEmergencyDetails ? editForm.details.emergencyDetails : '',
          breed: showPedigreeInfo ? editForm.details.breed : '',
          age: showPedigreeInfo ? editForm.details.age : '',
          registrationNumber: showPedigreeInfo ? editForm.details.registrationNumber : '',
          breederInfo: showPedigreeInfo ? editForm.details.breederInfo : '',
          pedigreeInfo: showPedigreeInfo ? editForm.details.pedigreeInfo : '',
          medicalAidProvider: showEmergencyMedicalDetails ? editForm.details.medicalAidProvider : '',
          medicalAidNumber: showEmergencyMedicalDetails ? editForm.details.medicalAidNumber : '',
          bloodType: showEmergencyMedicalDetails ? editForm.details.bloodType : '',
          allergies: showEmergencyMedicalDetails ? editForm.details.allergies : '',
          medications: showEmergencyMedicalDetails ? editForm.details.medications : '',
          organDonor: showEmergencyMedicalDetails ? editForm.details.organDonor : false,
          iceNote: editForm.details.iceNote || '',
          emergencyContact1Name: showEmergencyContacts ? editForm.details.emergencyContact1Name : '',
          emergencyContact1Phone: showEmergencyContacts && editForm.details.emergencyContact1Phone ? `+${getCountryCallingCode(editForm.details.emergencyContact1CountryCode as any)}${editForm.details.emergencyContact1Phone}` : undefined,
          emergencyContact1Relation: showEmergencyContacts ? editForm.details.emergencyContact1Relation : '',
          emergencyContact2Name: showEmergencyContacts ? editForm.details.emergencyContact2Name : '',
          emergencyContact2Phone: showEmergencyContacts && editForm.details.emergencyContact2Phone ? `+${getCountryCallingCode(editForm.details.emergencyContact2CountryCode as any)}${editForm.details.emergencyContact2Phone}` : undefined,
          emergencyContact2Relation: showEmergencyContacts ? editForm.details.emergencyContact2Relation : ''
        },
        settings: {
          instantAlerts: editForm.settings.instantAlerts,
          locationSharing: editForm.settings.locationSharing,
          showContactOnFinderPage: editForm.settings.showContactOnFinderPage,
          useBackupNumber: editForm.settings.useBackupNumber
        }
      }
      
      // Don't allow phone or email changes - remove them from updateData
      delete updateData.contact.phone
      delete updateData.contact.email
      delete updateData.contact.countryCode
      
      // Only require OTP verification for other contact changes (backup phone, name, message)
      
      if (otherContactChanged && editingQR.type !== 'emergency') {
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
        // Ensure we have all fields from the response
        const updatedQRData = response.data ? {
          ...editingQR,
          ...response.data,
          // Ensure nested objects are properly merged
          contact: response.data.contact ? { ...editingQR.contact, ...response.data.contact } : editingQR.contact,
          details: response.data.details ? { ...editingQR.details, ...response.data.details } : editingQR.details,
          settings: response.data.settings ? { ...editingQR.settings, ...response.data.settings } : editingQR.settings
        } : editingQR
        
        // Update the QR code in the list immediately
        setQrCodes(prev => prev.map(qr => 
          qr.code === editingQR.code || qr._id === editingQR._id
            ? updatedQRData
            : qr
        ))
        
        // Show success screen with updated QR data
        setUpdatedQR(updatedQRData)
        setShowUpdateSuccess(true)
        setEditingQR(null)
        cancelEdit()
        setShowOTPVerification(false)
        setPendingUpdateData(null)
        setOriginalContact(null)
        
        // Reload QR codes in background to ensure all data is fresh and properly structured
        loadUserQRCodes().catch(err => {
          console.error('Error reloading QR codes:', err)
        })
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

  const toggleQRCodeStatus = (qrId: string, qrCode: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate'
    setConfirmAction(action)
    setConfirmTarget({ id: qrId, code: qrCode })
    setConfirmModalOpen(true)
  }

  const confirmToggle = async () => {
    if (!confirmTarget) return
    try {
      const response = await apiClient.toggleQRCodeStatus(confirmTarget.code)
      if (response.success) {
        setQrCodes(prev => prev.map(qr => 
          qr._id === confirmTarget.id 
            ? { ...qr, status: response.data.status }
            : qr
        ))
      } else {
        setError(response.message || `Failed to ${confirmAction} QR code`)
      }
    } catch (error: any) {
      setError(error.message || `Failed to ${confirmAction} QR code`)
    } finally {
      setConfirmModalOpen(false)
      setConfirmTarget(null)
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScanHeader />
      {/* Actions are now in ScanHeader for dashboard; remove duplicate bar */}

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl flex-1">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Top Section - Welcome with Dashboard Button */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white opacity-5 rounded-full -ml-14 -mb-14"></div>
            <div className="relative z-0 space-y-4">
              {/* Welcome Message */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Icon - Squircle with blue gradient and checkmark */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
              </div>
                {/* Welcome Text */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight flex-1">
                  <span className="text-white">Welcome back, </span>
                  <span className="bg-white bg-clip-text text-transparent">
                    {user?.name ? user.name.split(' ')[0] : 'there'}
                  </span>
                </h1>
              </div>
              
              {/* Dashboard Button */}
              <div className="pl-0 sm:pl-16 lg:pl-20">
                <Button 
                  className="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-4 sm:px-6 py-2 sm:py-3"
                  asChild
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                    <span className="text-sm sm:text-base">ScanBack™ Dashboard</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Section - Grey Card */}
          <div className="bg-gray-100 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg">
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed font-medium text-center sm:text-left">
              Track your tags, manage your items, and get notified — all in one place.
            </p>
        </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
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
              <div className="text-xl sm:text-3xl font-bold text-yellow-600 mb-1 sm:mb-2">
                {qrCodes.filter(qr => qr.type === 'pet').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Pets</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleEmergencyClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">
                {qrCodes.filter(qr => qr.type === 'emergency').length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Emergency</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleTotalScansClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                {qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Scans</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleRecentScansClick}>
            <CardContent className="p-3 sm:p-6 text-center">
              {recentScansLoading ? (
                <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  <Loader2 className="h-5 w-5 sm:h-8 sm:w-8 animate-spin mx-auto" />
                </div>
              ) : (
                <div className="text-xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                  {recentScansCount}
                </div>
              )}
              <div className="text-xs sm:text-sm text-gray-600">Recent Scans (Last 7 Days)</div>
            </CardContent>
          </Card>
        </div>

      {/* Activate/Deactivate confirmation modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction === 'deactivate' ? (
                <X className="h-5 w-5 text-orange-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {confirmAction === 'deactivate' ? 'Deactivate QR Code' : 'Activate QR Code'}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">
            {confirmAction === 'deactivate'
              ? 'Are you sure you want to deactivate this QR code? People who scan it will see that it is inactive until you reactivate it.'
              : 'Activate this QR code so it can be scanned and show your contact information.'}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmToggle} className={confirmAction === 'deactivate' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}>
              {confirmAction === 'deactivate' ? 'Yes, Deactivate' : 'Yes, Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <div key={qr._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openScanHistoryForQR(qr)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <Badge variant="secondary" className="capitalize text-xs">
                            {qr.type === 'pet' ? (
                              <>
                                <PawPrint className="h-3 w-3 mr-1 text-yellow-500" />
                                Pet
                              </>
                            ) : qr.type === 'emergency' ? (
                              <>
                                <Plus className="h-3 w-3 mr-1 text-red-600" strokeWidth={3} />
                                Emergency
                              </>
                            ) : (
                              <>
                                <Tag className="h-3 w-3 mr-1 text-blue-600 flex items-center justify-center" />
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
                          {qr.details?.name || 'Unnamed'}
                        </h3>
                        
                        {/* Pet Image Display */}
                        {qr.details?.image && (
                          <div className="mb-2">
                            <img 
                              src={qr.details.image} 
                              alt={qr.details?.name || 'QR Code'}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        )}
                        
                        {qr.details?.description && (
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
                      {/* <Label htmlFor="editPhone" className="text-sm">WhatsApp Phone Number *</Label> */}
                      <PhoneInput
                            value={editForm.contact.phone}
                        onChange={(value) => handleEditInputChange('contact.phone', value)}
                        onCountryChange={(countryCode) => handleEditInputChange('contact.countryCode', countryCode)}
                        onErrorChange={(error) => setPhoneErrors(prev => ({ ...prev, main: error }))}
                        countryCode={editForm.contact.countryCode}
                        label="Whatsapp Phone Number"
                            required
                        error={phoneErrors.main}
                        id="editPhone"
                        disabled={true}
                      />
                      <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                    </div>

                    {/* Backup Phone Number - Allow for all tag types including emergency */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Label htmlFor="editBackupPhone" className="text-sm">Backup Phone Number (Optional)</Label>
                          <Tooltip open={backupPhoneTooltipOpen} onOpenChange={setBackupPhoneTooltipOpen}>
                            <TooltipTrigger asChild>
                              <Info
                                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help"
                                onClick={(e) => {
                                  if (isMobile) {
                                    e.preventDefault()
                                    setBackupPhoneTooltipOpen(!backupPhoneTooltipOpen)
                                  }
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Make sure the person listed has agreed to be contacted in case your item is found.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <PhoneInput
                            value={editForm.contact.backupPhone}
                          onChange={(value) => handleEditInputChange('contact.backupPhone', value)}
                          onCountryChange={(countryCode) => handleEditInputChange('contact.backupCountryCode', countryCode)}
                          onErrorChange={(error) => setPhoneErrors(prev => ({ ...prev, backup: error }))}
                          countryCode={editForm.contact.backupCountryCode}
                          placeholder="Enter backup phone number"
                          error={phoneErrors.backup}
                          id="editBackupPhone"
                        />
                        
                        {/* Backup Number Consent Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-3">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Use backup number if I can't be reached</Label>
                            <p className="text-xs text-gray-600 mt-1">
                              {editForm.contact.backupPhone.trim() ?
                                "If unchecked, backup number won't appear on the public scan page" :
                                "Enter a backup phone number above to enable this option"
                              }
                            </p>
                        </div>
                          <div className="flex-shrink-0 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('settings.useBackupNumber', !editForm.settings.useBackupNumber)}
                              disabled={!editForm.contact.backupPhone.trim()}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                editForm.contact.backupPhone.trim()
                                  ? (editForm.settings.useBackupNumber ? 'bg-blue-600' : 'bg-gray-300')
                                  : 'bg-gray-200 cursor-not-allowed'
                              }`}
                              aria-pressed={editForm.settings.useBackupNumber}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  editForm.settings.useBackupNumber && editForm.contact.backupPhone.trim() ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
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
                        disabled={true}
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  {/* Item/Pet/Emergency Name */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="editName" className="text-sm">{editingQR.type === 'pet' ? 'Pet Name' : editingQR.type === 'emergency' ? 'Emergency Contact Name' : 'Item Name'} *</Label>
                      <Input
                        id="editName"
                        value={editForm.details.name}
                        onChange={(e) => handleEditInputChange('details.name', e.target.value)}
                        placeholder={`Enter your ${editingQR.type === 'pet' ? 'pet' : editingQR.type === 'emergency' ? 'emergency contact' : 'item'} name`}
                        required
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="editMessage">Finder Message (Auto generated) (Editable)</Label>
                      <Textarea
                        id="editMessage"
                        value={editMessageClicked ? editForm.contact.message : ""}
                        onChange={(e) => handleEditInputChange('contact.message', e.target.value)}
                        onFocus={() => {
                          if (!editMessageClicked) {
                            setEditMessageClicked(true)
                            const defaultMessage = editingQR.type === 'emergency'
                              ? "Hi! This is an emergency tag. If you've scanned this, I may need help. Please contact my emergency contacts listed below or seek medical attention if required. Thank you for your support."
                              : editingQR.type === 'pet'
                              ? (editForm.details.name 
                                  ? `Hi! Thanks for finding my pet ${editForm.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` 
                                  : "Hi! Thanks for finding my pet. Please contact me so we can arrange a return. I really appreciate your honesty and help!")
                              : (editForm.details.name 
                                  ? `Hi! Thanks for finding my item ${editForm.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` 
                                  : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!")
                            handleEditInputChange('contact.message', defaultMessage)
                          }
                        }}
                        placeholder={editingQR.type === 'emergency' 
                          ? "Hi! This is an emergency tag. If you've scanned this, I may need help. Please contact my emergency contacts listed below or seek medical attention if required. Thank you for your support." 
                          : editingQR.type === 'pet'
                          ? (editForm.details.name ? `Hi! Thanks for finding my pet ${editForm.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my pet. Please contact me so we can arrange a return. I really appreciate your honesty and help!")
                          : (editForm.details.name ? `Hi! Thanks for finding my item ${editForm.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!")}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Item Image Upload - Only for Item Tags */}
                  {editingQR.type === 'item' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Item Photo (Optional)</Label>
                        <div className="mt-2">
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            onClick={() => document.getElementById('edit-item-image-upload')?.click()}
                          >
                            <input
                              id="edit-item-image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            {editImagePreview || editForm.details.image ? (
                              <div className="space-y-3">
                                <img 
                                  src={editImagePreview || editForm.details.image} 
                                  alt="Item" 
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
                    </div>
                  )}

              {/* Pet Image Upload - Only for Pet Tags */}
              {editingQR.type === 'pet' && (
                <div className="space-y-4">
                      <div>
                    <Label>Pet Photo (Optional)</Label>
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
                        {editImagePreview || editForm.details.image ? (
                              <div className="space-y-3">
                                <img 
                              src={editImagePreview || editForm.details.image} 
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
                </div>
              )}

              {/* Pet-specific fields */}
              {editingQR.type === 'pet' && (
                <div className="space-y-4">

                  {/* Emergency Details Toggle */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Emergency Details</Label>
                            <p className="text-xs text-gray-600 mt-1">Add medical info, special needs, or emergency contacts</p>
                          </div>
                          <button
                            type="button"
                        onClick={() => setShowEmergencyDetails(!showEmergencyDetails)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          showEmergencyDetails ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        aria-pressed={showEmergencyDetails}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showEmergencyDetails ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                    {showEmergencyDetails && (
                      <div className="space-y-4">
                          <div>
                          <Label htmlFor="editMedicalNotes">Medical Notes (Optional)</Label>
                            <Textarea
                            id="editMedicalNotes"
                            value={editForm.details.medicalNotes || ""}
                            onChange={(e) => handleEditInputChange('details.medicalNotes', e.target.value)}
                            placeholder="Any medical conditions, medications, or special care instructions"
                              rows={3}
                          className="mt-1"
                        />
                        </div>
                        
                        <div>
                          <Label htmlFor="editVetName">Veterinarian Name (Optional)</Label>
                          <Input
                            id="editVetName"
                            value={editForm.details.vetName || ""}
                            onChange={(e) => handleEditInputChange('details.vetName', e.target.value)}
                            placeholder="e.g., Dr. Smith - Happy Paws Clinic"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="editVetPhone">Vet Phone Number (Optional)</Label>
                          <PhoneInput
                            value={editForm.details.vetPhone || ""}
                            countryCode={editForm.details.vetCountryCode || "ZA"}
                            onChange={(value) => handleEditInputChange('details.vetPhone', value)}
                            onCountryChange={(countryCode) => handleEditInputChange('details.vetCountryCode', countryCode)}
                            onErrorChange={(error) => setVetPhoneError(error)}
                            error={vetPhoneError}
                            id="editVetPhone"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="editEmergencyContact">Emergency Contact (Optional)</Label>
                          <PhoneInput
                            value={editForm.details.emergencyContact || ""}
                            countryCode={editForm.details.emergencyCountryCode || "ZA"}
                            onChange={(value) => handleEditInputChange('details.emergencyContact', value)}
                            onCountryChange={(countryCode) => handleEditInputChange('details.emergencyCountryCode', countryCode)}
                            onErrorChange={(error) => setEmergencyPhoneError(error)}
                            error={emergencyPhoneError}
                            id="editEmergencyContact"
                          />
                        </div>
                          </div>
                        )}
                      </div>

                  {/* Pedigree Info Toggle */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Pedigree Information</Label>
                        <p className="text-xs text-gray-600 mt-1">Add breeding info, registration details, or lineage</p>
                          </div>
                          <button
                            type="button"
                        onClick={() => setShowPedigreeInfo(!showPedigreeInfo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          showPedigreeInfo ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={showPedigreeInfo}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showPedigreeInfo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {showPedigreeInfo && (
                      <div className="space-y-4">
                      <div>
                          <Label htmlFor="editBreed">Breed</Label>
                          <Input
                            id="editBreed"
                            value={editForm.details.breed || ""}
                            onChange={(e) => handleEditInputChange('details.breed', e.target.value)}
                            placeholder="e.g., Golden Retriever"
                          className="mt-1"
                        />
                      </div>
                        
                        <div>
                          <Label htmlFor="editColor">Color</Label>
                          <Input
                            id="editColor"
                            value={editForm.details.color || ""}
                            onChange={(e) => handleEditInputChange('details.color', e.target.value)}
                            placeholder="e.g., Golden/Cream"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="editAge">Age</Label>
                          <Input
                            id="editAge"
                            value={editForm.details.age || ""}
                            onChange={(e) => {
                              const age = e.target.value
                              if (age === '' || (!isNaN(Number(age)) && Number(age) >= 0 && Number(age) <= 50)) {
                                handleEditInputChange('details.age', age)
                                if (age && (isNaN(Number(age)) || Number(age) < 0 || Number(age) > 50)) {
                                  setAgeError("Age must be between 0 and 50")
                                } else {
                                  setAgeError("")
                                }
                              }
                            }}
                            placeholder="e.g., 3"
                            className={`mt-1 ${ageError ? 'border-red-500' : ''}`}
                            type="number"
                            min="0"
                            max="50"
                          />
                          {ageError && (
                            <p className="text-red-500 text-sm mt-1">{ageError}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="editRegistrationNumber">Registration Number (Optional)</Label>
                          <Input
                            id="editRegistrationNumber"
                            value={editForm.details.registrationNumber || ""}
                            onChange={(e) => handleEditInputChange('details.registrationNumber', e.target.value)}
                            placeholder="e.g., AKC #123456789"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="editBreederInfo">Breeder Information (Optional)</Label>
                          <Input
                            id="editBreederInfo"
                            value={editForm.details.breederInfo || ""}
                            onChange={(e) => handleEditInputChange('details.breederInfo', e.target.value)}
                            placeholder="e.g., Champion bloodline, breeder contact"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                    </div>
                  )}

              {/* Emergency Photo Upload */}
              {editingQR.type === 'emergency' && (
                <div className="space-y-4">
                  <div>
                    <Label>Emergency Contact Photo (Optional)</Label>
                    <div className="mt-2">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                        onClick={() => document.getElementById('edit-emergency-image-upload')?.click()}
                      >
                        <input
                          id="edit-emergency-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        {editImagePreview || editForm.details.image ? (
                          <div className="space-y-3">
                            <img 
                              src={editImagePreview || editForm.details.image} 
                              alt="Emergency Contact" 
                              className="w-24 h-24 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-gray-600">Click to change photo</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                              <Camera className="h-8 w-8 text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Upload Emergency Contact Photo</p>
                              <p className="text-xs text-gray-500">Tap to select from camera or gallery</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency-specific fields */}
              {editingQR.type === 'emergency' && (
                <div className="space-y-4">

                  {/* Emergency Medical Details Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black flex items-center gap-2">
                          <Plus className="h-4 w-4 text-red-600" />
                          Add Emergency Details
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">Medical aid info, blood type, allergies, medications</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEmergencyMedicalDetails(!showEmergencyMedicalDetails)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                          showEmergencyMedicalDetails ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={showEmergencyMedicalDetails}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showEmergencyMedicalDetails ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                    {showEmergencyMedicalDetails && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editMedicalAidProvider">Medical Aid Provider</Label>
                            <Input
                              id="editMedicalAidProvider"
                              value={editForm.details.medicalAidProvider || ""}
                              onChange={(e) => handleEditInputChange('details.medicalAidProvider', e.target.value)}
                              placeholder="e.g., Discovery Health"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="editMedicalAidNumber">Medical Aid Number</Label>
                            <Input
                              id="editMedicalAidNumber"
                              value={editForm.details.medicalAidNumber || ""}
                              onChange={(e) => handleEditInputChange('details.medicalAidNumber', e.target.value)}
                              placeholder="e.g., 123 456 7890"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="editBloodType">Blood Type</Label>
                          <Select
                            value={editForm.details.bloodType || ""}
                            onValueChange={(value) => handleEditInputChange('details.bloodType', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="editAllergies">Allergies / Medical Conditions</Label>
                            <Textarea
                            id="editAllergies"
                            value={editForm.details.allergies || ""}
                            onChange={(e) => handleEditInputChange('details.allergies', e.target.value)}
                            placeholder="e.g., Penicillin Allergy, Asthma, Epilepsy"
                              rows={3}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="editMedications">Medications</Label>
                          <Textarea
                            id="editMedications"
                            value={editForm.details.medications || ""}
                            onChange={(e) => handleEditInputChange('details.medications', e.target.value)}
                            placeholder="e.g., Ventolin, Epipen, Insulin"
                            rows={3}
                            className="mt-1"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-black">Organ Donor</Label>
                            <p className="text-xs text-gray-600 mt-1">Are you registered as an organ donor?</p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditInputChange('details.organDonor', !editForm.details.organDonor)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                editForm.details.organDonor ? 'bg-red-600' : 'bg-gray-300'
                              }`}
                              aria-pressed={editForm.details.organDonor}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  editForm.details.organDonor ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="editIceNote">ICE Note / Special Instruction</Label>
                          <Textarea
                            id="editIceNote"
                            value={editForm.details.iceNote || ""}
                            onChange={(e) => handleEditInputChange('details.iceNote', e.target.value)}
                            placeholder="e.g., Please notify both emergency contacts immediately."
                            rows={2}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contacts Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          Emergency Contacts
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">Primary and secondary emergency contacts</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                          showEmergencyContacts ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={showEmergencyContacts}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showEmergencyContacts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {showEmergencyContacts && (
                      <div className="space-y-4">
                        {/* Emergency Contact 1 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-black">Emergency Contact 1</Label>
                            <Tooltip open={emergencyContact1TooltipOpen} onOpenChange={setEmergencyContact1TooltipOpen}>
                              <TooltipTrigger asChild>
                                <Info 
                                  className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" 
                                  onClick={(e) => {
                                    if (isMobile) {
                                      e.preventDefault()
                                      setEmergencyContact1TooltipOpen(!emergencyContact1TooltipOpen)
                                    }
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Make sure they have agreed to be contacted in case of emergency.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div>
                            <Label htmlFor="editEmergencyContact1Name">Contact Name</Label>
                            <Input
                              id="editEmergencyContact1Name"
                              value={editForm.details.emergencyContact1Name || ""}
                              onChange={(e) => handleEditInputChange('details.emergencyContact1Name', e.target.value)}
                              placeholder="e.g., John Smith"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="editEmergencyContact1Phone">Contact Number</Label>
                            <PhoneInput
                              value={editForm.details.emergencyContact1Phone || ""}
                              countryCode={editForm.details.emergencyContact1CountryCode || "ZA"}
                              onChange={(value) => handleEditInputChange('details.emergencyContact1Phone', value)}
                              onCountryChange={(countryCode) => handleEditInputChange('details.emergencyContact1CountryCode', countryCode)}
                              onErrorChange={(error) => setEmergencyContact1PhoneError(error)}
                              error={emergencyContact1PhoneError}
                              id="editEmergencyContact1Phone"
                              placeholder="e.g., 083 456 7890"
                            />
                          </div>

                        <div>
                          <Label htmlFor="editEmergencyContact1Relation">Relation</Label>
                          <Input
                            id="editEmergencyContact1Relation"
                            value={editForm.details.emergencyContact1Relation || ""}
                            onChange={(e) => handleEditInputChange('details.emergencyContact1Relation', e.target.value)}
                            placeholder="e.g., Brother / Spouse / Doctor"
                            className="mt-1"
                            />
                          </div>
                        </div>

                        {/* Emergency Contact 2 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-black">Emergency Contact 2</Label>
                            <Tooltip open={emergencyContact2TooltipOpen} onOpenChange={setEmergencyContact2TooltipOpen}>
                              <TooltipTrigger asChild>
                                <Info 
                                  className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" 
                                  onClick={(e) => {
                                    if (isMobile) {
                                      e.preventDefault()
                                      setEmergencyContact2TooltipOpen(!emergencyContact2TooltipOpen)
                                    }
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Make sure they have agreed to be contacted in case of emergency.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div>
                            <Label htmlFor="editEmergencyContact2Name">Contact Name</Label>
                            <Input
                              id="editEmergencyContact2Name"
                              value={editForm.details.emergencyContact2Name || ""}
                              onChange={(e) => handleEditInputChange('details.emergencyContact2Name', e.target.value)}
                              placeholder="e.g., Jane Doe"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="editEmergencyContact2Phone">Contact Number</Label>
                            <PhoneInput
                              value={editForm.details.emergencyContact2Phone || ""}
                              countryCode={editForm.details.emergencyContact2CountryCode || "ZA"}
                              onChange={(value) => handleEditInputChange('details.emergencyContact2Phone', value)}
                              onCountryChange={(countryCode) => handleEditInputChange('details.emergencyContact2CountryCode', countryCode)}
                              onErrorChange={(error) => setEmergencyContact2PhoneError(error)}
                              error={emergencyContact2PhoneError}
                              id="editEmergencyContact2Phone"
                              placeholder="e.g., 083 456 7890"
                            />
                          </div>

                        <div>
                          <Label htmlFor="editEmergencyContact2Relation">Relation</Label>
                          <Input
                            id="editEmergencyContact2Relation"
                            value={editForm.details.emergencyContact2Relation || ""}
                            onChange={(e) => handleEditInputChange('details.emergencyContact2Relation', e.target.value)}
                            placeholder="e.g., Brother / Spouse / Doctor"
                            className="mt-1"
                            />
                          </div>
                        </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toggle Settings */}
              <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1 min-w-0">
                        <Label className="text-sm font-medium text-black">Instant Alerts</Label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Get notified on Email when someone finds your item</p>
                      </div>
                  <div className="flex-shrink-0 sm:ml-4">
                      <button
                        type="button"
                        onClick={() => handleEditInputChange('settings.instantAlerts', !editForm.settings.instantAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                    </div>

                    {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
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
                    </div> */}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1 min-w-0">
                        <Label className="text-sm font-medium text-black">Show Contact Information</Label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Display your contact details on the finder page</p>
                      </div>
                  <div className="flex-shrink-0 sm:ml-4">
                      <button
                        type="button"
                        onClick={() => handleEditInputChange('settings.showContactOnFinderPage', !editForm.settings.showContactOnFinderPage)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                      {selectedQR.type === 'pet' ? 'Pet Tag' : selectedQR.type === 'emergency' ? 'Emergency Tag' : 'Item Tag'}
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
                      Scan this QR code to view the {selectedQR.type === 'pet' ? 'pet' : selectedQR.type === 'emergency' ? 'emergency contact' : 'item'} details
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

                {/* Details display for all types */}
                  <div className="mt-4 sm:mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {selectedQR.type === 'pet' ? (
                      <>
                        <PawPrint className="h-4 w-4 text-yellow-500" />
                      Pet Details
                      </>
                    ) : selectedQR.type === 'emergency' ? (
                      <>
                        <Plus className="h-4 w-4 text-red-600" strokeWidth={3} />
                        Emergency Details
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 text-blue-600 flex items-center justify-center" />
                        Item Details
                      </>
                    )}
                    </h4>
                    
                  {/* Image for all types */}
                    {selectedQR.details.image && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        {selectedQR.type === 'pet' ? 'Pet Photo' : selectedQR.type === 'emergency' ? 'Photo' : 'Item Photo'}
                      </Label>
                        <img 
                          src={selectedQR.details.image} 
                          alt={selectedQR.details.name}
                        className="w-full max-w-xs h-auto object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}

                  {/* Additional details based on type */}
                  {selectedQR.type === 'pet' && (
                    <>
                      {/* Emergency Details for Pet */}
                    {selectedQR.details.emergencyDetails && (
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <Label className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" />
                          Emergency Information
                        </Label>
                        <p className="text-red-800 text-xs leading-relaxed">{selectedQR.details.emergencyDetails}</p>
                      </div>
                    )}

                      {/* Pedigree Information for Pet */}
                    {selectedQR.details.pedigreeInfo && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <Label className="text-xs font-semibold text-blue-700 mb-2 block">Pedigree Information</Label>
                        <p className="text-blue-800 text-xs leading-relaxed">{selectedQR.details.pedigreeInfo}</p>
                      </div>
                      )}
                    </>
                  )}

                  {/* Item Details */}
                  {selectedQR.type === 'item' && (
                    <>
                      {selectedQR.details.description && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 mb-2 block">Description</Label>
                          <p className="text-gray-800 text-xs leading-relaxed">{selectedQR.details.description}</p>
                        </div>
                      )}
                      {(selectedQR.details.brand || selectedQR.details.model || selectedQR.details.color || selectedQR.details.category) && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <Label className="text-xs font-semibold text-blue-700 mb-2 block">Item Information</Label>
                          <div className="space-y-1 text-xs text-blue-800">
                            {selectedQR.details.brand && <p><span className="font-medium">Brand:</span> {selectedQR.details.brand}</p>}
                            {selectedQR.details.model && <p><span className="font-medium">Model:</span> {selectedQR.details.model}</p>}
                            {selectedQR.details.color && <p><span className="font-medium">Color:</span> {selectedQR.details.color}</p>}
                            {selectedQR.details.category && <p><span className="font-medium">Category:</span> {selectedQR.details.category}</p>}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Emergency Type Details */}
                  {selectedQR.type === 'emergency' && (
                    <>
                      {selectedQR.details.emergencyDetails && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                          <Label className="text-xs font-semibold text-red-700 mb-2 block">Emergency Information</Label>
                          <p className="text-red-800 text-xs leading-relaxed">{selectedQR.details.emergencyDetails}</p>
                        </div>
                      )}
                      {(selectedQR.details.medicalAidProvider || selectedQR.details.bloodType || selectedQR.details.allergies || selectedQR.details.medications) && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <Label className="text-xs font-semibold text-blue-700 mb-2 block">Medical Information</Label>
                          <div className="space-y-1 text-xs text-blue-800">
                            {selectedQR.details.medicalAidProvider && <p><span className="font-medium">Medical Aid:</span> {selectedQR.details.medicalAidProvider}</p>}
                            {selectedQR.details.bloodType && <p><span className="font-medium">Blood Type:</span> {selectedQR.details.bloodType}</p>}
                            {selectedQR.details.allergies && <p><span className="font-medium">Allergies:</span> {selectedQR.details.allergies}</p>}
                            {selectedQR.details.medications && <p><span className="font-medium">Medications:</span> {selectedQR.details.medications}</p>}
                          </div>
                        </div>
                      )}
                      {selectedQR.details.organDonor && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <Label className="text-xs font-semibold text-green-700 mb-2 block">Organ Donor</Label>
                          <p className="text-green-800 text-xs">Registered as organ donor</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Contact Visibility Setting for all types */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">Finder Page Settings</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show contact details to finders</span>
                        <div className={`w-4 h-4 rounded-full ${selectedQR.settings?.showContactOnFinderPage !== false ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                    </div>
                  </div>
                
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
                          // Phone and email changes are not allowed - always false
                          const emailChanged = false;
                          const phoneChanged = false;
                          
                          const otpResponse = await apiClient.sendUpdateOTP(
                            editingQR.code,
                            undefined, // Email changes not allowed
                            undefined  // Phone changes not allowed
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
                      <PawPrint className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    ) : updatedQR.type === 'emergency' ? (
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" strokeWidth={3} />
                    ) : (
                      <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex items-center justify-center" />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{updatedQR.details.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{updatedQR.type === 'pet' ? 'Pet Tag' : updatedQR.type === 'emergency' ? 'Emergency Tag' : 'Item Tag'}</p>
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
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scan className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {showRecentScansOnly ? 'Recent Scan History (Last 7 Days)' : 'Scan History & Locations'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {showRecentScansOnly ? 'View scans from the past 7 days' : 'Track all scans across your QR codes'}
                    </p>
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
                  {(() => {
                    // Calculate 7 days ago for filtering
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    sevenDaysAgo.setHours(0, 0, 0, 0);

                    // Filter QR codes that have recent scans if showing recent scans only
                    const qrCodesToShow = (selectedQRForScanHistory ? [selectedQRForScanHistory] : qrCodes)
                      .filter(qr => {
                        if (!showRecentScansOnly) return true;
                        if (!qr.metadata?.scanHistory || qr.metadata.scanHistory.length === 0) return false;
                        return qr.metadata.scanHistory.some(scan => {
                          if (!scan.scannedAt) return false;
                          const scanDate = new Date(scan.scannedAt);
                          return scanDate >= sevenDaysAgo;
                        });
                      });

                    if (qrCodesToShow.length === 0 && showRecentScansOnly) {
                      return (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-100">
                            <Scan className="h-8 w-8 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Scans</h3>
                          <p className="text-sm text-gray-600">
                            No scans were recorded in the last 7 days
                          </p>
                        </div>
                      );
                    }

                    return qrCodesToShow.map((qr) => {
                      // Filter scan history for recent scans if needed
                      const allScans = qr.metadata?.scanHistory || [];
                      const scansToShow = showRecentScansOnly
                        ? allScans.filter(scan => {
                            if (!scan.scannedAt) return false;
                            const scanDate = new Date(scan.scannedAt as string);
                            if (isNaN(scanDate.getTime())) return false;
                            return scanDate >= sevenDaysAgo;
                          })
                        : allScans.filter(scan => {
                            // Ensure scan has valid scannedAt date
                            if (!scan.scannedAt) return false;
                            const scanDate = new Date(scan.scannedAt as string);
                            return !isNaN(scanDate.getTime());
                          });

                      const recentScansCount = scansToShow.length;
                      
                      // Calculate missing scans (scans that happened but weren't recorded in history)
                      const missingScans = !showRecentScansOnly && qr.scanCount > scansToShow.length 
                        ? qr.scanCount - scansToShow.length 
                        : 0;

                      return (
                    <div key={qr._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {qr.type === 'pet' ? (
                                <PawPrint className="h-5 w-5 text-yellow-500" />
                              ) : qr.type === 'emergency' ? (
                                <Plus className="h-5 w-5 text-red-600" strokeWidth={3} />
                          ) : (
                                <Tag className="h-5 w-5 text-blue-600 flex items-center justify-center" />
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900">{qr.details.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {qr.type === 'pet' ? 'Pet Tag' : qr.type === 'emergency' ? 'Emergency Tag' : 'Item Tag'}
                                </p>
                          </div>
                        </div>
                        <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {showRecentScansOnly ? recentScansCount : qr.scanCount}
                              </div>
                              <div className="text-xs text-gray-500">
                                {showRecentScansOnly ? 'recent scans' : 'scans'}
                              </div>
                        </div>
                      </div>
                      
                          {recentScansCount > 0 || (!showRecentScansOnly && qr.scanCount > 0) ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 mb-3 font-medium">
                                {showRecentScansOnly ? 'Recent Scan History (Last 7 Days):' : 'Scan History:'}
                              </p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                                {scansToShow.length > 0 || missingScans > 0 ? (
                                  <>
                                    {scansToShow
                                      .sort((a, b) => {
                                        const dateA = new Date(a.scannedAt as string).getTime();
                                        const dateB = new Date(b.scannedAt as string).getTime();
                                        return dateB - dateA; // Sort by newest first
                                      })
                                      .slice(0, expandedScanHistory.has(qr._id) ? scansToShow.length : 5)
                                      .map((scan, index) => {
                                        const scanKey = `${scan.scannedAt}-${index}-${scan.ipAddress || 'unknown'}`;
                                        return (
                                          <div key={scanKey} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700">
                                                {new Date(scan.scannedAt as string).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="text-gray-500">
                                              {scan.location && scan.location !== 'unknown' ? scan.location : 'Unknown location'}
                                      </div>
                                    </div>
                                        );
                                      })}
                                    {/* Show placeholder for missing scans */}
                                    {missingScans > 0 && !showRecentScansOnly && (
                                      <div className="flex items-center space-x-2 text-xs text-gray-400 italic pt-1">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                        <span>{missingScans} scan{missingScans > 1 ? 's' : ''} without recorded history</span>
                                      </div>
                                    )}
                              </>
                            ) : (
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Last scanned: {qr.lastScanned ? new Date(qr.lastScanned).toLocaleString() : 'Recently'}</span>
                              </div>
                            )}
                          </div>
                              {scansToShow.length > 5 && (
                            <button
                              onClick={() => toggleScanHistoryExpansion(qr._id)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium transition-colors"
                            >
                              {expandedScanHistory.has(qr._id) 
                                ? 'Show less' 
                                    : `+${scansToShow.length - 5} more scans`
                              }
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-gray-500">
                                {showRecentScansOnly ? 'No recent scans' : 'No scans yet'}
                              </p>
                          <p className="text-xs text-gray-400 mt-1">
                                {showRecentScansOnly 
                                  ? 'This QR code has no scans in the last 7 days'
                                  : 'This QR code hasn\'t been scanned by anyone yet'
                                }
                          </p>
                        </div>
                      )}
                    </div>
                      );
                    });
                  })()}
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
                  <div className={`p-2 rounded-lg ${filteredListType === 'pet' ? 'bg-yellow-100' : filteredListType === 'emergency' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {filteredListType === 'pet' ? (
                      <PawPrint className="h-6 w-6 text-yellow-500" />
                    ) : filteredListType === 'emergency' ? (
                      <Plus className="h-6 w-6 text-red-600" strokeWidth={3} />
                    ) : (
                      <Tag className="h-6 w-6 text-blue-600 flex items-center justify-center" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {filteredListType === 'pet' ? 'Pet Tags' : filteredListType === 'emergency' ? 'Emergency Tags' : 'Item Tags'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {qrCodes.filter(qr => qr.type === filteredListType).length} {filteredListType === 'pet' ? 'pets' : filteredListType === 'emergency' ? 'emergency contacts' : 'items'} registered
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
                                <PawPrint className={`h-5 w-5 ${qr.isActivated ? 'text-yellow-500' : 'text-gray-400'}`} />
                              ) : qr.type === 'emergency' ? (
                                <Plus className={`h-5 w-5 ${qr.isActivated ? 'text-red-600' : 'text-gray-400'}`} strokeWidth={3} />
                              ) : (
                                <Tag className={`h-5 w-5 ${qr.isActivated ? 'text-blue-600' : 'text-gray-400'} flex items-center justify-center`} />
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
                        filteredListType === 'pet' ? 'bg-yellow-100' : filteredListType === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {filteredListType === 'pet' ? (
                          <PawPrint className="h-8 w-8 text-yellow-500" />
                        ) : filteredListType === 'emergency' ? (
                          <Plus className="h-8 w-8 text-red-600" strokeWidth={3} />
                        ) : (
                          <Tag className="h-8 w-8 text-blue-600 flex items-center justify-center" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No {filteredListType === 'pet' ? 'Pet Tags' : filteredListType === 'emergency' ? 'Emergency Tags' : 'Item Tags'} Yet
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}