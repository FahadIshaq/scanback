"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff, Key } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error) {
      setError("Failed to login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    setForgotPasswordMessage("")

    try {
      const response = await fetch('http://192.168.0.104:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      })

      const data = await response.json()
      
      if (data.success) {
        setForgotPasswordMessage("If an account with that email exists, a password reset link has been sent.")
        setForgotPasswordEmail("")
      } else {
        setForgotPasswordMessage(data.message || "Failed to send reset email")
      }
    } catch (error) {
      setForgotPasswordMessage("Failed to send reset email. Please try again.")
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <p className="text-gray-600">Enter your email to receive a password reset link</p>
          </CardHeader>
          <CardContent>
            {forgotPasswordMessage && (
              <div className={`p-4 rounded-lg mb-4 ${
                forgotPasswordMessage.includes('sent') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {forgotPasswordMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgotEmail">Email Address *</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={forgotPasswordLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <Button 
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">S</span>
          </div>
          <CardTitle className="text-2xl">Login to Dashboard</CardTitle>
          <p className="text-gray-600">Access your QR code management dashboard</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
