"use client"

import { ScanHeader } from "@/components/scan-header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { QrCode, MessageCircle, Heart } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />
      
      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              How It Works
            </h1>
          </div>

          {/* 3 Steps Section */}
          <div className="mb-20">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
                From Lost to Found in 3 Easy Steps
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <QrCode className="w-12 h-12 text-black" />,
                  title: "Tag It",
                  description:
                    "Stick or attach your ScanBack tag to your valuables, pets, or gear.",
                  step: "01",
                },
                {
                  icon: <FaWhatsapp className="w-12 h-12" />,
                  title: "Scan It",
                  description:
                    "If someone finds your item, they simply scan the QR code with their phone — no app needed.",
                  step: "02",
                },
                {
                  icon: <Heart className="w-12 h-12" />,
                  title: "Get It Back",
                  description:
                    "You receive an instant message or alert and can chat directly with the finder.",
                  step: "03",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="text-6xl font-ultralight text-gray-300 mb-8">
                    {feature.step}
                  </div>
                  <div className={`w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 ${
                    index === 0 ? "text-blue-600" : 
                    index === 1 ? "text-green-600" : 
                    "text-red-500"
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-light text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            
          </div>

          {/* Extra Features */}
          <div className="mb-20">
            <h3 className="text-2xl font-medium text-black mb-6">Extra Features:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Embedded Single & Multi-Pack Activation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Emergency Mode – red tag for critical medical or contact info.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Pet Mode – show pet owner contact and health details.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Secure Privacy Layer – you stay anonymous until you choose to respond.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">•</span>
                <span className="text-lg text-gray-700">Built to Last – water- and weather-resistant; ideal for luggage, keys, and outdoor use.</span>
              </li>
            </ul>
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-2xl font-medium text-black mb-8">FAQs – How It Works</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  Do I need an app to use ScanBack?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  No app is required. Anyone can scan with their phone camera.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  What happens after activation?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Your tag is linked to your secure profile. When scanned, the system alerts you immediately.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  Can I use one activation for multiple tags?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes. Our connected packs allow one activation to link multiple tags.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  Are the tags waterproof?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes - All ScanBack stickers are waterproof, UV-resistant for outdoor and long term use, but not dishwasher or microwave-safe — hand-wash only.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  Can I update my info later?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes — log in anytime to your personal dashboard to edit your details and notifications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  What if someone misuses my tag?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Every Scan is Tracked. You can deactivate, reactivate or delete your profile anytime.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-medium">
                  Do you offer keyrings, pet tags and Emergency ID options?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes we offer keychain tags, pet tags, and Emergency Tags with medical info for children, elderly, bikers, or anyone who may need urgent assistance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left font-medium">
                  What is the Emergency Tag?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  The Emergency Tag is a special ScanBack product designed for people - not just belongings. It can store critical medical or contact info, and is ideal for children, adults, elderly, medical patients, or adventure sports.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left font-medium">
                  How does it help in a crisis?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  In an emergency, a responder or passerby can scan the tag and immediately see who to contact or how to help - even if you can't speak for yourself.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left font-medium">
                  Is it different from normal tags?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Yes - Emergency Tags are clearly marked with a red medical icon and can include custom messaging. They are designed for rapid response with emergency contact services call function and high visibility.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

