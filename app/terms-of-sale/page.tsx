import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function TermsOfSalePage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Terms of Sale
            </h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-medium text-black mb-4">1. Products</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our QR stickers and related products are designed for personal use and identification purposes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">2. Pricing & Payment</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                All prices are shown in South African Rand (ZAR). Payment must be made in full before dispatch.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">3. Shipping & Delivery</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Orders are processed within 1–3 working days after payment confirmation. Delivery times may vary based on courier service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">4. Returns & Exchanges</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Due to the personalized nature of activated QR tags, opened or activated products cannot be returned. Faulty or damaged items may be replaced within 7 days of delivery.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">5. Warranty</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                ScanBack™ products are supplied "as is." We cannot guarantee waterproofing or heat resistance beyond manufacturer specifications.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-black mb-4">6. Liability</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We are not responsible for loss of items, misuse of the stickers, or unauthorized scans by third parties.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

