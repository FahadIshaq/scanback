"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  QrCode,
  Heart,
  Camera,
  Home,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import AutoPlayVideo from "@/components/auto-play-video";
import { ScanHeader } from "@/components/scan-header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSquareIndex, setCurrentSquareIndex] = useState(0);
  const [galleryImagesLoaded, setGalleryImagesLoaded] = useState<Set<number>>(new Set());
  const [showcaseImagesLoaded, setShowcaseImagesLoaded] = useState<Set<number>>(new Set());

  const squareImages = [
    "/images/sc1.png",
    "/images/sc2.png",
    "/images/sc3.png",
    "/images/sc4.png",
    "/images/sc5.PNG",
    "/images/sc6.png",
    "/images/sc7.png",
    "/images/sc8.png",
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSquareIndex((prevIndex) => (prevIndex + 1) % squareImages.length);
    }, 2000); // Change square image every 2 seconds

    return () => clearInterval(interval);
  }, [squareImages.length]);

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
                  to get it back!
                </h1>
              </div>
              <div className="border-l-4 border-black-600 pl-6 py-2">
                <p className="text-lg md:text-xl lg:text-2xl text-black leading-relaxed max-w-xl font-normal">
                  Smart QR code labels and tags that connect finders directly to you via <span className="font-bold">WhatsApp</span>.
                </p>
                <p className="text-lg md:text-xl lg:text-2xl text-black leading-relaxed max-w-xl font-normal mt-2">
                  No <span className="font-bold">apps,</span> No <span className="font-bold">subscriptions</span>.
                </p>
              </div>
            </div>

            {/* Right Column - Square Images */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[240px] md:max-w-[300px] mx-auto">
                <div className="relative w-full aspect-square">
                  <div className="relative w-full h-full">
                    {squareImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentSquareIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Square QR Code ${index + 1}`}
                          fill
                          className="object-contain"
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
        </div>
      </section>

      {/* Hero Video Section - Apple Style */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <AutoPlayVideo />
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
                  "WhatsApp message sent directly to owner with contact options.",
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
                {!galleryImagesLoaded.has(0) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/passport1.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(0))}
                />
              </div>
            </div>
            
            {/* Medium images */}
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(1) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/key.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(1))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(2) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/whitecolor.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(2))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(3) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr4-1.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(3))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(4) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr5-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(4))}
                />
              </div>
            </div>
            
            {/* Wide image */}
            <div className="col-span-2 md:col-span-2 group">
              <div className="relative w-full aspect-[2/1] rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(5) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr6-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(5))}
                />
              </div>
            </div>
            
            {/* Additional images */}
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(6) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr7-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(6))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(7) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr8-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(7))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(8) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr9-3.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(8))}
                />
              </div>
            </div>
            
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(9) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr10-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(9))}
                />
              </div>
            </div>
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(10) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr9-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(10))}
                />
              </div>
            </div>
            <div className="group">
              <div className="relative w-full aspect-square rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300">
                {!galleryImagesLoaded.has(11) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <Image
                  src="/images/qr12-2.png"
                  alt="ScanBack Product"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  onLoadingComplete={() => setGalleryImagesLoaded(prev => new Set(prev).add(11))}
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
                image: "/images/pack-1.png",
                title: "Packaging",
                description:
                  "Boxes, deliveries, and shipments protected with instant return capability.",
              },
              {
                image: "/images/qr4-1.png",
                title: "Travel gear",
                description:
                  "Luggage, cameras, and equipment protection wherever you go.",
              },
              {
                image: "/images/airpods-1.png",
                title: "Everyday items",
                description:
                  "Keys, wallets, phones. Everything that matters to you.",
              },
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden">
                    {!showcaseImagesLoaded.has(index) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onLoadingComplete={() => setShowcaseImagesLoaded(prev => new Set(prev).add(index))}
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
              <div className="text-2xl md:text-3xl font-light text-white mb-4">
                Designed to work worldwide
              </div>
              <div className="text-lg text-gray-400 font-light">
                Seamlessly operating over 190+ countries
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-white mb-4">
                Built for instant connection
              </div>
              <div className="text-lg text-gray-400 font-light">
                Simple scan, immediate contact
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-light text-white mb-4">
                Works anywhere with a smartphone
              </div>
              <div className="text-lg text-gray-400 font-light">
                No apps or subscriptions needed
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
