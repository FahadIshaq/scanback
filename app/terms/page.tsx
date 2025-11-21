import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to ScanBack™ ("we," "us," or "our"). By accessing or using our website or any of our products, you agree to be bound by these Terms of Service. If you do not agree, please do not use ScanBack.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">1. Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                ScanBack provides QR-coded identification stickers and related digital services that help reunite people with their lost or misplaced items.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">2. Use of Service</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                You agree to use ScanBack only for lawful purposes. Misuse of QR codes, data, or the platform for spam or illegal activity is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">3. Accounts & Data</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                When activating a ScanBack tag, you may provide contact details. You are responsible for keeping your information accurate and secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">4. Intellectual Property</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                All content, trademarks, and designs displayed on this site are owned or licensed by ScanBack™ and may not be reproduced without permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">5. Limitation of Liability</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                ScanBack is not liable for any indirect or consequential loss arising from the use or inability to use our stickers, website, or services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">6. Amendments</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We may update these Terms periodically. Continued use constitutes acceptance of any revisions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">7. Contact</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                For questions: <a href="mailto:support@scanback.co.za" className="text-blue-600 hover:underline">support@scanback.co.za</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
