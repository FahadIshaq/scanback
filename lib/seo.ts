import type { Metadata } from "next"

export const SITE_URL = "https://www.scanback.co.za"
export const SITE_NAME = "ScanBack™"

export const DEFAULT_TITLE = "ScanBack™ - Never Lose Your Valuables Again"
export const DEFAULT_DESCRIPTION =
  "Smart QR stickers that connect finders with owners instantly. Protect your pets, keys, phones, and more with ScanBack™."

export const DEFAULT_OG_IMAGE = "/images/sc1.png"

export function absoluteUrl(path = "/") {
  const normalised = path.startsWith("/") ? path : `/${path}`
  return new URL(normalised, SITE_URL).toString()
}

export function metadataForPath(path: string): Metadata {
  const page = INDEXABLE_PAGES.find((entry) => entry.path === path)
  if (!page) {
    throw new Error(`No SEO metadata defined for ${path}`)
  }
  return pageMetadata(page)
}

export function pageMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
}: {
  title: string
  description: string
  path: string
  ogImage?: string
}): Metadata {
  const url = absoluteUrl(path)
  const image = absoluteUrl(ogImage)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_ZA",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const noIndexMetadata: Metadata = {
  title: "ScanBack™",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export const INDEXABLE_PAGES: {
  path: string
  title: string
  description: string
  changeFrequency: "weekly" | "monthly" | "yearly"
  priority: number
}[] = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/about",
    title: "About Us",
    description:
      "Learn about ScanBack™, the South African smart QR tag company helping lost items, pets, and valuables find their way home.",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/how-it-works",
    title: "How It Works",
    description:
      "See how ScanBack™ QR stickers work: scan a tag, notify the owner, and return lost items, pets, or emergency details securely.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/products",
    title: "Products",
    description:
      "Browse ScanBack™ QR stickers and tags in premium black, classic white, and other finishes for keys, bags, phones, and pets.",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/shop",
    title: "Shop",
    description:
      "Shop ScanBack™ smart QR labels and tags. Get notified when new packs launch, or contact us about wholesale and partner orders.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/partners",
    title: "Partners",
    description:
      "Join the ScanBack™ partner network. Retailers, dealers, pet stores, and clinics can offer branded QR tags to their customers.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/contact",
    title: "Contact",
    description:
      "Contact ScanBack™ for support, sales, partnerships, or product questions. We typically respond within one business day.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description:
      "Read how ScanBack™ collects, stores, and protects personal information under POPIA when you activate and use our QR tags.",
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description:
      "ScanBack™ terms of service for using our smart QR tags, website, and related recovery services.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms-of-sale",
    title: "Terms of Sale",
    description:
      "Terms of sale for purchasing ScanBack™ QR labels, tags, and related products in South Africa.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/legal",
    title: "Legal Notice",
    description:
      "Legal notice for ScanBack™ trademarks, product names, and third-party intellectual property.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/cookies",
    title: "Cookie Policy",
    description:
      "How ScanBack™ uses cookies and similar technologies on scanback.co.za, and how you can manage your preferences.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
]
