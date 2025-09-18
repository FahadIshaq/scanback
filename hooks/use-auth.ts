"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isEmailVerified: boolean
  stats: {
    totalItems: number
    totalPets: number
    itemsFound: number
    petsFound: number
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      console.log('Checking auth with token:', token ? 'Present' : 'Missing')
      if (token) {
        apiClient.setToken(token)
        const response = await apiClient.getCurrentUser()
        console.log('Auth check response:', response)
        if (response.success) {
          setUser(response.data.user)
        } else {
          console.log('Auth check failed, clearing token')
          apiClient.clearToken()
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      apiClient.clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      if (response.success) {
        apiClient.setToken(response.data.token)
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
  }

  return {
    user,
    loading,
    login,
    logout,
    checkAuth
  }
}