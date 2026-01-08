import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {/* <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-white text-2xl font-bold tracking-wide">
                SB
              </div> */}
              <h1 className="text-4xl md:text-5xl font-light text-black tracking-tight">
                About Us
              </h1>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-light text-black mb-6">
              ScanBack™ — Smart QR Labels and Tags That Bring Things Back
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Every year, millions of phones, wallets, keys, bags, and even pets are lost — most never make it home.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At ScanBack™, we believe that losing something valuable should never mean losing it forever.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              That's why we created a simple, durable, and private way to reconnect people with what matters most — without apps, subscriptions, or complications.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-12">
              Our QR-coded identification stickers and tags instantly link finders and owners in a secure, no-app environment. Whether it's your phone, your luggage, or your pet's collar — ScanBack makes recovery effortless.
            </p>

            <h3 className="text-2xl font-medium text-black mb-6">
              Why ScanBack™ is Different:
            </h3>
            
            <ul className="space-y-4 mb-12">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Embedded Activation</strong> – Each tag is ready to use, no coding or setup stress.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>No App Required</strong> – Finders simply scan with any phone camera.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Private & Secure</strong> – Your personal information stays hidden unless you choose to share it.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Durable Design</strong> – Weather-resistant finishes in matte and Gloss black, white, silver, gold, chrome and holographic designs.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Locally Made</strong> – Built and supported in South Africa, engineered for real-world conditions.</span>
              </li>
            </ul>

            <div className="bg-gray-50 rounded-2xl p-8 mt-12">
              <p className="text-xl font-light text-black text-center">
                Our mission is simple: <strong>peace of mind made visible</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

