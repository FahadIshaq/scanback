"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Shield, User, AlertTriangle, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsConditionsPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-navy-900/10 text-navy-900 px-4 py-2 rounded-full mb-6">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Terms & Conditions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These Terms and Conditions govern your access to and use of ScanBack services, products, and website.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <FileText className="h-5 w-5" />
                  <span>Introduction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
                  We comply with the Protection of Personal Information Act (POPIA) of South Africa and the General Data Protection Regulation (GDPR) of the EU. For details, refer to our{" "}
                  <Link href="/privacy" className="text-navy-900 hover:underline">
                    Privacy Policy
                  </Link>.
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
                <p className="text-gray-700 leading-relaxed">
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
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by the laws of South Africa.
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
