import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/about")

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
