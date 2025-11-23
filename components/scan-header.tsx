"use client"

import { QrCode, Settings, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export function ScanHeader() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const onDashboard = pathname?.startsWith("/dashboard")
  const isLandingPage = pathname === "/"
  const firstName = (user?.name || "").trim().split(" ")[0] || user?.name || ""
  const isAuthenticated = !!user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black">ScanBack™</span>
                <p className="text-xs text-gray-600">Smart Lost & Found QR Stickers and Tags</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation links */}
            <Link
              href="/about"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/partners"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/shop"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              Shop Info
            </Link>
            <Link
              href="/shop"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              Products
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-800 hover:text-black transition-colors"
            >
              Contact
            </Link>

            {/* Authentication buttons */}
            {isAuthenticated && onDashboard ? (
              <>
                <span className="text-sm text-gray-800">Welcome, {firstName}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : isAuthenticated ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {isAuthenticated && onDashboard ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 p-1">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <span className="flex items-center"><Settings className="h-4 w-4 mr-2" />Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <span className="flex items-center"><LogOut className="h-4 w-4 mr-2" />Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : isAuthenticated ? (
                  <Link href="/dashboard" className="inline-flex items-center justify-center h-8 px-3 rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 text-sm">
                    Dashboard
                  </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1">
                  <DropdownMenuItem asChild>
                    <Link href="/about">About Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/how-it-works">How It Works</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/partners">Partners</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop">Shop Info</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop">Products</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact">Contact</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="text-blue-600 font-medium">Login</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
              </div>
        </div>
      </div>
    </nav>
  )
}
