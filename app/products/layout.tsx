import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/products")

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
