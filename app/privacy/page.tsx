import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 font-light">
              ScanBack (Pty) Ltd respects your privacy and is committed to protecting your personal information.
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">Introduction</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                ScanBack (Pty) Ltd ("ScanBack", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">1. Information We Collect</h2>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• Contact details (name, phone number, email) provided by users when activating tags.</li>
                <li>• Device and usage data (log files, IP addresses, browser type) when visiting our website.</li>
              </ul>
            </div>

            {/* Purpose of Collection */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">2. Purpose of Collection</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We collect and process personal information to:
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• Facilitate communication between item finders and owners.</li>
                <li>• Provide support and improve our services.</li>
                <li>• Comply with legal and regulatory requirements.</li>
              </ul>
            </div>

            {/* Legal Basis */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">3. Legal Basis (POPIA & GDPR)</h2>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2">
                <li>• Processing of data is based on user consent, contractual necessity, and legal obligations.</li>
                <li>• Users have the right to access, correct, or delete their personal data.</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">4. Data Sharing</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We do not sell personal data. Limited sharing may occur with service providers strictly for operational purposes.
              </p>
            </div>

            {/* Security */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">5. Security</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We implement reasonable security safeguards to protect personal data from unauthorized access, loss, or misuse.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">6. Data Retention</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Personal data will be retained only for as long as necessary to fulfill the purposes outlined above.
              </p>
            </div>

            {/* User Rights */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">7. User Rights</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You may request access to, correction of, or deletion of your personal data at any time by contacting us.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">8. Contact</h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-2">
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

            {/* Policy Updates */}
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">Policy Updates</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                This Privacy Policy may be updated periodically and will be posted on our website with the effective date.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
