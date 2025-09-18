const API_BASE_URL = 'https://scanback-backend.onrender.com/api'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Get fresh token from localStorage if available
    if (typeof window !== 'undefined') {
      const freshToken = localStorage.getItem('token')
      if (freshToken && freshToken !== this.token) {
        this.token = freshToken
      }
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    console.log('API Request:', url, 'Token:', this.token ? 'Present' : 'Missing')

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      console.error('API Error:', response.status, data)
      if (response.status === 401) {
        // Clear invalid token
        this.clearToken()
      }
      throw new Error(data.message || 'API request failed')
    }

    return data
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // QR Code endpoints
  async getQRCode(code: string) {
    return this.request(`/qr/${code}`)
  }

  async activateQRCode(code: string, data: any) {
    return this.request(`/qr/${code}/activate`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserQRCodes() {
    return this.request('/qr/user')
  }

  async updateQRCode(code: string, data: any) {
    return this.request(`/qr/${code}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteQRCode(code: string) {
    return this.request(`/qr/${code}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
