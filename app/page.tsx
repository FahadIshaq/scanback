"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Play,
  QrCode,
  Heart,
  Package,
  Camera,
  Home,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ScanHeader } from "@/components/scan-header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const qrImages = ["/images/q1.png", "/images/q2.png", "/images/q3.png", "/images/q4.png"];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % qrImages.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [qrImages.length]);

  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center pt-12 pb-8">
            {/* Left Column - Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-10 space-y-3">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-black tracking-tight leading-[1.05]">
                  One <span className="font-extrabold">scan</span>
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-black tracking-tight leading-[1.05]">
                  One <span className="font-extrabold">chance</span>
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.05] md:pl-2 pl-1">
                  to get it back&nbsp;!
                </h1>
              </div>
              <div className="border-l-4 border-black-600 pl-6 py-2">
                <p className="text-lg md:text-xl lg:text-2xl text-black leading-relaxed max-w-xl font-normal">
                  Smart QR code stickers and tags that connect finders directly to you via <span className="font-bold">WhatsApp</span>.
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-black leading-relaxed max-w-xl font-normal mt-2">
                  No <span className="font-bold">apps</span>, No <span className="font-bold">subscriptions</span>.
                </p>
              </div>
            </div>

            {/* Right Column - Animated QR Images */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl border border-gray-300/50">
                <div className="relative w-full h-full">
                  {qrImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`QR Code ${index + 1}`}
                        fill
                        className="object-contain drop-shadow-lg"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Video Section - Apple Style */}
      <section className="py-0 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Play className="w-10 h-10 ml-1" />
          </div>
                <h3 className="text-2xl font-light mb-3 text-white/90">
                  See how it works
                </h3>
                <p className="text-lg text-white/70 font-light">
                  Experience the simplicity of ScanBack
                </p>
              </div>
            </div>
            {/* Actual video would go here */}
            <video className="hidden w-full h-full object-cover" controls>
              <source src="/scanback-demo.mp4" type="video/mp4" />
            </video>
          </div>
              </div>
      </section>

 {/* How It Works - Apple Style */}
 <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
Peace of mind made visible in three steps            </h2>
            <p className="text-2xl font-bold text-black">
              Lost something?
            </p>
            <p className="text-xl text-gray-600 font-light">
            ScanBack helps it come home.            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <QrCode className="w-12 h-12 text-black" />,
                title: "Scan",
                description:
                  "Any smartphone camera. No app required. Instant recognition.",
                step: "01",
              },
              {
                icon: <FaWhatsapp className="w-12 h-12" />,
                title: "Connect",
                description:
                  "WhatsApp message sent directly to owner with location details.",
                step: "02",
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Return",
                description:
                  "Your precious item finds its way back home to you.",
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
                <h3 className="text-2xl font-bold text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Key Messages - Apple Style */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-light text-black mb-4">
                Lost something?
              </h3>
              <p className="text-lg text-gray-600 font-light">
                ScanBack helps it come home.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light text-black mb-4">
                Do the right thing.
              </h3>
              <p className="text-lg text-gray-600 font-light">
                Scan to Return.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Product Gallery Collage */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 md:mb-6 tracking-tight">
              Product Gallery
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {/* Large featured image */}
            <div className="col-span-2 md:col-span-2 md:row-span-2 group">
              <div className="relative w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/passport.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            {/* Medium images */}
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/keys.png"
                  alt="Keys with ScanBack"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image1.jpeg"
                  alt="Passport with ScanBack"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image7.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image2.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            {/* Suitcase image */}
            <div className="col-span-2 md:col-span-2 group">
              <div className="relative w-full aspect-[2/1] rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/suitcase.png"
                  alt="Suitcase with ScanBack"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            {/* Additional images */}
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image3.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image4.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image5.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image6.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image8.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                <Image
                  src="/images/image9.jpeg"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Product Showcase - Apple Style */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-black mb-6 tracking-tight">
              Perfect for everything you care about.
            </h2>
            <p className="text-xl text-gray-600 font-light">
              If I loose it, Scanback brings it back !
            </p>
                </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/images/image1.jpeg",
                title: "Packaging",
                description:
                  "Boxes, deliveries, and shipments protected with instant return capability.",
              },
              {
                image: "/images/image8.jpeg",
                title: "Travel gear",
                description:
                  "Luggage, cameras, and equipment protection wherever you go.",
              },
              {
                image: "/images/image6.jpeg",
                title: "Everyday items",
                description:
                  "Keys, wallets, phones. Everything that matters to you.",
              },
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
              </div>
                  <h3 className="text-xl font-medium text-black mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics - Apple Style */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-tight">
              If it gets lost, at least there's a way back.
            </h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                95%
                  </div>
              <div className="text-xl text-gray-300 font-light">
                Items returned
              </div>
            </div>
            <div className="text-center">
  <div className="text-6xl md:text-7xl font-ultralight mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
    <span className="text-6xl md:text-7xl">60</span>
    <span className="text-3xl md:text-4xl align-center">Sec</span>
  </div>

  <div className="text-xl text-gray-300 font-light">
    Average contact time
  </div>
</div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                190+
                </div>
              <div className="text-xl text-gray-300 font-light">
                Countries supported
                  </div>
                </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Apple Style */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-8 tracking-tight">
            Never worry about losing things again.
          </h2>
          <p className="text-xl text-gray-600 font-light mb-0 leading-relaxed">
            Join thousands who've experienced the peace of mind that ScanBack
            provides.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 text-lg flex items-center justify-center">
              Get ScanBack
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="text-blue-600 px-10 py-4 font-medium hover:text-blue-700 transition-colors text-lg">
              Learn more
            </button>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}
