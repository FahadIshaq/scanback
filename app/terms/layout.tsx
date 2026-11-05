import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/terms")

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
