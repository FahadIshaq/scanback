"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Shield, User, AlertTriangle, Scale, Eye, MapPin, Lock, Clock, Mail } from "lucide-react"

interface TermsPrivacyPopupProps {
  isOpen: boolean
  onClose: () => void
  type: 'terms' | 'privacy'
}

export function TermsPrivacyPopup({ isOpen, onClose, type }: TermsPrivacyPopupProps) {
  const isTerms = type === 'terms'

  const termsContent = (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <FileText className="h-5 w-5" />
            <span>Introduction</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            These Terms and Conditions ("Terms") govern your access to and use of ScanBack (Pty) Ltd ("ScanBack", "we", "us", or "our") services, products, and website.
            By using ScanBack, you agree to these Terms. If you do not agree, please do not use our services.
          </p>
        </CardContent>
      </Card>

      {/* Acceptance of Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <User className="h-5 w-5" />
            <span>1. Acceptance of Terms</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            By accessing or using our services, you confirm that you are at least 18 years old and legally capable of entering into these Terms.
          </p>
        </CardContent>
      </Card>

      {/* Services Provided */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Shield className="h-5 w-5" />
            <span>2. Services Provided</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            ScanBack provides QR-based tagging solutions to help individuals and businesses recover lost items. While we facilitate communication between finders and owners, ScanBack is not responsible for the actual recovery of items.
          </p>
        </CardContent>
      </Card>

      {/* Liability Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <AlertTriangle className="h-5 w-5" />
            <span>3. Liability Disclaimer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            ScanBack does not guarantee that lost items will be recovered. We are not liable for damages, losses, or costs arising from use or misuse of our services, except where liability cannot be excluded under South African law.
          </p>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <User className="h-5 w-5" />
            <span>4. User Responsibilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            You agree to provide accurate information when registering and to keep your contact details up to date. You must not misuse ScanBack services for illegal, fraudulent, or harmful purposes.
          </p>
        </CardContent>
      </Card>

      {/* Privacy & Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Shield className="h-5 w-5" />
            <span>5. Privacy & Data Protection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            We comply with the Protection of Personal Information Act (POPIA) of South Africa and the General Data Protection Regulation (GDPR) of the EU. For details, refer to our Privacy Policy.
          </p>
        </CardContent>
      </Card>

      {/* Amendments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <FileText className="h-5 w-5" />
            <span>6. Amendments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            ScanBack reserves the right to update these Terms at any time. Updates will be effective once posted on our website.
          </p>
        </CardContent>
      </Card>

      {/* Governing Law */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Scale className="h-5 w-5" />
            <span>7. Governing Law</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            These Terms are governed by the laws of South Africa.
          </p>
        </CardContent>
      </Card>
    </div>
  )

  const privacyContent = (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <User className="h-5 w-5" />
            <span>Introduction</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            ScanBack (Pty) Ltd ("ScanBack", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
        </CardContent>
      </Card>

      {/* Information We Collect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Eye className="h-5 w-5" />
            <span>1. Information We Collect</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <ul className="text-gray-700 leading-relaxed space-y-2 text-sm">
            <li>• Contact details (name, phone number, email) provided by users when activating tags.</li>
            <li>• Device and usage data (log files, IP addresses, browser type) when visiting our website.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Purpose of Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <MapPin className="h-5 w-5" />
            <span>2. Purpose of Collection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm mb-4">
            We collect and process personal information to:
          </p>
          <ul className="text-gray-700 leading-relaxed space-y-2 text-sm">
            <li>• Facilitate communication between item finders and owners.</li>
            <li>• Provide support and improve our services.</li>
            <li>• Comply with legal and regulatory requirements.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Legal Basis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Shield className="h-5 w-5" />
            <span>3. Legal Basis (POPIA & GDPR)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <ul className="text-gray-700 leading-relaxed space-y-2 text-sm">
            <li>• Processing of data is based on user consent, contractual necessity, and legal obligations.</li>
            <li>• Users have the right to access, correct, or delete their personal data.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Lock className="h-5 w-5" />
            <span>4. Data Sharing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            We do not sell personal data. Limited sharing may occur with service providers strictly for operational purposes.
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Shield className="h-5 w-5" />
            <span>5. Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            We implement reasonable security safeguards to protect personal data from unauthorized access, loss, or misuse.
          </p>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Clock className="h-5 w-5" />
            <span>6. Data Retention</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            Personal data will be retained only for as long as necessary to fulfill the purposes outlined above.
          </p>
        </CardContent>
      </Card>

      {/* User Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <User className="h-5 w-5" />
            <span>7. User Rights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            You may request access to, correction of, or deletion of your personal data at any time by contacting us.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Mail className="h-5 w-5" />
            <span>8. Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <div className="text-gray-700 leading-relaxed space-y-2 text-sm">
            <p><strong>ScanBack (Pty) Ltd</strong></p>
            <p>Pretoria, South Africa</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@scanback.co.za" className="text-navy-900 hover:underline">
                support@scanback.co.za
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-navy-900">
            <Clock className="h-5 w-5" />
            <span>Policy Updates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed text-sm">
            This Privacy Policy may be updated periodically and will be posted on our website with the effective date.
          </p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2 text-2xl text-navy-900">
            {isTerms ? (
              <>
                <FileText className="h-6 w-6" />
                <span>Terms & Conditions</span>
              </>
            ) : (
              <>
                <Shield className="h-6 w-6" />
                <span>Privacy Policy</span>
              </>
            )}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: January 2025
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {isTerms ? termsContent : privacyContent}
        </div>

        <div className="flex-shrink-0 flex justify-end mt-6 pt-4 border-t">
          <Button onClick={onClose} className="bg-navy-900 hover:bg-navy-800 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
