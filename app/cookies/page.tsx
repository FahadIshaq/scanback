"use client"

import Link from "next/link"
import { ArrowLeft, Cookie, Shield, Settings, Eye, Clock, Database, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <ScanHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-navy-900/10 text-navy-900 px-4 py-2 rounded-full mb-6">
              <Cookie className="h-4 w-4" />
              <span className="text-sm font-medium">Cookie Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This Cookie Policy explains how ScanBack (Pty) Ltd uses cookies and similar technologies on our website.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Cookie Policy Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Cookie className="h-5 w-5" />
                  <span>What Are Cookies?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Database className="h-5 w-5" />
                  <span>1. Types of Cookies We Use</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Essential Cookies</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Analytics Cookies</h4>
                    <p className="text-gray-700 leading-relaxed">
                      We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Preference Cookies</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These cookies remember your choices and preferences, such as language settings and display preferences, to provide a personalized experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Settings className="h-5 w-5" />
                  <span>2. How We Use Cookies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <ul className="text-gray-700 leading-relaxed space-y-2">
                  <li>• To keep you signed in to your account</li>
                  <li>• To remember your preferences and settings</li>
                  <li>• To analyze website traffic and usage patterns</li>
                  <li>• To improve website performance and functionality</li>
                  <li>• To provide personalized content and recommendations</li>
                  <li>• To ensure website security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Eye className="h-5 w-5" />
                  <span>3. Third-Party Cookies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may use third-party services that set their own cookies. These include:
                </p>
                <ul className="text-gray-700 leading-relaxed space-y-2">
                  <li>• <strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                  <li>• <strong>Social Media Platforms:</strong> For social sharing and integration features</li>
                  <li>• <strong>Payment Processors:</strong> To process secure transactions</li>
                  <li>• <strong>Customer Support:</strong> To provide chat and support services</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookie Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Clock className="h-5 w-5" />
                  <span>4. Cookie Duration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-navy-900">Session Cookies</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These are temporary cookies that expire when you close your browser.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900">Persistent Cookies</h4>
                    <p className="text-gray-700 leading-relaxed">
                      These cookies remain on your device for a set period or until you delete them. They typically last between 30 days to 2 years.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Settings className="h-5 w-5" />
                  <span>5. Managing Your Cookie Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    You can control and manage cookies in several ways:
                  </p>
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Browser Settings</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Cookie Consent</h4>
                    <p className="text-gray-700 leading-relaxed">
                      When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 mb-2">Opt-Out Links</h4>
                    <p className="text-gray-700 leading-relaxed">
                      For third-party cookies, you can often opt out directly through the service provider's website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact of Disabling Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <AlertTriangle className="h-5 w-5" />
                  <span>6. Impact of Disabling Cookies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you choose to disable cookies, some features of our website may not work properly:
                </p>
                <ul className="text-gray-700 leading-relaxed space-y-2">
                  <li>• You may need to sign in repeatedly</li>
                  <li>• Your preferences and settings may not be saved</li>
                  <li>• Some interactive features may not function</li>
                  <li>• We may not be able to provide personalized content</li>
                </ul>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Clock className="h-5 w-5" />
                  <span>7. Updates to This Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-navy-900">
                  <Shield className="h-5 w-5" />
                  <span>8. Contact Us</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>If you have any questions about our use of cookies, please contact us:</p>
                  <p><strong>ScanBack (Pty) Ltd</strong></p>
                  <p>Pretoria, South Africa</p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:support@scanback.co.za" className="text-navy-900 hover:underline">
                      support@scanback.co.za
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home CTA */}
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xl">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
