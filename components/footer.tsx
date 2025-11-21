"use client"

import Link from "next/link"
import { QrCode } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Footer() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  return (
    <footer className="bg-black text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info & Downloads */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-gray-200 rounded-lg">
                <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-black" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-white">ScanBack™</span>
                <p className="text-xs text-gray-400">Smart Lost & Found QR Stickers and Tags</p>
              </div>
            </Link>
            
            {/* Address */}
            <div className="text-gray-300 text-sm space-y-1">
              <p>249 Lizjohn Street</p>
              <p>Lynnwood Ridge </p>
               <p>Pretoria </p>

              <p>South Africa</p>
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
              <Link href="/about" className="block hover:text-white transition-colors">About Us</Link>
              <Link href="/how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
              <Link href="/shop" className="block hover:text-white transition-colors">Shop</Link>
              <Link href="/partners" className="block hover:text-white transition-colors">Partners</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Legal Stuff */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Legal Stuff</h3>
            <div className="space-y-2 text-gray-300">
              <Link href="/terms-of-sale" className="block hover:text-white transition-colors">Terms of Sale</Link>
              <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/legal" className="block hover:text-white transition-colors">Legal Notice</Link>
              <Link href="/cookies" className="block hover:text-white transition-colors">Cookie Policy</Link>
            </div>
            
            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 text-lg">▲</span>
                <p className="text-xs text-yellow-200">
                We help lost things find their way home — recovery cannot be guaranteed.

                </p>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Connected</h3>
            <p className="text-gray-300 text-sm">
              Join the ScanBack™ community for updates, new tag releases, and exclusive offers.
            </p>
            
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="w-full bg-white text-navy-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            
            <p className="text-xs text-gray-400">No spam — just smart ways to protect what matters.</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="text-xs sm:text-sm text-gray-400 flex-1 max-w-3xl leading-relaxed">
              Made by ScanBack Technologies. ©2025 All rights reserved. 
              ScanBack™ and the ScanBack logo are trademarks of ScanBack Technologies (Pty) Ltd.
              "QR Code" is a registered trademark of Denso Wave Incorporated.
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0 w-full md:w-auto justify-start md:justify-end">
              <Link href="/cookies" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Cookie Preferences
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                  Manage My Tag
                </Link>
              )}
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              We help lost things find their way home — recovery cannot be guaranteed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
