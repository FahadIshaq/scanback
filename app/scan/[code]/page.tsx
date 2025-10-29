"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, AlertCircle, Heart, Package, QrCode, Shield, Copy, Check, PawPrint, Luggage, Loader2, Upload, Camera, Image as ImageIcon, Tag, Info, Stethoscope } from "lucide-react"
import { FaWhatsapp, FaSms, FaPhone, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import PhoneInput from "@/components/phone-input"
import { getCountryCallingCode } from "libphonenumber-js"
import { TermsPrivacyPopup } from "@/components/terms-privacy-popup"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface QRData {
  code: string
  type: 'item' | 'pet' | 'emergency' | 'any'
  isActivated: boolean
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
    medicalNotes?: string
    vetName?: string
    vetPhone?: string
    vetCountryCode?: string
    emergencyContact?: string
    emergencyCountryCode?: string
    // Pedigree Information fields
    breed?: string
    age?: string
    registrationNumber?: string
    breederInfo?: string
    // Emergency Details fields
    medicalAidProvider?: string
    medicalAidNumber?: string
    bloodType?: string
    allergies?: string
    medications?: string
    organDonor?: boolean
    iceNote?: string
    // Emergency Contacts fields
    emergencyContact1Name?: string
    emergencyContact1Phone?: string
    emergencyContact1CountryCode?: string
    emergencyContact2Name?: string
    emergencyContact2Phone?: string
    emergencyContact2CountryCode?: string
  }
  contact: {
    name: string
    email: string
    phone: string
    backupPhone?: string
    message?: string
  }
  settings?: {
    instantAlerts: boolean
    locationSharing: boolean
    showContactOnFinderPage?: boolean
    useBackupNumber?: boolean
  }
  status: string
  createdAt: string
}


