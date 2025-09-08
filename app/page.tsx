"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Scan, MessageCircle, RotateCcw, Shield, Smartphone, Globe, CheckCircle, Star, Zap, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QRLogo } from "@/components/qr-logo"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"


export default function HomePage() {
  const [demoCode] = useState("demo-pet-001")
  const { user, isAuthenticated, loading, testLogin, logout } = useAuth()

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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center space-x-2 bg-navy-900/10 text-navy-900 px-4 py-2 rounded-full mb-6">
            <Star className="h-4 w-4 fill-navy-900 text-navy-900" />
            <span className="text-sm font-medium">Trusted by 10,000+ users worldwide</span>
        </div>

          <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 leading-tight">
            One scan.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-900 to-blue-600">
              One chance to get it back.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Premium QR stickers that connect finders directly to you via WhatsApp. 
            <span className="font-semibold text-navy-900"> No apps, no subscriptions.</span>
          </p>

          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" asChild className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xl text-lg px-8 py-6">
            <Link href={`/scan/${demoCode}`}>
                <Scan className="mr-2 h-5 w-5" />
              Try Demo Scan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
              className="border-2 border-navy-200 text-navy-800 hover:bg-navy-50 bg-white rounded-xl text-lg px-8 py-6 shadow-lg"
          >
              <Link href="/auth/register">
                <Zap className="mr-2 h-5 w-5" />
                Get Your Stickers
              </Link>
          </Button>
          </div>

          {/* Visual Demo */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-16 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Scan className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Scan</h3>
                <p className="text-gray-600">Any phone camera activates your tag instantly</p>
              </div>
              
              <div className="hidden md:block">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full"></div>
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">Notify</h3>
                <p className="text-gray-600">Instant WhatsApp alerts with location</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stick it, Scan it, Find it */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">How ScanBack Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three simple steps to protect your valuables</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <div className="text-white text-4xl">📱</div>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Stick it</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Place ScanBack stickers on your essentials and most valuable possessions
              </p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <div className="text-white text-4xl">🔍</div>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Scan it</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Anyone who finds your item can scan it and contact you (no app needed)
              </p>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <div className="text-white text-4xl">🎯</div>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Find it</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get a message instantly! Connect with your finder and get it back
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">Getting Started</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Activate your tag in 30 seconds. No app. No subscription.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Scan QR Code</h3>
              <p className="text-gray-600">Use any phone camera to scan your ScanBack sticker</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Add WhatsApp</h3>
              <p className="text-gray-600">Enter your WhatsApp number and custom message</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Tag Active</h3>
              <p className="text-gray-600">Your tag is live and ready to help return your items</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Get Notified</h3>
              <p className="text-gray-600">Instant WhatsApp alert when someone finds your item</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">Our Products</h2>
          <p className="text-xl text-gray-600 mb-12">Discover QR code stickers made to save your life</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Keys */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="text-gray-500 text-lg">
                  <Image src="/images/keys.png" alt="Keys" width={200} height={200} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Keys</h3>
              <p className="text-gray-600">From lost to found, get your keys back to your pocket in minutes.</p>
            </div>

            {/* Passports */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="text-gray-500 text-lg">
                  <Image src="/images/passport.png" alt="Passport" width={200} height={200} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Passports</h3>
              <p className="text-gray-600">Your passport is your freedom. Tag it before you travel and get back if lost.</p>
            </div>

            {/* Suitcases */}
            <div className="text-center group">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="text-gray-500 text-lg">
                  <Image src="/images/suitcase.png" alt="Suitcase" width={200} height={200} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Suitcases</h3>
              <p className="text-gray-600">Label your bags and suitcases in case of travel mishaps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">See It In Action</h2>
          <p className="text-xl text-gray-600 mb-12">Watch how ScanBack works in real life</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
              <div className="text-gray-500 text-lg">Add your video here</div>
            </div>
                  </div>
                </div>
      </section>

      {/* Secure Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image placeholder */}
            <div className="order-2 lg:order-1">
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden">
                <Image 
                  src="/images/main.jpeg" 
                  alt="Secure" 
                  width={600} 
                  height={450} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">Secure</h2>
              <p className="text-xl text-gray-600 mb-8">
                Add your most valuable belongings to your QR code wallet
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">Ideal for:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">📱</span>
                      <span className="text-gray-700">Smartphones</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🛂</span>
                      <span className="text-gray-700">Passports and ID</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔑</span>
                      <span className="text-gray-700">Keychains</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">📟</span>
                      <span className="text-gray-700">Electronics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🚗</span>
                      <span className="text-gray-700">Car Keys</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💳</span>
                      <span className="text-gray-700">Cards</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🕶️</span>
                      <span className="text-gray-700">Glasses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💰</span>
                      <span className="text-gray-700">Wallets</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🧳</span>
                      <span className="text-gray-700">Suitcases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎒</span>
                      <span className="text-gray-700">Bags</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💾</span>
                      <span className="text-gray-700">USB & drives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💻</span>
                      <span className="text-gray-700">Laptops</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🔈</span>
                      <span className="text-gray-700">Bluetooth speakers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎧</span>
                      <span className="text-gray-700">Headphones</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">⚡️</span>
                      <span className="text-gray-700">Chargers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💦</span>
                      <span className="text-gray-700">Water bottles</span>
                    </div>
                  </div>
                </div>
                  </div>
                </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">Product Gallery</h2>
          <p className="text-xl text-gray-600 mb-12">See our QR code stickers in action</p>
          
          {/* First Row - Left to Right Scrolling */}
          <div className="mb-8">
            <div className="flex animate-scroll-left">
              {/* Duplicate images for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, index) => (
                <div key={`row1-${index}`} className="group flex-shrink-0 mx-3">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow w-64 h-64">
                    <Image
                      src={`/images/image${num}.jpeg`}
                      alt="ScanBack QR Code Sticker"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left Scrolling */}
          <div>
            <div className="flex animate-scroll-right">
              {/* Duplicate images for seamless loop */}
              {[7, 8, 9, 10, 11, 12, 7, 8, 9, 10, 11, 12].map((num, index) => (
                <div key={`row2-${index}`} className="group flex-shrink-0 mx-3">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow w-64 h-64">
                    <Image
                      src={`/images/image${num}.jpeg`}
                      alt="ScanBack QR Code Sticker"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">Why Choose ScanBack™</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">Your contact details are never shared publicly</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">No App Required</h3>
              <p className="text-gray-600">Works with any phone camera, no downloads needed</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-3">Works Anywhere</h3>
              <p className="text-gray-600">Global coverage with local WhatsApp integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-12 max-w-4xl mx-auto text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Items?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of users who trust ScanBack™ to keep their valuables safe.</p>
            <Button size="lg" asChild className="bg-white text-navy-900 hover:bg-gray-100 rounded-xl text-lg px-8 py-6 shadow-xl">
              <Link href="/auth/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
              
              {/* App Downloads */}
              {/* <div className="space-y-3">
                <button className="w-full bg-black text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                  <span className="text-xl">🍎</span>
                  <span className="text-sm">Download on the App Store</span>
                </button>
                <button className="w-full bg-black text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
                  <span className="text-xl">▶</span>
                  <span className="text-sm">GET IT ON Google Play</span>
                </button>
              </div> */}
              
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
                <a href="/contact" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            {/* Legal Stuff */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal Stuff</h3>
              <div className="space-y-2 text-gray-300">
                <a href="#" className="block hover:text-white transition-colors">Terms of Sale</a>
                <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-white transition-colors">Privacy</a>
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
