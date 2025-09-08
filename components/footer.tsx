"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function Footer() {
  const { isAuthenticated } = useAuth()

  return (
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
  )
}