export default function ScanPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedTagType, setSubmittedTagType] = useState<'item' | 'pet' | 'emergency' | 'any'>('item')
  const [tempPassword, setTempPassword] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [existingPassword, setExistingPassword] = useState("")
  const [phoneErrors, setPhoneErrors] = useState({
    main: "",
    backup: ""
  })
  const [emailError, setEmailError] = useState("")
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [messageClicked, setMessageClicked] = useState(false)
  const [itemImage, setItemImage] = useState<string | null>(null)
  const [petImage, setPetImage] = useState<string | null>(null)
  const [emergencyImage, setEmergencyImage] = useState<string | null>(null)
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false)
  const [showPedigreeInfo, setShowPedigreeInfo] = useState(false)
  const [showEmergencyMedicalDetails, setShowEmergencyMedicalDetails] = useState(false)
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [selectedTagType, setSelectedTagType] = useState<'item' | 'pet' | 'emergency'>('item')
  
  // Validation errors for additional fields
  const [ageError, setAgeError] = useState("")
  const [vetPhoneError, setVetPhoneError] = useState("")
  const [emergencyPhoneError, setEmergencyPhoneError] = useState("")
  const [emergencyContact1PhoneError, setEmergencyContact1PhoneError] = useState("")
  const [emergencyContact2PhoneError, setEmergencyContact2PhoneError] = useState("")

  const [formData, setFormData] = useState({
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
      // Emergency Details fields
      medicalNotes: "",
      vetName: "",
      vetPhone: "",
      vetCountryCode: "ZA",
      emergencyContact: "",
      emergencyCountryCode: "ZA",
      // Pedigree Information fields
      breed: "",
      age: "",
      registrationNumber: "",
      breederInfo: "",
      // Emergency Details fields
      medicalAidProvider: "",
      medicalAidNumber: "",
      bloodType: "",
      allergies: "",
      medications: "",
      organDonor: false,
      iceNote: "",
      // Emergency Contacts fields
      emergencyContact1Name: "",
      emergencyContact1Phone: "",
      emergencyContact1CountryCode: "ZA",
      emergencyContact2Name: "",
      emergencyContact2Phone: "",
      emergencyContact2CountryCode: "ZA"
    },
    contact: {
      name: "",
      email: "",
      phone: "",
      backupPhone: "",
      countryCode: "ZA", // Changed to country code instead of phone code
      backupCountryCode: "ZA",
      message: ""
    },
    settings: {
      instantAlerts: true,
      locationSharing: true,
      showContactOnFinderPage: false,
      useBackupNumber: true
    }
  })

  useEffect(() => {
    if (code) {
      loadQRCode()
    }
  }, [code])

  // Handle type parameter from URL (for "any" type QR codes)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const typeParam = urlParams.get('type')
    if (typeParam && qrData?.type === 'any' && ['item', 'pet', 'emergency'].includes(typeParam)) {
      // Update the QR data type to the selected type
      setQrData(prev => prev ? { ...prev, type: typeParam as 'item' | 'pet' | 'emergency' } : null)
    }
  }, [qrData])

  // Update message when item name changes (only if message is active)
  useEffect(() => {
    if (messageClicked && formData.details.name) {
      const updatedMessage = `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          message: updatedMessage
        }
      }))
    }
  }, [formData.details.name, messageClicked])

  // Scroll to top when success page is shown
  useEffect(() => {
    if (success) {
      window.scrollTo(0, 0)
    }
  }, [success])

  const loadQRCode = async () => {
    try {
      // Show loading state
      setLoading(true)
      setError('')
      
      const response = await apiClient.getPublicQRCode(code)
      if (response.success) {
        setQrData(response.data)
        
        // Only track the scan if the QR code is activated
        if (response.data.isActivated) {
        try {
          await apiClient.trackScan(code)
        } catch (trackError) {
          // Don't show error for tracking failures, just log it
          console.log('Scan tracking failed:', trackError)
          }
        }
      } else {
        // Handle inactive QR code or other errors
        if (response.status === 'inactive' || response.message?.includes('inactive')) {
          setError("This QR code is currently inactive. The owner has temporarily disabled it.")
        } else {
          setError(response.message || "QR code not found")
        }
      }
    } catch (error: any) {
      console.error('Load QR code error:', error)
      
      // Handle timeout errors specifically
      if (error.message?.includes('timeout') || error.message?.includes('Request timeout')) {
        setError("The server is taking too long to respond. This might be a temporary issue. Please try again in a moment.")
      } else if (error.status === 403 || error.message?.includes('inactive')) {
        setError("This QR code is currently inactive. The owner has temporarily disabled it.")
      } else {
        setError(error.message || "Failed to load QR code. Please check your internet connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Validation functions
  const validateAge = (age: string): string => {
    if (!age.trim()) return "" // Age is optional
    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 50) {
      return "Age must be a number between 0 and 50"
    }
    return ""
  }

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) return "" // Phone is optional
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
      return "Phone number must be between 7 and 15 digits"
    }
    return ""
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "" // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  // Helper function to get current tag type (handles "any" type)
  const getCurrentTagType = () => {
    if (qrData?.type === 'any') {
      return selectedTagType
    }
    return qrData?.type || 'item'
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

      // Validate email in real-time
    if (field === 'contact.email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const emailValue = value as string
      if (emailValue.trim() === '') {
        setEmailError("")
      } else if (!emailRegex.test(emailValue)) {
        setEmailError("Please enter a valid email address")
      } else {
        setEmailError("")
      }
    }

    // Validate specific fields
    if (field === 'details.age') {
      setAgeError(validateAge(value as string))
    } else if (field === 'details.vetPhone') {
      // The PhoneInput component handles its own validation via onErrorChange
    } else if (field === 'details.emergencyContact') {
      // The PhoneInput component handles its own validation via onErrorChange
    } else if (field === 'contact.backupPhone') {
      // The PhoneInput component handles its own validation via onErrorChange
      // If backup phone is cleared, reset the useBackupNumber setting
      if (!value || (value as string).trim() === '') {
        setFormData(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            useBackupNumber: false
          }
        }))
      }
    }
  }


  const copyToClipboard = async (text: string, type: 'password' | 'email') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      if (type === 'password') {
        setCopiedPassword(true)
        setTimeout(() => setCopiedPassword(false), 2000)
      } else {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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
        setItemImage(result)
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            image: result
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePetImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setPetImage(result)
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            image: result
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmergencyImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setEmergencyImage(result)
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            image: result
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerEmergencyImageUpload = () => {
    const input = document.getElementById('emergency-image-upload') as HTMLInputElement
    input?.click()
  }

  const triggerImageUpload = () => {
    const input = document.getElementById('item-image-upload') as HTMLInputElement
    input?.click()
  }

  const triggerPetImageUpload = () => {
    const input = document.getElementById('pet-image-upload') as HTMLInputElement
    input?.click()
  }

  // Form validation function
  const isFormValid = () => {
    const { contact, details } = formData
    
    // Check required fields
    const hasRequiredFields = 
      contact.name.trim() !== '' &&
      contact.email.trim() !== '' &&
      contact.phone.trim() !== '' &&
      details.name.trim() !== ''
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(contact.email)
    
    // Check phone validation errors
    const hasPhoneErrors = phoneErrors.main !== "" || phoneErrors.backup !== ""
    
    // Check additional validation errors
    const hasAdditionalErrors = ageError !== "" || vetPhoneError !== "" || emergencyPhoneError !== "" || emergencyContact1PhoneError !== "" || emergencyContact2PhoneError !== ""
    
    return hasRequiredFields && isEmailValid && !hasPhoneErrors && !hasAdditionalErrors
  }

  // Function to focus on the first invalid field
  const focusFirstInvalidField = () => {
    // Check required fields in order of priority
    if (formData.contact.name.trim() === '') {
      document.getElementById('contactName')?.focus()
      return
    }
    if (formData.contact.email.trim() === '') {
      document.getElementById('email')?.focus()
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      document.getElementById('email')?.focus()
      return
    }
    if (formData.contact.phone.trim() === '') {
      document.getElementById('phone')?.focus()
      return
    }
    if (phoneErrors.main) {
      document.getElementById('phone')?.focus()
      return
    }
    if (phoneErrors.backup) {
      document.getElementById('backupPhone')?.focus()
      return
    }
    if (formData.details.name.trim() === '') {
      document.getElementById('name')?.focus()
      return
    }
    if (ageError) {
      document.getElementById('age')?.focus()
      return
    }
    if (vetPhoneError) {
      document.getElementById('vetPhone')?.focus()
      return
    }
    if (emergencyPhoneError) {
      document.getElementById('emergencyContact')?.focus()
      return
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Check for validation errors before submission
    if (phoneErrors.main || phoneErrors.backup || emailError || ageError || vetPhoneError || emergencyPhoneError || emergencyContact1PhoneError || emergencyContact2PhoneError) {
      setError("Please fix validation errors before submitting.")
      setSubmitting(false)
      focusFirstInvalidField()
      return
    }

    // Check if form is valid, if not focus on first invalid field
    if (!isFormValid()) {
      setError("Please fill in all required fields.")
      setSubmitting(false)
      focusFirstInvalidField()
      return
    }

    try {
      // Generate auto message if no custom message provided
      const autoMessage = `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`
      const finalMessage = formData.contact.message?.trim() || autoMessage

      // Format phone numbers with country codes
      const submissionData = {
        type: getCurrentTagType(),
        ...formData,
        contact: {
          ...formData.contact,
          phone: `+${getCountryCallingCode(formData.contact.countryCode as any)}${formData.contact.phone}`,
          backupPhone: formData.contact.backupPhone ? `+${getCountryCallingCode(formData.contact.backupCountryCode as any)}${formData.contact.backupPhone}` : undefined,
          message: finalMessage
        },
        details: {
          ...formData.details,
          image: getCurrentTagType() === 'emergency' ? (emergencyImage || formData.details.image) : 
                 getCurrentTagType() === 'pet' ? (petImage || formData.details.image) : 
                 (itemImage || formData.details.image), // Use appropriate image state
          emergencyContact1Phone: formData.details.emergencyContact1Phone ? `+${getCountryCallingCode(formData.details.emergencyContact1CountryCode as any)}${formData.details.emergencyContact1Phone}` : undefined,
          emergencyContact2Phone: formData.details.emergencyContact2Phone ? `+${getCountryCallingCode(formData.details.emergencyContact2CountryCode as any)}${formData.details.emergencyContact2Phone}` : undefined
        }
      }

      
      const response = await apiClient.activateQRCode(code, submissionData)
      
      if (response.success) {
        setSubmittedTagType(getCurrentTagType())
        setSuccess(true)
        setTempPassword(response.data.tempPassword || "")
        setUserEmail(response.data.user.email)
        setIsNewUser(response.data.isNewUser || false)
        setExistingPassword(response.data.user.existingPassword || "")
      } else {
        setError(response.message || "Failed to activate QR code")
      }
    } catch (error: any) {
      setError(error.message || "Failed to activate QR code")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading QR code...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" asChild className="text-gray-700 hover:text-black transition-colors">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black">ScanBack™</span>
                  <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-3">
            {error.includes('timeout') || error.includes('Request timeout') ? 'Connection Timeout' : 'QR Code Not Found'}
          </h1>
          <p className="text-gray-700 mb-8 text-lg">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(error.includes('timeout') || error.includes('Request timeout')) && (
              <Button 
                onClick={() => loadQRCode()} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
              >
                Try Again
              </Button>
            )}
            <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200">
            <Link href="/">Go Home</Link>
          </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black">ScanBack™</span>
                  <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Registration Successful!</h2>
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mx-auto max-w-md">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
                <span className="inline">No App</span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="inline">No Subscription</span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="inline">Free Notifications</span>
              </h2>
            </div>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
  Your ScanBack™ QR code is now active. <br />
  <span className="text-gray-500 text-base">
    If your item is lost, anyone who scans it can contact you instantly.
  </span>
          </p>

          
          {isNewUser && tempPassword ? (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-left shadow-lg">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                Your Login Credentials
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-700 sm:w-24">Email:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-black font-mono bg-gray-100 px-3 py-1 rounded text-sm break-all flex-1">{userEmail}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(userEmail, 'email')}
                      className="h-8 px-2"
                    >
                      {copiedEmail ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-700 sm:w-24">Password:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono bg-gray-100 text-black px-3 py-1 rounded border border-gray-300 text-sm flex-1">{tempPassword}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(tempPassword, 'password')}
                      className="h-8 px-2"
                    >
                      {copiedPassword ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                Check your email for confirmation. Use these credentials to login and manage your items.
              </p>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 text-left shadow-lg">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                Welcome Back!
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-700 sm:w-24">Email:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-black font-mono bg-gray-100 px-3 py-1 rounded text-sm break-all flex-1">{userEmail}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(userEmail, 'email')}
                      className="h-8 px-2"
                    >
                      {copiedEmail ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-gray-700 sm:w-24">Password:</span>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono bg-gray-100 text-black px-3 py-1 rounded border border-gray-300 text-sm flex-1">{existingPassword}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(existingPassword, 'password')}
                      className="h-8 px-2"
                    >
                      {copiedPassword ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 bg-gray-50 p-3 rounded-lg">
                Your new QR code has been added to your existing account. Use these credentials to login and manage all your items.
              </p>
            </div>
          )}

          {/* QR Tag Details */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6 text-left shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                Your QR Tag
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">Tag Code</span>
                    <QrCode className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="font-mono text-lg font-bold text-black bg-gray-100 px-3 py-2 rounded-lg border-2 border-gray-200 block text-center">
                    SB-{code?.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">Type</span>
                    {submittedTagType === 'pet' ? (
                      <Heart className="h-4 w-4 text-orange-500" />
                    ) : submittedTagType === 'emergency' ? (
                      <Stethoscope className="h-4 w-4 text-red-500" />
                    ) : (
                      <Package className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-lg font-bold text-black">
                    {submittedTagType === 'pet' ? 'Pet Tag' : submittedTagType === 'emergency' ? 'Emergency Tag' : 'Item Tag'}
                  </span>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">Name</span>
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="text-lg font-bold text-black">
                    "{formData.details.name}"
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-600">Contact Methods</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <FaPhone className="text-blue-600 text-lg" />
                      <span className="text-sm font-medium text-blue-800">Phone</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-gray-600 text-lg" />
                      <span className="text-sm font-medium text-gray-800">Email</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <FaWhatsapp className="text-green-600 text-lg" />
                      <span className="text-sm font-medium text-green-800">WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                      <FaSms className="text-blue-600 text-lg" />
                      <span className="text-sm font-medium text-blue-800">SMS</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-600">Finder Message</span>
                    <span className="text-xs text-gray-400">Auto-generated</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "{formData.contact.message || `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200">
              <Link href={`/login?email=${encodeURIComponent(userEmail)}${isNewUser && tempPassword ? `&password=${encodeURIComponent(tempPassword)}` : ''}`}>
                Login to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-blue-300 hover:border-blue-500 text-blue-700 hover:text-blue-900 font-semibold px-8 py-3 rounded-lg transition-all duration-200">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If QR code is already activated, show the information display
  if (qrData && qrData.isActivated) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black rounded-lg">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black">ScanBack™</span>
                  <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-300 shadow-lg">
              {qrData.type === 'pet' ? (
                <PawPrint className="h-12 w-12 text-yellow-500" />
              ) : qrData.type === 'emergency' ? (
                <Stethoscope className="h-12 w-12 text-red-600" />
              ) : (
                <Tag className="h-12 w-12 text-blue-600 flex items-center justify-center" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-black mb-3">
              Found {qrData.type === 'pet' ? 'Pet' : qrData.type === 'emergency' ? 'Emergency Contact' : 'Item'}
            </h1>
            <p className="text-gray-700 text-xl">
            {qrData.type === 'emergency' ? 'Emergency contact information found — please contact immediately.' : 'Thanks for scanning — let\'s help return it safely.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Item Details */}
            <div className="space-y-6">
              {/* Item Information Card */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-3 text-xl text-black">
                    {qrData.type === 'pet' ? (
                      <PawPrint className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <Tag className="h-6 w-6 text-blue-600 flex items-center justify-center" />
                    )}
                    {qrData.details.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Item Image removed from finder's page - only shows in pet/item information sections */}
                </CardContent>
                {/* <CardContent className="p-6 space-y-4">
                  {qrData.details.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Description</Label>
                      <p className="text-gray-600 leading-relaxed">{qrData.details.description}</p>
                    </div>
                  )}

                  {qrData.type === 'item' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {qrData.details.category && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Category</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.category}</p>
                        </div>
                      )}
                      {qrData.details.color && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Color</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.color}</p>
                        </div>
                      )}
                      {qrData.details.brand && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Brand</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.brand}</p>
                        </div>
                      )}
                      {qrData.details.model && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Model</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.model}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {qrData.details.species && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Species</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.species}</p>
                        </div>
                      )}
                      {qrData.details.breed && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Breed</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.breed}</p>
                        </div>
                      )}
                      {qrData.details.age && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Age</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.age} years old</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent> */}
              </Card>

              {/* Owner Message Card - Always show if there's a message */}
              {qrData.contact.message && (
                <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-black">
                      <span className="text-2xl">💬</span>
                      Message from Owner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                      "{qrData.contact.message}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Contact Options */}
            <div className="space-y-6">
              {/* Owner Information Card - Only show if contact visibility is enabled */}
              {qrData.settings?.showContactOnFinderPage === true && (
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                  <CardHeader className="bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-xl text-black">
                    <Shield className="h-6 w-6" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Owner Name</Label>
                    <p className="text-black font-bold text-lg">{qrData.contact.name}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Whatsapp Phone Number</Label>
                    <p className="text-black font-bold text-lg">{qrData.contact.phone}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</Label>
                    <p className="text-black font-bold text-lg break-all">{qrData.contact.email}</p>
                  </div>

                  {/* Backup Phone - Only show if useBackupNumber is true and backup phone exists */}
                  {qrData.settings?.useBackupNumber && qrData.contact.backupPhone && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <Label className="text-sm font-semibold text-gray-700 mb-2 block">Backup Phone Number</Label>
                      <p className="text-black font-bold text-lg">{qrData.contact.backupPhone}</p>
                    </div>
                  )}

                  {/* Contact Methods Available */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Available Contact Methods</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                        <FaPhone className="text-blue-600 text-sm" />
                        <span className="text-sm font-medium text-black">Phone</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                        <FaEnvelope className="text-blue-600 text-sm" />
                        <span className="text-sm font-medium text-black">Email</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                        <FaWhatsapp className="text-green-600 text-sm" />
                        <span className="text-sm font-medium text-black">WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                          <FaSms className="text-blue-600 text-sm" />
                        <span className="text-sm font-medium text-black">SMS</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )}


              {/* Pet-specific information display */}
              {qrData.type === 'pet' && (qrData.details.image || qrData.details.medicalNotes || qrData.details.vetName || qrData.details.vetPhone || qrData.details.emergencyContact || qrData.details.breed || qrData.details.age || qrData.details.registrationNumber || qrData.details.breederInfo) && (
                <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-xl text-black">
                      <PawPrint className="h-6 w-6 text-yellow-500" />
                      Pet Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Pet Image */}
                    {qrData.details.image && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Pet Photo</Label>
                        <img 
                          src={qrData.details.image} 
                          alt={qrData.details.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}


                    {/* Emergency Details */}
                    {(qrData.details.medicalNotes || qrData.details.vetName || qrData.details.vetPhone || qrData.details.emergencyContact) && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <Label className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Emergency Information
                        </Label>
                        <div className="space-y-3">
                          {qrData.details.medicalNotes && (
                            <div>
                              <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Medical Notes</Label>
                              <p className="text-red-800 text-sm leading-relaxed mt-1">{qrData.details.medicalNotes}</p>
                            </div>
                          )}
                          {qrData.details.vetName && (
                            <div>
                              <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Veterinarian</Label>
                              <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.vetName}</p>
                            </div>
                          )}
                          {qrData.details.vetPhone && (
                            <div>
                              <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Vet Phone</Label>
                              <p className="text-red-800 text-sm font-medium mt-1">
                                {qrData.details.vetCountryCode && qrData.details.vetPhone ? 
                                  `${qrData.details.vetCountryCode} ${qrData.details.vetPhone}` : 
                                  qrData.details.vetPhone
                                }
                              </p>
                            </div>
                          )}
                          {qrData.details.emergencyContact && (
                            <div>
                              <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Emergency Contact</Label>
                              <p className="text-red-800 text-sm font-medium mt-1">
                                {qrData.details.emergencyCountryCode && qrData.details.emergencyContact ? 
                                  `${qrData.details.emergencyCountryCode} ${qrData.details.emergencyContact}` : 
                                  qrData.details.emergencyContact
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pedigree Information */}
                    {(qrData.details.breed || qrData.details.age || qrData.details.registrationNumber || qrData.details.breederInfo) && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <Label className="text-sm font-semibold text-blue-700 mb-3 block">Pedigree Information</Label>
                        <div className="space-y-3">
                          {qrData.details.breed && (
                            <div>
                              <Label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Breed</Label>
                              <p className="text-blue-800 text-sm font-medium mt-1">{qrData.details.breed}</p>
                            </div>
                          )}
                          {qrData.details.age && (
                            <div>
                              <Label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Age</Label>
                              <p className="text-blue-800 text-sm font-medium mt-1">{qrData.details.age}</p>
                            </div>
                          )}
                          {qrData.details.registrationNumber && (
                            <div>
                              <Label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Registration Number</Label>
                              <p className="text-blue-800 text-sm font-medium mt-1">{qrData.details.registrationNumber}</p>
                            </div>
                          )}
                          {qrData.details.breederInfo && (
                            <div>
                              <Label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Breeder Information</Label>
                              <p className="text-blue-800 text-sm leading-relaxed mt-1">{qrData.details.breederInfo}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Emergency-specific information display */}
              {qrData.type === 'emergency' && (
                <Card className="shadow-xl border-2 border-red-200 rounded-xl bg-white">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-xl text-black">
                      <Stethoscope className="h-6 w-6 text-red-600" />
                      Emergency Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Emergency Contact Photo */}
                    {qrData.details.image && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <Label className="text-sm font-semibold text-red-700 mb-2 block">Emergency Contact Photo</Label>
                        <img 
                          src={qrData.details.image} 
                          alt={qrData.details.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}

                    {/* Medical Information */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <Label className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Medical Information
                      </Label>
                      <div className="space-y-3">
                        {qrData.details.medicalAidProvider && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Medical Aid Provider</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.medicalAidProvider}</p>
                          </div>
                        )}
                        {qrData.details.medicalAidNumber && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Medical Aid Number</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.medicalAidNumber}</p>
                          </div>
                        )}
                        {qrData.details.bloodType && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Blood Type</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.bloodType}</p>
                          </div>
                        )}
                        {qrData.details.allergies && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Allergies / Medical Conditions</Label>
                            <p className="text-red-800 text-sm leading-relaxed mt-1">{qrData.details.allergies}</p>
                          </div>
                        )}
                        {qrData.details.medications && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Medications</Label>
                            <p className="text-red-800 text-sm leading-relaxed mt-1">{qrData.details.medications}</p>
                          </div>
                        )}
                        {qrData.details.organDonor && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Organ Donor</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">Yes - Registered Organ Donor</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <Label className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Emergency Contacts
                      </Label>
                      <div className="space-y-3">
                        {qrData.details.emergencyContact1Name && qrData.details.emergencyContact1Phone && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Emergency Contact 1</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.emergencyContact1Name} - {qrData.details.emergencyContact1Phone}</p>
                          </div>
                        )}
                        {qrData.details.emergencyContact2Name && qrData.details.emergencyContact2Phone && (
                          <div>
                            <Label className="text-xs font-semibold text-red-600 uppercase tracking-wide">Emergency Contact 2</Label>
                            <p className="text-red-800 text-sm font-medium mt-1">{qrData.details.emergencyContact2Name} - {qrData.details.emergencyContact2Phone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ICE Note */}
                    {qrData.details.iceNote && (
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <Label className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          ICE Note / Special Instructions
                        </Label>
                        <p className="text-red-800 text-sm leading-relaxed">{qrData.details.iceNote}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Item-specific information display */}
              {qrData.type === 'item' && (qrData.details.image || qrData.details.category || qrData.details.color || qrData.details.brand || qrData.details.model) && (
                <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                  <CardHeader className="bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-xl text-black">
                      <Tag className="h-6 w-6 text-blue-600" />
                      Item Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Item Image */}
                    {qrData.details.image && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Item Photo</Label>
                        <img 
                          src={qrData.details.image} 
                          alt={qrData.details.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {qrData.details.category && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Category</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.category}</p>
                        </div>
                      )}
                      
                      {qrData.details.color && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Color</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.color}</p>
                        </div>
                      )}
                      
                      {qrData.details.brand && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Brand</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.brand}</p>
                        </div>
                      )}
                      
                      {qrData.details.model && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Model</Label>
                          <p className="text-black font-medium mt-1">{qrData.details.model}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}


              {/* Contact Action Buttons - Always show */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-black">Contact Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold">
                      <a 
                        href={`https://wa.me/${qrData.contact.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                          `Hi ${qrData.contact.name}! I found your ${qrData.type === 'pet' ? 'pet' : qrData.type === 'emergency' ? 'emergency contact' : 'item'} "${qrData.details.name}". Please contact me so we can arrange return.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3"
                      >
                        <FaWhatsapp className="h-5 w-5" />
                        Message on WhatsApp
                      </a>
                    </Button>
                  {/* Primary Contact Methods */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold">
                      <a href={`tel:${qrData.contact.phone}`} className="flex items-center justify-center gap-3">
                        <FaPhone className="h-5 w-5 text-blue-400" />
                        Call Owner
                      </a>
                    </Button>
                    
                    <Button asChild variant="outline" className="border-2 border-gray-300 hover:border-black text-black hover:text-black h-12 text-base font-semibold">
                      <a 
                        href={`mailto:${qrData.contact.email}?subject=${encodeURIComponent(`Found your ${qrData.type === 'pet' ? 'pet' : qrData.type === 'emergency' ? 'emergency contact' : 'item'} - ${qrData.details.name}`)}&body=${encodeURIComponent(`Hi ${qrData.contact.name},\n\nI found your ${qrData.type === 'pet' ? 'pet' : qrData.type === 'emergency' ? 'emergency contact' : 'item'} "${qrData.details.name}". Please contact me so we can arrange return.\n\nBest regards`)}`} 
                        className="flex items-center justify-center gap-3"
                      >
                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                        Email Owner
                      </a>
                    </Button>
                  </div>

                  {/* Messaging Apps */}
                  <div className="space-y-3">
                      <Button asChild variant="outline" className="w-full border-2 border-gray-300 hover:border-black text-black hover:text-black h-12 text-base font-semibold">
                      <a 
                        href={`sms:${qrData.contact.phone}?body=${encodeURIComponent(
                          `Hi ${qrData.contact.name}! I found your ${qrData.type === 'pet' ? 'pet' : qrData.type === 'emergency' ? 'emergency contact' : 'item'} "${qrData.details.name}". Please contact me so we can arrange return.`
                        )}`}
                        className="flex items-center justify-center gap-3"
                      >
                          <FaSms className="h-5 w-5 text-blue-600" />
                        Send SMS
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Thank You Message */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-gray-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">Thank you for your help. Your kindness is truly appreciated.</h3>
                  {/* <p className="text-gray-700">
                    Your kindness in helping return this {qrData.type === 'pet' ? 'pet' : 'item'} to its owner is greatly appreciated.
                  </p> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* <Button variant="ghost" size="sm" asChild className="text-gray-700 hover:text-black transition-colors">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button> */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black">ScanBack™</span>
                <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-300 shadow-lg">
            {getCurrentTagType() === 'pet' ? (
              <PawPrint className="h-10 w-10 text-yellow-500" />
            ) : getCurrentTagType() === 'emergency' ? (
              <Stethoscope className="h-10 w-10 text-red-600" />
            ) : getCurrentTagType() === 'item' ? (
              <Package className="h-10 w-10 text-blue-600" />
            ) : (
              <Tag className="h-10 w-10 text-purple-600 flex items-center justify-center" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-black mb-3">
            {getCurrentTagType() === 'pet' ? 'Activate Your Pet Tag' : 
             getCurrentTagType() === 'emergency' ? 'Activate Your Emergency Tag' : 
             getCurrentTagType() === 'item' ? 'Activate Your Item Tag' : 
             'Activate Your Tag'}
          </h1>
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mx-auto max-w-md">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
                <span className="inline">No App</span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="inline">No Subscription</span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="inline">Free Notifications</span>
              </h2>
            </div>
          </div>
          <p className="text-gray-700 text-lg">
          Get started in seconds — just enter a few quick details to activate your tag.
          </p>
        </div>

        <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tag Type Selection - Only for "any" type QR codes */}
              {qrData?.type === 'any' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tagType">Tag Type *</Label>
                    <Select value={selectedTagType} onValueChange={(value: 'item' | 'pet' | 'emergency') => setSelectedTagType(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select tag type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item">📱 Item</SelectItem>
                        <SelectItem value="pet">🐕 Pet</SelectItem>
                        <SelectItem value="emergency">🚨 Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contact.name}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <PhoneInput
                        value={formData.contact.phone}
                  onChange={(value) => handleInputChange('contact.phone', value)}
                  onCountryChange={(countryCode) => handleInputChange('contact.countryCode', countryCode)}
                  onErrorChange={(error) => setPhoneErrors(prev => ({ ...prev, main: error }))}
                  countryCode={formData.contact.countryCode}
                  label="Whatsapp Phone Number"
                        required
                  error={phoneErrors.main}
                  id="phone"
                />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="backupPhone">Backup Phone Number</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Make sure the person listed has agreed to be contacted in case your item is found.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <PhoneInput
                    value={formData.contact.backupPhone}
                    onChange={(value) => handleInputChange('contact.backupPhone', value)}
                    onCountryChange={(countryCode) => handleInputChange('contact.backupCountryCode', countryCode)}
                    onErrorChange={(error) => setPhoneErrors(prev => ({ ...prev, backup: error }))}
                    countryCode={formData.contact.backupCountryCode}
                    placeholder="e.g. 083 123 4567 – must have owner's permission"
                    error={phoneErrors.backup}
                    id="backupPhone"
                  />
                  
                  {/* Backup Number Consent Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-3">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-black">Use backup number if I can't be reached</Label>
                      <p className="text-xs text-gray-600 mt-1">
                        {formData.contact.backupPhone.trim() ? 
                          "If unchecked, backup number won't appear on the public scan page" : 
                          "Enter a backup phone number above to enable this option"
                        }
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('settings.useBackupNumber', !formData.settings.useBackupNumber)}
                        disabled={!formData.contact.backupPhone.trim()}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          formData.contact.backupPhone.trim() 
                            ? (formData.settings.useBackupNumber ? 'bg-blue-600' : 'bg-gray-300')
                            : 'bg-gray-200 cursor-not-allowed'
                        }`}
                        aria-pressed={formData.settings.useBackupNumber}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.settings.useBackupNumber && formData.contact.backupPhone.trim() ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className={`mt-1 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>

              {/* Item/Pet Name */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{getCurrentTagType() === 'pet' ? 'Pet Name' : getCurrentTagType() === 'emergency' ? 'Emergency Contact Name' : 'Item Name'} *</Label>
                  <Input
                    id="name"
                    value={formData.details.name}
                    onChange={(e) => handleInputChange('details.name', e.target.value)}
                    placeholder={`Enter your ${getCurrentTagType() === 'pet' ? 'pet' : getCurrentTagType() === 'emergency' ? 'emergency contact' : 'item'} name`}
                    required
                    className="mt-1"
                  />
              </div>

              {/* Item Image Upload - Only for Item Tags */}
              {getCurrentTagType() === 'item' && (
                <div className="space-y-4">
                  <div>
                    <Label>Item Photo (Optional)</Label>
                    <div className="mt-2">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        onClick={triggerImageUpload}
                      >
                        <input
                          id="item-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        {itemImage ? (
                          <div className="space-y-3">
                            <img 
                              src={itemImage} 
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
              {getCurrentTagType() === 'pet' && (
                <div className="space-y-4">
                  <div>
                    <Label>Pet Photo (Optional)</Label>
                    <div className="mt-2">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        onClick={triggerPetImageUpload}
                      >
                        <input
                          id="pet-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePetImageUpload}
                          className="hidden"
                        />
                        {petImage ? (
                          <div className="space-y-3">
                            <img 
                              src={petImage} 
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
              {qrData?.type === 'pet' && (
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
                          <Label htmlFor="medicalNotes">Medical Notes (Optional)</Label>
                        <Textarea
                            id="medicalNotes"
                            value={formData.details.medicalNotes || ""}
                            onChange={(e) => handleInputChange('details.medicalNotes', e.target.value)}
                            placeholder="Any medical conditions, medications, or special care instructions"
                          rows={3}
                          className="mt-1"
                        />
                        </div>
                        
                        <div>
                          <Label htmlFor="vetName">Veterinarian Name (Optional)</Label>
                          <Input
                            id="vetName"
                            value={formData.details.vetName || ""}
                            onChange={(e) => handleInputChange('details.vetName', e.target.value)}
                            placeholder="e.g., Dr. Smith - Happy Paws Clinic"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="vetPhone">Vet Phone Number (Optional)</Label>
                          <PhoneInput
                            value={formData.details.vetPhone || ""}
                            countryCode={formData.details.vetCountryCode || "ZA"}
                            onChange={(value) => handleInputChange('details.vetPhone', value)}
                            onCountryChange={(countryCode) => handleInputChange('details.vetCountryCode', countryCode)}
                            onErrorChange={(error) => setVetPhoneError(error)}
                            error={vetPhoneError}
                            id="vetPhone"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                          <PhoneInput
                            value={formData.details.emergencyContact || ""}
                            countryCode={formData.details.emergencyCountryCode || "ZA"}
                            onChange={(value) => handleInputChange('details.emergencyContact', value)}
                            onCountryChange={(countryCode) => handleInputChange('details.emergencyCountryCode', countryCode)}
                            onErrorChange={(error) => setEmergencyPhoneError(error)}
                            error={emergencyPhoneError}
                            id="emergencyContact"
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
                          <Label htmlFor="breed">Breed</Label>
                          <Input
                            id="breed"
                            value={formData.details.breed || ""}
                            onChange={(e) => handleInputChange('details.breed', e.target.value)}
                            placeholder="e.g., Golden Retriever"
                          className="mt-1"
                        />
                      </div>
                        
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <Input
                            id="color"
                            value={formData.details.color || ""}
                            onChange={(e) => handleInputChange('details.color', e.target.value)}
                            placeholder="e.g., Golden/Cream"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            value={formData.details.age || ""}
                            onChange={(e) => handleInputChange('details.age', e.target.value)}
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
                          <Label htmlFor="registrationNumber">Registration Number (Optional)</Label>
                          <Input
                            id="registrationNumber"
                            value={formData.details.registrationNumber || ""}
                            onChange={(e) => handleInputChange('details.registrationNumber', e.target.value)}
                            placeholder="e.g., AKC #123456789"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="breederInfo">Breeder Information (Optional)</Label>
                          <Input
                            id="breederInfo"
                            value={formData.details.breederInfo || ""}
                            onChange={(e) => handleInputChange('details.breederInfo', e.target.value)}
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
              {getCurrentTagType() === 'emergency' && (
                <div className="space-y-4">
                  <div>
                    <Label>Emergency Contact Photo (Optional)</Label>
                    <div className="mt-2">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                        onClick={triggerEmergencyImageUpload}
                      >
                        <input
                          id="emergency-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleEmergencyImageUpload}
                          className="hidden"
                        />
                        {emergencyImage ? (
                          <div className="space-y-3">
                            <img 
                              src={emergencyImage} 
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
              {getCurrentTagType() === 'emergency' && (
                <div className="space-y-4">

                  {/* Emergency Medical Details Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-black flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-red-600" />
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
                            <Label htmlFor="medicalAidProvider">Medical Aid Provider</Label>
                            <Input
                              id="medicalAidProvider"
                              value={formData.details.medicalAidProvider || ""}
                              onChange={(e) => handleInputChange('details.medicalAidProvider', e.target.value)}
                              placeholder="e.g., Discovery Health"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="medicalAidNumber">Medical Aid Number</Label>
                            <Input
                              id="medicalAidNumber"
                              value={formData.details.medicalAidNumber || ""}
                              onChange={(e) => handleInputChange('details.medicalAidNumber', e.target.value)}
                              placeholder="e.g., 123 456 7890"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bloodType">Blood Type</Label>
                          <Select
                            value={formData.details.bloodType || ""}
                            onValueChange={(value) => handleInputChange('details.bloodType', value)}
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
                          <Label htmlFor="allergies">Allergies / Medical Conditions</Label>
                          <Textarea
                            id="allergies"
                            value={formData.details.allergies || ""}
                            onChange={(e) => handleInputChange('details.allergies', e.target.value)}
                            placeholder="e.g., Penicillin Allergy, Asthma, Epilepsy"
                            rows={3}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="medications">Medications</Label>
                          <Textarea
                            id="medications"
                            value={formData.details.medications || ""}
                            onChange={(e) => handleInputChange('details.medications', e.target.value)}
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
                              onClick={() => handleInputChange('details.organDonor', !formData.details.organDonor)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                formData.details.organDonor ? 'bg-red-600' : 'bg-gray-300'
                              }`}
                              aria-pressed={formData.details.organDonor}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  formData.details.organDonor ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="iceNote">ICE Note / Special Instruction</Label>
                          <Textarea
                            id="iceNote"
                            value={formData.details.iceNote || ""}
                            onChange={(e) => handleInputChange('details.iceNote', e.target.value)}
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Make sure they have agreed to be contacted in case of emergency.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div>
                            <Label htmlFor="emergencyContact1Name">Contact Name</Label>
                            <Input
                              id="emergencyContact1Name"
                              value={formData.details.emergencyContact1Name || ""}
                              onChange={(e) => handleInputChange('details.emergencyContact1Name', e.target.value)}
                              placeholder="e.g., Sarah Khan"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="emergencyContact1Phone">Contact Number</Label>
                            <PhoneInput
                              value={formData.details.emergencyContact1Phone || ""}
                              countryCode={formData.details.emergencyContact1CountryCode || "ZA"}
                              onChange={(value) => handleInputChange('details.emergencyContact1Phone', value)}
                              onCountryChange={(countryCode) => handleInputChange('details.emergencyContact1CountryCode', countryCode)}
                              onErrorChange={(error) => setEmergencyContact1PhoneError(error)}
                              error={emergencyContact1PhoneError}
                              id="emergencyContact1Phone"
                              placeholder="e.g., 083 123 4567"
                            />
                          </div>
                        </div>

                        {/* Emergency Contact 2 */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-black">Emergency Contact 2</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Make sure they have agreed to be contacted in case of emergency.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <div>
                            <Label htmlFor="emergencyContact2Name">Contact Name</Label>
                            <Input
                              id="emergencyContact2Name"
                              value={formData.details.emergencyContact2Name || ""}
                              onChange={(e) => handleInputChange('details.emergencyContact2Name', e.target.value)}
                              placeholder="e.g., John Patel"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="emergencyContact2Phone">Contact Number</Label>
                            <PhoneInput
                              value={formData.details.emergencyContact2Phone || ""}
                              countryCode={formData.details.emergencyContact2CountryCode || "ZA"}
                              onChange={(value) => handleInputChange('details.emergencyContact2Phone', value)}
                              onCountryChange={(countryCode) => handleInputChange('details.emergencyContact2CountryCode', countryCode)}
                              onErrorChange={(error) => setEmergencyContact2PhoneError(error)}
                              error={emergencyContact2PhoneError}
                              id="emergencyContact2Phone"
                              placeholder="e.g., 082 987 6543"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

                <div>
                  <Label htmlFor="message">Finder Message (Auto generated) (Editable)</Label>
                  <Textarea
                    id="message"
                    value={messageClicked ? formData.contact.message : ""}
                    onChange={(e) => handleInputChange('contact.message', e.target.value)}
                    onFocus={() => {
                      if (!messageClicked) {
                        setMessageClicked(true)
                        const defaultMessage = formData.details.name ? 
                          `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` :
                          "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!"
                        handleInputChange('contact.message', defaultMessage)
                      }
                    }}
                    placeholder={formData.details.name ? `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!"}
                    rows={3}
                    className="mt-1"
                  />
            </div>
              </div>

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
                    onClick={() => handleInputChange('settings.instantAlerts', !formData.settings.instantAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.settings.instantAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-pressed={formData.settings.instantAlerts}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.instantAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1 min-w-0">
                    <Label className="text-sm font-medium text-black">Location Sharing</Label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Allow finders to see your approximate location</p>
                  </div>
                  <div className="flex-shrink-0 sm:ml-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.locationSharing', !formData.settings.locationSharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.settings.locationSharing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-pressed={formData.settings.locationSharing}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.locationSharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  </div>
                </div>

                {/* Contact Visibility Toggle - For both Item and Pet Tags */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1 min-w-0">
                    <Label className="text-sm font-medium text-black">Show Owner Information on Finder Page</Label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">Display your contact details when someone finds your {qrData?.type === 'pet' ? 'pet' : 'item'}</p>
                  </div>
                  <div className="flex-shrink-0 sm:ml-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.showContactOnFinderPage', !formData.settings.showContactOnFinderPage)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.settings.showContactOnFinderPage ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    aria-pressed={formData.settings.showContactOnFinderPage}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.settings.showContactOnFinderPage ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
            </div>
              )}

                <Button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  'Activate My Tag'
                )}
                </Button>

                
                  <p className="text-sm text-gray-600 text-center mt-2">
                  Protect what matters to you! Every scan makes a difference.
                  </p>
                

              <p className="text-sm text-gray-600 text-center">
                By activating, you agree to our{' '}
                <button 
                  type="button"
                  onClick={() => setShowTermsPopup(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                >
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button 
                  type="button"
                  onClick={() => setShowPrivacyPopup(true)}
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>
                , and confirm you have consent to provide any backup contact number.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Privacy Popups */}
      <TermsPrivacyPopup 
        isOpen={showTermsPopup} 
        onClose={() => setShowTermsPopup(false)} 
        type="terms" 
      />
      <TermsPrivacyPopup 
        isOpen={showPrivacyPopup} 
        onClose={() => setShowPrivacyPopup(false)} 
        type="privacy" 
      />
    </div>
  )
}