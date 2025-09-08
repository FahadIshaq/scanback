"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (check localStorage, cookies, or API)
    const checkAuth = async () => {
      try {
        // For demo purposes, check localStorage
        const userData = localStorage.getItem("scanback_user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("scanback_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("scanback_user")
  }

  // Test function to simulate login for UI testing
  const testLogin = () => {
    const testUser = {
      id: "test-user-123",
      name: "Test User",
      email: "test@example.com",
      phone: "+27 82 123 4567"
    }
    login(testUser)
  }

  return {
    user,
    loading,
    login,
    logout,
    testLogin,
    isAuthenticated: !!user
  }
}
