"use client";

import Image from "next/image";
import { ScanHeader } from "@/components/scan-header";
import { Footer } from "@/components/footer";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      {/* Our Products */}
      <section className="py-24 bg-white pt-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {/* <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-white text-2xl font-bold tracking-wide">
                SB
              </div> */}
              <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight">
                Our Products
              </h2>
            </div>
            <p className="text-xl text-gray-600 font-light">
              Premium QR stickers designed for durability and style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/images/sc5.png",
                title: "Classic White",
                description: "Clean, minimalist design perfect for any surface.",
              },
              {
                image: "/images/sc1.png",
                title: "Premium Black",
                description: "Elegant black finish for a sophisticated look.",
              },
              {
                image: "/images/sc6.png",
                title: "Luxury Gold",
                description: "Premium gold finish that stands out with style.",
              },
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-square bg-white rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-gray-200">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-black mb-3">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

