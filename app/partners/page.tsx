import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail } from "lucide-react"

export default function PartnersPage() {
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
                Partners
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-light">
              Join the ScanBack Partner Network
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              ScanBack™ is expanding across South Africa — from retail groups, cellphone shops to pet stores, clinics and travel retailers. We collaborate with trusted partners who want to offer customers real-world peace of mind.
            </p>

            <h2 className="text-2xl font-medium text-black mb-6">Partner Benefits:</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Boost Customer Trust</strong> — Offer a smart add-on that brings tangible safety value.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Add Revenue</strong> — Sell ScanBack tags, packs, and custom-branded solutions.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>White-Label Options</strong> — Your brand face, powered by ScanBack technology.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Retail Support</strong> — We provide packaging, displays, and QR activation materials.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700"><strong>Dashboard Access</strong> — Track activations, scans, and returns for your branch or group.</span>
              </li>
            </ul>
          </div>

          {/* Partner FAQs */}
          <div>
            <h3 className="text-2xl font-medium text-black mb-8">Partner FAQs</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  Who can become a partner?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Retailers, vet clinics, travel brands, courier companies, and promotional clients.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Can I co-brand ScanBack tags?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes — we support full co-branding while keeping core ScanBack identity intact.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Do you offer bulk pricing?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes — volume discounts for retail chains, groups, and corporate clients.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  How do I get started?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Contact us at <a href="mailto:partners@scanback.co.za" className="text-blue-600 hover:underline">partners@scanback.co.za</a> to discuss quantities, displays, and digital integration.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mt-12 text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-medium text-black mb-4">Ready to Partner?</h3>
            <p className="text-lg text-gray-700 mb-6">
              Get in touch to discuss partnership opportunities
            </p>
            <a
              href="mailto:partners@scanback.co.za"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Contact Partners Team
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

