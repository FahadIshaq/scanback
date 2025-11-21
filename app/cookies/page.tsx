import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 font-light">
              This Cookie Policy explains how ScanBack (Pty) Ltd uses cookies and similar technologies on our website.
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* What Are Cookies? */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">What Are Cookies?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </div>

            {/* Types of Cookies We Use */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">1. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Essential Cookies</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Analytics Cookies</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Preference Cookies</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    These cookies remember your choices and preferences, such as language settings and display preferences, to provide a personalized experience.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">2. How We Use Cookies</h2>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• To keep you signed in to your account</li>
                <li>• To remember your preferences and settings</li>
                <li>• To analyze website traffic and usage patterns</li>
                <li>• To improve website performance and functionality</li>
                <li>• To provide personalized content and recommendations</li>
                <li>• To ensure website security and prevent fraud</li>
              </ul>
            </div>

            {/* Third-Party Cookies */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">3. Third-Party Cookies</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We may use third-party services that set their own cookies. These include:
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• <strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                <li>• <strong>Social Media Platforms:</strong> For social sharing and integration features</li>
                <li>• <strong>Payment Processors:</strong> To process secure transactions</li>
                <li>• <strong>Customer Support:</strong> To provide chat and support services</li>
              </ul>
            </div>

            {/* Cookie Duration */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">4. Cookie Duration</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Session Cookies</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    These are temporary cookies that expire when you close your browser.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Persistent Cookies</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    These cookies remain on your device for a set period or until you delete them. They typically last between 30 days to 2 years.
                  </p>
                </div>
              </div>
            </div>

            {/* Managing Your Cookie Preferences */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">5. Managing Your Cookie Preferences</h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  You can control and manage cookies in several ways:
                </p>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Browser Settings</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Cookie Consent</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2 text-lg">Opt-Out Links</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    For third-party cookies, you can often opt out directly through the service provider's website.
                  </p>
                </div>
              </div>
            </div>

            {/* Impact of Disabling Cookies */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">6. Impact of Disabling Cookies</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                If you choose to disable cookies, some features of our website may not work properly:
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• You may need to sign in repeatedly</li>
                <li>• Your preferences and settings may not be saved</li>
                <li>• Some interactive features may not function</li>
                <li>• We may not be able to provide personalized content</li>
              </ul>
            </div>

            {/* Updates to This Policy */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">7. Updates to This Policy</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">8. Contact Us</h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-2">
                <p>If you have any questions about our use of cookies, please contact us:</p>
                <p><strong>ScanBack (Pty) Ltd</strong></p>
                <p>Pretoria, South Africa</p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@scanback.co.za" className="text-blue-600 hover:underline">
                    support@scanback.co.za
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
