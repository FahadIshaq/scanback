import { metadataForPath } from "@/lib/seo"

export const metadata = metadataForPath("/cookies")

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
