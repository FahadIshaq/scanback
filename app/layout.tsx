import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ScanBack™ - Never Lose Your Valuables Again",
  description:
    "Smart QR stickers that connect finders with owners instantly. Protect your pets, keys, phones, and more with ScanBack™.",
  keywords: "QR code, lost items, pet tags, finder service, item recovery",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
