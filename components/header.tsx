"use client"

import { User, Settings, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRLogo } from "@/components/qr-logo"
import { useAuth } from "@/hooks/use-auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()

  const firstName = (user?.name || "").trim().split(" ")[0] || user?.name || ""
  const onDashboard = pathname?.startsWith("/dashboard")
  const isAuthenticated = !!user

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <QRLogo />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                {isAuthenticated ? (
                  onDashboard ? (
                    <div className="flex items-center gap-2">
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
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
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
                  )
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-navy-900">
                      <Link href="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
