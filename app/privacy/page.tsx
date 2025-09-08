"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Mail, MapPin, Clock, User, Eye, Lock, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QRLogo } from "@/components/qr-logo"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export default function PrivacyPolicyPage() {
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
