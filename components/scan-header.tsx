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
  const firstName = (user?.name || "").trim().split(" ")[0] || user?.name || ""
  const isAuthenticated = !!user

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-black rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-black">ScanBack™</span>
                <p className="text-xs text-gray-600">Smart Lost & Found QR Tag</p>
              </div>
            </Link>
          </div>

          {isAuthenticated && onDashboard && (
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <div className="sm:hidden">
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
              </div>

              {/* Desktop actions */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {firstName}</span>
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
              </div>
            </div>
          )}

          {/* Outside dashboard: show Dashboard button when logged in, or Login when logged out */}
          {!onDashboard && (
            isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Mobile: compact menu with dashboard only */}
                <div className="sm:hidden">
                  <Link href="/dashboard" className="inline-flex items-center justify-center h-8 px-3 rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 text-sm">
                    Dashboard
                  </Link>
                </div>
                {/* Desktop */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
