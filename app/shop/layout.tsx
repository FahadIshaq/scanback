import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/shop")

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
