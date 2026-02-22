"use client";

import Image from "next/image";
import { ScanHeader } from "@/components/scan-header";
import { Footer } from "@/components/footer";

export default function ProductsPage() {
  const squareProducts = [
    
    {
      image: "/images/sc1.png",
      title: "Premium Black",
      description: "Elegant black finish for a sophisticated look.",
    },
    {
      image: "/images/sc5.PNG",
      title: "Classic White",
      description: "Clean, minimalist design perfect for any surface.",
    },
    {
      image: "/images/sc6.png",
      title: "Luxury Gold",
      description: "Premium gold finish that stands out with style.",
    },
    {
      image: "/images/sc2.png",
      title: "Brush Gold",
      description: "Textured brushed gold with a distinctive metallic sheen.",
    },
    {
      image: "/images/sc7.png",
      title: "Brush Silver",
      description: "Elegant brushed silver with a refined modern finish.",
    },
    {
      image: "/images/sc4.png",
      title: "Hollographic Silver",
      description: "Eye-catching holographic effect that shimmers in the light.",
    },
    {
      image: "/images/sc3.png",
      title: "Grey",
      description: "Subtle neutral grey that blends seamlessly with any item.",
    },
    {
      image: "/images/sc8.png",
      title: "Emergency",
      description: "Bold emergency design for critical situations and quick identification.",
    },
  ];

  const roundProducts = [
  
    {
      image: "/images/rounded9-9-9.png",
      title: "Premium Black",
      description: "Elegant black finish for a sophisticated look.",
    },
      {
      image: "/images/rounded1-1-1.png",
      title: "Classic White",
      description: "Clean, minimalist design perfect for any surface.",
    },
    {
      image: "/images/rounded3-3-3.png",
      title: "Luxury Gold",
      description: "Premium gold finish that stands out with style.",
    },
    {
      image: "/images/rounded11-11-11.png",
      title: "Brush Gold",
      description: "Textured brushed gold with a distinctive metallic sheen.",
    },
    {
      image: "/images/rounded12-12-12.png",
      title: "Brush Silver",
      description: "Elegant brushed silver with a refined modern finish.",
    },
    {
      image: "/images/rounded10-10-10.png",
      title: "Hollographic Silver",
      description: "Eye-catching holographic effect that shimmers in the light.",
    },
    {
      image: "/images/rounded8-8-8.png",
      title: "Grey",
      description: "Subtle neutral grey that blends seamlessly with any item.",
    },
    {
      image: "/images/rounded7-7-7.png",
      title: "Emergency",
      description: "Bold emergency design for critical situations and quick identification.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ScanHeader />

      <section className="py-24 bg-white pt-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
              Square QR Stickers
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Premium square QR stickers designed for durability and style.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {squareProducts.map((product, index) => (
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

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
              Round QR Stickers
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Premium round QR stickers designed for a sleek, modern look.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roundProducts.map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-gray-200">
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
