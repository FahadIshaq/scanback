import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/legal")

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children
}
