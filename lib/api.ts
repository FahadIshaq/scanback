const API_BASE_URL = 'https://scanback-backend.onrender.com'

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
      
      // For 403 status (inactive QR code), return the data instead of throwing
      if (response.status === 403) {
        return data
      }
      
      throw new Error(data.message || 'API request failed')
    }

    return data
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async forgotPassword(email: string) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async sendPasswordResetOTP(email: string) {
    return this.request('/api/auth/send-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyPasswordResetOTP(email: string, otp: string) {
    return this.request('/api/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    })
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser() {
    return this.request('/api/auth/me')
  }

  async updateProfile(data: { name: string; email: string; phone: string }) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // QR Code endpoints
  async getQRCode(code: string) {
    return this.request(`/api/qr/${code}`)
  }

  // Public method for scanning QR codes (no authentication required)
  async getPublicQRCode(code: string) {
    try {
      // Create an AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const url = `${this.baseURL}/api/qr/${code}`
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      clearTimeout(timeoutId);
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Public QR API Error:', response.status, data)
        throw new Error(data.message || 'Failed to load QR code')
      }
      
      return data
    } catch (error: any) {
      console.error('Get public QR code error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server is taking too long to respond. Please try again.');
      }
      throw error;
    }
  }

  async activateQRCode(code: string, data: any) {
    return this.request(`/api/qr/${code}/activate`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserQRCodes() {
    return this.request('/api/qr/user')
  }

  async updateQRCode(code: string, data: any) {
    return this.request(`/api/qr/${code}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteQRCode(code: string) {
    return this.request(`/api/qr/${code}`, {
      method: 'DELETE',
    })
  }

  async sendUpdateOTP(code: string, newEmail?: string, newPhone?: string) {
    return this.request(`/api/qr/${code}/send-update-otp`, {
      method: 'POST',
      body: JSON.stringify({ newEmail, newPhone }),
    })
  }

  async verifyUpdateOTP(code: string, otp: string, updateData: any) {
    return this.request(`/api/qr/${code}/verify-update-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp, updateData }),
    })
  }

  async toggleQRCodeStatus(code: string) {
    return this.request(`/api/qr/${code}/toggle-status`, {
      method: 'PATCH',
    })
  }

  async trackScan(code: string, location?: string) {
    return this.request(`/api/qr/${code}/track-scan`, {
      method: 'POST',
      body: JSON.stringify({ location }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
