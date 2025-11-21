"use client"

import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShoppingBag, Mail } from "lucide-react"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Shop
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Find Your Tag — Choose Your Finish — Stay Connected
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Explore our full range of embedded ScanBack QR tags — designed for every lifestyle.
            </p>

            <h2 className="text-2xl font-medium text-black mb-6">Available Shapes & Sizes:</h2>
            <ul className="space-y-2 mb-8">
              <li className="text-lg text-gray-700">• <strong>Square Tags</strong> – 15 mm, 18 mm, 20 mm, 25 mm, 30 mm, 35 mm, 45 mm</li>
              <li className="text-lg text-gray-700">• <strong>Round Tags</strong> – 15 mm to 45 mm</li>
              <li className="text-lg text-gray-700">• <strong>Special Tags</strong> – Emergency Red, Pet Tags, Corporate Packs</li>
            </ul>

            <h2 className="text-2xl font-medium text-black mb-6">Available Finishes:</h2>
            <p className="text-lg text-gray-700 mb-8">
              Matte Black | Gloss White | Silver | Gold | Chrome (Matt or Gloss)
            </p>

            <h2 className="text-2xl font-medium text-black mb-6">Every Tag Includes:</h2>
            <ul className="space-y-3 mb-12">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Unique QR code linked to your account</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Weather-resistant vinyl construction</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Simple peel-and-stick application</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Optional multi-tag activation</span>
              </li>
            </ul>
          </div>

          {/* Shop FAQs */}
          <div>
            <h3 className="text-2xl font-medium text-black mb-8">FAQs – Shop</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  Can I order just one tag?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes — single units and multi-packs are available.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  Are all tags pre-activated?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  All ScanBack tags are embedded and ready for instant activation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  How long will delivery take?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Typically 5–7 business days locally. Bulk orders may take longer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  Can I customise my tag?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  We offer limited personalisation for corporate or retail orders — contact <a href="mailto:sales@scanback.co.za" className="text-blue-600 hover:underline">sales@scanback.co.za</a>.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  Do you ship internationally?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes — rates are calculated at checkout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  Are there any subscriptions or renewals?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  No. Your ScanBack tag works with a one-time activation only.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Email Signup */}
          <div className="bg-gray-50 rounded-2xl p-8 mt-12 text-center">
            <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-medium text-black mb-4">Stay Connected</h3>
            <p className="text-lg text-gray-700 mb-6">
              Join the ScanBack™ community for updates, new tag releases, and exclusive offers.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                No spam — just smart ways to protect what matters.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

