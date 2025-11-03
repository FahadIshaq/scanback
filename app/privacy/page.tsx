"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Mail, MapPin, Clock, User, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <ScanHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-navy-900/10 text-navy-900 px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ScanBack (Pty) Ltd respects your privacy and is committed to protecting your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <User className="h-5 w-5" />
                  <span>Introduction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
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
                <ul className="text-gray-700 leading-relaxed space-y-2">
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
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect and process personal information to:
                </p>
                <ul className="text-gray-700 leading-relaxed space-y-2">
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
                <ul className="text-gray-700 leading-relaxed space-y-2">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <div className="text-gray-700 leading-relaxed space-y-2">
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
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy may be updated periodically and will be posted on our website with the effective date.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home CTA */}
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xl">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
