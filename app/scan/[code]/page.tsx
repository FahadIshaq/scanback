"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, AlertCircle, Heart, Package, QrCode, Shield, Copy, Check, PawPrint, Luggage } from "lucide-react"
import { FaWhatsapp, FaSms, FaPhone, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { apiClient } from "@/lib/api"

// Phone number validation utilities
const phoneValidationRules = {
  "+27": { // South Africa
    pattern: /^[1-9]\d{8}$/,
    placeholder: "82 123 4567",
    format: (phone: string) => phone.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3"),
    error: "SA numbers start with 1-9, 9 digits total (e.g., 82 123 4567)"
  },
  "+1": { // US/Canada
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    placeholder: "555 123 4567",
    format: (phone: string) => phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"),
    error: "US/CA format: 10 digits, area code 2-9, exchange 2-9"
  },
  "+44": { // UK
    pattern: /^[1-9]\d{8,9}$/,
    placeholder: "20 7946 0958",
    format: (phone: string) => phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3"),
    error: "UK format: 9-10 digits, starts with 1-9"
  },
  "+49": { // Germany
    pattern: /^[1-9]\d{10,11}$/,
    placeholder: "30 12345678",
    format: (phone: string) => phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3"),
    error: "German format: 11-12 digits, starts with 1-9"
  },
  "+33": { // France
    pattern: /^[1-9]\d{8}$/,
    placeholder: "1 23 45 67 89",
    format: (phone: string) => phone.replace(/(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5"),
    error: "French format: 9 digits, starts with 1-9"
  },
  "+86": { // China
    pattern: /^1[3-9]\d{9}$/,
    placeholder: "138 0013 8000",
    format: (phone: string) => phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1 $2 $3"),
    error: "Chinese format: 11 digits, starts with 1, second digit 3-9"
  },
  "+91": { // India
    pattern: /^[6-9]\d{9}$/,
    placeholder: "98765 43210",
    format: (phone: string) => phone.replace(/(\d{5})(\d{5})/, "$1 $2"),
    error: "Indian format: 10 digits, starts with 6-9"
  },
  "+81": { // Japan
    pattern: /^[789]0\d{8}$/,
    placeholder: "90 1234 5678",
    format: (phone: string) => phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3"),
    error: "Japanese format: 11 digits, starts with 7/8/9, second digit 0"
  },
  "+61": { // Australia
    pattern: /^[2-9]\d{8}$/,
    placeholder: "412 345 678",
    format: (phone: string) => phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
    error: "Australian format: 9 digits, starts with 2-9"
  },
  "+55": { // Brazil
    pattern: /^[1-9]\d{10}$/,
    placeholder: "11 99999 9999",
    format: (phone: string) => phone.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2 $3"),
    error: "Brazilian format: 11 digits, starts with 1-9"
  }
}

// Default validation for other countries
const getDefaultValidation = (countryCode: string) => ({
  pattern: /^\d{7,15}$/,
  placeholder: "123 456 7890",
  format: (phone: string) => phone,
  error: "Enter a valid phone number (7-15 digits)"
})

const validatePhoneNumber = (phone: string, countryCode: string) => {
  const cleanPhone = phone.replace(/\D/g, '')
  const rules = phoneValidationRules[countryCode as keyof typeof phoneValidationRules] || getDefaultValidation(countryCode)
  
  return {
    isValid: rules.pattern.test(cleanPhone),
    formatted: rules.format(cleanPhone),
    error: rules.error,
    placeholder: rules.placeholder
  }
}

interface QRData {
    code: string
  type: 'item' | 'pet'
  isActivated: boolean
  details: {
    name: string
    description?: string
    category?: string
    color?: string
    brand?: string
    model?: string
    species?: string
    breed?: string
    age?: string
  }
  contact: {
    name: string
    email: string
    phone: string
    message?: string
  }
  settings?: {
    instantAlerts: boolean
    locationSharing: boolean
  }
  status: string
  createdAt: string
}

// Country codes data - Popular countries first
const countryCodes = [
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+1-268", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+1-242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1-246", country: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+1-767", country: "Dominica", flag: "🇩🇲" },
  { code: "+1-809", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+1-473", country: "Grenada", flag: "🇬🇩" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+1-876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+853", country: "Macao", flag: "🇲🇴" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+590", country: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "+1-869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1-758", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+590", country: "Saint Martin", flag: "🇲🇫" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+1-784", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1-868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
]

export default function ScanPage() {
  const params = useParams()
  const code = params.code as string
  
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tempPassword, setTempPassword] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [existingPassword, setExistingPassword] = useState("")
  const [phoneErrors, setPhoneErrors] = useState({
    main: "",
    backup: ""
  })
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const [formData, setFormData] = useState({
    details: {
      name: "",
      description: "",
      category: "",
      color: "",
      brand: "",
      model: "",
      species: "",
      breed: "",
      age: ""
    },
    contact: {
      name: "",
      email: "",
      phone: "",
      backupPhone: "",
      countryCode: "+27",
      backupCountryCode: "+27",
      message: ""
    },
    settings: {
      instantAlerts: true,
      locationSharing: true
    }
  })

  useEffect(() => {
    if (code) {
      loadQRCode()
    }
  }, [code])

  const loadQRCode = async () => {
    try {
      const response = await apiClient.getQRCode(code)
      if (response.success) {
        setQrData(response.data)
        
        // Track the scan
        try {
          await apiClient.trackScan(code)
        } catch (trackError) {
          // Don't show error for tracking failures, just log it
          console.log('Scan tracking failed:', trackError)
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
      // Handle 403 status for inactive QR codes
      if (error.status === 403 || error.message?.includes('inactive')) {
        setError("This QR code is currently inactive. The owner has temporarily disabled it.")
      } else {
        setError(error.message || "Failed to load QR code")
      }
    } finally {
      setLoading(false)
    }
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

    // Validate phone numbers in real-time
    if (field === 'contact.phone') {
      const validation = validatePhoneNumber(value as string, formData.contact.countryCode)
      setPhoneErrors(prev => ({
        ...prev,
        main: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.backupPhone') {
      const validation = validatePhoneNumber(value as string, formData.contact.backupCountryCode)
      setPhoneErrors(prev => ({
        ...prev,
        backup: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.countryCode') {
      // Re-validate main phone when country changes
      const validation = validatePhoneNumber(formData.contact.phone, value as string)
      setPhoneErrors(prev => ({
        ...prev,
        main: validation.isValid ? "" : validation.error
      }))
    } else if (field === 'contact.backupCountryCode') {
      // Re-validate backup phone when country changes
      const validation = validatePhoneNumber(formData.contact.backupPhone, value as string)
      setPhoneErrors(prev => ({
        ...prev,
        backup: validation.isValid ? "" : validation.error
      }))
    }
  }

  const getPhonePlaceholder = (countryCode: string) => {
    const rules = phoneValidationRules[countryCode as keyof typeof phoneValidationRules] || getDefaultValidation(countryCode)
    return rules.placeholder
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
    
    // Check phone validation
    const mainPhoneValidation = validatePhoneNumber(contact.phone, contact.countryCode)
    const backupPhoneValidation = contact.backupPhone ? 
      validatePhoneNumber(contact.backupPhone, contact.backupCountryCode) : 
      { isValid: true }
    
    return hasRequiredFields && isEmailValid && mainPhoneValidation.isValid && backupPhoneValidation.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Check for phone validation errors before submission
    if (phoneErrors.main || phoneErrors.backup) {
      setError("Please fix phone number validation errors before submitting.")
      setSubmitting(false)
      return
    }

    // Final validation check
    const mainPhoneValidation = validatePhoneNumber(formData.contact.phone, formData.contact.countryCode)
    const backupPhoneValidation = formData.contact.backupPhone ? 
      validatePhoneNumber(formData.contact.backupPhone, formData.contact.backupCountryCode) : 
      { isValid: true, error: "" }

    if (!mainPhoneValidation.isValid || !backupPhoneValidation.isValid) {
      setError("Please enter valid phone numbers before submitting.")
      setSubmitting(false)
      return
    }

    try {
      // Generate auto message if no custom message provided
      const autoMessage = `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!`
      const finalMessage = formData.contact.message?.trim() || autoMessage

      // Combine country code with phone number
      const submissionData = {
        ...formData,
        contact: {
          ...formData.contact,
          phone: `${formData.contact.countryCode}${formData.contact.phone}`,
          backupPhone: formData.contact.backupPhone ? `${formData.contact.backupCountryCode}${formData.contact.backupPhone}` : undefined,
          message: finalMessage
        }
      }

      const response = await apiClient.activateQRCode(code, submissionData)
      
      if (response.success) {
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
                  <span className="font-bold text-black">ScanBack</span>
                  <p className="text-xs text-gray-600">QR Code Service</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-3">QR Code Not Found</h1>
          <p className="text-gray-700 mb-8 text-lg">{error}</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200">
            <Link href="/">Go Home</Link>
          </Button>
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
                  <span className="font-bold text-black">ScanBack</span>
                  <p className="text-xs text-gray-600">QR Code Service</p>
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mx-auto max-w-md">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
                <span className="inline">No App</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="inline">No Subscription</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="inline">Free Notifications</span>
              </h2>
            </div>
          </div>
          <p className="text-gray-700 mb-8 text-lg">
            Your QR tag has been registered and is now active
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
                    {qrData?.type === 'pet' ? (
                      <Heart className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Package className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-lg font-bold text-black">
                    {qrData?.type === 'pet' ? 'Pet Tag' : 'Item Tag'}
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
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <FaSms className="text-purple-600 text-lg" />
                      <span className="text-sm font-medium text-purple-800">SMS</span>
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
            <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-gray-300 hover:border-black hover:text-black font-semibold px-8 py-3 rounded-lg transition-all duration-200">
              <Link href="/login">Go Home</Link>
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
                  <span className="font-bold text-black">ScanBack</span>
                  <p className="text-xs text-gray-600">QR Code Service</p>
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
                <PawPrint className="h-12 w-12 text-black" />
              ) : (
                <Luggage className="h-12 w-12 text-black" />
              )}
            </div>
            <h1 className="text-4xl font-bold text-black mb-3">
              Found {qrData.type === 'pet' ? 'Pet' : 'Item'}
            </h1>
            <p className="text-gray-700 text-xl">
              This {qrData.type === 'pet' ? 'pet' : 'item'} belongs to someone. Help return it!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Item Details */}
            <div className="space-y-6">
              {/* Item Information Card */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                <CardHeader className="bg-gray-50 rounded-t-xl">
                  <CardTitle className="flex items-center gap-3 text-xl text-black">
                    {qrData.type === 'pet' ? (
                      <PawPrint className="h-6 w-6 text-black" />
                    ) : (
                      <Luggage className="h-6 w-6 text-black" />
                    )}
                    {qrData.details.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
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
                </CardContent>
              </Card>

              {/* Owner Message Card */}
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
              {/* Owner Information Card */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                <CardHeader className="bg-gray-50 rounded-t-xl">
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
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</Label>
                    <p className="text-black font-bold text-lg">{qrData.contact.phone}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</Label>
                    <p className="text-black font-bold text-lg break-all">{qrData.contact.email}</p>
                  </div>

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
                        <FaSms className="text-purple-600 text-sm" />
                        <span className="text-sm font-medium text-black">SMS</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Action Buttons */}
              <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-black">Contact Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold">
                      <a 
                        href={`https://wa.me/${qrData.contact.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                          `Hi ${qrData.contact.name}! I found your ${qrData.type === 'pet' ? 'pet' : 'item'} "${qrData.details.name}". ${qrData.contact.message || 'Please let me know how to return it to you. Thank you!'}`
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
                    <Button asChild className="bg-black hover:bg-gray-800 text-white h-12 text-base font-semibold">
                      <a href={`tel:${qrData.contact.phone}`} className="flex items-center justify-center gap-3">
                        <FaPhone className="h-5 w-5 text-blue-400" />
                        Call Owner
                      </a>
                    </Button>
                    
                    <Button asChild variant="outline" className="border-2 border-gray-300 hover:border-black text-black hover:text-black h-12 text-base font-semibold">
                      <a 
                        href={`mailto:${qrData.contact.email}?subject=${encodeURIComponent(`Found your ${qrData.type === 'pet' ? 'pet' : 'item'} - ${qrData.details.name}`)}&body=${encodeURIComponent(`Hi ${qrData.contact.name},\n\nI found your ${qrData.type === 'pet' ? 'pet' : 'item'} "${qrData.details.name}". ${qrData.contact.message || 'Please let me know how to return it to you. Thank you!'}\n\nBest regards`)}`} 
                        className="flex items-center justify-center gap-3"
                      >
                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                        Email Owner
                      </a>
                    </Button>
                  </div>

                  {/* Messaging Apps */}
                  <div className="space-y-3">
                    

                    <Button asChild variant="outline" className="w-full border-2 border-purple-300 hover:border-purple-500 text-purple-700 hover:text-purple-900 h-12 text-base font-semibold">
                      <a 
                        href={`sms:${qrData.contact.phone}?body=${encodeURIComponent(
                          `Hi ${qrData.contact.name}! I found your ${qrData.type === 'pet' ? 'pet' : 'item'} "${qrData.details.name}". ${qrData.contact.message || 'Please let me know how to return it to you. Thank you!'}`
                        )}`}
                        className="flex items-center justify-center gap-3"
                      >
                        <FaSms className="h-5 w-5 text-purple-600" />
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
                    <span className="text-3xl">🙏</span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">Thank You for Your Help!</h3>
                  <p className="text-gray-700">
                    Your kindness in helping return this {qrData.type === 'pet' ? 'pet' : 'item'} to its owner is greatly appreciated.
                  </p>
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
                <span className="font-bold text-black">ScanBack</span>
                <p className="text-xs text-gray-600">QR Code Service</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-300 shadow-lg">
            {qrData?.type === 'pet' ? (
              <PawPrint className="h-10 w-10 text-black" />
            ) : (
              <Luggage className="h-10 w-10 text-black" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-black mb-3">
            Activate Your Tag
          </h1>
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mx-auto max-w-md">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 text-center">
                <span className="inline">No App</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="inline">No Subscription</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="inline">Free Notifications</span>
              </h2>
            </div>
          </div>
          <p className="text-gray-700 text-lg">
            Fill in the details below to activate your QR tag
          </p>
        </div>

        <Card className="shadow-xl border-2 border-gray-200 rounded-xl bg-white">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <Select value={formData.contact.countryCode} onValueChange={(value) => handleInputChange('contact.countryCode', value)}>
                      <SelectTrigger className="w-full sm:w-32">
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
                        id="phone"
                        type="tel"
                        value={formData.contact.phone}
                        onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                        placeholder={getPhonePlaceholder(formData.contact.countryCode)}
                        required
                        className={`flex-1 ${phoneErrors.main ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {phoneErrors.main && (
                        <p className="text-red-500 text-xs mt-1">{phoneErrors.main}</p>
                      )}
                    </div>
                  </div>
                </div>

                  <div>
                  <Label htmlFor="backupPhone">+ Backup Phone Number (Optional)</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <Select value={formData.contact.backupCountryCode} onValueChange={(value) => handleInputChange('contact.backupCountryCode', value)}>
                      <SelectTrigger className="w-full sm:w-32">
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
                        id="backupPhone"
                        type="tel"
                        value={formData.contact.backupPhone}
                        onChange={(e) => handleInputChange('contact.backupPhone', e.target.value)}
                        placeholder={getPhonePlaceholder(formData.contact.backupCountryCode)}
                        className={`flex-1 ${phoneErrors.backup ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      {phoneErrors.backup && (
                        <p className="text-red-500 text-xs mt-1">{phoneErrors.backup}</p>
                      )}
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
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Item/Pet Name */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{qrData?.type === 'pet' ? 'Pet Name' : 'Item Name'} *</Label>
                  <Input
                    id="name"
                    value={formData.details.name}
                    onChange={(e) => handleInputChange('details.name', e.target.value)}
                    placeholder={`Enter your ${qrData?.type === 'pet' ? 'pet' : 'item'} name`}
                    required
                    className="mt-1"
                  />
              </div>

                <div>
                  <Label htmlFor="message">Finder Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.contact.message}
                    onChange={(e) => handleInputChange('contact.message', e.target.value)}
                    placeholder={formData.details.name ? `Hi! Thanks for finding my ${formData.details.name}. Please contact me so we can arrange a return. I really appreciate your honesty and help!` : "Hi! Thanks for finding my item. Please contact me so we can arrange a return. I really appreciate your honesty and help!"}
                    rows={3}
                    className="mt-1"
                  />
            </div>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-black">Instant Alerts</Label>
                    <p className="text-xs text-gray-600 mt-1">Get notified on WhatsApp and Email when someone finds your item</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.instantAlerts', !formData.settings.instantAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                      formData.settings.instantAlerts ? 'bg-black' : 'bg-gray-300'
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-black">Location Sharing</Label>
                    <p className="text-xs text-gray-600 mt-1">Allow finders to see your approximate location</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('settings.locationSharing', !formData.settings.locationSharing)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                      formData.settings.locationSharing ? 'bg-black' : 'bg-gray-300'
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

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
            </div>
              )}

                <Button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Activating...' : 'Activate My Tag'}
                </Button>

                {!isFormValid() && !submitting && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Please fill in all required fields to activate your tag
                  </p>
                )}

              <p className="text-xs text-gray-600 text-center">
                By activating you agree to our{' '}
                <a href="#" className="text-black hover:text-gray-700 hover:underline font-medium">Terms and Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-black hover:text-gray-700 hover:underline font-medium">Privacy Policy</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}