"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Shield, User, AlertTriangle, Scale, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRLogo } from "@/components/qr-logo"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export default function TermsConditionsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QRLogo />
            </div>
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-navy-900">
                          <User className="h-4 w-4 mr-2" />
                          {user?.name || user?.phone}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                          <User className="h-4 w-4 mr-2" />
                          Manage My Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    null
                  )}
                  
                  {!isAuthenticated && (
                    null
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info & Downloads */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    {/* Rounded square background */}
                    <rect x="2" y="2" width="36" height="36" rx="4" fill="#14b8a6" stroke="#0f766e" strokeWidth="1"/>
                    
                    {/* Position detection patterns (corners) - white */}
                    <rect x="6" y="6" width="8" height="8" fill="white"/>
                    <rect x="8" y="8" width="4" height="4" fill="#14b8a6"/>
                    
                    <rect x="26" y="6" width="8" height="8" fill="white"/>
                    <rect x="28" y="8" width="4" height="4" fill="#14b8a6"/>
                    
                    <rect x="6" y="26" width="8" height="8" fill="white"/>
                    <rect x="8" y="28" width="4" height="4" fill="#14b8a6"/>
                    
                    {/* Data modules - white squares and dots */}
                    <rect x="16" y="6" width="2" height="2" fill="white"/>
                    <rect x="20" y="6" width="2" height="2" fill="white"/>
                    <rect x="24" y="6" width="2" height="2" fill="white"/>
                    
                    <rect x="16" y="10" width="2" height="2" fill="white"/>
                    <rect x="20" y="10" width="2" height="2" fill="white"/>
                    <rect x="24" y="10" width="2" height="2" fill="white"/>
                    
                    <rect x="16" y="14" width="2" height="2" fill="white"/>
                    <rect x="20" y="14" width="2" height="2" fill="white"/>
                    <rect x="24" y="14" width="2" height="2" fill="white"/>
                    
                    <rect x="16" y="18" width="2" height="2" fill="white"/>
                    <rect x="20" y="18" width="2" height="2" fill="white"/>
                    <rect x="24" y="18" width="2" height="2" fill="white"/>
                    
                    <rect x="16" y="22" width="2" height="2" fill="white"/>
                    <rect x="20" y="22" width="2" height="2" fill="white"/>
                    <rect x="24" y="22" width="2" height="2" fill="white"/>
                    
                    {/* Right side data modules */}
                    <rect x="26" y="16" width="2" height="2" fill="white"/>
                    <rect x="26" y="20" width="2" height="2" fill="white"/>
                    
                    {/* Bottom side data modules */}
                    <rect x="16" y="26" width="2" height="2" fill="white"/>
                    <rect x="20" y="26" width="2" height="2" fill="white"/>
                    <rect x="24" y="26" width="2" height="2" fill="white"/>
                    
                    {/* Additional data dots for realistic look */}
                    <rect x="30" y="16" width="2" height="2" fill="white"/>
                    <rect x="30" y="20" width="2" height="2" fill="white"/>
                    <rect x="30" y="24" width="2" height="2" fill="white"/>
                    <rect x="30" y="28" width="2" height="2" fill="white"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">ScanBack™</span>
              </div>
              
              {/* Address */}
              <div className="text-gray-300 text-sm space-y-1">
                <p>123 Innovation Street</p>
                <p>Tech District, 12345</p>
                <p>United States</p>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-400 transition-colors text-xl">◎</a>
                <a href="#" className="text-white hover:text-blue-600 transition-colors text-xl">f</a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors text-xl">X</a>
                <a href="#" className="text-white hover:text-pink-400 transition-colors text-xl">♪</a>
                <a href="#" className="text-white hover:text-blue-700 transition-colors text-xl">in</a>
              </div>
              
              {/* Member Badge */}
              <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                scanback-member
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Quick Links</h3>
              <div className="space-y-2 text-gray-300">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">How it works</a>
                <a href="#" className="block hover:text-white transition-colors">ScanBack Pro</a>
                <a href="#" className="block hover:text-white transition-colors">Premium Stickers</a>
                <a href="#" className="block hover:text-white transition-colors">Shop</a>
                <a href="#" className="block hover:text-white transition-colors">Partners</a>
                <a href="#" className="block hover:text-white transition-colors">FAQ</a>
                <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
              </div>
            </div>

            {/* Legal Stuff */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal Stuff</h3>
              <div className="space-y-2 text-gray-300">
                <a href="#" className="block hover:text-white transition-colors">Terms of Sale</a>
                <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
                <a href="#" className="block hover:text-white transition-colors">Legal Notice</a>
                <a href="#" className="block hover:text-white transition-colors">Cookie Policy</a>
              </div>
              
              {/* Disclaimer */}
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400 text-lg">▲</span>
                  <p className="text-xs text-yellow-200">
                    ScanBack doesn't offer a guarantee to recover your items in case of loss; 
                    ScanBack assumes no responsibility or liability for any of your items loss 
                    neither their recovery. Please read our terms & privacy policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Signup */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Stick with us</h3>
              <p className="text-gray-300 text-sm">
                Get 15% off when you sign up with your email address. Receive news and updates.
              </p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                />
                <button className="w-full bg-white text-navy-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Sign Up
                </button>
              </div>
              
              <p className="text-xs text-gray-400">No spam, just the good stuff</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                Made by ScanBack Technologies. ©2025 All rights reserved. 
                ScanBack™ and the ScanBack logo are trademarks of ScanBack Technologies. 
                "QR Code" is a registered trademark of Denso Wave Incorporated.
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cookie Preferences
                </a>
                {isAuthenticated && (
                  <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Manage My Tag
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
