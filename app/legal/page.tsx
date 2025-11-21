import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Legal Notice
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              All product names, trademarks, and logos are the property of their respective owners.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Unauthorized reproduction or imitation of our tags or platform is strictly prohibited.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

